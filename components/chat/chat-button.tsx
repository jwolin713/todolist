"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
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
      {/* Floating Action Button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white z-40 md:bottom-8 md:right-28"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
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
