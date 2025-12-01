"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TodayView } from "@/components/tasks/today-view"
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet"
import { ChatButton } from "@/components/chat/chat-button"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { useTodayTasks } from "@/hooks/use-today-tasks"
import { useChat } from "@/hooks/use-chat"
import { Task } from "@/lib/types/database"

export default function TodayPage() {
  const { tasks, loading, updateTask, deleteTask, toggleTaskComplete } = useRealtimeTasks()
  const {
    overdueTasks,
    scheduledTasks,
    dueTodayTasks,
    highPriorityTasks,
    recommendedTasks,
    count,
    hasOverdue,
    taskScores,
  } = useTodayTasks(tasks)
  const { messages, isLoading: chatLoading, sendMessage } = useChat()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

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

  return (
    <>
      <Header title="Today" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-serif font-medium text-foreground tracking-tight">Today</h2>
              {count > 0 && (
                <span className="text-sm text-muted-foreground">
                  {count} {count === 1 ? "task" : "tasks"}
                  {hasOverdue && <span className="text-destructive ml-1">• Overdue</span>}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {loading ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <span>Loading tasks...</span>
              </div>
            </div>
          ) : (
            <TodayView
              overdueTasks={overdueTasks}
              scheduledTasks={scheduledTasks}
              dueTodayTasks={dueTodayTasks}
              highPriorityTasks={highPriorityTasks}
              recommendedTasks={recommendedTasks}
              taskScores={taskScores}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </div>

      {/* AI Chat Button */}
      <ChatButton
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={chatLoading}
      />

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
