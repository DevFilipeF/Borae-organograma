"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  Menu,
  X,
  Eye,
  Info,
  Mail,
  Bell,
  Calendar,
  CheckSquare,
  AlertCircle,
} from "lucide-react"

const setoresComTarefas = [
  {
    id: "rh",
    nome: "Recursos Humanos",
    icon: "👥",
    color: "from-pink-400 to-pink-500",
    progresso: 0,
    tarefas: [
      { nome: "Relatório de resultados nos 3 primeiros meses trabalhados", concluida: false },
      { nome: "Descrição de funções", concluida: false },
      { nome: "Preparar dinâmicas que fortaleçam o Clima Organizacional", concluida: false },
    ],
  },
  {
    id: "marketing",
    nome: "Marketing",
    icon: "📢",
    color: "from-orange-400 to-orange-500",
    progresso: 75,
    tarefas: [
      { nome: "Relatório de resultados nos 3 primeiros meses trabalhados", concluida: true },
      { nome: "Encaminhar as métricas da rede social da Boraê", concluida: true },
      { nome: "Procurar e enviar fotos dos eventos já realizados que serão recém adicionados", concluida: true },
    ],
  },
  {
    id: "ti",
    nome: "Tecnologia da Informação",
    icon: "💻",
    color: "from-cyan-400 to-cyan-500",
    progresso: 90,
    tarefas: [
      { nome: "Relatório de resultados nos 3 primeiros meses trabalhados", concluida: true },
      { nome: "Atualização do site", concluida: true },
      { nome: "Dividir funções", concluida: false },
    ],
  },
  {
    id: "pesquisa-planejamento",
    nome: "Pesquisa e Planejamento",
    icon: "🔍",
    color: "from-blue-400 to-blue-500",
    progresso: 85,
    tarefas: [
      { nome: "Relatório de resultados nos 3 primeiros meses trabalhados", concluida: true },
      { nome: "Pesquisar e, com aval, Planejar próximas visitas externas", concluida: true },
      { nome: "Pesquisar e, com aval, Planejar próximos eventos", concluida: true },
    ],
  },
  {
    id: "desenvolvimento",
    nome: "Desenvolvimento",
    icon: "🚀",
    color: "from-indigo-400 to-indigo-500",
    progresso: 0,
    tarefas: [
      { nome: "Relatório de resultados nos 3 primeiros meses trabalhados", concluida: false },
      {
        nome: "Analisar a Viabilidade do que foi pesquisado pela equipe de Pesquisa e aprovar caso seja possível",
        concluida: false,
      },
      {
        nome: "Se for viável, acompanhar, a partir da aprovação, para que seja desenvolvido da forma mais eficaz possível",
        concluida: false,
      },
    ],
  },
]

export default function TarefasPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedSetor, setSelectedSetor] = useState<(typeof setoresComTarefas)[0] | null>(null)

  const navigationItems = [
    { href: "/", label: "Início", icon: Users },
    { href: "/organograma", label: "Organograma", icon: Users },
    { href: "/dashboard", label: "Dashboard", icon: CheckSquare },
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/avisos", label: "Avisos", icon: Bell },
    { href: "/sobre", label: "Sobre", icon: Info },
    { href: "/contato", label: "Contato", icon: Mail },
  ]

  const setoresComAtraso = setoresComTarefas.filter((s) => s.progresso === 0)
  const setoresEmProgresso = setoresComTarefas.filter((s) => s.progresso > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <style jsx global>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card-modern {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <Image
                src="/nova-logo-borae.png"
                alt="BORAÊ Logo"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
              />
            </div>

            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs xl:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors ${
                      item.href === "/tarefas" ? "text-gray-900 font-semibold" : ""
                    }`}
                  >
                    <item.icon className="w-3 h-3 xl:w-4 xl:h-4 mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {isMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-sm ${
                        item.href === "/tarefas"
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header da Página */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="glass-effect border-white/30 hover:bg-white/20 bg-transparent text-xs sm:text-sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 flex items-center">
                <CheckSquare className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mr-2 sm:mr-3 lg:mr-4 text-gray-600" />
                Tarefas por Setor
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                Acompanhe as atividades e progresso de cada departamento
              </p>
            </div>
          </div>
        </div>

        {/* Setores com Progresso */}
        {setoresEmProgresso.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Setores em Andamento</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {setoresEmProgresso.map((setor) => (
                <Card key={setor.id} className="card-modern hover-lift border-0 overflow-hidden">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${setor.color} opacity-5`}></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4 sm:mb-6">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-r ${setor.color} flex items-center justify-center text-xl sm:text-2xl shadow-lg`}
                          >
                            {setor.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg lg:text-xl text-slate-900">
                              {setor.nome}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="text-xs mt-1 bg-green-50 text-green-700 border-green-200"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {setor.progresso}% Concluído
                            </Badge>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-slate-100 text-slate-600"
                              onClick={() => setSelectedSetor(setor)}
                            >
                              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${setor.color} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${setor.progresso}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 sm:mb-3">Tarefas</h4>
                      <ul className="space-y-2">
                        {setor.tarefas.map((tarefa, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                tarefa.concluida ? "bg-green-500" : "bg-slate-300"
                              }`}
                            >
                              {tarefa.concluida && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <span
                              className={`${
                                tarefa.concluida ? "text-slate-500 line-through" : "text-slate-700 font-medium"
                              }`}
                            >
                              {tarefa.nome}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 sm:pt-4 border-t border-slate-200">
                      <p className="text-xs sm:text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">
                          {setor.tarefas.filter((t) => t.concluida).length}/{setor.tarefas.length}
                        </span>{" "}
                        tarefas concluídas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Setores com Atraso */}
        {setoresComAtraso.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
              ⚠️ Setores que Precisam Iniciar
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {setoresComAtraso.map((setor) => (
                <Card
                  key={setor.id}
                  className="card-modern hover-lift border-0 overflow-hidden border-l-4 border-red-500 opacity-75"
                >
                  <CardHeader className="pb-4 sm:pb-6 bg-red-50/30">
                    <div className={`absolute inset-0 bg-gradient-to-r ${setor.color} opacity-3`}></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4 sm:mb-6">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-r ${setor.color} flex items-center justify-center text-xl sm:text-2xl shadow-lg opacity-60`}
                          >
                            {setor.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg lg:text-xl text-slate-900">
                              {setor.nome}
                            </CardTitle>
                            <Badge className="text-xs mt-1 bg-red-100 text-red-700 border-red-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Sem Progresso
                            </Badge>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-slate-100 text-slate-600"
                              onClick={() => setSelectedSetor(setor)}
                            >
                              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                          <div
                            className="bg-red-300 h-full rounded-full transition-all duration-500"
                            style={{ width: "0%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800 font-medium">
                        Este setor ainda não iniciou suas tarefas e precisa de atenção prioritária.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 sm:mb-3">
                        Tarefas Pendentes
                      </h4>
                      <ul className="space-y-2">
                        {setor.tarefas.map((tarefa, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm">
                            <Clock className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{tarefa.nome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedSetor} onOpenChange={(open) => !open && setSelectedSetor(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSetor && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${selectedSetor.color} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {selectedSetor.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedSetor.nome}</DialogTitle>
                    <Badge className="text-xs mt-1 bg-green-50 text-green-700 border-green-200">
                      {selectedSetor.progresso}% Concluído
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">Progresso do Setor</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Conclusão Geral</span>
                    <span className="text-2xl font-bold text-slate-900">{selectedSetor.progresso}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${selectedSetor.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${selectedSetor.progresso}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedSetor.tarefas.filter((t) => t.concluida).length}/{selectedSetor.tarefas.length}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Tarefas Concluídas</div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">Tarefas Detalhadas</h3>
                  <div className="space-y-2">
                    {selectedSetor.tarefas.map((tarefa, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            tarefa.concluida ? "bg-green-500" : "bg-slate-300"
                          }`}
                        >
                          {tarefa.concluida && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <span
                          className={`text-sm ${
                            tarefa.concluida ? "text-slate-500 line-through" : "text-slate-800 font-medium"
                          }`}
                        >
                          {tarefa.nome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8 mt-12 sm:mt-16">
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
              <span className="text-gray-600 text-xs sm:text-sm text-center">
                © 2025 BORAÊ. Todos os direitos reservados.
              </span>
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <Link href="/sobre" className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-colors">
                Sobre
              </Link>
              <Link href="/contato" className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-colors">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
