"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Expand, Minimize2, ThumbsUp, ThumbsDown, Copy, Check, ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  feedback?: "positive" | "negative"
}

// Base de conhecimento BORUS expandida
const knowledgeBase = [
  // Sobre o BORUS
  {
    keywords: [
      "quem é você",
      "o que é borus",
      "quem é o borus",
      "se apresente",
      "qual seu nome",
      "você é quem",
      "quem você é",
    ],
    response:
      "Olá! Eu sou o **BORUS** (Bot for Organizational Research & Unified Support), o assistente virtual oficial da BORAÊ! Fui criado para ajudar colaboradores e visitantes a encontrar informações sobre nossa empresa, estrutura organizacional, eventos, departamentos e muito mais. Estou sempre aqui para ajudar!",
  },
  {
    keywords: [
      "quem te criou",
      "quem fez você",
      "quem desenvolveu",
      "criador",
      "desenvolvedor",
      "quem te fez",
      "quem criou você",
    ],
    response:
      "Fui desenvolvido com muito carinho pelo **Filipe Ferreira**, um talentoso membro da equipe de Tecnologia da Informação da BORAÊ! Ele trabalhou arduamente no meu desenvolvimento, implementando inteligência artificial e uma ampla base de conhecimento para que eu pudesse ajudar todos os colaboradores e visitantes da nossa empresa de forma eficiente e amigável!",
  },
  {
    keywords: ["o que você faz", "qual sua função", "pra que serve", "para que serve", "sua utilidade"],
    response:
      "Minha função é ser seu guia virtual na BORAÊ! Posso ajudar você com:\n\n• **Informações sobre a empresa** - História, missão e valores\n• **Estrutura organizacional** - Departamentos e colaboradores\n• **Eventos** - Agenda e informações sobre eventos\n• **Contato** - Como falar com a equipe\n• **Navegação** - Te guiar pelo site\n\nÉ só perguntar!",
  },

  // Sobre a BORAÊ
  {
    keywords: [
      "o que é boraê",
      "sobre a boraê",
      "empresa boraê",
      "borae",
      "o que é a boraê",
      "me fale sobre a boraê",
      "conta sobre a boraê",
    ],
    response:
      "A **BORAÊ** é uma empresa de eventos e promoção cultural comprometida em valorizar a cultura brasileira. Nosso slogan é **'Onde a cultura encontra você'**. Trabalhamos para criar experiências culturais memoráveis e conectar pessoas através de eventos únicos que celebram a diversidade e riqueza cultural do nosso país!",
  },
  {
    keywords: ["slogan", "lema", "frase da empresa", "motto"],
    response:
      "O slogan da BORAÊ é: **'Onde a cultura encontra você'** - Uma frase que representa nossa missão de levar cultura e experiências únicas para todas as pessoas!",
  },
  {
    keywords: ["missão", "visão", "valores", "propósito"],
    response:
      "A **missão** da BORAÊ é promover e valorizar a cultura brasileira através de eventos memoráveis. Nossa **visão** é ser referência em experiências culturais que conectam pessoas. Nossos **valores** incluem:\n\n• Valorização da cultura brasileira\n• Excelência em eventos\n• Inovação e criatividade\n• Trabalho em equipe\n• Compromisso com a comunidade",
  },

  // Departamentos
  {
    keywords: ["departamentos", "setores", "áreas", "quantos departamentos", "quais setores", "divisões"],
    response:
      "A BORAÊ possui **6 departamentos principais**:\n\n• **Recursos Humanos (RH)** - Gestão de pessoas e cultura organizacional\n• **Tecnologia da Informação (TI)** - Sistemas, inovação e suporte técnico\n• **Marketing** - Comunicação, marca e divulgação\n• **Planejamento/Eventos** - Organização e execução de eventos\n• **Desenvolvimento** - Projetos e crescimento estratégico\n• **Pesquisa** - Análise de dados e estudos de mercado",
  },
  {
    keywords: ["rh", "recursos humanos", "setor de rh", "departamento rh", "fale sobre o rh", "sobre o rh"],
    response:
      "O **Departamento de Recursos Humanos (RH)** é o coração da gestão de pessoas da BORAÊ! \n\n**Gestor:** Layne Rodrigues\n\n**Responsabilidades do setor:**\n• Recrutamento e seleção de novos talentos\n• Desenvolvimento e capacitação de colaboradores\n• Gestão do clima organizacional\n• Administração de benefícios e folha de pagamento\n• Políticas de bem-estar e qualidade de vida\n• Integração de novos membros à equipe\n\nO RH é responsável pela coordenação geral da gestão de pessoas e pelo direcionamento das políticas organizacionais da empresa!",
  },
  {
    keywords: ["ti", "tecnologia", "informação", "setor de ti", "departamento ti", "tecnologia da informação"],
    response:
      "O **Departamento de Tecnologia da Informação** cuida dos sistemas, inovação e suporte técnico da BORAÊ. O gestor é **José Elias**, que lidera projetos de tecnologia, desenvolvimento de sistemas internos e manutenção da infraestrutura digital da empresa.",
  },
  {
    keywords: ["marketing", "setor de marketing", "departamento marketing", "comunicação"],
    response:
      "O **Departamento de Marketing** é responsável pela comunicação, gestão da marca e divulgação da BORAÊ. A gestora é **Giulia Ferro**, que coordena campanhas, estratégias de comunicação e posicionamento da marca no mercado.",
  },
  {
    keywords: ["eventos", "planejamento", "setor de eventos", "departamento eventos"],
    response:
      "O **Departamento de Planejamento/Eventos** cuida da organização e execução de todos os eventos da BORAÊ. A gestora é **Karoline Xavier**, que coordena desde o planejamento até a realização de experiências culturais memoráveis.",
  },
  {
    keywords: ["desenvolvimento", "setor de desenvolvimento", "departamento desenvolvimento", "projetos"],
    response:
      "O **Departamento de Desenvolvimento** é responsável por projetos e crescimento estratégico da BORAÊ. O gestor é **Pablo Ackillys**, que lidera iniciativas de expansão e novos projetos da empresa.",
  },
  {
    keywords: ["pesquisa", "setor de pesquisa", "departamento pesquisa", "análise", "dados"],
    response:
      "O **Departamento de Pesquisa** realiza análise de dados e estudos de mercado para a BORAÊ. A gestora é **Thifany Nicoly Gama**, que coordena pesquisas, coleta de dados e geração de insights estratégicos para a empresa.",
  },

  // Gestores
  {
    keywords: ["gestores", "líderes", "coordenadores", "chefes", "quem são os gestores"],
    response:
      "Os **gestores** da BORAÊ são:\n\n• **Layne Rodrigues** - Gestor de RH\n• **José Elias** - Gestor de TI\n• **Giulia Ferro** - Gestora de Marketing\n• **Karoline Xavier** - Gestora de Eventos\n• **Pablo Ackillys** - Gestor de Desenvolvimento\n• **Thifany Nicoly Gama** - Gestora de Pesquisa",
  },
  {
    keywords: ["layne", "layne rodrigues"],
    response:
      "**Layne Rodrigues** é o Gestor de Recursos Humanos da BORAÊ. Ele é responsável pela coordenação geral do setor de RH e pelo direcionamento das políticas de gestão de pessoas da empresa.",
  },
  {
    keywords: ["josé", "jose", "josé elias", "jose elias"],
    response:
      "**José Elias** é o Gestor de Tecnologia da Informação da BORAÊ. Ele é responsável pela coordenação geral do setor de TI e pelo direcionamento tecnológico da empresa.",
  },
  {
    keywords: ["giulia", "giulia ferro"],
    response:
      "**Giulia Ferro** é a Gestora de Marketing da BORAÊ. Ela é responsável pela coordenação geral do setor de Marketing e pelo direcionamento das estratégias de comunicação da empresa.",
  },
  {
    keywords: ["karoline", "karoline xavier"],
    response:
      "**Karoline Xavier** é a Gestora de Planejamento/Eventos da BORAÊ. Ela é responsável pela coordenação geral do setor de Eventos e pelo direcionamento das produções culturais da empresa.",
  },
  {
    keywords: ["pablo", "pablo ackillys"],
    response:
      "**Pablo Ackillys** é o Gestor de Desenvolvimento da BORAÊ. Ele é responsável pela coordenação geral do setor de Desenvolvimento e pelo direcionamento dos projetos estratégicos da empresa.",
  },
  {
    keywords: ["thifany", "thifany nicoly", "thifany gama"],
    response:
      "**Thifany Nicoly Gama** é a Gestora de Pesquisa da BORAÊ. Ela é responsável pela coordenação geral do setor de Pesquisa e pelo direcionamento das análises e estudos da empresa.",
  },

  // Diretoria
  {
    keywords: ["diretoria", "diretor", "diretores", "presidente", "ceo", "liderança"],
    response:
      "A **Diretoria** da BORAÊ é responsável pelas decisões estratégicas e pelo direcionamento geral da empresa. A diretoria trabalha em conjunto com todos os gestores de departamento para garantir o sucesso das operações e a realização da missão da empresa.",
  },

  // Navegação do site
  {
    keywords: ["organograma", "estrutura", "hierarquia", "ver organograma"],
    response:
      "Você pode visualizar nosso **organograma completo** acessando a página **Organograma** no menu principal. Lá você encontrará a estrutura hierárquica da empresa, desde a Diretoria até todos os departamentos e colaboradores com suas respectivas funções!",
  },
  {
    keywords: ["eventos página", "próximos eventos", "agenda eventos", "ver eventos"],
    response:
      "Para ver todos os **eventos** da BORAÊ, acesse a página **Eventos** no menu principal. Lá você encontrará informações sobre eventos passados e futuros, podendo curtir e comentar em cada um deles!",
  },
  {
    keywords: ["contato página", "falar com", "telefone", "email", "como contato", "entrar em contato"],
    response:
      "Você pode entrar em contato com a BORAÊ através da página **Contato** no menu principal. Lá você encontrará formulários e informações para falar diretamente com nossa equipe!",
  },
  {
    keywords: ["avisos página", "comunicados", "novidades", "ver avisos"],
    response:
      "Para ver os **avisos e comunicados** oficiais da BORAÊ, acesse a página **Avisos** no menu principal. Lá você encontrará as últimas novidades e informações importantes para todos os colaboradores!",
  },
  {
    keywords: ["dashboard página", "métricas", "estatísticas", "ver dashboard"],
    response:
      "O **Dashboard** da BORAÊ apresenta métricas e estatísticas sobre os departamentos e a empresa. É uma ferramenta para acompanhar o desempenho e a evolução da organização!",
  },
  {
    keywords: ["navegar", "como usar", "site", "páginas", "menu"],
    response:
      "O site da BORAÊ possui as seguintes páginas principais:\n\n• **Início** - Página inicial com destaques\n• **Organograma** - Estrutura da empresa\n• **Eventos** - Agenda de eventos\n• **Avisos** - Comunicados oficiais\n• **Contato** - Fale conosco\n• **Dashboard** - Métricas e estatísticas\n\nUse o menu no topo para navegar!",
  },

  // Saudações e despedidas
  {
    keywords: ["obrigado", "valeu", "agradeço", "thanks", "obrigada"],
    response:
      "Por nada! Fico muito feliz em ajudar! Se tiver mais alguma dúvida sobre a BORAÊ, é só perguntar. Estou sempre aqui para você! 😊",
  },
  {
    keywords: ["oi", "olá", "hey", "eai", "e aí", "ola", "bom dia", "boa tarde", "boa noite"],
    response:
      "Olá! Tudo bem? Sou o **BORUS**, assistente virtual da BORAÊ! Como posso ajudar você hoje? Pode me perguntar sobre a empresa, departamentos, eventos, colaboradores e muito mais!",
  },
  {
    keywords: ["tchau", "até mais", "bye", "adeus", "até logo", "flw", "falou"],
    response:
      "Até mais! Foi um prazer ajudar você! Sempre que precisar de informações sobre a BORAÊ, estarei aqui. Tenha um ótimo dia! 👋",
  },

  // Colaboradores específicos
  {
    keywords: ["filipe", "filipe ferreira"],
    response:
      "**Filipe Ferreira** é membro da equipe de Tecnologia da Informação da BORAÊ e foi o responsável pelo meu desenvolvimento! Ele trabalha com sistemas e inovação tecnológica na empresa.",
  },
  {
    keywords: ["ana clara", "ana clara pereira"],
    response:
      "**Ana Clara Pereira da Silva** é Coordenadora de Pesquisa na BORAÊ. Ela organiza cronogramas, métodos e estratégias investigativas do departamento de Pesquisa.",
  },
  {
    keywords: ["iago", "iago lima"],
    response:
      "**Iago Lima Flores** é Pesquisador de Campo na BORAÊ. Ele realiza coletas, entrevistas e levantamentos externos para o departamento de Pesquisa.",
  },
  {
    keywords: ["willian", "willian marques"],
    response:
      "**Willian Marques Barbosa** é Analista de Dados na BORAÊ. Ele compila informações, gera relatórios e interpreta resultados para o departamento de Pesquisa.",
  },
  {
    keywords: ["yuri", "yuri nascimento"],
    response:
      "**Yuri Nascimento** é Coordenador de Operações de Pesquisa na BORAÊ. Ele lidera a logística, organização e suporte estratégico às atividades do setor de Pesquisa.",
  },
  {
    keywords: ["mariana", "mariana gonçalves"],
    response:
      "**Mariana Gonçalves** é Coordenadora de Projetos na BORAÊ. Ela supervisiona a execução dos estudos e garante a qualidade das entregas do departamento de Pesquisa.",
  },

  // Perguntas gerais
  {
    keywords: ["quantas pessoas", "quantos colaboradores", "funcionários", "equipe"],
    response:
      "A BORAÊ conta com uma equipe diversificada de colaboradores distribuídos em 6 departamentos. Para ver todos os membros da equipe e suas funções, acesse a página **Organograma** no menu principal!",
  },
  {
    keywords: ["trabalhar", "vagas", "emprego", "oportunidades", "carreira"],
    response:
      "Interessado em trabalhar na BORAÊ? Fique de olho em nossas redes sociais e na página de **Contato** para informações sobre oportunidades de emprego. Também pode entrar em contato diretamente com nosso departamento de RH!",
  },
  {
    keywords: ["localização", "endereço", "onde fica", "sede"],
    response:
      "Para informações sobre a localização e endereço da BORAÊ, acesse a página **Contato** no menu principal. Lá você encontrará todas as informações de como nos encontrar!",
  },
  {
    keywords: ["redes sociais", "instagram", "facebook", "linkedin", "social"],
    response:
      "A BORAÊ está presente nas principais redes sociais! Siga-nos para ficar por dentro de todos os eventos e novidades. Você pode encontrar os links em nosso site ou na página de **Contato**.",
  },

  // Ajuda
  {
    keywords: ["ajuda", "help", "socorro", "não entendo", "como funciona"],
    response:
      "Estou aqui para ajudar! Você pode me perguntar sobre:\n\n• **A empresa** - O que é a BORAÊ, missão, valores\n• **Departamentos** - RH, TI, Marketing, Eventos, etc.\n• **Colaboradores** - Gestores e membros da equipe\n• **Navegação** - Como usar o site\n• **Eventos** - Agenda e informações\n• **Contato** - Como falar com a equipe\n\nÉ só digitar sua pergunta!",
  },
]

const findResponse = (query: string): string => {
  if (!query || query.trim().length === 0) {
    return "Por favor, digite uma pergunta para que eu possa ajudar!"
  }

  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim()

  const queryWords = normalizedQuery.split(/\s+/).filter((word) => word.length > 2)

  let bestMatch = { score: 0, response: "" }

  for (const item of knowledgeBase) {
    for (const keyword of item.keywords) {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim()

      // Exact match check
      if (normalizedQuery === normalizedKeyword) {
        return item.response
      }

      // Check if query contains keyword or keyword contains query
      if (normalizedQuery.includes(normalizedKeyword)) {
        const score = normalizedKeyword.length / normalizedQuery.length + 0.5
        if (score > bestMatch.score) {
          bestMatch = { score, response: item.response }
        }
      }

      if (normalizedKeyword.includes(normalizedQuery) && normalizedQuery.length > 3) {
        const score = normalizedQuery.length / normalizedKeyword.length + 0.4
        if (score > bestMatch.score) {
          bestMatch = { score, response: item.response }
        }
      }

      // Word-by-word matching
      const keywordWords = normalizedKeyword.split(/\s+/).filter((word) => word.length > 2)
      let matchCount = 0

      for (const qWord of queryWords) {
        for (const kWord of keywordWords) {
          if (qWord === kWord || qWord.includes(kWord) || kWord.includes(qWord)) {
            matchCount++
            break
          }
        }
      }

      if (matchCount > 0) {
        const wordScore = (matchCount / Math.max(queryWords.length, 1)) * 0.8
        if (wordScore > bestMatch.score) {
          bestMatch = { score: wordScore, response: item.response }
        }
      }
    }
  }

  if (bestMatch.score > 0.15) {
    return bestMatch.response
  }

  return "Desculpe, não encontrei informações específicas sobre isso. Posso ajudar com perguntas sobre:\n\n• A BORAÊ e sua missão\n• Departamentos e setores\n• Colaboradores e gestores\n• Eventos e agenda\n• Navegação pelo site\n• Contato e localização\n\nTente reformular sua pergunta ou escolha um dos tópicos acima!"
}

// Pool de sugestões de perguntas
const suggestionPools = [
  ["O que é a BORAÊ?", "Quais são os departamentos?", "Quem te criou?"],
  ["Quem são os gestores?", "Como vejo o organograma?", "Onde vejo os eventos?"],
  ["O que é o BORUS?", "Como entro em contato?", "Qual o slogan da BORAÊ?"],
  ["Quem é o gestor de TI?", "Quem é o gestor de RH?", "Quem é a gestora de Marketing?"],
  ["O que você faz?", "Qual a missão da BORAÊ?", "Onde vejo os avisos?"],
  ["Quem é a gestora de Eventos?", "Quem é o gestor de Desenvolvimento?", "Quem é a gestora de Pesquisa?"],
]

export function BorusGlobal() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGreeting, setShowGreeting] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Eu sou o **BORUS**, o assistente virtual oficial da BORAÊ. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentPoolIndex, setCurrentPoolIndex] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoolIndex((prev) => (prev + 1) % suggestionPools.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Não mostrar na página de insights
  if (pathname === "/insights-borae-2024") {
    return null
  }

  const handleSend = async () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

    const response = findResponse(input.trim())

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: suggestion,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      setTimeout(
        () => {
          const response = findResponse(suggestion)
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
          setIsTyping(false)
          setInput("")
        },
        600 + Math.random() * 400,
      )
    }, 100)
  }

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content.replace(/\*\*/g, ""))
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (id: string, isPositive: boolean) => {
    setFeedbackGiven((prev) => new Set(prev).add(id))
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, feedback: isPositive ? "positive" : "negative" } : msg)),
    )
  }

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>")
      return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: formatted }} />
    })
  }

  const handleToggleOpen = () => {
    if (!isOpen) {
      setShowIntro(true)
    }
    setIsOpen(!isOpen)
    setShowGreeting(false)
  }

  const handleStartChat = () => {
    setShowIntro(false)
  }

  return (
    <>
      {/* Caixinha de saudação */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <div className="bg-gradient-to-r from-stone-700 to-stone-800 text-white rounded-2xl shadow-xl px-4 py-3 max-w-[180px] border border-stone-600">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-stone-300" />
                <p className="text-sm font-medium">Olá, eu sou o Borus!</p>
              </div>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-stone-800 transform rotate-45 border-r border-b border-stone-600" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all overflow-hidden border-3 border-stone-600 bg-gradient-to-br from-stone-100 to-stone-200"
        style={{ borderWidth: "3px" }}
        whileHover={{ scale: 1.08, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Image src="/borus-avatar.png" alt="BORUS" width={64} height={64} className="w-full h-full object-cover" />
        <motion.span
          className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 ${
              isExpanded
                ? "inset-4 md:inset-8"
                : "bottom-24 right-6 w-[calc(100vw-3rem)] max-w-md h-[520px] max-h-[calc(100vh-8rem)]"
            }`}
          >
            <Card className="h-full flex flex-col shadow-2xl border-stone-300 overflow-hidden bg-white">
              {/* Header com gradiente stone */}
              <div className="bg-gradient-to-r from-stone-700 via-stone-750 to-stone-800 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-stone-500 shadow-md">
                      <Image
                        src="/borus-avatar.png"
                        alt="BORUS"
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">BORUS</h3>
                    <p className="text-xs text-stone-300">Assistente Virtual BORAÊ</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-stone-600/50 h-8 w-8"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-stone-600/50 h-8 w-8"
                    onClick={handleToggleOpen}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showIntro ? (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-50 to-white"
                  >
                    {/* Video container with design stone */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="relative w-28 h-28 mb-5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-400 to-stone-600 rounded-full blur-xl opacity-30 animate-pulse" />
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-stone-300 shadow-xl bg-white">
                        <video
                          ref={videoRef}
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Borus-WsS0q99ym83AiGphg6vM9z63kSjnO7.webm"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-stone-400"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                    </motion.div>

                    {/* Welcome text */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center mb-6"
                    >
                      <h2 className="text-xl font-bold text-stone-800 mb-2">Seja bem-vindo!</h2>
                      <p className="text-stone-600 mb-1">
                        Eu sou o <span className="font-semibold text-stone-800">BORUS</span>
                      </p>
                      <p className="text-stone-500 text-sm">Como posso ajudar você hoje?</p>
                    </motion.div>

                    {/* Features with stone colors */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="grid grid-cols-3 gap-3 mb-6 w-full max-w-xs"
                    >
                      {[
                        { icon: "💬", label: "Tire dúvidas" },
                        { icon: "📋", label: "Informações" },
                        { icon: "🏢", label: "Sobre a BORAÊ" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center p-2.5 rounded-xl bg-stone-100 border border-stone-200 hover:bg-stone-150 transition-colors"
                        >
                          <span className="text-lg mb-1">{item.icon}</span>
                          <span className="text-[10px] text-stone-600 text-center font-medium">{item.label}</span>
                        </div>
                      ))}
                    </motion.div>

                    {/* Start button with stone color */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button
                        onClick={handleStartChat}
                        className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white px-6 py-5 text-base rounded-full shadow-lg group"
                      >
                        Iniciar Conversa
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                  ? "bg-gradient-to-r from-stone-700 to-stone-800 text-white rounded-br-md"
                                  : "bg-stone-100 border border-stone-200 text-stone-700 rounded-bl-md"
                              }`}
                            >
                              <div className="text-sm leading-relaxed">{formatContent(message.content)}</div>
                              {message.role === "assistant" && message.id !== "welcome" && (
                                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-200">
                                  <button
                                    onClick={() => handleFeedback(message.id, true)}
                                    className={`p-1.5 rounded-full transition-colors ${
                                      message.feedback === "positive"
                                        ? "bg-emerald-100 text-emerald-600"
                                        : "hover:bg-stone-200 text-stone-400"
                                    }`}
                                    disabled={feedbackGiven.has(message.id)}
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(message.id, false)}
                                    className={`p-1.5 rounded-full transition-colors ${
                                      message.feedback === "negative"
                                        ? "bg-red-100 text-red-600"
                                        : "hover:bg-stone-200 text-stone-400"
                                    }`}
                                    disabled={feedbackGiven.has(message.id)}
                                  >
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleCopy(message.content, message.id)}
                                    className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 transition-colors ml-auto"
                                  >
                                    {copiedId === message.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {isTyping && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-stone-100 border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3">
                              <div className="flex gap-1.5">
                                <motion.span
                                  className="w-2 h-2 bg-stone-400 rounded-full"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                                />
                                <motion.span
                                  className="w-2 h-2 bg-stone-400 rounded-full"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
                                />
                                <motion.span
                                  className="w-2 h-2 bg-stone-400 rounded-full"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Suggestions with stone colors */}
                    <div className="px-4 pb-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPoolIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                        >
                          {suggestionPools[currentPoolIndex].map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="shrink-0 px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full border border-stone-200 transition-colors whitespace-nowrap"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Input with stone colors */}
                    <div className="p-4 border-t border-stone-200 bg-stone-50">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleSend()
                        }}
                        className="flex gap-2"
                      >
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Digite sua pergunta..."
                          className="flex-1 border-stone-300 focus:border-stone-500 focus:ring-stone-500 bg-white"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={!input.trim() || isTyping}
                          className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
