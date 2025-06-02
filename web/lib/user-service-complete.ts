import { supabase } from './supabase/client';
import { dbConnectionRecovery } from './connection-recovery';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  department?: string;
  position?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserServiceResult<T> {
  data: T;
  error?: string;
  source: 'database' | 'cache' | 'fallback';
  timestamp: string;
}

class ComprehensiveUserService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private mockUsers: User[] = [
    {
      id: 'mock-admin',
      email: 'admin@company.com',
      name: 'Admin User',
      role: 'admin',
      department: 'Administration',
      position: 'System Administrator',
      created_at: new Date().toISOString()
    },
    {
      id: 'mock-manager',
      email: 'manager@company.com',
      name: 'Manager User',
      role: 'manager',
      department: 'Management',
      position: 'Team Manager',
      created_at: new Date().toISOString()
    },
    {
      id: 'mock-employee',
      email: 'employee@company.com',
      name: 'Employee User',
      role: 'employee',
      department: 'General',
      position: 'Staff Member',
      created_at: new Date().toISOString()
    }
  ];

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getUsers(): Promise<UserServiceResult<User[]>> {
    const cacheKey = 'users-all';

    // Try cache first
    const cached = this.getCachedData<User[]>(cacheKey);
    if (cached) {
      return {
        data: cached,
        source: 'cache',
        timestamp: new Date().toISOString()
      };
    }

    // Check if database is healthy
    if (!dbConnectionRecovery.isHealthy()) {
      console.warn('Database unhealthy, using mock users');
      return {
        data: this.mockUsers,
        error: 'Database connection unhealthy',
        source: 'fallback',
        timestamp: new Date().toISOString()
      };
    }

    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database query failed, using mock users:', error.message);
        return {
          data: this.mockUsers,
          error: error.message,
          source: 'fallback',
          timestamp: new Date().toISOString()
        };
      }

      const userData = users || this.mockUsers;
      this.setCachedData(cacheKey, userData);

      return {
        data: userData,
        source: 'database',
        timestamp: new Date().toISOString()
      };

    } catch (exception) {
      const errorMessage = exception instanceof Error ? exception.message : 'Unknown error';
      console.warn('Exception getting users, using mock users:', errorMessage);

      return {
        data: this.mockUsers,
        error: errorMessage,
        source: 'fallback',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getUserById(id: string): Promise<UserServiceResult<User | null>> {
    const cacheKey = `user-${id}`;

    // Try cache first
    const cached = this.getCachedData<User>(cacheKey);
    if (cached) {
      return {
        data: cached,
        source: 'cache',
        timestamp: new Date().toISOString()
      };
    }

    // Try mock users first for known IDs
    const mockUser = this.mockUsers.find(u => u.id === id);
    if (mockUser) {
      this.setCachedData(cacheKey, mockUser);
      return {
        data: mockUser,
        source: 'fallback',
        timestamp: new Date().toISOString()
      };
    }

    // Check database if healthy
    if (dbConnectionRecovery.isHealthy()) {
      try {
        const { data: user, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.warn(`User ${id} not found in database:`, error.message);
        } else if (user) {
          this.setCachedData(cacheKey, user);
          return {
            data: user,
            source: 'database',
            timestamp: new Date().toISOString()
          };
        }
      } catch (exception) {
        console.warn(`Exception getting user ${id}:`, exception);
      }
    }

    return {
      data: null,
      error: 'User not found',
      source: 'fallback',
      timestamp: new Date().toISOString()
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const userService = new ComprehensiveUserService();

// Initialize on module load
if (typeof window !== 'undefined') {
  console.log('📋 Comprehensive user service initialized');
}