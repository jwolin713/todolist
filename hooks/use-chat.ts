"use client"

import { useState, useCallback } from "react"
import { ChatMessage } from "@/lib/types/ai"
import { ParsedTask } from "@/lib/ai/task-parser"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Add user message to chat
      const userMessage: ChatMessage = {
        role: "user",
        content,
      }

      setMessages((prev) => [...prev, userMessage])

      // Call the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()

      // Add assistant message with parsed tasks
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.message,
        parsedTasks: data.tasks as ParsedTask[],
        taskIds: data.taskIds as string[],
        needsClarification: data.needs_clarification,
        clarifyingQuestions: data.clarifying_questions as string[],
      }

      setMessages((prev) => [...prev, assistantMessage])

      return {
        message: data.message,
        tasks: data.tasks,
        taskIds: data.taskIds,
        needsClarification: data.needs_clarification,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message"
      setError(errorMessage)
      console.error("Chat error:", err)

      // Add error message to chat
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMsg])

      throw err
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const removeLastMessage = useCallback(() => {
    setMessages((prev) => prev.slice(0, -1))
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    removeLastMessage,
  }
}
