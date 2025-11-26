import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { parseTasksFromMessage } from "@/lib/ai/task-parser"
import { parsedTaskToTask } from "@/lib/ai/utils"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Convert chat history to the format expected by the parser
    const conversationHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))

    // Parse tasks from the message using AI
    const parseResult = await parseTasksFromMessage(message, conversationHistory)

    // Only create tasks if AI doesn't need clarification AND there are tasks to create
    const createdTaskIds: string[] = []

    if (!parseResult.needs_clarification && parseResult.tasks.length > 0) {
      for (const parsedTask of parseResult.tasks) {
        const taskData = parsedTaskToTask(parsedTask)

        const { data: createdTask, error: createError } = await supabase
          .from("tasks")
          .insert({
            ...taskData,
            user_id: user.id,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating task:", createError)
          // Continue with other tasks even if one fails
          continue
        }

        if (createdTask) {
          createdTaskIds.push(createdTask.id)
        }
      }
    }

    // Store user message in the database
    await supabase.from("messages").insert({
      user_id: user.id,
      role: "user",
      content: message,
      conversation_date: new Date().toISOString().split("T")[0],
    })

    // Store assistant response in the database
    await supabase.from("messages").insert({
      user_id: user.id,
      role: "assistant",
      content: parseResult.response_message,
      affected_task_ids: createdTaskIds,
      conversation_date: new Date().toISOString().split("T")[0],
    })

    // Return the response
    return NextResponse.json({
      message: parseResult.response_message,
      tasks: parseResult.tasks,
      taskIds: createdTaskIds,
      needs_clarification: parseResult.needs_clarification,
      clarifying_questions: parseResult.clarifying_questions,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
