import { anthropic, AI_MODEL } from "./client"
import { TASK_PARSER_SYSTEM_PROMPT } from "./prompts"

export interface ParsedTask {
  title: string
  description?: string
  priority?: 1 | 2 | 3 | 4
  estimated_minutes?: number
  category?: string
  energy_level?: "high" | "medium" | "low"
  due_date?: string // YYYY-MM-DD
  due_time?: string // HH:MM
  scheduled_date?: string // YYYY-MM-DD
}

export interface TaskParserResponse {
  tasks: ParsedTask[]
  needs_clarification: boolean
  clarifying_questions?: string[]
  response_message: string
}

const taskSchema = {
  type: "object" as const,
  properties: {
    tasks: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          title: {
            type: "string" as const,
            description: "Clear, concise task title",
          },
          description: {
            type: "string" as const,
            description: "Additional details about the task",
          },
          priority: {
            type: "integer" as const,
            enum: [1, 2, 3, 4],
            description: "1=urgent, 2=high, 3=medium, 4=low",
          },
          estimated_minutes: {
            type: "integer" as const,
            description: "Estimated time to complete in minutes",
          },
          category: {
            type: "string" as const,
            description: "Task category (e.g., work, personal, health)",
          },
          energy_level: {
            type: "string" as const,
            enum: ["high", "medium", "low"],
            description: "Energy level required for the task",
          },
          due_date: {
            type: "string" as const,
            description: "Due date in YYYY-MM-DD format",
          },
          due_time: {
            type: "string" as const,
            description: "Due time in HH:MM format (24-hour)",
          },
          scheduled_date: {
            type: "string" as const,
            description: "Date to work on the task in YYYY-MM-DD format",
          },
        },
        required: ["title"],
      },
    },
    needs_clarification: {
      type: "boolean" as const,
      description: "Whether clarifying questions are needed",
    },
    clarifying_questions: {
      type: "array" as const,
      items: {
        type: "string" as const,
      },
      description: "List of clarifying questions to ask the user",
    },
    response_message: {
      type: "string" as const,
      description: "Friendly response message to show the user",
    },
  },
  required: ["tasks", "needs_clarification", "response_message"],
}

export async function parseTasksFromMessage(
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<TaskParserResponse> {
  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().split("T")[0]
  const formattedTime = currentDate.toTimeString().split(" ")[0].substring(0, 5)

  const systemPrompt = TASK_PARSER_SYSTEM_PROMPT.replace("{{CURRENT_DATE}}", formattedDate)
    .replace("{{CURRENT_TIME}}", formattedTime)
    .replace("{{USER_TIMEZONE}}", Intl.DateTimeFormat().resolvedOptions().timeZone)

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    ...conversationHistory,
    {
      role: "user",
      content: userMessage,
    },
  ]

  try {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      tools: [
        {
          name: "parse_tasks",
          description:
            "Parse task information from the user's message and determine if clarification is needed",
          input_schema: taskSchema,
        },
      ],
      tool_choice: {
        type: "tool",
        name: "parse_tasks",
      },
    })

    // Extract the tool use result
    const toolUse = response.content.find((block) => block.type === "tool_use")

    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("No tool use found in response")
    }

    const result = toolUse.input as TaskParserResponse

    return result
  } catch (error) {
    console.error("Error parsing tasks:", error)
    throw new Error("Failed to parse tasks from message")
  }
}

// Helper function to convert relative dates to absolute dates
export function parseRelativeDate(dateStr: string): string | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lowerDateStr = dateStr.toLowerCase().trim()

  if (lowerDateStr === "today") {
    return today.toISOString().split("T")[0]
  }

  if (lowerDateStr === "tomorrow") {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (lowerDateStr === "next week") {
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return nextWeek.toISOString().split("T")[0]
  }

  // Check for day of week (e.g., "monday", "tuesday")
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayIndex = daysOfWeek.findIndex((day) => lowerDateStr.includes(day))

  if (dayIndex !== -1) {
    const targetDate = new Date(today)
    const currentDay = today.getDay()
    const daysUntilTarget = (dayIndex - currentDay + 7) % 7 || 7 // Next occurrence
    targetDate.setDate(targetDate.getDate() + daysUntilTarget)
    return targetDate.toISOString().split("T")[0]
  }

  // If it's already in YYYY-MM-DD format or another standard format, try to parse it
  const parsedDate = new Date(dateStr)
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split("T")[0]
  }

  return null
}
