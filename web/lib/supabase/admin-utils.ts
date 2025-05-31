import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  async testConnection(): Promise<{ success: boolean; message: string; latency?: number }> {
    try {
      const start = Date.now();
      
      // Create test client
      const testClient = createClient(this.credentials.url, this.credentials.anonKey);
      
      // Test basic connection
      const { data, error } = await testClient.from('profiles').select('count').limit(1);
      
      const latency = Date.now() - start;
      
      if (error) {
        return {
          success: false,
          message: `Connection failed: ${error.message}`,
          latency
        };
      }
      
      this.client = testClient;
      
      return {
        success: true,
        message: 'Connection successful',
        latency
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Connection error: ${error.message}`
      };
    }
  }

  // Initialize service client for admin operations
  async initializeServiceClient(): Promise<boolean> {
    if (!this.credentials.serviceKey) {
      return false;
    }
    
    try {
      this.serviceClient = createClient(this.credentials.url, this.credentials.serviceKey);
      return true;
    } catch (error) {
      console.error('Failed to initialize service client:', error);
      return false;
    }
  }

  // Get all tables in the database
  async getTables(): Promise<TableInfo[]> {
    if (!this.serviceClient) {
      throw new Error('Service client not initialized');
    }

    try {
      // Get table information from information_schema
      const { data: tables, error } = await this.serviceClient.rpc('get_table_info');

      if (error) {
        // Fallback: try to get basic table list
        const { data: basicTables, error: basicError } = await this.serviceClient
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_type', 'BASE TABLE');

        if (basicError) throw basicError;

        const tableInfos: TableInfo[] = [];

        for (const table of basicTables || []) {
          // Get row count for each table
          const { count } = await this.serviceClient
            .from(table.table_name)
            .select('*', { count: 'exact', head: true });

          tableInfos.push({
            name: table.table_name,
            schema: 'public',
            rowCount: count || 0,
            columns: []
          });
        }

        return tableInfos;
      }

      return tables || [];
    } catch (error: any) {
      // Final fallback: return known tables
      const knownTables = [
        'profiles', 'employees', 'departments', 'teams', 'attendance', 
        'roles', 'jobs', 'applications', 'interviews', 'offers',
        'leaves', 'loans', 'training_courses', 'enrollments'
      ];

      const tableInfos: TableInfo[] = [];

      for (const tableName of knownTables) {
        try {
          const { count } = await (this.serviceClient || this.client!)
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          tableInfos.push({
            name: tableName,
            schema: 'public',
            rowCount: count || 0,
            columns: []
          });
        } catch (err) {
          // Skip tables that don't exist
          continue;
        }
      }

      return tableInfos;
    }
  }

  // Get data from a specific table
  async getTableData(tableName: string, limit: number = 100, offset: number = 0) {
    if (!this.client && !this.serviceClient) {
      throw new Error('No client available');
    }

    const client = this.serviceClient || this.client!;

    try {
      const { data, error, count } = await client
        .from(tableName)
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        limit,
        offset
      };
    } catch (error: any) {
      throw new Error(`Failed to get table data: ${error.message}`);
    }
  }

  // Upload data to table
  async uploadData(tableName: string, data: Record<string, any>[]): Promise<{ success: boolean; message: string; insertedCount?: number }> {
    if (!this.serviceClient) {
      throw new Error('Service client required for data upload');
    }

    try {
      const { data: inserted, error } = await this.serviceClient
        .from(tableName)
        .insert(data)
        .select();

      if (error) {
        return {
          success: false,
          message: `Upload failed: ${error.message}`
        };
      }

      return {
        success: true,
        message: `Successfully uploaded ${inserted?.length || 0} records`,
        insertedCount: inserted?.length || 0
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Upload error: ${error.message}`
      };
    }
  }

  // Get upload templates
  getUploadTemplates(): UploadTemplate[] {
    return [
      {
        name: 'Users',
        table: 'profiles',
        description: 'Upload user profiles and account information',
        columns: ['id', 'email', 'first_name', 'last_name', 'role', 'department', 'position', 'phone', 'hire_date'],
        requiredFields: ['email', 'first_name', 'last_name', 'role'],
        sampleData: [
          {
            email: 'john.doe@company.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'employee',
            department: 'Engineering',
            position: 'Software Developer',
            phone: '+1-555-0123',
            hire_date: '2024-01-15'
          }
        ]
      },
      {
        name: 'Departments',
        table: 'departments',
        description: 'Upload department information',
        columns: ['id', 'name', 'description', 'manager_id', 'budget', 'created_at'],
        requiredFields: ['name'],
        sampleData: [
          {
            name: 'Engineering',
            description: 'Software development and engineering',
            budget: 500000,
            created_at: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        name: 'Teams',
        table: 'teams',
        description: 'Upload team structure and assignments',
        columns: ['id', 'name', 'department_id', 'team_lead_id', 'description', 'created_at'],
        requiredFields: ['name'],
        sampleData: [
          {
            name: 'Frontend Team',
            description: 'Responsible for user interface development',
            created_at: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        name: 'Attendance',
        table: 'attendance',
        description: 'Upload attendance records',
        columns: ['id', 'employee_id', 'check_in', 'check_out', 'date', 'status', 'hours_worked'],
        requiredFields: ['employee_id', 'date', 'status'],
        sampleData: [
          {
            employee_id: 'user-123',
            check_in: '2024-01-15T09:00:00Z',
            check_out: '2024-01-15T17:30:00Z',
            date: '2024-01-15',
            status: 'present',
            hours_worked: 8.5
          }
        ]
      },
      {
        name: 'Roles',
        table: 'roles',
        description: 'Upload role definitions and permissions',
        columns: ['id', 'name', 'description', 'permissions', 'level', 'created_at'],
        requiredFields: ['name', 'level'],
        sampleData: [
          {
            name: 'Senior Developer',
            description: 'Senior software development role',
            permissions: ['read', 'write', 'review'],
            level: 'senior',
            created_at: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        name: 'Employees',
        table: 'employees',
        description: 'Upload detailed employee information',
        columns: ['id', 'profile_id', 'employee_id', 'department', 'position', 'salary', 'hire_date', 'status'],
        requiredFields: ['profile_id', 'employee_id', 'department', 'position'],
        sampleData: [
          {
            profile_id: 'user-123',
            employee_id: 'EMP001',
            department: 'Engineering',
            position: 'Software Developer',
            salary: 75000,
            hire_date: '2024-01-15',
            status: 'active'
          }
        ]
      }
    ];
  }

  // Parse CSV data
  parseCSV(csvData: string): Record<string, any>[] {
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, any> = {};

      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Try to parse as number or boolean
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (value && !isNaN(Number(value))) value = Number(value);
        
        row[header] = value;
      });

      data.push(row);
    }

    return data;
  }

  // Generate CSV template
  generateCSVTemplate(template: UploadTemplate): string {
    const headers = template.columns.join(',');
    const sampleRows = template.sampleData
      .map(row => template.columns.map(col => row[col] || '').join(','))
      .join('\n');
    
    return `${headers}\n${sampleRows}`;
  }

  // Validate upload data
  validateUploadData(data: Record<string, any>[], template: UploadTemplate): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || data.length === 0) {
      errors.push('No data provided');
      return { valid: false, errors };
    }

    // Check required fields
    data.forEach((row, index) => {
      template.requiredFields.forEach(field => {
        if (!row[field] || row[field] === '') {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export default credentials with the provided password
export const defaultCredentials: DatabaseCredentials = {
  url: 'https://tqtwdkobrzzrhrqdxprs.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94',
  password: 'pqADSqP6fm8TseVH'
}; 