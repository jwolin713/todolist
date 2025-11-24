# TaskFlow AI - Smart Task Management

An AI-powered to-do application that uses natural language processing to help you manage tasks intelligently.

## ✨ Features

### ✅ Core Features

- **Magic Link Authentication** - Passwordless login via email
- **AI-Powered Task Creation** - Create tasks using natural language
- **Real-time Synchronization** - Tasks sync instantly across devices
- **Smart Today View** - Intelligent categorization (overdue, scheduled, due today, high priority)
- **Task Management** - Full CRUD operations with sorting
- **Conversational AI** - Context-aware chat interface with conversation history
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Inline Task Previews** - See parsed tasks before they're created

### 🚀 Advanced Features

- **Smart Prioritization** - AI-powered task scoring algorithm based on priority, deadlines, time, and energy
- **Intelligent Suggestions** - Get task recommendations based on available time and energy level
- **Subtasks** - Break down large tasks with progress tracking
- **Progressive Web App** - Install on any device, works offline
- **Optimistic Updates** - Instant UI feedback with automatic rollback on errors
- **Keyboard Shortcuts** - Navigate faster (⌘/Ctrl + / to see all shortcuts)
- **Clarifying Questions** - AI asks for details when task description is unclear

## 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# 3. Verify setup
npm run verify:setup

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide covering all implemented features.

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **AI**: Anthropic Claude (claude-sonnet-4-5)
- **Authentication**: Supabase Auth (Magic Link)

## 📁 Project Structure

```
ai-todo-app/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication pages
│   │   └── login/               # Magic link login
│   ├── (dashboard)/             # Main application
│   │   ├── page.tsx            # Today view
│   │   ├── inbox/              # All tasks view
│   │   ├── upcoming/           # Future tasks
│   │   └── completed/          # Completed tasks
│   ├── api/                     # API routes
│   │   └── chat/               # AI chat endpoint
│   └── auth/callback/          # Auth callback handler
├── components/
│   ├── chat/                    # AI chat interface
│   │   ├── chat-panel.tsx      # Main chat UI
│   │   ├── chat-message.tsx    # Message bubbles
│   │   ├── chat-input.tsx      # Message input
│   │   ├── chat-button.tsx     # Floating action button
│   │   └── task-preview-card.tsx # Task preview in chat
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx         # Desktop sidebar
│   │   ├── mobile-nav.tsx      # Mobile bottom nav
│   │   └── header.tsx          # Page header
│   ├── tasks/                   # Task management UI
│   │   ├── task-list.tsx       # Task list with sorting
│   │   ├── task-item.tsx       # Individual task card
│   │   ├── task-detail-sheet.tsx # Edit task drawer
│   │   ├── create-task-button.tsx # Manual creation
│   │   └── today-view.tsx      # Today categorization
│   ├── providers/               # React context providers
│   │   ├── supabase-provider.tsx
│   │   └── realtime-provider.tsx
│   └── ui/                      # shadcn/ui components
├── hooks/                       # Custom React hooks
│   ├── use-realtime-tasks.ts   # Real-time task management
│   ├── use-today-tasks.ts      # Today view filtering
│   └── use-chat.ts             # Chat state management
├── lib/
│   ├── ai/                      # AI integration
│   │   ├── client.ts           # Anthropic SDK setup
│   │   ├── task-parser.ts      # NLP task parsing
│   │   ├── prompts.ts          # System prompts
│   │   └── utils.ts            # AI helper functions
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   ├── types/                  # TypeScript types
│   │   ├── database.ts         # Database models
│   │   └── ai.ts               # AI types
│   └── utils.ts                # Utility functions
├── supabase/
│   └── migrations/             # Database migrations
│       └── 20250101000000_initial_schema.sql
└── scripts/
    ├── verify-setup.ts         # Setup verification
    └── test-task-parser.ts     # AI parser testing
```

## 📊 Development Progress

See [TASKLIST.md](../TASKLIST.md) for detailed implementation tracking.

### ✅ Phase 1: Foundation (100%)
- Next.js project with TypeScript
- Tailwind CSS & shadcn/ui
- Supabase database & auth
- Responsive layout

### ✅ Phase 2: Core Task Management (100%)
- Task CRUD operations
- Real-time subscriptions
- Task detail editing
- Today view with categorization

### ✅ Phase 3: AI Integration (100%)
- Anthropic SDK setup
- Task parser with structured output
- Chat panel UI
- Chat API route
- Natural language task creation
- Inline task previews

### ✅ Phase 4: Smart Features (100%)
- Task scoring algorithm
- Dynamic prioritization
- Task suggestions based on time/energy
- Clarifying questions flow
- Subtask support with progress tracking
- Conversation history view

### ✅ Phase 5: Polish & PWA (100%)
- PWA configuration with service worker
- Offline support with online/offline indicator
- Optimistic updates everywhere
- Keyboard shortcuts system
- Performance optimizations
- Mobile-specific UX improvements

**Overall Progress: 31/31 tasks (100%)** 🎉

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Testing & Verification
npm run verify:setup     # Check setup is correct
npm run test:parser      # Test AI task parser

# Code Quality
npm run lint            # Run ESLint
```

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide
- **[TASKLIST.md](../TASKLIST.md)** - Implementation progress tracker
- **[lib/ai/README.md](./lib/ai/README.md)** - AI integration documentation
- **[app/api/chat/README.md](./app/api/chat/README.md)** - Chat API documentation

## 🔑 Environment Variables

Required environment variables (see `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
```

## 🎯 Key Features Explained

### Natural Language Task Creation

Instead of filling out forms, just describe your task:

```
"Buy groceries tomorrow" → Task with scheduled_date
"URGENT: Fix production bug" → Task with priority 1
"Write blog post, should take 2 hours" → Task with time estimate
"Meeting with John next Monday at 2pm" → Task with date and time
```

### Smart Today View

Tasks are automatically categorized into:
- **Overdue** - Past due date, needs attention
- **Scheduled** - Scheduled for today
- **Due Today** - Due date is today
- **High Priority** - Important unscheduled tasks

### Real-Time Sync

Open the app in multiple tabs or devices - changes appear instantly across all instances.

## 🤝 Contributing

This project was built as a demonstration of AI-powered task management. Feel free to:
- Fork the repository
- Submit issues or suggestions
- Improve the documentation
- Add new features

## 📄 License

MIT License - feel free to use this code for your own projects.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Database & Auth by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

Built with ❤️ using Next.js, Supabase, and Claude AI
