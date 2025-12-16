"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { containsInappropriateContent, validateUserName } from "@/lib/moderation"

interface CommentFormProps {
  onSubmit: (authorName: string, content: string) => Promise<{ success: boolean; error?: string }>
  initialAuthorName?: string
  placeholder?: string
  buttonText?: string
}

export function CommentForm({
  onSubmit,
  initialAuthorName = "",
  placeholder = "Escreva um comentário...",
  buttonText = "Enviar",
}: CommentFormProps) {
  const [authorName, setAuthorName] = useState(initialAuthorName)
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Validação em tempo real do nome
  const handleNameChange = (value: string) => {
    setAuthorName(value)
    setError(null)
    setSuccess(false)
  }

  // Validação em tempo real do conteúdo
  const handleContentChange = (value: string) => {
    setContent(value)
    setError(null)
    setSuccess(false)

    // Verificar em tempo real se há conteúdo impróprio
    if (value.length > 3) {
      const check = containsInappropriateContent(value)
      if (check.isInappropriate) {
        setError(check.reason)
      }
    }
  }

  const handleSubmit = async () => {
    if (!authorName.trim() || !content.trim() || isSubmitting) return

    // Validar nome
    const nameValidation = validateUserName(authorName)
    if (!nameValidation.isValid) {
      setError(nameValidation.reason)
      return
    }

    // Validar conteúdo
    const contentCheck = containsInappropriateContent(content)
    if (contentCheck.isInappropriate) {
      setError(contentCheck.reason)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await onSubmit(authorName.trim(), content.trim())

      if (result.success) {
        setContent("")
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || "Erro ao enviar comentário")
      }
    } catch (err) {
      setError("Erro ao enviar comentário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Campo de nome */}
      <Input
        placeholder="Seu nome"
        value={authorName}
        onChange={(e) => handleNameChange(e.target.value)}
        className="bg-white"
        maxLength={50}
      />

      {/* Campo de comentário */}
      <div className="flex gap-2">
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className={`bg-white min-h-[60px] resize-none flex-1 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
          maxLength={500}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && content.trim() && authorName.trim() && !error) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || !authorName.trim() || isSubmitting || !!error}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 self-end"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mensagem de erro */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensagem de sucesso */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg"
          >
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>Comentário enviado com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contador de caracteres */}
      <div className="text-xs text-gray-400 text-right">{content.length}/500 caracteres</div>
    </div>
  )
}
