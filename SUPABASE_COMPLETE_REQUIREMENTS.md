# 🚀 Supabase Complete Requirements Guide

This guide will help you implement all the required Supabase configurations for the HR Portal application. Follow these steps to ensure your database is properly set up.

## 📋 **Requirements Overview**

The HR Portal requires the following database components:

1. **User Management**
   - Authentication with profiles
   - Role-based access control
   - User creation triggers

2. **Employee Management**
   - Departments
   - Skills and competencies
   - Employee-department relationships

3. **Leave Management**
   - Leave types
   - Leave requests
   - Leave balances

4. **Recruitment & Hiring**
   - Job postings
   - Applications
   - Interviews

5. **Training & Development**
   - Training courses
   - Course enrollments
   - Certifications

6. **Loan Management**
   - Loan programs
   - Loan applications
   - Repayment schedules

7. **Facilities Management**
   - Meeting rooms
   - Room bookings
   - Equipment inventory
   - Equipment bookings

8. **Request Panel System**
   - Request categories
   - Request types
   - Employee requests

9. **Compliance & Safety**
   - Safety incidents
   - Safety equipment checks

10. **Row Level Security**
    - Table permissions
    - Role-based policies

## 🔧 **Implementation Steps**

### Step 1: Connect to Supabase

1. Go to the [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `tqtwdkobrzzrhrqdxprs`
3. Navigate to the SQL Editor

### Step 2: Run the Migration Script

1. Copy the content from the migration file: `web/supabase/migrations/20250528000000_complete_requirements.sql`
2. Paste it into the SQL Editor
3. Run the script

This script will:
- Create all required tables if they don't exist
- Set up triggers and functions for user creation
- Configure Row Level Security (RLS) policies
- Insert sample data for common entities
- Set up proper relationships between tables

### Step 3: Verify the Schema

1. Copy the content from the verification script: `web/supabase/verify_schema.sql`
2. Paste it into a new SQL Editor tab
3. Run the script to check if all tables, triggers, and data exist

The verification script will show:
- Which tables are present/missing
- Whether triggers are properly configured
- If sample data was inserted correctly
- The status of RLS policies

### Step 4: Configure the Client Application

The application is already configured to use your Supabase instance:

```typescript
// In web/lib/supabase/client.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s'
```

### Step 5: Test User Authentication

1. Use the test accounts:
   - Admin: `admin@hrportal.com` / `HRPortal2024!`
   - HR Manager: `hr@hrportal.com` / `HRPortal2024!`
   - Manager: `manager@hrportal.com` / `HRPortal2024!`
   - Employee: `employee@hrportal.com` / `HRPortal2024!`
   - Recruiter: `recruiter@hrportal.com` / `HRPortal2024!`

2. Verify that each role has appropriate access to different parts of the application

## 🔍 **Schema Details**

### Core Tables

1. **profiles**
   - Linked to Supabase Auth users
   - Stores employee information
   - Contains role assignments

2. **departments**
   - Organizational structure
   - Department managers

3. **request_categories & request_types**
   - Categories: Time & Leave, Finance & Benefits, etc.
   - Types: Specific request forms with approval workflows

### Relationships

- **Employee → Department**: Many-to-one relationship
- **Employee → Manager**: Self-referencing relationship
- **Leave Request → Employee**: Many-to-one relationship
- **Application → Job**: Many-to-one relationship
- **Request → Request Type**: Many-to-one relationship

### Security Model

- **Public Access**: Minimal tables accessible to unauthenticated users
- **Employee Access**: Own profile and related data
- **Manager Access**: Team members' data
- **HR Access**: Most employee data
- **Admin Access**: Full system access

## 🔒 **Row Level Security (RLS)**

The migration sets up these key security policies:

1. **Profiles Visibility**
   - Basic profile info visible to all authenticated users
   - Sensitive fields restricted by role

2. **Self-Management**
   - Users can view and edit their own data
   - Cannot modify critical fields (role, etc.)

3. **Role-Based Access**
   - HR and Admin can view all profiles
   - Managers can view their team members' data

## 📊 **Sample Data**

The migration includes sample data for:

1. **Departments** (8 departments)
2. **Leave Types** (7 types)
3. **Loan Programs** (5 programs)
4. **Meeting Rooms** (7 rooms)
5. **Request Categories** (6 categories)
6. **Request Types** (27 types)

## 🚦 **Troubleshooting**

### Common Issues

1. **"relation does not exist" errors**
   - Check if the migration script ran completely
   - Verify table existence with `SELECT * FROM check_table_exists('table_name')`

2. **Authentication problems**
   - Verify trigger: `SELECT * FROM check_trigger_exists('on_auth_user_created', 'users')`
   - Check profiles: `SELECT * FROM profiles LIMIT 5`

3. **Missing sample data**
   - Run specific sample data insertion sections from the migration script

4. **Permission denied**
   - Check RLS policies: `SELECT * FROM pg_policies WHERE schemaname = 'public'`
   - Verify user role: `SELECT id, email, role FROM profiles WHERE email = 'your_email'`

## 📈 **Next Steps**

After implementation:

1. **Custom Data**: Add your organization-specific data
2. **Integration Testing**: Test all modules with the database
3. **Performance Tuning**: Add indexes for frequently queried columns
4. **Backup Strategy**: Set up regular database backups

## 🎉 **Success Criteria**

Your implementation is successful when:

- ✅ All tables are created
- ✅ Triggers are functioning
- ✅ Sample data is loaded
- ✅ RLS policies are active
- ✅ Authentication works for all test accounts
- ✅ Each role has appropriate access

## 📞 **Support**

If you encounter any issues:
1. Run the verification script to identify problems
2. Check Supabase logs for SQL errors
3. Verify environment variables in your application

---

With this guide, you can ensure your Supabase database is properly configured with all the requirements for the HR Portal application. 