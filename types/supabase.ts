export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          avatar_url: string | null
          email: string
          phone: string | null
          role: 'admin' | 'hr' | 'manager' | 'employee' | 'recruiter'
          department: string | null
          position: string | null
          manager_id: string | null
          hire_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          email: string
          phone?: string | null
          role?: 'admin' | 'hr' | 'manager' | 'employee' | 'recruiter'
          department?: string | null
          position?: string | null
          manager_id?: string | null
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          email?: string
          phone?: string | null
          role?: 'admin' | 'hr' | 'manager' | 'employee' | 'recruiter'
          department?: string | null
          position?: string | null
          manager_id?: string | null
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          profile_id: string | null
          employee_id: string
          status: string
          salary: number | null
          location: string | null
          start_date: string
          end_date: string | null
          employment_type: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          employee_id: string
          status?: string
          salary?: number | null
          location?: string | null
          start_date: string
          end_date?: string | null
          employment_type: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          employee_id?: string
          status?: string
          salary?: number | null
          location?: string | null
          start_date?: string
          end_date?: string | null
          employment_type?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          department: string
          location: string
          type: string
          status: 'open' | 'closed' | 'draft' | 'archived'
          description: string
          requirements: string | null
          salary_range: string | null
          benefits: string | null
          applications_count: number | null
          posted_by: string | null
          created_at: string
          updated_at: string
          closing_date: string | null
          closed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          department: string
          location: string
          type: string
          status?: 'open' | 'closed' | 'draft' | 'archived'
          description: string
          requirements?: string | null
          salary_range?: string | null
          benefits?: string | null
          applications_count?: number | null
          posted_by?: string | null
          created_at?: string
          updated_at?: string
          closing_date?: string | null
          closed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          department?: string
          location?: string
          type?: string
          status?: 'open' | 'closed' | 'draft' | 'archived'
          description?: string
          requirements?: string | null
          salary_range?: string | null
          benefits?: string | null
          applications_count?: number | null
          posted_by?: string | null
          created_at?: string
          updated_at?: string
          closing_date?: string | null
          closed_at?: string | null
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          candidate_name: string
          candidate_email: string
          resume_url: string | null
          cover_letter: string | null
          status: 'pending' | 'under_review' | 'interview_scheduled' | 'rejected' | 'offer_extended' | 'hired'
          experience_years: number | null
          current_company: string | null
          notes: string | null
          applied_at: string
          updated_at: string
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          job_id: string
          candidate_name: string
          candidate_email: string
          resume_url?: string | null
          cover_letter?: string | null
          status?: 'pending' | 'under_review' | 'interview_scheduled' | 'rejected' | 'offer_extended' | 'hired'
          experience_years?: number | null
          current_company?: string | null
          notes?: string | null
          applied_at?: string
          updated_at?: string
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          candidate_name?: string
          candidate_email?: string
          resume_url?: string | null
          cover_letter?: string | null
          status?: 'pending' | 'under_review' | 'interview_scheduled' | 'rejected' | 'offer_extended' | 'hired'
          experience_years?: number | null
          current_company?: string | null
          notes?: string | null
          applied_at?: string
          updated_at?: string
          reviewed_by?: string | null
        }
      }
      interviews: {
        Row: {
          id: string
          application_id: string
          interviewer_id: string | null
          candidate_name: string
          candidate_email: string
          position: string
          job_id: string | null
          stage: string
          type: string
          scheduled_at: string
          duration: number
          location: string
          notes: string | null
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          feedback: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          interviewer_id?: string | null
          candidate_name: string
          candidate_email: string
          position: string
          job_id?: string | null
          stage: string
          type: string
          scheduled_at: string
          duration: number
          location: string
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          feedback?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          interviewer_id?: string | null
          candidate_name?: string
          candidate_email?: string
          position?: string
          job_id?: string | null
          stage?: string
          type?: string
          scheduled_at?: string
          duration?: number
          location?: string
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          feedback?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          application_id: string
          candidate_name: string
          candidate_email: string
          position: string
          department: string
          job_id: string | null
          salary: number
          equity: string | null
          bonus: number | null
          benefits: Json | null
          start_date: string
          expiration_date: string
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'negotiating' | 'expired'
          contract_type: string
          notes: string | null
          created_at: string
          updated_at: string
          accepted_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          application_id: string
          candidate_name: string
          candidate_email: string
          position: string
          department: string
          job_id?: string | null
          salary: number
          equity?: string | null
          bonus?: number | null
          benefits?: Json | null
          start_date: string
          expiration_date: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'negotiating' | 'expired'
          contract_type: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          accepted_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          application_id?: string
          candidate_name?: string
          candidate_email?: string
          position?: string
          department?: string
          job_id?: string | null
          salary?: number
          equity?: string | null
          bonus?: number | null
          benefits?: Json | null
          start_date?: string
          expiration_date?: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'negotiating' | 'expired'
          contract_type?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          accepted_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          created_by?: string | null
        }
      }
      leave_requests: {
        Row: {
          id: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          days: number
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          reason: string | null
          created_at: string
          approved_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          days: number
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          reason?: string | null
          created_at?: string
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          employee_id?: string
          type?: string
          start_date?: string
          end_date?: string
          days?: number
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          reason?: string | null
          created_at?: string
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          manager_id?: string | null
        }
      }
    }
    Functions: {}
    Enums: {}
  }
} 