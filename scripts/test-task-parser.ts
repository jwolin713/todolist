/**
 * Manual test script for the task parser
 *
 * This script allows you to test the task parser functionality manually.
 * Run with: npx tsx scripts/test-task-parser.ts
 *
 * Make sure to set ANTHROPIC_API_KEY in your .env.local file first!
 */

import { parseTasksFromMessage, parseRelativeDate } from "../lib/ai/task-parser"
import { parsedTaskToTask, formatTaskForChat } from "../lib/ai/utils"

async function testParser() {
  console.log("🧪 Testing Task Parser\n")
  console.log("=" .repeat(60))

  // Test 1: Simple task
  console.log("\n📝 Test 1: Simple task")
  console.log("Input: 'Buy groceries tomorrow'")
  try {
    const result1 = await parseTasksFromMessage("Buy groceries tomorrow")
    console.log("✅ Success!")
    console.log("Tasks:", JSON.stringify(result1.tasks, null, 2))
    console.log("Response:", result1.response_message)
    console.log("Needs clarification:", result1.needs_clarification)
  } catch (error) {
    console.error("❌ Error:", error)
  }

  // Test 2: Multiple tasks with details
  console.log("\n" + "=".repeat(60))
  console.log("\n📝 Test 2: Multiple tasks with priorities and deadlines")
  console.log(
    "Input: 'URGENT: Fix the login bug and write documentation by next Friday (should take 2 hours)'"
  )
  try {
    const result2 = await parseTasksFromMessage(
      "URGENT: Fix the login bug and write documentation by next Friday (should take 2 hours)"
    )
    console.log("✅ Success!")
    console.log("Number of tasks:", result2.tasks.length)
    result2.tasks.forEach((task, i) => {
      console.log(`\nTask ${i + 1}:`)
      console.log(`  Title: ${task.title}`)
      console.log(`  Priority: ${task.priority || "default"}`)
      console.log(`  Due Date: ${task.due_date || "none"}`)
      console.log(`  Estimated Time: ${task.estimated_minutes || "none"} minutes`)
    })
    console.log("\nResponse:", result2.response_message)
  } catch (error) {
    console.error("❌ Error:", error)
  }

  // Test 3: Vague task (should ask for clarification)
  console.log("\n" + "=".repeat(60))
  console.log("\n📝 Test 3: Vague task requiring clarification")
  console.log("Input: 'Do the thing'")
  try {
    const result3 = await parseTasksFromMessage("Do the thing")
    console.log("✅ Success!")
    console.log("Needs clarification:", result3.needs_clarification)
    if (result3.clarifying_questions) {
      console.log("Questions:")
      result3.clarifying_questions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`))
    }
    console.log("Response:", result3.response_message)
  } catch (error) {
    console.error("❌ Error:", error)
  }

  // Test 4: Conversation context
  console.log("\n" + "=".repeat(60))
  console.log("\n📝 Test 4: Task with conversation context")
  console.log("Context: User mentioned a client meeting")
  console.log("Input: 'Prepare slides for the meeting on Thursday at 2pm'")
  try {
    const result4 = await parseTasksFromMessage(
      "Prepare slides for the meeting on Thursday at 2pm",
      [
        { role: "user", content: "I have a client meeting coming up" },
        { role: "assistant", content: "When is the meeting scheduled?" },
      ]
    )
    console.log("✅ Success!")
    console.log("Task:", JSON.stringify(result4.tasks[0], null, 2))
    console.log("Response:", result4.response_message)
  } catch (error) {
    console.error("❌ Error:", error)
  }

  // Test 5: Date parsing
  console.log("\n" + "=".repeat(60))
  console.log("\n📝 Test 5: Relative date parsing")
  const dateTests = ["today", "tomorrow", "next week", "monday", "2025-12-25", "invalid"]
  dateTests.forEach((dateStr) => {
    const result = parseRelativeDate(dateStr)
    console.log(`  "${dateStr}" → ${result || "null"}`)
  })

  // Test 6: Utility functions
  console.log("\n" + "=".repeat(60))
  console.log("\n📝 Test 6: Utility functions")
  const mockTask = {
    id: "123",
    user_id: "user-123",
    title: "Complete project report",
    description: "Quarterly report for Q4",
    priority: 2,
    estimated_minutes: 120,
    category: "work",
    energy_level: "high" as const,
    due_date: "2025-01-31",
    due_time: null,
    scheduled_date: "2025-01-28",
    recurrence_rule: null,
    status: "pending" as const,
    completed_at: null,
    parent_task_id: null,
    position: 0,
    source_message_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  console.log("Formatted task for chat:")
  console.log(`  ${formatTaskForChat(mockTask)}`)

  console.log("\n" + "=".repeat(60))
  console.log("\n✨ All tests completed!\n")
}

// Run tests if this script is executed directly
if (require.main === module) {
  testParser().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
}

export { testParser }
