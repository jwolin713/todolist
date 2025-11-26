# Quick Start Guide

Get your AI-Powered To-Do App running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to https://supabase.com and create a new project
2. Wait for the project to finish provisioning
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon public** key
5. Go to **SQL Editor** in the left sidebar
6. Click **New Query**
7. Copy the contents of `supabase/migrations/20250101000000_initial_schema.sql`
8. Paste into the SQL editor and click **Run**
9. Verify the tables were created in **Table Editor**

## Step 3: Get Anthropic API Key

1. Go to https://console.anthropic.com/settings/keys
2. Create a new API key
3. Copy the key (starts with `sk-ant-`)

## Step 4: Configure Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your favorite editor
# Fill in these values:
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
```

## Step 5: Verify Setup

```bash
npm run verify:setup
```

This will check that everything is configured correctly.

## Step 6: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 7: Test It Out

1. **Sign in** with your email (magic link)
2. **Create a task manually** using the "+ Add Task" button
3. **Create a task with AI** by clicking the purple chat button and typing:
   - "Buy groceries tomorrow"
   - "Finish project report by Friday"
   - "Schedule team meeting next Monday at 2pm"

## What's Working? (Phases 1-3)

✅ **Phase 1: Foundation**
- Magic link authentication
- Responsive layout (sidebar + bottom nav)
- User profile and sign out

✅ **Phase 2: Core Task Management**
- Create, read, update, delete tasks
- Task sorting (priority, date, time)
- Task detail sheet
- Real-time synchronization
- Today view with smart categorization

✅ **Phase 3: AI Integration**
- Natural language task creation
- AI-powered task parsing
- Conversation context awareness
- Inline task previews
- Automatic task creation from chat

## Testing

For comprehensive testing, see [TESTING.md](./TESTING.md)

## Troubleshooting

### Issue: "Unauthorized" error

**Solution:** Make sure you've run the Supabase migration and your environment variables are correct.

### Issue: AI chat not working

**Solution:** Verify your `ANTHROPIC_API_KEY` is set correctly in `.env.local`

### Issue: Tasks not syncing in real-time

**Solution:** Check that Realtime is enabled in your Supabase project settings under **Database** → **Replication**

### Issue: Magic link not received

**Solution:**
- Check your spam folder
- Verify your email in Supabase auth settings
- Check Supabase **Authentication** → **Email Templates**

## Next Steps

- Complete the testing checklist in [TESTING.md](./TESTING.md)
- Move on to Phase 4: Smart Features
- Deploy to production

## Need Help?

Check the console for errors:
- Press F12 in your browser
- Look at the **Console** tab
- Check the **Network** tab for failed requests

Check Supabase logs:
- Go to your Supabase project
- Click **Logs** in the sidebar
- Filter by error level

## Scripts Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Verify setup
npm run verify:setup

# Test AI task parser
npm run test:parser

# Lint code
npm run lint
```

## File Structure

```
ai-todo-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main app pages
│   └── api/               # API routes
├── components/            # React components
│   ├── chat/             # AI chat UI
│   ├── layout/           # Layout components
│   ├── tasks/            # Task management UI
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
│   ├── ai/              # AI integration
│   ├── supabase/        # Supabase clients
│   └── types/           # TypeScript types
├── supabase/            # Database migrations
└── public/              # Static assets
```

Happy coding! 🚀
