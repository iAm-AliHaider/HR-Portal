import { supabase } from '../lib/supabase/client';
import { User } from '../../packages/types';

export async function getUsers(org_id: string): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*').eq('org_id', org_id);
  if (error) throw error;
  return data;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createUser(user: Partial<User>): Promise<User> {
  const { data, error } = await supabase.from('users').insert([user]).select().single();
  if (error) throw error;
  return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
} 