"use client"

import { useState, useEffect, useCallback } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Task } from "@/lib/types/database"

export function useTasks() {
  const { supabase } = useSupabase()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all tasks for the current user
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

  // Initial fetch
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Create a new task
  const createTask = useCallback(async (
    taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error: createError } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          user_id: user.id,
        })
        .select()
        .single()

      if (createError) throw createError

      // Optimistically update local state
      setTasks((prev) => [data, ...prev])

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task"
      setError(errorMessage)
      console.error("Error creating task:", err)
      throw new Error(errorMessage)
    }
  }, [supabase])

  // Update an existing task
  const updateTask = useCallback(async (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>
  ) => {
    try {
      const { data, error: updateError } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single()

      if (updateError) throw updateError

      // Optimistically update local state
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data : task))
      )

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task"
      setError(errorMessage)
      console.error("Error updating task:", err)
      throw new Error(errorMessage)
    }
  }, [supabase])

  // Delete a task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)

      if (deleteError) throw deleteError

      // Optimistically update local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task"
      setError(errorMessage)
      console.error("Error deleting task:", err)
      throw new Error(errorMessage)
    }
  }, [supabase])

  // Toggle task completion
  const toggleTaskComplete = useCallback(async (taskId: string) => {
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
  }, [tasks, updateTask])

  // Get tasks by status
  const getTasksByStatus = useCallback((status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }, [tasks])

  // Get tasks by date
  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter((task) => task.scheduled_date === date)
  }, [tasks])

  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    const now = new Date()
    return tasks.filter((task) => {
      if (task.status === "completed" || !task.due_date) return false
      const dueDate = new Date(task.due_date)
      return dueDate < now
    })
  }, [tasks])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTasksByStatus,
    getTasksByDate,
    getOverdueTasks,
  }
}
