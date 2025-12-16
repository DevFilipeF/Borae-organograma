import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pagePath, pageTitle, referrer, sessionId, deviceType, browser, os, userAgent } = body

    const supabase = await createClient()

    // Registrar visualização de página
    const { error: pageViewError } = await supabase.from("page_views").insert({
      page_path: pagePath,
      page_title: pageTitle,
      referrer,
      user_agent: userAgent,
      session_id: sessionId,
      device_type: deviceType,
      browser,
      os,
    })

    if (pageViewError) {
      console.error("Error inserting page view:", pageViewError)
    }

    const { data: existingSession } = await supabase
      .from("sessions")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle()

    if (existingSession) {
      // Atualizar sessão existente
      await supabase
        .from("sessions")
        .update({
          last_page: pagePath,
          page_count: existingSession.page_count + 1,
          is_bounce: false,
          last_activity_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId)
    } else {
      // Criar nova sessão
      await supabase.from("sessions").insert({
        session_id: sessionId,
        first_page: pagePath,
        last_page: pagePath,
        device_type: deviceType,
        browser,
        os,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics pageview error:", error)
    return NextResponse.json({ error: "Failed to track pageview" }, { status: 500 })
  }
}
