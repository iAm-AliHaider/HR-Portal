-- Migration: Remove recursive jobs status trigger and function
DROP TRIGGER IF EXISTS check_expired_jobs ON jobs;
DROP FUNCTION IF EXISTS update_expired_job_status(); 