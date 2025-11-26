# Chat API

This API endpoint handles natural language task creation using Anthropic's Claude.

## Endpoint

`POST /api/chat`

## Request Body

```json
{
  "message": "Buy groceries tomorrow and finish the project report by Friday",
  "history": [
    {
      "role": "user",
      "content": "Previous user message"
    },
    {
      "role": "assistant",
      "content": "Previous assistant response"
    }
  ]
}
```

### Parameters

- `message` (required): The user's natural language message describing tasks
- `history` (optional): Array of previous conversation messages for context

## Response

### Success Response (200)

```json
{
  "message": "I've added 2 tasks for you!",
  "tasks": [
    {
      "title": "Buy groceries",
      "scheduled_date": "2025-01-25",
      "priority": 3,
      ...
    },
    {
      "title": "Finish project report",
      "due_date": "2025-01-27",
      "priority": 2,
      ...
    }
  ],
  "taskIds": ["uuid-1", "uuid-2"],
  "needs_clarification": false,
  "clarifying_questions": []
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**400 Bad Request**
```json
{
  "error": "Message is required"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to process message",
  "details": "Error details here"
}
```

## How It Works

1. **Authentication**: Verifies the user is logged in via Supabase auth
2. **Parse Message**: Sends the message and conversation history to Claude via the task parser
3. **Extract Tasks**: Claude returns structured task data using tool calling
4. **Create Tasks**: Inserts parsed tasks into the database
5. **Store Messages**: Saves both user and assistant messages to the messages table
6. **Return Response**: Sends back the assistant's message, parsed tasks, and task IDs

## Features

- Natural language understanding
- Context-aware (uses conversation history)
- Structured output (reliable task extraction)
- Automatic task creation in database
- Conversation history tracking
- Error handling and rollback

## Example Usage

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Schedule a team meeting next Monday at 2pm',
    history: [],
  }),
})

const data = await response.json()

console.log(data.message) // "I've scheduled a team meeting for you!"
console.log(data.taskIds)  // ["task-uuid"]
```

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

## Database Tables Used

- `tasks` - Stores created tasks
- `messages` - Stores conversation history

## Error Handling

The API handles various error scenarios:
- Authentication failures
- Invalid request format
- AI parsing errors
- Database insertion errors
- Missing environment variables

If a task fails to create, the API continues processing other tasks rather than failing completely.
