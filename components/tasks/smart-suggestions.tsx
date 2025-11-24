"use client"

import { useState, useMemo } from "react"
import { Task } from "@/lib/types/database"
import { getContextualTasks } from "@/lib/scoring/task-scorer"
import { TaskList } from "./task-list"
import { Zap, Clock } from "lucide-react"
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
    <div className="space-y-4">
      {/* Input Section */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">
            Get Smart Suggestions
          </h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Tell us how much time and energy you have, and we'll suggest the best tasks to work on.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available Time
            </label>
            <Select value={availableTime} onValueChange={setAvailableTime}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Energy Selection */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Current Energy
            </label>
            <Select value={currentEnergy} onValueChange={(value) => setCurrentEnergy(value as "high" | "medium" | "low")}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select energy level" />
              </SelectTrigger>
              <SelectContent>
                {ENERGY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleGetSuggestions}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Get Suggestions
          </Button>
          {showSuggestions && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {showSuggestions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300">
              {suggestedTasks.length > 0
                ? `${suggestedTasks.length} task${suggestedTasks.length === 1 ? '' : 's'} match your criteria`
                : 'No tasks match your criteria'
              }
            </h4>
            {suggestedTasks.length > 0 && (
              <span className="text-xs text-slate-500">
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
            <div className="bg-slate-900 rounded-lg p-6 text-center border border-slate-800">
              <p className="text-slate-400">
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
