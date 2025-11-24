"use client"

import { useEffect, useRef, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { X, Sparkles } from "lucide-react"
import { ChatMessage as ChatMessageType } from "@/lib/types/ai"
import { getTimeBasedGreeting } from "@/lib/ai/utils"

interface ChatPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messages: ChatMessageType[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export function ChatPanel({
  open,
  onOpenChange,
  messages,
  onSendMessage,
  isLoading = false,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [greeting] = useState(getTimeBasedGreeting())

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[500px] p-0 bg-slate-950 border-slate-800 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="border-b border-slate-800 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <SheetTitle className="text-white">AI Assistant</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {greeting}! Describe your tasks in natural language, and I'll help you organize them.
          </p>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Tell me what you need to do, and I'll help you create and organize your tasks.
              </p>
              <div className="mt-6 space-y-2 w-full max-w-sm">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  Try saying:
                </p>
                <div className="space-y-2">
                  {[
                    "Buy groceries tomorrow",
                    "Finish the project report by Friday",
                    "Schedule a team meeting next week",
                    "Call the dentist (urgent)",
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(example)}
                      className="w-full text-left px-4 py-2 text-sm bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-colors"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  parsedTasks={message.parsedTasks}
                  needsClarification={message.needsClarification}
                  clarifyingQuestions={message.clarifyingQuestions}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={onSendMessage}
            disabled={isLoading}
            placeholder="Describe your tasks..."
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
