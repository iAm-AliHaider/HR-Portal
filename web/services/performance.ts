import { supabase } from '../lib/supabase/client';
import { PerformanceReview } from '../../packages/types';

export async function getPerformanceReviews(org_id: string, user_id?: string): Promise<PerformanceReview[]> {
  let query = supabase.from('performance_reviews').select('*').eq('org_id', org_id);
  if (user_id) query = query.eq('user_id', user_id);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPerformanceReviewById(id: string): Promise<PerformanceReview | null> {
  const { data, error } = await supabase.from('performance_reviews').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createPerformanceReview(review: Partial<PerformanceReview>): Promise<PerformanceReview> {
  const { data, error } = await supabase.from('performance_reviews').insert([review]).select().single();
  if (error) throw error;
  return data;
}

export async function updatePerformanceReview(id: string, updates: Partial<PerformanceReview>): Promise<PerformanceReview> {
  const { data, error } = await supabase.from('performance_reviews').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePerformanceReview(id: string): Promise<void> {
  const { error } = await supabase.from('performance_reviews').delete().eq('id', id);
  if (error) throw error;
} 