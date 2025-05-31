import { supabase } from "../lib/supabase/client";
import { Attendance } from "../../packages/types";

export async function getAttendance(
  org_id: string,
  user_id?: string,
): Promise<Attendance[]> {
  let query = supabase.from("attendance").select("*").eq("org_id", org_id);
  if (user_id) query = query.eq("user_id", user_id);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAttendanceById(
  id: string,
): Promise<Attendance | null> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createAttendance(
  record: Partial<Attendance>,
): Promise<Attendance> {
  const { data, error } = await supabase
    .from("attendance")
    .insert([record])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAttendance(
  id: string,
  updates: Partial<Attendance>,
): Promise<Attendance> {
  const { data, error } = await supabase
    .from("attendance")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAttendance(id: string): Promise<void> {
  const { error } = await supabase.from("attendance").delete().eq("id", id);
  if (error) throw error;
}
