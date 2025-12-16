// Sistema avançado de moderação de comentários
// Utiliza múltiplas camadas de verificação para filtrar conteúdo realmente impróprio
// NÃO bloqueia nomes de pessoas comuns

// ============================================================================
// 1. PORTUGUÊS — Lista de Palavras Realmente Vulgares e Ofensivas
// (Removidos termos que podem ser nomes ou palavras comuns)
// ============================================================================

const portugueseWords = {
  // 1.1 Genitais / Anatomia sexual (apenas termos explícitos)
  anatomia: [
    "pinto",
    "penis",
    "pênis",
    "pauzao",
    "pauzão",
    "rola",
    "rolao",
    "rolão",
    "caralho",
    "cacete",
    "piroca",
    "buceta",
    "bct",
    "xoxota",
    "xota",
    "xana",
    "perereca",
    "grelo",
    "cuzinho",
    "fiofo",
    "fiofó",
  ],

  // 1.2 Atos sexuais (vulgar)
  atosSexuais: [
    "foder",
    "fuder",
    "fodase",
    "foda-se",
    "punheta",
    "punheteiro",
    "boquete",
    "mamada",
    "suruba",
    "orgia",
    "sodomia",
  ],

  // 1.3 Ofensas e insultos graves
  ofensas: [
    "merda",
    "bosta",
    "porra",
    "puta",
    "putaria",
    "putinha",
    "putona",
    "piranha",
    "vagabunda",
    "vagabundo",
    "arrombado",
    "arrombada",
    "fdp",
    "filho da puta",
    "filha da puta",
    "desgraçado",
    "desgraçada",
    "desgracado",
    "desgracada",
    "corno",
    "cornao",
    "cornão",
    "otario",
    "otária",
    "otário",
    "imbecil",
    "cretino",
    "cretina",
    "retardado",
    "retardada",
    "mongoloide",
  ],

  // 1.4 Termos discriminatórios graves
  discriminatorios: [
    "viado",
    "veado",
    "bicha",
    "bichona",
    "sapatao",
    "sapatão",
    "sapatona",
    "traveco",
    "boiola",
    "crioulo",
    "macaco",
    "macaca",
    "favelado",
    "favelada",
  ],

  // 1.5 Termos violentos ou ameaçadores
  violentos: [
    "te arrebento",
    "vou te pegar",
    "vou te quebrar",
    "vou te bater",
    "vou te foder",
    "te matar",
    "vou te matar",
    "se mata",
    "se matar",
    "estupro",
    "estuprar",
    "estuprador",
    "violentar",
    "abusar",
    "abusador",
    "pedofilo",
    "pedófilo",
  ],
}

// ============================================================================
// 2. INGLÊS — Lista de Palavrões Graves
// ============================================================================

const englishWords = {
  // 2.1 Genitals / Anatomy
  anatomy: ["dick", "dickhead", "cock", "cockhead", "pussy", "cunt", "twat", "asshole", "butthole"],

  // 2.2 Sexual acts (explicit)
  sexualActs: [
    "fuck",
    "fucking",
    "fucked",
    "fucker",
    "blowjob",
    "handjob",
    "jerk off",
    "jack off",
    "cumshot",
    "gangbang",
    "deepthroat",
    "suck my dick",
    "suck my cock",
  ],

  // 2.3 Insults graves
  insults: [
    "bitch",
    "bitches",
    "son of a bitch",
    "slut",
    "whore",
    "bastard",
    "motherfucker",
    "mf",
    "mofo",
    "dumbass",
    "dipshit",
    "fuckhead",
    "shithead",
    "retard",
    "retarded",
    "bullshit",
    "asshat",
    "douchebag",
  ],

  // 2.4 Discriminatory terms
  discriminatory: [
    "nigger",
    "nigga",
    "n word",
    "nword",
    "fag",
    "faggot",
    "fagot",
    "dyke",
    "tranny",
    "shemale",
    "spic",
    "wetback",
    "beaner",
    "chink",
    "gook",
  ],

  // 2.5 Violent expressions
  violent: ["kill yourself", "kys", "go die", "i will kill you", "rape", "rapist", "molest", "pedophile", "pedo"],
}

// ============================================================================
// 3. ABREVIAÇÕES TÓXICAS COMUNS
// ============================================================================

const toxicAbbreviations = [
  "krl",
  "krlh",
  "fdp",
  "vsf",
  "vtnc",
  "tmnc",
  "pqp",
  "stfu",
  "gtfo",
  "fk",
  "fck",
  "fuk",
  "fuq",
  "sht",
  "btch",
  "cnt",
  "dck",
]

// ============================================================================
// 4. LISTA DE NOMES COMUNS PARA NÃO BLOQUEAR
// ============================================================================

const commonNames = [
  // Nomes brasileiros comuns
  "diego",
  "diogo",
  "rodrigo",
  "pedro",
  "paulo",
  "lucas",
  "mateus",
  "matheus",
  "gabriel",
  "rafael",
  "miguel",
  "arthur",
  "bernardo",
  "heitor",
  "davi",
  "david",
  "lorenzo",
  "theo",
  "samuel",
  "benjamin",
  "nicolas",
  "henrique",
  "gustavo",
  "murilo",
  "pietro",
  "vicente",
  "antonio",
  "caio",
  "enzo",
  "bruno",
  "felipe",
  "vinicius",
  "guilherme",
  "joaquin",
  "otavio",
  "joao",
  "victor",
  "eduardo",
  "ana",
  "maria",
  "julia",
  "alice",
  "sophia",
  "laura",
  "valentina",
  "helena",
  "isabella",
  "manuela",
  "beatriz",
  "cecilia",
  "clara",
  "livia",
  "lorena",
  "giovanna",
  "mariana",
  "fernanda",
  "camila",
  "juliana",
  "patricia",
  "amanda",
  "leticia",
  "carla",
  "paula",
  "daniela",
  "natalia",
  "carolina",
  "bianca",
  "gabriela",
  "rafaela",
  "larissa",
  "aline",
  "bruna",
  "jessica",
  "priscila",
  "thais",
  "renata",
  "vanessa",
  "sabrina",
  "monica",
  "adriana",
  "claudia",
  "layne",
  "jose",
  "giulia",
  "karoline",
  "thifany",
  "yuri",
  "filipe",
  "felipe",
  "iago",
  "willian",
  "william",
  "isabelly",
  "mariana",
  "thifany",
  "pablo",
  // Adicione mais nomes conforme necessário
]

// ============================================================================
// FUNÇÕES DE NORMALIZAÇÃO
// ============================================================================

function removeAccents(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/ñ/g, "n")
}

function normalizeText(text: string): string {
  return removeAccents(text.toLowerCase().trim())
}

// Gera todas as palavras impróprias como uma lista única
function getAllInappropriateWords(): string[] {
  const allWords: string[] = []

  Object.values(portugueseWords).forEach((category) => allWords.push(...category))
  Object.values(englishWords).forEach((category) => allWords.push(...category))
  allWords.push(...toxicAbbreviations)

  return [...new Set(allWords)]
}

// Verifica se uma palavra é um nome comum
function isCommonName(word: string): boolean {
  const normalized = normalizeText(word)
  return commonNames.some((name) => normalizeText(name) === normalized)
}

// ============================================================================
// FUNÇÕES PÚBLICAS DE EXPORTAÇÃO
// ============================================================================

export function containsInappropriateContent(text: string): {
  isInappropriate: boolean
  detectedWords: string[]
  reason: string
} {
  const detectedWords: string[] = []
  const normalizedText = normalizeText(text)
  const allWords = getAllInappropriateWords()
  const words = text.split(/\s+/)

  // Verificar cada palavra individualmente
  for (const word of words) {
    const normalizedWord = normalizeText(word)

    if (isCommonName(normalizedWord)) {
      continue
    }

    // Verificar contra lista de palavras impróprias
    for (const badWord of allWords) {
      const normalizedBadWord = normalizeText(badWord)

      // Verificação exata de palavra completa
      if (normalizedWord === normalizedBadWord) {
        detectedWords.push(badWord)
        break
      }

      // Verificação se a palavra contém o termo impróprio (apenas para termos longos)
      if (normalizedBadWord.length >= 5 && normalizedWord.includes(normalizedBadWord)) {
        detectedWords.push(badWord)
        break
      }
    }
  }

  // Verificar frases completas (para expressões como "filho da puta")
  for (const badWord of allWords) {
    if (badWord.includes(" ")) {
      const normalizedBadWord = normalizeText(badWord)
      if (normalizedText.includes(normalizedBadWord)) {
        if (!detectedWords.includes(badWord)) {
          detectedWords.push(badWord)
        }
      }
    }
  }

  // Verificação de spam (caracteres repetidos excessivamente)
  if (/(.)\1{5,}/.test(text)) {
    return {
      isInappropriate: true,
      detectedWords: ["spam detectado"],
      reason: "Texto contém repetição excessiva de caracteres.",
    }
  }

  // Verificação de conteúdo muito curto ou apenas símbolos
  const cleanText = text.replace(/[^a-zA-Z0-9áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]/gi, "").trim()
  if (cleanText.length < 2 && text.length > 0) {
    return {
      isInappropriate: true,
      detectedWords: ["conteúdo inválido"],
      reason: "O comentário deve conter texto válido.",
    }
  }

  const uniqueDetected = [...new Set(detectedWords)]

  if (uniqueDetected.length > 0) {
    return {
      isInappropriate: true,
      detectedWords: uniqueDetected,
      reason: "Seu comentário contém linguagem imprópria. Por favor, reescreva de forma respeitosa.",
    }
  }

  return {
    isInappropriate: false,
    detectedWords: [],
    reason: "",
  }
}

// Censura palavras impróprias com asteriscos
export function censorText(text: string): string {
  let censoredText = text
  const allWords = getAllInappropriateWords()

  for (const word of allWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    censoredText = censoredText.replace(regex, "*".repeat(word.length))
  }

  return censoredText
}

export function validateUserName(name: string): {
  isValid: boolean
  reason: string
} {
  const trimmedName = name.trim()

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      reason: "O nome deve ter pelo menos 2 caracteres.",
    }
  }

  if (trimmedName.length > 50) {
    return {
      isValid: false,
      reason: "O nome deve ter no máximo 50 caracteres.",
    }
  }

  // Verificar se contém apenas caracteres válidos para nomes
  if (!/^[a-zA-ZáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s\-.]+$/.test(trimmedName)) {
    return {
      isValid: false,
      reason: "O nome deve conter apenas letras e espaços.",
    }
  }

  const words = trimmedName.split(/\s+/)
  for (const word of words) {
    // Se for um nome comum, aceitar
    if (isCommonName(word)) {
      continue
    }

    // Verificar apenas palavras muito ofensivas no nome
    const graveProfanity = [
      "puta",
      "putinha",
      "fdp",
      "caralho",
      "buceta",
      "piroca",
      "fuck",
      "shit",
      "bitch",
      "cunt",
      "nigger",
      "faggot",
    ]

    const normalizedWord = normalizeText(word)
    for (const badWord of graveProfanity) {
      if (normalizedWord === normalizeText(badWord)) {
        return {
          isValid: false,
          reason: "O nome contém conteúdo impróprio.",
        }
      }
    }
  }

  return {
    isValid: true,
    reason: "",
  }
}

// Exporta função para verificar se é nome comum
export function isValidName(name: string): boolean {
  return isCommonName(name)
}
