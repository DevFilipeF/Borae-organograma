"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { AnimatedLink } from "@/components/animated-link"
import { SiteHeader } from "@/components/site-header"
import { Search, ChevronDown, ChevronUp, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const orgData = {
  directors: [
    {
      name: "Guilherme dos Santos",
      position: "Diretor",
      department: "Direção",
      image: "/guilherme.jpg",
    },
    {
      name: "Gustavo Sartorelli",
      position: "Diretor",
      department: "Direção",
      image: "/gustavo.jpg",
    },
  ],
  subdirectors: [
    {
      name: "Bárbara Ferreira",
      position: "Subdiretora",
      department: "Subdireção",
    },
    {
      name: "Stefany Anne Apaza",
      position: "Subdiretora",
      department: "Subdireção",
      image: "/stefany.jpg",
    },
  ],
  departments: [
    {
      id: "marketing",
      name: "Marketing",
      color: "from-gray-400 to-gray-500",
      icon: "📢",
      leader: "Giulia Ferro",
      members: [
        {
          name: "Giulia Ferro",
          image: "/giulia.jpg",
          role: "Gestora",
          function:
            "Responsável pela coordenação geral do setor de Marketing e pelo direcionamento do setor de Marketing",
        },
        {
          name: "Clarice de Paula",
          image: "/clarice.jpg",
          role: "Branding",
          function: "Construção e gestão na identidade visual da marca",
        },
        {
          name: "Giovanna Camilo",
          image: "/giovanna-camilo.jpg",
          role: "Branding",
          function: "Construção e gestão na identidade visual da marca",
        },
        {
          name: "Giovanna dos Santos",
          image: "/giovanna-santos.jpg",
          role: "Produção de Conteúdo",
          function: "Criação de vídeos e fotos",
        },
        {
          name: "Maria Clara Kirchhof",
          image: "/maria-clara.jpg",
          role: "Marketing Digital",
          function: "Gestão das redes sociais",
        },
        {
          name: "Maria Eduarda Martins",
          image: "/maria-eduarda-martins.jpg",
          role: "Produção de Conteúdo",
          function: "Criação de vídeos e fotos",
        },
        {
          name: "Maria Vitoria Rocha",
          image: "/maria-vitoria.jpg",
          role: "Branding",
          function: "Construção e gestão na identidade visual da marca",
        },
      ],
    },
    {
      id: "ti",
      name: "Tecnologia da Informação",
      color: "from-slate-400 to-slate-500",
      icon: "💻",
      leader: "José Elias Gomes",
      members: [
        {
          name: "José Elias Gomes",
          image: "/jose.jpg",
          role: "Gestor",
          function:
            "Responsável pela coordenação geral do setor de Tecnologia da Informação e pelo direcionamento do setor de Tecnologia da Informação",
        },
        {
          name: "Diego Silva de Oliveira",
          image: "/diego.jpg",
          role: "Planejamento e Inovação Tecnológica",
          function: "Buscar soluções e ferramentas para evoluir processos",
        },
        {
          name: "Luan Alves da Silva",
          image: "/luan.jpg",
          role: "Segurança da Informação",
          function: "Proteção de dados sensíveis e Cibersegurança",
        },
        {
          name: "Pedro Henrique Dias",
          image: "/pedro.jpg",
          role: "Analista de Performance",
          function: "Validar se o site está preparado para entrar em produção",
        },
        {
          name: "Filipe Ferreira de Araújo",
          image: "/filipe.jpg",
          role: "Desenvolvimento Tecnológico",
          function: "Elaboração do site, correção de bugs e verificar funcionamento",
        },
      ],
    },
    {
      id: "rh",
      name: "Recursos Humanos",
      color: "from-gray-500 to-gray-600",
      icon: "👥",
      leader: "Layne Rodrigues Silva",
      members: [
        {
          name: "Layne Rodrigues Silva",
          image: "/layne.jpg",
          role: "Gestor",
          function:
            "Responsável pela coordenação geral do setor de Recursos Humanos e pelo direcionamento do setor de Recursos Humanos",
        },
        {
          name: "Mariana Favorin Cruz",
          image: "/mariana-favorin.jpg",
          role: "Clima e Cultura Organizacional",
          function: "Realizam diagnósticos e melhorias para promover um ambiente de trabalho mais motivador",
        },
        {
          name: "Maria Eduarda Barbosa",
          image: "/maria-eduarda-barbosa.jpg",
          role: "Documentação",
          function: "Controle total e revisão do Diário de Bordo",
        },
        {
          name: "Maria Julia Goes",
          image: "/maria-julia-goes.jpg",
          role: "Clima e Cultura Organizacional",
          function: "Realizam diagnósticos e melhorias para promover um ambiente de trabalho mais motivador",
        },
        {
          name: "Eliane Araújo Silva",
          image: "/eliane.jpg",
          role: "Planejamento Estratégico de Pessoas",
          function: "Planejar melhorias, estruturar processos e revisar políticas",
        },
        {
          name: "Gustavo Bispo Viana",
          image: "/gustavo-bispo.jpg",
          role: "Documentação",
          function: "Controle total e revisão de Diário de Bordo",
        },
        {
          name: "Willyan Rodrigues",
          image: "/willyan.jpg",
          role: "Clima e Cultura Organizacional",
          function: "Realizam diagnósticos e melhorias para promover um ambiente de trabalho mais motivador",
        },
      ],
    },
    {
      id: "desenvolvimento",
      name: "Desenvolvimento",
      color: "from-slate-500 to-slate-600",
      icon: "🚀",
      leader: "Pablo Ackillys",
      members: [
        {
          name: "Pablo Ackillys",
          image: "/pablo.jpg",
          role: "Gestor",
          function:
            "Responsável pela coordenação geral do setor de Desenvolvimento e pelo direcionamento do setor de Desenvolvimento",
        },
        {
          name: "Fabio Andrade Irias",
          image: "/fabio.jpg",
          role: "Coordenador de Projetos",
          function: "Apoiando Pablo e conduzindo iniciativas estratégicas",
        },
        {
          name: "Rodrigo Souto",
          image: "/rodrigo.jpg",
          role: "Designer",
          function: "Produzindo materiais visuais, apresentações e identidade do setor",
        },
        {
          name: "Lucas Pereira Santos",
          image: "/lucas-pereira.jpg",
          role: "Assistente de Dados",
          function: "Responsável por coletas, planilhas e relatórios",
        },
        {
          name: "Maria Eduarda de Oliveira",
          image: "/maria-eduarda-o.jpg",
          role: "Assistente de Pesquisa",
          function: "Realizando levantamentos, diagnósticos e entrevistas",
        },
        {
          name: "Rafaela Matos",
          image: "/rafaela-matos.jpg",
          role: "Assistente de Projetos",
          function: "Cuidando de documentação, comunicações e suporte às entregas",
        },
        {
          name: "Sabrina Ramos Alves",
          image: "/sabrina-ramos.jpg",
          role: "Responsável pela Qualidade",
          function: "Monitorando padrões e verificações internas",
        },
        {
          name: "Luana da Silva",
          image: "/luana.jpg",
          role: "Supervisora de Processos",
          function: "Acompanhando execução e padronização dos projetos",
        },
        {
          name: "Cléo Christine Silva",
          role: "Auxiliar Administrativa",
          function: "Apoiando a organização, cronogramas e rotinas internas",
        },
      ],
    },
    {
      id: "eventos",
      name: "Planejamento/Eventos",
      color: "from-gray-600 to-gray-700",
      icon: "🎉",
      leader: "Karoline Xavier",
      members: [
        {
          name: "Karoline Xavier",
          role: "Gestora",
          function:
            "Responsável pela coordenação geral do setor de Planejamento/Eventos e pelo direcionamento do setor de Planejamento/Eventos",
        },
        {
          name: "Gabrielle Alves de Oliveira",
          role: "Coordenadora de Planejamento",
          function: "Organiza cronogramas e estratégias do setor",
        },
        {
          name: "Gabrielly Evangelista",
          image: "/gabrielly-evangelista.jpg",
          role: "Produtora de Eventos",
          function: "Cuida da execução operacional e logística das ações",
        },
        {
          name: "Icaro Moreira Jorge",
          image: "/icaro.jpg",
          role: "Assistente de Planejamento",
          function: "Auxilia na elaboração de cronogramas e documentos",
        },
        {
          name: "Luisa Holanda Alves",
          image: "/luisa.jpg",
          role: "Assistente de Eventos",
          function: "Apoia nas demandas operacionais e organização das ações",
        },
        {
          name: "Richard Machado",
          image: "/richard.jpg",
          role: "Analista de Logística",
          function: "Responsável pelos materiais, fluxos e suporte técnico dos eventos",
        },
        {
          name: "Sofia Alves Sousa",
          image: "/sofia.jpg",
          role: "Apoio Operacional",
          function: "Atua na montagem, organização e suporte durante os eventos",
        },
        {
          name: "Vinicius Neri Brandão",
          image: "/vinicius.jpg",
          role: "Coordenador de Eventos",
          function: "Supervisiona e garante a realização das atividades do setor",
        },
      ],
    },
    {
      id: "pesquisa",
      name: "Pesquisa",
      color: "from-slate-600 to-slate-700",
      icon: "🔍",
      leader: "Thifany Nicoly Gama",
      members: [
        {
          name: "Thifany Nicoly Gama",
          image: "/thifany.jpg",
          role: "Gestora",
          function: "Responsável pela coordenação geral do setor e direcionamento das pesquisas",
        },
        {
          name: "Ana Clara Pereira da Silva",
          image: "/ana.jpg",
          role: "Coordenadora de Pesquisa",
          function: "Organiza cronogramas, métodos e estratégias investigativas",
        },
        {
          name: "Iago Lima Flores",
          image: "/iago-lima.jpg",
          role: "Pesquisador de Campo",
          function: "Realiza coletas, entrevistas e levantamentos externos",
        },
        {
          name: "Isabelly Alves",
          image: "/isabelly-a.jpg",
          role: "Assistente de Pesquisa",
          function: "Apoia na organização de dados, documentos e análises preliminares",
        },
        {
          name: "Isabelly Pinheiro",
          image: "/isabelly-p.jpg",
          role: "Apoio de Pesquisa",
          function: "Auxilia em atividades operacionais e preparação de materiais",
        },
        {
          name: "Willian Marques Barbosa",
          image: "/willian-marques.jpg",
          role: "Analista de Dados",
          function: "Compila informações, gera relatórios e interpreta resultados",
        },
        {
          name: "Yuri Nascimento",
          image: "/yuri.jpg",
          role: "Coordenador de Operações de Pesquisa",
          function: "Lidera a logística, organização e suporte estratégico às atividades do setor",
        },
        {
          name: "Mariana Gonçalves",
          image: "/mariana.jpg",
          role: "Coordenadora de Projetos",
          function: "Supervisiona a execução dos estudos e garante a qualidade das entregas",
        },
      ],
    },
  ],
}

export default function OrganigramaPage() {
  const [expandedDepts, setExpandedDepts] = useState<string[]>([])
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set([...prev, entry.target.id]))
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const toggleDepartment = (deptId: string) => {
    setExpandedDepts((prev) => (prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]))
  }

  const totalEmployees =
    orgData.directors.length +
    orgData.subdirectors.length +
    orgData.departments.reduce((total, dept) => total + dept.members.length, 0)

  const filteredDepartments = orgData.departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.members.some((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInStagger {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideInUp 0.8s ease-out forwards;
        }
        
        .animate-slide-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slide-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-stagger {
          animation: slideInStagger 0.6s ease-out forwards;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .card-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
        
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Enhanced member image styling for proper face focus */
        .member-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
        }
      `}</style>

      {/* Header */}
      <SiteHeader />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header da Página */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between mb-8 sm:mb-12 lg:mb-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <AnimatedLink href="/">
              <Button
                variant="outline"
                size="sm"
                className="glass-effect border-white/30 hover:bg-white/20 bg-transparent text-xs sm:text-sm"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 lg:mr-4 text-gray-600" />
                Voltar
              </Button>
            </AnimatedLink>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 flex items-center">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mr-2 sm:mr-3 lg:mr-4 text-gray-600" />
                Organograma
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                Nossa estrutura organizacional
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Buscar pessoa ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full lg:w-64 xl:w-80 rounded-lg sm:rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Directors */}
        <div
          id="directors"
          data-animate
          className={`text-center mb-16 sm:mb-20 ${visibleElements.has("directors") ? "animate-slide-up" : "opacity-0"}`}
        >
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center">
              Direção
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 lg:gap-12">
            {orgData.directors.map((director, index) => (
              <motion.div key={index} className="w-full sm:max-w-sm mx-auto card-modern hover-lift border-0">
                <motion.div className="text-center p-6 sm:p-8 lg:p-10">
                  <motion.div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/50">
                    {director.image ? (
                      <Image
                        src={director.image || "/placeholder.svg"}
                        alt={`${director.name} - Diretor`}
                        width={160}
                        height={160}
                        className="member-avatar"
                        priority
                      />
                    ) : (
                      <Users className="h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 text-white" />
                    )}
                  </motion.div>
                  <motion.h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-800 mb-2">{director.name}</motion.h2>
                  <motion.p className="text-slate-600 font-semibold text-base sm:text-lg lg:text-xl">
                    {director.position}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connection Line */}
        <div className="flex justify-center mb-16 sm:mb-20">
          <div className="w-1 h-20 sm:h-24 bg-gradient-to-b from-gray-400 via-gray-500 to-slate-400 rounded-full shadow-lg"></div>
        </div>

        {/* Subdirectors */}
        <div
          id="subdirectors"
          data-animate
          className={`text-center mb-20 sm:mb-24 lg:mb-28 ${visibleElements.has("subdirectors") ? "animate-slide-up" : "opacity-0"}`}
        >
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center">
              Subdireção
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-slate-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 lg:gap-12">
            {orgData.subdirectors.map((subdirector, index) => (
              <motion.div key={index} className="w-full sm:max-w-sm mx-auto card-modern hover-lift border-0">
                <motion.div className="text-center p-6 sm:p-8 lg:p-10">
                  <motion.div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white/50">
                    {subdirector.image ? (
                      <Image
                        src={subdirector.image || "/placeholder.svg"}
                        alt={`${subdirector.name} - Subdiretora`}
                        width={144}
                        height={144}
                        className="member-avatar"
                        priority
                      />
                    ) : (
                      <Users className="h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 text-white" />
                    )}
                  </motion.div>
                  <motion.h2 className="text-lg sm:text-xl lg:text-2xl text-gray-800 mb-2">
                    {subdirector.name}
                  </motion.h2>
                  <motion.p className="text-slate-600 font-semibold text-sm sm:text-base lg:text-lg">
                    {subdirector.position}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connection Line */}
        <div className="flex justify-center mb-16 sm:mb-20">
          <div className="w-1 h-20 sm:h-24 bg-gradient-to-b from-slate-400 via-slate-500 to-gray-500 rounded-full shadow-lg"></div>
        </div>

        {/* Departments */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            Departamentos
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-6">Conheça nossa equipe especializada</p>
          <div className="w-32 h-1 bg-gradient-to-r from-gray-500 to-slate-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {filteredDepartments.map((dept, index) => (
            <motion.div
              key={dept.id}
              id={`dept-${dept.id}`}
              data-animate
              className={`space-y-4 ${visibleElements.has(`dept-${dept.id}`) ? "animate-stagger" : "opacity-0"}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <motion.div className="card-modern hover-lift border-0 overflow-hidden">
                <motion.div className="cursor-pointer relative p-5 sm:p-7" onClick={() => toggleDepartment(dept.id)}>
                  <motion.div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-10`}></motion.div>
                  <motion.div className="relative">
                    <motion.div
                      className={`w-full h-1 rounded-full bg-gradient-to-r ${dept.color} mb-5 shadow-lg`}
                    ></motion.div>
                    <motion.div className="flex items-center justify-between">
                      <motion.div className="flex-1 min-w-0">
                        <motion.div className="flex items-center mb-4">
                          <motion.div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center mr-4 shadow-xl flex-shrink-0 ring-2 ring-white/50`}
                          >
                            <motion.span className="text-2xl sm:text-3xl">{dept.icon}</motion.span>
                          </motion.div>
                          <motion.div className="min-w-0 flex-1">
                            <motion.h3 className="text-base sm:text-lg lg:text-xl text-slate-800 leading-tight mb-2">
                              {dept.name}
                            </motion.h3>
                            <motion.div className="text-xs border-slate-300 text-slate-600 bg-white/50">
                              <Users className="h-3 w-3 mr-1" />
                              {dept.members.length} membros
                            </motion.div>
                          </motion.div>
                        </motion.div>
                        <motion.div className="flex items-center justify-end">
                          {expandedDepts.includes(dept.id) ? (
                            <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 transition-transform duration-300" />
                          ) : (
                            <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 transition-transform duration-300" />
                          )}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {expandedDepts.includes(dept.id) && (
                    <motion.div className="pt-0 p-5 sm:p-7 relative animate-fade-in">
                      <motion.div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-5`}></motion.div>
                      <motion.div className="relative space-y-4">
                        <motion.h4 className="font-bold text-slate-700 mb-5 flex items-center text-base sm:text-lg lg:text-xl">
                          <motion.span className="text-xl sm:text-2xl mr-3">{dept.icon}</motion.span>
                          Equipe:
                        </motion.h4>
                        <motion.div className="grid grid-cols-1 gap-3 sm:gap-4">
                          {dept.members.map((member, memberIndex) => (
                            <motion.div
                              key={memberIndex}
                              className="flex items-start space-x-4 p-4 sm:p-5 bg-white/90 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-slate-100"
                            >
                              <motion.div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-white ring-2 ring-slate-200">
                                {member.image ? (
                                  <Image
                                    src={member.image || "/placeholder.svg"}
                                    alt={`${member.name} - ${dept.name}`}
                                    width={80}
                                    height={80}
                                    className="member-avatar object-cover w-full h-full"
                                  />
                                ) : (
                                  <motion.div
                                    className={`w-full h-full bg-gradient-to-br ${dept.color} flex items-center justify-center text-white text-sm font-bold`}
                                  >
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)}
                                  </motion.div>
                                )}
                              </motion.div>
                              <motion.div className="flex-1 min-w-0 space-y-1">
                                <motion.span className="text-sm sm:text-base font-bold text-slate-800 block">
                                  {member.name}
                                </motion.span>
                                <motion.div className="flex items-center">
                                  <motion.span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                    {member.role}
                                  </motion.span>
                                </motion.div>
                                {member.function && (
                                  <motion.p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                    {member.function}
                                  </motion.p>
                                )}
                              </motion.div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 sm:mt-16 text-center text-gray-500 text-xs sm:text-sm"
      >
        <p>Organograma BORAÊ - Atualizado em 2025</p>
      </motion.footer>
    </div>
  )
}
