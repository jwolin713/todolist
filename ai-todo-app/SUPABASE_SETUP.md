# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: `ai-todo-app` (or your preferred name)
   - **Database Password**: Generate a secure password (save it!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is sufficient for development
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Run the Database Migration

1. In your Supabase dashboard, navigate to the **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/20250101000000_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Verify that all tables were created successfully

**Expected tables created:**
- `public.profiles`
- `public.tasks`
- `public.messages`

## Step 3: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values (you'll need them for `.env.local`):
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 4: Configure Environment Variables

1. In your project root (`ai-todo-app`), create a `.env.local` file
2. Add the following (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Step 5: Enable Email Auth (for Magic Link)

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Ensure **Email** is enabled (it should be by default)
3. Configure email settings:
   - Go to **Authentication** > **Email Templates**
   - Customize the magic link email if desired
   - For development, you can use the default settings

## Step 6: Verify Real-time is Enabled

1. Go to **Database** > **Replication**
2. Ensure that `public.tasks` and `public.messages` tables are listed
3. If not, toggle them on to enable real-time subscriptions

## Step 7: Test the Connection

Once you've set up your `.env.local` file, you can test the connection by running the Next.js app:

```bash
npm run dev
```

## Troubleshooting

### Tables not showing up
- Make sure you ran the SQL migration in the correct order
- Check the SQL Editor for any error messages
- Verify you're in the correct project

### Real-time not working
- Check that tables are enabled in Database > Replication
- Ensure RLS policies are set up correctly (they are in the migration)
- Verify the `anon` key has proper permissions

### Auth errors
- Double-check your `.env.local` file has the correct keys
- Make sure `NEXT_PUBLIC_` prefix is on public keys only
- Restart your dev server after changing environment variables

## Next Steps

After completing this setup:
- Run `npm run dev` to start your development server
- The database schema is ready for authentication and task management
- You can now proceed with implementing the authentication flow
