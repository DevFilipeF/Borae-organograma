import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any; count?: number | null }>,
): Promise<{ data: T | null; count: number }> {
  try {
    const result = await queryFn()
    if (result.error) {
      console.error("Query error:", result.error)
      return { data: null, count: 0 }
    }
    return { data: result.data, count: result.count || 0 }
  } catch (error) {
    console.error("Query exception:", error)
    return { data: null, count: 0 }
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const todayStart = today.toISOString()
    const yesterdayStart = yesterday.toISOString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()

    const { count: totalPageViews } = await safeQuery(() =>
      supabase.from("page_views").select("*", { count: "exact", head: true }),
    )

    const { count: pageViewsToday } = await safeQuery(() =>
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    )

    const { count: pageViewsYesterday } = await safeQuery(() =>
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", yesterdayStart)
        .lt("created_at", todayStart),
    )

    const { count: totalSessions } = await safeQuery(() =>
      supabase.from("sessions").select("*", { count: "exact", head: true }),
    )

    const { count: activeNow } = await safeQuery(() =>
      supabase.from("sessions").select("*", { count: "exact", head: true }).gte("last_activity_at", fiveMinutesAgo),
    )

    const { data: topPagesData } = await safeQuery(() =>
      supabase.from("page_views").select("page_path").gte("created_at", weekAgo),
    )

    const pageCountMap: Record<string, number> = {}
    ;((topPagesData as any[]) || []).forEach((p) => {
      pageCountMap[p.page_path] = (pageCountMap[p.page_path] || 0) + 1
    })
    const totalViewsCount = Object.values(pageCountMap).reduce((a, b) => a + b, 0)
    const topPages = Object.entries(pageCountMap)
      .map(([page, views]) => ({
        page,
        views,
        percentage: totalViewsCount > 0 ? Math.round((views / totalViewsCount) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const { data: deviceData } = await safeQuery(() =>
      supabase.from("sessions").select("device_type").gte("started_at", monthAgo),
    )

    const deviceMap: Record<string, number> = {}
    ;((deviceData as any[]) || []).forEach((d) => {
      const device = d.device_type || "desktop"
      deviceMap[device] = (deviceMap[device] || 0) + 1
    })
    const totalDevices = Object.values(deviceMap).reduce((a, b) => a + b, 0)
    const deviceColors: Record<string, string> = {
      desktop: "#3b82f6",
      mobile: "#10b981",
      tablet: "#f59e0b",
    }
    const devices = Object.entries(deviceMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: totalDevices > 0 ? Math.round((value / totalDevices) * 100) : 0,
      color: deviceColors[name] || "#8b5cf6",
    }))

    const { data: browserData } = await safeQuery(() =>
      supabase.from("sessions").select("browser").gte("started_at", monthAgo),
    )

    const browserMap: Record<string, number> = {}
    ;((browserData as any[]) || []).forEach((b) => {
      if (b.browser) {
        browserMap[b.browser] = (browserMap[b.browser] || 0) + 1
      }
    })
    const browsers = Object.entries(browserMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    const { data: recentEventsData } = await safeQuery(() =>
      supabase.from("analytics_events").select("*").order("created_at", { ascending: false }).limit(20),
    )

    const recentEvents = ((recentEventsData as any[]) || []).map((event) => ({
      id: event.id,
      type: event.event_type,
      name: event.event_name,
      page: event.page_path,
      time: new Date(event.created_at).toLocaleTimeString("pt-BR"),
      metadata: event.metadata,
    }))

    const { count: totalClicks } = await safeQuery(() =>
      supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "click"),
    )

    const { count: avisosLikes } = await safeQuery(() =>
      supabase.from("likes").select("*", { count: "exact", head: true }),
    )

    const { count: eventLikes } = await safeQuery(() =>
      supabase.from("event_likes").select("*", { count: "exact", head: true }),
    )

    const { count: avisosComments } = await safeQuery(() =>
      supabase.from("comments").select("*", { count: "exact", head: true }),
    )

    const { count: eventComments } = await safeQuery(() =>
      supabase.from("event_comments").select("*", { count: "exact", head: true }),
    )

    const { count: borusInteractions } = await safeQuery(() =>
      supabase.from("borus_interactions").select("*", { count: "exact", head: true }),
    )

    const { data: borusInteractionsData } = await safeQuery(() =>
      supabase.from("borus_interactions").select("*").order("created_at", { ascending: false }).limit(50),
    )

    const { data: borusQuestionsData } = await safeQuery(() =>
      supabase.from("borus_interactions").select("question, response_type").gte("created_at", monthAgo),
    )

    const questionMap: Record<string, { count: number; type: string }> = {}
    ;((borusQuestionsData as any[]) || []).forEach((q) => {
      const shortQ = q.question.substring(0, 50)
      if (!questionMap[shortQ]) {
        questionMap[shortQ] = { count: 0, type: q.response_type || "general" }
      }
      questionMap[shortQ].count++
    })
    const borusQuestions = Object.entries(questionMap)
      .map(([question, data]) => ({ question, count: data.count, type: data.type }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const { data: dailyViewsData } = await safeQuery(() =>
      supabase.from("page_views").select("created_at, session_id").gte("created_at", weekAgo),
    )

    const dailyMap: Record<string, { views: number; sessions: Set<string> }> = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      dailyMap[key] = { views: 0, sessions: new Set() }
    }
    ;((dailyViewsData as any[]) || []).forEach((v) => {
      const date = new Date(v.created_at)
      const key = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      if (dailyMap[key]) {
        dailyMap[key].views++
        dailyMap[key].sessions.add(v.session_id)
      }
    })
    const dailyViews = Object.entries(dailyMap).map(([date, data]) => ({
      date,
      views: data.views,
      visitors: data.sessions.size,
    }))

    const { data: allAvisosComments } = await safeQuery(() =>
      supabase.from("comments").select("*").order("created_at", { ascending: false }),
    )

    const { data: allEventComments } = await safeQuery(() =>
      supabase.from("event_comments").select("*").order("created_at", { ascending: false }),
    )

    const { data: allAvisosLikes } = await safeQuery(() =>
      supabase.from("likes").select("*").order("created_at", { ascending: false }),
    )

    const { data: allEventLikes } = await safeQuery(() =>
      supabase.from("event_likes").select("*").order("created_at", { ascending: false }),
    )

    return NextResponse.json({
      totalPageViews: totalPageViews || 0,
      uniqueVisitors: totalSessions || 0,
      totalSessions: totalSessions || 0,
      activeNow: activeNow || 0,
      pageViewsToday: pageViewsToday || 0,
      pageViewsYesterday: pageViewsYesterday || 0,
      topPages,
      devices,
      browsers,
      borusQuestions,
      dailyViews,
      recentEvents,
      totalClicks: totalClicks || 0,
      totalLikes: (avisosLikes || 0) + (eventLikes || 0),
      avisosLikes: avisosLikes || 0,
      eventLikes: eventLikes || 0,
      totalComments: (avisosComments || 0) + (eventComments || 0),
      avisosComments: avisosComments || 0,
      eventComments: eventComments || 0,
      borusInteractions: borusInteractions || 0,
      borusInteractionsData: (borusInteractionsData as any[]) || [],
      allAvisosComments: (allAvisosComments as any[]) || [],
      allEventComments: (allEventComments as any[]) || [],
      allAvisosLikes: (allAvisosLikes as any[]) || [],
      allEventLikes: (allEventLikes as any[]) || [],
    })
  } catch (error) {
    console.error("Analytics stats error:", error)
    return NextResponse.json({
      totalPageViews: 0,
      uniqueVisitors: 0,
      totalSessions: 0,
      activeNow: 0,
      pageViewsToday: 0,
      pageViewsYesterday: 0,
      topPages: [],
      devices: [],
      browsers: [],
      borusQuestions: [],
      dailyViews: [],
      recentEvents: [],
      totalClicks: 0,
      totalLikes: 0,
      avisosLikes: 0,
      eventLikes: 0,
      totalComments: 0,
      avisosComments: 0,
      eventComments: 0,
      borusInteractions: 0,
      borusInteractionsData: [],
      allAvisosComments: [],
      allEventComments: [],
      allAvisosLikes: [],
      allEventLikes: [],
    })
  }
}
