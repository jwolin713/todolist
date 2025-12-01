"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TaskList } from "@/components/tasks/task-list"
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { Task } from "@/lib/types/database"
import { CheckCircle2 } from "lucide-react"

export default function CompletedPage() {
  const { tasks, loading, updateTask, deleteTask, toggleTaskComplete, archiveTask } = useRealtimeTasks()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // Filter for completed and archived tasks
  const completedTasks = tasks.filter((task) => task.status === "completed" || task.status === "archived")

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDetailSheetOpen(true)
  }

  const handleToggleComplete = async (taskId: string) => {
    try {
      await toggleTaskComplete(taskId)
    } catch (error) {
      console.error("Failed to toggle task:", error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleArchiveTask = async (taskId: string) => {
    try {
      await archiveTask(taskId)
    } catch (error) {
      console.error("Failed to archive task:", error)
    }
  }

  return (
    <>
      <Header title="Completed" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-serif font-medium text-foreground tracking-tight">Completed</h2>
              {completedTasks.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {completedTasks.length} {completedTasks.length === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              View all your completed tasks
            </p>
          </div>

          {loading ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <span>Loading tasks...</span>
              </div>
            </div>
          ) : completedTasks.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-chart-2" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">
                No completed tasks yet
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Complete some tasks to see them here. Your accomplishments will be tracked and celebrated.
              </p>
            </div>
          ) : (
            <TaskList
              tasks={completedTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onArchive={handleArchiveTask}
              onTaskClick={handleTaskClick}
              emptyMessage="No completed tasks yet"
            />
          )}
        </div>
      </div>

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </>
  )
}
