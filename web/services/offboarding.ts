import { supabase } from '@/lib/supabase/client'
import { OffboardingProcess, OffboardingTask, OffboardingTemplate, ExitInterview, KnowledgeTransferSession } from '../../packages/types/hr'

export const OffboardingService = {
  // Process Management
  async createOffboardingProcess(orgId: string, employeeId: string, data: {
    resignation_date: string;
    last_working_day: string;
    reason: string;
    manager_id: string;
    hr_partner_id: string;
    template_id?: string;
    notes?: string;
  }) {
    const effectiveTerminationDate = data.last_working_day // Could be different for some cases

    const { data: process, error } = await supabase
      .from('offboarding_processes')
      .insert({
        org_id: orgId,
        employee_id: employeeId,
        resignation_date: data.resignation_date,
        last_working_day: data.last_working_day,
        effective_termination_date: effectiveTerminationDate,
        reason: data.reason,
        manager_id: data.manager_id,
        hr_partner_id: data.hr_partner_id,
        status: 'initiated',
        progress_percentage: 0,
        current_phase: 'Initial Setup',
        tasks_completed: 0,
        total_tasks: 0,
        overdue_tasks: 0,
        exit_interview_scheduled: false,
        benefits_info: '',
        final_pay_calculated: false,
        equipment_to_return: [],
        equipment_returned: false,
        access_revoked: false,
        badge_returned: false,
        knowledge_transfer_required: true,
        announcement_sent: false,
        team_notification_sent: false,
        client_notification_required: false,
        notes: data.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    
    // Auto-generate tasks from template if provided
    if (data.template_id) {
      await this.generateTasksFromTemplate(process.id, data.template_id)
    }
    
    return process
  },

  async generateTasksFromTemplate(processId: string, templateId: string) {
    const { data: template, error: templateError } = await supabase
      .from('offboarding_templates')
      .select('task_templates')
      .eq('id', templateId)
      .single()

    if (templateError) throw new Error(templateError.message)

    const { data: process, error: processError } = await supabase
      .from('offboarding_processes')
      .select('last_working_day')
      .eq('id', processId)
      .single()

    if (processError) throw new Error(processError.message)

    const lastWorkingDay = new Date(process.last_working_day)

    const tasksToCreate = template.task_templates.map((template: any, index: number) => {
      const dueDate = new Date(lastWorkingDay)
      dueDate.setDate(dueDate.getDate() + template.due_day_offset)

      return {
        process_id: processId,
        title: template.title,
        description: template.description,
        category: template.category,
        priority: template.priority,
        assigned_to_role: template.assigned_to_role,
        due_date: dueDate.toISOString(),
        dependencies: template.dependencies?.map((depIndex: number) => index + depIndex) || [],
        approval_required: template.approval_required || false,
        instructions: template.instructions,
        documents_required: template.documents_required || [],
        auto_assign: template.auto_assign || false,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    })

    const { error } = await supabase
      .from('offboarding_tasks')
      .insert(tasksToCreate)

    if (error) throw new Error(error.message)
  },

  async updateProcessProgress(processId: string) {
    const { data: tasks, error: tasksError } = await supabase
      .from('offboarding_tasks')
      .select('status')
      .eq('process_id', processId)

    if (tasksError) throw new Error(tasksError.message)

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'completed').length
    const overdueTasks = tasks.filter(task => {
      // Add logic to calculate overdue based on due_date
      return task.status === 'pending' // Simplified for now
    }).length

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const { error } = await supabase
      .from('offboarding_processes')
      .update({
        progress_percentage: progressPercentage,
        total_tasks: totalTasks,
        tasks_completed: completedTasks,
        overdue_tasks: overdueTasks,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (error) throw new Error(error.message)
  },

  // Task Management
  async completeTask(taskId: string, completedBy: string, notes?: string) {
    const { data: task, error } = await supabase
      .from('offboarding_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_by: completedBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select('process_id, title')
      .single()

    if (error) throw new Error(error.message)

    // Update process progress
    await this.updateProcessProgress(task.process_id)

    // Auto-assign dependent tasks
    await this.checkAndAssignDependentTasks(task.process_id, taskId)

    // Handle specific task completions
    await this.handleTaskCompletion(task.process_id, task.title)

    return task
  },

  async checkAndAssignDependentTasks(processId: string, completedTaskId: string) {
    const { data: tasks, error } = await supabase
      .from('offboarding_tasks')
      .select('*')
      .eq('process_id', processId)
      .eq('status', 'pending')

    if (error) throw new Error(error.message)

    for (const task of tasks) {
      if (task.dependencies?.includes(completedTaskId) && task.auto_assign) {
        await supabase
          .from('offboarding_tasks')
          .update({
            status: 'in_progress',
            updated_at: new Date().toISOString()
          })
          .eq('id', task.id)
      }
    }
  },

  async handleTaskCompletion(processId: string, taskTitle: string) {
    // Handle specific business logic when certain tasks are completed
    if (taskTitle.toLowerCase().includes('access revocation')) {
      await this.markAccessRevoked(processId)
    } else if (taskTitle.toLowerCase().includes('equipment return')) {
      await this.markEquipmentReturned(processId)
    } else if (taskTitle.toLowerCase().includes('final pay')) {
      await this.markFinalPayCalculated(processId)
    }
  },

  async markAccessRevoked(processId: string) {
    const { error } = await supabase
      .from('offboarding_processes')
      .update({
        access_revoked: true,
        access_revocation_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (error) throw new Error(error.message)
  },

  async markEquipmentReturned(processId: string) {
    const { error } = await supabase
      .from('offboarding_processes')
      .update({
        equipment_returned: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (error) throw new Error(error.message)
  },

  async markFinalPayCalculated(processId: string) {
    const { error } = await supabase
      .from('offboarding_processes')
      .update({
        final_pay_calculated: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (error) throw new Error(error.message)
  },

  // Exit Interview Management
  async scheduleExitInterview(processId: string, data: {
    interviewer_id: string;
    scheduled_date: string;
    duration_minutes: number;
    format: 'in_person' | 'video_call' | 'phone' | 'written_survey';
  }) {
    const { data: interview, error } = await supabase
      .from('exit_interviews')
      .insert({
        offboarding_process_id: processId,
        ...data,
        status: 'scheduled',
        responses: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Update process to reflect exit interview scheduled
    await supabase
      .from('offboarding_processes')
      .update({
        exit_interview_scheduled: true,
        exit_interview_date: data.scheduled_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    return interview
  },

  async submitExitInterviewResponses(interviewId: string, responses: any) {
    const { data, error } = await supabase
      .from('exit_interviews')
      .update({
        responses,
        status: 'completed',
        conducted_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', interviewId)
      .select('offboarding_process_id')
      .single()

    if (error) throw new Error(error.message)

    // Update process to reflect exit interview completed
    await supabase
      .from('offboarding_processes')
      .update({
        exit_interview_completed: true,
        exit_interview_feedback: {
          overall_rating: responses.overall_satisfaction,
          would_recommend: responses.would_recommend_company,
          reason_for_leaving: responses.reason_for_leaving,
          suggestions: responses.improvement_suggestions?.join('; ') || '',
          management_feedback: responses.management_feedback,
          culture_feedback: responses.company_culture,
          growth_opportunities_feedback: responses.growth_opportunities,
          work_life_balance_rating: responses.work_life_balance,
          compensation_satisfaction: responses.compensation_satisfaction,
          additional_comments: responses.additional_comments
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', data.offboarding_process_id)

    return data
  },

  // Knowledge Transfer Management
  async createKnowledgeTransferSession(processId: string, data: {
    recipient_id: string;
    topic: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    scheduled_date: string;
    duration_minutes: number;
    location?: string;
    meeting_url?: string;
  }) {
    const { data: session, error } = await supabase
      .from('knowledge_transfer_sessions')
      .insert({
        offboarding_process_id: processId,
        ...data,
        status: 'scheduled',
        documentation_created: false,
        follow_up_required: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Update process knowledge transfer sessions
    const { data: process, error: processError } = await supabase
      .from('offboarding_processes')
      .select('knowledge_transfer_sessions')
      .eq('id', processId)
      .single()

    if (processError) throw new Error(processError.message)

    const updatedSessions = [
      ...(process.knowledge_transfer_sessions || []),
      {
        id: session.id,
        topic: data.topic,
        recipient_id: data.recipient_id,
        recipient_name: '', // Would be populated from user lookup
        scheduled_date: data.scheduled_date,
        status: 'scheduled'
      }
    ]

    await supabase
      .from('offboarding_processes')
      .update({
        knowledge_transfer_sessions: updatedSessions,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    return session
  },

  async completeKnowledgeTransferSession(sessionId: string, data: {
    completion_notes?: string;
    documentation_links?: string[];
    follow_up_required?: boolean;
    follow_up_date?: string;
  }) {
    const { data: session, error } = await supabase
      .from('knowledge_transfer_sessions')
      .update({
        status: 'completed',
        completion_notes: data.completion_notes,
        documentation_created: data.documentation_links ? data.documentation_links.length > 0 : false,
        documentation_links: data.documentation_links,
        follow_up_required: data.follow_up_required || false,
        follow_up_date: data.follow_up_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return session
  },

  // Equipment Management
  async addEquipmentToReturn(processId: string, equipment: {
    item: string;
    serial_number?: string;
    condition?: string;
  }) {
    const { data: process, error } = await supabase
      .from('offboarding_processes')
      .select('equipment_to_return')
      .eq('id', processId)
      .single()

    if (error) throw new Error(error.message)

    const updatedEquipment = [
      ...(process.equipment_to_return || []),
      {
        ...equipment,
        returned: false
      }
    ]

    const { error: updateError } = await supabase
      .from('offboarding_processes')
      .update({
        equipment_to_return: updatedEquipment,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (updateError) throw new Error(updateError.message)
  },

  async markEquipmentItemReturned(processId: string, itemName: string) {
    const { data: process, error } = await supabase
      .from('offboarding_processes')
      .select('equipment_to_return')
      .eq('id', processId)
      .single()

    if (error) throw new Error(error.message)

    const updatedEquipment = process.equipment_to_return?.map((item: any) =>
      item.item === itemName
        ? { ...item, returned: true, returned_date: new Date().toISOString() }
        : item
    ) || []

    const allReturned = updatedEquipment.every((item: any) => item.returned)

    const { error: updateError } = await supabase
      .from('offboarding_processes')
      .update({
        equipment_to_return: updatedEquipment,
        equipment_returned: allReturned,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (updateError) throw new Error(updateError.message)
  },

  // Project Transition Management
  async addProjectTransition(processId: string, project: {
    project_id: string;
    project_name: string;
    new_owner_id: string;
    new_owner_name: string;
    transition_date: string;
  }) {
    const { data: process, error } = await supabase
      .from('offboarding_processes')
      .select('project_transitions')
      .eq('id', processId)
      .single()

    if (error) throw new Error(error.message)

    const updatedTransitions = [
      ...(process.project_transitions || []),
      {
        ...project,
        status: 'pending' as const
      }
    ]

    const { error: updateError } = await supabase
      .from('offboarding_processes')
      .update({
        project_transitions: updatedTransitions,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (updateError) throw new Error(updateError.message)
  },

  // Communication Management
  async sendTeamAnnouncement(processId: string) {
    const { error } = await supabase
      .from('offboarding_processes')
      .update({
        announcement_sent: true,
        team_notification_sent: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    if (error) throw new Error(error.message)
  },

  // Document Management
  async uploadTaskDocument(taskId: string, documentUrl: string, uploadedBy: string) {
    const { data: task, error } = await supabase
      .from('offboarding_tasks')
      .select('documents_uploaded')
      .eq('id', taskId)
      .single()

    if (error) throw new Error(error.message)

    const updatedDocuments = [...(task.documents_uploaded || []), documentUrl]

    const { error: updateError } = await supabase
      .from('offboarding_tasks')
      .update({
        documents_uploaded: updatedDocuments,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    if (updateError) throw new Error(updateError.message)
  }
}

// Enhanced query functions
export async function getOffboardingProcesses(org_id: string, filters?: {
  status?: string;
  department?: string;
  reason?: string;
  employee_id?: string;
}): Promise<OffboardingProcess[]> {
  let query = supabase.from('offboarding_processes').select('*').eq('org_id', org_id)
  
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.department) query = query.eq('department', filters.department)
  if (filters?.reason) query = query.eq('reason', filters.reason)
  if (filters?.employee_id) query = query.eq('employee_id', filters.employee_id)
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOffboardingTasks(org_id: string, process_id?: string): Promise<OffboardingTask[]> {
  let query = supabase.from('offboarding_tasks').select('*').eq('org_id', org_id)
  if (process_id) query = query.eq('process_id', process_id)
  const { data, error } = await query.order('due_date', { ascending: true })
  if (error) throw error
  return data
}

export async function getOffboardingTemplates(org_id: string, filters?: {
  department_id?: string;
  job_role?: string;
  reason_for_leaving?: string;
  is_active?: boolean;
}): Promise<OffboardingTemplate[]> {
  let query = supabase.from('offboarding_templates').select('*').eq('org_id', org_id)
  
  if (filters?.department_id) query = query.eq('department_id', filters.department_id)
  if (filters?.job_role) query = query.eq('job_role', filters.job_role)
  if (filters?.reason_for_leaving) query = query.eq('reason_for_leaving', filters.reason_for_leaving)
  if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active)
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getExitInterviews(org_id: string, filters?: {
  status?: string;
  employee_id?: string;
}): Promise<ExitInterview[]> {
  let query = supabase.from('exit_interviews').select('*').eq('org_id', org_id)
  
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.employee_id) query = query.eq('employee_id', filters.employee_id)
  
  const { data, error } = await query.order('scheduled_date', { ascending: false })
  if (error) throw error
  return data
}

export async function getKnowledgeTransferSessions(org_id: string, filters?: {
  status?: string;
  departing_employee_id?: string;
  recipient_id?: string;
}): Promise<KnowledgeTransferSession[]> {
  let query = supabase.from('knowledge_transfer_sessions').select('*').eq('org_id', org_id)
  
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.departing_employee_id) query = query.eq('departing_employee_id', filters.departing_employee_id)
  if (filters?.recipient_id) query = query.eq('recipient_id', filters.recipient_id)
  
  const { data, error } = await query.order('scheduled_date', { ascending: true })
  if (error) throw error
  return data
} 