"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatedLink } from "@/components/animated-link"
import { Bell, Calendar, ThumbsUp, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackLike, trackComment, trackEvent } from "@/lib/analytics"
import { SiteHeader } from "@/components/site-header"

interface Comment {
  id: number
  author: string
  text: string
  timestamp: Date
}

interface Aviso {
  id: number
  title: string
  content: string
  type: string
  date: string
  author: string
  priority: string
  likes: number
  comments: Comment[]
  likedByUser: boolean
}

const initialAvisos: Aviso[] = [
  {
    id: 1,
    title: "Mudança de Sede para o Parque Santo Antônio",
    content:
      "Informamos que a partir de 2025, nossa sede será transferida para o Parque Santo Antônio. Esta mudança estratégica visa ampliar nossa capacidade de atendimento e oferecer melhor infraestrutura para todos os colaboradores e parceiros.",
    type: "urgent",
    date: "2025-01-15",
    author: "Diretoria Executiva",
    priority: "alta",
    likes: 24,
    comments: [],
    likedByUser: false,
  },
  {
    id: 2,
    title: "Reunião de Planejamento Estratégico 2025",
    content:
      "Convocamos todos os líderes de departamento para a reunião de alinhamento anual. Pauta: Definição de OKRs, orçamento anual e cronograma de eventos.",
    type: "info",
    date: "2025-01-10",
    author: "Recursos Humanos",
    priority: "média",
    likes: 18,
    comments: [],
    likedByUser: false,
  },
  {
    id: 3,
    title: "Sucesso no Evento Farol Santander",
    content:
      "É com grande satisfação que compartilhamos os resultados do evento no Farol Santander. Superamos todas as expectativas de público e engajamento.",
    type: "success",
    date: "2025-01-08",
    author: "Eventos & Comunicação",
    priority: "baixa",
    likes: 45,
    comments: [],
    likedByUser: false,
  },
  {
    id: 4,
    title: "Manutenção Programada do Sistema",
    content: "O sistema interno passará por uma atualização crítica de segurança neste domingo, das 08:00 às 12:00.",
    type: "warning",
    date: "2025-01-05",
    author: "Tecnologia da Informação",
    priority: "média",
    likes: 8,
    comments: [],
    likedByUser: false,
  },
  {
    id: 5,
    title: "Nova Identidade Visual em Desenvolvimento",
    content:
      "O departamento de Marketing iniciou o projeto de rebranding para 2025. O objetivo é modernizar nossa comunicação visual.",
    type: "info",
    date: "2025-01-03",
    author: "Marketing",
    priority: "baixa",
    likes: 32,
    comments: [],
    likedByUser: false,
  },
  {
    id: 6,
    title: "Sucesso no Boraween",
    content:
      "O evento temático Boraween foi um sucesso absoluto! A participação de toda a equipe e a criatividade nas fantasias tornaram este momento inesquecível.",
    type: "success",
    date: "2024-10-31",
    author: "Eventos & Planejamento",
    priority: "baixa",
    likes: 52,
    comments: [],
    likedByUser: false,
  },
  {
    id: 7,
    title: "Novembro Negro - Evento Inspirador",
    content:
      "O evento de Novembro Negro foi marcado por reflexões profundas, celebração da cultura afro-brasileira e momentos de conscientização.",
    type: "success",
    date: "2024-11-20",
    author: "Recursos Humanos & Eventos",
    priority: "baixa",
    likes: 67,
    comments: [],
    likedByUser: false,
  },
  {
    id: 8,
    title: "Centro Cultural de Santo Amaro - Visita Enriquecedora",
    content:
      "A visita ao Centro Cultural de Santo Amaro proporcionou à equipe momentos de aprendizado e conexão com a arte local.",
    type: "success",
    date: "2024-11-15",
    author: "Eventos & Comunicação",
    priority: "baixa",
    likes: 41,
    comments: [],
    likedByUser: false,
  },
  {
    id: 9,
    title: "Setembro Amarelo - Conscientização em Saúde Mental",
    content: "Nossa campanha de Setembro Amarelo foi fundamental para promover o diálogo sobre saúde mental.",
    type: "success",
    date: "2024-09-25",
    author: "Recursos Humanos",
    priority: "baixa",
    likes: 73,
    comments: [],
    likedByUser: false,
  },
]

function CommentInput({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim())
      setComment("")
    }
  }

  return (
    <div className="flex gap-2 mt-4">
      <Input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Escreva um comentário..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
      />
      <Button
        onClick={handleSubmit}
        disabled={!comment.trim()}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  )
}

function CommentsList({ comments, onDelete }: { comments: Comment[]; onDelete: (commentId: number) => void }) {
  if (comments.length === 0) return null

  return (
    <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
      <p className="text-sm font-medium text-gray-700">Comentários ({comments.length})</p>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 rounded-lg p-3 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{comment.author[0]}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">{comment.author}</span>
              <span className="text-xs text-gray-400">
                {new Date(comment.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <button
              onClick={() => onDelete(comment.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
              title="Excluir comentário"
            >
              <Send className="w-4 h-4 text-red-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 pl-8">{comment.text}</p>
        </div>
      ))}
    </div>
  )
}

export default function AvisosPage() {
  const [selectedFilter, setSelectedFilter] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [avisosList, setAvisosList] = useState<Aviso[]>(initialAvisos)
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())
  const [animatingLikes, setAnimatingLikes] = useState<Set<number>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem("borae-avisos")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAvisosList(
          parsed.map((a: Aviso) => ({
            ...a,
            comments: a.comments.map((c: Comment) => ({ ...c, timestamp: new Date(c.timestamp) })),
          })),
        )
      } catch (e) {
        console.error("Error loading saved avisos:", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("borae-avisos", JSON.stringify(avisosList))
  }, [avisosList])

  const handleLike = useCallback(
    (id: number) => {
      const aviso = avisosList.find((a) => a.id === id)
      const isLiking = !aviso?.likedByUser

      setAnimatingLikes((prev) => new Set(prev).add(id))

      setAvisosList((prev) =>
        prev.map((aviso) => {
          if (aviso.id === id) {
            return {
              ...aviso,
              likes: aviso.likedByUser ? aviso.likes - 1 : aviso.likes + 1,
              likedByUser: !aviso.likedByUser,
            }
          }
          return aviso
        }),
      )

      // Rastrear like/unlike
      if (aviso) {
        trackLike(id, aviso.title, isLiking ? "like" : "unlike")
      }

      setTimeout(() => {
        setAnimatingLikes((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, 300)
    },
    [avisosList],
  )

  const handleDeleteComment = useCallback((avisoId: number, commentId: number) => {
    setAvisosList((prev) =>
      prev.map((aviso) => {
        if (aviso.id === avisoId) {
          return {
            ...aviso,
            comments: aviso.comments.filter((c) => c.id !== commentId),
          }
        }
        return aviso
      }),
    )
  }, [])

  const handleAddComment = useCallback(
    (avisoId: number, content: string) => {
      if (!content) return

      const aviso = avisosList.find((a) => a.id === avisoId)

      setAvisosList((prev) =>
        prev.map((aviso) => {
          if (aviso.id === avisoId) {
            return {
              ...aviso,
              comments: [
                ...aviso.comments,
                {
                  id: Date.now(),
                  author: "Anônimo",
                  text: content,
                  timestamp: new Date(),
                },
              ],
            }
          }
          return aviso
        }),
      )

      // Rastrear comentário
      if (aviso) {
        trackComment(avisoId, aviso.title, "Anônimo")
      }
    },
    [avisosList],
  )

  const toggleComments = useCallback(
    (id: number) => {
      const isExpanding = !expandedComments.has(id)

      setExpandedComments((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })

      if (isExpanding) {
        const aviso = avisosList.find((a) => a.id === id)
        if (aviso) {
          trackEvent("avisos", "Expandiu comentários", { avisoId: id, avisoTitle: aviso.title })
        }
      }
    },
    [expandedComments, avisosList],
  )

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "urgent":
        return {
          icon: <Bell className="h-5 w-5 text-red-600" />,
          border: "border-l-4 border-l-red-500",
          badge: "bg-red-100 text-red-700 border-red-200",
          bg: "bg-red-50/50",
        }
      case "warning":
        return {
          icon: <Bell className="h-5 w-5 text-amber-600" />,
          border: "border-l-4 border-l-amber-500",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          bg: "bg-amber-50/50",
        }
      case "success":
        return {
          icon: <Bell className="h-5 w-5 text-emerald-600" />,
          border: "border-l-4 border-l-emerald-500",
          badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
          bg: "bg-emerald-50/50",
        }
      default:
        return {
          icon: <Bell className="h-5 w-5 text-blue-600" />,
          border: "border-l-4 border-l-blue-500",
          badge: "bg-blue-100 text-blue-700 border-blue-200",
          bg: "bg-blue-50/50",
        }
    }
  }

  const filteredAvisos = avisosList.filter((aviso) => {
    const matchesFilter = selectedFilter === "todos" || aviso.type === selectedFilter
    const matchesSearch =
      aviso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aviso.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mural de Avisos</h1>
              <p className="mt-1 text-gray-500">Comunicados oficiais e atualizações importantes.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Pesquisar avisos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <AnimatedLink href="/">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </AnimatedLink>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { key: "todos", label: "Todos" },
              { key: "urgent", label: "Urgente" },
              { key: "warning", label: "Atenção" },
              { key: "info", label: "Informativo" },
              { key: "success", label: "Sucesso" },
            ].map((filter) => (
              <Button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? "bg-gray-900 text-white shadow-md hover:bg-gray-800"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6">
          {filteredAvisos.map((aviso) => {
            const styles = getTypeStyles(aviso.type)
            const isExpanded = expandedComments.has(aviso.id)
            const isAnimating = animatingLikes.has(aviso.id)

            return (
              <div
                key={aviso.id}
                className={`border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${styles.border}`}
              >
                <div className="p-6 flex-1 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${styles.bg}`}>{styles.icon}</div>
                      <div>
                        <div className={`font-semibold ${styles.badge}`}>
                          {aviso.type === "urgent"
                            ? "URGENTE"
                            : aviso.type === "warning"
                              ? "ATENÇÃO"
                              : aviso.type === "success"
                                ? "SUCESSO"
                                : "INFO"}
                        </div>
                        <span className="ml-3 text-xs text-gray-500 flex items-center inline-flex">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(aviso.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{aviso.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{aviso.content}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(aviso.id)}
                        className={`flex items-center transition-all text-sm font-medium group ${
                          aviso.likedByUser ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 mr-1.5 transition-transform ${
                            isAnimating ? "scale-125" : "group-hover:scale-110"
                          } ${aviso.likedByUser ? "fill-blue-600" : ""}`}
                        />
                        <span className={isAnimating ? "font-bold" : ""}>{aviso.likes}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(aviso.id)}
                        className={`flex items-center transition-colors text-sm font-medium group ${
                          isExpanded ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                        {aviso.comments.length}
                      </button>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-900 mr-1">Publicado por:</span>
                      {aviso.author}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <CommentsList
                        comments={aviso.comments}
                        onDelete={(commentId) => handleDeleteComment(aviso.id, commentId)}
                      />
                      <CommentInput onSubmit={(content) => handleAddComment(aviso.id, content)} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredAvisos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhum aviso encontrado</h3>
            <p className="text-gray-500 mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </main>
    </div>
  )
}
