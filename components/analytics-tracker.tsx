"use client"

import { useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { trackPageView, trackScroll, trackTimeOnPage, trackClick } from "@/lib/analytics"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const scrollMilestonesRef = useRef<Set<number>>(new Set())

  // Rastrear cliques em links e botões
  const handleGlobalClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Encontrar o elemento clicável mais próximo
      const clickable = target.closest("a, button, [role='button'], [onclick]") as HTMLElement
      if (!clickable) return

      // Ignorar cliques na página de insights
      if (pathname.includes("insights-borae")) return

      let elementName = ""
      let elementType = ""

      if (clickable.tagName === "A") {
        elementName = clickable.textContent?.trim().slice(0, 50) || (clickable as HTMLAnchorElement).href
        elementType = "link"
      } else if (clickable.tagName === "BUTTON") {
        elementName = clickable.textContent?.trim().slice(0, 50) || clickable.getAttribute("aria-label") || "button"
        elementType = "button"
      } else {
        elementName = clickable.textContent?.trim().slice(0, 50) || "elemento"
        elementType = "interactive"
      }

      if (elementName) {
        trackClick(elementName, elementType, {
          tagName: clickable.tagName,
          className: clickable.className?.slice(0, 100),
          href: (clickable as HTMLAnchorElement).href || null,
        })
      }
    },
    [pathname],
  )

  // Rastrear scroll
  const handleScroll = useCallback(() => {
    if (pathname.includes("insights-borae")) return

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = Math.round((window.scrollY / scrollHeight) * 100)

    if (scrollPercentage > maxScrollRef.current) {
      maxScrollRef.current = scrollPercentage
    }

    // Rastrear milestones: 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100]
    for (const milestone of milestones) {
      if (scrollPercentage >= milestone && !scrollMilestonesRef.current.has(milestone)) {
        scrollMilestonesRef.current.add(milestone)
        trackScroll(milestone)
      }
    }
  }, [pathname])

  // Rastrear tempo na página quando sair
  const handleBeforeUnload = useCallback(() => {
    if (pathname.includes("insights-borae")) return

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    if (timeSpent > 5) {
      // Só rastrear se passou mais de 5 segundos
      trackTimeOnPage(timeSpent)
    }
  }, [pathname])

  useEffect(() => {
    // Não rastrear a página de insights
    if (pathname.includes("insights-borae")) return

    // Resetar refs para nova página
    startTimeRef.current = Date.now()
    maxScrollRef.current = 0
    scrollMilestonesRef.current = new Set()

    // Rastrear visualização de página
    const pageTitle = document.title
    trackPageView(pathname, pageTitle)

    // Adicionar listeners
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("click", handleGlobalClick, { capture: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("click", handleGlobalClick, { capture: true })

      // Rastrear tempo quando mudar de página
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
      if (timeSpent > 5) {
        trackTimeOnPage(timeSpent)
      }
    }
  }, [pathname, handleScroll, handleBeforeUnload, handleGlobalClick])

  return null
}
