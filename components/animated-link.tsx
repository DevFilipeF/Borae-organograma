"use client"

import type React from "react"

import Link from "next/link"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useNavigation } from "@/lib/navigation-context"

interface AnimatedLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AnimatedLink({ href, children, className, onClick }: AnimatedLinkProps) {
  const pathname = usePathname()
  const { startNavigation } = useNavigation()

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger splash for same page or external links
    if (pathname === href || href.startsWith("http")) {
      onClick?.()
      return
    }

    e.preventDefault()
    onClick?.()
    startNavigation(href)
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
