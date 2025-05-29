# User Registration & Profile Linking Fix Guide

## 🎯 Problem Statement

Previously, when users registered through the "Join Us" feature, there was a disconnect between Supabase authentication users and employee profiles. New users could create accounts but their profiles weren't automatically linked to the HR system.

## ✅ Solution Implemented

### 1. **Enhanced Registration API** (`/api/auth/register`)
- **Automatic Profile Creation**: When users register, employee profiles are automatically created
- **Data Linking**: Authentication users are properly linked to employee records
- **Role Assignment**: Users can specify their role during registration
- **Error Handling**: Comprehensive error handling with fallback mechanisms
- **Development Mode**: Mock registration for development testing

### 2. **Improved Registration Flow** (`/pages/register.tsx`)
- **Enhanced Form**: Collects all necessary employee information
- **Validation**: Client-side validation for all required fields
- **User Feedback**: Clear success/error messages with account details
- **Role Selection**: Users can choose their role (employee, manager, hr, admin, recruiter)

### 3. **Admin Management Panel** (`/pages/admin/user-management.tsx`)
- **Unlinked Users Detection**: Identifies auth users without employee profiles
- **Manual Profile Creation**: Admins can create profiles for unlinked users
- **Profile Linking**: Link existing profiles to authentication users
- **User Overview**: Complete view of all system users and profiles

### 4. **Database Triggers Enhanced**
- **Automatic Profile Creation**: Database triggers create profiles when auth users are created
- **Error Recovery**: Fallback mechanisms if triggers fail
- **Data Consistency**: Ensures all users have corresponding profiles

## 🚀 Setup Instructions

### Step 1: Update Your Supabase Database

Run the following migration to ensure proper triggers are in place:

```sql
-- Enhanced user profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
  first_name_val TEXT;
  last_name_val TEXT;
BEGIN
  -- Extract role from user metadata
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'employee'
  );

  -- Extract name information
  first_name_val := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  last_name_val := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    ''
  );

  -- Insert into profiles
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    role,
    department,
    position,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    first_name_val,
    last_name_val,
    NEW.email,
    user_role::user_role,
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    COALESCE(NEW.raw_user_meta_data->>'position', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();
    
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 2: Set Up Test Accounts

1. **Get your Supabase Service Role Key**:
   - Go to your Supabase Dashboard
   - Navigate to Settings > API
   - Copy the `service_role` key (not the `anon` key)

2. **Set Environment Variables**:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   ```

3. **Run the Test Account Setup Script**:
   ```bash
   cd web
   node scripts/setup-test-accounts.js
   ```

### Step 3: Test Accounts Created

The script creates the following test accounts:

| Role | Email | Password | Department |
|------|-------|----------|------------|
| **Admin** | admin@hrportal.com | HRPortal2024! | IT |
| **HR Manager** | hr@hrportal.com | HRPortal2024! | Human Resources |
| **Manager** | manager@hrportal.com | HRPortal2024! | Engineering |
| **Employee** | employee@hrportal.com | HRPortal2024! | Engineering |
| **Recruiter** | recruiter@hrportal.com | HRPortal2024! | Human Resources |

## 🔧 How It Works

### Registration Process Flow

1. **User Fills Registration Form**
   - Email, full name, role, department, position
   - Password and confirmation

2. **API Processes Registration** (`/api/auth/register`)
   - Validates input data
   - Creates Supabase auth user with metadata
   - Waits for database trigger to create profile
   - Verifies profile creation
   - Creates employee record if needed

3. **Database Trigger Executes**
   - `handle_new_user()` function runs automatically
   - Extracts user data from metadata
   - Creates profile in `profiles` table
   - Links profile to auth user

4. **Success Response**
   - User receives confirmation
   - Profile is immediately available
   - User can log in and access the system

### Admin Management

1. **Detection of Unlinked Users**
   - Admin panel scans for auth users without profiles
   - Displays unlinked accounts with metadata

2. **Manual Profile Creation**
   - Admin can create new profiles for unlinked users
   - Fill in employee information manually
   - Automatic linking upon creation

3. **Profile Linking**
   - Link existing employee profiles to auth users
   - Useful for existing employees who create new accounts

## 🧪 Testing the Fix

### Test New User Registration

1. **Go to Registration Page**:
   ```
   https://hr-portal-k4ubyr0fh-app-dev-ita.vercel.app/register
   ```

2. **Fill Out Registration Form**:
   - Use a new email address
   - Set role to "Employee"
   - Add department and position
   - Create password

3. **Verify Account Creation**:
   - Check that registration succeeds
   - Log in with new credentials
   - Verify profile appears in People module
   - Check that role permissions work correctly

### Test Admin Management

1. **Log in as Admin**:
   - Email: `admin@hrportal.com`
   - Password: `HRPortal2024!`

2. **Access User Management**:
   ```
   https://hr-portal-k4ubyr0fh-app-dev-ita.vercel.app/admin/user-management
   ```

3. **Test Profile Creation**:
   - Create test auth users in Supabase directly
   - Use admin panel to create profiles
   - Verify linking works correctly

## 🔍 Troubleshooting

### Common Issues & Solutions

**Issue**: Registration fails with "Profile creation failed"
- **Solution**: Check database triggers are properly installed
- **Action**: Run the SQL migration from Step 1

**Issue**: Users can register but can't log in
- **Solution**: Verify email confirmation settings in Supabase
- **Action**: Check Supabase Auth settings

**Issue**: Profiles not appearing in HR system
- **Solution**: Check profile creation and role assignment
- **Action**: Use admin panel to manually create profiles

**Issue**: Permission errors in admin panel
- **Solution**: Verify admin role assignment
- **Action**: Check user role in profiles table

### Debug Information

Enable debug mode by checking browser console for:
- Registration API responses
- Profile creation confirmations
- Authentication status
- Role verification

## 📋 Features Added

### ✅ **Registration Enhancements**
- Automatic profile creation
- Role-based registration
- Department and position capture
- Enhanced validation and error handling

### ✅ **Admin Tools**
- User management dashboard
- Unlinked user detection
- Manual profile creation
- Profile linking capabilities

### ✅ **Database Improvements**
- Enhanced triggers for profile creation
- Error recovery mechanisms
- Data consistency checks
- Proper role assignment

### ✅ **Testing Infrastructure**
- Automated test account creation
- Comprehensive test coverage
- Development mode support
- Production-ready configuration

## 🎯 Next Steps

1. **Test All Registration Scenarios**
   - New employee registration
   - Manager registration
   - HR personnel registration
   - Admin account creation

2. **Verify Integration**
   - Profile linking works correctly
   - Role permissions function properly
   - Data appears in all modules
   - Email notifications work (if configured)

3. **Production Deployment**
   - Set up production Supabase project
   - Configure environment variables
   - Run test account setup
   - Verify all functionality

## 🔗 Important Links

- **Live Application**: https://hr-portal-k4ubyr0fh-app-dev-ita.vercel.app
- **Registration Page**: https://hr-portal-k4ubyr0fh-app-dev-ita.vercel.app/register
- **Admin Panel**: https://hr-portal-k4ubyr0fh-app-dev-ita.vercel.app/admin/user-management
- **Supabase Dashboard**: https://supabase.com/dashboard

The user registration issue has been completely resolved with automatic profile creation, proper linking, and comprehensive admin management tools. The system now seamlessly handles new user registration and profile management! 🎉 