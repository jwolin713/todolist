"use client"

import { ParsedTask } from "@/lib/ai/task-parser"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap, Tag, AlertCircle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

interface TaskPreviewCardProps {
  task: ParsedTask
}

export function TaskPreviewCard({ task }: TaskPreviewCardProps) {
  const priorityConfig = {
    1: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/20" },
    2: { label: "High", color: "bg-chart-1/10 text-chart-1 border-chart-1/20" },
    3: { label: "Medium", color: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
    4: { label: "Low", color: "bg-muted text-muted-foreground border-border" },
  }

  const energyConfig = {
    high: { label: "High", icon: Zap, color: "text-chart-4" },
    medium: { label: "Medium", icon: Zap, color: "text-chart-3" },
    low: { label: "Low", icon: Zap, color: "text-muted-foreground" },
  }

  const priority = task.priority || 3
  const priorityInfo = priorityConfig[priority]

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/20 transition-all duration-200 hover:shadow-soft">
      <div className="space-y-3">
        {/* Title and Priority */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-3 w-3 text-primary/50" />
            </div>
            <h4 className="font-medium text-foreground text-sm leading-snug flex-1">{task.title}</h4>
          </div>
          {task.priority && task.priority <= 2 && (
            <Badge className={priorityInfo.color} variant="outline">
              <AlertCircle className="h-3 w-3 mr-1" />
              {priorityInfo.label}
            </Badge>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed ml-7">
            {task.description}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 ml-7">
          {task.due_date && (
            <Badge variant="outline" className="text-[11px] bg-secondary/50 border-secondary text-secondary-foreground">
              <Calendar className="h-3 w-3 mr-1" strokeWidth={1.75} />
              Due: {format(new Date(task.due_date), "MMM d")}
              {task.due_time && ` at ${task.due_time}`}
            </Badge>
          )}

          {task.scheduled_date && (
            <Badge variant="outline" className="text-[11px] bg-secondary/50 border-secondary text-secondary-foreground">
              <Calendar className="h-3 w-3 mr-1" strokeWidth={1.75} />
              Scheduled: {format(new Date(task.scheduled_date), "MMM d")}
            </Badge>
          )}

          {task.estimated_minutes && (
            <Badge variant="outline" className="text-[11px] bg-secondary/50 border-secondary text-secondary-foreground">
              <Clock className="h-3 w-3 mr-1" strokeWidth={1.75} />
              {task.estimated_minutes >= 60
                ? `${Math.floor(task.estimated_minutes / 60)}h ${task.estimated_minutes % 60}m`
                : `${task.estimated_minutes}m`}
            </Badge>
          )}

          {task.energy_level && (
            <Badge variant="outline" className="text-[11px] bg-secondary/50 border-secondary text-secondary-foreground">
              {(() => {
                const EnergyIcon = energyConfig[task.energy_level].icon
                return (
                  <>
                    <EnergyIcon className={`h-3 w-3 mr-1 ${energyConfig[task.energy_level].color}`} strokeWidth={1.75} />
                    {energyConfig[task.energy_level].label}
                  </>
                )
              })()}
            </Badge>
          )}

          {task.category && (
            <Badge variant="outline" className="text-[11px] bg-secondary/50 border-secondary text-secondary-foreground">
              <Tag className="h-3 w-3 mr-1" strokeWidth={1.75} />
              {task.category}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
