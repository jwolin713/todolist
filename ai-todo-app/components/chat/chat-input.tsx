"use client"

import { useState, KeyboardEvent, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Describe your tasks...",
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage("")

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="p-4">
      <div className="flex gap-3 items-end">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[48px] max-h-[200px] resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 rounded-xl"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 h-12 flex-shrink-0 rounded-xl transition-all duration-200 disabled:opacity-40"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" strokeWidth={1.75} />
          )}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2.5">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded-md font-medium text-foreground">Enter</kbd> to send,{" "}
        <kbd className="px-1.5 py-0.5 bg-muted rounded-md font-medium text-foreground">Shift + Enter</kbd> for new line
      </p>
    </div>
  )
}
