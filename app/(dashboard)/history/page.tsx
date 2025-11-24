"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { useConversationHistory } from "@/hooks/use-conversation-history"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2, Calendar, User, Sparkles } from "lucide-react"
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
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Conversation History</h2>
              <p className="text-slate-400 mt-1">
                Review your past conversations with the AI assistant
              </p>
            </div>
            {groupedMessages.length > 0 && (
              <Button
                onClick={handleClearHistory}
                variant="outline"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {loading ? (
            <div className="bg-slate-900 rounded-lg p-8 text-center border border-slate-800">
              <p className="text-slate-400">Loading conversation history...</p>
            </div>
          ) : groupedMessages.length === 0 ? (
            <div className="bg-slate-900 rounded-lg p-12 text-center border border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No conversations yet</h3>
              <p className="text-slate-400">
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
                    className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden"
                  >
                    {/* Date Header */}
                    <button
                      onClick={() => toggleDate(group.date)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-indigo-400" />
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-white">
                            {format(new Date(group.date), "PPPP")}
                          </h3>
                          <p className="text-sm text-slate-400">
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
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <span className="text-slate-400">
                          {isExpanded ? "▼" : "▶"}
                        </span>
                      </div>
                    </button>

                    {/* Messages */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 p-6 space-y-4">
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
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                  <Sparkles className="h-4 w-4 text-white" />
                                </div>
                              )}

                              <div className={cn("flex flex-col max-w-[80%]", isUser && "items-end")}>
                                <div
                                  className={cn(
                                    "rounded-2xl px-4 py-3 break-words",
                                    isUser
                                      ? "bg-indigo-600 text-white rounded-br-sm"
                                      : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-sm"
                                  )}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                  </p>
                                </div>
                                <span className="text-xs text-slate-500 mt-1 px-1">
                                  {format(new Date(message.created_at), "p")}
                                </span>
                              </div>

                              {isUser && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                  <User className="h-4 w-4 text-slate-300" />
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
