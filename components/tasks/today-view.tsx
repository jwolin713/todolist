"use client"

import { Task } from "@/lib/types/database"
import { TaskList } from "./task-list"
import { AlertCircle, Calendar, Clock, Flag, Sparkles } from "lucide-react"

interface TodayViewProps {
  overdueTasks: Task[]
  scheduledTasks: Task[]
  dueTodayTasks: Task[]
  highPriorityTasks: Task[]
  recommendedTasks?: Task[]
  taskScores?: Map<string, number>
  onToggleComplete?: (taskId: string) => void
  onTaskClick?: (task: Task) => void
}

export function TodayView({
  overdueTasks,
  scheduledTasks,
  dueTodayTasks,
  highPriorityTasks,
  recommendedTasks = [],
  taskScores,
  onToggleComplete,
  onTaskClick,
}: TodayViewProps) {
  const hasAnyTasks =
    overdueTasks.length > 0 ||
    scheduledTasks.length > 0 ||
    dueTodayTasks.length > 0 ||
    highPriorityTasks.length > 0

  if (!hasAnyTasks && recommendedTasks.length === 0) {
    return (
      <div className="bg-slate-900 rounded-lg p-8 text-center border border-slate-800">
        <p className="text-slate-400">
          No tasks for today. Add some tasks to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">
              Overdue ({overdueTasks.length})
            </h3>
          </div>
          <TaskList
            tasks={overdueTasks}
            onToggleComplete={onToggleComplete}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </div>
      )}

      {/* Scheduled for Today */}
      {scheduledTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Scheduled ({scheduledTasks.length})
            </h3>
          </div>
          <TaskList
            tasks={scheduledTasks}
            onToggleComplete={onToggleComplete}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </div>
      )}

      {/* Due Today */}
      {dueTodayTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">
              Due Today ({dueTodayTasks.length})
            </h3>
          </div>
          <TaskList
            tasks={dueTodayTasks}
            onToggleComplete={onToggleComplete}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </div>
      )}

      {/* High Priority */}
      {highPriorityTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">
              High Priority ({highPriorityTasks.length})
            </h3>
          </div>
          <TaskList
            tasks={highPriorityTasks}
            onToggleComplete={onToggleComplete}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </div>
      )}

      {/* Recommended Tasks */}
      {recommendedTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              Recommended
            </h3>
            <span className="text-xs text-slate-500">
              Based on your priorities and deadlines
            </span>
          </div>
          <TaskList
            tasks={recommendedTasks}
            onToggleComplete={onToggleComplete}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </div>
      )}
    </div>
  )
}
