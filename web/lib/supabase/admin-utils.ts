import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface DatabaseCredentials {
  url: string;
  anonKey: string;
  serviceKey?: string;
  password?: string;
}

export interface TableInfo {
  name: string;
  schema: string;
  rowCount: number;
  columns: ColumnInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
}

export interface UploadTemplate {
  name: string;
  table: string;
  description: string;
  columns: string[];
  sampleData: Record<string, any>[];
  requiredFields: string[];
}

export class SupabaseAdminManager {
  private client: SupabaseClient | null = null;
  private serviceClient: SupabaseClient | null = null;

  constructor(private credentials: DatabaseCredentials) {}

  // Test database connection
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    latency?: number;
  }> {
    try {
      const start = Date.now();

      // Validate URL format first
      if (
        !this.credentials.url ||
        !this.credentials.url.includes(".supabase.co")
      ) {
        return {
          success: false,
          message:
            "Invalid Supabase URL format. Should be https://your-project.supabase.co",
          latency: Date.now() - start,
        };
      }

      // Validate anon key format (should be a JWT)
      if (
        !this.credentials.anonKey ||
        !this.credentials.anonKey.startsWith("eyJ")
      ) {
        return {
          success: false,
          message:
            'Invalid anonymous key format. Should be a valid JWT token starting with "eyJ".',
          latency: Date.now() - start,
        };
      }

      // Create client with provided credentials
      let testClient;
      try {
        testClient = createClient(
          this.credentials.url,
          this.credentials.anonKey,
        );
      } catch (clientError: any) {
        return {
          success: false,
          message: `Failed to create Supabase client: ${clientError.message}`,
          latency: Date.now() - start,
        };
      }

      // Test actual API call with anon key to validate credentials
      const { data: basicData, error: basicError } = await testClient
        .from("profiles")
        .select("count")
        .limit(1);

      if (basicError) {
        // Check for specific authentication/authorization errors
        if (
          basicError.message.includes("Invalid API key") ||
          basicError.message.includes("Project not found") ||
          basicError.message.includes("JWT") ||
          basicError.code === "PGRST301" ||
          basicError.code === "42P01"
        ) {
          return {
            success: false,
            message: `Invalid credentials: ${basicError.message}`,
            latency: Date.now() - start,
          };
        }
        return {
          success: false,
          message: `Connection failed: ${basicError.message}`,
          latency: Date.now() - start,
        };
      }

      // Service key validation with proper error checking
      let serviceKeyMessage = "";
      if (this.credentials.serviceKey) {
        // Validate service key format
        if (!this.credentials.serviceKey.startsWith("eyJ")) {
          return {
            success: false,
            message:
              'Invalid service key format. Should be a valid JWT token starting with "eyJ".',
            latency: Date.now() - start,
          };
        }

        try {
          const serviceClient = createClient(
            this.credentials.url,
            this.credentials.serviceKey,
          );

          // Test service key with a privileged operation
          const { data: serviceData, error: serviceError } = await serviceClient
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public")
            .limit(1);

          if (serviceError) {
            if (
              serviceError.message.includes("Invalid API key") ||
              serviceError.message.includes("JWT") ||
              serviceError.code === "PGRST301"
            ) {
              return {
                success: false,
                message: `Invalid service role key: ${serviceError.message}`,
                latency: Date.now() - start,
              };
            }
            serviceKeyMessage = " (service key has limited permissions)";
          } else {
            serviceKeyMessage = " with service role access";
          }
        } catch (serviceError: any) {
          if (
            serviceError.message.includes("Invalid") ||
            serviceError.message.includes("JWT") ||
            serviceError.message.includes("unauthorized")
          ) {
            return {
              success: false,
              message: `Service key validation failed: ${serviceError.message}`,
              latency: Date.now() - start,
            };
          }
          serviceKeyMessage = " (service key validation inconclusive)";
        }
      }

      const latency = Date.now() - start;
      this.client = testClient;

      return {
        success: true,
        message: `✅ Connection successful${serviceKeyMessage}`,
        latency,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Connection error: ${error.message}`,
      };
    }
  }

  // Initialize service client for admin operations
  async initializeServiceClient(): Promise<boolean> {
    if (!this.credentials.serviceKey) {
      return false;
    }

    try {
      this.serviceClient = createClient(
        this.credentials.url,
        this.credentials.serviceKey,
      );
      return true;
    } catch (error) {
      console.error("Failed to initialize service client:", error);
      return false;
    }
  }

  // Get all tables in the database
  async getTables(): Promise<TableInfo[]> {
    // First try with service client for full access
    if (this.serviceClient) {
      try {
        // Try to get table information from information_schema
        const { data: basicTables, error: basicError } =
          await this.serviceClient
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public")
            .eq("table_type", "BASE TABLE");

        if (!basicError && basicTables) {
          const tableInfos: TableInfo[] = [];

          // Get row count and column info for each table
          for (const table of basicTables) {
            try {
              // Get row count for each table
              const { count } = await this.serviceClient
                .from(table.table_name)
                .select("*", { count: "exact", head: true });

              // Get column information
              const { data: columns } = await this.serviceClient
                .from("information_schema.columns")
                .select("column_name, data_type, is_nullable, column_default")
                .eq("table_schema", "public")
                .eq("table_name", table.table_name)
                .order("ordinal_position");

              const columnInfos: ColumnInfo[] = (columns || []).map((col) => ({
                name: col.column_name,
                type: col.data_type,
                nullable: col.is_nullable === "YES",
                default: col.column_default,
              }));

              tableInfos.push({
                name: table.table_name,
                schema: "public",
                rowCount: count || 0,
                columns: columnInfos,
              });
            } catch (tableError) {
              console.warn(
                `Failed to get info for table ${table.table_name}:`,
                tableError,
              );
              // Still add the table but with minimal info
              tableInfos.push({
                name: table.table_name,
                schema: "public",
                rowCount: 0,
                columns: [],
              });
            }
          }

          console.log(
            `Successfully fetched ${tableInfos.length} tables from database via service client`,
          );
          return tableInfos.sort((a, b) => a.name.localeCompare(b.name));
        }
      } catch (error: any) {
        console.warn(
          "Service client failed, falling back to anon client:",
          error.message,
        );
      }
    }

    // Fallback: use anon client with known table list
    console.log("Using fallback method with anon client for known tables");

    const knownTables = [
      // Core tables from actual schema
      "profiles", // Auth integration table
      "employees",
      "roles",
      "employee_roles",
      // Leave management
      "leave_types",
      "leave_requests",
      // Training & Learning
      "training_categories",
      "training_courses",
      "training_enrollments", // Correct name from schema
      // Recruitment
      "job_postings", // Correct name from schema
      "job_applications", // Correct name from schema
      "interviews",
      // Expenses
      "expense_categories",
      "expense_reports",
      "expenses",
      // Facilities
      "meeting_rooms",
      "room_bookings",
      // System
      "document_categories",
      "documents",
      "notifications",
      "activity_logs",
      "company_settings",
    ];

    const tableInfos: TableInfo[] = [];
    const client = this.client;

    if (!client) {
      console.error("No client available for table discovery");
      return [];
    }

    // Test each known table with anon client
    for (const tableName of knownTables) {
      try {
        const { count } = await client
          .from(tableName)
          .select("*", { count: "exact", head: true });

        tableInfos.push({
          name: tableName,
          schema: "public",
          rowCount: count || 0,
          columns: [], // Cannot get detailed column info with anon key
        });
      } catch (err) {
        // Table doesn't exist or access denied, skip it
        console.log(`Table ${tableName} not accessible with anon key`);
      }
    }

    console.log(`Fallback method found ${tableInfos.length} accessible tables`);
    return tableInfos.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get data from a specific table
  async getTableData(
    tableName: string,
    limit: number = 100,
    offset: number = 0,
  ) {
    if (!this.client && !this.serviceClient) {
      throw new Error("No client available");
    }

    const client = this.serviceClient || this.client!;

    try {
      const { data, error, count } = await client
        .from(tableName)
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        limit,
        offset,
      };
    } catch (error: any) {
      throw new Error(`Failed to get table data: ${error.message}`);
    }
  }

  // Upload data to table
  async uploadData(
    tableName: string,
    data: Record<string, any>[],
  ): Promise<{ success: boolean; message: string; insertedCount?: number }> {
    if (!this.serviceClient) {
      throw new Error("Service client required for data upload");
    }

    try {
      const { data: inserted, error } = await this.serviceClient
        .from(tableName)
        .insert(data)
        .select();

      if (error) {
        return {
          success: false,
          message: `Upload failed: ${error.message}`,
        };
      }

      return {
        success: true,
        message: `Successfully uploaded ${inserted?.length || 0} records`,
        insertedCount: inserted?.length || 0,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Upload error: ${error.message}`,
      };
    }
  }

  // Get upload templates
  getUploadTemplates(): UploadTemplate[] {
    return [
      // Core User & Employee Management
      {
        name: "Profiles",
        table: "profiles",
        description: "Upload user profiles and account information",
        columns: [
          "id",
          "email",
          "name",
          "role",
          "department",
          "position",
          "avatar_url",
          "phone",
          "address",
          "date_of_birth",
          "hire_date",
          "employee_id",
          "manager_id",
        ],
        requiredFields: ["email", "name", "role"],
        sampleData: [
          {
            email: "john.doe@company.com",
            name: "John Doe",
            role: "employee",
            department: "Engineering",
            position: "Software Developer",
            phone: "+1-555-0123",
            hire_date: "2024-01-15",
            employee_id: "EMP001",
          },
        ],
      },
      {
        name: "Employees",
        table: "employees",
        description: "Upload detailed employee information and records",
        columns: [
          "id",
          "profile_id",
          "employee_id",
          "first_name",
          "last_name",
          "email",
          "phone",
          "address",
          "department",
          "position",
          "salary",
          "hire_date",
          "status",
          "manager_id",
        ],
        requiredFields: [
          "employee_id",
          "first_name",
          "last_name",
          "email",
          "department",
          "position",
        ],
        sampleData: [
          {
            employee_id: "EMP001",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@company.com",
            phone: "+1-555-0123",
            department: "Engineering",
            position: "Software Developer",
            salary: 75000,
            hire_date: "2024-01-15",
            status: "active",
          },
        ],
      },
      {
        name: "Departments",
        table: "departments",
        description: "Upload department structure and information",
        columns: [
          "id",
          "name",
          "description",
          "manager_id",
          "budget",
          "location",
          "created_at",
        ],
        requiredFields: ["name"],
        sampleData: [
          {
            name: "Engineering",
            description: "Software development and engineering",
            budget: 500000,
            location: "Building A, Floor 3",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
      {
        name: "Skills",
        table: "skills",
        description: "Upload skill definitions and categories",
        columns: ["id", "name", "category", "description", "created_at"],
        requiredFields: ["name", "category"],
        sampleData: [
          {
            name: "JavaScript",
            category: "Programming Language",
            description: "JavaScript programming language skills",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
      {
        name: "Employee Skills",
        table: "employee_skills",
        description: "Upload employee skill assignments and proficiency levels",
        columns: [
          "id",
          "employee_id",
          "skill_id",
          "proficiency_level",
          "created_at",
        ],
        requiredFields: ["employee_id", "skill_id", "proficiency_level"],
        sampleData: [
          {
            employee_id: "user-123",
            skill_id: "skill-456",
            proficiency_level: 4,
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
      {
        name: "Roles",
        table: "roles",
        description: "Upload role definitions and permissions",
        columns: [
          "id",
          "name",
          "description",
          "permissions",
          "level",
          "created_at",
        ],
        requiredFields: ["name", "level"],
        sampleData: [
          {
            name: "Senior Developer",
            description: "Senior software development role",
            permissions: '["read", "write", "review"]',
            level: "senior",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
      {
        name: "Employee Roles",
        table: "employee_roles",
        description: "Upload employee role assignments",
        columns: ["id", "employee_id", "role_id", "assigned_at", "assigned_by"],
        requiredFields: ["employee_id", "role_id"],
        sampleData: [
          {
            employee_id: "user-123",
            role_id: "role-456",
            assigned_at: "2024-01-01T00:00:00Z",
          },
        ],
      },

      // Leave Management
      {
        name: "Leave Types",
        table: "leave_types",
        description: "Upload leave type definitions and policies",
        columns: [
          "id",
          "name",
          "description",
          "default_days",
          "requires_approval",
          "color",
          "created_at",
        ],
        requiredFields: ["name"],
        sampleData: [
          {
            name: "Annual Leave",
            description: "Yearly vacation leave",
            default_days: 25,
            requires_approval: true,
            color: "#4F46E5",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
      {
        name: "Leave Balances",
        table: "leave_balances",
        description: "Upload employee leave balance information",
        columns: [
          "id",
          "employee_id",
          "leave_type_id",
          "year",
          "allocated_days",
          "used_days",
          "pending_days",
        ],
        requiredFields: [
          "employee_id",
          "leave_type_id",
          "year",
          "allocated_days",
        ],
        sampleData: [
          {
            employee_id: "user-123",
            leave_type_id: "leave-type-456",
            year: 2024,
            allocated_days: 25,
            used_days: 5,
            pending_days: 2,
          },
        ],
      },
      {
        name: "Leave Requests",
        table: "leave_requests",
        description: "Upload leave request records",
        columns: [
          "id",
          "employee_id",
          "leave_type_id",
          "start_date",
          "end_date",
          "days",
          "status",
          "reason",
          "approver_id",
        ],
        requiredFields: [
          "employee_id",
          "leave_type_id",
          "start_date",
          "end_date",
          "days",
        ],
        sampleData: [
          {
            employee_id: "user-123",
            leave_type_id: "leave-type-456",
            start_date: "2024-02-15",
            end_date: "2024-02-19",
            days: 5,
            status: "approved",
            reason: "Family vacation",
          },
        ],
      },

      // Training & Development
      {
        name: "Training Categories",
        table: "training_categories",
        description: "Upload training course categories",
        columns: ["id", "name", "description", "created_at"],
        requiredFields: ["name"],
        sampleData: [
          {
            name: "Technical Skills",
            description: "Technology and programming related training",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
      {
        name: "Training Courses",
        table: "training_courses",
        description: "Upload training course information",
        columns: [
          "id",
          "title",
          "description",
          "category",
          "duration",
          "instructor",
          "status",
          "max_participants",
          "location",
          "start_date",
          "end_date",
        ],
        requiredFields: ["title", "category"],
        sampleData: [
          {
            title: "Advanced JavaScript",
            description: "Advanced JavaScript programming techniques",
            category: "Technical Skills",
            duration: 40,
            instructor: "Jane Smith",
            status: "active",
            max_participants: 20,
            location: "Training Room A",
            start_date: "2024-03-01T09:00:00Z",
          },
        ],
      },
      {
        name: "Course Enrollments",
        table: "course_enrollments",
        description: "Upload training course enrollments",
        columns: [
          "id",
          "employee_id",
          "course_id",
          "status",
          "completion_date",
          "score",
          "feedback",
        ],
        requiredFields: ["employee_id", "course_id"],
        sampleData: [
          {
            employee_id: "user-123",
            course_id: "course-456",
            status: "enrolled",
            score: 85,
            feedback: "Great course content",
          },
        ],
      },

      // Recruitment & Hiring
      {
        name: "Jobs",
        table: "jobs",
        description: "Upload job postings and positions",
        columns: [
          "id",
          "title",
          "department",
          "location",
          "description",
          "requirements",
          "salary_range",
          "employment_type",
          "status",
          "hiring_manager_id",
        ],
        requiredFields: ["title", "department", "location"],
        sampleData: [
          {
            title: "Senior Software Engineer",
            department: "Engineering",
            location: "San Francisco, CA",
            description: "Senior developer position for web applications",
            requirements: "5+ years experience, JavaScript, React",
            salary_range: "$120,000 - $150,000",
            employment_type: "full-time",
            status: "published",
          },
        ],
      },
      {
        name: "Job Applications",
        table: "applications",
        description: "Upload job applications and candidate information",
        columns: [
          "id",
          "job_id",
          "candidate_name",
          "email",
          "phone",
          "resume_url",
          "cover_letter_url",
          "status",
          "source",
        ],
        requiredFields: ["job_id", "candidate_name", "email"],
        sampleData: [
          {
            job_id: "job-123",
            candidate_name: "Alice Johnson",
            email: "alice.johnson@email.com",
            phone: "+1-555-0456",
            status: "received",
            source: "LinkedIn",
          },
        ],
      },
      {
        name: "Interviews",
        table: "interviews",
        description: "Upload interview schedules and records",
        columns: [
          "id",
          "application_id",
          "interviewer_id",
          "scheduled_at",
          "duration",
          "location",
          "interview_type",
          "status",
          "feedback",
          "rating",
        ],
        requiredFields: ["application_id", "interviewer_id", "scheduled_at"],
        sampleData: [
          {
            application_id: "app-123",
            interviewer_id: "user-456",
            scheduled_at: "2024-02-20T14:00:00Z",
            duration: 60,
            location: "Conference Room B",
            interview_type: "technical",
            status: "scheduled",
          },
        ],
      },
      {
        name: "Job Offers",
        table: "offers",
        description: "Upload job offers and offer details",
        columns: [
          "id",
          "application_id",
          "salary",
          "start_date",
          "benefits",
          "status",
          "offered_at",
          "expires_at",
        ],
        requiredFields: ["application_id", "salary", "start_date"],
        sampleData: [
          {
            application_id: "app-123",
            salary: 130000,
            start_date: "2024-03-15",
            benefits: "Health, Dental, 401k",
            status: "pending",
            offered_at: "2024-02-25T10:00:00Z",
            expires_at: "2024-03-10T23:59:59Z",
          },
        ],
      },

      // Loan Management
      {
        name: "Loan Programs",
        table: "loan_programs",
        description: "Upload loan program definitions",
        columns: [
          "id",
          "name",
          "description",
          "max_amount",
          "interest_rate",
          "max_term_months",
          "minimum_service_months",
          "status",
        ],
        requiredFields: [
          "name",
          "max_amount",
          "interest_rate",
          "max_term_months",
        ],
        sampleData: [
          {
            name: "Emergency Loan",
            description: "Emergency financial assistance for employees",
            max_amount: 10000,
            interest_rate: 3.5,
            max_term_months: 24,
            minimum_service_months: 6,
            status: "active",
          },
        ],
      },
      {
        name: "Loan Applications",
        table: "loan_applications",
        description: "Upload loan application records",
        columns: [
          "id",
          "employee_id",
          "program_id",
          "amount",
          "term_months",
          "purpose",
          "status",
          "approver_id",
        ],
        requiredFields: ["employee_id", "program_id", "amount", "term_months"],
        sampleData: [
          {
            employee_id: "user-123",
            program_id: "loan-prog-456",
            amount: 5000,
            term_months: 12,
            purpose: "Medical expenses",
            status: "pending",
          },
        ],
      },
      {
        name: "Loan Repayments",
        table: "loan_repayments",
        description: "Upload loan repayment schedules and records",
        columns: [
          "id",
          "loan_id",
          "amount",
          "due_date",
          "payment_date",
          "status",
        ],
        requiredFields: ["loan_id", "amount", "due_date"],
        sampleData: [
          {
            loan_id: "loan-123",
            amount: 416.67,
            due_date: "2024-02-15",
            payment_date: "2024-02-14",
            status: "paid",
          },
        ],
      },

      // Facilities Management
      {
        name: "Meeting Rooms",
        table: "meeting_rooms",
        description: "Upload meeting room information",
        columns: ["id", "name", "location", "capacity", "features", "status"],
        requiredFields: ["name", "capacity"],
        sampleData: [
          {
            name: "Conference Room A",
            location: "Building 1, Floor 2",
            capacity: 12,
            features: '["Projector", "Whiteboard", "Video Conference"]',
            status: "available",
          },
        ],
      },
      {
        name: "Room Bookings",
        table: "room_bookings",
        description: "Upload meeting room booking records",
        columns: [
          "id",
          "room_id",
          "employee_id",
          "title",
          "start_time",
          "end_time",
          "attendees",
          "status",
        ],
        requiredFields: [
          "room_id",
          "employee_id",
          "title",
          "start_time",
          "end_time",
        ],
        sampleData: [
          {
            room_id: "room-123",
            employee_id: "user-456",
            title: "Sprint Planning",
            start_time: "2024-02-20T09:00:00Z",
            end_time: "2024-02-20T11:00:00Z",
            attendees: '["john.doe@company.com", "jane.smith@company.com"]',
            status: "confirmed",
          },
        ],
      },
      {
        name: "Equipment Inventory",
        table: "equipment_inventory",
        description: "Upload equipment and asset inventory",
        columns: [
          "id",
          "name",
          "category",
          "serial_number",
          "purchase_date",
          "condition",
          "location",
          "assigned_to",
          "status",
        ],
        requiredFields: ["name", "category"],
        sampleData: [
          {
            name: 'MacBook Pro 16"',
            category: "Laptop",
            serial_number: "MBP2024001",
            purchase_date: "2024-01-15",
            condition: "excellent",
            location: "Engineering Floor",
            status: "in-use",
          },
        ],
      },
      {
        name: "Equipment Bookings",
        table: "equipment_bookings",
        description: "Upload equipment booking and checkout records",
        columns: [
          "id",
          "equipment_id",
          "employee_id",
          "purpose",
          "checkout_time",
          "expected_return_time",
          "actual_return_time",
          "status",
        ],
        requiredFields: ["equipment_id", "employee_id", "checkout_time"],
        sampleData: [
          {
            equipment_id: "equip-123",
            employee_id: "user-456",
            purpose: "Field work assignment",
            checkout_time: "2024-02-15T08:00:00Z",
            expected_return_time: "2024-02-20T17:00:00Z",
            status: "checked-out",
          },
        ],
      },

      // Request Management
      {
        name: "Request Categories",
        table: "request_categories",
        description: "Upload request category definitions",
        columns: ["id", "name", "description", "icon", "sort_order"],
        requiredFields: ["name"],
        sampleData: [
          {
            name: "IT Support",
            description: "Information technology support requests",
            icon: "computer",
            sort_order: 1,
          },
        ],
      },
      {
        name: "Request Types",
        table: "request_types",
        description: "Upload request type definitions and forms",
        columns: [
          "id",
          "category_id",
          "name",
          "description",
          "form_schema",
          "requires_approval",
          "approver_role",
          "sla_hours",
        ],
        requiredFields: ["category_id", "name"],
        sampleData: [
          {
            category_id: "cat-123",
            name: "Software Installation",
            description: "Request for new software installation",
            form_schema:
              '{"software_name": "string", "business_justification": "text"}',
            requires_approval: true,
            approver_role: '["it_manager", "department_head"]',
            sla_hours: 48,
          },
        ],
      },
      {
        name: "Employee Requests",
        table: "requests",
        description: "Upload employee request records",
        columns: [
          "id",
          "request_type_id",
          "employee_id",
          "title",
          "description",
          "form_data",
          "status",
          "priority",
          "assignee_id",
        ],
        requiredFields: ["request_type_id", "employee_id", "title"],
        sampleData: [
          {
            request_type_id: "req-type-123",
            employee_id: "user-456",
            title: "Install Adobe Photoshop",
            description: "Need Photoshop for design work",
            form_data:
              '{"software_name": "Adobe Photoshop", "business_justification": "Design tasks"}',
            status: "pending",
            priority: "normal",
          },
        ],
      },

      // Safety & Compliance
      {
        name: "Safety Incidents",
        table: "safety_incidents",
        description: "Upload safety incident reports",
        columns: [
          "id",
          "reporter_id",
          "incident_date",
          "location",
          "description",
          "severity",
          "witnesses",
          "status",
          "resolution",
        ],
        requiredFields: [
          "reporter_id",
          "incident_date",
          "location",
          "description",
          "severity",
        ],
        sampleData: [
          {
            reporter_id: "user-123",
            incident_date: "2024-02-15T10:30:00Z",
            location: "Manufacturing Floor A",
            description: "Slip and fall near workstation 5",
            severity: "minor",
            witnesses: '["john.doe@company.com"]',
            status: "reported",
          },
        ],
      },
      {
        name: "Safety Equipment Checks",
        table: "safety_equipment_checks",
        description: "Upload safety equipment inspection records",
        columns: [
          "id",
          "equipment_name",
          "location",
          "inspector_id",
          "check_date",
          "status",
          "notes",
          "next_check_date",
        ],
        requiredFields: [
          "equipment_name",
          "location",
          "inspector_id",
          "check_date",
          "status",
        ],
        sampleData: [
          {
            equipment_name: "Fire Extinguisher #101",
            location: "Building A, Floor 1",
            inspector_id: "user-456",
            check_date: "2024-02-15T09:00:00Z",
            status: "passed",
            notes: "All safety checks passed",
            next_check_date: "2024-05-15",
          },
        ],
      },
      {
        name: "Safety Checks",
        table: "safety_checks",
        description: "Upload safety check schedules and assignments",
        columns: [
          "id",
          "title",
          "due_date",
          "status",
          "assigned_to",
          "location",
          "frequency",
          "priority",
        ],
        requiredFields: ["title", "due_date", "assigned_to", "location"],
        sampleData: [
          {
            title: "Monthly Fire Safety Check",
            due_date: "2024-03-01",
            status: "scheduled",
            assigned_to: "Safety Officer",
            location: "Entire Building",
            frequency: "monthly",
            priority: "high",
          },
        ],
      },
      {
        name: "Equipment Inspections",
        table: "equipment_inspections",
        description: "Upload equipment inspection records",
        columns: [
          "id",
          "equipment_name",
          "inspection_type",
          "last_inspection",
          "next_due_date",
          "status",
          "assigned_to",
          "location",
          "notes",
        ],
        requiredFields: [
          "equipment_name",
          "inspection_type",
          "last_inspection",
          "next_due_date",
          "status",
        ],
        sampleData: [
          {
            equipment_name: "Forklift #005",
            inspection_type: "Annual Safety",
            last_inspection: "2024-01-15",
            next_due_date: "2025-01-15",
            status: "passed",
            assigned_to: "maintenance@company.com",
            location: "Warehouse",
            notes: "All safety systems operational",
          },
        ],
      },

      // Financial & Expense Management
      {
        name: "Expense Categories",
        table: "expense_categories",
        description: "Upload expense category definitions",
        columns: [
          "id",
          "name",
          "description",
          "code",
          "requires_receipt",
          "max_amount",
        ],
        requiredFields: ["name", "code"],
        sampleData: [
          {
            name: "Travel",
            description: "Business travel expenses",
            code: "TRV",
            requires_receipt: true,
            max_amount: 5000,
          },
        ],
      },
      {
        name: "Expense Reports",
        table: "expense_reports",
        description: "Upload expense report summaries",
        columns: [
          "id",
          "employee_id",
          "title",
          "total_amount",
          "currency",
          "status",
          "submitted_date",
          "approved_date",
          "approver_id",
        ],
        requiredFields: ["employee_id", "title", "total_amount"],
        sampleData: [
          {
            employee_id: "user-123",
            title: "Client Visit - New York",
            total_amount: 1250.5,
            currency: "USD",
            status: "submitted",
            submitted_date: "2024-02-15T16:00:00Z",
          },
        ],
      },
      {
        name: "Expenses",
        table: "expenses",
        description: "Upload individual expense line items",
        columns: [
          "id",
          "report_id",
          "category_id",
          "description",
          "amount",
          "date",
          "receipt_url",
          "notes",
        ],
        requiredFields: [
          "report_id",
          "category_id",
          "description",
          "amount",
          "date",
        ],
        sampleData: [
          {
            report_id: "report-123",
            category_id: "cat-456",
            description: "Hotel accommodation",
            amount: 350.0,
            date: "2024-02-10",
            notes: "Hilton Hotel, 2 nights",
          },
        ],
      },

      // Performance & Reviews
      {
        name: "Performance Reviews",
        table: "performance_reviews",
        description: "Upload performance review records",
        columns: [
          "id",
          "employee_id",
          "reviewer_id",
          "review_period",
          "overall_rating",
          "goals",
          "feedback",
          "status",
          "reviewed_date",
        ],
        requiredFields: [
          "employee_id",
          "reviewer_id",
          "review_period",
          "overall_rating",
        ],
        sampleData: [
          {
            employee_id: "user-123",
            reviewer_id: "user-456",
            review_period: "2024-Q1",
            overall_rating: 4,
            goals: "Improve technical leadership skills",
            feedback: "Excellent performance this quarter",
            status: "completed",
            reviewed_date: "2024-03-31",
          },
        ],
      },

      // Workflow & Compliance
      {
        name: "Workflows",
        table: "workflows",
        description: "Upload workflow definitions and processes",
        columns: [
          "id",
          "name",
          "description",
          "type",
          "steps",
          "status",
          "created_by",
        ],
        requiredFields: ["name", "type"],
        sampleData: [
          {
            name: "Employee Onboarding",
            description: "Standard new employee onboarding process",
            type: "onboarding",
            steps:
              '["HR Introduction", "IT Setup", "Department Tour", "Training Assignment"]',
            status: "active",
          },
        ],
      },
      {
        name: "Workflow Instances",
        table: "workflow_instances",
        description: "Upload workflow execution instances",
        columns: [
          "id",
          "workflow_id",
          "employee_id",
          "current_step",
          "status",
          "started_at",
          "completed_at",
        ],
        requiredFields: ["workflow_id", "employee_id"],
        sampleData: [
          {
            workflow_id: "workflow-123",
            employee_id: "user-456",
            current_step: "IT Setup",
            status: "in_progress",
            started_at: "2024-02-15T09:00:00Z",
          },
        ],
      },
      {
        name: "Compliance Requirements",
        table: "compliance_requirements",
        description: "Upload compliance requirement definitions",
        columns: [
          "id",
          "title",
          "description",
          "category",
          "frequency",
          "responsible_role",
          "due_date",
          "status",
        ],
        requiredFields: ["title", "category", "frequency"],
        sampleData: [
          {
            title: "Annual Safety Training",
            description: "Mandatory annual safety training for all employees",
            category: "Safety",
            frequency: "annual",
            responsible_role: "HR",
            due_date: "2024-12-31",
            status: "active",
          },
        ],
      },
      {
        name: "Audits",
        table: "audits",
        description: "Upload audit records and findings",
        columns: [
          "id",
          "title",
          "type",
          "auditor",
          "audit_date",
          "findings",
          "recommendations",
          "status",
        ],
        requiredFields: ["title", "type", "auditor", "audit_date"],
        sampleData: [
          {
            title: "Q1 Financial Audit",
            type: "Financial",
            auditor: "External Auditor Corp",
            audit_date: "2024-03-15",
            findings: "No major issues found",
            recommendations: "Continue current practices",
            status: "completed",
          },
        ],
      },

      // System & Configuration
      {
        name: "Company Settings",
        table: "company_settings",
        description: "Upload company configuration and settings",
        columns: [
          "id",
          "name",
          "industry",
          "size",
          "address",
          "phone",
          "email",
          "website",
          "timezone",
          "currency",
        ],
        requiredFields: ["name"],
        sampleData: [
          {
            name: "Tech Corp Inc.",
            industry: "Technology",
            size: "Medium (50-200 employees)",
            address: "123 Business Ave, San Francisco, CA 94105",
            phone: "+1-555-123-4567",
            email: "info@techcorp.com",
            website: "https://techcorp.com",
            timezone: "America/Los_Angeles",
            currency: "USD",
          },
        ],
      },
      {
        name: "Notifications",
        table: "notifications",
        description: "Upload notification records",
        columns: [
          "id",
          "recipient_id",
          "title",
          "message",
          "type",
          "category",
          "is_read",
          "created_at",
        ],
        requiredFields: ["recipient_id", "title", "message"],
        sampleData: [
          {
            recipient_id: "user-123",
            title: "Welcome to the Company",
            message: "Welcome aboard! Please complete your onboarding tasks.",
            type: "info",
            category: "onboarding",
            is_read: false,
            created_at: "2024-02-15T10:00:00Z",
          },
        ],
      },
      {
        name: "Activity Logs",
        table: "activity_logs",
        description: "Upload system activity and audit logs",
        columns: [
          "id",
          "user_id",
          "action",
          "resource_type",
          "resource_id",
          "details",
          "ip_address",
          "created_at",
        ],
        requiredFields: ["user_id", "action", "resource_type"],
        sampleData: [
          {
            user_id: "user-123",
            action: "login",
            resource_type: "authentication",
            resource_id: "session-456",
            details: '{"login_method": "email", "success": true}',
            ip_address: "192.168.1.100",
            created_at: "2024-02-15T08:00:00Z",
          },
        ],
      },
      {
        name: "Documents",
        table: "documents",
        description: "Upload document records and metadata",
        columns: [
          "id",
          "title",
          "description",
          "category_id",
          "file_url",
          "file_name",
          "file_size",
          "uploaded_by",
          "access_level",
        ],
        requiredFields: ["title", "file_url", "file_name", "uploaded_by"],
        sampleData: [
          {
            title: "Employee Handbook 2024",
            description: "Updated employee handbook for 2024",
            file_url: "https://company.com/docs/handbook-2024.pdf",
            file_name: "employee-handbook-2024.pdf",
            file_size: 2048000,
            uploaded_by: "user-123",
            access_level: "internal",
          },
        ],
      },
      {
        name: "Document Categories",
        table: "document_categories",
        description: "Upload document category definitions",
        columns: ["id", "name", "description", "parent_id", "created_at"],
        requiredFields: ["name"],
        sampleData: [
          {
            name: "HR Policies",
            description: "Human resources policies and procedures",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
    ];
  }

  // Get dynamic templates for tables discovered from database
  async getDynamicTemplates(): Promise<UploadTemplate[]> {
    if (!this.serviceClient && !this.client) {
      return [];
    }

    try {
      const tables = await this.getTables();
      const existingTemplates = this.getUploadTemplates();
      const existingTableNames = new Set(existingTemplates.map((t) => t.table));

      const dynamicTemplates: UploadTemplate[] = [];

      for (const table of tables) {
        // Skip if we already have a predefined template
        if (existingTableNames.has(table.name)) {
          continue;
        }

        // Skip system tables
        if (table.name.startsWith("auth.") || table.name.includes("_")) {
          continue;
        }

        // Create a basic template for tables without predefined templates
        const columns =
          table.columns.length > 0
            ? table.columns.map((col) => col.name)
            : ["id", "created_at", "updated_at"]; // Default columns if none found

        const requiredFields = columns
          .filter((col) => !["id", "created_at", "updated_at"].includes(col))
          .slice(0, 2); // First 2 non-system columns as required

        dynamicTemplates.push({
          name: this.formatTableName(table.name),
          table: table.name,
          description: `Upload data for ${this.formatTableName(table.name)} table`,
          columns,
          requiredFields,
          sampleData: [this.generateSampleData(columns)],
        });
      }

      return dynamicTemplates;
    } catch (error) {
      console.error("Failed to generate dynamic templates:", error);
      return [];
    }
  }

  // Get all templates (predefined + dynamic)
  async getAllTemplates(): Promise<UploadTemplate[]> {
    const predefined = this.getUploadTemplates();
    const dynamic = await this.getDynamicTemplates();
    return [...predefined, ...dynamic];
  }

  // Helper method to format table names for display
  private formatTableName(tableName: string): string {
    return tableName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Helper method to generate sample data for dynamic templates
  private generateSampleData(columns: string[]): Record<string, any> {
    const sampleData: Record<string, any> = {};

    columns.forEach((column) => {
      const lowerCol = column.toLowerCase();

      if (lowerCol.includes("id") && !lowerCol.includes("employee_id")) {
        sampleData[column] = "uuid-placeholder";
      } else if (lowerCol.includes("email")) {
        sampleData[column] = "example@company.com";
      } else if (lowerCol.includes("name") || lowerCol.includes("title")) {
        sampleData[column] = "Sample Name";
      } else if (lowerCol.includes("date")) {
        sampleData[column] = "2024-01-15";
      } else if (lowerCol.includes("time")) {
        sampleData[column] = "2024-01-15T10:00:00Z";
      } else if (lowerCol.includes("amount") || lowerCol.includes("salary")) {
        sampleData[column] = 1000;
      } else if (lowerCol.includes("status")) {
        sampleData[column] = "active";
      } else if (lowerCol.includes("description")) {
        sampleData[column] = "Sample description";
      } else {
        sampleData[column] = "sample_value";
      }
    });

    return sampleData;
  }

  // Parse CSV data
  parseCSV(csvData: string): Record<string, any>[] {
    const lines = csvData.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const data: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, any> = {};

      headers.forEach((header, index) => {
        let value: any = values[index] || "";

        // Remove quotes if present
        if (
          typeof value === "string" &&
          value.startsWith('"') &&
          value.endsWith('"')
        ) {
          value = value.slice(1, -1);
        }

        // Try to parse as number or boolean
        if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        } else if (
          value &&
          typeof value === "string" &&
          !isNaN(Number(value))
        ) {
          value = Number(value);
        }

        row[header] = value;
      });

      data.push(row);
    }

    return data;
  }

  // Generate CSV template
  generateCSVTemplate(template: UploadTemplate): string {
    const headers = template.columns.join(",");
    const sampleRows = template.sampleData
      .map((row) =>
        template.columns.map((col) => String(row[col] || "")).join(","),
      )
      .join("\n");

    return `${headers}\n${sampleRows}`;
  }

  // Validate upload data
  validateUploadData(
    data: Record<string, any>[],
    template: UploadTemplate,
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || data.length === 0) {
      errors.push("No data provided");
      return { valid: false, errors };
    }

    // Check required fields
    data.forEach((row, index) => {
      template.requiredFields.forEach((field) => {
        if (!row[field] || row[field] === "") {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export default credentials from environment variables only
export const defaultCredentials: DatabaseCredentials = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  // Service key should only be available server-side for security
  serviceKey:
    typeof window === "undefined"
      ? process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      : "",
  password: undefined, // Remove password as Supabase uses JWT tokens
};
