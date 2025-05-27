import { supabase } from '@/lib/supabase/client';
import { Project } from '../../packages/types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development
const mockProjects: Project[] = [
  {
    id: 'project1',
    org_id: 'org1',
    name: 'Website Redesign',
    description: 'Redesign company website with new branding and improved UX',
    start_date: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    end_date: new Date(Date.now() + 86400000 * 60).toISOString(), // 60 days from now
    status: 'Active',
    team_id: 'team1',
    lead_id: 'user1',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'project2',
    org_id: 'org1',
    name: 'Q3 Performance Reviews',
    description: 'Complete performance reviews for all employees for Q3',
    start_date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    end_date: new Date(Date.now() + 86400000 * 25).toISOString(), // 25 days from now
    status: 'Active',
    team_id: 'team2',
    lead_id: 'user2',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'project3',
    org_id: 'org1',
    name: 'New Employee Onboarding Program',
    description: 'Develop a comprehensive onboarding program for new employees',
    start_date: new Date(Date.now() - 86400000 * 60).toISOString(), // 60 days ago
    end_date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    status: 'Completed',
    team_id: 'team2',
    lead_id: 'user2',
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'project4',
    org_id: 'org1',
    name: 'Annual Budget Planning',
    description: 'Prepare annual budget proposal for next fiscal year',
    start_date: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    end_date: new Date(Date.now() + 86400000 * 45).toISOString(), // 45 days from now
    status: 'On Hold',
    lead_id: 'user3',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// Projects service functions
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('projects').select('*');
    // if (error) throw error;
    // return data as Project[];
    
    // For now, return mock data
    return new Promise(resolve => {
      setTimeout(() => resolve(mockProjects), 300);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
    // if (error) throw error;
    // return data as Project;
    
    // For now, return mock data
    return new Promise(resolve => {
      setTimeout(() => {
        const project = mockProjects.find(p => p.id === projectId) || null;
        resolve(project);
      }, 300);
    });
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    throw error;
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
  try {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // In a real application, this would insert into Supabase
    // const { data, error } = await supabase.from('projects').insert(newProject).single();
    // if (error) throw error;
    // return data as Project;
    
    // For now, return the new project
    return new Promise(resolve => {
      setTimeout(() => {
        mockProjects.push(newProject);
        resolve(newProject);
      }, 300);
    });
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<Project> => {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase
    //   .from('projects')
    //   .update({ ...updates, updated_at: new Date().toISOString() })
    //   .eq('id', projectId)
    //   .single();
    // if (error) throw error;
    // return data as Project;
    
    // For now, update the mock data
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockProjects.findIndex(p => p.id === projectId);
        if (index === -1) throw new Error(`Project with ID ${projectId} not found`);
        
        const updatedProject = {
          ...mockProjects[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        
        mockProjects[index] = updatedProject;
        resolve(updatedProject);
      }, 300);
    });
  } catch (error) {
    console.error(`Error updating project with ID ${projectId}:`, error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    // In a real application, this would delete from Supabase
    // const { error } = await supabase.from('projects').delete().eq('id', projectId);
    // if (error) throw error;
    
    // For now, update the mock data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProjects.findIndex(p => p.id === projectId);
        if (index === -1) {
          reject(new Error(`Project with ID ${projectId} not found`));
          return;
        }
        
        mockProjects.splice(index, 1);
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw error;
  }
};

export const fetchTasksByProjectId = async (projectId: string): Promise<any[]> => {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId);
    // if (error) throw error;
    // return data;
    
    // For now, we'll mock this by returning an empty array
    // In a real implementation, this would retrieve tasks associated with the project
    return new Promise(resolve => {
      setTimeout(() => resolve([]), 300);
    });
  } catch (error) {
    console.error(`Error fetching tasks for project with ID ${projectId}:`, error);
    throw error;
  }
};

export const getProjectStatuses = (): Array<Project['status']> => {
  return ['Planning', 'Active', 'On Hold', 'Completed'];
}; 