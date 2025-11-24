"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TaskList } from "@/components/tasks/task-list"
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet"
import { CreateTaskButton } from "@/components/tasks/create-task-button"
import { ChatButton } from "@/components/chat/chat-button"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { useChat } from "@/hooks/use-chat"
import { Task } from "@/lib/types/database"

export default function InboxPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskComplete } = useRealtimeTasks()
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

  const handleCreateTask = async (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      await createTask(taskData)
    } catch (error) {
      console.error("Failed to create task:", error)
      throw error
    }
  }

  return (
    <>
      <Header title="Inbox" />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-white">Inbox</h2>
              {activeTasks.length > 0 && (
                <span className="text-sm text-slate-400">
                  {activeTasks.length} {activeTasks.length === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>
            <p className="text-slate-400 mt-1">
              All your active tasks
            </p>
          </div>

          {loading ? (
            <div className="bg-slate-900 rounded-lg p-8 text-center border border-slate-800">
              <p className="text-slate-400">Loading tasks...</p>
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

      {/* Create Task Button */}
      <CreateTaskButton onCreate={handleCreateTask} />

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
