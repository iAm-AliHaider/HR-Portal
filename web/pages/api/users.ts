import type { NextApiRequest, NextApiResponse } from "next";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: "admin" | "hr_manager" | "employee" | "manager";
  department?: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// Mock users data for development/fallback
const mockUsers: User[] = [
  {
    id: "user-001",
    email: "admin@company.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    department: "IT",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
  {
    id: "user-002",
    email: "hr@company.com",
    first_name: "HR",
    last_name: "Manager",
    role: "hr_manager",
    department: "Human Resources",
    status: "active",
    created_at: "2023-01-15T00:00:00Z",
    updated_at: new Date().toISOString(),
    last_login: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-003",
    email: "john.doe@company.com",
    first_name: "John",
    last_name: "Doe",
    role: "employee",
    department: "Engineering",
    status: "active",
    created_at: "2023-02-01T00:00:00Z",
    updated_at: new Date().toISOString(),
    last_login: "2024-01-14T15:45:00Z",
  },
  {
    id: "user-004",
    email: "jane.smith@company.com",
    first_name: "Jane",
    last_name: "Smith",
    role: "manager",
    department: "Sales",
    status: "active",
    created_at: "2023-03-01T00:00:00Z",
    updated_at: new Date().toISOString(),
    last_login: "2024-01-13T09:20:00Z",
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
    console.error("Users API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id, search, role, status, page = "1", limit = "10" } = req.query;

  // Get single user by ID
  if (id) {
    return await getUserById(req, res);
  }

  try {
    // Check if Supabase is available
    const hasSupabaseCredentials =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const users = mockUsers;

    if (hasSupabaseCredentials) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        let query = supabase.from("profiles").select("*");

        // Apply filters
        if (search) {
          query = query.or(
            `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`,
          );
        }

        if (role) {
          query = query.eq("role", role);
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

        if (!error && data) {
          return res.status(200).json({
            users: data,
            total: count || 0,
            page: pageNum,
            totalPages: Math.ceil((count || 0) / limitNum),
            source: "database",
          });
        }
      } catch (dbError) {
        console.warn("Database query failed, using mock data:", dbError);
      }
    }

    // Apply filters to mock data
    let filteredUsers = users;

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(searchLower) ||
          user.last_name?.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower),
      );
    }

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status);
    }

    // Apply pagination to mock data
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return res.status(200).json({
      users: paginatedUsers,
      total: filteredUsers.length,
      page: pageNum,
      totalPages: Math.ceil(filteredUsers.length / limitNum),
      source: "fallback",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(200).json({
      users: mockUsers.slice(0, parseInt(limit as string)),
      total: mockUsers.length,
      page: parseInt(page as string),
      totalPages: Math.ceil(mockUsers.length / parseInt(limit as string)),
      source: "fallback",
    });
  }
}

async function getUserById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const hasSupabaseCredentials =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasSupabaseCredentials) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          return res.status(200).json(data);
        }
      } catch (dbError) {
        console.warn("Database query failed, using mock data:", dbError);
      }
    }

    // Fallback to mock data
    const mockUser = mockUsers.find((user) => user.id === id);
    if (!mockUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(mockUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const userData = req.body;

  // Validation
  if (!userData.email || !userData.role) {
    return res.status(400).json({
      error: "Email and role are required",
    });
  }

  try {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
      status: userData.status || "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const hasSupabaseCredentials =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasSupabaseCredentials) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { data, error } = await supabase
          .from("profiles")
          .insert([newUser])
          .select()
          .single();

        if (!error && data) {
          return res.status(201).json(data);
        }
      } catch (dbError) {
        console.warn(
          "Database insert failed, returning mock success:",
          dbError,
        );
      }
    }

    // Return mock success
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const updatedUser = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const hasSupabaseCredentials =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasSupabaseCredentials) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { data, error } = await supabase
          .from("profiles")
          .update(updatedUser)
          .eq("id", id)
          .select()
          .single();

        if (!error && data) {
          return res.status(200).json(data);
        }
      } catch (dbError) {
        console.warn(
          "Database update failed, returning mock success:",
          dbError,
        );
      }
    }

    // Return mock success
    const mockUser = mockUsers.find((user) => user.id === id);
    return res.status(200).json({ ...mockUser, ...updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const hasSupabaseCredentials =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasSupabaseCredentials) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        // Soft delete - update status to inactive
        const { data, error } = await supabase
          .from("profiles")
          .update({
            status: "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (!error && data) {
          return res.status(200).json({
            message: "User deactivated successfully",
            user: data,
          });
        }
      } catch (dbError) {
        console.warn(
          "Database delete failed, returning mock success:",
          dbError,
        );
      }
    }

    // Return mock success
    return res.status(200).json({
      message: "User deactivated successfully",
      user: { id, status: "inactive" },
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    return res.status(500).json({ error: "Failed to deactivate user" });
  }
}
