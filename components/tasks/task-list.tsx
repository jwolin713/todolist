"use client"

import { useState } from "react"
import { Task } from "@/lib/types/database"
import { TaskItem } from "./task-item"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Calendar, Clock, Flag, ListFilter } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  onArchive?: (taskId: string) => void
  onTaskClick?: (task: Task) => void
  emptyMessage?: string
}

type SortOption = "priority" | "due_date" | "created_at" | "estimated_minutes"

const sortOptions = [
  { value: "priority" as SortOption, label: "Priority", icon: Flag },
  { value: "due_date" as SortOption, label: "Due Date", icon: Calendar },
  { value: "created_at" as SortOption, label: "Created Date", icon: Clock },
  { value: "estimated_minutes" as SortOption, label: "Duration", icon: Clock },
]

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onArchive,
  onTaskClick,
  emptyMessage = "No tasks to display",
}: TaskListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("priority")

  const sortTasks = (tasks: Task[], sortOption: SortOption): Task[] => {
    const sorted = [...tasks]

    switch (sortOption) {
      case "priority":
        // Lower number = higher priority (1 is urgent, 4 is low)
        return sorted.sort((a, b) => a.priority - b.priority)

      case "due_date":
        return sorted.sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        })

      case "created_at":
        return sorted.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

      case "estimated_minutes":
        return sorted.sort((a, b) => {
          if (!a.estimated_minutes && !b.estimated_minutes) return 0
          if (!a.estimated_minutes) return 1
          if (!b.estimated_minutes) return -1
          return a.estimated_minutes - b.estimated_minutes
        })

      default:
        return sorted
    }
  }

  const sortedTasks = sortTasks(tasks, sortBy)
  const currentSortOption = sortOptions.find((opt) => opt.value === sortBy)

  if (tasks.length === 0) {
    return (
      <div className="bg-card rounded-xl p-8 text-center border border-border">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sort dropdown */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-card border-border text-foreground hover:bg-muted h-8 gap-2"
            >
              <ListFilter className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="text-xs">{currentSortOption?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-card border-border shadow-soft-lg"
          >
            {sortOptions.map((option) => {
              const Icon = option.icon
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer ${
                    sortBy === option.value ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2 text-muted-foreground" strokeWidth={1.75} />
                  {option.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onClick={onTaskClick ? () => onTaskClick(task) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
