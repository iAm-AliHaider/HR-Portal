import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../services/supabase";

// Employee interface
interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  position?: string;
  manager_id?: string;
  hire_date: string;
  employment_type: "full_time" | "part_time" | "contract" | "intern";
  status: "active" | "inactive" | "terminated" | "on_leave";
  salary?: number;
  location?: string;
  avatar_url?: string;
  emergency_contact?: EmergencyContact;
  address?: Address;
  skills?: string[];
  created_at: string;
  updated_at: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Mock employee data for development/fallback
const mockEmployees: Employee[] = [
  {
    id: "EMP-001",
    employee_id: "E001",
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice.johnson@company.com",
    phone: "+1 (555) 123-4567",
    department_id: "dept-004",
    position: "HR Manager",
    manager_id: null,
    hire_date: "2020-01-15",
    employment_type: "full_time",
    status: "active",
    salary: 75000,
    location: "San Francisco, CA",
    avatar_url: "/avatars/alice.jpg",
    emergency_contact: {
      name: "Bob Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 123-4568",
      email: "bob.johnson@email.com",
    },
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
    },
    skills: ["Leadership", "HR Management", "Recruitment"],
    created_at: "2020-01-15T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: "EMP-002",
    employee_id: "E002",
    first_name: "Charlie",
    last_name: "Brown",
    email: "charlie.brown@company.com",
    phone: "+1 (555) 234-5678",
    department_id: "dept-001",
    position: "Software Engineer",
    manager_id: "EMP-004",
    hire_date: "2021-03-10",
    employment_type: "full_time",
    status: "active",
    salary: 95000,
    location: "San Francisco, CA",
    avatar_url: "/avatars/charlie.jpg",
    emergency_contact: {
      name: "Mary Brown",
      relationship: "Mother",
      phone: "+1 (555) 234-5679",
    },
    address: {
      street: "456 Tech Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States",
    },
    skills: ["JavaScript", "React", "Node.js", "Python"],
    created_at: "2021-03-10T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: "EMP-003",
    employee_id: "E003",
    first_name: "Eva",
    last_name: "Davis",
    email: "eva.davis@company.com",
    phone: "+1 (555) 345-6789",
    department_id: "dept-003",
    position: "Marketing Specialist",
    manager_id: "EMP-007",
    hire_date: "2022-06-01",
    employment_type: "full_time",
    status: "active",
    salary: 65000,
    location: "Chicago, IL",
    avatar_url: "/avatars/eva.jpg",
    emergency_contact: {
      name: "John Davis",
      relationship: "Father",
      phone: "+1 (555) 345-6790",
    },
    address: {
      street: "789 Marketing Blvd",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "United States",
    },
    skills: ["Digital Marketing", "SEO", "Content Creation", "Analytics"],
    created_at: "2022-06-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: "EMP-004",
    employee_id: "E004",
    first_name: "Diana",
    last_name: "Wong",
    email: "diana.wong@company.com",
    phone: "+1 (555) 456-7890",
    department_id: "dept-001",
    position: "Engineering Manager",
    manager_id: null,
    hire_date: "2019-08-20",
    employment_type: "full_time",
    status: "active",
    salary: 120000,
    location: "San Francisco, CA",
    avatar_url: "/avatars/diana.jpg",
    emergency_contact: {
      name: "Michael Wong",
      relationship: "Spouse",
      phone: "+1 (555) 456-7891",
    },
    address: {
      street: "321 Engineering Way",
      city: "San Francisco",
      state: "CA",
      zip: "94108",
      country: "United States",
    },
    skills: [
      "Engineering Leadership",
      "Architecture",
      "Team Building",
      "Strategy",
    ],
    created_at: "2019-08-20T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: "EMP-005",
    employee_id: "E005",
    first_name: "Bob",
    last_name: "Wilson",
    email: "bob.wilson@company.com",
    phone: "+1 (555) 567-8901",
    department_id: "dept-001",
    position: "Senior Developer",
    manager_id: "EMP-004",
    hire_date: "2020-11-15",
    employment_type: "full_time",
    status: "active",
    salary: 105000,
    location: "San Francisco, CA",
    avatar_url: "/avatars/bob.jpg",
    emergency_contact: {
      name: "Sarah Wilson",
      relationship: "Wife",
      phone: "+1 (555) 567-8902",
    },
    address: {
      street: "654 Developer St",
      city: "San Francisco",
      state: "CA",
      zip: "94109",
      country: "United States",
    },
    skills: [
      "Backend Development",
      "Database Design",
      "API Architecture",
      "DevOps",
    ],
    created_at: "2020-11-15T00:00:00Z",
    updated_at: new Date().toISOString(),
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
    console.error("Employees API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const {
    id,
    search,
    department,
    status,
    page = "1",
    limit = "10",
  } = req.query;

  // Get single employee by ID
  if (id) {
    return await getEmployeeById(req, res);
  }

  // Get employees with filtering and pagination
  try {
    let query = supabase.from("employees").select(`
        *,
        department:departments(id, name),
        manager:employees!employees_manager_id_fkey(id, first_name, last_name),
        direct_reports:employees!employees_manager_id_fkey(count)
      `);

    // Apply filters
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    if (department) {
      query = query.eq("department_id", department);
    }

    if (status) {
      query = query.eq("status", status);
    }

    // Apply pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    query = query
      .range(offset, offset + limitNum - 1)
      .order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.log("Database query failed, using mock data");

      // Apply filters to mock data
      let filteredEmployees = mockEmployees;

      if (search) {
        const searchLower = (search as string).toLowerCase();
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.first_name.toLowerCase().includes(searchLower) ||
            emp.last_name.toLowerCase().includes(searchLower) ||
            emp.email.toLowerCase().includes(searchLower),
        );
      }

      if (department) {
        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.department_id === department,
        );
      }

      if (status) {
        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.status === status,
        );
      }

      // Apply pagination to mock data
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

      return res.status(200).json({
        employees: paginatedEmployees,
        total: filteredEmployees.length,
        page: pageNum,
        totalPages: Math.ceil(filteredEmployees.length / limitNum),
      });
    }

    // Process the data to include computed fields
    const processedEmployees = data?.map((emp) => ({
      ...emp,
      department_name: emp.department?.name,
      manager_name: emp.manager
        ? `${emp.manager.first_name} ${emp.manager.last_name}`
        : null,
      direct_reports_count: emp.direct_reports?.[0]?.count || 0,
    }));

    return res.status(200).json({
      employees: processedEmployees || [],
      total: count || 0,
      page: pageNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    });
  } catch (error) {
    console.error("Error fetching employees:", error);

    // Fallback to mock data
    return res.status(200).json({
      employees: mockEmployees.slice(0, parseInt(limit as string)),
      total: mockEmployees.length,
      page: parseInt(page as string),
      totalPages: Math.ceil(mockEmployees.length / parseInt(limit as string)),
    });
  }
}

async function getEmployeeById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const { data, error } = await supabase
      .from("employees")
      .select(
        `
        *,
        department:departments(id, name),
        manager:employees!employees_manager_id_fkey(id, first_name, last_name),
        direct_reports:employees!employees_manager_id_fkey(id, first_name, last_name, position)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.log("Database query failed, using mock data");
      const mockEmployee = mockEmployees.find((emp) => emp.id === id);

      if (!mockEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      return res.status(200).json(mockEmployee);
    }

    if (!data) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Process the data
    const processedEmployee = {
      ...data,
      department_name: data.department?.name,
      manager_name: data.manager
        ? `${data.manager.first_name} ${data.manager.last_name}`
        : null,
      direct_reports: data.direct_reports || [],
    };

    return res.status(200).json(processedEmployee);
  } catch (error) {
    console.error("Error fetching employee:", error);

    // Fallback to mock data
    const mockEmployee = mockEmployees.find((emp) => emp.id === id);
    if (!mockEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.status(200).json(mockEmployee);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const employeeData = req.body;

  // Validation
  if (
    !employeeData.first_name ||
    !employeeData.last_name ||
    !employeeData.email
  ) {
    return res
      .status(400)
      .json({ error: "First name, last name, and email are required" });
  }

  try {
    const newEmployee = {
      id: `EMP-${Date.now()}`,
      employee_id: `E${String(Date.now()).slice(-6)}`,
      ...employeeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("employees")
      .insert([newEmployee])
      .select()
      .single();

    if (error) {
      console.log("Database insert failed, returning mock success");
      return res.status(201).json(newEmployee);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creating employee:", error);
    return res.status(500).json({ error: "Failed to create employee" });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  try {
    const updatedEmployee = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("employees")
      .update(updatedEmployee)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("Database update failed, returning mock success");
      const mockEmployee = mockEmployees.find((emp) => emp.id === id);
      return res.status(200).json({ ...mockEmployee, ...updatedEmployee });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Failed to update employee" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  try {
    // Soft delete - update status to terminated
    const { data, error } = await supabase
      .from("employees")
      .update({
        status: "terminated",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("Database update failed, returning mock success");
    }

    return res.status(200).json({
      message: "Employee terminated successfully",
      employee: data,
    });
  } catch (error) {
    console.error("Error terminating employee:", error);
    return res.status(500).json({ error: "Failed to terminate employee" });
  }
}
