"use server"

import { createClient } from "@/lib/supabase/server"
import { Task } from "@/lib/types/database"
import { revalidatePath } from "next/cache"

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tasks:", error)
    return []
  }

  return data || []
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching task:", error)
    return null
  }

  return data
}

export async function createTask(
  taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">
): Promise<{ success: boolean; task?: Task; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      ...taskData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating task:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/inbox")
  revalidatePath("/upcoming")

  return { success: true, task: data }
}

export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>
): Promise<{ success: boolean; task?: Task; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating task:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/inbox")
  revalidatePath("/upcoming")
  revalidatePath("/completed")

  return { success: true, task: data }
}

export async function deleteTask(
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/inbox")
  revalidatePath("/upcoming")
  revalidatePath("/completed")

  return { success: true }
}

export async function toggleTaskComplete(
  taskId: string
): Promise<{ success: boolean; task?: Task; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  // First, get the current task
  const { data: currentTask, error: fetchError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !currentTask) {
    console.error("Error fetching task:", fetchError)
    return { success: false, error: "Task not found" }
  }

  // Toggle completion
  const isCompleted = currentTask.status === "completed"
  const updates = {
    status: isCompleted ? "pending" : "completed",
    completed_at: isCompleted ? null : new Date().toISOString(),
  } as Partial<Task>

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error toggling task:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/inbox")
  revalidatePath("/upcoming")
  revalidatePath("/completed")

  return { success: true, task: data }
}

export async function getTasksByStatus(
  status: Task["status"]
): Promise<Task[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", status)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tasks by status:", error)
    return []
  }

  return data || []
}

export async function getTasksByDate(date: string): Promise<Task[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("scheduled_date", date)
    .order("priority", { ascending: true })

  if (error) {
    console.error("Error fetching tasks by date:", error)
    return []
  }

  return data || []
}
