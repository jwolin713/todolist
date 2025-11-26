"use client"

import { useState } from "react"
import { Task } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubtaskListProps {
  subtasks: Task[]
  onToggleComplete: (subtaskId: string) => void
  onCreateSubtask: (title: string) => Promise<void>
  onDeleteSubtask: (subtaskId: string) => void
  loading?: boolean
}

export function SubtaskList({
  subtasks,
  onToggleComplete,
  onCreateSubtask,
  onDeleteSubtask,
  loading = false,
}: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateSubtask = async () => {
    if (!newSubtaskTitle.trim()) return

    setIsCreating(true)
    try {
      await onCreateSubtask(newSubtaskTitle.trim())
      setNewSubtaskTitle("")
    } catch (error) {
      console.error("Failed to create subtask:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateSubtask()
    }
  }

  const completedCount = subtasks.filter((t) => t.status === "completed").length
  const totalCount = subtasks.length

  return (
    <div className="space-y-3">
      {/* Progress indicator */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {completedCount} of {totalCount}
          </span>
        </div>
      )}

      {/* Subtask list */}
      {loading ? (
        <div className="text-sm text-muted-foreground py-2">Loading subtasks...</div>
      ) : (
        <div className="space-y-1">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className={cn(
                "group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors",
                subtask.status === "completed" && "opacity-60"
              )}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" strokeWidth={1.75} />

              <Checkbox
                checked={subtask.status === "completed"}
                onCheckedChange={() => onToggleComplete(subtask.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />

              <span
                className={cn(
                  "flex-1 text-sm",
                  subtask.status === "completed"
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {subtask.title}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive rounded-lg"
                onClick={() => onDeleteSubtask(subtask.id)}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </div>
          ))}

          {subtasks.length === 0 && (
            <div className="text-sm text-muted-foreground py-2 text-center">
              No subtasks yet. Add one below!
            </div>
          )}
        </div>
      )}

      {/* Add new subtask */}
      <div className="flex gap-2">
        <Input
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a subtask..."
          disabled={isCreating}
          className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button
          onClick={handleCreateSubtask}
          disabled={!newSubtaskTitle.trim() || isCreating}
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}
