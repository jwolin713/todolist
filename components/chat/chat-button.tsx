"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles } from "lucide-react"
import { useState } from "react"
import { ChatPanel } from "./chat-panel"
import { ChatMessage } from "@/lib/types/ai"

interface ChatButtonProps {
  onSendMessage?: (message: string) => void
  messages?: ChatMessage[]
  isLoading?: boolean
}

export function ChatButton({ onSendMessage, messages = [], isLoading = false }: ChatButtonProps) {
  const [open, setOpen] = useState(false)

  const handleSendMessage = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message)
    }
  }

  return (
    <>
      {/* Floating Action Button - Refined editorial style */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-2xl shadow-soft-lg bg-primary hover:bg-primary/90 text-primary-foreground z-40 md:bottom-8 md:right-28 transition-all duration-200 hover:scale-105 active:scale-95"
        size="icon"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
          <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-primary-foreground/80" />
        </div>
        <span className="sr-only">Open AI Chat</span>
      </Button>

      {/* Chat Panel */}
      <ChatPanel
        open={open}
        onOpenChange={setOpen}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </>
  )
}
