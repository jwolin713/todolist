import { Task } from "@/lib/types/database"

export interface TaskScore {
  taskId: string
  score: number
  breakdown: {
    priorityScore: number
    dueDateScore: number
    timeScore: number
    energyScore: number
  }
}

interface ScoringContext {
  currentDate: Date
  currentHour: number
  availableTime?: number // minutes available
  currentEnergy?: "high" | "medium" | "low"
}

/**
 * Calculate priority score (0-40 points)
 * Priority 1 (Urgent) = 40 points
 * Priority 2 (High) = 30 points
 * Priority 3 (Medium) = 20 points
 * Priority 4 (Low) = 10 points
 */
function calculatePriorityScore(priority: number): number {
  const priorityMap: Record<number, number> = {
    1: 40,
    2: 30,
    3: 20,
    4: 10,
  }
  return priorityMap[priority] || 20
}

/**
 * Calculate due date score (0-40 points)
 * Overdue = 40 points
 * Due today = 35 points
 * Due tomorrow = 25 points
 * Due this week = 15 points
 * Due later = 5 points
 * No due date = 10 points
 */
function calculateDueDateScore(dueDate: string | null, currentDate: Date): number {
  if (!dueDate) return 10

  const due = new Date(dueDate)
  const today = new Date(currentDate)
  today.setHours(0, 0, 0, 0)

  const dueCopy = new Date(due)
  dueCopy.setHours(0, 0, 0, 0)

  const diffTime = dueCopy.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 40 // Overdue
  if (diffDays === 0) return 35 // Due today
  if (diffDays === 1) return 25 // Due tomorrow
  if (diffDays <= 7) return 15 // Due this week
  return 5 // Due later
}

/**
 * Calculate time score (0-10 points)
 * Rewards tasks that fit available time
 */
function calculateTimeScore(
  estimatedMinutes: number | null,
  availableTime?: number
): number {
  if (!estimatedMinutes) return 5 // Default score for unknown time

  // If no available time specified, prefer shorter tasks
  if (!availableTime) {
    if (estimatedMinutes <= 15) return 10
    if (estimatedMinutes <= 30) return 8
    if (estimatedMinutes <= 60) return 6
    return 4
  }

  // If task fits in available time, score based on fit
  if (estimatedMinutes <= availableTime) {
    const fitRatio = estimatedMinutes / availableTime
    if (fitRatio > 0.8) return 10 // Good use of available time
    if (fitRatio > 0.5) return 8
    return 6
  }

  return 2 // Task doesn't fit available time
}

/**
 * Calculate energy score (0-10 points)
 * Rewards tasks that match current energy level
 */
function calculateEnergyScore(
  taskEnergy: "high" | "medium" | "low" | null,
  currentEnergy?: "high" | "medium" | "low"
): number {
  if (!taskEnergy) return 5 // Default for unknown energy

  // If no current energy specified, use time-based heuristic
  if (!currentEnergy) {
    // Morning hours (6-12) = high energy
    // Afternoon (12-18) = medium energy
    // Evening (18-22) = low energy
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) currentEnergy = "high"
    else if (hour >= 12 && hour < 18) currentEnergy = "medium"
    else currentEnergy = "low"
  }

  // Perfect match
  if (taskEnergy === currentEnergy) return 10

  // Energy mapping for compatibility
  const energyLevels = { high: 3, medium: 2, low: 1 }
  const taskLevel = energyLevels[taskEnergy]
  const currentLevel = energyLevels[currentEnergy]

  // Can do lower energy tasks with higher energy
  if (currentLevel > taskLevel) return 7

  // Harder to do high energy tasks with low energy
  const diff = Math.abs(currentLevel - taskLevel)
  if (diff === 1) return 4
  return 2
}

/**
 * Calculate comprehensive score for a task
 * Total possible score: 100 points
 */
export function calculateTaskScore(
  task: Task,
  context: ScoringContext
): TaskScore {
  const priorityScore = calculatePriorityScore(task.priority)
  const dueDateScore = calculateDueDateScore(task.due_date, context.currentDate)
  const timeScore = calculateTimeScore(task.estimated_minutes, context.availableTime)
  const energyScore = calculateEnergyScore(task.energy_level, context.currentEnergy)

  const score = priorityScore + dueDateScore + timeScore + energyScore

  return {
    taskId: task.id,
    score,
    breakdown: {
      priorityScore,
      dueDateScore,
      timeScore,
      energyScore,
    },
  }
}

/**
 * Score multiple tasks and return sorted by score (highest first)
 */
export function scoreTasks(
  tasks: Task[],
  context?: Partial<ScoringContext>
): TaskScore[] {
  const fullContext: ScoringContext = {
    currentDate: new Date(),
    currentHour: new Date().getHours(),
    ...context,
  }

  return tasks
    .filter((task) => task.status !== "completed")
    .map((task) => calculateTaskScore(task, fullContext))
    .sort((a, b) => b.score - a.score)
}

/**
 * Get top N recommended tasks for the current context
 */
export function getTopTasks(
  tasks: Task[],
  limit: number = 5,
  context?: Partial<ScoringContext>
): Task[] {
  const scores = scoreTasks(tasks, context)
  const topScores = scores.slice(0, limit)
  const scoreMap = new Map(topScores.map((s) => [s.taskId, s.score]))

  return tasks
    .filter((task) => scoreMap.has(task.id))
    .sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0))
}

/**
 * Get tasks suitable for the current time and energy context
 */
export function getContextualTasks(
  tasks: Task[],
  availableMinutes: number,
  currentEnergy: "high" | "medium" | "low"
): Task[] {
  return tasks
    .filter((task) => {
      if (task.status === "completed") return false

      // Filter by time
      if (task.estimated_minutes && task.estimated_minutes > availableMinutes) {
        return false
      }

      // Filter by energy (can do same or lower energy tasks)
      if (task.energy_level) {
        const energyLevels = { high: 3, medium: 2, low: 1 }
        const taskLevel = energyLevels[task.energy_level]
        const currentLevel = energyLevels[currentEnergy]
        if (taskLevel > currentLevel) return false
      }

      return true
    })
    .sort((a, b) => {
      const scoreA = calculateTaskScore(a, {
        currentDate: new Date(),
        currentHour: new Date().getHours(),
        availableTime: availableMinutes,
        currentEnergy,
      }).score
      const scoreB = calculateTaskScore(b, {
        currentDate: new Date(),
        currentHour: new Date().getHours(),
        availableTime: availableMinutes,
        currentEnergy,
      }).score
      return scoreB - scoreA
    })
}
