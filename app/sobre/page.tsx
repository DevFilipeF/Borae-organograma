"use client"

import { useState } from "react"
import { AnimatedLink } from "@/components/animated-link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Info,
  Users,
  Menu,
  X,
  Target,
  Heart,
  Star,
  Calendar,
  Bell,
  CheckSquare,
  Mail,
  Instagram,
  Facebook,
  Bot,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react"

export default function SobrePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { href: "/", label: "Início", icon: Users },
    { href: "/organograma", label: "Organograma", icon: Users },
    { href: "/dashboard", label: "Dashboard", icon: CheckSquare },
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/avisos", label: "Avisos", icon: Bell },
    { href: "/sobre", label: "Sobre", icon: Info },
    { href: "/contato", label: "Contato", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src="/nova-logo-borae.png" alt="BORAÊ Logo" width={120} height={40} className="h-8 w-auto" />
            </div>

            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <AnimatedLink key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm font-medium transition-colors ${
                      item.href === "/sobre"
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </AnimatedLink>
              ))}
            </nav>

            <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 fixed w-full z-40">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navigationItems.map((item) => (
              <AnimatedLink key={item.href} href={item.href}>
                <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setIsMenuOpen(false)}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </AnimatedLink>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-dark.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge
            variant="outline"
            className="mb-6 text-blue-300 border-blue-400/30 px-4 py-1 text-sm uppercase tracking-wider"
          >
            Nossa Essência
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Transformando Jovens <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Através da Cultura
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Somos uma agência dedicada a conectar a juventude com arte, música e conhecimento, criando experiências que
            inspiram e transformam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AnimatedLink href="/contato">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Fale Conosco
              </Button>
            </AnimatedLink>
            <AnimatedLink href="/organograma">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 hover:text-white px-8 bg-transparent"
              >
                Conheça a Equipe
              </Button>
            </AnimatedLink>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Nossa Missão</h3>
            <p className="text-slate-600 leading-relaxed">
              Promover cultura, informação e entretenimento para o maior número possível de jovens de forma educativa,
              autêntica e impactante.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Nossa Visão</h3>
            <p className="text-slate-600 leading-relaxed">
              Trazer para os jovens que tenham pouco interesse, acesso ou oportunidade, variados tipos de entretenimento
              e educação cultural.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Nossos Valores</h3>
            <p className="text-slate-600 leading-relaxed">
              Paixão pela cultura, valorização da diversidade, aprendizado através da experiência, transparência e
              reconhecimento do potencial humano.
            </p>
          </div>
        </div>

        {/* Social Proof / Connect */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/social-media-pattern.jpg')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Conecte-se Conosco</h2>
            <p className="text-slate-300 mb-8 text-lg">
              Acompanhe nossos bastidores, novidades e próximos eventos em nossas redes sociais. Faça parte da nossa
              comunidade!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.instagram.com/_boraee/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-3 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all"
              >
                <Facebook className="w-5 h-5 mr-2" />
                Facebook
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-3 bg-slate-800 border border-slate-700 rounded-full font-semibold hover:bg-slate-700 hover:shadow-lg hover:scale-105 transition-all"
              >
                <span className="mr-2 font-bold">Tk</span>
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* BORUS Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 text-stone-600 border-stone-300 px-4 py-1 text-sm uppercase tracking-wider"
            >
              Assistente Virtual (BORUS)
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Conheça o BORUS</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nosso assistente virtual inteligente está sempre disponível para ajudar você.
            </p>
          </div>

          <Card className="border-slate-200 shadow-lg overflow-hidden max-w-2xl mx-auto">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-stone-700 to-stone-900 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">BORUS</h3>
                    <p className="text-stone-300 text-sm">Seu assistente virtual 24/7</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">
                  O <strong>BORUS</strong> (Bot for Organizational Research & Unified Support) é nosso assistente
                  virtual inteligente. Ele pode responder perguntas sobre:
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-stone-400" />
                    Informações sobre a empresa
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-stone-400" />
                    Colaboradores e departamentos
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    Eventos realizados
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-stone-400" />E muito mais!
                  </li>
                </ul>
                <p className="text-slate-500 text-sm mt-4 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Clique no ícone no canto inferior direito para conversar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/nova-logo-borae.png"
              alt="BORAÊ Logo"
              width={100}
              height={32}
              className="h-8 w-auto mr-3 opacity-80 grayscale hover:grayscale-0 transition-all"
            />
            <span className="text-slate-500 text-sm">© 2025 BORAÊ. Todos os direitos reservados.</span>
          </div>
          <div className="flex space-x-8">
            <AnimatedLink
              href="/sobre"
              className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Sobre
            </AnimatedLink>
            <AnimatedLink
              href="/contato"
              className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Contato
            </AnimatedLink>
          </div>
        </div>
      </footer>
    </div>
  )
}
