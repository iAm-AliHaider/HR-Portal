import { supabase } from '@/lib/supabase/client'
import { Grievance } from '../../packages/types'

export const GrievanceService = {
  async submitGrievance(tenantId: string, payload: {
    employee_id: string
    type: string
    description: string
    is_anonymous: boolean
  }) {
    const { data, error } = await supabase
      .from('grievances')
      .insert({
        ...payload,
        tenant_id: tenantId,
        status: 'submitted'
      })
      .select()

    if (error) throw new Error(error.message)
    return data[0]
  },

  async getGrievances(tenantId: string, isHR: boolean) {
    const query = supabase
      .from('grievances')
      .select('*')
      .eq('tenant_id', tenantId)

    if (!isHR) {
      query.eq('is_anonymous', false)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
  },

  async getGrievanceById(id: string): Promise<Grievance | null> {
    const { data, error } = await supabase.from('grievances').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async createGrievance(grievance: Partial<Grievance>): Promise<Grievance> {
    const { data, error } = await supabase.from('grievances').insert([grievance]).select().single()
    if (error) throw error
    return data
  },

  async updateGrievance(id: string, updates: Partial<Grievance>): Promise<Grievance> {
    const { data, error } = await supabase.from('grievances').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteGrievance(id: string): Promise<void> {
    const { error } = await supabase.from('grievances').delete().eq('id', id)
    if (error) throw error
  }
} 