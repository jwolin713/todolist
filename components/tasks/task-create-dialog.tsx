"use client"

import { useState } from "react"
import { Task } from "@/lib/types/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TaskCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>
}

export function TaskCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: TaskCreateDialogProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: 3,
    category: "",
    estimated_minutes: undefined,
    energy_level: undefined,
    due_date: undefined,
    scheduled_date: undefined,
    status: "pending",
    completed_at: null,
    parent_task_id: null,
    position: 0,
    source_message_id: null,
    due_time: null,
    recurrence_rule: null,
  })

  const handleCreate = async () => {
    if (!formData.title?.trim()) {
      alert("Please enter a task title")
      return
    }

    if (onCreate) {
      setIsCreating(true)
      try {
        await onCreate({
          title: formData.title,
          description: formData.description || null,
          priority: formData.priority || 3,
          category: formData.category || null,
          estimated_minutes: formData.estimated_minutes || null,
          energy_level: formData.energy_level || null,
          due_date: formData.due_date || null,
          due_time: formData.due_time || null,
          scheduled_date: formData.scheduled_date || null,
          recurrence_rule: formData.recurrence_rule || null,
          status: "pending",
          completed_at: null,
          parent_task_id: null,
          position: 0,
          source_message_id: null,
        })

        // Reset form
        setFormData({
          title: "",
          description: "",
          priority: 3,
          category: "",
          estimated_minutes: undefined,
          energy_level: undefined,
          due_date: undefined,
          scheduled_date: undefined,
          status: "pending",
          completed_at: null,
          parent_task_id: null,
          position: 0,
          source_message_id: null,
          due_time: null,
          recurrence_rule: null,
        })

        onOpenChange(false)
      } catch (error) {
        console.error("Failed to create task:", error)
        alert("Failed to create task. Please try again.")
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: 3,
      category: "",
      estimated_minutes: undefined,
      energy_level: undefined,
      due_date: undefined,
      scheduled_date: undefined,
      status: "pending",
      completed_at: null,
      parent_task_id: null,
      position: 0,
      source_message_id: null,
      due_time: null,
      recurrence_rule: null,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Task</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new task to your list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Title <span className="text-red-400">*</span>
            </label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] bg-slate-800 border-slate-700 text-white"
              placeholder="Add more details..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Priority</label>
              <Select
                value={String(formData.priority || 3)}
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

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="e.g., work, personal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Estimated Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Estimated Time (minutes)
              </label>
              <Input
                type="number"
                value={formData.estimated_minutes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_minutes: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="30"
                min="1"
              />
            </div>

            {/* Energy Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Energy Level</label>
              <Select
                value={formData.energy_level || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, energy_level: value as Task["energy_level"] })
                }
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Due Date</label>
              <Input
                type="date"
                value={formData.due_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value || undefined })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {/* Scheduled Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Scheduled For</label>
              <Input
                type="date"
                value={formData.scheduled_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_date: e.target.value || undefined })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreate}
              disabled={isCreating || !formData.title?.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isCreating ? "Creating..." : "Create Task"}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isCreating}
              variant="outline"
              className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
