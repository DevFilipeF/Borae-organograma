import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ likes: {} })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: likes, error } = await supabase
      .from("event_likes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching event likes:", error.message)
      return NextResponse.json({ likes: {} })
    }

    // Agrupar likes por evento
    const likesByEvent: Record<number, { count: number; users: string[] }> = {}
    likes?.forEach((like) => {
      if (!likesByEvent[like.event_id]) {
        likesByEvent[like.event_id] = { count: 0, users: [] }
      }
      likesByEvent[like.event_id].count++
      if (like.user_name) {
        likesByEvent[like.event_id].users.push(like.user_name)
      }
    })

    return NextResponse.json({ likes: likesByEvent })
  } catch (error) {
    console.error("Error fetching event likes:", error)
    return NextResponse.json({ likes: {} })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { eventId, sessionId, userName, action } = await request.json()

    if (action === "unlike") {
      const { error } = await supabase.from("event_likes").delete().eq("event_id", eventId).eq("session_id", sessionId)

      if (error) {
        console.error("Error unliking:", error.message)
        return NextResponse.json({ error: "Failed to unlike" }, { status: 500 })
      }
      return NextResponse.json({ success: true, action: "unliked" })
    }

    const { error } = await supabase.from("event_likes").upsert(
      {
        event_id: eventId,
        session_id: sessionId,
        user_name: userName || "Anônimo",
      },
      {
        onConflict: "event_id,session_id",
      },
    )

    if (error) {
      console.error("Error liking:", error.message)
      return NextResponse.json({ error: "Failed to like" }, { status: 500 })
    }
    return NextResponse.json({ success: true, action: "liked" })
  } catch (error) {
    console.error("Error toggling event like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
