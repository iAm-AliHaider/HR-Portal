# Database Setup Guide - Fix Authentication Issues

Your HR Portal was experiencing authentication loops because the database schema wasn't properly set up. Here's how to fix it:

## 🔧 **Issues Fixed:**

1. **❌ Missing `users` table** → **✅ Using `profiles` table correctly**
2. **❌ No automatic profile creation** → **✅ Added trigger for new user signup**
3. **❌ Missing RLS policies** → **✅ Added proper security policies**
4. **❌ Authentication loops** → **✅ Fixed user role detection**

## 🗄️ **Database Setup Steps:**

### **Step 1: Connect to your Supabase Dashboard**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Open your project: `tqtwdkobrzzrhrqdxprs`
3. Go to **SQL Editor**

### **Step 2: Run the Main Schema**
Copy and paste the content from `supabase/schema.sql` into the SQL Editor and execute it. This creates:
- ✅ All tables (profiles, jobs, applications, etc.)
- ✅ User roles and enums
- ✅ Triggers and functions

### **Step 3: Run the Authentication Fix**
Copy and paste the content from `supabase/20240607_fix_user_creation.sql` and execute it. This:
- ✅ Fixes profile creation on user signup
- ✅ Sets up proper Row Level Security
- ✅ Creates profiles for existing users

### **Step 4: Verify Setup**
Run this query to check if everything is working:

```sql
-- Check if profiles table exists and has the right structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Check if the trigger exists
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check existing profiles
SELECT id, email, role, created_at FROM profiles LIMIT 5;
```

## 🔐 **How User Authentication Now Works:**

### **For New Users:**
1. User signs up through Supabase Auth
2. **Trigger automatically creates profile** in `profiles` table
3. User gets default `employee` role
4. Profile includes: `id`, `email`, `name`, `role`, `department`

### **For Existing Users:**
1. Migration script creates missing profiles
2. Uses email to generate default name
3. Assigns `employee` role by default

### **Role-Based Access:**
- **Admin**: Full system access
- **HR**: Recruitment and employee management
- **Manager**: Team management
- **Employee**: Self-service features
- **Recruiter**: Job posting and candidate management

## 🚀 **Testing Your Fix:**

### **Test User Creation:**
1. Go to your deployed HR Portal
2. Try registering a new candidate at `/candidate/register`
3. Check Supabase Auth → Users (should see new user)
4. Check Database → profiles table (should see new profile)

### **Test Login Flow:**
1. Try logging in with test credentials
2. Should redirect to appropriate dashboard
3. No more authentication loops!

### **Test Role Access:**
1. Create users with different roles
2. Test access to different pages
3. Verify permissions work correctly

## 🔧 **Manual User Creation (Optional):**

If you want to create admin users manually:

```sql
-- Create an admin user profile (after they sign up through Auth)
UPDATE profiles 
SET role = 'admin', 
    department = 'Administration',
    position = 'System Administrator'
WHERE email = 'admin@yourcompany.com';

-- Create an HR user
UPDATE profiles 
SET role = 'hr', 
    department = 'Human Resources',
    position = 'HR Manager'
WHERE email = 'hr@yourcompany.com';
```

## 📋 **Verification Checklist:**

After running the database setup:

- [ ] ✅ `profiles` table exists and has data
- [ ] ✅ `on_auth_user_created` trigger is active
- [ ] ✅ RLS policies are enabled
- [ ] ✅ New user registration creates profile automatically
- [ ] ✅ Login redirects to correct dashboard
- [ ] ✅ No more "relation 'public.users' does not exist" errors
- [ ] ✅ User role detection works properly

## 🎯 **Expected Result:**

After this setup:
1. **New candidates** can register at `/candidate/register`
2. **Profiles are created automatically** with proper roles
3. **Login works without loops** 
4. **Role-based access control** functions properly
5. **No more 404 or database errors**

Your HR Portal authentication should now work smoothly! 🎉

## 🆘 **Troubleshooting:**

**If you still see errors:**
1. Check Supabase logs for any SQL errors
2. Verify all migrations ran successfully
3. Check browser console for specific error messages
4. Test with a fresh user registration

**Common issues:**
- **"relation does not exist"** → Run the schema.sql first
- **"permission denied"** → Check RLS policies are set up
- **"trigger not found"** → Run the fix migration script 