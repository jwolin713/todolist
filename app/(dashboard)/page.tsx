"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TodayView } from "@/components/tasks/today-view"
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet"
import { CreateTaskButton } from "@/components/tasks/create-task-button"
import { ChatButton } from "@/components/chat/chat-button"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { useTodayTasks } from "@/hooks/use-today-tasks"
import { useChat } from "@/hooks/use-chat"
import { Task } from "@/lib/types/database"

export default function TodayPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskComplete } = useRealtimeTasks()
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
      <Header title="Today" />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-white">Today</h2>
              {count > 0 && (
                <span className="text-sm text-slate-400">
                  {count} {count === 1 ? "task" : "tasks"}
                  {hasOverdue && <span className="text-red-400 ml-1">• Overdue items</span>}
                </span>
              )}
            </div>
            <p className="text-slate-400 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {loading ? (
            <div className="bg-slate-900 rounded-lg p-8 text-center border border-slate-800">
              <p className="text-slate-400">Loading tasks...</p>
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
              onTaskClick={handleTaskClick}
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
