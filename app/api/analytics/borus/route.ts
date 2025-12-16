import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, question, responseType, wasHelpful } = body

    const supabase = await createClient()

    const { error } = await supabase.from("borus_interactions").insert({
      session_id: sessionId,
      question,
      response_type: responseType,
      was_helpful: wasHelpful,
    })

    if (error) {
      console.error("Error inserting BORUS interaction:", error)
      return NextResponse.json({ error: "Failed to track interaction" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("BORUS tracking error:", error)
    return NextResponse.json({ error: "Failed to track interaction" }, { status: 500 })
  }
}
