import { supabase } from '@/lib/supabase/client';
import { Team } from '../../packages/types';

// Mock data for teams
const mockTeams: Team[] = [
  {
    id: 'team1',
    org_id: 'org1',
    name: 'Engineering',
    supervisor_id: 'user1',
    description: 'Engineering and development team',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'team2',
    org_id: 'org1',
    name: 'HR',
    supervisor_id: 'user2',
    description: 'Human resources team',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'team3',
    org_id: 'org1',
    name: 'Marketing',
    supervisor_id: 'user3',
    description: 'Marketing and communications team',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function getTeams(org_id: string): Promise<Team[]> {
  console.log(`getTeams called with org_id: ${org_id}`);
  try {
    // In development, return mock data
    console.log("Returning mock teams data");
    return new Promise(resolve => setTimeout(() => resolve(mockTeams.filter(team => team.org_id === org_id)), 100));
    
    // In a real application with Supabase, we would use:
    // const { data, error } = await supabase.from('teams').select('*').eq('org_id', org_id);
    // if (error) throw error;
    // return data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error;
  }
}

export async function getTeamById(id: string): Promise<Team | null> {
  try {
    // In development, return mock data
    return new Promise(resolve => {
      setTimeout(() => {
        const team = mockTeams.find(t => t.id === id) || null;
        resolve(team);
      }, 100);
    });
    
    // In a real application with Supabase:
    // const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
  } catch (error) {
    console.error(`Error fetching team with ID ${id}:`, error);
    throw error;
  }
}

export async function createTeam(team: Partial<Team>): Promise<Team> {
  const { data, error } = await supabase.from('teams').insert([team]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
  const { data, error } = await supabase.from('teams').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await supabase.from('teams').delete().eq('id', id);
  if (error) throw error;
} 