"use client"

import { useState, useEffect, useCallback } from "react"
import { Task } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"

export function useSubtasks(parentTaskId: string | null) {
  const [subtasks, setSubtasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Fetch subtasks
  const fetchSubtasks = useCallback(async () => {
    if (!parentTaskId) {
      setSubtasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("parent_task_id", parentTaskId)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true })

      if (fetchError) throw fetchError

      setSubtasks(data || [])
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch subtasks"
      setError(errorMessage)
      console.error("Error fetching subtasks:", err)
    } finally {
      setLoading(false)
    }
  }, [parentTaskId, supabase])

  // Create subtask
  const createSubtask = useCallback(
    async (subtaskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at" | "parent_task_id">) => {
      if (!parentTaskId) return

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        const { data, error: createError } = await supabase
          .from("tasks")
          .insert({
            ...subtaskData,
            user_id: user.id,
            parent_task_id: parentTaskId,
            position: subtasks.length,
          })
          .select()
          .single()

        if (createError) throw createError

        setSubtasks((prev) => [...prev, data])
        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create subtask"
        setError(errorMessage)
        console.error("Error creating subtask:", err)
        throw err
      }
    },
    [parentTaskId, subtasks.length, supabase]
  )

  // Update subtask
  const updateSubtask = useCallback(
    async (subtaskId: string, updates: Partial<Task>) => {
      try {
        // Optimistic update
        setSubtasks((prev) =>
          prev.map((task) => (task.id === subtaskId ? { ...task, ...updates } : task))
        )

        const { data, error: updateError } = await supabase
          .from("tasks")
          .update(updates)
          .eq("id", subtaskId)
          .select()
          .single()

        if (updateError) throw updateError

        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update subtask"
        setError(errorMessage)
        console.error("Error updating subtask:", err)
        // Rollback on error
        fetchSubtasks()
        throw err
      }
    },
    [supabase, fetchSubtasks]
  )

  // Delete subtask
  const deleteSubtask = useCallback(
    async (subtaskId: string) => {
      try {
        // Optimistic update
        setSubtasks((prev) => prev.filter((task) => task.id !== subtaskId))

        const { error: deleteError } = await supabase
          .from("tasks")
          .delete()
          .eq("id", subtaskId)

        if (deleteError) throw deleteError
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete subtask"
        setError(errorMessage)
        console.error("Error deleting subtask:", err)
        // Rollback on error
        fetchSubtasks()
        throw err
      }
    },
    [supabase, fetchSubtasks]
  )

  // Toggle subtask completion
  const toggleSubtaskComplete = useCallback(
    async (subtaskId: string) => {
      const subtask = subtasks.find((t) => t.id === subtaskId)
      if (!subtask) return

      const isCompleted = subtask.status === "completed"
      const updates: Partial<Task> = {
        status: isCompleted ? "pending" : "completed",
        completed_at: isCompleted ? null : new Date().toISOString(),
      }

      await updateSubtask(subtaskId, updates)
    },
    [subtasks, updateSubtask]
  )

  // Calculate completion progress
  const progress = useCallback(() => {
    if (subtasks.length === 0) return 0
    const completed = subtasks.filter((t) => t.status === "completed").length
    return Math.round((completed / subtasks.length) * 100)
  }, [subtasks])

  useEffect(() => {
    fetchSubtasks()

    // Set up real-time subscription
    if (!parentTaskId) return

    const channel = supabase
      .channel(`subtasks:${parentTaskId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `parent_task_id=eq.${parentTaskId}`,
        },
        () => {
          fetchSubtasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [parentTaskId, fetchSubtasks, supabase])

  return {
    subtasks,
    loading,
    error,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtaskComplete,
    progress: progress(),
  }
}
