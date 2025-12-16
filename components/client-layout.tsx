"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { NavigationProvider, useNavigation } from "@/lib/navigation-context"
import { SplashScreen } from "@/components/splash-screen"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [showInitialSplash, setShowInitialSplash] = useState(true)
  const { isNavigating } = useNavigation()
  const pathname = usePathname()

  useEffect(() => {
    // Show initial splash for 3 seconds
    const timer = setTimeout(() => {
      setShowInitialSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Reset splash on route change
  useEffect(() => {
    // Don't reset on initial load
    if (!showInitialSplash) {
      return
    }
  }, [pathname, showInitialSplash])

  return (
    <>
      <SplashScreen isVisible={showInitialSplash || isNavigating} />
      {children}
    </>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NavigationProvider>
      <LayoutContent>{children}</LayoutContent>
    </NavigationProvider>
  )
}
