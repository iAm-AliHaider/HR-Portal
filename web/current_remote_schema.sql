

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."application_status" AS ENUM (
    'pending',
    'under_review',
    'interview_scheduled',
    'rejected',
    'offer_extended',
    'hired'
);


ALTER TYPE "public"."application_status" OWNER TO "postgres";


CREATE TYPE "public"."expense_status" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE "public"."expense_status" OWNER TO "postgres";


CREATE TYPE "public"."interview_status" AS ENUM (
    'scheduled',
    'completed',
    'cancelled',
    'rescheduled'
);


ALTER TYPE "public"."interview_status" OWNER TO "postgres";


CREATE TYPE "public"."job_status" AS ENUM (
    'open',
    'closed',
    'draft',
    'archived'
);


ALTER TYPE "public"."job_status" OWNER TO "postgres";


CREATE TYPE "public"."leave_status" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE "public"."leave_status" OWNER TO "postgres";


CREATE TYPE "public"."offer_status" AS ENUM (
    'draft',
    'sent',
    'accepted',
    'rejected',
    'negotiating',
    'expired'
);


ALTER TYPE "public"."offer_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'hr',
    'manager',
    'employee',
    'recruiter'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."assign_department_manager"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Find a random HR person to be the manager
  UPDATE public.departments
  SET manager_id = (
    SELECT id FROM public.profiles
    WHERE role = 'hr'
    ORDER BY RANDOM()
    LIMIT 1
  )
  WHERE id = NEW.id AND NEW.manager_id IS NULL;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."assign_department_manager"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"("user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'employee');
END;
$$;


ALTER FUNCTION "public"."get_user_role"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Check if profile already exists to prevent duplicates
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (
      id, 
      email, 
      name, 
      role,
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
      ),
      COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
      NOW(),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_applications_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE jobs
  SET applications_count = applications_count + 1
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."increment_applications_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."applications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "job_id" "uuid",
    "candidate_name" "text" NOT NULL,
    "candidate_email" "text" NOT NULL,
    "resume_url" "text",
    "cover_letter" "text",
    "status" "public"."application_status" DEFAULT 'pending'::"public"."application_status" NOT NULL,
    "experience_years" integer,
    "current_company" "text",
    "notes" "text",
    "applied_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reviewed_by" "uuid"
);


ALTER TABLE "public"."applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audits" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "requirement_id" "uuid",
    "auditor" "text" NOT NULL,
    "status" "text" NOT NULL,
    "findings" "text",
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."audits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_settings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "industry" "text",
    "size" "text",
    "address" "text",
    "phone" "text",
    "email" "text",
    "website" "text",
    "description" "text",
    "logo_url" "text",
    "timezone" "text" DEFAULT 'UTC'::"text" NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "date_format" "text" DEFAULT 'MM/DD/YYYY'::"text" NOT NULL,
    "working_days" "text"[] DEFAULT ARRAY['Monday'::"text", 'Tuesday'::"text", 'Wednesday'::"text", 'Thursday'::"text", 'Friday'::"text"],
    "working_hours_start" "text" DEFAULT '09:00'::"text",
    "working_hours_end" "text" DEFAULT '17:00'::"text",
    "leave_policy" "jsonb",
    "probation_period_months" integer DEFAULT 3,
    "notice_period_days" integer DEFAULT 30,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."company_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."compliance_requirements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "description" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "responsible_person" "text",
    "priority" "text" NOT NULL,
    "last_review" timestamp with time zone,
    "next_review" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."compliance_requirements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_enrollments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "course_id" "uuid",
    "employee_id" "uuid",
    "status" "text" DEFAULT 'enrolled'::"text" NOT NULL,
    "enrolled_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "completion_score" numeric,
    "feedback" "text"
);


ALTER TABLE "public"."course_enrollments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dashboard_analytics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "total_employees" integer,
    "active_leave_requests" integer,
    "training_completion" integer,
    "open_positions" integer,
    "department_distribution" "jsonb",
    "monthly_recruitment" "jsonb",
    "leave_analytics" "jsonb",
    "performance_analytics" "jsonb",
    "training_analytics" "jsonb",
    "retention_analytics" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."dashboard_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."departments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "manager_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."departments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_skills" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "employee_id" "uuid",
    "skill_id" "uuid",
    "proficiency_level" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "employee_skills_proficiency_level_check" CHECK ((("proficiency_level" >= 1) AND ("proficiency_level" <= 5)))
);


ALTER TABLE "public"."employee_skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "profile_id" "uuid",
    "employee_id" "text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "salary" numeric,
    "location" "text",
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "employment_type" "text" NOT NULL,
    "emergency_contact_name" "text",
    "emergency_contact_phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."employees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_bookings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "equipment_id" "uuid",
    "employee_id" "uuid",
    "purpose" "text",
    "checkout_time" timestamp with time zone NOT NULL,
    "expected_return_time" timestamp with time zone NOT NULL,
    "actual_return_time" timestamp with time zone,
    "status" "text" DEFAULT 'booked'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "equipment_bookings_status_check" CHECK (("status" = ANY (ARRAY['booked'::"text", 'checked-out'::"text", 'returned'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."equipment_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_inspections" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "equipment_name" "text" NOT NULL,
    "inspection_type" "text" NOT NULL,
    "last_inspection" "date" NOT NULL,
    "next_due_date" "date" NOT NULL,
    "status" "text" NOT NULL,
    "assigned_to" "text" NOT NULL,
    "location" "text" NOT NULL,
    "notes" "text",
    "attachments" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."equipment_inspections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_inventory" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text",
    "serial_number" "text",
    "purchase_date" "date",
    "condition" "text" DEFAULT 'good'::"text",
    "location" "text",
    "assigned_to" "uuid",
    "status" "text" DEFAULT 'available'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "equipment_inventory_condition_check" CHECK (("condition" = ANY (ARRAY['excellent'::"text", 'good'::"text", 'fair'::"text", 'poor'::"text"]))),
    CONSTRAINT "equipment_inventory_status_check" CHECK (("status" = ANY (ARRAY['available'::"text", 'in-use'::"text", 'maintenance'::"text", 'retired'::"text"])))
);


ALTER TABLE "public"."equipment_inventory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "employee_id" "uuid",
    "category" "text" NOT NULL,
    "amount" numeric NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "description" "text" NOT NULL,
    "date" "date" NOT NULL,
    "status" "public"."expense_status" DEFAULT 'pending'::"public"."expense_status" NOT NULL,
    "receipt_url" "text",
    "submitted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approved_at" timestamp with time zone,
    "rejected_at" timestamp with time zone,
    "rejection_reason" "text",
    "approver_id" "uuid"
);


ALTER TABLE "public"."expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."interviews" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "application_id" "uuid",
    "interviewer_id" "uuid",
    "candidate_name" "text" NOT NULL,
    "candidate_email" "text" NOT NULL,
    "position" "text" NOT NULL,
    "job_id" "uuid",
    "stage" "text" NOT NULL,
    "type" "text" NOT NULL,
    "scheduled_at" timestamp with time zone NOT NULL,
    "duration" integer NOT NULL,
    "location" "text" NOT NULL,
    "notes" "text",
    "status" "public"."interview_status" DEFAULT 'scheduled'::"public"."interview_status" NOT NULL,
    "feedback" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."interviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "department" "text" NOT NULL,
    "location" "text" NOT NULL,
    "type" "text" NOT NULL,
    "status" "public"."job_status" DEFAULT 'draft'::"public"."job_status" NOT NULL,
    "description" "text" NOT NULL,
    "requirements" "text",
    "salary_range" "text",
    "benefits" "text",
    "applications_count" integer DEFAULT 0,
    "posted_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "closing_date" "date",
    "closed_at" timestamp with time zone
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leave_balances" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "employee_id" "uuid",
    "leave_type_id" "uuid",
    "year" integer NOT NULL,
    "allocated_days" numeric(5,1) NOT NULL,
    "used_days" numeric(5,1) DEFAULT 0,
    "pending_days" numeric(5,1) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."leave_balances" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leave_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "employee_id" "uuid",
    "type" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "days" integer NOT NULL,
    "status" "public"."leave_status" DEFAULT 'pending'::"public"."leave_status" NOT NULL,
    "reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approved_at" timestamp with time zone,
    "rejected_at" timestamp with time zone,
    "rejection_reason" "text",
    "manager_id" "uuid"
);


ALTER TABLE "public"."leave_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leave_types" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "default_days" integer DEFAULT 0,
    "requires_approval" boolean DEFAULT true,
    "color" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."leave_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loan_applications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "employee_id" "uuid",
    "program_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "term_months" integer NOT NULL,
    "purpose" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "approval_date" timestamp with time zone,
    "approver_id" "uuid",
    "rejection_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "loan_applications_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text", 'disbursed'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."loan_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loan_programs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "max_amount" numeric(10,2) NOT NULL,
    "interest_rate" numeric(5,2) NOT NULL,
    "max_term_months" integer NOT NULL,
    "minimum_service_months" integer DEFAULT 0,
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "loan_programs_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text"])))
);


ALTER TABLE "public"."loan_programs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loan_repayments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "loan_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "due_date" "date" NOT NULL,
    "payment_date" "date",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "loan_repayments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'overdue'::"text", 'waived'::"text"])))
);


ALTER TABLE "public"."loan_repayments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meeting_rooms" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "location" "text",
    "capacity" integer NOT NULL,
    "features" "text"[],
    "status" "text" DEFAULT 'available'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "meeting_rooms_status_check" CHECK (("status" = ANY (ARRAY['available'::"text", 'unavailable'::"text", 'maintenance'::"text"])))
);


ALTER TABLE "public"."meeting_rooms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" "text" NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "link" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."offers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "application_id" "uuid",
    "candidate_name" "text" NOT NULL,
    "candidate_email" "text" NOT NULL,
    "position" "text" NOT NULL,
    "department" "text" NOT NULL,
    "job_id" "uuid",
    "salary" numeric NOT NULL,
    "equity" "text",
    "bonus" numeric,
    "benefits" "jsonb",
    "start_date" "date" NOT NULL,
    "expiration_date" "date" NOT NULL,
    "status" "public"."offer_status" DEFAULT 'draft'::"public"."offer_status" NOT NULL,
    "contract_type" "text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "accepted_at" timestamp with time zone,
    "rejected_at" timestamp with time zone,
    "rejection_reason" "text",
    "created_by" "uuid"
);


ALTER TABLE "public"."offers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."performance_reviews" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "employee_id" "uuid",
    "reviewer_id" "uuid",
    "period" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "overall_rating" numeric,
    "goals_met" numeric,
    "strengths" "text",
    "areas_for_improvement" "text",
    "comments" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "next_review" "date"
);


ALTER TABLE "public"."performance_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "avatar_url" "text",
    "email" "text" NOT NULL,
    "phone" "text",
    "role" "public"."user_role" DEFAULT 'employee'::"public"."user_role" NOT NULL,
    "department" "text",
    "position" "text",
    "manager_id" "uuid",
    "hire_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."request_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "sort_order" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."request_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."request_types" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "form_schema" "jsonb",
    "requires_approval" boolean DEFAULT true,
    "approver_role" "text"[],
    "sla_hours" integer,
    "icon" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."request_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "request_type_id" "uuid",
    "employee_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "form_data" "jsonb",
    "status" "text" DEFAULT 'pending'::"text",
    "priority" "text" DEFAULT 'normal'::"text",
    "assignee_id" "uuid",
    "approver_id" "uuid",
    "resolved_at" timestamp with time zone,
    "resolution_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "requests_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'normal'::"text", 'high'::"text", 'urgent'::"text"]))),
    CONSTRAINT "requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in-progress'::"text", 'approved'::"text", 'rejected'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_bookings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "room_id" "uuid",
    "employee_id" "uuid",
    "title" "text" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "attendees" "text"[],
    "status" "text" DEFAULT 'confirmed'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "room_bookings_status_check" CHECK (("status" = ANY (ARRAY['confirmed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."room_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."safety_check_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "check_id" "uuid",
    "description" "text" NOT NULL,
    "status" "text" DEFAULT 'Pending'::"text" NOT NULL,
    "comments" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."safety_check_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."safety_checks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "due_date" "date" NOT NULL,
    "status" "text" DEFAULT 'Scheduled'::"text" NOT NULL,
    "assigned_to" "text" NOT NULL,
    "location" "text" NOT NULL,
    "frequency" "text" NOT NULL,
    "last_completed" "date",
    "notes" "text",
    "priority" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."safety_checks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."safety_equipment_checks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "equipment_name" "text" NOT NULL,
    "location" "text",
    "inspector_id" "uuid",
    "check_date" timestamp with time zone NOT NULL,
    "status" "text",
    "notes" "text",
    "next_check_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "safety_equipment_checks_status_check" CHECK (("status" = ANY (ARRAY['passed'::"text", 'failed'::"text", 'maintenance-required'::"text"])))
);


ALTER TABLE "public"."safety_equipment_checks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."safety_incidents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "location" "text" NOT NULL,
    "reported_by" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "status" "text" DEFAULT 'Reported'::"text" NOT NULL,
    "type" "text" NOT NULL,
    "injury_type" "text",
    "medical_attention" "text",
    "witnesses" "text"[],
    "follow_up_actions" "text",
    "resolution_date" "date",
    "attachments" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."safety_incidents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skills" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_courses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "category" "text" NOT NULL,
    "description" "text" NOT NULL,
    "duration" "text" NOT NULL,
    "instructor" "text",
    "capacity" integer,
    "enrolled" integer DEFAULT 0,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "price" numeric,
    "location" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid"
);


ALTER TABLE "public"."training_courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workflow_instances" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "workflow_id" "uuid",
    "status" "text" DEFAULT 'running'::"text" NOT NULL,
    "context_data" "jsonb",
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workflow_instances" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workflows" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "steps" integer NOT NULL,
    "trigger" "text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workflows" OWNER TO "postgres";


ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audits"
    ADD CONSTRAINT "audits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_settings"
    ADD CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."compliance_requirements"
    ADD CONSTRAINT "compliance_requirements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."course_enrollments"
    ADD CONSTRAINT "course_enrollments_course_id_employee_id_key" UNIQUE ("course_id", "employee_id");



ALTER TABLE ONLY "public"."course_enrollments"
    ADD CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dashboard_analytics"
    ADD CONSTRAINT "dashboard_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_skills"
    ADD CONSTRAINT "employee_skills_employee_id_skill_id_key" UNIQUE ("employee_id", "skill_id");



ALTER TABLE ONLY "public"."employee_skills"
    ADD CONSTRAINT "employee_skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_employee_id_key" UNIQUE ("employee_id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_bookings"
    ADD CONSTRAINT "equipment_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_inspections"
    ADD CONSTRAINT "equipment_inspections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_inventory"
    ADD CONSTRAINT "equipment_inventory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."interviews"
    ADD CONSTRAINT "interviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leave_balances"
    ADD CONSTRAINT "leave_balances_employee_id_leave_type_id_year_key" UNIQUE ("employee_id", "leave_type_id", "year");



ALTER TABLE ONLY "public"."leave_balances"
    ADD CONSTRAINT "leave_balances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leave_requests"
    ADD CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leave_types"
    ADD CONSTRAINT "leave_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."leave_types"
    ADD CONSTRAINT "leave_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loan_applications"
    ADD CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loan_programs"
    ADD CONSTRAINT "loan_programs_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."loan_programs"
    ADD CONSTRAINT "loan_programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loan_repayments"
    ADD CONSTRAINT "loan_repayments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meeting_rooms"
    ADD CONSTRAINT "meeting_rooms_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."meeting_rooms"
    ADD CONSTRAINT "meeting_rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."performance_reviews"
    ADD CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."request_categories"
    ADD CONSTRAINT "request_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."request_categories"
    ADD CONSTRAINT "request_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."request_types"
    ADD CONSTRAINT "request_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."room_bookings"
    ADD CONSTRAINT "room_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."safety_check_items"
    ADD CONSTRAINT "safety_check_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."safety_checks"
    ADD CONSTRAINT "safety_checks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."safety_equipment_checks"
    ADD CONSTRAINT "safety_equipment_checks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."safety_incidents"
    ADD CONSTRAINT "safety_incidents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_courses"
    ADD CONSTRAINT "training_courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workflow_instances"
    ADD CONSTRAINT "workflow_instances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workflows"
    ADD CONSTRAINT "workflows_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_applications_candidate_email" ON "public"."applications" USING "btree" ("candidate_email");



CREATE INDEX "idx_applications_job_id" ON "public"."applications" USING "btree" ("job_id");



CREATE INDEX "idx_jobs_status" ON "public"."jobs" USING "btree" ("status");



CREATE INDEX "idx_leave_requests_employee" ON "public"."leave_requests" USING "btree" ("employee_id");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_role" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "idx_requests_employee" ON "public"."requests" USING "btree" ("employee_id");



CREATE OR REPLACE TRIGGER "increment_job_applications_count" AFTER INSERT ON "public"."applications" FOR EACH ROW EXECUTE FUNCTION "public"."increment_applications_count"();



CREATE OR REPLACE TRIGGER "tr_assign_department_manager" AFTER INSERT ON "public"."departments" FOR EACH ROW EXECUTE FUNCTION "public"."assign_department_manager"();



CREATE OR REPLACE TRIGGER "update_employees_updated_at" BEFORE UPDATE ON "public"."employees" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_jobs_updated_at" BEFORE UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."audits"
    ADD CONSTRAINT "audits_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "public"."compliance_requirements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_enrollments"
    ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."training_courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_enrollments"
    ADD CONSTRAINT "course_enrollments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."employee_skills"
    ADD CONSTRAINT "employee_skills_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."employee_skills"
    ADD CONSTRAINT "employee_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."equipment_bookings"
    ADD CONSTRAINT "equipment_bookings_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."equipment_bookings"
    ADD CONSTRAINT "equipment_bookings_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment_inventory"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."equipment_inventory"
    ADD CONSTRAINT "equipment_inventory_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."interviews"
    ADD CONSTRAINT "interviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."interviews"
    ADD CONSTRAINT "interviews_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."interviews"
    ADD CONSTRAINT "interviews_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_posted_by_fkey" FOREIGN KEY ("posted_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."leave_balances"
    ADD CONSTRAINT "leave_balances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leave_balances"
    ADD CONSTRAINT "leave_balances_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leave_requests"
    ADD CONSTRAINT "leave_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leave_requests"
    ADD CONSTRAINT "leave_requests_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."loan_applications"
    ADD CONSTRAINT "loan_applications_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."loan_applications"
    ADD CONSTRAINT "loan_applications_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."loan_applications"
    ADD CONSTRAINT "loan_applications_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."loan_programs"("id");



ALTER TABLE ONLY "public"."loan_repayments"
    ADD CONSTRAINT "loan_repayments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "public"."loan_applications"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id");



ALTER TABLE ONLY "public"."performance_reviews"
    ADD CONSTRAINT "performance_reviews_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."performance_reviews"
    ADD CONSTRAINT "performance_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."request_types"
    ADD CONSTRAINT "request_types_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."request_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_request_type_id_fkey" FOREIGN KEY ("request_type_id") REFERENCES "public"."request_types"("id");



ALTER TABLE ONLY "public"."room_bookings"
    ADD CONSTRAINT "room_bookings_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."room_bookings"
    ADD CONSTRAINT "room_bookings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."meeting_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."safety_check_items"
    ADD CONSTRAINT "safety_check_items_check_id_fkey" FOREIGN KEY ("check_id") REFERENCES "public"."safety_checks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."safety_equipment_checks"
    ADD CONSTRAINT "safety_equipment_checks_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."training_courses"
    ADD CONSTRAINT "training_courses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."workflow_instances"
    ADD CONSTRAINT "workflow_instances_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workflows"
    ADD CONSTRAINT "workflows_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



CREATE POLICY "Admin and HR can manage request types" ON "public"."request_types" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ((("users"."raw_user_meta_data" ->> 'role'::"text") = 'admin'::"text") OR (("users"."raw_user_meta_data" ->> 'role'::"text") = 'hr'::"text"))))));



CREATE POLICY "Admin, HR, and managers can update requests" ON "public"."requests" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ((("users"."raw_user_meta_data" ->> 'role'::"text") = 'admin'::"text") OR (("users"."raw_user_meta_data" ->> 'role'::"text") = 'hr'::"text") OR (("users"."raw_user_meta_data" ->> 'role'::"text") = 'manager'::"text"))))));



CREATE POLICY "Admin, HR, and managers can view all requests" ON "public"."requests" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ((("users"."raw_user_meta_data" ->> 'role'::"text") = 'admin'::"text") OR (("users"."raw_user_meta_data" ->> 'role'::"text") = 'hr'::"text") OR (("users"."raw_user_meta_data" ->> 'role'::"text") = 'manager'::"text"))))));



CREATE POLICY "Allow profile creation" ON "public"."profiles" FOR INSERT WITH CHECK ((("auth"."uid"() = "id") OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "Authenticated users can view basic profiles" ON "public"."profiles" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") AND (("id" = "auth"."uid"()) OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text", 'manager'::"text"])))));



CREATE POLICY "Authenticated users can view departments" ON "public"."departments" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view leave types" ON "public"."leave_types" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view loan programs" ON "public"."loan_programs" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view request categories" ON "public"."request_categories" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view request types" ON "public"."request_types" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view training courses" ON "public"."training_courses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Departments manageable by admin and hr" ON "public"."departments" USING (((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text"])));



CREATE POLICY "Departments viewable by authenticated users" ON "public"."departments" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Employee can create leave requests" ON "public"."leave_requests" FOR INSERT WITH CHECK (("employee_id" = "auth"."uid"()));



CREATE POLICY "Employee can create loan applications" ON "public"."loan_applications" FOR INSERT WITH CHECK (("employee_id" = "auth"."uid"()));



CREATE POLICY "Employee can create requests" ON "public"."requests" FOR INSERT WITH CHECK (("employee_id" = "auth"."uid"()));



CREATE POLICY "Employee can enroll in courses" ON "public"."course_enrollments" FOR INSERT WITH CHECK (("employee_id" = "auth"."uid"()));



CREATE POLICY "Employee can update own leave requests" ON "public"."leave_requests" FOR UPDATE USING ((("employee_id" = "auth"."uid"()) OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text", 'manager'::"text"]))));



CREATE POLICY "Employee can update own requests" ON "public"."requests" FOR UPDATE USING ((("employee_id" = "auth"."uid"()) OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text", 'manager'::"text"]))));



CREATE POLICY "Employee course enrollments" ON "public"."course_enrollments" FOR SELECT USING ((("employee_id" = "auth"."uid"()) OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text"]))));



CREATE POLICY "Employee leave requests" ON "public"."leave_requests" FOR SELECT USING ((("employee_id" = "auth"."uid"()) OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text", 'manager'::"text"]))));



CREATE POLICY "Employee loan applications" ON "public"."loan_applications" FOR SELECT USING ((("employee_id" = "auth"."uid"()) OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text", 'finance'::"text"]))));



CREATE POLICY "Employee requests" ON "public"."requests" FOR SELECT USING ((("employee_id" = "auth"."uid"()) OR ((("current_setting"('request.jwt.claims'::"text", true))::"json" ->> 'role'::"text") = ANY (ARRAY['admin'::"text", 'hr'::"text", 'manager'::"text"]))));



CREATE POLICY "Request types are viewable by everyone" ON "public"."request_types" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own requests" ON "public"."requests" FOR INSERT WITH CHECK (("auth"."uid"() = "employee_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own requests" ON "public"."requests" FOR SELECT USING (("auth"."uid"() = "employee_id"));



ALTER TABLE "public"."applications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "applications_insert_all" ON "public"."applications" FOR INSERT WITH CHECK (true);



CREATE POLICY "applications_select_own" ON "public"."applications" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") OR ("candidate_email" = "auth"."email"())));



ALTER TABLE "public"."audits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."compliance_requirements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_enrollments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."dashboard_analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employee_skills" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_inspections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_inventory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expenses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."interviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "jobs_insert_authenticated" ON "public"."jobs" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "jobs_select_all" ON "public"."jobs" FOR SELECT USING (true);



CREATE POLICY "jobs_update_authenticated" ON "public"."jobs" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



ALTER TABLE "public"."leave_balances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leave_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leave_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."loan_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."loan_programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."loan_repayments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meeting_rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."offers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."performance_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."request_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."safety_check_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."safety_checks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."safety_equipment_checks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."safety_incidents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."skills" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workflow_instances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workflows" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."assign_department_manager"() TO "anon";
GRANT ALL ON FUNCTION "public"."assign_department_manager"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_department_manager"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_applications_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."increment_applications_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_applications_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."applications" TO "anon";
GRANT ALL ON TABLE "public"."applications" TO "authenticated";
GRANT ALL ON TABLE "public"."applications" TO "service_role";



GRANT ALL ON TABLE "public"."audits" TO "anon";
GRANT ALL ON TABLE "public"."audits" TO "authenticated";
GRANT ALL ON TABLE "public"."audits" TO "service_role";



GRANT ALL ON TABLE "public"."company_settings" TO "anon";
GRANT ALL ON TABLE "public"."company_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."company_settings" TO "service_role";



GRANT ALL ON TABLE "public"."compliance_requirements" TO "anon";
GRANT ALL ON TABLE "public"."compliance_requirements" TO "authenticated";
GRANT ALL ON TABLE "public"."compliance_requirements" TO "service_role";



GRANT ALL ON TABLE "public"."course_enrollments" TO "anon";
GRANT ALL ON TABLE "public"."course_enrollments" TO "authenticated";
GRANT ALL ON TABLE "public"."course_enrollments" TO "service_role";



GRANT ALL ON TABLE "public"."dashboard_analytics" TO "anon";
GRANT ALL ON TABLE "public"."dashboard_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."dashboard_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."departments" TO "anon";
GRANT ALL ON TABLE "public"."departments" TO "authenticated";
GRANT ALL ON TABLE "public"."departments" TO "service_role";



GRANT ALL ON TABLE "public"."employee_skills" TO "anon";
GRANT ALL ON TABLE "public"."employee_skills" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_skills" TO "service_role";



GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_bookings" TO "anon";
GRANT ALL ON TABLE "public"."equipment_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_inspections" TO "anon";
GRANT ALL ON TABLE "public"."equipment_inspections" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_inspections" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_inventory" TO "anon";
GRANT ALL ON TABLE "public"."equipment_inventory" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_inventory" TO "service_role";



GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";



GRANT ALL ON TABLE "public"."interviews" TO "anon";
GRANT ALL ON TABLE "public"."interviews" TO "authenticated";
GRANT ALL ON TABLE "public"."interviews" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON TABLE "public"."leave_balances" TO "anon";
GRANT ALL ON TABLE "public"."leave_balances" TO "authenticated";
GRANT ALL ON TABLE "public"."leave_balances" TO "service_role";



GRANT ALL ON TABLE "public"."leave_requests" TO "anon";
GRANT ALL ON TABLE "public"."leave_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."leave_requests" TO "service_role";



GRANT ALL ON TABLE "public"."leave_types" TO "anon";
GRANT ALL ON TABLE "public"."leave_types" TO "authenticated";
GRANT ALL ON TABLE "public"."leave_types" TO "service_role";



GRANT ALL ON TABLE "public"."loan_applications" TO "anon";
GRANT ALL ON TABLE "public"."loan_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."loan_applications" TO "service_role";



GRANT ALL ON TABLE "public"."loan_programs" TO "anon";
GRANT ALL ON TABLE "public"."loan_programs" TO "authenticated";
GRANT ALL ON TABLE "public"."loan_programs" TO "service_role";



GRANT ALL ON TABLE "public"."loan_repayments" TO "anon";
GRANT ALL ON TABLE "public"."loan_repayments" TO "authenticated";
GRANT ALL ON TABLE "public"."loan_repayments" TO "service_role";



GRANT ALL ON TABLE "public"."meeting_rooms" TO "anon";
GRANT ALL ON TABLE "public"."meeting_rooms" TO "authenticated";
GRANT ALL ON TABLE "public"."meeting_rooms" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."offers" TO "anon";
GRANT ALL ON TABLE "public"."offers" TO "authenticated";
GRANT ALL ON TABLE "public"."offers" TO "service_role";



GRANT ALL ON TABLE "public"."performance_reviews" TO "anon";
GRANT ALL ON TABLE "public"."performance_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."performance_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."request_categories" TO "anon";
GRANT ALL ON TABLE "public"."request_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."request_categories" TO "service_role";



GRANT ALL ON TABLE "public"."request_types" TO "anon";
GRANT ALL ON TABLE "public"."request_types" TO "authenticated";
GRANT ALL ON TABLE "public"."request_types" TO "service_role";



GRANT ALL ON TABLE "public"."requests" TO "anon";
GRANT ALL ON TABLE "public"."requests" TO "authenticated";
GRANT ALL ON TABLE "public"."requests" TO "service_role";



GRANT ALL ON TABLE "public"."room_bookings" TO "anon";
GRANT ALL ON TABLE "public"."room_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."room_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."safety_check_items" TO "anon";
GRANT ALL ON TABLE "public"."safety_check_items" TO "authenticated";
GRANT ALL ON TABLE "public"."safety_check_items" TO "service_role";



GRANT ALL ON TABLE "public"."safety_checks" TO "anon";
GRANT ALL ON TABLE "public"."safety_checks" TO "authenticated";
GRANT ALL ON TABLE "public"."safety_checks" TO "service_role";



GRANT ALL ON TABLE "public"."safety_equipment_checks" TO "anon";
GRANT ALL ON TABLE "public"."safety_equipment_checks" TO "authenticated";
GRANT ALL ON TABLE "public"."safety_equipment_checks" TO "service_role";



GRANT ALL ON TABLE "public"."safety_incidents" TO "anon";
GRANT ALL ON TABLE "public"."safety_incidents" TO "authenticated";
GRANT ALL ON TABLE "public"."safety_incidents" TO "service_role";



GRANT ALL ON TABLE "public"."skills" TO "anon";
GRANT ALL ON TABLE "public"."skills" TO "authenticated";
GRANT ALL ON TABLE "public"."skills" TO "service_role";



GRANT ALL ON TABLE "public"."training_courses" TO "anon";
GRANT ALL ON TABLE "public"."training_courses" TO "authenticated";
GRANT ALL ON TABLE "public"."training_courses" TO "service_role";



GRANT ALL ON TABLE "public"."workflow_instances" TO "anon";
GRANT ALL ON TABLE "public"."workflow_instances" TO "authenticated";
GRANT ALL ON TABLE "public"."workflow_instances" TO "service_role";



GRANT ALL ON TABLE "public"."workflows" TO "anon";
GRANT ALL ON TABLE "public"."workflows" TO "authenticated";
GRANT ALL ON TABLE "public"."workflows" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
