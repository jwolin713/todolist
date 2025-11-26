"use client"

import { useEffect, useRef, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { X, Sparkles, Feather } from "lucide-react"
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
        className="w-full sm:w-[480px] p-0 bg-background border-border flex flex-col shadow-soft-lg"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-6 py-5 flex-shrink-0 bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Feather className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-foreground font-serif font-medium text-lg">AI Assistant</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Powered by Claude</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {greeting}! Describe your tasks naturally, and I'll help organize them for you.
          </p>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-5">
                <Sparkles className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
              </div>
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">Start a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Tell me what you need to accomplish, and I'll help you create and organize your tasks.
              </p>
              <div className="mt-8 space-y-2 w-full max-w-sm">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest mb-3">
                  Try saying
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
                      className="w-full text-left px-4 py-3 text-sm bg-card hover:bg-accent border border-border hover:border-primary/20 rounded-xl text-foreground transition-all duration-200 hover:shadow-soft"
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
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Feather className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 border border-border">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-border bg-card/50">
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
