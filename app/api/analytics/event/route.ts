import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventName, pagePath, sessionId, elementId, elementText, metadata } = body

    const supabase = await createClient()

    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      event_name: eventName,
      page_path: pagePath,
      element_id: elementId,
      element_text: elementText,
      metadata,
      session_id: sessionId,
    })

    if (error) {
      console.error("Error inserting event:", error)
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics event error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
