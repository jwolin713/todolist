# Testing Guide - Phases 1-3

This guide will help you test all functionality implemented in Phases 1-3 of the AI-Powered To-Do App.

## Prerequisites

Before testing, ensure you have:

1. **Supabase Project**
   - Create a project at https://supabase.com
   - Run the migration in `supabase/migrations/20250101000000_initial_schema.sql`
   - Copy your project URL and anon key

2. **Anthropic API Key**
   - Get an API key from https://console.anthropic.com/settings/keys

3. **Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in all required values

## Setup Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000
```

---

## Phase 1: Foundation Tests

### ✅ Test 1: Authentication (Magic Link)

**Steps:**
1. Navigate to http://localhost:3000
2. You should be redirected to `/login`
3. Enter your email address
4. Click "Send Magic Link"
5. Check your email for the magic link
6. Click the link in the email
7. You should be redirected to the dashboard

**Expected Result:**
- Magic link email received
- Successfully logged in
- Redirected to dashboard at `/`

### ✅ Test 2: Layout & Navigation

**Steps:**
1. After logging in, verify the layout:
   - Desktop: Sidebar on the left with navigation items
   - Mobile: Bottom navigation bar
2. Check navigation items:
   - Today (home icon)
   - Inbox (inbox icon)
   - Upcoming (calendar icon)
   - Completed (check icon)
3. Click each navigation item

**Expected Result:**
- Responsive layout works on mobile and desktop
- All navigation items are visible
- User profile section shows in sidebar/header

### ✅ Test 3: User Profile & Sign Out

**Steps:**
1. Find your user profile section
2. Click the user menu
3. Click "Sign Out"
4. Verify you're redirected to `/login`

**Expected Result:**
- User email displayed in profile
- Sign out works correctly
- Redirected to login page

---

## Phase 2: Core Task Management Tests

### ✅ Test 4: Manual Task Creation

**Steps:**
1. Click the floating "+ Add Task" button (bottom-right)
2. Fill in the form:
   - Title: "Test Task"
   - Description: "This is a test"
   - Priority: High
   - Due Date: Tomorrow
   - Estimated Time: 30 minutes
   - Category: work
   - Energy Level: High
3. Click "Create Task"

**Expected Result:**
- Dialog closes
- New task appears in the task list immediately
- Task has correct details

### ✅ Test 5: Task List & Sorting

**Steps:**
1. Create 3-4 tasks with different priorities and due dates
2. Click the sort dropdown
3. Try each sort option:
   - Priority
   - Due Date
   - Created Date
   - Estimated Time

**Expected Result:**
- Tasks appear in the list
- Sorting works correctly for each option
- Task count is displayed

### ✅ Test 6: Task Detail Sheet

**Steps:**
1. Click on any task in the list
2. The task detail sheet should slide in from the right
3. Verify all task details are displayed
4. Click "Edit"
5. Modify some fields
6. Click "Save Changes"

**Expected Result:**
- Detail sheet opens smoothly
- All task details visible
- Edit mode works
- Changes save correctly
- Sheet closes after save

### ✅ Test 7: Complete/Uncomplete Task

**Steps:**
1. Click the checkbox next to a task
2. The task should get a strikethrough
3. Click the checkbox again
4. The strikethrough should disappear

**Expected Result:**
- Task status toggles correctly
- Visual feedback (strikethrough) works
- Status persists after page refresh

### ✅ Test 8: Delete Task

**Steps:**
1. Click on a task to open detail sheet
2. Scroll down and click "Delete Task"
3. Confirm the deletion

**Expected Result:**
- Confirmation dialog appears
- Task is removed from the list
- Sheet closes

### ✅ Test 9: Real-Time Subscriptions

**Steps:**
1. Open the app in two different browser windows
2. In Window 1: Create a new task
3. In Window 2: Watch for the task to appear
4. In Window 2: Update the task
5. In Window 1: Watch for the update

**Expected Result:**
- Tasks appear in real-time across windows
- Updates sync immediately
- No page refresh needed

### ✅ Test 10: Today View Categorization

**Steps:**
1. Create tasks with different attributes:
   - Overdue task (due date in the past)
   - Task scheduled for today
   - Task due today
   - High priority task (no date)
2. Check the Today view

**Expected Result:**
- Tasks are categorized into sections:
  - Overdue (red alert icon)
  - Scheduled (blue calendar icon)
  - Due Today (orange clock icon)
  - High Priority (indigo flag icon)
- Task count displayed in header
- Overdue indicator shows if applicable

---

## Phase 3: AI Integration Tests

### ✅ Test 11: Open AI Chat

**Steps:**
1. Click the gradient purple chat button (bottom-right)
2. Chat panel should slide in from the right

**Expected Result:**
- Chat panel opens smoothly
- Welcome message displays
- Example prompts are shown
- Input field is ready

### ✅ Test 12: Simple Task Creation via AI

**Steps:**
1. Open the chat panel
2. Type: "Buy groceries tomorrow"
3. Press Enter
4. Wait for AI response

**Expected Result:**
- Message sent successfully
- Loading dots animation appears
- AI responds with confirmation message
- Task preview card displays inline
- New task appears in the task list
- Task has correct scheduled date

### ✅ Test 13: Multiple Tasks in One Message

**Steps:**
1. Open chat panel
2. Type: "Finish the project report by Friday and schedule a team meeting next Monday at 2pm"
3. Send the message

**Expected Result:**
- AI parses multiple tasks
- Two task preview cards show in chat
- Both tasks created in database
- Tasks have correct due dates and details

### ✅ Test 14: Priority Detection

**Steps:**
1. Open chat panel
2. Type: "URGENT: Fix the production bug"
3. Send the message

**Expected Result:**
- AI detects urgency
- Task created with priority 1 or 2
- Task shows urgent/high priority badge

### ✅ Test 15: Time Estimation

**Steps:**
1. Open chat panel
2. Type: "Write blog post about AI, should take about 2 hours"
3. Send the message

**Expected Result:**
- AI extracts time estimate
- Task shows "2h" or "120m" in the preview
- Task has estimated_minutes = 120

### ✅ Test 16: Conversation Context

**Steps:**
1. Open chat panel
2. Type: "I need to prepare for a client presentation"
3. Wait for response
4. Type: "It's next Thursday at 2pm"
5. Wait for response

**Expected Result:**
- AI remembers context from previous message
- Second message creates task related to presentation
- Task has correct date and time

### ✅ Test 17: Inline Task Previews

**Steps:**
1. Create any task via chat
2. Verify the task preview card shows:
   - Task title
   - Priority badge (if urgent/high)
   - Due date/scheduled date
   - Time estimate
   - Energy level
   - Category

**Expected Result:**
- Preview cards display all relevant info
- Icons and colors match the design
- Cards are clickable/interactive

### ✅ Test 18: Real-Time Task Appearance

**Steps:**
1. Open chat panel
2. Create a task: "Call dentist tomorrow"
3. Close the chat panel
4. Check the Today view or task list

**Expected Result:**
- Task appears immediately in the list
- No page refresh needed
- Real-time subscription updates the UI

---

## Integration Tests

### ✅ Test 19: End-to-End Flow

**Steps:**
1. Log in with magic link
2. Create a task manually
3. Create a task via AI chat
4. Edit a task
5. Complete a task
6. Delete a task
7. Open app in second window
8. Verify all changes sync

**Expected Result:**
- All features work together seamlessly
- No errors in console
- Real-time sync works throughout

### ✅ Test 20: Error Handling

**Steps:**
1. Disconnect from internet
2. Try to create a task
3. Reconnect
4. Try again

**Expected Result:**
- Graceful error messages
- App doesn't crash
- Works after reconnecting

---

## Console Check

Open the browser console (F12) and check for:

- ✅ No error messages
- ✅ Real-time subscription status logs
- ✅ Successful API calls

---

## Database Verification

Check your Supabase dashboard:

1. **Tasks Table**
   - Verify tasks are being created
   - Check that all fields are populated correctly
   - Verify user_id is set

2. **Messages Table**
   - Verify chat messages are being stored
   - Check conversation_date is set
   - Verify affected_task_ids is populated

3. **Profiles Table**
   - Verify your user profile was created

---

## Performance Check

- ✅ App loads quickly (< 2 seconds)
- ✅ AI responses come back in reasonable time (< 5 seconds)
- ✅ Real-time updates are instant
- ✅ UI is smooth and responsive

---

## Known Issues / Troubleshooting

### Issue: Magic link not received
**Solution:** Check spam folder, ensure email is valid, check Supabase email settings

### Issue: AI chat not responding
**Solution:** Verify ANTHROPIC_API_KEY is set correctly in .env.local

### Issue: Tasks not appearing
**Solution:** Check browser console for errors, verify Supabase connection

### Issue: Real-time not working
**Solution:** Check that Supabase Realtime is enabled in project settings

---

## Test Summary

Create a checklist as you test:

**Phase 1: Foundation**
- [ ] Authentication (Test 1)
- [ ] Layout & Navigation (Test 2)
- [ ] User Profile & Sign Out (Test 3)

**Phase 2: Core Task Management**
- [ ] Manual Task Creation (Test 4)
- [ ] Task List & Sorting (Test 5)
- [ ] Task Detail Sheet (Test 6)
- [ ] Complete/Uncomplete Task (Test 7)
- [ ] Delete Task (Test 8)
- [ ] Real-Time Subscriptions (Test 9)
- [ ] Today View Categorization (Test 10)

**Phase 3: AI Integration**
- [ ] Open AI Chat (Test 11)
- [ ] Simple Task Creation via AI (Test 12)
- [ ] Multiple Tasks in One Message (Test 13)
- [ ] Priority Detection (Test 14)
- [ ] Time Estimation (Test 15)
- [ ] Conversation Context (Test 16)
- [ ] Inline Task Previews (Test 17)
- [ ] Real-Time Task Appearance (Test 18)

**Integration Tests**
- [ ] End-to-End Flow (Test 19)
- [ ] Error Handling (Test 20)

---

## Next Steps

If all tests pass, you're ready to move on to Phase 4: Smart Features!

If you encounter issues, check:
1. Environment variables are set correctly
2. Supabase migrations have been run
3. Browser console for error messages
4. Supabase dashboard for data
