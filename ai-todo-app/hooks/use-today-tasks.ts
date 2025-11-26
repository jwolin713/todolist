"use client"

import { useMemo } from "react"
import { Task } from "@/lib/types/database"
import { scoreTasks, getTopTasks } from "@/lib/scoring/task-scorer"

/**
 * Hook to filter tasks for the "Today" view
 * Returns tasks that should be shown in the Today view based on:
 * - Tasks scheduled for today
 * - Tasks due today or overdue
 * - High priority (1-2) pending tasks without a specific schedule
 * - Top recommended tasks based on scoring algorithm
 */
export function useTodayTasks(tasks: Task[]) {
  const todayTasks = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0] // YYYY-MM-DD format

    return tasks.filter((task) => {
      // Skip archived tasks (but keep completed tasks visible)
      if (task.status === "archived") {
        return false
      }

      // 1. Tasks explicitly scheduled for today
      if (task.scheduled_date === todayStr) {
        return true
      }

      // 2. Tasks due today
      if (task.due_date === todayStr) {
        return true
      }

      // 3. Overdue tasks
      if (task.due_date && task.due_date < todayStr) {
        return true
      }

      // 4. High priority (urgent/high) tasks without a specific schedule
      if (
        (task.priority === 1 || task.priority === 2) &&
        !task.scheduled_date &&
        !task.due_date
      ) {
        return true
      }

      return false
    })
  }, [tasks])

  // Get task scores for sorting
  const taskScores = useMemo(() => {
    const scores = scoreTasks(todayTasks)
    return new Map(scores.map((s) => [s.taskId, s.score]))
  }, [todayTasks])

  // Sort helper function
  const sortByScore = (taskList: Task[]) => {
    return [...taskList].sort((a, b) => {
      const scoreA = taskScores.get(a.id) || 0
      const scoreB = taskScores.get(b.id) || 0
      return scoreB - scoreA
    })
  }

  // Separate overdue tasks for better UX (sorted by score)
  const overdueTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const overdue = todayTasks.filter(
      (task) => task.due_date && task.due_date < today
    )
    return sortByScore(overdue)
  }, [todayTasks, taskScores])

  // Scheduled tasks sorted by score
  const scheduledTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const scheduled = todayTasks.filter((task) => task.scheduled_date === today)
    return sortByScore(scheduled)
  }, [todayTasks, taskScores])

  // Due today tasks sorted by score
  const dueTodayTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const dueToday = todayTasks.filter(
      (task) => task.due_date === today && task.scheduled_date !== today
    )
    return sortByScore(dueToday)
  }, [todayTasks, taskScores])

  // High priority tasks sorted by score
  const highPriorityTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const highPriority = todayTasks.filter(
      (task) =>
        (task.priority === 1 || task.priority === 2) &&
        !task.scheduled_date &&
        task.due_date !== today &&
        !(task.due_date && task.due_date < today)
    )
    return sortByScore(highPriority)
  }, [todayTasks, taskScores])

  // Get top recommended tasks from all active tasks (not just today's)
  const recommendedTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const activeTasks = tasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.status !== "archived" &&
        // Exclude tasks already in today's view
        task.scheduled_date !== today &&
        task.due_date !== today &&
        !(task.due_date && task.due_date < today) &&
        !(
          (task.priority === 1 || task.priority === 2) &&
          !task.scheduled_date &&
          !task.due_date
        )
    )
    return getTopTasks(activeTasks, 5)
  }, [tasks])

  return {
    todayTasks,
    overdueTasks,
    scheduledTasks,
    dueTodayTasks,
    highPriorityTasks,
    recommendedTasks,
    count: todayTasks.length,
    hasOverdue: overdueTasks.length > 0,
    taskScores,
  }
}
