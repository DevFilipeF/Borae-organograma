"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  Monitor,
  Activity,
  ArrowLeft,
  Heart,
  MessageSquare,
  Bot,
  Pencil,
  Trash2,
  X,
  Check,
  Calendar,
  Clock,
  Shield,
  Lock,
  FileCheck,
  AlertTriangle,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { createClient } from "@/lib/supabase/client"

interface Comment {
  id: string
  content: string
  author_name: string
  created_at: string
  aviso_id?: number
  event_id?: number
}

interface BorusInteraction {
  id: string
  question: string
  response_type: string
  was_helpful: boolean | null
  created_at: string
  session_id: string
}

interface AnalyticsData {
  totalPageViews: number
  uniqueVisitors: number
  totalSessions: number
  activeNow: number
  pageViewsToday: number
  pageViewsYesterday: number
  topPages: { page: string; views: number; percentage: number }[]
  devices: { name: string; value: number; color: string }[]
  browsers: { name: string; value: number }[]
  borusQuestions: { question: string; count: number; type: string }[]
  dailyViews: { date: string; views: number; visitors: number }[]
  recentEvents: {
    id: number
    type: string
    name: string
    page: string
    time: string
    metadata?: Record<string, unknown>
  }[]
  totalClicks: number
  totalLikes: number
  avisosLikes: number
  eventLikes: number
  totalComments: number
  avisosComments: number
  eventComments: number
  borusInteractions: number
  borusInteractionsData: BorusInteraction[]
  allAvisosComments: Comment[]
  allEventComments: Comment[]
  allAvisosLikes: { id: string; aviso_id: number; created_at: string; session_id: string }[]
  allEventLikes: { id: string; event_id: number; created_at: string; session_id: string; user_name: string }[]
}

export default function InsightsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showLgpd, setShowLgpd] = useState(true) // Always show LGPD modal on page load

  const supabase = createClient()

  const acceptLgpd = () => {
    setShowLgpd(false)
  }

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/insights/comments")
      const result = await response.json()
      if (result.avisosComments || result.eventComments) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                allAvisosComments: result.avisosComments || prev.allAvisosComments,
                allEventComments: result.eventComments || prev.allEventComments,
                avisosComments: result.avisosComments?.length || prev.avisosComments,
                eventComments: result.eventComments?.length || prev.eventComments,
                totalComments: (result.avisosComments?.length || 0) + (result.eventComments?.length || 0),
              }
            : prev,
        )
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleDeleteComment = async (id: string, type: "aviso" | "event") => {
    if (type === "aviso") {
      setData((prev) =>
        prev
          ? {
              ...prev,
              allAvisosComments: prev.allAvisosComments.filter((c) => c.id !== id),
              avisosComments: prev.avisosComments - 1,
              totalComments: prev.totalComments - 1,
            }
          : prev,
      )
    } else {
      setData((prev) =>
        prev
          ? {
              ...prev,
              allEventComments: prev.allEventComments.filter((c) => c.id !== id),
              eventComments: prev.eventComments - 1,
              totalComments: prev.totalComments - 1,
            }
          : prev,
      )
    }

    // Call API in background
    try {
      await fetch("/api/insights/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      // If error, refresh to restore actual state
      fetchComments()
    }
  }

  const handleEditComment = async (id: string, type: "aviso" | "event") => {
    if (type === "aviso") {
      setData((prev) =>
        prev
          ? {
              ...prev,
              allAvisosComments: prev.allAvisosComments.map((c) => (c.id === id ? { ...c, content: editContent } : c)),
            }
          : prev,
      )
    } else {
      setData((prev) =>
        prev
          ? {
              ...prev,
              allEventComments: prev.allEventComments.map((c) => (c.id === id ? { ...c, content: editContent } : c)),
            }
          : prev,
      )
    }

    setEditingComment(null)
    setEditContent("")

    // Call API in background
    try {
      await fetch("/api/insights/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, content: editContent }),
      })
    } catch (error) {
      console.error("Error updating comment:", error)
      fetchComments()
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics/stats")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Realtime subscriptions
    const likesChannel = supabase
      .channel("likes-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "likes" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "event_likes" }, () => fetchData())
      .subscribe()

    const commentsChannel = supabase
      .channel("comments-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => fetchComments())
      .on("postgres_changes", { event: "*", schema: "public", table: "event_comments" }, () => fetchComments())
      .subscribe()

    const borusChannel = supabase
      .channel("borus-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "borus_interactions" }, () => fetchData())
      .subscribe()

    return () => {
      supabase.removeChannel(likesChannel)
      supabase.removeChannel(commentsChannel)
      supabase.removeChannel(borusChannel)
    }
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <>
      {/* LGPD Modal */}
      <AnimatePresence>
        {showLgpd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-lg w-full"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-4">Proteção de Dados - LGPD</h2>

              <p className="text-slate-400 text-center mb-6">
                Os dados apresentados neste painel são tratados com total confidencialidade e em conformidade com a Lei
                Geral de Proteção de Dados (LGPD).
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <Lock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300">Dados Criptografados</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <FileCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300">Acesso Restrito</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300">Sigilo Total</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300">Uso Interno</p>
                </div>
              </div>

              <Button
                onClick={acceptLgpd}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3"
              >
                Entendi e Aceito
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-stone-500 to-stone-700 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">BORAÊ Insights</h1>
                    <p className="text-xs text-slate-400">Analytics em tempo real</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                  <Activity className="w-3 h-3 mr-1" />
                  {data?.activeNow || 0} online
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10">
              <CardContent className="p-4">
                <Eye className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-white">{formatNumber(data?.totalPageViews ?? 0)}</p>
                <p className="text-xs text-blue-300">Visualizações</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10">
              <CardContent className="p-4">
                <Users className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-2xl font-bold text-white">{formatNumber(data?.uniqueVisitors ?? 0)}</p>
                <p className="text-xs text-emerald-300">Visitantes</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10">
              <CardContent className="p-4">
                <MousePointerClick className="w-5 h-5 text-amber-400 mb-2" />
                <p className="text-2xl font-bold text-white">{formatNumber(data?.totalClicks ?? 0)}</p>
                <p className="text-xs text-amber-300">Cliques</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-pink-500/50 shadow-lg shadow-pink-500/10">
              <CardContent className="p-4">
                <Heart className="w-5 h-5 text-pink-400 mb-2" />
                <p className="text-2xl font-bold text-white">{formatNumber(data?.totalLikes ?? 0)}</p>
                <p className="text-xs text-pink-300">Curtidas</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/10">
              <CardContent className="p-4">
                <MessageSquare className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">{formatNumber(data?.totalComments ?? 0)}</p>
                <p className="text-xs text-purple-300">Comentários</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
              <CardContent className="p-4">
                <Bot className="w-5 h-5 text-cyan-400 mb-2" />
                <p className="text-2xl font-bold text-white">{formatNumber(data?.borusInteractions ?? 0)}</p>
                <p className="text-xs text-cyan-300">BORUS</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-800 border border-slate-700 p-1">
              <TabsTrigger
                value="overview"
                className="text-slate-300 data-[state=active]:bg-stone-600 data-[state=active]:text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="engagement"
                className="text-slate-300 data-[state=active]:bg-stone-600 data-[state=active]:text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                Engajamento
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="text-slate-300 data-[state=active]:bg-stone-600 data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Comentários
              </TabsTrigger>
              <TabsTrigger
                value="borus"
                className="text-slate-300 data-[state=active]:bg-stone-600 data-[state=active]:text-white"
              >
                <Bot className="w-4 h-4 mr-2" />
                BORUS
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Daily Views Chart */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Visualizações (7 dias)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={data?.dailyViews || []}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#3b82f6"
                          fill="url(#colorViews)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Devices Chart */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-emerald-400" />
                      Dispositivos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={data?.devices || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {(data?.devices || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      {(data?.devices || []).map((device, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                          <span className="text-sm text-slate-300">
                            {device.name} ({device.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Pages */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    Páginas Mais Visitadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(data?.topPages || []).map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                            {index + 1}
                          </span>
                          <span className="text-slate-200">{page.page}</span>
                        </div>
                        <span className="text-slate-300 font-medium">{page.views} views</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">{data?.avisosLikes ?? 0}</p>
                    <p className="text-sm text-slate-400">Curtidas em Avisos</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">{data?.eventLikes ?? 0}</p>
                    <p className="text-sm text-slate-400">Curtidas em Eventos</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">{data?.avisosComments ?? 0}</p>
                    <p className="text-sm text-slate-400">Comentários em Avisos</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">{data?.eventComments ?? 0}</p>
                    <p className="text-sm text-slate-400">Comentários em Eventos</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Likes */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Curtidas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[
                      ...(data?.allAvisosLikes || []).map((l) => ({ ...l, type: "aviso" })),
                      ...(data?.allEventLikes || []).map((l) => ({ ...l, type: "event" })),
                    ]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 20)
                      .map((like, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 text-pink-400" />
                            <span className="text-sm text-white">
                              {like.type === "event" && "user_name" in like ? like.user_name : "Anônimo"}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {like.type === "aviso" ? `Aviso #${like.aviso_id}` : `Evento #${(like as any).event_id}`}
                            </Badge>
                          </div>
                          <span className="text-xs text-slate-500">{formatDate(like.created_at)}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Avisos Comments */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      Comentários em Avisos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {(data?.allAvisosComments || []).map((comment) => (
                        <div key={comment.id} className="p-4 bg-slate-800/50 rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-white font-medium">{comment.author_name}</p>
                              <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {editingComment === comment.id ? (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-emerald-400 hover:text-emerald-300"
                                    onClick={() => handleEditComment(comment.id, "aviso")}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-slate-400 hover:text-slate-300"
                                    onClick={() => setEditingComment(null)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-blue-400 hover:text-blue-300"
                                    onClick={() => {
                                      setEditingComment(comment.id)
                                      setEditContent(comment.content)
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-red-400 hover:text-red-300"
                                    onClick={() => handleDeleteComment(comment.id, "aviso")}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          {editingComment === comment.id ? (
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          ) : (
                            <p className="text-slate-300 text-sm">{comment.content}</p>
                          )}
                        </div>
                      ))}
                      {(data?.allAvisosComments || []).length === 0 && (
                        <p className="text-slate-500 text-center py-8">Nenhum comentário em avisos</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Event Comments */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-violet-400" />
                      Comentários em Eventos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {(data?.allEventComments || []).map((comment) => (
                        <div key={comment.id} className="p-4 bg-slate-800/50 rounded-xl">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-white font-medium">{comment.author_name}</p>
                              <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {editingComment === comment.id ? (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-emerald-400 hover:text-emerald-300"
                                    onClick={() => handleEditComment(comment.id, "event")}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-slate-400 hover:text-slate-300"
                                    onClick={() => setEditingComment(null)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-blue-400 hover:text-blue-300"
                                    onClick={() => {
                                      setEditingComment(comment.id)
                                      setEditContent(comment.content)
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-red-400 hover:text-red-300"
                                    onClick={() => handleDeleteComment(comment.id, "event")}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          {editingComment === comment.id ? (
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          ) : (
                            <p className="text-slate-300 text-sm">{comment.content}</p>
                          )}
                        </div>
                      ))}
                      {(data?.allEventComments || []).length === 0 && (
                        <p className="text-slate-500 text-center py-8">Nenhum comentário em eventos</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* BORUS Tab */}
            <TabsContent value="borus" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bot className="w-5 h-5 text-cyan-400" />
                      Estatísticas do BORUS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800 rounded-xl text-center border border-slate-700">
                        <p className="text-3xl font-bold text-white">{data?.borusInteractions ?? 0}</p>
                        <p className="text-sm text-slate-300">Total de Interações</p>
                      </div>
                      <div className="p-4 bg-slate-800 rounded-xl text-center border border-slate-700">
                        <p className="text-3xl font-bold text-white">{(data?.borusQuestions || []).length}</p>
                        <p className="text-sm text-slate-300">Perguntas Únicas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      Perguntas Mais Frequentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(data?.borusQuestions || []).map((q, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-slate-800 rounded-lg border border-slate-700"
                        >
                          <span className="text-sm text-slate-200 truncate flex-1">{q.question}</span>
                          <Badge variant="outline" className="ml-2 border-purple-500/50 text-purple-300">
                            {q.count}x
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* BORUS Interactions History */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Histórico de Perguntas ao BORUS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {(data?.borusInteractionsData || []).map((interaction) => (
                      <div key={interaction.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white">{interaction.question}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                {interaction.response_type || "general"}
                              </Badge>
                              {interaction.was_helpful !== null && (
                                <Badge
                                  variant={interaction.was_helpful ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {interaction.was_helpful ? "Útil" : "Não útil"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">{formatDate(interaction.created_at)}</span>
                        </div>
                      </div>
                    ))}
                    {(data?.borusInteractionsData || []).length === 0 && (
                      <p className="text-slate-400 text-center py-8">Nenhuma interação registrada</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  )
}
