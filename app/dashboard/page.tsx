"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SiteHeader } from "@/components/site-header"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts"
import { CheckCircle2, AlertCircle, Users, Target, Activity, ArrowUpRight, CheckSquare } from "lucide-react"

const sectorData = [
  {
    id: "marketing",
    name: "Marketing",
    icon: "📢",
    color: "from-orange-500 to-red-500",
    progress: 75,
    team: 7,
    status: "Em Progresso",
    achievements: [
      "Arrumou-se a estética do material",
      "O nome da marca foi atualizado",
      "Foram criados posts para redes sociais",
    ],
    nextSteps: "No futuro, será desenvolvido conteúdo para TikTok",
    health: "good",
    tasks: [
      { name: "Estética do material", completed: true },
      { name: "Mudança de nome", completed: true },
      { name: "Posts em redes sociais", completed: true },
      { name: "Conteúdo para TikTok", completed: false },
    ],
  },
  {
    id: "pesquisa",
    name: "Pesquisa",
    icon: "🔍",
    color: "from-blue-500 to-cyan-500",
    progress: 85,
    team: 5,
    status: "Excelente",
    achievements: [
      "Análise profunda em 5 meses",
      "Demonstração de engajamento e pensamentos criativos",
      "Processo criativo com novas sugestões de eventos",
      "Participação ativa com outros setores",
      "Comprometimento com resultados",
    ],
    challenges:
      "Dificuldades de comunicação entre Desenvolvimento e Planejamento - alinhamento de prioridades necessário",
    nextSteps: "Reestruturação da comunicação com Planejamento",
    health: "warning",
    tasks: [
      { name: "Análise de dados", completed: true },
      { name: "Sugestões de eventos", completed: true },
      { name: "Comunicação com outros setores", completed: true },
      { name: "Alinhamento com Planejamento", completed: false },
    ],
  },
  {
    id: "planejamento",
    name: "Planejamento/Eventos",
    icon: "🎉",
    color: "from-purple-500 to-pink-500",
    progress: 80,
    team: 7,
    status: "Excelente",
    achievements: [
      "Evolução significativa desde o início",
      "Comunicação muito mais clara e eficiente",
      "Alinhamento melhorado das tarefas",
      "Fortalecimento do trabalho em equipe",
      "Entregas mais organizadas e assertivas",
    ],
    nextSteps: "Continuar mantendo a excelente comunicação e aprimorar processos",
    health: "good",
    tasks: [
      { name: "Comunicação clara", completed: true },
      { name: "Alinhamento de tarefas", completed: true },
      { name: "Planejamento de eventos", completed: true },
      { name: "Melhoria contínua de processos", completed: true },
    ],
  },
  {
    id: "ti",
    name: "Tecnologia da Informação",
    icon: "💻",
    color: "from-emerald-500 to-teal-500",
    progress: 90,
    team: 5,
    status: "Excelente",
    achievements: [
      "Criaram o site da organização",
      "Desenvolveram o organograma interativo",
      "Criaram o drive para organização de documentos",
    ],
    nextSteps: "Melhorias futuras e manutenção do sistema",
    health: "good",
    tasks: [
      { name: "Site da organização", completed: true },
      { name: "Organograma interativo", completed: true },
      { name: "Drive de documentos", completed: true },
      { name: "Manutenção do sistema", completed: false },
    ],
  },
  {
    id: "rh",
    name: "Recursos Humanos",
    icon: "👥",
    color: "from-rose-500 to-pink-600",
    progress: 65,
    team: 4,
    status: "Em Progresso",
    achievements: [
      "Controle completo do diário de bordo com revisões",
      "Aplicação de atividades e eventos (ex: Setembro Amarelo)",
      "Responsável por apresentações e eventos entre salas",
      "Acompanhamento do Clima Organizacional",
      "Trabalho em atualizações do site da Boraê",
      "Planejamento de reestruturações futuras nos departamentos",
    ],
    challenges: "Implementação futura de atividades internas para melhorar o clima organizacional",
    nextSteps: "Desenvolver atividades internas e preparar reestruturações departamentais",
    health: "good",
    tasks: [
      { name: "Controle do diário de bordo", completed: true },
      { name: "Aplicação de eventos", completed: true },
      { name: "Acompanhamento do clima organizacional", completed: true },
      { name: "Atualizações do site", completed: true },
      { name: "Atividades internas de clima", completed: false },
      { name: "Reestruturações departamentais", completed: false },
    ],
  },
  {
    id: "desenvolvimento",
    name: "Desenvolvimento",
    icon: "🚀",
    color: "from-indigo-500 to-violet-600",
    progress: 72,
    team: 6,
    status: "Em Progresso",
    achievements: [
      "Avanços significativos em organização interna",
      "Fortalecimento do trabalho em equipe e cooperação",
      "Melhoria na organização das tarefas e cumprimento de prazos",
      "Participação ativa na resolução de demandas de outros setores",
      "Demonstração de flexibilidade e comprometimento",
    ],
    challenges:
      "Dificuldade na comunicação com Pesquisa e Planejamento impactou alguns projetos estratégicos. Ausência de canal estruturado entre Gestão, Pesquisa, Planejamento e Desenvolvimento gera falhas na troca de informações",
    nextSteps: "Criar canais estruturados de comunicação e fluxos integrados entre áreas para otimizar próximos ciclos",
    health: "warning",
    tasks: [
      { name: "Organização interna", completed: true },
      { name: "Trabalho em equipe", completed: true },
      { name: "Cumprimento de prazos", completed: true },
      { name: "Participação em outros setores", completed: true },
      { name: "Canal de comunicação estruturado", completed: false },
      { name: "Fluxos integrados entre áreas", completed: false },
    ],
  },
]

export default function DashboardPage() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const [selectedSector, setSelectedSector] = useState<(typeof sectorData)[0] | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set([...prev, entry.target.id]))
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  const totalProgress = Math.round(sectorData.reduce((acc, s) => acc + s.progress, 0) / sectorData.length)
  const sectorsWithoutTasks = sectorData.filter((s) => s.health === "critical")
  const sectorsWithProgress = sectorData.filter((s) => s.health !== "critical")

  const donutData = [
    { name: "Completo", value: totalProgress, color: "#3b82f6" },
    { name: "Restante", value: 100 - totalProgress, color: "#e2e8f0" },
  ]

  const monthlyProgressData = [
    { month: "Mai", progresso: 55, meta: 60 },
    { month: "Jun", progresso: 62, meta: 65 },
    { month: "Jul", progresso: 68, meta: 70 },
    { month: "Ago", progresso: 73, meta: 75 },
    { month: "Set", progresso: 76, meta: 80 },
    { month: "Out", progresso: 79, meta: 85 },
    { month: "Nov", progresso: totalProgress, meta: 90 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Executivo</h1>
          <p className="mt-1 text-slate-500">Visão geral de desempenho e métricas da organização.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12%
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{totalProgress}%</div>
              <p className="text-sm text-slate-500">Progresso Geral</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">Ativos</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">48</div>
              <p className="text-sm text-slate-500">Colaboradores Totais</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12%
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {sectorData.filter((s) => s.health === "good").length}
              </div>
              <p className="text-sm text-slate-500">Setores em Dia</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Atenção</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {sectorData.filter((s) => s.health === "warning").length}
              </div>
              <p className="text-sm text-slate-500">Setores em Alerta</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Evolução Mensal</CardTitle>
              <CardDescription>Comparativo de progresso real vs meta esperada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="progresso"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorProgress)"
                      name="Progresso Real"
                    />
                    <Line
                      type="monotone"
                      dataKey="meta"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Meta Esperada"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution Chart */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Status Geral</CardTitle>
              <CardDescription>Distribuição de conclusão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-900">{totalProgress}%</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Concluído</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-slate-600">Tarefas Concluídas</span>
                  </div>
                  <span className="font-medium text-slate-900">{totalProgress}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-200 mr-2"></div>
                    <span className="text-slate-600">Pendentes</span>
                  </div>
                  <span className="font-medium text-slate-900">{100 - totalProgress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sectors Grid */}
        <h2 className="text-xl font-bold text-slate-900 mb-6">Detalhamento por Setor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sectorData.map((sector) => (
            <Card
              key={sector.id}
              className="border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
              onClick={() => setSelectedSector(sector)}
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${sector.color}`}></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-lg bg-slate-50 text-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {sector.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{sector.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          {sector.team} membros
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {sector.health === "good" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Progresso</span>
                    <span className="font-medium text-slate-900">{sector.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${sector.color} rounded-full transition-all duration-500`}
                      style={{ width: `${sector.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600 line-clamp-2">
                    <span className="font-medium text-slate-900">Próximo passo:</span> {sector.nextSteps}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nossa Organização em Números */}
        <Card className="border-slate-200 shadow-sm mb-8">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-slate-800">
              Nossa Organização em Números
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl font-bold text-white">6</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">Setores</span>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl font-bold text-white">48</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">Colaboradores</span>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl font-bold text-white">2</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">Diretores</span>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl font-bold text-white">2</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">Subdiretores</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Detail Modal */}
      <Dialog open={!!selectedSector} onOpenChange={() => setSelectedSector(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl">
          {selectedSector && (
            <>
              <div className={`h-24 bg-gradient-to-r ${selectedSector.color} relative`}>
                <div className="absolute -bottom-8 left-8 p-4 bg-white rounded-xl shadow-lg">
                  <div className="text-4xl">{selectedSector.icon}</div>
                </div>
              </div>

              <div className="pt-12 px-8 pb-8">
                <DialogHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-2xl font-bold text-slate-900 mb-1">
                        {selectedSector.name}
                      </DialogTitle>
                      <DialogDescription className="text-slate-500 flex items-center gap-2">
                        <Users className="w-4 h-4" /> {selectedSector.team} colaboradores
                      </DialogDescription>
                    </div>
                    <Badge
                      className={`text-sm px-3 py-1 ${
                        selectedSector.health === "good"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {selectedSector.status}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Progress Section */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-700">Progresso Atual</span>
                      <span className="font-bold text-slate-900">{selectedSector.progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${selectedSector.color}`}
                        style={{ width: `${selectedSector.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-blue-500" />
                      Conquistas Recentes
                    </h4>
                    <div className="grid gap-3">
                      {(Array.isArray(selectedSector.achievements)
                        ? selectedSector.achievements
                        : [selectedSector.achievements]
                      ).map((achievement, idx) => (
                        <div
                          key={idx}
                          className="flex items-start p-3 bg-white border border-slate-100 rounded-lg shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges */}
                  {selectedSector.challenges && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                        Pontos de Atenção
                      </h4>
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 leading-relaxed">
                        {selectedSector.challenges}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                      <CheckSquare className="w-4 h-4 mr-2 text-purple-500" />
                      Checklist de Entregas
                    </h4>
                    <div className="space-y-2">
                      {selectedSector.tasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-default"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                              task.completed ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300"
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span
                            className={`text-sm ${task.completed ? "text-slate-500 line-through" : "text-slate-700 font-medium"}`}
                          >
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
