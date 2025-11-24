import { ParsedTask } from "./task-parser"
import { Task } from "../types/database"

/**
 * Converts a ParsedTask from the AI to a partial Task object for database insertion
 */
export function parsedTaskToTask(parsedTask: ParsedTask): Omit<Task, "id" | "user_id" | "created_at" | "updated_at"> {
  return {
    title: parsedTask.title,
    description: parsedTask.description || null,
    priority: parsedTask.priority || 3,
    estimated_minutes: parsedTask.estimated_minutes || null,
    category: parsedTask.category || null,
    energy_level: parsedTask.energy_level || null,
    due_date: parsedTask.due_date || null,
    due_time: parsedTask.due_time || null,
    scheduled_date: parsedTask.scheduled_date || null,
    recurrence_rule: null,
    status: "pending",
    completed_at: null,
    parent_task_id: null,
    position: 0,
    source_message_id: null,
  }
}

/**
 * Formats a task for display in the chat
 */
export function formatTaskForChat(task: Task): string {
  const parts = [task.title]

  if (task.priority && task.priority <= 2) {
    const priorityLabel = task.priority === 1 ? "Urgent" : "High"
    parts.push(`[${priorityLabel} Priority]`)
  }

  if (task.due_date) {
    const dueDate = new Date(task.due_date)
    parts.push(`Due: ${dueDate.toLocaleDateString()}`)
  }

  if (task.scheduled_date) {
    const scheduledDate = new Date(task.scheduled_date)
    parts.push(`Scheduled: ${scheduledDate.toLocaleDateString()}`)
  }

  if (task.estimated_minutes) {
    const hours = Math.floor(task.estimated_minutes / 60)
    const minutes = task.estimated_minutes % 60
    if (hours > 0) {
      parts.push(`~${hours}h ${minutes}m`)
    } else {
      parts.push(`~${minutes}m`)
    }
  }

  return parts.join(" • ")
}

/**
 * Gets a friendly greeting based on the time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()

  if (hour < 12) {
    return "Good morning"
  } else if (hour < 18) {
    return "Good afternoon"
  } else {
    return "Good evening"
  }
}

/**
 * Validates that a date string is in YYYY-MM-DD format
 */
export function isValidDateFormat(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateStr)) {
    return false
  }

  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

/**
 * Validates that a time string is in HH:MM format
 */
export function isValidTimeFormat(timeStr: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(timeStr)
}
