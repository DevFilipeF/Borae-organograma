import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Buscar comentários de avisos
    const { data: avisosComments, error: avisosError } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })

    // Buscar comentários de eventos
    const { data: eventComments, error: eventError } = await supabase
      .from("event_comments")
      .select("*")
      .order("created_at", { ascending: false })

    if (avisosError) {
      console.error("Error fetching avisos comments:", avisosError)
    }
    if (eventError) {
      console.error("Error fetching event comments:", eventError)
    }

    return NextResponse.json({
      avisosComments: avisosComments || [],
      eventComments: eventComments || [],
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ avisosComments: [], eventComments: [] })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { id, type } = body

    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 })
    }

    let deleteResult

    if (type === "aviso") {
      deleteResult = await supabase.from("comments").delete().eq("id", id)
      if (deleteResult.error) {
        console.error("[v0] Error deleting from comments:", deleteResult.error)
        return NextResponse.json({ error: deleteResult.error.message }, { status: 500 })
      }
    } else if (type === "event") {
      deleteResult = await supabase.from("event_comments").delete().eq("id", id)
      if (deleteResult.error) {
        console.error("[v0] Error deleting from event_comments:", deleteResult.error)
        return NextResponse.json({ error: deleteResult.error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id, type, content } = body

    if (type === "aviso") {
      const { error } = await supabase.from("comments").update({ content }).eq("id", id)
      if (error) throw error
    } else if (type === "event") {
      const { error } = await supabase.from("event_comments").update({ content }).eq("id", id)
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}
