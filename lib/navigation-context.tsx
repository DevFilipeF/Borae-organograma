"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface NavigationContextType {
  isNavigating: boolean
  targetPath: string | null
  startNavigation: (path: string) => void
  endNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  targetPath: null,
  startNavigation: () => {},
  endNavigation: () => {},
})

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const router = useRouter()

  const startNavigation = useCallback(
    (path: string) => {
      setTargetPath(path)
      setIsNavigating(true)

      // Navigate after splash animation starts
      setTimeout(() => {
        router.push(path)
      }, 800)

      // End navigation after full animation
      setTimeout(() => {
        setIsNavigating(false)
        setTargetPath(null)
      }, 1500)
    },
    [router],
  )

  const endNavigation = useCallback(() => {
    setIsNavigating(false)
    setTargetPath(null)
  }, [])

  return (
    <NavigationContext.Provider value={{ isNavigating, targetPath, startNavigation, endNavigation }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  return useContext(NavigationContext)
}
