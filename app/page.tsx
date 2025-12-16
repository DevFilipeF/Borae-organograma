"use client"

import { useState, useEffect } from "react"
import { AnimatedLink } from "@/components/animated-link"
import { SiteHeader } from "@/components/site-header"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import GlobalSplashScreen from "@/components/splash-screen"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [secretClicks, setSecretClicks] = useState(0)
  const [showSecretHint, setShowSecretHint] = useState(false)
  const router = useRouter()

  const [keySequence, setKeySequence] = useState<string[]>([])
  const secretCode = ["b", "o", "r", "u", "s"]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...keySequence, e.key.toLowerCase()].slice(-5)
      setKeySequence(newSequence)

      if (newSequence.join("") === secretCode.join("")) {
        router.push("/insights-borae-2024")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [keySequence, router])

  const handleSecretClick = () => {
    const newClicks = secretClicks + 1
    setSecretClicks(newClicks)

    if (newClicks >= 5) {
      router.push("/insights-borae-2024")
      setSecretClicks(0)
    } else if (newClicks >= 3) {
      setShowSecretHint(true)
      setTimeout(() => setShowSecretHint(false), 2000)
    }
  }

  const eventSlides = [
    {
      title: "Farol Santander",
      image: "/farol-1.jpg",
      description: "Arte e cultura no icônico Farol Santander",
    },
    {
      title: "Setembro Amarelo",
      image: "/images/whatsapp-20image-202025-11-14-20at-2013.jpeg",
      description: "Conscientização em saúde mental",
    },
    {
      title: "Boraween",
      image: "/boraween-1.jpg",
      description: "Celebração temática com toda a equipe",
    },
    {
      title: "Centro Cultural",
      image: "/images/centro-20cultural-281-29.jpg",
      description: "Explorando espaços culturais",
    },
  ]

  const recentUpdates = [
    {
      id: 1,
      title: "BORUS - Assistente IA",
      type: "success",
      date: "Nov 2025",
      description:
        "Assistente virtual inteligente criado para responder dúvidas sobre a BORAÊ de forma rápida e precisa, melhorando a experiência do usuário",
    },
    {
      id: 2,
      title: "Novo Design do Site",
      type: "info",
      date: "Nov 2025",
      description:
        "Reformulação completa da identidade visual com cores mais modernas e layout responsivo para melhor navegação em todos os dispositivos",
    },
    {
      id: 3,
      title: "Animações Fluidas",
      type: "success",
      date: "Nov 2025",
      description:
        "Implementação de transições suaves com Framer Motion para criar uma experiência mais dinâmica e profissional ao navegar pelo site",
    },
    {
      id: 4,
      title: "Splash Screen",
      type: "info",
      date: "Nov 2025",
      description:
        "Tela de carregamento animada com a logo da BORAÊ, transmitindo profissionalismo enquanto o conteúdo é preparado",
    },
  ]

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-100 text-red-700"
      case "success":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "urgent":
        return "Urgente"
      case "success":
        return "Novo"
      default:
        return "Update"
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [eventSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventSlides.length) % eventSlides.length)
  }

  return (
    <>
      <GlobalSplashScreen />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex flex-col">
        <style jsx global>{`
          .carousel-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        `}</style>

        <SiteHeader />

        {/* Main Content - Logo + Carrossel + Atualizações */}
        <main className="flex-1 flex flex-col py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8">
          <div className="max-w-5xl mx-auto w-full">
            {/* Logo Animado */}
            <motion.div
              className="mb-8 sm:mb-12 text-center relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="inline-block relative"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {/* Subtle glow effect behind logo */}
                <motion.div
                  className="absolute inset-0 bg-stone-400/10 blur-3xl rounded-full"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [0.9, 1.05, 0.9],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <Image
                  src="/nova-logo-borae.png"
                  alt="BORAÊ Logo"
                  width={500}
                  height={180}
                  className="mx-auto h-36 sm:h-44 lg:h-56 w-auto relative z-10 drop-shadow-lg"
                />
              </motion.div>
            </motion.div>

            {/* Carrossel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="relative h-64 sm:h-80 lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={eventSlides[currentSlide].image || "/placeholder.svg"}
                        alt={eventSlides[currentSlide].title}
                        fill
                        className="carousel-image"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                        >
                          {eventSlides[currentSlide].title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-sm sm:text-base lg:text-lg text-white/90"
                        >
                          {eventSlides[currentSlide].description}
                        </motion.p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel Controls */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {eventSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide ? "bg-white w-6 sm:w-8" : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-10"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Header Compacto */}
                <div className="bg-gradient-to-r from-stone-700 to-stone-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-stone-200" />
                    <h2 className="text-sm sm:text-base font-medium text-white">Novidades do Site</h2>
                  </div>
                </div>

                {/* Updates Grid Compacto */}
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {recentUpdates.map((update, index) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-all cursor-default group"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getTypeStyles(update.type)}`}
                          >
                            {getTypeLabel(update.type)}
                          </span>
                          <span className="text-[10px] text-gray-400">{update.date}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight mb-1">
                          {update.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2">{update.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
                <Image
                  src="/nova-logo-borae.png"
                  alt="BORAÊ Logo"
                  width={100}
                  height={32}
                  className="h-6 sm:h-8 w-auto sm:mr-3"
                />
                <span
                  className="text-gray-600 text-xs sm:text-sm text-center cursor-default select-none relative"
                  onClick={handleSecretClick}
                >
                  © 2025 BORAÊ. Todos os direitos reservados.
                  <AnimatePresence>
                    {showSecretHint && (
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-600 whitespace-nowrap"
                      >
                        {5 - secretClicks} cliques restantes...
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </div>
              <div className="flex space-x-4 sm:space-x-6">
                <AnimatedLink
                  href="/sobre"
                  className="text-gray-600 hover:text-amber-700 text-xs sm:text-sm transition-colors"
                >
                  Sobre
                </AnimatedLink>
                <AnimatedLink
                  href="/contato"
                  className="text-gray-600 hover:text-amber-700 text-xs sm:text-sm transition-colors"
                >
                  Contato
                </AnimatedLink>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
