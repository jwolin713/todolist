"use client"

import { ParsedTask } from "@/lib/ai/task-parser"
import { cn } from "@/lib/utils"
import { Feather, User, HelpCircle } from "lucide-react"
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
    <div className={cn("flex gap-3 mb-5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Feather className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className={cn("flex flex-col max-w-[85%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 break-words",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card text-foreground border border-border rounded-bl-sm shadow-soft"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Clarifying Questions */}
        {needsClarification && clarifyingQuestions && clarifyingQuestions.length > 0 && (
          <div className="mt-3 bg-chart-4/10 border border-chart-4/20 rounded-xl p-4 w-full">
            <div className="flex items-center gap-2 mb-2.5">
              <HelpCircle className="h-4 w-4 text-chart-4" />
              <span className="text-[11px] font-semibold text-chart-4 uppercase tracking-widest">
                Need More Info
              </span>
            </div>
            <ul className="space-y-1.5">
              {clarifyingQuestions.map((question, index) => (
                <li key={index} className="text-sm text-foreground flex gap-2">
                  <span className="text-chart-4 mt-0.5">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Task Previews */}
        {parsedTasks && parsedTasks.length > 0 && !needsClarification && (
          <div className="mt-3 space-y-2 w-full">
            {parsedTasks.map((task, index) => (
              <TaskPreviewCard key={index} task={task} />
            ))}
          </div>
        )}

        {timestamp && (
          <span className="text-[11px] text-muted-foreground mt-1.5 px-1">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  )
}
