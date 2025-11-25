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
        className={className || "fixed bottom-20 lg:bottom-6 right-6 h-14 w-14 rounded-2xl shadow-soft-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground z-40 transition-all duration-200 hover:scale-105 active:scale-95"}
        size="icon"
      >
        <Plus className="h-6 w-6" strokeWidth={1.75} />
      </Button>

      <TaskCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={onCreate}
      />
    </>
  )
}
