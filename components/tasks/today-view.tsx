"use client"

import { Task } from "@/lib/types/database"
import { TaskList } from "./task-list"
import { AlertCircle, Calendar, Clock, Flag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodayViewProps {
  overdueTasks: Task[]
  scheduledTasks: Task[]
  dueTodayTasks: Task[]
  highPriorityTasks: Task[]
  recommendedTasks?: Task[]
  taskScores?: Map<string, number>
  onToggleComplete?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  onArchive?: (taskId: string) => void
  onTaskClick?: (task: Task) => void
}

interface SectionProps {
  icon: React.ReactNode
  title: string
  count: number
  variant: "overdue" | "scheduled" | "due" | "priority" | "recommended"
  children: React.ReactNode
}

function Section({ icon, title, count, variant, children }: SectionProps) {
  const variantStyles = {
    overdue: "border-destructive/20 bg-destructive/5",
    scheduled: "border-chart-3/20 bg-chart-3/5",
    due: "border-chart-4/20 bg-chart-4/5",
    priority: "border-primary/20 bg-primary/5",
    recommended: "border-chart-2/20 bg-chart-2/5",
  }

  const iconStyles = {
    overdue: "text-destructive",
    scheduled: "text-chart-3",
    due: "text-chart-4",
    priority: "text-primary",
    recommended: "text-chart-2",
  }

  return (
    <div className={cn(
      "rounded-2xl border p-5 transition-all duration-200",
      variantStyles[variant]
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          variant === "overdue" && "bg-destructive/10",
          variant === "scheduled" && "bg-chart-3/10",
          variant === "due" && "bg-chart-4/10",
          variant === "priority" && "bg-primary/10",
          variant === "recommended" && "bg-chart-2/10"
        )}>
          <span className={iconStyles[variant]}>{icon}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-serif font-medium text-foreground">
            {title}
          </h3>
          <span className="text-sm text-muted-foreground">
            ({count})
          </span>
        </div>
      </div>
      {children}
    </div>
  )
}

export function TodayView({
  overdueTasks,
  scheduledTasks,
  dueTodayTasks,
  highPriorityTasks,
  recommendedTasks = [],
  taskScores,
  onToggleComplete,
  onDelete,
  onArchive,
  onTaskClick,
}: TodayViewProps) {
  const hasAnyTasks =
    overdueTasks.length > 0 ||
    scheduledTasks.length > 0 ||
    dueTodayTasks.length > 0 ||
    highPriorityTasks.length > 0

  if (!hasAnyTasks && recommendedTasks.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-serif font-medium text-foreground mb-2">
          All clear for today
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          No tasks scheduled for today. Use the AI assistant to add some tasks, or enjoy your free time.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 stagger-children">
      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <Section
          icon={<AlertCircle className="h-4 w-4" strokeWidth={2} />}
          title="Overdue"
          count={overdueTasks.length}
          variant="overdue"
        >
          <TaskList
            tasks={overdueTasks}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </Section>
      )}

      {/* Scheduled for Today */}
      {scheduledTasks.length > 0 && (
        <Section
          icon={<Calendar className="h-4 w-4" strokeWidth={2} />}
          title="Scheduled"
          count={scheduledTasks.length}
          variant="scheduled"
        >
          <TaskList
            tasks={scheduledTasks}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </Section>
      )}

      {/* Due Today */}
      {dueTodayTasks.length > 0 && (
        <Section
          icon={<Clock className="h-4 w-4" strokeWidth={2} />}
          title="Due Today"
          count={dueTodayTasks.length}
          variant="due"
        >
          <TaskList
            tasks={dueTodayTasks}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </Section>
      )}

      {/* High Priority */}
      {highPriorityTasks.length > 0 && (
        <Section
          icon={<Flag className="h-4 w-4" strokeWidth={2} />}
          title="High Priority"
          count={highPriorityTasks.length}
          variant="priority"
        >
          <TaskList
            tasks={highPriorityTasks}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </Section>
      )}

      {/* Recommended Tasks */}
      {recommendedTasks.length > 0 && (
        <Section
          icon={<Sparkles className="h-4 w-4" strokeWidth={2} />}
          title="Recommended"
          count={recommendedTasks.length}
          variant="recommended"
        >
          <p className="text-xs text-muted-foreground mb-3 -mt-1">
            Based on your priorities and deadlines
          </p>
          <TaskList
            tasks={recommendedTasks}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onTaskClick={onTaskClick}
            emptyMessage=""
          />
        </Section>
      )}
    </div>
  )
}
