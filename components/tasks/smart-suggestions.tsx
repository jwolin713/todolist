"use client"

import { useState, useMemo } from "react"
import { Task } from "@/lib/types/database"
import { getContextualTasks } from "@/lib/scoring/task-scorer"
import { TaskList } from "./task-list"
import { Zap, Clock, Sparkles } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SmartSuggestionsProps {
  tasks: Task[]
  onToggleComplete?: (taskId: string) => void
  onTaskClick?: (task: Task) => void
}

const TIME_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "240", label: "4 hours" },
]

const ENERGY_OPTIONS = [
  { value: "high", label: "High - Ready to focus" },
  { value: "medium", label: "Medium - Moderate effort" },
  { value: "low", label: "Low - Simple tasks only" },
]

export function SmartSuggestions({
  tasks,
  onToggleComplete,
  onTaskClick,
}: SmartSuggestionsProps) {
  const [availableTime, setAvailableTime] = useState<string>("60")
  const [currentEnergy, setCurrentEnergy] = useState<"high" | "medium" | "low">("medium")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestedTasks = useMemo(() => {
    if (!showSuggestions) return []
    return getContextualTasks(
      tasks,
      parseInt(availableTime),
      currentEnergy
    )
  }, [tasks, availableTime, currentEnergy, showSuggestions])

  const handleGetSuggestions = () => {
    setShowSuggestions(true)
  }

  const handleReset = () => {
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-chart-2" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium text-foreground">
              Get Smart Suggestions
            </h3>
            <p className="text-sm text-muted-foreground">
              Tell us your constraints for personalized recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
              Available Time
            </label>
            <Select value={availableTime} onValueChange={setAvailableTime}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-foreground">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Energy Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
              Current Energy
            </label>
            <Select value={currentEnergy} onValueChange={(value) => setCurrentEnergy(value as "high" | "medium" | "low")}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select energy level" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {ENERGY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-foreground">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleGetSuggestions}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" strokeWidth={1.75} />
            Get Suggestions
          </Button>
          {showSuggestions && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {showSuggestions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              {suggestedTasks.length > 0
                ? `${suggestedTasks.length} task${suggestedTasks.length === 1 ? '' : 's'} match your criteria`
                : 'No tasks match your criteria'
              }
            </h4>
            {suggestedTasks.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Sorted by priority and fit
              </span>
            )}
          </div>

          {suggestedTasks.length > 0 ? (
            <TaskList
              tasks={suggestedTasks}
              onToggleComplete={onToggleComplete}
              onTaskClick={onTaskClick}
              emptyMessage=""
            />
          ) : (
            <div className="bg-card rounded-2xl p-8 text-center border border-border">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-muted-foreground">
                No tasks found that fit your current time and energy.
                Try adjusting your criteria or create new tasks!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
