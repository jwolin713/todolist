import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: number
  className?: string
}

const priorityConfig = {
  1: {
    label: "Urgent",
    className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
  },
  2: {
    label: "High",
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20 hover:bg-chart-1/15",
  },
  3: {
    label: "Medium",
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20 hover:bg-chart-3/15",
  },
  4: {
    label: "Low",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
  },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig[3]

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 transition-colors",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
