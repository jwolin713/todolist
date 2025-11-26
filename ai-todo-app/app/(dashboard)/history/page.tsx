"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { useConversationHistory } from "@/hooks/use-conversation-history"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2, Calendar, User, ChevronDown, ChevronRight, Feather } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function HistoryPage() {
  const { groupedMessages, loading, clearHistory, deleteConversation } = useConversationHistory()
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedDates(newExpanded)
  }

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to delete all conversation history? This cannot be undone.")) {
      try {
        await clearHistory()
      } catch (error) {
        console.error("Failed to clear history:", error)
      }
    }
  }

  const handleDeleteConversation = async (date: string) => {
    if (window.confirm(`Delete conversation from ${format(new Date(date), "PPP")}?`)) {
      try {
        await deleteConversation(date)
      } catch (error) {
        console.error("Failed to delete conversation:", error)
      }
    }
  }

  return (
    <>
      <Header title="Conversation History" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif font-medium text-foreground tracking-tight">History</h2>
              <p className="text-muted-foreground mt-1">
                Review your past conversations with the AI assistant
              </p>
            </div>
            {groupedMessages.length > 0 && (
              <Button
                onClick={handleClearHistory}
                variant="outline"
                className="border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" strokeWidth={1.75} />
                Clear All
              </Button>
            )}
          </div>

          {loading ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <span>Loading conversation history...</span>
              </div>
            </div>
          ) : groupedMessages.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">No conversations yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start chatting with the AI assistant to create tasks and organize your work!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedMessages.map((group) => {
                const isExpanded = expandedDates.has(group.date)
                const messageCount = group.messages.length

                return (
                  <div
                    key={group.date}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft"
                  >
                    {/* Date Header */}
                    <button
                      onClick={() => toggleDate(group.date)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-chart-3" strokeWidth={1.75} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-serif font-medium text-foreground">
                            {format(new Date(group.date), "PPPP")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {messageCount} {messageCount === 1 ? "message" : "messages"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConversation(group.date)
                          }}
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </Button>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Messages */}
                    {isExpanded && (
                      <div className="border-t border-border p-6 space-y-4 bg-muted/20">
                        {group.messages.map((message) => {
                          const isUser = message.role === "user"
                          return (
                            <div
                              key={message.id}
                              className={cn(
                                "flex gap-3",
                                isUser ? "justify-end" : "justify-start"
                              )}
                            >
                              {!isUser && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <Feather className="h-4 w-4 text-primary" />
                                </div>
                              )}

                              <div className={cn("flex flex-col max-w-[80%]", isUser && "items-end")}>
                                <div
                                  className={cn(
                                    "rounded-2xl px-4 py-3 break-words",
                                    isUser
                                      ? "bg-primary text-primary-foreground rounded-br-sm"
                                      : "bg-card text-foreground border border-border rounded-bl-sm shadow-soft"
                                  )}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                  </p>
                                </div>
                                <span className="text-xs text-muted-foreground mt-1.5 px-1">
                                  {format(new Date(message.created_at), "p")}
                                </span>
                              </div>

                              {isUser && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                                  <User className="h-4 w-4 text-secondary-foreground" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
