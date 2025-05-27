export * from './hr';
export type { Billing, SaaSSettings } from './hr';

export interface Task {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'On Hold' | 'Completed';
  assigned_to?: string;
  assigned_by?: string;
  category: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  tags?: string[];
  comments?: TaskComment[];
  checklist?: TaskChecklistItem[];
  team_id?: string;  // Reference to a team
  project_id?: string;  // Reference to a project
  related_event_id?: string;  // Reference to a calendar event
  parent_task_id?: string;  // For task dependencies/subtasks
  is_recurring?: boolean;  // Whether this is a recurring task
  recurrence_pattern?: string;  // How often it recurs (daily, weekly, monthly)
  recurrence_end_date?: string;  // When recurrence ends
  estimated_hours?: number;  // Estimated hours to complete
  actual_hours?: number;  // Actual hours spent
  watchers?: string[];  // Users who are watching this task
}

export interface TaskTemplate {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category: string;
  checklist_template?: Omit<TaskChecklistItem, 'id' | 'completed' | 'completed_at' | 'completed_by'>[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  estimated_hours?: number;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  team_id?: string;
  lead_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_by: string;
  created_at: string;
}

export interface TaskChecklistItem {
  id: string;
  content: string;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
}

export interface Team {
  id: string;
  org_id: string;
  name: string;
  supervisor_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
} 