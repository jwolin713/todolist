# Environment Variables Setup Guide

This guide will help you configure the required environment variables for the AI Todo App.

## Required Environment Variables

The application requires 4 environment variables to function properly:

1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
3. `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)
4. `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude AI

## Step-by-Step Setup

### 1. Copy the Example File

A `.env.local` file has been created with placeholder values. You need to replace these with your actual keys.

### 2. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create one following `SUPABASE_SETUP.md`)
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **URL**: Copy the "Project URL" value
   - **anon/public key**: Copy the "anon public" key (starts with `eyJ...`)
   - **service_role key**: Copy the "service_role" key (starts with `eyJ...`)

**Important**: The service_role key has full access to your database. Never expose it in client-side code or commit it to version control.

### 3. Get Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys**
4. Create a new API key or copy an existing one
5. The key will start with `sk-ant-...`

**Note**: Anthropic offers a free trial with credits. Check their pricing page for current rates.

### 4. Update Your `.env.local` File

Open the `.env.local` file in your editor and replace the placeholder values:

```env
# Replace these with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 5. Restart Your Development Server

After updating the environment variables, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Verification

To verify your environment variables are set up correctly:

1. **Supabase Connection**: Try to sign in with the magic link
   - Go to `http://localhost:3000/login`
   - Enter your email
   - If you receive a magic link email, Supabase is configured correctly

2. **Anthropic API**: The AI features will be tested in Phase 3
   - You can verify the key is valid by checking the Anthropic Console

## Troubleshooting

### "Invalid API key" errors

- Double-check that you copied the entire key without extra spaces
- Ensure you're using the correct key (anon vs service_role)
- Verify the key hasn't been revoked in your Supabase/Anthropic dashboard

### Changes not taking effect

- Make sure you restarted the dev server after changing `.env.local`
- Clear your browser cache and cookies
- Check that the variable names match exactly (they're case-sensitive)

### Can't find `.env.local`

- The file is in the root directory: `ai-todo-app/.env.local`
- It may be hidden by your file explorer (enable "Show hidden files")
- If it doesn't exist, copy `.env.local.example` and rename it

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - it won't be committed to Git
- ✅ `NEXT_PUBLIC_*` variables are safe to expose to the browser
- ⚠️ **Never** share your `SUPABASE_SERVICE_ROLE_KEY` or `ANTHROPIC_API_KEY`
- ⚠️ Don't commit `.env.local` to version control
- ⚠️ Don't share screenshots that include your API keys

## Next Steps

Once your environment variables are configured:

1. Follow `SUPABASE_SETUP.md` to set up your database
2. Run `npm run dev` to start the development server
3. Navigate to `http://localhost:3000` to see your app!
