# Database Fixes for HR Portal

## Issues Identified and Fixed:

1. **RLS (Row Level Security) Policy Conflicts** - Multiple overlapping policies causing permission issues
2. **Missing Profile Creation** - Users without profiles after authentication
3. **Permission Issues** - Anon users unable to access public pages (careers, applications)
4. **Authentication Flow Problems** - Retry logic and error handling improvements

## How to Apply the Fixes:

### Option 1: Using Supabase CLI (Recommended)

1. **Apply the database migration:**
   ```bash
   # Make sure you're in the web directory and linked to your project
   cd web
   npx supabase db push
   ```

   If that doesn't work because Docker is required, use Option 2.

### Option 2: Using Supabase Dashboard (Manual)

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/tqtwdkobrzzrhrqdxprs
   - Navigate to "SQL Editor"

2. **Run the database fixes:**
   - Copy the entire content of `supabase/20250127_database_fixes.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

### Option 3: Using psql (Advanced)

If you have PostgreSQL client installed:
```bash
psql "postgresql://postgres:[YOUR_DB_PASSWORD]@db.tqtwdkobrzzrhrqdxprs.supabase.co:5432/postgres" -f supabase/20250127_database_fixes.sql
```

## What the Fixes Do:

### 1. **Profiles Table Improvements:**
- Ensures all required columns exist
- Updates email addresses from auth.users
- Fixes RLS policies with clear, non-conflicting rules

### 2. **Authentication Function Fix:**
- Improved `handle_new_user()` function with better error handling
- Automatic profile creation for new users
- Backfill profiles for existing auth users

### 3. **Permission Fixes:**
- Allows anonymous users to view jobs (for careers page)
- Allows anonymous users to submit applications
- Proper authenticated user permissions for profiles

### 4. **Performance Improvements:**
- Added database indexes for better query performance
- Updated table statistics

### 5. **Frontend Authentication Improvements:**
- Enhanced `useAuth.ts` hook with retry logic
- Better error handling and user feedback
- Automatic profile creation if missing

## After Applying Fixes:

1. **Test the application:**
   - Visit your careers page (should load without authentication)
   - Try registering as a candidate
   - Test the login flow
   - Check the admin dashboard

2. **Monitor for issues:**
   - Check browser console for any remaining errors
   - Verify database queries are working in Supabase Dashboard

3. **Verification Steps:**
   ```bash
   # Check if fixes were applied
   npx supabase inspect db table-sizes
   
   # Check for any remaining locks or issues
   npx supabase inspect db locks
   ```

## Common Issues and Solutions:

**Issue: "relation 'public.profiles' does not exist"**
- Solution: Run the schema.sql first, then the fixes

**Issue: "permission denied for table profiles"**
- Solution: The RLS policies in the fix script should resolve this

**Issue: Authentication loops**
- Solution: Clear browser localStorage and try again

**Issue: "Error fetching user role"**
- Solution: The improved useAuth hook handles this with retry logic

## Need Help?

If you encounter any issues:
1. Check the browser console for specific error messages
2. Look at the Supabase Dashboard logs
3. Use the CLI to inspect database health: `npx supabase inspect db cache-hit` 