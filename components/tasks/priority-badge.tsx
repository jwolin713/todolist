import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: number
  className?: string
}

const priorityConfig = {
  1: {
    label: "Urgent",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  2: {
    label: "High",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  3: {
    label: "Medium",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  4: {
    label: "Low",
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig[3]

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", config.color, className)}
    >
      {config.label}
    </Badge>
  )
}
