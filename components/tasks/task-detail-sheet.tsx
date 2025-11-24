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
import { Calendar, Trash2, X, ListTodo } from "lucide-react"
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
      <SheetContent className="w-full sm:max-w-lg bg-slate-900 border-slate-800 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Task Details</SheetTitle>
          <SheetDescription className="text-slate-400">
            View and edit task information
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Title */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Title</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Task title"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-white">{task.title}</h2>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            {task.category && (
              <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                {task.category}
              </Badge>
            )}
            {task.energy_level && (
              <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                {task.energy_level} energy
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Completed
              </Badge>
            )}
          </div>

          {/* Description */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px] bg-slate-800 border-slate-700 text-white"
                placeholder="Add a description..."
              />
            </div>
          ) : (
            task.description && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <p className="text-slate-400 whitespace-pre-wrap">{task.description}</p>
              </div>
            )
          )}

          {/* Subtasks */}
          {!isEditing && !task.parent_task_id && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-slate-400" />
                <label className="text-sm font-medium text-slate-300">
                  Subtasks
                  {subtasks.length > 0 && (
                    <span className="ml-2 text-slate-500">
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
              <label className="text-sm font-medium text-slate-300">Priority</label>
              <Select
                value={String(formData.priority || task.priority)}
                onValueChange={(value) => setFormData({ ...formData, priority: Number(value) })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="1" className="text-slate-300">Urgent</SelectItem>
                  <SelectItem value="2" className="text-slate-300">High</SelectItem>
                  <SelectItem value="3" className="text-slate-300">Medium</SelectItem>
                  <SelectItem value="4" className="text-slate-300">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="e.g., work, personal, health"
              />
            </div>
          )}

          {/* Estimated Time */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Estimated Time (minutes)</label>
              <Input
                type="number"
                value={formData.estimated_minutes || ""}
                onChange={(e) => setFormData({ ...formData, estimated_minutes: Number(e.target.value) || undefined })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="30"
              />
            </div>
          ) : (
            task.estimated_minutes && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Estimated Time</label>
                <p className="text-slate-400">{task.estimated_minutes} minutes</p>
              </div>
            )
          )}

          {/* Due Date */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Due Date</label>
              <Input
                type="date"
                value={formData.due_date || ""}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value || undefined })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          ) : (
            task.due_date && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Due Date</label>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(task.due_date), "PPP")}</span>
                </div>
              </div>
            )
          )}

          {/* Scheduled Date */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Scheduled For</label>
              <Input
                type="date"
                value={formData.scheduled_date || ""}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value || undefined })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          )}

          {/* Energy Level */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Energy Level</label>
              <Select
                value={formData.energy_level || ""}
                onValueChange={(value) => setFormData({ ...formData, energy_level: value as Task["energy_level"] })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select energy level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="low" className="text-slate-300">Low</SelectItem>
                  <SelectItem value="medium" className="text-slate-300">Medium</SelectItem>
                  <SelectItem value="high" className="text-slate-300">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Metadata */}
          {!isEditing && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div>
                <label className="text-sm font-medium text-slate-300">Created</label>
                <p className="text-sm text-slate-400">
                  {format(new Date(task.created_at), "PPp")}
                </p>
              </div>
              {task.completed_at && (
                <div>
                  <label className="text-sm font-medium text-slate-300">Completed</label>
                  <p className="text-sm text-slate-400">
                    {format(new Date(task.completed_at), "PPp")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Edit Task
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="outline"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
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
