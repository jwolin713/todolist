import { useMemo } from "react"
import { Task } from "@/lib/types/database"
import {
  scoreTasks,
  getTopTasks,
  getContextualTasks,
  TaskScore,
} from "@/lib/scoring/task-scorer"

interface UseScoringOptions {
  availableTime?: number
  currentEnergy?: "high" | "medium" | "low"
}

export function useTaskScoring(tasks: Task[], options?: UseScoringOptions) {
  const scores = useMemo(() => {
    return scoreTasks(tasks, {
      availableTime: options?.availableTime,
      currentEnergy: options?.currentEnergy,
    })
  }, [tasks, options?.availableTime, options?.currentEnergy])

  const scoredTasks = useMemo(() => {
    const scoreMap = new Map(scores.map((s) => [s.taskId, s]))
    return tasks.map((task) => ({
      task,
      score: scoreMap.get(task.id),
    }))
  }, [tasks, scores])

  const topTasks = useMemo(() => {
    return getTopTasks(tasks, 5, {
      availableTime: options?.availableTime,
      currentEnergy: options?.currentEnergy,
    })
  }, [tasks, options?.availableTime, options?.currentEnergy])

  const contextualTasks = useMemo(() => {
    if (!options?.availableTime || !options?.currentEnergy) {
      return []
    }
    return getContextualTasks(
      tasks,
      options.availableTime,
      options.currentEnergy
    )
  }, [tasks, options?.availableTime, options?.currentEnergy])

  const getTaskScore = (taskId: string): TaskScore | undefined => {
    return scores.find((s) => s.taskId === taskId)
  }

  return {
    scores,
    scoredTasks,
    topTasks,
    contextualTasks,
    getTaskScore,
  }
}
