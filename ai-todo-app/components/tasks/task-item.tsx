"use client"

import { Task } from "@/lib/types/database"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PriorityBadge } from "./priority-badge"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap, ChevronRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface TaskItemProps {
  task: Task
  onToggleComplete?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  onClick?: () => void
}

export function TaskItem({ task, onToggleComplete, onDelete, onClick }: TaskItemProps) {
  const isCompleted = task.status === "completed"

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete && window.confirm("Delete this task?")) {
      onDelete(task.id)
    }
  }

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
        "group flex items-start gap-4 p-4 rounded-xl transition-all duration-200",
        "bg-card border border-border hover:border-primary/20 hover:shadow-soft",
        isCompleted && "opacity-60",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div className="pt-0.5 flex-shrink-0">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          className={cn(
            "h-5 w-5 rounded-full border-2 transition-all duration-200",
            "border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary",
            "hover:border-primary/50"
          )}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Task content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title */}
        <h3
          className={cn(
            "text-[15px] font-medium text-foreground leading-snug",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Priority */}
          <PriorityBadge priority={task.priority} />

          {/* Category */}
          {task.category && (
            <Badge
              variant="outline"
              className="text-xs bg-secondary/50 border-secondary text-secondary-foreground font-medium"
            >
              {task.category}
            </Badge>
          )}

          {/* Due date */}
          {dueDateInfo && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium",
                dueDateInfo.isOverdue ? "text-destructive" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{dueDateInfo.text}</span>
            </div>
          )}

          {/* Estimated time */}
          {task.estimated_minutes && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{task.estimated_minutes}m</span>
            </div>
          )}

          {/* Energy level */}
          {task.energy_level && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="capitalize">{task.energy_level}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete button and arrow indicator on hover */}
      <div className="flex-shrink-0 flex items-center gap-1 self-center">
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {onClick && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}
