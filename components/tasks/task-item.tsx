"use client"

import { Task } from "@/lib/types/database"
import { Checkbox } from "@/components/ui/checkbox"
import { PriorityBadge } from "./priority-badge"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface TaskItemProps {
  task: Task
  onToggleComplete?: (taskId: string) => void
  onClick?: () => void
}

export function TaskItem({ task, onToggleComplete, onClick }: TaskItemProps) {
  const isCompleted = task.status === "completed"

  const handleCheckboxChange = (checked: boolean) => {
    if (onToggleComplete) {
      onToggleComplete(task.id)
    }
  }

  const formatDueDate = (date: string) => {
    const dueDate = new Date(date)
    const now = new Date()
    const isOverdue = dueDate < now && !isCompleted

    return {
      text: formatDistanceToNow(dueDate, { addSuffix: true }),
      isOverdue,
    }
  }

  const dueDateInfo = task.due_date ? formatDueDate(task.due_date) : null

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-4 rounded-lg border transition-colors",
        "bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700",
        isCompleted && "opacity-60",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div className="pt-0.5">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          className="border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Task content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title */}
        <h3
          className={cn(
            "text-sm font-medium text-white",
            isCompleted && "line-through text-slate-500"
          )}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-slate-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          <PriorityBadge priority={task.priority} />

          {/* Category */}
          {task.category && (
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700 text-slate-300">
              {task.category}
            </Badge>
          )}

          {/* Due date */}
          {dueDateInfo && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                dueDateInfo.isOverdue ? "text-red-400" : "text-slate-400"
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{dueDateInfo.text}</span>
            </div>
          )}

          {/* Estimated time */}
          {task.estimated_minutes && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{task.estimated_minutes}m</span>
            </div>
          )}

          {/* Energy level */}
          {task.energy_level && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Zap className="h-3 w-3" />
              <span className="capitalize">{task.energy_level}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
