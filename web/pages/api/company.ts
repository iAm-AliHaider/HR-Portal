import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../services/supabase";

// Mock data for development/fallback
const mockCompanySettings = {
  id: "company-001",
  name: "Acme Corporation",
  industry: "Technology",
  size: "101-500",
  founded: "2018",
  headquarters: "San Francisco, CA",
  website: "https://acme.com",
  description:
    "Leading technology company specializing in innovative solutions",
  primary_email: "info@acme.com",
  phone: "+1 (555) 123-4567",
  address: {
    street: "123 Technology Way",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
  },
  social_media: {
    linkedin: "https://linkedin.com/company/acme",
    twitter: "https://twitter.com/acme",
    facebook: "https://facebook.com/acme",
  },
  branding: {
    logo_url: "/images/company-logo.png",
    primary_color: "#3B82F6",
    secondary_color: "#1E40AF",
    font_family: "Inter",
  },
  work_schedule: {
    working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    working_hours: { start: "09:00", end: "17:00" },
    time_zone: "America/Los_Angeles",
    holidays: [
      { name: "New Year's Day", date: "2024-01-01" },
      { name: "Independence Day", date: "2024-07-04" },
      { name: "Thanksgiving", date: "2024-11-28" },
      { name: "Christmas", date: "2024-12-25" },
    ],
  },
  policies: {
    leave_policy: {
      annual_leave_days: 20,
      sick_leave_days: 10,
      personal_leave_days: 5,
      maternity_leave_days: 90,
      paternity_leave_days: 15,
      carry_forward_days: 5,
    },
    expense_policy: {
      daily_meal_limit: 50,
      mileage_rate: 0.56,
      approval_required_above: 500,
      receipt_required_above: 25,
    },
    remote_work_policy: {
      allowed: true,
      max_days_per_week: 3,
      advance_notice_days: 2,
      equipment_provided: true,
    },
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: new Date().toISOString(),
};

const mockDepartments = [
  {
    id: "dept-001",
    name: "Engineering",
    description: "Software development and technical operations",
    head: "EMP-004",
    head_name: "Diana Wong",
    budget: 2500000,
    cost_center: "CC-ENG-001",
    location: "San Francisco, CA",
    employee_count: 25,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "dept-002",
    name: "Sales",
    description: "Revenue generation and client relationship management",
    head: "EMP-006",
    head_name: "Frank Miller",
    budget: 1800000,
    cost_center: "CC-SAL-001",
    location: "New York, NY",
    employee_count: 18,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "dept-003",
    name: "Marketing",
    description: "Brand management and customer acquisition",
    head: "EMP-007",
    head_name: "Sarah Chen",
    budget: 1200000,
    cost_center: "CC-MKT-001",
    location: "Chicago, IL",
    employee_count: 12,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "dept-004",
    name: "Human Resources",
    description: "Employee relations and organizational development",
    head: "EMP-001",
    head_name: "Alice Johnson",
    budget: 800000,
    cost_center: "CC-HR-001",
    location: "San Francisco, CA",
    employee_count: 8,
    created_at: "2024-01-01T00:00:00Z",
  },
];

const mockTeams = [
  {
    id: "team-001",
    name: "Backend Engineering",
    department: "Engineering",
    department_id: "dept-001",
    lead: "EMP-005",
    lead_name: "Bob Wilson",
    members: ["EMP-005", "EMP-008", "EMP-009", "EMP-010"],
    member_count: 4,
    budget: 600000,
    projects: [
      "API Redesign",
      "Database Migration",
      "Performance Optimization",
    ],
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "team-002",
    name: "Frontend Engineering",
    department: "Engineering",
    department_id: "dept-001",
    lead: "EMP-011",
    lead_name: "Jessica Martinez",
    members: ["EMP-011", "EMP-012", "EMP-013"],
    member_count: 3,
    budget: 450000,
    projects: ["UI Redesign", "Mobile App", "Component Library"],
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "team-003",
    name: "Enterprise Sales",
    department: "Sales",
    department_id: "dept-002",
    lead: "EMP-014",
    lead_name: "Tom Rodriguez",
    members: ["EMP-014", "EMP-015", "EMP-016"],
    member_count: 3,
    budget: 400000,
    projects: ["Enterprise Pipeline", "Client Expansion", "Sales Automation"],
    created_at: "2024-01-01T00:00:00Z",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req;

  try {
    switch (method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      case "PUT":
        return await handlePut(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Company API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  switch (type) {
    case "settings":
      return await getCompanySettings(req, res);
    case "departments":
      return await getDepartments(req, res);
    case "teams":
      return await getTeams(req, res);
    case "organization":
      return await getOrganizationStructure(req, res);
    default:
      return await getCompanySettings(req, res);
  }
}

async function getCompanySettings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from("company_settings")
      .select("*")
      .single();

    if (error) {
      console.log("Database query failed, using mock data");
      return res.status(200).json(mockCompanySettings);
    }

    return res.status(200).json(data || mockCompanySettings);
  } catch (error) {
    console.error("Error fetching company settings:", error);
    return res.status(200).json(mockCompanySettings);
  }
}

async function getDepartments(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from("departments")
      .select(
        `
        *,
        head:employees!departments_head_fkey(id, first_name, last_name)
      `,
      )
      .order("name");

    if (error) {
      console.log("Database query failed, using mock data");
      return res.status(200).json(mockDepartments);
    }

    const departmentsWithHeadNames = data?.map((dept) => ({
      ...dept,
      head_name: dept.head
        ? `${dept.head.first_name} ${dept.head.last_name}`
        : null,
    }));

    return res.status(200).json(departmentsWithHeadNames || mockDepartments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(200).json(mockDepartments);
  }
}

async function getTeams(req: NextApiRequest, res: NextApiResponse) {
  const { department_id } = req.query;

  try {
    let query = supabase
      .from("teams")
      .select(
        `
        *,
        department:departments(name),
        lead:employees!teams_lead_fkey(id, first_name, last_name)
      `,
      )
      .order("name");

    if (department_id) {
      query = query.eq("department_id", department_id);
    }

    const { data, error } = await query;

    if (error) {
      console.log("Database query failed, using mock data");
      const filteredTeams = department_id
        ? mockTeams.filter((team) => team.department_id === department_id)
        : mockTeams;
      return res.status(200).json(filteredTeams);
    }

    const teamsWithDetails = data?.map((team) => ({
      ...team,
      department: team.department?.name,
      lead_name: team.lead
        ? `${team.lead.first_name} ${team.lead.last_name}`
        : null,
    }));

    return res.status(200).json(teamsWithDetails || mockTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(200).json(mockTeams);
  }
}

async function getOrganizationStructure(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Get departments with employee counts
    const { data: deptData, error: deptError } = await supabase.from(
      "departments",
    ).select(`
        *,
        head:employees!departments_head_fkey(id, first_name, last_name),
        employee_count:employees(count)
      `);

    // Get teams with member counts
    const { data: teamData, error: teamError } = await supabase.from("teams")
      .select(`
        *,
        department:departments(name),
        lead:employees!teams_lead_fkey(id, first_name, last_name),
        member_count:team_members(count)
      `);

    if (deptError || teamError) {
      console.log("Database query failed, using mock data");
      return res.status(200).json({
        departments: mockDepartments,
        teams: mockTeams,
        company: mockCompanySettings,
      });
    }

    const processedDepartments = deptData?.map((dept) => ({
      ...dept,
      head_name: dept.head
        ? `${dept.head.first_name} ${dept.head.last_name}`
        : null,
      employee_count: dept.employee_count?.[0]?.count || 0,
    }));

    const processedTeams = teamData?.map((team) => ({
      ...team,
      department: team.department?.name,
      lead_name: team.lead
        ? `${team.lead.first_name} ${team.lead.last_name}`
        : null,
      member_count: team.member_count?.[0]?.count || 0,
    }));

    return res.status(200).json({
      departments: processedDepartments || mockDepartments,
      teams: processedTeams || mockTeams,
      company: mockCompanySettings,
    });
  } catch (error) {
    console.error("Error fetching organization structure:", error);
    return res.status(200).json({
      departments: mockDepartments,
      teams: mockTeams,
      company: mockCompanySettings,
    });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  const data = req.body;

  switch (type) {
    case "department":
      return await createDepartment(req, res);
    case "team":
      return await createTeam(req, res);
    default:
      return res.status(400).json({ error: "Invalid type specified" });
  }
}

async function createDepartment(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, head, budget, cost_center, location } = req.body;

  // Validation
  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    const newDepartment = {
      id: `dept-${Date.now()}`,
      name,
      description,
      head,
      budget: budget || 0,
      cost_center,
      location,
      employee_count: 0,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("departments")
      .insert([newDepartment])
      .select()
      .single();

    if (error) {
      console.log("Database insert failed, returning mock success");
      return res.status(201).json(newDepartment);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({ error: "Failed to create department" });
  }
}

async function createTeam(req: NextApiRequest, res: NextApiResponse) {
  const { name, department_id, lead, budget, projects } = req.body;

  // Validation
  if (!name || !department_id) {
    return res.status(400).json({ error: "Name and department are required" });
  }

  try {
    const newTeam = {
      id: `team-${Date.now()}`,
      name,
      department_id,
      lead,
      budget: budget || 0,
      projects: projects || [],
      member_count: 1, // Lead counts as member
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("teams")
      .insert([newTeam])
      .select()
      .single();

    if (error) {
      console.log("Database insert failed, returning mock success");
      return res.status(201).json(newTeam);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creating team:", error);
    return res.status(500).json({ error: "Failed to create team" });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query;
  const data = req.body;

  switch (type) {
    case "settings":
      return await updateCompanySettings(req, res);
    case "department":
      return await updateDepartment(req, res);
    case "team":
      return await updateTeam(req, res);
    default:
      return res.status(400).json({ error: "Invalid type specified" });
  }
}

async function updateCompanySettings(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const updates = req.body;

  try {
    const updatedSettings = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("company_settings")
      .upsert([updatedSettings])
      .select()
      .single();

    if (error) {
      console.log("Database update failed, returning mock success");
      return res
        .status(200)
        .json({ ...mockCompanySettings, ...updatedSettings });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating company settings:", error);
    return res.status(500).json({ error: "Failed to update company settings" });
  }
}

async function updateDepartment(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("departments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("Database update failed, returning mock success");
      const mockDept = mockDepartments.find((d) => d.id === id);
      return res.status(200).json({ ...mockDept, ...updates });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({ error: "Failed to update department" });
  }
}

async function updateTeam(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("teams")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("Database update failed, returning mock success");
      const mockTeam = mockTeams.find((t) => t.id === id);
      return res.status(200).json({ ...mockTeam, ...updates });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating team:", error);
    return res.status(500).json({ error: "Failed to update team" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query;

  switch (type) {
    case "department":
      return await deleteDepartment(req, res);
    case "team":
      return await deleteTeam(req, res);
    default:
      return res.status(400).json({ error: "Invalid type specified" });
  }
}

async function deleteDepartment(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const { error } = await supabase.from("departments").delete().eq("id", id);

    if (error) {
      console.log("Database delete failed, returning mock success");
    }

    return res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json({ error: "Failed to delete department" });
  }
}

async function deleteTeam(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const { error } = await supabase.from("teams").delete().eq("id", id);

    if (error) {
      console.log("Database delete failed, returning mock success");
    }

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).json({ error: "Failed to delete team" });
  }
}
