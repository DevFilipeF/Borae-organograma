// Utilitários para analytics
export function generateSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = sessionStorage.getItem("borae_session_id")
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem("borae_session_id", sessionId)
  }
  return sessionId
}

export function getDeviceInfo() {
  if (typeof window === "undefined") return {}

  const ua = navigator.userAgent

  // Detectar tipo de dispositivo
  let deviceType = "desktop"
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    deviceType = /iPad|Tablet/.test(ua) ? "tablet" : "mobile"
  }

  // Detectar browser
  let browser = "unknown"
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Edg")) browser = "Edge"
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera"

  // Detectar OS
  let os = "unknown"
  if (ua.includes("Windows")) os = "Windows"
  else if (ua.includes("Mac")) os = "macOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"

  const screenWidth = window.screen?.width || 0
  const screenHeight = window.screen?.height || 0
  const language = navigator.language || "unknown"
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown"

  return { deviceType, browser, os, userAgent: ua, screenWidth, screenHeight, language, timezone }
}

export async function trackPageView(pagePath: string, pageTitle?: string) {
  try {
    const sessionId = generateSessionId()
    const deviceInfo = getDeviceInfo()

    await fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagePath,
        pageTitle,
        referrer: document.referrer,
        sessionId,
        ...deviceInfo,
      }),
    })
  } catch (error) {
    console.error("Error tracking page view:", error)
  }
}

export async function trackEvent(eventType: string, eventName: string, metadata?: Record<string, unknown>) {
  try {
    const sessionId = generateSessionId()

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        eventName,
        pagePath: window.location.pathname,
        sessionId,
        metadata,
      }),
    })
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

export async function trackBorusInteraction(question: string, responseType: string, wasHelpful?: boolean) {
  try {
    const sessionId = generateSessionId()

    await fetch("/api/analytics/borus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        question,
        responseType,
        wasHelpful,
      }),
    })
  } catch (error) {
    console.error("Error tracking BORUS interaction:", error)
  }
}

export async function trackLike(avisoId: number, avisoTitle: string, action: "like" | "unlike") {
  try {
    const sessionId = generateSessionId()

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "like",
        eventName: action === "like" ? "Curtiu aviso" : "Descurtiu aviso",
        pagePath: "/avisos",
        sessionId,
        metadata: { avisoId, avisoTitle, action },
      }),
    })
  } catch (error) {
    console.error("Error tracking like:", error)
  }
}

export async function trackComment(avisoId: number, avisoTitle: string, commentAuthor: string) {
  try {
    const sessionId = generateSessionId()

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "comment",
        eventName: "Comentou em aviso",
        pagePath: "/avisos",
        sessionId,
        metadata: { avisoId, avisoTitle, commentAuthor },
      }),
    })
  } catch (error) {
    console.error("Error tracking comment:", error)
  }
}

export async function trackClick(elementName: string, elementType: string, metadata?: Record<string, unknown>) {
  try {
    const sessionId = generateSessionId()

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "click",
        eventName: `Clicou em ${elementName}`,
        pagePath: window.location.pathname,
        sessionId,
        metadata: { elementName, elementType, ...metadata },
      }),
    })
  } catch (error) {
    console.error("Error tracking click:", error)
  }
}

export async function trackScroll(scrollPercentage: number) {
  try {
    const sessionId = generateSessionId()

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "scroll",
        eventName: `Rolou ${scrollPercentage}%`,
        pagePath: window.location.pathname,
        sessionId,
        metadata: { scrollPercentage },
      }),
    })
  } catch (error) {
    console.error("Error tracking scroll:", error)
  }
}

export async function trackTimeOnPage(timeInSeconds: number) {
  try {
    const sessionId = generateSessionId()

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "time_on_page",
        eventName: `Tempo na página: ${timeInSeconds}s`,
        pagePath: window.location.pathname,
        sessionId,
        metadata: { timeInSeconds },
      }),
    })
  } catch (error) {
    console.error("Error tracking time on page:", error)
  }
}
