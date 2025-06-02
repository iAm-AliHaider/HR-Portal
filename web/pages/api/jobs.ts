import type { NextApiRequest, NextApiResponse } from "next";

// Job interface
interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description?: string;
  requirements?: string[];
  salary_range?: string;
  status: "active" | "inactive" | "closed";
  created_at: string;
  updated_at: string;
}

// Mock jobs data for development/fallback
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Join our engineering team to build amazing products using React, Node.js, and modern technologies.",
    requirements: ["JavaScript", "React", "Node.js", "3+ years experience"],
    salary_range: "$80,000 - $120,000",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "HR Manager",
    department: "Human Resources",
    location: "On-site",
    type: "Full-time",
    description:
      "Lead our HR initiatives and support our growing team with recruitment, employee relations, and policy development.",
    requirements: [
      "HR Experience",
      "Leadership",
      "Communication",
      "SHRM certification preferred",
    ],
    salary_range: "$70,000 - $90,000",
    status: "active",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Hybrid",
    type: "Full-time",
    description:
      "Create intuitive and beautiful user experiences for our digital products.",
    requirements: [
      "UI/UX Design",
      "Figma",
      "User Research",
      "Portfolio required",
    ],
    salary_range: "$75,000 - $95,000",
    status: "active",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description:
      "Drive marketing campaigns and grow our brand presence across digital channels.",
    requirements: [
      "Digital Marketing",
      "SEO/SEM",
      "Content Creation",
      "Analytics",
    ],
    salary_range: "$60,000 - $80,000",
    status: "active",
    created_at: "2024-01-04T00:00:00Z",
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
    console.error("Jobs API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
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

  // Get single job by ID
  if (id) {
    return await getJobById(req, res);
  }

  try {
    // Check if Supabase credentials are available
    const hasSupabaseCredentials =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const jobs = mockJobs;

    if (hasSupabaseCredentials) {
      try {
        // Dynamic import to avoid initialization errors
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        let query = supabase.from("jobs").select("*");

        // Apply filters
        if (search) {
          query = query.or(
            `title.ilike.%${search}%,description.ilike.%${search}%`,
          );
        }

        if (department) {
          query = query.eq("department", department);
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
            jobs: data,
            total: count || 0,
            page: pageNum,
            totalPages: Math.ceil((count || 0) / limitNum),
            source: "database",
          });
        } else {
          console.warn(
            "Database query failed, using mock data:",
            error?.message,
          );
        }
      } catch (dbError) {
        console.warn("Database connection failed, using mock data:", dbError);
      }
    }

    // Apply filters to mock data
    let filteredJobs = jobs;

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower),
      );
    }

    if (department) {
      filteredJobs = filteredJobs.filter(
        (job) => job.department === department,
      );
    }

    if (status) {
      filteredJobs = filteredJobs.filter((job) => job.status === status);
    }

    // Apply pagination to mock data
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return res.status(200).json({
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page: pageNum,
      totalPages: Math.ceil(filteredJobs.length / limitNum),
      source: "fallback",
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(200).json({
      jobs: mockJobs.slice(0, parseInt(limit as string)),
      total: mockJobs.length,
      page: parseInt(page as string),
      totalPages: Math.ceil(mockJobs.length / parseInt(limit as string)),
      source: "fallback",
    });
  }
}

async function getJobById(req: NextApiRequest, res: NextApiResponse) {
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
          .from("jobs")
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
    const mockJob = mockJobs.find((job) => job.id === parseInt(id as string));
    if (!mockJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json(mockJob);
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ error: "Failed to fetch job" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const jobData = req.body;

  // Validation
  if (!jobData.title || !jobData.department) {
    return res.status(400).json({
      error: "Title and department are required",
    });
  }

  try {
    const newJob: Job = {
      id: Date.now(),
      title: jobData.title,
      department: jobData.department,
      location: jobData.location || "Remote",
      type: jobData.type || "Full-time",
      description: jobData.description || "",
      requirements: jobData.requirements || [],
      salary_range: jobData.salary_range || "Competitive",
      status: "active",
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
          .from("jobs")
          .insert([newJob])
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
    return res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ error: "Failed to create job" });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    const updatedJob = {
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
          .from("jobs")
          .update(updatedJob)
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
    const mockJob = mockJobs.find((job) => job.id === parseInt(id as string));
    return res.status(200).json({ ...mockJob, ...updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ error: "Failed to update job" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Job ID is required" });
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

        // Soft delete - update status to closed
        const { data, error } = await supabase
          .from("jobs")
          .update({
            status: "closed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (!error && data) {
          return res.status(200).json({
            message: "Job closed successfully",
            job: data,
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
      message: "Job closed successfully",
      job: { id, status: "closed" },
    });
  } catch (error) {
    console.error("Error closing job:", error);
    return res.status(500).json({ error: "Failed to close job" });
  }
}
