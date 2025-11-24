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
import { ArrowUpDown, Calendar, Clock, Flag } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete?: (taskId: string) => void
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
      <div className="bg-slate-900 rounded-lg p-8 text-center border border-slate-800">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sort dropdown */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort by: {currentSortOption?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-slate-800 border-slate-700"
          >
            {sortOptions.map((option) => {
              const Icon = option.icon
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`text-slate-300 focus:bg-slate-700 focus:text-white ${
                    sortBy === option.value ? "bg-slate-700 text-white" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {option.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onClick={onTaskClick ? () => onTaskClick(task) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
