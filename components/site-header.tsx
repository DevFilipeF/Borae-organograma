"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedLink } from "@/components/animated-link"
import { Button } from "@/components/ui/button"
import { Home, Users, LayoutDashboard, Calendar, Bell, Info, Mail, Menu, X } from "lucide-react"

const navigationItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/organograma", label: "Organograma", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/avisos", label: "Avisos", icon: Bell },
  { href: "/sobre", label: "Sobre", icon: Info },
  { href: "/contato", label: "Contato", icon: Mail },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <AnimatedLink href="/" className="flex items-center">
            <Image src="/nova-logo-borae.png" alt="BORAÊ Logo" width={120} height={40} className="h-9 w-auto" />
          </AnimatedLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <AnimatedLink key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative text-sm font-medium transition-all duration-200 ${
                      active ? "text-stone-800 bg-stone-100" : "text-gray-600 hover:text-stone-800 hover:bg-stone-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-700 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Button>
                </AnimatedLink>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-gray-600 hover:text-stone-800 hover:bg-stone-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden py-4 border-t border-stone-100"
            >
              <div className="flex flex-col gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <AnimatedLink key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-sm font-medium transition-all ${
                          active
                            ? "text-stone-800 bg-stone-100"
                            : "text-gray-600 hover:text-stone-800 hover:bg-stone-50"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    </AnimatedLink>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
