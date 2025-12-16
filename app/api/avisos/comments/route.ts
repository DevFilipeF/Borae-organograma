import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { containsInappropriateContent, validateUserName } from "@/lib/moderation"

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ comments: {} })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) throw error

    // Agrupar comentários por aviso
    const commentsByAviso: Record<
      number,
      Array<{
        id: string
        author: string
        text: string
        timestamp: string
      }>
    > = {}

    comments?.forEach((comment) => {
      if (!commentsByAviso[comment.aviso_id]) {
        commentsByAviso[comment.aviso_id] = []
      }
      commentsByAviso[comment.aviso_id].push({
        id: comment.id,
        author: comment.author_name,
        text: comment.content,
        timestamp: comment.created_at,
      })
    })

    return NextResponse.json({ comments: commentsByAviso })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ comments: {} })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { avisoId, sessionId, authorName, content } = await request.json()

    if (!authorName || !content) {
      return NextResponse.json({ error: "Nome e comentário são obrigatórios" }, { status: 400 })
    }

    // Validar nome do autor
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

    // Verificar conteúdo impróprio no comentário
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
      .from("comments")
      .insert({
        aviso_id: avisoId,
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
        text: data.content,
        timestamp: data.created_at,
      },
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
