"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TaskList } from "@/components/tasks/task-list"
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet"
import { ChatButton } from "@/components/chat/chat-button"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { useChat } from "@/hooks/use-chat"
import { Task } from "@/lib/types/database"
import { Inbox } from "lucide-react"

export default function InboxPage() {
  const { tasks, loading, updateTask, deleteTask, toggleTaskComplete } = useRealtimeTasks()
  const { messages, isLoading: chatLoading, sendMessage } = useChat()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // Filter for non-completed tasks
  const activeTasks = tasks.filter((task) => task.status !== "completed")

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
      <Header title="Inbox" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-serif font-medium text-foreground tracking-tight">Inbox</h2>
              {activeTasks.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {activeTasks.length} {activeTasks.length === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              All your active tasks
            </p>
          </div>

          {loading ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <span>Loading tasks...</span>
              </div>
            </div>
          ) : activeTasks.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">
                Your inbox is empty
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                No active tasks. Use the AI assistant to add some tasks.
              </p>
            </div>
          ) : (
            <TaskList
              tasks={activeTasks}
              onToggleComplete={handleToggleComplete}
              onTaskClick={handleTaskClick}
              emptyMessage="No tasks yet. Add some tasks to get started!"
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
