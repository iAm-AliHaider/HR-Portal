import { supabase } from "../lib/supabase/client";
import { Document } from "../../packages/types";

export async function getDocuments(org_id: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("org_id", org_id);
  if (error) throw error;
  return data;
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createDocument(
  doc: Partial<Document>,
): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .insert([doc])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDocument(
  id: string,
  updates: Partial<Document>,
): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
}
