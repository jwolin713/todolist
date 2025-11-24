"use client"

import { ParsedTask } from "@/lib/ai/task-parser"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap, Tag, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface TaskPreviewCardProps {
  task: ParsedTask
}

export function TaskPreviewCard({ task }: TaskPreviewCardProps) {
  const priorityConfig = {
    1: { label: "Urgent", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    2: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    3: { label: "Medium", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    4: { label: "Low", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  }

  const energyConfig = {
    high: { label: "High Energy", icon: Zap, color: "text-yellow-400" },
    medium: { label: "Medium Energy", icon: Zap, color: "text-blue-400" },
    low: { label: "Low Energy", icon: Zap, color: "text-slate-400" },
  }

  const priority = task.priority || 3
  const priorityInfo = priorityConfig[priority]

  return (
    <Card className="p-3 bg-slate-900/50 border-slate-700 hover:bg-slate-900 transition-colors">
      <div className="space-y-2">
        {/* Title and Priority */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-white text-sm flex-1">{task.title}</h4>
          {task.priority && task.priority <= 2 && (
            <Badge className={priorityInfo.color} variant="outline">
              <AlertCircle className="h-3 w-3 mr-1" />
              {priorityInfo.label}
            </Badge>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
        )}

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2">
          {task.due_date && (
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700">
              <Calendar className="h-3 w-3 mr-1" />
              Due: {format(new Date(task.due_date), "MMM d")}
              {task.due_time && ` at ${task.due_time}`}
            </Badge>
          )}

          {task.scheduled_date && (
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700">
              <Calendar className="h-3 w-3 mr-1" />
              Scheduled: {format(new Date(task.scheduled_date), "MMM d")}
            </Badge>
          )}

          {task.estimated_minutes && (
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700">
              <Clock className="h-3 w-3 mr-1" />
              {task.estimated_minutes >= 60
                ? `${Math.floor(task.estimated_minutes / 60)}h ${task.estimated_minutes % 60}m`
                : `${task.estimated_minutes}m`}
            </Badge>
          )}

          {task.energy_level && (
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700">
              {(() => {
                const EnergyIcon = energyConfig[task.energy_level].icon
                return (
                  <>
                    <EnergyIcon className={`h-3 w-3 mr-1 ${energyConfig[task.energy_level].color}`} />
                    {energyConfig[task.energy_level].label}
                  </>
                )
              })()}
            </Badge>
          )}

          {task.category && (
            <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700">
              <Tag className="h-3 w-3 mr-1" />
              {task.category}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
