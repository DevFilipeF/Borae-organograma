import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "@/components/client-layout"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { BorusGlobal } from "@/components/borus-global"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BORAÊ - Estrutura Organizacional",
  description: "Visualize a estrutura organizacional da BORAÊ através de um organograma interativo e profissional",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AnalyticsTracker />
        <ClientLayout>{children}</ClientLayout>
        <BorusGlobal />
      </body>
    </html>
  )
}
