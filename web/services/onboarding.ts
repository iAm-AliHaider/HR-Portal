import { supabase } from '@/lib/supabase/client'
import { OnboardingTask, OnboardingWorkflow, OnboardingPlan, KnowledgeTransferSession } from '../../packages/types/hr'

export type OnboardingTaskLocal = {
  id: string
  title: string
  description?: string
  required: boolean
}

export const OnboardingService = {
  // Workflow Management
  async createOnboardingWorkflow(orgId: string, employeeId: string, planId: string, data: {
    start_date: string;
    manager_id: string;
    hr_representative_id: string;
    buddy_id?: string;
  }) {
    const { data: workflow, error } = await supabase
      .from('onboarding_workflows')
      .insert({
        org_id: orgId,
        employee_id: employeeId,
        plan_id: planId,
        ...data,
        status: 'not_started',
        progress_percentage: 0,
        current_stage: 'Preparation',
        total_tasks: 0,
        completed_tasks: 0,
        overdue_tasks: 0,
        upcoming_tasks: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    
    // Auto-generate tasks from plan template
    await this.generateTasksFromPlan(workflow.id, planId)
    
    return workflow
  },

  async generateTasksFromPlan(workflowId: string, planId: string) {
    const { data: plan, error: planError } = await supabase
      .from('onboarding_plans')
      .select('task_templates')
      .eq('id', planId)
      .single()

    if (planError) throw new Error(planError.message)

    const tasksToCreate = plan.task_templates.map((template: any, index: number) => ({
      workflow_id: workflowId,
      title: template.title,
      description: template.description,
      category: template.category,
      priority: template.priority,
      assigned_to_role: template.assigned_to_role,
      due_day_offset: template.due_day_offset,
      dependencies: template.dependencies?.map((depIndex: number) => index + depIndex) || [],
      documents_required: template.documents_required || [],
      approval_required: template.approval_required || false,
      time_estimate: template.time_estimate,
      instructions: template.instructions,
      resources: template.resources || [],
      auto_assign: template.auto_assign || false,
      status: 'pending',
      created_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('onboarding_tasks')
      .insert(tasksToCreate)

    if (error) throw new Error(error.message)
  },

  async updateWorkflowProgress(workflowId: string) {
    const { data: tasks, error: tasksError } = await supabase
      .from('onboarding_tasks')
      .select('status')
      .eq('workflow_id', workflowId)

    if (tasksError) throw new Error(tasksError.message)

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'completed').length
    const overdueTasks = tasks.filter(task => {
      // Add logic to calculate overdue based on due_date
      return task.status === 'pending' // Simplified for now
    }).length

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const { error } = await supabase
      .from('onboarding_workflows')
      .update({
        progress_percentage: progressPercentage,
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        overdue_tasks: overdueTasks,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)

    if (error) throw new Error(error.message)
  },

  // Task Management
  async completeTask(taskId: string, completedBy: string, notes?: string) {
    const { data: task, error } = await supabase
      .from('onboarding_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_by: completedBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select('workflow_id')
      .single()

    if (error) throw new Error(error.message)

    // Update workflow progress
    await this.updateWorkflowProgress(task.workflow_id)

    // Auto-assign dependent tasks
    await this.checkAndAssignDependentTasks(task.workflow_id, taskId)

    return task
  },

  async checkAndAssignDependentTasks(workflowId: string, completedTaskId: string) {
    const { data: tasks, error } = await supabase
      .from('onboarding_tasks')
      .select('*')
      .eq('workflow_id', workflowId)
      .eq('status', 'pending')

    if (error) throw new Error(error.message)

    for (const task of tasks) {
      if (task.dependencies?.includes(completedTaskId) && task.auto_assign) {
        await supabase
          .from('onboarding_tasks')
          .update({
            status: 'in_progress',
            updated_at: new Date().toISOString()
          })
          .eq('id', task.id)
      }
    }
  },

  // Document Management
  async uploadTaskDocument(taskId: string, documentUrl: string, uploadedBy: string) {
    const { data: task, error } = await supabase
      .from('onboarding_tasks')
      .select('documents_uploaded')
      .eq('id', taskId)
      .single()

    if (error) throw new Error(error.message)

    const updatedDocuments = [...(task.documents_uploaded || []), documentUrl]

    const { error: updateError } = await supabase
      .from('onboarding_tasks')
      .update({
        documents_uploaded: updatedDocuments,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    if (updateError) throw new Error(updateError.message)
  },

  // Milestone Management
  async addMilestone(workflowId: string, milestone: {
    name: string;
    description?: string;
    target_date: string;
  }) {
    const { data: workflow, error } = await supabase
      .from('onboarding_workflows')
      .select('milestones')
      .eq('id', workflowId)
      .single()

    if (error) throw new Error(error.message)

    const updatedMilestones = [
      ...(workflow.milestones || []),
      {
        ...milestone,
        status: 'pending' as const
      }
    ]

    const { error: updateError } = await supabase
      .from('onboarding_workflows')
      .update({
        milestones: updatedMilestones,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)

    if (updateError) throw new Error(updateError.message)
  },

  async completeMilestone(workflowId: string, milestoneName: string) {
    const { data: workflow, error } = await supabase
      .from('onboarding_workflows')
      .select('milestones')
      .eq('id', workflowId)
      .single()

    if (error) throw new Error(error.message)

    const updatedMilestones = workflow.milestones?.map((milestone: any) =>
      milestone.name === milestoneName
        ? { ...milestone, status: 'completed', completed_date: new Date().toISOString() }
        : milestone
    ) || []

    const { error: updateError } = await supabase
      .from('onboarding_workflows')
      .update({
        milestones: updatedMilestones,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)

    if (updateError) throw new Error(updateError.message)
  },

  // Feedback Management
  async addFeedback(workflowId: string, feedback: {
    submitted_by: string;
    rating: number;
    comments: string;
    suggestions?: string;
  }) {
    const { data: workflow, error } = await supabase
      .from('onboarding_workflows')
      .select('feedback')
      .eq('id', workflowId)
      .single()

    if (error) throw new Error(error.message)

    const newFeedback = {
      ...feedback,
      feedback_id: `feedback_${Date.now()}`,
      submitted_at: new Date().toISOString()
    }

    const updatedFeedback = [...(workflow.feedback || []), newFeedback]

    const { error: updateError } = await supabase
      .from('onboarding_workflows')
      .update({
        feedback: updatedFeedback,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)

    if (updateError) throw new Error(updateError.message)
  },

  // Equipment Management
  async issueEquipment(workflowId: string, equipment: {
    item: string;
    serial_number?: string;
  }) {
    const { data: workflow, error } = await supabase
      .from('onboarding_workflows')
      .select('equipment_issued')
      .eq('id', workflowId)
      .single()

    if (error) throw new Error(error.message)

    const newEquipment = {
      ...equipment,
      issued_date: new Date().toISOString()
    }

    const updatedEquipment = [...(workflow.equipment_issued || []), newEquipment]

    const { error: updateError } = await supabase
      .from('onboarding_workflows')
      .update({
        equipment_issued: updatedEquipment,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)

    if (updateError) throw new Error(updateError.message)
  },

  // Training Session Management
  async scheduleTrainingSession(workflowId: string, session: {
    title: string;
    scheduled_date: string;
    trainer?: string;
  }) {
    const { data: workflow, error } = await supabase
      .from('onboarding_workflows')
      .select('training_sessions')
      .eq('id', workflowId)
      .single()

    if (error) throw new Error(error.message)

    const newSession = {
      ...session,
      session_id: `session_${Date.now()}`,
      status: 'scheduled' as const
    }

    const updatedSessions = [...(workflow.training_sessions || []), newSession]

    const { error: updateError } = await supabase
      .from('onboarding_workflows')
      .update({
        training_sessions: updatedSessions,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)

    if (updateError) throw new Error(updateError.message)
  },

  // Legacy methods for backward compatibility
  async startOnboarding(tenantId: string, employeeId: string, templateId: string) {
    const { data, error } = await supabase
      .from('employee_onboarding')
      .insert({
        tenant_id: tenantId,
        employee_id: employeeId,
        template_id: templateId,
        progress: { completedTasks: [], notes: '' }
      })
      .select()

    if (error) throw new Error(error.message)
    return data[0]
  },

  async getEmployeeOnboarding(tenantId: string, employeeId: string) {
    const { data, error } = await supabase
      .from('employee_onboarding')
      .select('*, onboarding_templates(*)')
      .eq('tenant_id', tenantId)
      .eq('employee_id', employeeId)

    if (error) throw new Error(error.message)
    return data
  }
}

// Enhanced task management functions
export async function getOnboardingTasks(org_id: string, user_id?: string): Promise<OnboardingTask[]> {
  let query = supabase.from('onboarding_tasks').select('*').eq('org_id', org_id)
  if (user_id) query = query.eq('user_id', user_id)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getOnboardingTaskById(id: string): Promise<OnboardingTask | null> {
  const { data, error } = await supabase.from('onboarding_tasks').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createOnboardingTask(task: Partial<OnboardingTask>): Promise<OnboardingTask> {
  const { data, error } = await supabase.from('onboarding_tasks').insert([task]).select().single()
  if (error) throw error
  return data
}

export async function updateOnboardingTask(id: string, updates: Partial<OnboardingTask>): Promise<OnboardingTask> {
  const { data, error } = await supabase.from('onboarding_tasks').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteOnboardingTask(id: string): Promise<void> {
  const { error } = await supabase.from('onboarding_tasks').delete().eq('id', id)
  if (error) throw error
}

// Workflow management functions
export async function getOnboardingWorkflows(org_id: string, filters?: {
  status?: string;
  department?: string;
  employee_id?: string;
}): Promise<OnboardingWorkflow[]> {
  let query = supabase.from('onboarding_workflows').select('*').eq('org_id', org_id)
  
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.department) query = query.eq('department', filters.department)
  if (filters?.employee_id) query = query.eq('employee_id', filters.employee_id)
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOnboardingPlans(org_id: string, filters?: {
  department_id?: string;
  job_role?: string;
  is_active?: boolean;
}): Promise<OnboardingPlan[]> {
  let query = supabase.from('onboarding_plans').select('*').eq('org_id', org_id)
  
  if (filters?.department_id) query = query.eq('department_id', filters.department_id)
  if (filters?.job_role) query = query.eq('job_role', filters.job_role)
  if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active)
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
} 