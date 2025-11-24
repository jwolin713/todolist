"use client"

import { ParsedTask } from "@/lib/ai/task-parser"
import { cn } from "@/lib/utils"
import { Sparkles, User, HelpCircle } from "lucide-react"
import { TaskPreviewCard } from "./task-preview-card"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  parsedTasks?: ParsedTask[]
  needsClarification?: boolean
  clarifyingQuestions?: string[]
  timestamp?: string
}

export function ChatMessage({
  role,
  content,
  parsedTasks,
  needsClarification,
  clarifyingQuestions,
  timestamp
}: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
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
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Clarifying Questions */}
        {needsClarification && clarifyingQuestions && clarifyingQuestions.length > 0 && (
          <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 w-full">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">
                Need More Info
              </span>
            </div>
            <ul className="space-y-1">
              {clarifyingQuestions.map((question, index) => (
                <li key={index} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-amber-400">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Task Previews */}
        {parsedTasks && parsedTasks.length > 0 && !needsClarification && (
          <div className="mt-2 space-y-2 w-full">
            {parsedTasks.map((task, index) => (
              <TaskPreviewCard key={index} task={task} />
            ))}
          </div>
        )}

        {timestamp && (
          <span className="text-xs text-slate-500 mt-1 px-1">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <User className="h-4 w-4 text-slate-300" />
        </div>
      )}
    </div>
  )
}
