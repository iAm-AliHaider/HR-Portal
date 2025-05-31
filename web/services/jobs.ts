import { supabase } from "../lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import {
  Job,
  JobStage,
  JobTemplate,
  Department,
  JobCategory,
} from "../../packages/types";

// Mock data for development
const mockDepartments: Department[] = [
  {
    id: "dept1",
    org_id: "org1",
    name: "Engineering",
    description: "Software development and technical operations",
    manager_id: "user1",
    created_at: new Date().toISOString(),
  },
  {
    id: "dept2",
    org_id: "org1",
    name: "Human Resources",
    description: "HR management and employee relations",
    manager_id: "user2",
    created_at: new Date().toISOString(),
  },
  {
    id: "dept3",
    org_id: "org1",
    name: "Marketing",
    description: "Brand, marketing, and communications",
    manager_id: "user3",
    created_at: new Date().toISOString(),
  },
  {
    id: "dept4",
    org_id: "org1",
    name: "Finance",
    description: "Financial management and accounting",
    manager_id: "user4",
    created_at: new Date().toISOString(),
  },
  {
    id: "dept5",
    org_id: "org1",
    name: "Customer Service",
    description: "Customer support and success",
    manager_id: "user5",
    created_at: new Date().toISOString(),
  },
];

const mockCategories: JobCategory[] = [
  {
    id: "cat1",
    name: "Technical",
    description: "Engineering and development roles",
  },
  {
    id: "cat2",
    name: "Management",
    description: "Leadership and management positions",
  },
  {
    id: "cat3",
    name: "Marketing",
    description: "Marketing and communications roles",
  },
  {
    id: "cat4",
    name: "Finance",
    description: "Financial and accounting positions",
  },
  {
    id: "cat5",
    name: "Support",
    description: "Customer service and support roles",
  },
];

const defaultStages: JobStage[] = [
  {
    id: "stage1",
    org_id: "org1",
    name: "Application Review",
    description: "Initial screening of applications",
    order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "stage2",
    org_id: "org1",
    name: "Phone Interview",
    description: "Initial phone screening with recruiter",
    order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "stage3",
    org_id: "org1",
    name: "Technical Assessment",
    description: "Technical skills evaluation",
    order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "stage4",
    org_id: "org1",
    name: "Team Interview",
    description: "Interview with the potential team",
    order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "stage5",
    org_id: "org1",
    name: "Final Interview",
    description: "Final interview with hiring manager",
    order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "stage6",
    org_id: "org1",
    name: "Offer",
    description: "Offer preparation and negotiation",
    order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "stage7",
    org_id: "org1",
    name: "Hired",
    description: "Candidate has accepted the offer",
    order: 7,
    created_at: new Date().toISOString(),
  },
];

// Mock jobs data with extended fields
const mockJobs: Job[] = [
  {
    id: "job1",
    org_id: "org1",
    title: "Senior Software Engineer",
    dept_id: "dept1",
    category_id: "cat1",
    description:
      "We are looking for a senior software engineer with extensive experience in React, Node.js, and cloud infrastructure.",
    status: "published",
    created_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
    closes_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    location: "San Francisco, CA",
    job_type: "full_time",
    salary_range: {
      min: 120000,
      max: 160000,
      currency: "USD",
    },
    experience_level: "5+ years",
    education_level: "Bachelor's degree",
    skills_required: ["React", "Node.js", "TypeScript", "AWS", "CI/CD"],
    responsibilities: [
      "Design and implement new features for our web application",
      "Work closely with product managers and designers",
      "Mentor junior developers and conduct code reviews",
      "Optimize application performance and scalability",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work schedule",
      "401(k) matching",
      "Professional development budget",
    ],
    poster_id: "user1",
    stage_ids: [
      "stage1",
      "stage2",
      "stage3",
      "stage4",
      "stage5",
      "stage6",
      "stage7",
    ],
    is_remote: false,
    is_featured: true,
    application_count: 24,
    views_count: 432,
  },
  {
    id: "job2",
    org_id: "org1",
    title: "HR Manager",
    dept_id: "dept2",
    category_id: "cat2",
    description:
      "We are seeking an experienced HR Manager to lead our Human Resources department and implement effective HR strategies.",
    status: "published",
    created_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
    closes_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    location: "New York, NY",
    job_type: "full_time",
    salary_range: {
      min: 90000,
      max: 130000,
      currency: "USD",
    },
    experience_level: "7+ years",
    education_level: "Bachelor's degree",
    skills_required: [
      "HR Management",
      "Recruitment",
      "Performance Management",
      "Employment Law",
      "HRIS",
    ],
    responsibilities: [
      "Develop and implement HR initiatives aligned with organizational objectives",
      "Manage recruitment and onboarding processes",
      "Oversee employee relations, performance management, and talent development",
      "Ensure compliance with labor laws and regulations",
    ],
    benefits: [
      "Competitive salary",
      "Health, dental, and vision insurance",
      "Flexible work schedule",
      "401(k) matching",
      "Professional development budget",
    ],
    poster_id: "user2",
    stage_ids: ["stage1", "stage2", "stage4", "stage5", "stage6", "stage7"],
    is_remote: false,
    is_featured: true,
    application_count: 18,
    views_count: 285,
  },
  {
    id: "job3",
    org_id: "org1",
    title: "Marketing Specialist",
    dept_id: "dept3",
    category_id: "cat3",
    description:
      "We are looking for a creative Marketing Specialist to join our team and help drive our marketing campaigns and initiatives.",
    status: "published",
    created_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
    closes_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    location: "Chicago, IL",
    job_type: "full_time",
    salary_range: {
      min: 65000,
      max: 85000,
      currency: "USD",
    },
    experience_level: "3+ years",
    education_level: "Bachelor's degree",
    skills_required: [
      "Digital Marketing",
      "Content Creation",
      "Social Media",
      "Analytics",
      "SEO",
    ],
    responsibilities: [
      "Create and execute marketing campaigns across various channels",
      "Analyze market trends and competitor activities",
      "Develop content for digital marketing platforms",
      "Track and report on marketing KPIs",
    ],
    benefits: [
      "Competitive salary",
      "Health, dental, and vision insurance",
      "Flexible work schedule",
      "401(k) matching",
      "Professional development budget",
    ],
    poster_id: "user3",
    stage_ids: ["stage1", "stage2", "stage4", "stage5", "stage6", "stage7"],
    is_remote: false,
    is_featured: false,
    application_count: 32,
    views_count: 520,
  },
  {
    id: "job4",
    org_id: "org1",
    title: "Financial Analyst",
    dept_id: "dept4",
    category_id: "cat4",
    description:
      "We are seeking a detail-oriented Financial Analyst to join our Finance team and support financial planning and analysis.",
    status: "published",
    created_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
    closes_at: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days from now
    location: "Remote",
    job_type: "full_time",
    salary_range: {
      min: 70000,
      max: 95000,
      currency: "USD",
    },
    experience_level: "2+ years",
    education_level: "Bachelor's degree",
    skills_required: [
      "Financial Analysis",
      "Excel",
      "Financial Modeling",
      "Forecasting",
      "Budgeting",
    ],
    responsibilities: [
      "Prepare financial forecasts, budgets, and reports",
      "Analyze financial data and identify trends",
      "Support month-end and year-end financial closings",
      "Collaborate with other departments on financial matters",
    ],
    benefits: [
      "Competitive salary",
      "Health, dental, and vision insurance",
      "Flexible remote work",
      "401(k) matching",
      "Professional development budget",
    ],
    poster_id: "user4",
    stage_ids: ["stage1", "stage2", "stage4", "stage5", "stage6", "stage7"],
    is_remote: true,
    is_featured: false,
    application_count: 15,
    views_count: 210,
  },
  {
    id: "job5",
    org_id: "org1",
    title: "Customer Support Representative",
    dept_id: "dept5",
    category_id: "cat5",
    description:
      "We are looking for a customer-focused Support Representative to join our team and provide exceptional service to our clients.",
    status: "published",
    created_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
    closes_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    location: "Austin, TX",
    job_type: "part_time",
    salary_range: {
      min: 20,
      max: 25,
      currency: "USD",
    },
    experience_level: "1+ years",
    education_level: "High School Diploma",
    skills_required: [
      "Customer Service",
      "Communication",
      "Problem Solving",
      "Ticketing Systems",
      "Technical Support",
    ],
    responsibilities: [
      "Respond to customer inquiries via phone, email, and chat",
      "Troubleshoot and resolve customer issues",
      "Maintain customer records and document interactions",
      "Provide feedback to improve customer experience",
    ],
    benefits: [
      "Competitive hourly rate",
      "Flexible schedule",
      "Professional development opportunities",
      "Employee discount program",
    ],
    poster_id: "user5",
    stage_ids: ["stage1", "stage2", "stage5", "stage6", "stage7"],
    is_remote: false,
    is_featured: false,
    application_count: 40,
    views_count: 610,
  },
];

// Mock job templates
const mockJobTemplates: JobTemplate[] = [
  {
    id: "template1",
    org_id: "org1",
    title: "Software Engineer Template",
    description: "Template for software engineering positions",
    category_id: "cat1",
    dept_id: "dept1",
    stage_ids: [
      "stage1",
      "stage2",
      "stage3",
      "stage4",
      "stage5",
      "stage6",
      "stage7",
    ],
    skills_required: ["JavaScript", "React", "Node.js"],
    responsibilities: [
      "Design and develop software solutions",
      "Collaborate with cross-functional teams",
      "Write clean, maintainable code",
      "Participate in code reviews",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Flexible work environment",
      "Professional development budget",
    ],
    created_at: new Date().toISOString(),
    created_by: "user1",
  },
  {
    id: "template2",
    org_id: "org1",
    title: "Marketing Role Template",
    description: "Template for marketing positions",
    category_id: "cat3",
    dept_id: "dept3",
    stage_ids: ["stage1", "stage2", "stage4", "stage5", "stage6", "stage7"],
    skills_required: ["Digital Marketing", "Content Creation", "Social Media"],
    responsibilities: [
      "Create and execute marketing campaigns",
      "Develop engaging content",
      "Analyze marketing metrics",
      "Contribute to marketing strategy",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Flexible work environment",
      "Professional development budget",
    ],
    created_at: new Date().toISOString(),
    created_by: "user3",
  },
];

// Jobs API
export async function getJobs(org_id: string): Promise<Job[]> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('jobs').select('*').eq('org_id', org_id);
    // if (error) throw error;
    // return data;

    // For now, return mock data
    return mockJobs.filter((job) => job.org_id === org_id);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;

    // For now, return mock data
    const job = mockJobs.find((job) => job.id === id);
    return job || null;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    throw error;
  }
}

export async function createJob(job: Partial<Job>): Promise<Job> {
  try {
    const newJob: Job = {
      ...job,
      id: job.id || uuidv4(),
      org_id: job.org_id || "org1",
      status: job.status || "draft",
      created_at: new Date().toISOString(),
      poster_id: job.poster_id || "user1",
      application_count: 0,
      views_count: 0,
    } as Job;

    // In a real application, this would insert into Supabase
    // const { data, error } = await supabase.from('jobs').insert([newJob]).select().single();
    // if (error) throw error;
    // return data;

    // For now, add to mock data
    mockJobs.push(newJob);
    return newJob;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

export async function updateJob(
  id: string,
  updates: Partial<Job>,
): Promise<Job> {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single();
    // if (error) throw error;
    // return data;

    // For now, update mock data
    const index = mockJobs.findIndex((job) => job.id === id);
    if (index === -1) throw new Error(`Job with ID ${id} not found`);

    mockJobs[index] = {
      ...mockJobs[index],
      ...updates,
    };

    return mockJobs[index];
  } catch (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteJob(id: string): Promise<void> {
  try {
    // In a real application, this would delete from Supabase
    // const { error } = await supabase.from('jobs').delete().eq('id', id);
    // if (error) throw error;

    // For now, remove from mock data
    const index = mockJobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      mockJobs.splice(index, 1);
    }
  } catch (error) {
    console.error(`Error deleting job with ID ${id}:`, error);
    throw error;
  }
}

export async function publishJob(id: string): Promise<Job> {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase
    //   .from('jobs')
    //   .update({ status: 'published', posted_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;

    // For now, update mock data
    return updateJob(id, {
      status: "published",
      posted_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error publishing job with ID ${id}:`, error);
    throw error;
  }
}

export async function closeJob(id: string): Promise<Job> {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase
    //   .from('jobs')
    //   .update({ status: 'closed' })
    //   .eq('id', id)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;

    // For now, update mock data
    return updateJob(id, { status: "closed" });
  } catch (error) {
    console.error(`Error closing job with ID ${id}:`, error);
    throw error;
  }
}

export async function archiveJob(id: string): Promise<Job> {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase
    //   .from('jobs')
    //   .update({ status: 'archived' })
    //   .eq('id', id)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;

    // For now, update mock data
    return updateJob(id, { status: "archived" });
  } catch (error) {
    console.error(`Error archiving job with ID ${id}:`, error);
    throw error;
  }
}

// Job Stages API
export async function getJobStages(org_id: string): Promise<JobStage[]> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('job_stages').select('*').eq('org_id', org_id).order('order');
    // if (error) throw error;
    // return data;

    // For now, return default stages
    return defaultStages.filter((stage) => stage.org_id === org_id);
  } catch (error) {
    console.error("Error fetching job stages:", error);
    throw error;
  }
}

export async function getJobStageById(id: string): Promise<JobStage | null> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('job_stages').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;

    // For now, return from default stages
    const stage = defaultStages.find((stage) => stage.id === id);
    return stage || null;
  } catch (error) {
    console.error(`Error fetching job stage with ID ${id}:`, error);
    throw error;
  }
}

export async function createJobStage(
  stage: Partial<JobStage>,
): Promise<JobStage> {
  try {
    const newStage: JobStage = {
      ...stage,
      id: stage.id || uuidv4(),
      org_id: stage.org_id || "org1",
      created_at: new Date().toISOString(),
      order: stage.order || 0,
    } as JobStage;

    // In a real application, this would insert into Supabase
    // const { data, error } = await supabase.from('job_stages').insert([newStage]).select().single();
    // if (error) throw error;
    // return data;

    // For now, add to default stages
    defaultStages.push(newStage);
    return newStage;
  } catch (error) {
    console.error("Error creating job stage:", error);
    throw error;
  }
}

export async function updateJobStage(
  id: string,
  updates: Partial<JobStage>,
): Promise<JobStage> {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase.from('job_stages').update(updates).eq('id', id).select().single();
    // if (error) throw error;
    // return data;

    // For now, update default stages
    const index = defaultStages.findIndex((stage) => stage.id === id);
    if (index === -1) throw new Error(`Job stage with ID ${id} not found`);

    defaultStages[index] = {
      ...defaultStages[index],
      ...updates,
    };

    return defaultStages[index];
  } catch (error) {
    console.error(`Error updating job stage with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteJobStage(id: string): Promise<void> {
  try {
    // In a real application, this would delete from Supabase
    // const { error } = await supabase.from('job_stages').delete().eq('id', id);
    // if (error) throw error;

    // For now, remove from default stages
    const index = defaultStages.findIndex((stage) => stage.id === id);
    if (index !== -1) {
      defaultStages.splice(index, 1);
    }
  } catch (error) {
    console.error(`Error deleting job stage with ID ${id}:`, error);
    throw error;
  }
}

// Job Templates API
export async function getJobTemplates(org_id: string): Promise<JobTemplate[]> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('job_templates').select('*').eq('org_id', org_id);
    // if (error) throw error;
    // return data;

    // For now, return mock templates
    return mockJobTemplates.filter((template) => template.org_id === org_id);
  } catch (error) {
    console.error("Error fetching job templates:", error);
    throw error;
  }
}

export async function getJobTemplateById(
  id: string,
): Promise<JobTemplate | null> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('job_templates').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;

    // For now, return from mock templates
    const template = mockJobTemplates.find((template) => template.id === id);
    return template || null;
  } catch (error) {
    console.error(`Error fetching job template with ID ${id}:`, error);
    throw error;
  }
}

export async function createJobTemplate(
  template: Partial<JobTemplate>,
): Promise<JobTemplate> {
  try {
    const newTemplate: JobTemplate = {
      ...template,
      id: template.id || uuidv4(),
      org_id: template.org_id || "org1",
      created_at: new Date().toISOString(),
      created_by: template.created_by || "user1",
    } as JobTemplate;

    // In a real application, this would insert into Supabase
    // const { data, error } = await supabase.from('job_templates').insert([newTemplate]).select().single();
    // if (error) throw error;
    // return data;

    // For now, add to mock templates
    mockJobTemplates.push(newTemplate);
    return newTemplate;
  } catch (error) {
    console.error("Error creating job template:", error);
    throw error;
  }
}

export async function updateJobTemplate(
  id: string,
  updates: Partial<JobTemplate>,
): Promise<JobTemplate> {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase.from('job_templates').update(updates).eq('id', id).select().single();
    // if (error) throw error;
    // return data;

    // For now, update mock templates
    const index = mockJobTemplates.findIndex((template) => template.id === id);
    if (index === -1) throw new Error(`Job template with ID ${id} not found`);

    mockJobTemplates[index] = {
      ...mockJobTemplates[index],
      ...updates,
    };

    return mockJobTemplates[index];
  } catch (error) {
    console.error(`Error updating job template with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteJobTemplate(id: string): Promise<void> {
  try {
    // In a real application, this would delete from Supabase
    // const { error } = await supabase.from('job_templates').delete().eq('id', id);
    // if (error) throw error;

    // For now, remove from mock templates
    const index = mockJobTemplates.findIndex((template) => template.id === id);
    if (index !== -1) {
      mockJobTemplates.splice(index, 1);
    }
  } catch (error) {
    console.error(`Error deleting job template with ID ${id}:`, error);
    throw error;
  }
}

export async function createJobFromTemplate(
  templateId: string,
  jobData: Partial<Job>,
): Promise<Job> {
  try {
    const template = await getJobTemplateById(templateId);
    if (!template)
      throw new Error(`Job template with ID ${templateId} not found`);

    const newJob: Partial<Job> = {
      ...jobData,
      title: jobData.title || template.title,
      description: jobData.description || template.description,
      dept_id: jobData.dept_id || template.dept_id,
      category_id: jobData.category_id || template.category_id,
      stage_ids: jobData.stage_ids || template.stage_ids,
      skills_required: jobData.skills_required || template.skills_required,
      responsibilities: jobData.responsibilities || template.responsibilities,
      benefits: jobData.benefits || template.benefits,
      template_id: templateId,
    };

    return createJob(newJob);
  } catch (error) {
    console.error(`Error creating job from template ${templateId}:`, error);
    throw error;
  }
}

// Departments API
export async function getDepartments(org_id: string): Promise<Department[]> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('departments').select('*').eq('org_id', org_id);
    // if (error) throw error;
    // return data;

    // For now, return mock departments
    return mockDepartments.filter((dept) => dept.org_id === org_id);
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
}

export async function getJobCategories(): Promise<JobCategory[]> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('job_categories').select('*');
    // if (error) throw error;
    // return data;

    // For now, return mock categories
    return mockCategories;
  } catch (error) {
    console.error("Error fetching job categories:", error);
    throw error;
  }
}
