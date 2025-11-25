"use client"

import { useState, useEffect, useCallback } from "react"
import { Message } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"

interface GroupedMessages {
  date: string
  messages: Message[]
}

export function useConversationHistory() {
  const [messages, setMessages] = useState<Message[]>([])
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setMessages(data || [])

      // Group messages by conversation_date
      const grouped = (data || []).reduce((acc, message) => {
        const existingGroup = acc.find((g: GroupedMessages) => g.date === message.conversation_date)
        if (existingGroup) {
          existingGroup.messages.push(message)
        } else {
          acc.push({
            date: message.conversation_date,
            messages: [message],
          })
        }
        return acc
      }, [] as GroupedMessages[])

      // Sort messages within each group by created_at (ascending for chronological order)
      grouped.forEach((group: GroupedMessages) => {
        group.messages.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      })

      setGroupedMessages(grouped)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch messages"
      setError(errorMessage)
      console.error("Error fetching messages:", err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const clearHistory = useCallback(async () => {
    try {
      const { error: deleteError } = await supabase
        .from("messages")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

      if (deleteError) throw deleteError

      setMessages([])
      setGroupedMessages([])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear history"
      setError(errorMessage)
      console.error("Error clearing history:", err)
      throw err
    }
  }, [supabase])

  const deleteConversation = useCallback(
    async (conversationDate: string) => {
      try {
        const { error: deleteError } = await supabase
          .from("messages")
          .delete()
          .eq("conversation_date", conversationDate)

        if (deleteError) throw deleteError

        setMessages((prev) => prev.filter((m) => m.conversation_date !== conversationDate))
        setGroupedMessages((prev) => prev.filter((g) => g.date !== conversationDate))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete conversation"
        setError(errorMessage)
        console.error("Error deleting conversation:", err)
        throw err
      }
    },
    [supabase]
  )

  useEffect(() => {
    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchMessages, supabase])

  return {
    messages,
    groupedMessages,
    loading,
    error,
    clearHistory,
    deleteConversation,
    refresh: fetchMessages,
  }
}
