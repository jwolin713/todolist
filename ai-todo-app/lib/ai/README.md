# AI Integration

This directory contains the AI-powered task parsing functionality using Anthropic's Claude API.

## Files

### `client.ts`
Configures the Anthropic SDK client with API key and model selection.
- Uses `claude-sonnet-4-5-20250929` model
- Requires `ANTHROPIC_API_KEY` environment variable

### `prompts.ts`
Contains system prompts for the AI assistant:
- **TASK_PARSER_SYSTEM_PROMPT**: Main prompt for parsing tasks from natural language
- **CLARIFYING_QUESTIONS_PROMPT**: Guides the AI to ask helpful clarifying questions

### `task-parser.ts`
Core task parsing functionality:
- `parseTasksFromMessage()`: Converts natural language to structured task objects
- Uses Anthropic's tool calling (structured output) for reliable parsing
- Supports multiple tasks in a single message
- Handles conversation history for context-aware parsing
- `parseRelativeDate()`: Helper to convert "today", "tomorrow", "next Monday" to dates

### `utils.ts`
Helper functions:
- `parsedTaskToTask()`: Converts AI output to database Task format
- `formatTaskForChat()`: Formats tasks for display in chat
- `getTimeBasedGreeting()`: Returns context-aware greeting
- `isValidDateFormat()` / `isValidTimeFormat()`: Date/time validation

### `types/ai.ts`
TypeScript interfaces for AI-related data structures

## How It Works

1. User sends a natural language message (e.g., "Schedule a meeting with John tomorrow at 2pm")

2. `parseTasksFromMessage()` sends the message to Claude with:
   - System prompt defining the task parser role
   - Conversation history for context
   - Structured output schema (tool) for reliable parsing
   - Current date/time context

3. Claude returns:
   - `tasks[]`: Array of parsed task objects
   - `needs_clarification`: Boolean indicating if questions are needed
   - `clarifying_questions[]`: Optional array of questions
   - `response_message`: Friendly response to show the user

4. Tasks are converted to database format and inserted via Supabase

5. Response is shown in the chat UI

## Key Features

- **Multi-task parsing**: Can extract multiple tasks from one message
- **Context-aware**: Uses conversation history for better understanding
- **Smart defaults**: Infers priority, energy level, and category when not specified
- **Relative dates**: Handles "today", "tomorrow", day names, etc.
- **Clarifying questions**: Asks for details when input is ambiguous
- **Structured output**: Uses tool calling for reliable, type-safe parsing

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Get your API key from: https://console.anthropic.com/settings/keys

## Testing

Run the manual test script:
```bash
npm run test:parser
```

This will test the parser with various inputs and show the structured output.

## Example Usage

```typescript
import { parseTasksFromMessage } from "@/lib/ai/task-parser"
import { parsedTaskToTask } from "@/lib/ai/utils"

// Example 1: Simple task parsing
const result = await parseTasksFromMessage(
  "Buy groceries tomorrow and finish the project report by Friday"
)

console.log(result)
// {
//   tasks: [
//     { title: "Buy groceries", scheduled_date: "2025-01-25", ... },
//     { title: "Finish project report", due_date: "2025-01-27", ... }
//   ],
//   needs_clarification: false,
//   response_message: "I've added 2 tasks for you!"
// }

// Example 2: Convert to database format and insert
for (const parsedTask of result.tasks) {
  const taskData = parsedTaskToTask(parsedTask)
  await supabase.from("tasks").insert(taskData)
}

// Example 3: Handle clarification flow
if (result.needs_clarification) {
  console.log("Questions to ask:", result.clarifying_questions)
  // Show questions to user, get answers, then call parseTasksFromMessage again
}
```
