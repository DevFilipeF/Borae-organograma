"use client"

import type React from "react"

import { useCallback } from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { AnimatedLink } from "@/components/animated-link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Fuse from "fuse.js"
import { Send, Mail, Instagram, X, Bot, Expand, Minimize2, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { trackBorusInteraction, trackEvent } from "@/lib/analytics"
import { SiteHeader } from "@/components/site-header"

// Base de dados completa dos colaboradores (atualizada com organograma real)
const colaboradores = [
  // Diretoria
  { nome: "Guilherme dos Santos", departamento: "Diretoria", cargo: "Diretor" },
  { nome: "Gustavo Sartorelli", departamento: "Diretoria", cargo: "Diretor" },
  // Subdiretoria
  { nome: "Bárbara Ferreira", departamento: "Subdiretoria", cargo: "Subdiretora" },
  { nome: "Stefany Anne Apaza", departamento: "Subdiretoria", cargo: "Subdiretora" },
  // Marketing
  { nome: "Giulia Ferro", departamento: "Marketing", cargo: "Membro" },
  { nome: "Clarice de Paula", departamento: "Marketing", cargo: "Membro" },
  { nome: "Giovanna Camilo", departamento: "Marketing", cargo: "Membro" },
  { nome: "Giovanna dos Santos", departamento: "Marketing", cargo: "Membro" },
  { nome: "Maria Clara Kirchhof", departamento: "Marketing", cargo: "Membro" },
  { nome: "Maria Eduarda Martins", departamento: "Marketing", cargo: "Membro" },
  { nome: "Maria Vitoria Rocha", departamento: "Marketing", cargo: "Membro" },
  // TI
  { nome: "José Elias Gomes", departamento: "Tecnologia da Informação", cargo: "Membro" },
  { nome: "Diego Silva de Oliveira", departamento: "Tecnologia da Informação", cargo: "Membro" },
  { nome: "Luan Alves da Silva", departamento: "Tecnologia da Informação", cargo: "Membro" },
  { nome: "Pedro Henrique Dias", departamento: "Tecnologia da Informação", cargo: "Membro" },
  { nome: "Filipe Ferreira de Araújo", departamento: "Tecnologia da Informação", cargo: "Membro" },
  // RH
  { nome: "Layne Rodrigues Silva", departamento: "Recursos Humanos", cargo: "Membro" },
  { nome: "Mariana Favorin Cruz", departamento: "Recursos Humanos", cargo: "Membro" },
  { nome: "Maria Eduarda Barbosa", departamento: "Recursos Humanos", cargo: "Membro" },
  { nome: "Maria Julia Goes", departamento: "Recursos Humanos", cargo: "Membro" },
  { nome: "Eliane Araújo Silva", departamento: "Recursos Humanos", cargo: "Membro" },
  { nome: "Gustavo Bispo Viana", departamento: "Recursos Humanos", cargo: "Membro" },
  { nome: "Willyan Rodrigues", departamento: "Recursos Humanos", cargo: "Membro" },
  // Desenvolvimento
  { nome: "Cléo Christine Silva", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Fabio Andrade Irias", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Luana da Silva", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Lucas Pereira Santos", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Maria Eduarda de Oliveira", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Pablo Ackillys", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Rafaela Matos", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Rodrigo Souto", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Sabrina Ramos Alves", departamento: "Desenvolvimento", cargo: "Membro" },
  { nome: "Thifany Nicoly Gama", departamento: "Desenvolvimento", cargo: "Membro" },
  // Planejamento/Eventos
  { nome: "Gabrielle Alves de Oliveira", departamento: "Planejamento/Eventos", cargo: "Membro" },
  { nome: "Gabrielly Evangelista", departamento: "Planejamento/Eventos", cargo: "Membro" },
  { nome: "Icaro Moreira Jorge", departamento: "Planejamento/Eventos", cargo: "Membro" },
  { nome: "Luisa Holanda Alves", departamento: "Planejamento/Eventos", cargo: "Membro" },
  { nome: "Richard Machado", departamento: "Planejamento/Eventos", cargo: "Membro" },
  { nome: "Sofia Alves Sousa", departamento: "Planejamento/Eventos", cargo: "Membro" },
  { nome: "Vinicius Neri Brandão", departamento: "Planejamento/Eventos", cargo: "Membro" },
  { nome: "Karoline Xavier", departamento: "Planejamento/Eventos", cargo: "Membro" },
  // Pesquisa
  { nome: "Ana Clara Pereira da Silva", departamento: "Pesquisa", cargo: "Membro" },
  { nome: "Iago Lima Flores", departamento: "Pesquisa", cargo: "Membro" },
  { nome: "Isabelly Alves", departamento: "Pesquisa", cargo: "Membro" },
  { nome: "Isabelly Pinheiro", departamento: "Pesquisa", cargo: "Membro" },
  { nome: "Willian Marques Barbosa", departamento: "Pesquisa", cargo: "Membro" },
  { nome: "Yuri Nascimento", departamento: "Pesquisa", cargo: "Membro" },
  { nome: "Mariana Gonçalves", departamento: "Pesquisa", cargo: "Membro" },
]

// Eventos realizados
const eventosRealizados = [
  {
    nome: "Visita ao Farol Santander",
    data: "2025",
    descricao:
      "Visita cultural ao icônico Farol Santander em São Paulo, incluindo exposições de arte contemporânea e vista panorâmica da cidade.",
  },
  {
    nome: "Setembro Amarelo - Jogo de Conscientização",
    data: "Setembro 2025",
    descricao: "Evento de conscientização sobre saúde mental com atividades interativas e dinâmicas de grupo.",
  },
  {
    nome: "Boraween",
    data: "Outubro 2025",
    descricao: "Celebração temática de Halloween com toda a equipe, incluindo fantasias e atividades especiais.",
  },
  {
    nome: "Visita ao Centro Cultural Santo Amaro",
    data: "2025",
    descricao: "Exploração de espaços culturais na região de Santo Amaro.",
  },
]

// Pools de sugestões de perguntas (mais variadas)
const suggestionPools = [
  ["O que é a BORAÊ?", "Quais são os departamentos?", "Quem são os diretores?", "Qual a missão da empresa?"],
  [
    "Quem criou este site?",
    "Quais eventos foram realizados?",
    "Quantos colaboradores tem?",
    "Quais os valores da BORAÊ?",
  ],
  ["O que significa BORUS?", "Quem trabalha no Marketing?", "Qual o diferencial da empresa?", "Onde fica a BORAÊ?"],
  ["Quem são as subdiretoras?", "Quem trabalha no RH?", "O que foi o Boraween?", "Qual a visão da BORAÊ?"],
  ["Quais as metas da empresa?", "O que faz o setor de Pesquisa?", "Quem trabalha em TI?", "Como entrar em contato?"],
  [
    "Quem é o Filipe Ferreira?",
    "O que foi o Setembro Amarelo?",
    "Quem trabalha em Desenvolvimento?",
    "Qual o Instagram?",
  ],
  ["Quem é a Giulia Ferro?", "O que faz o setor de TI?", "Quem é o Diego Silva?", "O que foi o Farol Santander?"],
  [
    "Quem trabalha em Planejamento?",
    "Quem é a Maria Eduarda Martins?",
    "Quantos setores existem?",
    "Quem é o Gustavo Bispo?",
  ],
  ["Quem é a Stefany Anne?", "Quem é o José Elias?", "O que faz o Marketing?", "Quem é a Luana da Silva?"],
  ["Quem é o Pablo Ackillys?", "Quem é a Isabelly Alves?", "Quem é o Yuri Nascimento?", "Quem é a Sofia Alves?"],
]

// Interface de mensagem
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  feedback?: "positive" | "negative"
}

// Componente BORUS Popup
function BorusChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Olá! Eu sou o **BORUS** (Bot for Organizational Research & Unified Support), o assistente virtual oficial da BORAÊ. Estou aqui para responder todas as suas dúvidas sobre nossa empresa, colaboradores, departamentos, eventos e muito mais. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentPoolIndex, setCurrentPoolIndex] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Configuração do Fuse.js para busca fuzzy avançada
  const fuse = useMemo(
    () =>
      new Fuse(colaboradores, {
        keys: ["nome"],
        threshold: 0.3,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
        findAllMatches: true,
      }),
    [],
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Função para encontrar colaborador com busca fuzzy
  const findColaborador = useCallback(
    (query: string) => {
      // Limpar a query
      const cleanQuery = query
        .toLowerCase()
        .replace(/[?!.,]/g, "")
        .replace(/\b(o|a|de|da|do|dos|das|quem|é|e|qual|setor|departamento|área|trabalha|fica|está)\b/gi, "")
        .trim()

      if (cleanQuery.length < 2) return null

      const results = fuse.search(cleanQuery)
      if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.4) {
        return results[0].item
      }

      // Busca direta por nome parcial
      const directMatch = colaboradores.find(
        (c) => c.nome.toLowerCase().includes(cleanQuery) || cleanQuery.includes(c.nome.toLowerCase().split(" ")[0]),
      )

      return directMatch || null
    },
    [fuse],
  )

  // Função principal para gerar resposta do BORUS
  const generateResponse = useCallback(
    (userMessage: string): string => {
      const msg = userMessage.toLowerCase().trim()

      // Verificar se é pergunta fora do escopo da empresa
      const offTopicPatterns = [
        /clima|tempo|previsão/i,
        /futebol|esporte|jogo(?!.*borae|.*empresa|.*evento)/i,
        /receita|comida|cozinha/i,
        /filme|série|netflix/i,
        /música(?!.*cultural)/i,
        /política|eleição|presidente/i,
        /notícia(?!.*borae)/i,
        /piada|conte.*história/i,
        /quanto.*é.*\d/i,
        /calcul/i,
        /traduz/i,
        /programa(?!.*evento|.*borae)/i,
      ]

      for (const pattern of offTopicPatterns) {
        if (pattern.test(msg)) {
          return "Desculpe, eu sou o **BORUS**, um assistente focado exclusivamente na **BORAÊ**. Posso responder apenas perguntas sobre nossa empresa, colaboradores, departamentos, eventos e projetos. Por favor, pergunte algo relacionado à BORAÊ! 😊"
        }
      }

      // Quem criou/desenvolveu o site/BORUS
      if (
        msg.includes("quem criou") ||
        msg.includes("quem desenvolveu") ||
        msg.includes("quem fez") ||
        msg.includes("desenvolvedor") ||
        msg.includes("criador") ||
        (msg.includes("site") && (msg.includes("quem") || msg.includes("criou") || msg.includes("fez"))) ||
        (msg.includes("borus") &&
          (msg.includes("criou") || msg.includes("desenvolveu") || msg.includes("fez") || msg.includes("quem")))
      ) {
        return "Fui desenvolvido por **Filipe Ferreira de Araújo**, que faz parte da equipe de Tecnologia da Informação da BORAÊ. Ele não só deu vida ao BORUS, mas também criou todo este site do zero, implementando cada funcionalidade, design e interação que você vê aqui. Um verdadeiro trabalho de dedicação, criatividade e expertise técnica! 🚀"
      }

      // O que significa BORUS
      if (
        msg.includes("significa borus") ||
        msg.includes("significado") ||
        msg.includes("o que é borus") ||
        msg.includes("borus significa") ||
        msg.includes("nome borus")
      ) {
        return "**BORUS** significa **Bot for Organizational Research & Unified Support** (Bot para Pesquisa Organizacional e Suporte Unificado).\n\nFui criado para ser o assistente virtual oficial da BORAÊ, oferecendo informações completas e precisas sobre a empresa, seus colaboradores, departamentos, eventos e muito mais. Meu objetivo é fornecer suporte rápido, acessível e confiável para qualquer dúvida relacionada à nossa organização! 🤖"
      }

      // Verificar se é pergunta sobre pessoa específica
      const pessoaPatterns = [
        /quem\s+[eé]\s+(?:o|a)?\s*(.+)/i,
        /(?:de\s+)?(?:qual|que)\s+(?:setor|departamento|[aá]rea)\s+[eé]\s+(?:o|a)?\s*(.+)/i,
        /(?:onde|em\s+que)\s+(?:setor|departamento|[aá]rea)\s+(?:trabalha|fica|est[aá])\s+(?:o|a)?\s*(.+)/i,
        /(.+?)\s+(?:trabalha|fica|est[aá])\s+(?:em|no|na)\s+(?:qual|que)/i,
        /(?:fale|fala|me\s+fale|conte)\s+(?:sobre|de)\s+(?:o|a)?\s*(.+)/i,
      ]

      for (const pattern of pessoaPatterns) {
        const match = msg.match(pattern)
        if (match) {
          const nomeBuscado = match[1].trim().replace(/[?!.,]/g, "")
          // Evitar falsos positivos
          if (nomeBuscado.length > 2 && !nomeBuscado.includes("empresa") && !nomeBuscado.includes("borae")) {
            const colaborador = findColaborador(nomeBuscado)
            if (colaborador) {
              if (colaborador.cargo === "Diretor") {
                return `**${colaborador.nome}** é um dos **Diretores** da BORAÊ, fazendo parte da liderança estratégica responsável pelas decisões e direcionamento da empresa.`
              } else if (colaborador.cargo === "Subdiretora") {
                return `**${colaborador.nome}** faz parte da **Subdiretoria** da BORAÊ, auxiliando na gestão e coordenação das atividades da empresa junto aos diretores.`
              } else {
                return `**${colaborador.nome}** faz parte da equipe de **${colaborador.departamento}** da BORAÊ, contribuindo ativamente para os projetos e atividades do setor.`
              }
            }
          }
        }
      }

      // O que é a BORAÊ
      if (
        msg.includes("o que é a borae") ||
        msg.includes("o que e a borae") ||
        msg.includes("sobre a borae") ||
        msg.includes("sobre a empresa") ||
        (msg.includes("borae") && (msg.includes("empresa") || msg.includes("o que")))
      ) {
        return "A **BORAÊ** é uma agência de eventos e promoção cultural comprometida em criar experiências que conectem os jovens às mais diversas expressões culturais.\n\nNosso objetivo é promover o acesso à arte, à música e ao conhecimento, valorizando a diversidade e incentivando a participação ativa da juventude na cena cultural.\n\nNascemos com o propósito de **inspirar, conectar e transformar**, usando a cultura, a arte e a comunicação como pontes entre ideias e pessoas. 🎭"
      }

      // Missão
      if (msg.includes("missão") || msg.includes("missao")) {
        return 'A **missão** da BORAÊ é:\n\n*"Trazer para os jovens que tenham pouco interesse, acesso ou oportunidade, variados tipos de entretenimento e educação cultural."*\n\nQueremos democratizar o acesso à cultura e criar experiências transformadoras para a juventude brasileira! 🎯'
      }

      // Visão
      if (msg.includes("visão") || msg.includes("visao")) {
        return 'A **visão** da BORAÊ é:\n\n*"Promover cultura, informação e entretenimento para o maior número possível de jovens de forma educativa e verdadeira."*\n\nQueremos ser referência em promoção cultural jovem no Brasil! 👁️'
      }

      // Valores/Pilares
      if (msg.includes("valores") || msg.includes("pilares")) {
        return "Os **valores (pilares)** da BORAÊ são:\n\n🔥 **Paixão pela Cultura** - Amamos o que fazemos e transmitimos isso em cada projeto\n\n🌍 **Valorização da sociedade e diversidade** - Respeitamos e celebramos as diferenças\n\n📚 **Educação através da experiência** - Aprendizado prático e significativo\n\n✨ **Transparência e Reconhecimento** - Honestidade em todas as relações e valorização de cada contribuição"
      }

      // Diferenciais
      if (msg.includes("diferencial") || msg.includes("diferenciais")) {
        return "Os **diferenciais** da BORAÊ são:\n\n**1. Comunicação em múltiplas plataformas:**\nAtuamos de forma estratégica e integrada nos principais canais digitais e físicos, garantindo presença ativa onde o público jovem realmente está — das redes sociais ao presencial, adaptando cada mensagem ao meio certo.\n\n**2. Linguagem direcionada aos jovens:**\nUtilizamos uma linguagem leve, acessível e atual, conectando ideias com autenticidade e falando com os jovens de forma real e envolvente. Criamos conteúdos que geram identificação, diálogo e engajamento. 📱"
      }

      // Metas
      if (msg.includes("metas") || msg.includes("objetivos")) {
        return "As **metas** da BORAÊ estão organizadas em 4 etapas:\n\n**1. 🏢 Criação da Empresa**\nFormalizar a estrutura funcional, definir identidade e estabelecer fundamentos iniciais\n\n**2. 📣 Divulgação**\nPromover a marca por meio de redes sociais e ações para atrair público e gerar reconhecimento\n\n**3. 🚀 Desenvolvimento**\nColocar projetos em prática com criatividade, focando no público-alvo e objetivos culturais\n\n**4. 📊 Medir os Resultados**\nAvaliar o desempenho das ações para ajustar estratégias e garantir evolução constante"
      }

      // Departamentos/Setores
      if (
        msg.includes("departamentos") ||
        msg.includes("setores") ||
        msg.includes("áreas") ||
        msg.includes("areas") ||
        msg.includes("quantos setores")
      ) {
        return "A BORAÊ é dividida em **6 departamentos**:\n\n👥 **Recursos Humanos (RH)** - Atrai, desenvolve e cuida dos talentos\n\n📢 **Marketing** - Coração da comunicação, cria campanhas estratégicas\n\n🎉 **Planejamento/Eventos** - Organiza e estrutura todas as ações\n\n🚀 **Desenvolvimento** - Núcleo estratégico para expandir impacto\n\n💻 **Tecnologia da Informação (TI)** - Impulsiona inovação e eficiência digital\n\n🔍 **Pesquisa** - Investiga comportamentos e interesses da juventude"
      }

      // Diretores/Diretoria
      if (msg.includes("diretores") || msg.includes("diretoria") || msg.includes("direção")) {
        return (
          "A **Diretoria** da BORAÊ é composta por:\n\n" +
          "1. **Guilherme dos Santos** - Diretor\n" +
          "2. **Gustavo Sartorelli** - Diretor\n\n" +
          "E a **Subdiretoria**:\n" +
          "1. **Bárbara Ferreira** - Subdiretora\n" +
          "2. **Stefany Anne Apaza** - Subdiretora"
        )
      }

      // Subdiretoras
      if (msg.includes("subdiretora") || msg.includes("vice")) {
        return (
          "As **Subdiretoras** da BORAÊ são:\n\n" +
          "1. **Bárbara Ferreira**\n" +
          "2. **Stefany Anne Apaza**\n\n" +
          "Elas auxiliam na gestão e coordenação das atividades da empresa junto aos diretores."
        )
      }

      // Eventos realizados
      if (
        msg.includes("eventos realizados") ||
        msg.includes("quais eventos") ||
        msg.includes("eventos feitos") ||
        msg.includes("lista de eventos") ||
        (msg.includes("eventos") &&
          !msg.includes("setor") &&
          !msg.includes("departamento") &&
          !msg.includes("equipe") &&
          !msg.includes("quem trabalha"))
      ) {
        let response = "A BORAÊ já realizou diversos **eventos culturais**:\n\n"
        eventosRealizados.forEach((evento, index) => {
          response += `**${index + 1}. ${evento.nome}** (${evento.data})\n${evento.descricao}\n\n`
        })
        response += "Cada evento reflete nosso compromisso com a promoção cultural e conexão com a juventude! 🎭"
        return response.trim()
      }

      // Farol Santander
      if (msg.includes("farol santander") || msg.includes("farol")) {
        return "O **Farol Santander** foi um dos eventos culturais realizados pela BORAÊ em 2025. 🏛️\n\nFoi uma visita ao icônico edifício em São Paulo, onde os colaboradores puderam:\n• Apreciar exposições de arte contemporânea\n• Ter uma vista panorâmica incrível da cidade\n• Vivenciar experiências culturais únicas\n\nO evento faz parte da nossa missão de promover acesso à cultura e experiências enriquecedoras para todos!"
      }

      // Setembro Amarelo
      if (msg.includes("setembro amarelo")) {
        return "O **Setembro Amarelo** foi um evento especial de conscientização sobre saúde mental realizado pela BORAÊ. 💛\n\nO evento incluiu:\n• Jogo de conscientização interativo\n• Atividades e dinâmicas de grupo\n• Discussões sobre bem-estar emocional\n• Informações sobre prevenção ao suicídio\n\nDemonstra nosso compromisso não apenas com cultura, mas também com causas sociais importantes!"
      }

      // Boraween
      if (msg.includes("boraween") || msg.includes("halloween")) {
        return "O **Boraween** foi a celebração temática de Halloween da BORAÊ, realizada em outubro de 2025! 🎃\n\nO evento contou com:\n• Fantasias criativas de toda a equipe\n• Atividades especiais temáticas\n• Momento de integração e descontração\n• Fortalecimento dos laços entre colaboradores\n\nUm evento que mostra como unimos cultura e diversão!"
      }

      // Centro Cultural Santo Amaro
      if (msg.includes("centro cultural") || msg.includes("santo amaro")) {
        return "A **Visita ao Centro Cultural Santo Amaro** foi um evento realizado pela BORAÊ em 2025. 🏛️\n\nNessa visita, exploramos espaços culturais importantes na região de Santo Amaro, proporcionando aos colaboradores contato direto com arte e expressões culturais locais!"
      }

      // Quantos colaboradores
      if (
        msg.includes("quantos colaboradores") ||
        msg.includes("quantas pessoas") ||
        msg.includes("número de funcionários") ||
        msg.includes("total de colaboradores")
      ) {
        return "A BORAÊ conta com **48 colaboradores** distribuídos entre:\n\n• 2 Diretores\n• 2 Subdiretoras\n• 6 Departamentos: Marketing, TI, RH, Desenvolvimento, Planejamento/Eventos e Pesquisa\n\nCada membro contribui ativamente para nossa missão de conectar jovens à cultura! 👥"
      }

      // Equipe de Marketing
      if (
        msg.includes("equipe de marketing") ||
        msg.includes("quem trabalha no marketing") ||
        (msg.includes("marketing") && msg.includes("quem"))
      ) {
        const team = colaboradores.filter((c) => c.departamento === "Marketing")
        let response = "A equipe de **Marketing** da BORAÊ é composta por:\n\n"
        team.forEach((c) => {
          response += `• ${c.nome}\n`
        })
        response +=
          "\nO Marketing é o coração da comunicação, criando campanhas estratégicas e inovadoras com linguagem jovem! 📢"
        return response
      }

      // Equipe de TI
      if (
        msg.includes("equipe de ti") ||
        msg.includes("quem trabalha na ti") ||
        msg.includes("quem trabalha em ti") ||
        (msg.includes("ti") && msg.includes("quem")) ||
        msg.includes("tecnologia da informação")
      ) {
        const team = colaboradores.filter((c) => c.departamento === "Tecnologia da Informação")
        let response = "A equipe de **Tecnologia da Informação** da BORAÊ é composta por:\n\n"
        team.forEach((c) => {
          response += `• ${c.nome}\n`
        })
        response +=
          "\nO TI impulsiona a inovação, garantindo eficiência digital e apoiando a realização de experiências culturais conectadas e acessíveis! 💻"
        return response
      }

      // Equipe de RH
      if (msg.includes("equipe de rh") || msg.includes("quem trabalha no rh") || msg.includes("recursos humanos")) {
        const team = colaboradores.filter((c) => c.departamento === "Recursos Humanos")
        let response = "A equipe de **Recursos Humanos** da BORAÊ é composta por:\n\n"
        team.forEach((c) => {
          response += `• ${c.nome}\n`
        })
        response +=
          "\nO RH é responsável por atrair, desenvolver e cuidar dos talentos, promovendo um ambiente diverso, inclusivo e acolhedor! 👥"
        return response
      }

      // Equipe de Desenvolvimento
      if (
        msg.includes("equipe de desenvolvimento") ||
        msg.includes("quem trabalha no desenvolvimento") ||
        msg.includes("quem trabalha em desenvolvimento") ||
        (msg.includes("desenvolvimento") && msg.includes("quem"))
      ) {
        const team = colaboradores.filter((c) => c.departamento === "Desenvolvimento")
        let response = "A equipe de **Desenvolvimento** da BORAÊ é composta por:\n\n"
        team.forEach((c) => {
          response += `• ${c.nome}\n`
        })
        response +=
          "\nO setor atua como núcleo estratégico para expandir o impacto da organização e garantir sustentabilidade! 🚀"
        return response
      }

      // Equipe de Planejamento/Eventos
      if (
        msg.includes("equipe de planejamento") ||
        msg.includes("quem trabalha no planejamento") ||
        msg.includes("equipe de eventos") ||
        (msg.includes("eventos") && msg.includes("quem trabalha"))
      ) {
        const team = colaboradores.filter((c) => c.departamento === "Planejamento/Eventos")
        let response = "A equipe de **Planejamento/Eventos** da BORAÊ é composta por:\n\n"
        team.forEach((c) => {
          response += `• ${c.nome}\n`
        })
        response +=
          "\nO setor é responsável por organizar e estruturar todas as ações da agência, garantindo que cada projeto aconteça com eficiência! 🎉"
        return response
      }

      // Equipe de Pesquisa
      if (
        msg.includes("equipe de pesquisa") ||
        msg.includes("quem trabalha na pesquisa") ||
        msg.includes("quem trabalha em pesquisa") ||
        (msg.includes("pesquisa") && msg.includes("quem"))
      ) {
        const team = colaboradores.filter((c) => c.departamento === "Pesquisa")
        let response = "A equipe de **Pesquisa** da BORAÊ é composta por:\n\n"
        team.forEach((c) => {
          response += `• ${c.nome}\n`
        })
        response +=
          "\nO setor investiga comportamentos, interesses e demandas das juventudes para criar experiências mais relevantes e inclusivas! 🔍"
        return response
      }

      // O que faz cada setor
      if (msg.includes("o que faz") && msg.includes("marketing")) {
        return "O **Marketing** da BORAÊ é o coração da comunicação da agência! 📢\n\n**Responsabilidades:**\n• Criar campanhas estratégicas e inovadoras\n• Divulgar eventos, artistas e projetos\n• Usar linguagem jovem e canais digitais\n• Engajar o público nas redes sociais\n• Fortalecer nossa presença cultural\n• Valorizar diversidade e autenticidade"
      }

      if (msg.includes("o que faz") && (msg.includes("ti") || msg.includes("tecnologia"))) {
        return "A **Tecnologia da Informação** da BORAÊ tem como missão impulsionar a inovação! 💻\n\n**Responsabilidades:**\n• Garantir eficiência digital\n• Desenvolver e manter plataformas digitais\n• Criar sites, aplicativos e sistemas\n• Implementar sistemas de inscrição e credenciamento\n• Apoiar a realização de experiências culturais conectadas"
      }

      if (msg.includes("o que faz") && (msg.includes("rh") || msg.includes("recursos humanos"))) {
        return "O **Recursos Humanos** da BORAÊ cuida do nosso maior patrimônio: as pessoas! 👥\n\n**Responsabilidades:**\n• Atrair e selecionar talentos\n• Desenvolver competências da equipe\n• Promover ambiente diverso e inclusivo\n• Formar equipes criativas e colaborativas\n• Garantir bem-estar dos colaboradores"
      }

      if (msg.includes("o que faz") && msg.includes("desenvolvimento")) {
        return "O **Desenvolvimento** da BORAÊ atua como núcleo estratégico! 🚀\n\n**Responsabilidades:**\n• Expandir o impacto da organização\n• Fortalecer presença no cenário cultural\n• Garantir sustentabilidade a longo prazo\n• Desenvolver novos projetos e parcerias\n• Identificar oportunidades de crescimento"
      }

      if (msg.includes("o que faz") && (msg.includes("planejamento") || msg.includes("eventos"))) {
        return "O **Planejamento/Eventos** da BORAÊ estrutura todas as ações! 🎉\n\n**Responsabilidades:**\n• Organizar cronogramas e metas\n• Estabelecer parcerias estratégicas\n• Garantir eficiência nos projetos\n• Coordenar eventos culturais\n• Assegurar qualidade nas entregas"
      }

      if (msg.includes("o que faz") && msg.includes("pesquisa")) {
        return "A **Pesquisa** da BORAÊ é a base para experiências mais relevantes! 🔍\n\n**Responsabilidades:**\n• Investigar comportamentos e interesses jovens\n• Identificar demandas culturais\n• Analisar linguagens e tendências\n• Mapear expressões culturais relevantes\n• Orientar criação de projetos inclusivos"
      }

      // Endereço/Localização
      if (
        msg.includes("endereço") ||
        msg.includes("endereco") ||
        msg.includes("onde fica") ||
        msg.includes("localização") ||
        msg.includes("localizacao") ||
        msg.includes("local")
      ) {
        return "A **BORAÊ** está localizada em:\n\n📍 **Rua Alexandre Dumas, 2016**\nFaculdade São Judas\n1º andar, Sala 101\nSão Paulo - SP\n\nEstamos em um ambiente acadêmico que fortalece nossa conexão com a juventude!"
      }

      // Contato/Instagram
      if (
        msg.includes("contato") ||
        msg.includes("falar com") ||
        msg.includes("instagram") ||
        msg.includes("redes sociais") ||
        msg.includes("como entrar")
      ) {
        return "Você pode entrar em contato com a BORAÊ através de:\n\n📸 **Instagram:** @_boraee\n\nNas nossas redes sociais, você encontra todas as novidades, eventos e conteúdos culturais! Siga-nos e faça parte dessa comunidade! 🚀"
      }

      // Saudações
      if (msg.match(/^(oi|olá|ola|hey|eai|e ai|bom dia|boa tarde|boa noite|hello|hi)$/i)) {
        return "Olá! 👋 Seja bem-vindo(a)! Sou o **BORUS**, assistente virtual da BORAÊ. Como posso ajudar você hoje?\n\nVocê pode me perguntar sobre:\n• Nossa empresa e história\n• Departamentos e equipes\n• Eventos realizados\n• Colaboradores específicos\n• E muito mais!"
      }

      // Agradecimentos
      if (msg.match(/^(obrigado|obrigada|valeu|thanks|brigado|brigada)$/i)) {
        return "Por nada! 😊 Fico feliz em ajudar! Se tiver mais alguma dúvida sobre a BORAÊ, é só perguntar. Estou aqui para isso!"
      }

      // Busca genérica por nome de colaborador
      const colaborador = findColaborador(msg)
      if (colaborador) {
        if (colaborador.cargo === "Diretor") {
          return `**${colaborador.nome}** é um dos **Diretores** da BORAÊ, fazendo parte da liderança estratégica responsável pelas decisões e direcionamento da empresa.`
        } else if (colaborador.cargo === "Subdiretora") {
          return `**${colaborador.nome}** faz parte da **Subdiretoria** da BORAÊ, auxiliando na gestão e coordenação das atividades da empresa junto aos diretores.`
        } else {
          return `**${colaborador.nome}** faz parte da equipe de **${colaborador.departamento}** da BORAÊ, contribuindo ativamente para os projetos e atividades do setor.`
        }
      }

      // Resposta padrão para perguntas não reconhecidas sobre a BORAÊ
      return "Desculpe, não encontrei informações específicas sobre isso. 🤔\n\nPosso ajudar com:\n• Informações sobre a empresa (missão, visão, valores)\n• Departamentos e suas funções\n• Colaboradores específicos\n• Eventos realizados\n• Diferenciais e metas\n• Localização e contato\n\nTente reformular sua pergunta ou escolha uma das sugestões abaixo!"
    },
    [findColaborador],
  )

  const getResponseType = (msg: string): string => {
    const lowerMsg = msg.toLowerCase()
    if (lowerMsg.includes("quem criou") || lowerMsg.includes("desenvolveu")) return "developer"
    if (lowerMsg.includes("borus") && lowerMsg.includes("significa")) return "borus_meaning"
    if (lowerMsg.includes("missão")) return "mission"
    if (lowerMsg.includes("visão")) return "vision"
    if (lowerMsg.includes("valores") || lowerMsg.includes("pilares")) return "values"
    if (lowerMsg.includes("diferencial")) return "differentials"
    if (lowerMsg.includes("evento")) return "events"
    if (lowerMsg.includes("endereço") || lowerMsg.includes("localização")) return "address"
    if (lowerMsg.includes("instagram")) return "instagram"
    if (lowerMsg.includes("departamento") || lowerMsg.includes("setor")) return "departments"
    if (lowerMsg.includes("diretor")) return "directors"
    if (lowerMsg.includes("meta")) return "goals"
    if (/quem é|onde trabalha|qual setor/.test(lowerMsg)) return "person_search"
    return "general"
  }

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Rastrear interação do BORUS
    const responseType = getResponseType(input)
    trackBorusInteraction(input.trim(), responseType)

    // Simular tempo de resposta
    setTimeout(
      () => {
        const response = generateResponse(input)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
        // Rotacionar sugestões
        setCurrentPoolIndex((prev) => (prev + 1) % suggestionPools.length)
      },
      800 + Math.random() * 700,
    )
  }, [input, generateResponse])

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: suggestion,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      // Rastrear interação do BORUS
      const responseType = getResponseType(suggestion)
      trackBorusInteraction(suggestion, responseType)

      setTimeout(
        () => {
          const response = generateResponse(suggestion)
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
          setCurrentPoolIndex((prev) => (prev + 1) % suggestionPools.length)
        },
        800 + Math.random() * 700,
      )
    },
    [generateResponse],
  )

  const handleFeedback = useCallback(
    (messageId: string, helpful: boolean) => {
      setFeedbackGiven((prev) => new Set(prev).add(messageId))

      // Encontrar a pergunta anterior à resposta
      const messageIndex = messages.findIndex((m) => m.id === messageId)
      const question = messageIndex > 0 ? messages[messageIndex - 1]?.content : "unknown"

      trackBorusInteraction(question, "feedback", helpful)
      trackEvent("borus_feedback", helpful ? "Resposta útil" : "Resposta não útil", { messageId })
    },
    [messages],
  )

  const handleToggleOpen = useCallback(() => {
    const newState = !isOpen
    setIsOpen(newState)

    if (newState) {
      trackEvent("borus", "Abriu BORUS")
    } else {
      trackEvent("borus", "Fechou BORUS")
    }
  }, [isOpen])

  // Formatar conteúdo com markdown básico
  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const formattedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')

      return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: formattedLine || "&nbsp;" }} />
    })
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <>
      {/* Botão flutuante para abrir BORUS */}
      <motion.button
        onClick={handleToggleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
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
                : "bottom-6 right-6 w-[calc(100vw-3rem)] max-w-md h-[600px] max-h-[calc(100vh-6rem)]"
            }`}
          >
            <Card className="h-full flex flex-col shadow-2xl border-slate-200 overflow-hidden bg-white">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">BORUS</h3>
                    <p className="text-xs text-slate-300">Assistente BORAÊ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={handleToggleOpen}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
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
                          ? "bg-slate-700 text-white rounded-br-md"
                          : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                      }`}
                    >
                      <div className="text-sm leading-relaxed">{formatContent(message.content)}</div>
                      {message.role === "assistant" && message.id !== "welcome" && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleFeedback(message.id, true)}
                            className={`p-1.5 rounded-full transition-colors ${
                              message.feedback === "positive" || feedbackGiven.has(message.id)
                                ? "bg-green-100 text-green-600"
                                : "hover:bg-slate-100 text-slate-400"
                            }`}
                            disabled={feedbackGiven.has(message.id)}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, false)}
                            className={`p-1.5 rounded-full transition-colors ${
                              message.feedback === "negative" || feedbackGiven.has(message.id)
                                ? "bg-red-100 text-red-600"
                                : "hover:bg-slate-100 text-slate-400"
                            }`}
                            disabled={feedbackGiven.has(message.id)}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopy(message.content, message.id)}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors ml-auto"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
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
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0 }}
                          className="w-2 h-2 bg-slate-400 rounded-full"
                        />
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.2 }}
                          className="w-2 h-2 bg-slate-400 rounded-full"
                        />
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.4 }}
                          className="w-2 h-2 bg-slate-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              <div className="px-4 py-3 bg-white border-t border-slate-100 shrink-0">
                <div className="flex flex-wrap gap-2">
                  {suggestionPools[currentPoolIndex].map((suggestion, index) => (
                    <motion.button
                      key={`${currentPoolIndex}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestion(suggestion)}
                      className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors whitespace-nowrap"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    placeholder="Digite sua pergunta..."
                    className="flex-1 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Navigation items
// const navigationItems = [
//   { href: "/", label: "Início", icon: Users },
//   { href: "/organograma", label: "Organograma", icon: User },
//   { href: "/dashboard", label: "Dashboard", icon: MessageCircle },
//   { href: "/eventos", label: "Eventos", icon: Calendar },
//   { href: "/avisos", label: "Avisos", icon: Bell },
//   { href: "/sobre", label: "Sobre", icon: Info },
//   { href: "/contato", label: "Contato", icon: Mail },
// ]

export default function ContatoPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ nome: "", email: "", assunto: "", mensagem: "" })
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("sending")
    // Rastrear evento de envio de formulário de contato
    trackEvent("contact_form", "Enviado", {
      nome: formData.nome,
      email: formData.email,
      assunto: formData.assunto,
    })
    setTimeout(() => {
      setFormStatus("sent")
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" })
      setTimeout(() => setFormStatus("idle"), 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">Entre em Contato</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tem alguma dúvida ou sugestão? Estamos aqui para ajudar. Use o formulário abaixo ou converse com nosso
              assistente virtual BORUS.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Formulário de Contato */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Envie uma Mensagem</h2>
                      <p className="text-sm text-slate-500">Responderemos o mais breve possível</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nome</label>
                        <Input
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          placeholder="Seu nome"
                          required
                          className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                          required
                          className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Assunto</label>
                      <Input
                        value={formData.assunto}
                        onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                        placeholder="Sobre o que deseja falar?"
                        required
                        className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Mensagem</label>
                      <Textarea
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        placeholder="Digite sua mensagem..."
                        rows={5}
                        required
                        className="border-slate-200 focus:border-slate-400 focus:ring-slate-400 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="w-full bg-slate-700 hover:bg-slate-800 text-white py-6"
                    >
                      {formStatus === "sending" ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                            className="mr-2"
                          >
                            ⏳
                          </motion.span>
                          Enviando...
                        </>
                      ) : formStatus === "sent" ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Enviado com sucesso!
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cards de Informação */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Card Instagram */}
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Siga-nos no Instagram</h3>
                      <a
                        href="https://www.instagram.com/_boraee?igsh=bDRubHpjZGR2OWo0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-purple-600 transition-colors"
                      >
                        @_boraee
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Números */}
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-800 mb-4">BORAÊ em Números</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-slate-700">48</p>
                      <p className="text-xs text-slate-500">Colaboradores</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-700">6</p>
                      <p className="text-xs text-slate-500">Departamentos</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-700">4+</p>
                      <p className="text-xs text-slate-500">Eventos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Image src="/nova-logo-borae.png" alt="BORAÊ Logo" width={100} height={32} className="h-8 w-auto" />
              <span className="text-gray-600 text-sm">© 2025 BORAÊ. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-6">
              <AnimatedLink href="/sobre" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                Sobre
              </AnimatedLink>
              <AnimatedLink href="/contato" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                Contato
              </AnimatedLink>
            </div>
          </div>
        </div>
      </footer>

      {/* BORUS Chat Popup */}
      <BorusChat />
    </div>
  )
}
