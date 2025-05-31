# Authentication System Deployment Guide

## Overview

This guide provides step-by-step instructions to deploy the HR Portal with a fully functional authentication system, proper user-profile linking, and live database connectivity.

## 🔧 Issues Fixed

### 1. Authentication System
- ✅ Removed all mock data dependencies
- ✅ Implemented real Supabase authentication
- ✅ Fixed infinite recursion in RLS policies
- ✅ Proper user-profile linking
- ✅ Real-time user management

### 2. Database Fixes
- ✅ Fixed RLS policies causing infinite recursion
- ✅ Simplified profile fetching
- ✅ Added proper error handling
- ✅ Created test user accounts

### 3. Component Updates
- ✅ Updated useAuth hook to work with real data
- ✅ Replaced MockAccountInfo with RealUserInfo
- ✅ Added proper error boundaries
- ✅ Implemented real user registration

## 🚀 Deployment Steps

### Step 1: Execute Database Fixes

**IMPORTANT:** You must execute the SQL fix in your Supabase SQL Editor to resolve authentication issues.

1. Open your Supabase Dashboard
2. Go to the SQL Editor
3. Execute the complete SQL script from `web/supabase/fix_auth_and_policies.sql`

The script will:
- Drop problematic RLS policies
- Create simple, non-recursive policies
- Add test user accounts
- Fix profile creation triggers
- Update permissions

### Step 2: Test User Accounts

After running the SQL script, you'll have these test accounts:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| admin@company.com | admin123 | admin | IT |
| hr@company.com | hr123 | hr | Human Resources |
| employee@company.com | employee123 | employee | Engineering |

### Step 3: Environment Variables

Ensure your environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tqtwdkobrzzrhrqdxprs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s
```

### Step 4: Build and Deploy

```bash
# Build the application
cd web
npm run build

# Deploy to your hosting platform
# The app is now ready for production
```

## 🔐 Authentication Features

### User Registration
- Real user account creation
- Automatic profile creation
- Email validation
- Proper error handling

### User Login
- Real Supabase authentication
- Session management
- Role-based access control
- Automatic redirects

### Profile Management
- Automatic profile linking
- Role assignment
- Department and position tracking
- Real-time updates

## 📋 Testing the Authentication

### 1. Test Login Flow
1. Visit `/login`
2. Use any of the test accounts
3. Verify successful authentication
4. Check role-based access

### 2. Test Registration Flow
1. Visit `/register`
2. Create a new account
3. Verify profile creation
4. Test login with new account

### 3. Test User Management
1. Login as admin
2. Visit user management pages
3. Verify real user data display
4. Test role assignments

## 🛠️ Key Changes Made

### Authentication Hook (`hooks/useAuth.ts`)
- Removed mock data dependencies
- Implemented real profile fetching
- Added proper error handling
- Fixed session management

### Database Policies
- Fixed infinite recursion in profiles table
- Simplified RLS policies
- Added proper role-based access
- Fixed profile creation triggers

### Components
- `RealUserInfo.tsx` - Displays real users from database
- Updated login page to use real users
- Added registration page
- Removed mock account dependencies

### Security
- Proper RLS policies
- Role-based access control
- Secure session management
- Protected routes

## 🚨 Important Notes

### Production Considerations
1. **Database Setup**: The SQL fix script MUST be executed before deployment
2. **Environment Variables**: Ensure all Supabase credentials are properly set
3. **HTTPS**: Use HTTPS in production for security
4. **Session Security**: Sessions are properly managed with secure tokens

### Monitoring
- Monitor Supabase logs for any policy errors
- Check authentication success rates
- Verify profile creation for new users
- Monitor RLS policy performance

## 📊 Expected Results

After deployment, you should see:

1. **Login Page**: Displays real users from database instead of mock data
2. **Registration**: Creates real user accounts with proper profiles
3. **Dashboard**: Shows user-specific data based on real authentication
4. **Role-Based Access**: Different UI/features based on user roles
5. **No More Errors**: No infinite recursion or policy errors

## 🔍 Troubleshooting

### Common Issues

**Issue**: "infinite recursion detected in policy for relation 'profiles'"
**Solution**: Execute the SQL fix script to replace problematic policies

**Issue**: Profile not found after login
**Solution**: Check if the profile creation trigger is working

**Issue**: Permission denied errors
**Solution**: Verify RLS policies and user roles

### Debugging Steps
1. Check Supabase logs in the dashboard
2. Verify environment variables
3. Test with provided test accounts
4. Check browser console for errors

## 🎉 Success Metrics

Your authentication system is working correctly when:
- ✅ Users can register and login successfully
- ✅ Profiles are automatically created and linked
- ✅ Role-based access control works
- ✅ No policy recursion errors in logs
- ✅ Real user data displays throughout the app
- ✅ Session management works properly

The HR Portal is now ready for production use with a fully functional authentication system! 