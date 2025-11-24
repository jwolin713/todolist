import { ParsedTask } from "../ai/task-parser"

export interface Message {
  id: string
  user_id: string
  role: "user" | "assistant"
  content: string
  affected_task_ids: string[]
  conversation_date: string
  created_at: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  parsedTasks?: ParsedTask[]
  taskIds?: string[]
  needsClarification?: boolean
  clarifyingQuestions?: string[]
}

export interface ConversationContext {
  messages: ChatMessage[]
  currentDate: string
  userTimezone: string
}
