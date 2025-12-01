"use client"

import { useState } from "react"
import { Task } from "@/lib/types/database"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PriorityBadge } from "./priority-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Trash2, X, ListTodo, Pencil } from "lucide-react"
import { format } from "date-fns"
import { useSubtasks } from "@/hooks/use-subtasks"
import { SubtaskList } from "./subtask-list"

interface TaskDetailSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete?: (taskId: string) => Promise<void>
}

export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: TaskDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Partial<Task>>({})

  const {
    subtasks,
    loading: subtasksLoading,
    createSubtask,
    deleteSubtask,
    toggleSubtaskComplete,
    progress,
  } = useSubtasks(task?.id || null)

  if (!task) return null

  const handleCreateSubtask = async (title: string) => {
    await createSubtask({
      title,
      description: null,
      priority: 3,
      estimated_minutes: null,
      category: task.category,
      energy_level: null,
      due_date: null,
      due_time: null,
      scheduled_date: null,
      recurrence_rule: null,
      status: "pending",
      completed_at: null,
      position: 0,
      source_message_id: null,
    })
  }

  const handleEdit = () => {
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category || "",
      estimated_minutes: task.estimated_minutes || undefined,
      energy_level: task.energy_level || undefined,
      due_date: task.due_date || undefined,
      scheduled_date: task.scheduled_date || undefined,
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (onUpdate) {
      await onUpdate(task.id, formData)
      setIsEditing(false)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({})
  }

  const handleDelete = async () => {
    if (onDelete && window.confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true)
      try {
        await onDelete(task.id)
        onOpenChange(false)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const isCompleted = task.status === "completed"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-border overflow-y-auto px-6">
        <SheetHeader className="pb-5 pt-6 border-b border-border -mx-6 px-6">
          <SheetTitle className="text-foreground font-serif text-xl">Task Details</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            View and edit task information
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-6">
          {/* Title */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-card border-border text-foreground"
                placeholder="Task title"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-serif font-medium text-foreground">{task.title}</h2>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            {task.category && (
              <Badge variant="outline" className="bg-secondary/50 border-secondary text-secondary-foreground">
                {task.category}
              </Badge>
            )}
            {task.energy_level && (
              <Badge variant="outline" className="bg-secondary/50 border-secondary text-secondary-foreground capitalize">
                {task.energy_level} energy
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                Completed
              </Badge>
            )}
          </div>

          {/* Description */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px] bg-card border-border text-foreground"
                placeholder="Add a description..."
              />
            </div>
          ) : (
            task.description && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </div>
            )
          )}

          {/* Subtasks */}
          {!isEditing && !task.parent_task_id && (
            <div className="space-y-3 bg-muted/30 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                <label className="text-sm font-medium text-foreground">
                  Subtasks
                  {subtasks.length > 0 && (
                    <span className="ml-2 text-muted-foreground font-normal">
                      {progress}% complete
                    </span>
                  )}
                </label>
              </div>
              <SubtaskList
                subtasks={subtasks}
                onToggleComplete={toggleSubtaskComplete}
                onCreateSubtask={handleCreateSubtask}
                onDeleteSubtask={deleteSubtask}
                loading={subtasksLoading}
              />
            </div>
          )}

          {/* Priority */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <Select
                value={String(formData.priority || task.priority)}
                onValueChange={(value) => setFormData({ ...formData, priority: Number(value) })}
              >
                <SelectTrigger className="bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="1" className="text-foreground">Urgent</SelectItem>
                  <SelectItem value="2" className="text-foreground">High</SelectItem>
                  <SelectItem value="3" className="text-foreground">Medium</SelectItem>
                  <SelectItem value="4" className="text-foreground">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-card border-border text-foreground"
                placeholder="e.g., work, personal, health"
              />
            </div>
          )}

          {/* Estimated Time */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estimated Time (minutes)</label>
              <Input
                type="number"
                value={formData.estimated_minutes || ""}
                onChange={(e) => setFormData({ ...formData, estimated_minutes: Number(e.target.value) || undefined })}
                className="bg-card border-border text-foreground"
                placeholder="30"
              />
            </div>
          ) : (
            task.estimated_minutes && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Estimated Time</label>
                <p className="text-foreground">{task.estimated_minutes} minutes</p>
              </div>
            )
          )}

          {/* Due Date */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date</label>
              <Input
                type="date"
                value={formData.due_date || ""}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value || undefined })}
                className="bg-card border-border text-foreground"
              />
            </div>
          ) : (
            task.due_date && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                </div>
                <p className="text-foreground pl-6">{format(new Date(task.due_date), "PPP")}</p>
              </div>
            )
          )}

          {/* Scheduled Date */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Scheduled For</label>
              <Input
                type="date"
                value={formData.scheduled_date || ""}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value || undefined })}
                className="bg-card border-border text-foreground"
              />
            </div>
          )}

          {/* Energy Level */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Energy Level</label>
              <Select
                value={formData.energy_level || ""}
                onValueChange={(value) => setFormData({ ...formData, energy_level: value as Task["energy_level"] })}
              >
                <SelectTrigger className="bg-card border-border text-foreground">
                  <SelectValue placeholder="Select energy level" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="low" className="text-foreground">Low</SelectItem>
                  <SelectItem value="medium" className="text-foreground">Medium</SelectItem>
                  <SelectItem value="high" className="text-foreground">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Metadata */}
          {!isEditing && (
            <div className="space-y-4 pt-5 border-t border-border">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground block">Created</label>
                <p className="text-sm text-foreground">
                  {format(new Date(task.created_at), "PPp")}
                </p>
              </div>
              {task.completed_at && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground block">Completed</label>
                  <p className="text-sm text-foreground">
                    {format(new Date(task.completed_at), "PPp")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 bg-card border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Pencil className="h-4 w-4 mr-2" strokeWidth={1.75} />
                  Edit Task
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="outline"
                  className="border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
