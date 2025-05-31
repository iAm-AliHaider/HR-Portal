-- Supabase Schema Verification Script
-- Run this to verify if all required tables exist in your database

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT) 
RETURNS TABLE(exists BOOLEAN, message TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = check_table_exists.table_name
        ),
        CASE 
            WHEN EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = check_table_exists.table_name
            ) THEN 'Table "' || check_table_exists.table_name || '" exists ✅'
            ELSE 'Table "' || check_table_exists.table_name || '" is missing ❌'
        END;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a trigger exists
CREATE OR REPLACE FUNCTION check_trigger_exists(trigger_name TEXT, table_name TEXT) 
RETURNS TABLE(exists BOOLEAN, message TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS (
            SELECT FROM information_schema.triggers
            WHERE trigger_name = check_trigger_exists.trigger_name
            AND event_object_table = check_trigger_exists.table_name
        ),
        CASE 
            WHEN EXISTS (
                SELECT FROM information_schema.triggers
                WHERE trigger_name = check_trigger_exists.trigger_name
                AND event_object_table = check_trigger_exists.table_name
            ) THEN 'Trigger "' || check_trigger_exists.trigger_name || '" on "' || check_trigger_exists.table_name || '" exists ✅'
            ELSE 'Trigger "' || check_trigger_exists.trigger_name || '" on "' || check_trigger_exists.table_name || '" is missing ❌'
        END;
END;
$$ LANGUAGE plpgsql;

-- Table verification
SELECT * FROM check_table_exists('profiles');
SELECT * FROM check_table_exists('departments');
SELECT * FROM check_table_exists('skills');
SELECT * FROM check_table_exists('employee_skills');
SELECT * FROM check_table_exists('leave_types');
SELECT * FROM check_table_exists('leave_balances');
SELECT * FROM check_table_exists('leave_requests');
SELECT * FROM check_table_exists('training_courses');
SELECT * FROM check_table_exists('course_enrollments');
SELECT * FROM check_table_exists('jobs');
SELECT * FROM check_table_exists('applications');
SELECT * FROM check_table_exists('interviews');
SELECT * FROM check_table_exists('loan_programs');
SELECT * FROM check_table_exists('loan_applications');
SELECT * FROM check_table_exists('loan_repayments');
SELECT * FROM check_table_exists('meeting_rooms');
SELECT * FROM check_table_exists('room_bookings');
SELECT * FROM check_table_exists('equipment_inventory');
SELECT * FROM check_table_exists('equipment_bookings');
SELECT * FROM check_table_exists('request_categories');
SELECT * FROM check_table_exists('request_types');
SELECT * FROM check_table_exists('requests');
SELECT * FROM check_table_exists('safety_incidents');
SELECT * FROM check_table_exists('safety_equipment_checks');

-- Trigger verification
SELECT * FROM check_trigger_exists('on_auth_user_created', 'users');
SELECT * FROM check_trigger_exists('tr_assign_department_manager', 'departments');

-- Check profiles count
SELECT COUNT(*) AS profile_count, 
       CASE 
         WHEN COUNT(*) > 0 THEN 'Profiles exist ✅' 
         ELSE 'No profiles found ❌'
       END AS status
FROM profiles;

-- Check request categories count
SELECT COUNT(*) AS category_count, 
       CASE 
         WHEN COUNT(*) > 0 THEN 'Request categories exist ✅' 
         ELSE 'No request categories found ❌'
       END AS status
FROM request_categories;

-- Check department count
SELECT COUNT(*) AS department_count, 
       CASE 
         WHEN COUNT(*) > 0 THEN 'Departments exist ✅' 
         ELSE 'No departments found ❌'
       END AS status
FROM departments;

-- Table row counts
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL SELECT 'departments', COUNT(*) FROM departments
UNION ALL SELECT 'leave_types', COUNT(*) FROM leave_types
UNION ALL SELECT 'loan_programs', COUNT(*) FROM loan_programs
UNION ALL SELECT 'request_categories', COUNT(*) FROM request_categories
UNION ALL SELECT 'request_types', COUNT(*) FROM request_types
UNION ALL SELECT 'meeting_rooms', COUNT(*) FROM meeting_rooms
ORDER BY table_name;

-- Check RLS policies on profiles table
SELECT table_name, policy_name 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check for auth user trigger
SELECT tgname AS trigger_name, 
       relname AS table_name, 
       proname AS function_name
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgname = 'on_auth_user_created'; 