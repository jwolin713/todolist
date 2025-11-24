"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskCreateDialog } from "./task-create-dialog"
import { Task } from "@/lib/types/database"

interface CreateTaskButtonProps {
  onCreate?: (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>
  className?: string
}

export function CreateTaskButton({ onCreate, className }: CreateTaskButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className={className || "fixed bottom-20 lg:bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white z-40"}
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <TaskCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={onCreate}
      />
    </>
  )
}
