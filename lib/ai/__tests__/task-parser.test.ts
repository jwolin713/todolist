/**
 * Task Parser Tests
 *
 * These tests verify the task parsing functionality.
 * To run: npm test (after setting up Jest)
 *
 * For now, these serve as documentation of expected behavior.
 */

import { parseTasksFromMessage, parseRelativeDate } from "../task-parser"

describe("Task Parser", () => {
  describe("parseTasksFromMessage", () => {
    it("should parse a simple task", async () => {
      const result = await parseTasksFromMessage("Buy groceries tomorrow")

      expect(result.tasks).toHaveLength(1)
      expect(result.tasks[0].title).toBe("Buy groceries")
      expect(result.tasks[0].scheduled_date).toBeTruthy()
    })

    it("should parse multiple tasks from one message", async () => {
      const result = await parseTasksFromMessage(
        "Finish the report by Friday and schedule a meeting with John next Monday at 2pm"
      )

      expect(result.tasks.length).toBeGreaterThanOrEqual(2)
    })

    it("should handle priority keywords", async () => {
      const result = await parseTasksFromMessage("URGENT: Fix production bug")

      expect(result.tasks[0].priority).toBeLessThanOrEqual(2) // Should be urgent or high
    })

    it("should parse time estimates", async () => {
      const result = await parseTasksFromMessage("Write blog post, should take about 2 hours")

      expect(result.tasks[0].estimated_minutes).toBeGreaterThan(0)
    })

    it("should identify when clarification is needed", async () => {
      const result = await parseTasksFromMessage("Do the thing")

      expect(result.needs_clarification).toBe(true)
      expect(result.clarifying_questions).toBeTruthy()
    })

    it("should handle conversation context", async () => {
      const history = [
        { role: "user" as const, content: "I need to prepare for the client meeting" },
        { role: "assistant" as const, content: "When is the meeting scheduled?" },
      ]

      const result = await parseTasksFromMessage("It's on Friday at 3pm", history)

      expect(result.tasks[0].title).toContain("meeting")
    })
  })

  describe("parseRelativeDate", () => {
    it("should parse 'today'", () => {
      const result = parseRelativeDate("today")
      const today = new Date().toISOString().split("T")[0]

      expect(result).toBe(today)
    })

    it("should parse 'tomorrow'", () => {
      const result = parseRelativeDate("tomorrow")
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const expectedDate = tomorrow.toISOString().split("T")[0]

      expect(result).toBe(expectedDate)
    })

    it("should parse day names", () => {
      const result = parseRelativeDate("monday")

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it("should parse 'next week'", () => {
      const result = parseRelativeDate("next week")
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      const expectedDate = nextWeek.toISOString().split("T")[0]

      expect(result).toBe(expectedDate)
    })

    it("should handle ISO date format", () => {
      const result = parseRelativeDate("2025-12-25")

      expect(result).toBe("2025-12-25")
    })

    it("should return null for invalid dates", () => {
      const result = parseRelativeDate("invalid date string")

      expect(result).toBeNull()
    })
  })
})

/**
 * Example Usage
 */
export const exampleUsage = async () => {
  // Example 1: Simple task
  const result1 = await parseTasksFromMessage("Buy groceries tomorrow")
  console.log("Example 1:", result1)
  // {
  //   tasks: [{ title: "Buy groceries", scheduled_date: "2025-01-25", ... }],
  //   needs_clarification: false,
  //   response_message: "I've added a task for you!"
  // }

  // Example 2: Multiple tasks with details
  const result2 = await parseTasksFromMessage(
    "Finish the project report by Friday (high priority, should take 3 hours) and schedule a team meeting for next Monday"
  )
  console.log("Example 2:", result2)
  // {
  //   tasks: [
  //     { title: "Finish project report", priority: 2, due_date: "2025-01-27", estimated_minutes: 180, ... },
  //     { title: "Schedule team meeting", scheduled_date: "2025-01-30", ... }
  //   ],
  //   needs_clarification: false,
  //   response_message: "I've added 2 tasks for you!"
  // }

  // Example 3: Vague task requiring clarification
  const result3 = await parseTasksFromMessage("Need to do the thing")
  console.log("Example 3:", result3)
  // {
  //   tasks: [{ title: "Do the thing", ... }],
  //   needs_clarification: true,
  //   clarifying_questions: ["What specific task do you need to complete?", "When do you need this done?"],
  //   response_message: "I need a bit more information to help you better."
  // }

  // Example 4: With conversation context
  const history = [
    { role: "user" as const, content: "I need to prepare for the client presentation" },
    { role: "assistant" as const, content: "When is the presentation?" },
  ]
  const result4 = await parseTasksFromMessage("It's next Thursday at 2pm", history)
  console.log("Example 4:", result4)
  // {
  //   tasks: [{ title: "Prepare for client presentation", scheduled_date: "2025-01-26", due_time: "14:00", ... }],
  //   needs_clarification: false,
  //   response_message: "Got it! I've scheduled the preparation task."
  // }
}
