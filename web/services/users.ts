import { supabase } from '../lib/supabase/client';
import { User } from '../../packages/types';

export async function getUsers(org_id?: string): Promise<User[]> {
  let query = supabase.from('profiles').select('*');
  if (org_id) {
    query = query.eq('department', org_id); // Map org_id to department
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createUser(user: Partial<User>): Promise<User> {
  const { data, error } = await supabase.from('profiles').insert([user]).select().single();
  if (error) throw error;
  return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
} 