export interface Profile {
  id: string
  display_name: string | null
  timezone: string
  work_hours_start: string
  work_hours_end: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string

  // Core task fields
  title: string
  description: string | null

  // AI-generated metadata
  priority: number // 1=urgent, 2=high, 3=medium, 4=low
  estimated_minutes: number | null
  category: string | null
  energy_level: "high" | "medium" | "low" | null

  // Scheduling
  due_date: string | null
  due_time: string | null
  scheduled_date: string | null
  recurrence_rule: string | null

  // Status
  status: "pending" | "in_progress" | "completed" | "archived"
  completed_at: string | null

  // Organization
  parent_task_id: string | null
  position: number

  // Source tracking
  source_message_id: string | null

  // Timestamps
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  user_id: string
  role: "user" | "assistant"
  content: string
  affected_task_ids: string[]
  conversation_date: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at" | "updated_at">
        Update: Partial<Omit<Profile, "id" | "created_at">>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Task, "id" | "user_id" | "created_at">>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, "id" | "created_at">
        Update: Partial<Omit<Message, "id" | "user_id" | "created_at">>
      }
    }
  }
}
