import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { containsInappropriateContent, validateUserName } from "@/lib/moderation"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { data: comments, error } = await supabase
      .from("event_comments")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) throw error

    // Agrupar comentários por evento
    const commentsByEvent: Record<
      number,
      Array<{
        id: string
        author: string
        content: string
        createdAt: string
      }>
    > = {}

    comments?.forEach((comment) => {
      if (!commentsByEvent[comment.event_id]) {
        commentsByEvent[comment.event_id] = []
      }
      commentsByEvent[comment.event_id].push({
        id: comment.id,
        author: comment.author_name,
        content: comment.content,
        createdAt: comment.created_at,
      })
    })

    return NextResponse.json({ comments: commentsByEvent })
  } catch (error) {
    console.error("Error fetching event comments:", error)
    return NextResponse.json({ comments: {} })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { eventId, sessionId, authorName, content } = await request.json()

    if (!authorName || !content) {
      return NextResponse.json({ error: "Nome e comentário são obrigatórios" }, { status: 400 })
    }

    const nameValidation = validateUserName(authorName)
    if (!nameValidation.isValid) {
      return NextResponse.json(
        {
          error: nameValidation.reason,
          type: "name_invalid",
        },
        { status: 400 },
      )
    }

    const contentCheck = containsInappropriateContent(content)
    if (contentCheck.isInappropriate) {
      return NextResponse.json(
        {
          error: contentCheck.reason,
          type: "content_inappropriate",
          detectedWords: contentCheck.detectedWords,
        },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from("event_comments")
      .insert({
        event_id: eventId,
        session_id: sessionId,
        author_name: authorName,
        content: content,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      comment: {
        id: data.id,
        author: data.author_name,
        content: data.content,
        createdAt: data.created_at,
      },
    })
  } catch (error) {
    console.error("Error adding event comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
