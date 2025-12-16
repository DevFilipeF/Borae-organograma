"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatedLink } from "@/components/animated-link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@supabase/ssr"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Send,
  User,
} from "lucide-react"
import { containsInappropriateContent, validateUserName } from "@/lib/moderation"
import { SiteHeader } from "@/components/site-header"

const eventos = [
  {
    id: 1,
    title: "Visita ao Farol Santander",
    description:
      "Uma experiência incrível explorando arte, cultura e história no icônico Farol Santander. Nossa equipe participou de exposições interativas, conheceu a rica história cultural brasileira e fortaleceu os laços através da arte.",
    location: "Farol Santander - São Paulo",
    participants: 48,
    status: "realizado",
    category: "cultural",
    images: ["/farol-1.jpg", "/farol-2.jpg", "/farol-3.jpg", "/farol-4.jpg"],
    highlights: [
      "Exposição interativa de instrumentos musicais",
      "Experiência imersiva de aviação",
      "Conhecimento sobre cultura indígena brasileira",
    ],
  },
  {
    id: 2,
    date: "15/10/2024",
    title: "Visita ao Centro Cultural de Santo Amaro",
    description:
      "Exploração de espaço cultural voltado para artes e manifestações culturais. Uma oportunidade de conhecer e apreciar produções artísticas locais.",
    location: "Centro Cultural de Santo Amaro - São Paulo",
    participants: 48,
    status: "realizado",
    category: "cultural",
    images: ["/images/centro-20cultural-281-29.jpg"],
    highlights: ["Exposição de artes locais", "Conhecimento da história cultural da região"],
  },
  {
    id: 3,
    date: "2024-11-20",
    title: "Novembro Negro",
    description:
      "Iniciativa contínua de conscientização e celebração da história e cultura afro-brasileira. Eventos educativos e reflexivos ao longo do mês.",
    location: "Sede Boraê - Santo Amaro",
    participants: 48,
    status: "realizado",
    category: "cultural",
    images: ["/novembro-negro.jpg"],
    highlights: ["Conscientização e educação", "Celebração da cultura afro-brasileira"],
  },
  {
    id: 4,
    title: "Boraween",
    description:
      "Celebração temática com toda a equipe. Um evento especial para fortalecer o espírito de comunidade e diversão entre os colaboradores.",
    location: "Sede Boraê - Santo Amaro",
    participants: 48,
    status: "realizado",
    category: "social",
    images: ["/boraween-1.jpg", "/boraween-2.jpg", "/boraween-3.jpg", "/boraween-4.jpg"],
    highlights: ["Celebração temática", "Confraternização da equipe"],
  },
]

interface EventComment {
  id: string
  author: string
  content: string
  createdAt: string
}

interface EventLikes {
  count: number
  users: string[]
}

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<(typeof eventos)[0] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const [eventLikes, setEventLikes] = useState<Record<number, EventLikes>>({})
  const [eventComments, setEventComments] = useState<Record<number, EventComment[]>>({})
  const [userLikedEvents, setUserLikedEvents] = useState<Set<number>>(new Set())
  const [sessionId, setSessionId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [showNamePrompt, setShowNamePrompt] = useState<number | null>(null)
  const [tempUserName, setTempUserName] = useState("")
  const [newComment, setNewComment] = useState("")
  const [commentAuthor, setCommentAuthor] = useState("")
  const [showCommentForm, setShowCommentForm] = useState<number | null>(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState<number | null>(null)
  const [moderationError, setModerationError] = useState<string | null>(null)

  // Criar cliente Supabase para realtime
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Gerar ou recuperar session ID
  useEffect(() => {
    let sid = localStorage.getItem("borae_session_id")
    if (!sid) {
      sid = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem("borae_session_id", sid)
    }
    setSessionId(sid)

    // Recuperar nome do usuário se já fornecido
    const savedName = localStorage.getItem("borae_user_name")
    if (savedName) {
      setUserName(savedName)
      setCommentAuthor(savedName)
    }

    // Recuperar eventos curtidos pelo usuário
    const savedLikes = localStorage.getItem("borae_event_likes")
    if (savedLikes) {
      setUserLikedEvents(new Set(JSON.parse(savedLikes)))
    }
  }, [])

  // Carregar curtidas e comentários iniciais
  const fetchLikesAndComments = useCallback(async () => {
    try {
      const [likesRes, commentsRes] = await Promise.all([fetch("/api/eventos/likes"), fetch("/api/eventos/comments")])

      if (likesRes.ok) {
        const data = await likesRes.json()
        setEventLikes(data.likes || {})
      }

      if (commentsRes.ok) {
        const data = await commentsRes.json()
        setEventComments(data.comments || {})
      }
    } catch (error) {
      console.error("Error fetching likes/comments:", error)
    }
  }, [])

  useEffect(() => {
    fetchLikesAndComments()
  }, [fetchLikesAndComments])

  useEffect(() => {
    const channel = supabase
      .channel("event-interactions")
      .on("postgres_changes", { event: "*", schema: "public", table: "event_likes" }, () => {
        fetchLikesAndComments()
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "event_comments" }, (payload) => {
        const newComment = payload.new as any
        setEventComments((prev) => {
          const eventId = newComment.event_id
          const comment: EventComment = {
            id: newComment.id,
            author: newComment.author_name,
            content: newComment.content,
            createdAt: newComment.created_at,
          }
          return {
            ...prev,
            [eventId]: [...(prev[eventId] || []), comment],
          }
        })
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "event_comments" }, (payload) => {
        const deletedComment = payload.old as any
        setEventComments((prev) => {
          const newComments = { ...prev }
          Object.keys(newComments).forEach((eventId) => {
            newComments[Number(eventId)] = newComments[Number(eventId)].filter((c) => c.id !== deletedComment.id)
          })
          return newComments
        })
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "event_comments" }, (payload) => {
        const updatedComment = payload.new as any
        setEventComments((prev) => {
          const newComments = { ...prev }
          Object.keys(newComments).forEach((eventId) => {
            newComments[Number(eventId)] = newComments[Number(eventId)].map((c) =>
              c.id === updatedComment.id ? { ...c, content: updatedComment.content } : c,
            )
          })
          return newComments
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchLikesAndComments])

  const handleLikeEvent = async (eventId: number) => {
    if (!sessionId) return

    // Se não tem nome, pedir nome primeiro
    if (!userName && !userLikedEvents.has(eventId)) {
      setShowNamePrompt(eventId)
      return
    }

    const isLiked = userLikedEvents.has(eventId)

    // Animação de like
    if (!isLiked) {
      setLikeAnimation(eventId)
      setTimeout(() => setLikeAnimation(null), 500)
    }

    // Atualizar estado local imediatamente
    setUserLikedEvents((prev) => {
      const newSet = new Set(prev)
      if (isLiked) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      localStorage.setItem("borae_event_likes", JSON.stringify([...newSet]))
      return newSet
    })

    // Atualizar contagem local
    setEventLikes((prev) => ({
      ...prev,
      [eventId]: {
        count: (prev[eventId]?.count || 0) + (isLiked ? -1 : 1),
        users: isLiked
          ? (prev[eventId]?.users || []).filter((u) => u !== userName)
          : [...(prev[eventId]?.users || []), userName],
      },
    }))

    // Enviar para API
    try {
      await fetch("/api/eventos/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          sessionId,
          userName,
          action: isLiked ? "unlike" : "like",
        }),
      })
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const confirmNameAndLike = async (eventId: number) => {
    if (!tempUserName.trim()) return

    const name = tempUserName.trim()
    setUserName(name)
    setCommentAuthor(name)
    localStorage.setItem("borae_user_name", name)
    setShowNamePrompt(null)
    setTempUserName("")

    // Agora curtir
    setLikeAnimation(eventId)
    setTimeout(() => setLikeAnimation(null), 500)

    setUserLikedEvents((prev) => {
      const newSet = new Set(prev)
      newSet.add(eventId)
      localStorage.setItem("borae_event_likes", JSON.stringify([...newSet]))
      return newSet
    })

    setEventLikes((prev) => ({
      ...prev,
      [eventId]: {
        count: (prev[eventId]?.count || 0) + 1,
        users: [...(prev[eventId]?.users || []), name],
      },
    }))

    try {
      await fetch("/api/eventos/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          sessionId,
          userName: name,
          action: "like",
        }),
      })
    } catch (error) {
      console.error("Error liking:", error)
    }
  }

  const handleAddComment = async (eventId: number) => {
    if (!newComment.trim() || !commentAuthor.trim() || isSubmittingComment) return

    // Validar nome no frontend primeiro
    const nameValidation = validateUserName(commentAuthor)
    if (!nameValidation.isValid) {
      setModerationError(nameValidation.reason)
      return
    }

    // Validar conteúdo no frontend primeiro
    const contentCheck = containsInappropriateContent(newComment)
    if (contentCheck.isInappropriate) {
      setModerationError(contentCheck.reason)
      return
    }

    setModerationError(null)
    setIsSubmittingComment(true)

    // Salvar nome do autor para próximos comentários
    localStorage.setItem("borae_user_name", commentAuthor)
    setUserName(commentAuthor)

    try {
      const res = await fetch("/api/eventos/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          sessionId,
          authorName: commentAuthor,
          content: newComment,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setModerationError(data.error || "Erro ao enviar comentário")
        return
      }

      setNewComment("")
      setShowCommentForm(null)
    } catch (error) {
      console.error("Error adding comment:", error)
      setModerationError("Erro ao enviar comentário. Tente novamente.")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const nextImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) => (prev === selectedEvent.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedEvent.images.length - 1 : prev - 1))
    }
  }

  const handleImageError = (src: string) => {
    setFailedImages((prev) => new Set(prev).add(src))
  }

  const getImageSrc = (src: string, eventTitle: string) => {
    if (failedImages.has(src)) {
      return `/placeholder.svg?height=500&width=800&query=${encodeURIComponent(eventTitle)}`
    }
    return src
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "realizado":
        return "from-green-500 to-emerald-500"
      case "agendado":
        return "from-blue-500 to-blue-600"
      case "cancelado":
        return "from-red-500 to-red-600"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "realizado":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
      case "agendado":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cultural":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100"
      case "workshop":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
      case "social":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
    }
  }

  const filteredEventos = eventos.filter(
    (evento) =>
      evento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <SiteHeader />

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header da Página */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <AnimatedLink href="/">
              <Button
                variant="outline"
                size="sm"
                className="glass-effect border-white/30 hover:bg-white/20 bg-transparent text-xs sm:text-sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 lg:mr-4 text-gray-600" />
                Voltar
              </Button>
            </AnimatedLink>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 flex items-center">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mr-2 sm:mr-3 lg:mr-4 text-gray-600" />
                Eventos
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                Momentos especiais e experiências culturais
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full lg:w-64 xl:w-80 rounded-lg sm:rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Modal para pedir nome */}
        <AnimatePresence>
          {showNamePrompt !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNamePrompt(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Como podemos te chamar?</h3>
                    <p className="text-sm text-gray-500">Seu nome aparecerá nas curtidas</p>
                  </div>
                </div>
                <Input
                  type="text"
                  placeholder="Digite seu nome..."
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="mb-4"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tempUserName.trim()) {
                      confirmNameAndLike(showNamePrompt)
                    }
                  }}
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setShowNamePrompt(null)
                      setTempUserName("")
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600"
                    onClick={() => confirmNameAndLike(showNamePrompt)}
                    disabled={!tempUserName.trim()}
                  >
                    Curtir
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Eventos */}
        <div className="space-y-6 sm:space-y-8">
          {filteredEventos.map((evento) => (
            <motion.div
              key={evento.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-modern hover-lift border-0 overflow-hidden">
                <CardHeader className="relative p-4 sm:p-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(evento.status)} opacity-5`}></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${getStatusColor(evento.status)} flex items-center justify-center shadow-lg text-white`}
                        >
                          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <Badge className={`${getStatusBadge(evento.status)} border text-xs font-medium mr-2`}>
                            {evento.status === "realizado"
                              ? "REALIZADO"
                              : evento.status === "agendado"
                                ? "AGENDADO"
                                : "CANCELADO"}
                          </Badge>
                          <Badge className={`${getCategoryColor(evento.category)} border text-xs font-medium`}>
                            {evento.category.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEvent(evento)
                              setCurrentImageIndex(0)
                            }}
                            className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl text-gray-800">{evento.title}</DialogTitle>
                          </DialogHeader>

                          {evento.images && evento.images.length > 0 && (
                            <div className="relative mb-6">
                              <div className="relative event-image-container overflow-hidden">
                                <Image
                                  src={
                                    getImageSrc(evento.images[currentImageIndex], evento.title) || "/placeholder.svg"
                                  }
                                  alt={`${evento.title} - Foto ${currentImageIndex + 1}`}
                                  fill
                                  className="event-image object-cover"
                                  onError={() => handleImageError(evento.images[currentImageIndex])}
                                />

                                {evento.images.length > 1 && (
                                  <>
                                    <button
                                      onClick={prevImage}
                                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </button>

                                    <button
                                      onClick={nextImage}
                                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                      {evento.images.map((_, index) => (
                                        <button
                                          key={index}
                                          onClick={() => setCurrentImageIndex(index)}
                                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                                            index === currentImageIndex ? "bg-white" : "bg-white/50"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="text-center mt-2 text-xs sm:text-sm text-slate-500">
                                Foto {currentImageIndex + 1} de {evento.images.length}
                              </div>
                            </div>
                          )}

                          <div className="space-y-6">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">Descrição</h3>
                              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                {evento.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">
                                  Informações do Evento
                                </h4>
                                <div className="space-y-2 text-xs sm:text-sm">
                                  <div className="flex items-center text-slate-600">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {evento.location}
                                  </div>
                                  <div className="flex items-center text-slate-600">
                                    <Users className="h-4 w-4 mr-1" />
                                    {evento.participants} participantes
                                  </div>
                                </div>
                              </div>

                              {evento.highlights && evento.highlights.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Destaques</h4>
                                  <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
                                    {evento.highlights.map((highlight, index) => (
                                      <li key={index} className="flex items-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0" />
                                        {highlight}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">{evento.title}</h2>
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-4">{evento.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {evento.location}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {evento.participants} participantes
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Botão de curtir */}
                          <button onClick={() => handleLikeEvent(evento.id)} className="flex items-center gap-2 group">
                            <div className="relative">
                              <Heart
                                className={`h-6 w-6 transition-all ${
                                  userLikedEvents.has(evento.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400 group-hover:text-red-400"
                                } ${likeAnimation === evento.id ? "heart-animate" : ""}`}
                              />
                              {likeAnimation === evento.id && (
                                <Heart className="absolute inset-0 h-6 w-6 fill-red-500 text-red-500 float-heart" />
                              )}
                            </div>
                            <span
                              className={`font-medium ${userLikedEvents.has(evento.id) ? "text-red-500" : "text-gray-600"}`}
                            >
                              {eventLikes[evento.id]?.count || 0}
                            </span>
                          </button>

                          {/* Botão de comentários */}
                          <button
                            onClick={() => setShowCommentForm(showCommentForm === evento.id ? null : evento.id)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <MessageCircle className="h-6 w-6" />
                            <span className="font-medium">{eventComments[evento.id]?.length || 0}</span>
                          </button>
                        </div>

                        {/* Quem curtiu */}
                        {eventLikes[evento.id]?.users && eventLikes[evento.id].users.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Curtido por{" "}
                            <span className="font-medium text-gray-700">
                              {eventLikes[evento.id].users.slice(0, 2).join(", ")}
                              {eventLikes[evento.id].users.length > 2 &&
                                ` e mais ${eventLikes[evento.id].users.length - 2}`}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Seção de comentários */}
                      <AnimatePresence>
                        {showCommentForm === evento.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-4"
                          >
                            {/* Lista de comentários */}
                            {eventComments[evento.id] && eventComments[evento.id].length > 0 && (
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {eventComments[evento.id].map((comment) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-3 bg-gray-50 rounded-lg p-3"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                                      <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                                        <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {/* Formulário para novo comentário */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <Input
                                type="text"
                                placeholder="Seu nome..."
                                value={commentAuthor}
                                onChange={(e) => setCommentAuthor(e.target.value)}
                                className="bg-white"
                              />
                              <div className="flex gap-2">
                                <Textarea
                                  placeholder="Escreva um comentário..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  className="bg-white min-h-[60px] resize-none flex-1"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey && newComment.trim() && commentAuthor.trim()) {
                                      e.preventDefault()
                                      handleAddComment(evento.id)
                                    }
                                  }}
                                />
                                <Button
                                  onClick={() => handleAddComment(evento.id)}
                                  disabled={!newComment.trim() || !commentAuthor.trim() || isSubmittingComment}
                                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 self-end"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                              {/* Adicionar erro de moderação */}
                              {moderationError && <p className="text-red-500 text-sm">{moderationError}</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardHeader>

                {/* Thumbnails das imagens */}
                {evento.images && evento.images.length > 0 && (
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-4 gap-2">
                      {evento.images.slice(0, 4).map((image, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => {
                                setSelectedEvent(evento)
                                setCurrentImageIndex(index)
                              }}
                              className="relative aspect-square rounded-lg overflow-hidden group"
                            >
                              <Image
                                src={getImageSrc(image, evento.title) || "/placeholder.svg"}
                                alt={`${evento.title} - Thumbnail ${index + 1}`}
                                fill
                                className="event-thumbnail transition-transform duration-300 group-hover:scale-110"
                                onError={() => handleImageError(image)}
                              />
                              {index === 3 && evento.images.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">+{evento.images.length - 4}</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl sm:text-2xl text-gray-800">{evento.title}</DialogTitle>
                            </DialogHeader>

                            <div className="relative mb-6">
                              <div className="relative event-image-container overflow-hidden">
                                <Image
                                  src={
                                    getImageSrc(evento.images[currentImageIndex], evento.title) || "/placeholder.svg"
                                  }
                                  alt={`${evento.title} - Foto ${currentImageIndex + 1}`}
                                  fill
                                  className="event-image object-cover"
                                  onError={() => handleImageError(evento.images[currentImageIndex])}
                                />

                                {evento.images.length > 1 && (
                                  <>
                                    <button
                                      onClick={prevImage}
                                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </button>

                                    <button
                                      onClick={nextImage}
                                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                      {evento.images.map((_, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => setCurrentImageIndex(idx)}
                                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="text-center mt-2 text-xs sm:text-sm text-slate-500">
                                Foto {currentImageIndex + 1} de {evento.images.length}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredEventos.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-500">Tente ajustar sua busca</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Image src="/nova-logo-borae.png" alt="BORAÊ Logo" width={100} height={33} className="h-8 w-auto" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm text-center">© 2025 BORAÊ. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
