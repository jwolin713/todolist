"use client"

import { useEffect, useState, useCallback } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Task } from "@/lib/types/database"
import { RealtimeChannel } from "@supabase/supabase-js"

export function useRealtimeTasks() {
  const { supabase } = useSupabase()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initial fetch
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setTasks([])
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks")
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Initial fetch on mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Set up real-time subscription
  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      channel = supabase
        .channel(`tasks:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "tasks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Real-time INSERT:", payload)
            setTasks((current) => [payload.new as Task, ...current])
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "tasks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Real-time UPDATE:", payload)
            setTasks((current) =>
              current.map((task) =>
                task.id === payload.new.id ? (payload.new as Task) : task
              )
            )
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "tasks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Real-time DELETE:", payload)
            setTasks((current) =>
              current.filter((task) => task.id !== payload.old.id)
            )
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status)
        })
    }

    setupRealtimeSubscription()

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  // CRUD operations with optimistic updates
  const createTask = useCallback(
    async (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("User not authenticated")
        }

        // No optimistic update for create - let real-time subscription handle it
        // This prevents duplicate tasks when real-time event fires
        const { data, error: createError } = await supabase
          .from("tasks")
          .insert({
            ...taskData,
            user_id: user.id,
          })
          .select()
          .single()

        if (createError) throw createError

        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create task"
        setError(errorMessage)
        console.error("Error creating task:", err)
        throw new Error(errorMessage)
      }
    },
    [supabase]
  )

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>) => {
      try {
        const previousTasks = tasks

        // Optimistic update
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        )

        const { data, error: updateError } = await supabase
          .from("tasks")
          .update(updates)
          .eq("id", taskId)
          .select()
          .single()

        if (updateError) throw updateError

        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update task"
        setError(errorMessage)
        console.error("Error updating task:", err)
        // Rollback on error
        fetchTasks()
        throw new Error(errorMessage)
      }
    },
    [supabase, tasks, fetchTasks]
  )

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        // Optimistic update
        setTasks((current) => current.filter((task) => task.id !== taskId))

        const { error: deleteError } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId)

        if (deleteError) throw deleteError
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete task"
        setError(errorMessage)
        console.error("Error deleting task:", err)
        // Rollback on error
        fetchTasks()
        throw new Error(errorMessage)
      }
    },
    [supabase, fetchTasks]
  )

  const toggleTaskComplete = useCallback(
    async (taskId: string) => {
      try {
        const task = tasks.find((t) => t.id === taskId)
        if (!task) throw new Error("Task not found")

        const isCompleted = task.status === "completed"
        const updates = {
          status: isCompleted ? "pending" : "completed",
          completed_at: isCompleted ? null : new Date().toISOString(),
        } as Partial<Task>

        await updateTask(taskId, updates)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to toggle task"
        setError(errorMessage)
        console.error("Error toggling task:", err)
        throw new Error(errorMessage)
      }
    },
    [tasks, updateTask]
  )

  const archiveTask = useCallback(
    async (taskId: string) => {
      try {
        await updateTask(taskId, { status: "archived" })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to archive task"
        setError(errorMessage)
        console.error("Error archiving task:", err)
        throw new Error(errorMessage)
      }
    },
    [updateTask]
  )

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    archiveTask,
  }
}
