import { supabase } from "../lib/supabase/client";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  department?: string;
  created_at?: string;
}

interface UserFetchResult {
  users: User[];
  error?: string;
  source: 'database' | 'fallback';
}

// Fallback user data for when database is unavailable
const fallbackUsers: User[] = [
  {
    id: "fallback-1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    department: "Administration",
    created_at: new Date().toISOString()
  },
  {
    id: "fallback-2",
    email: "user@company.com",
    name: "Test User",
    role: "employee",
    department: "General",
    created_at: new Date().toISOString()
  }
];

export async function fetchUsersWithFallback(): Promise<UserFetchResult> {
  try {
    // First, test if database is accessible
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (testError) {
      console.warn('Database not accessible, using fallback users:', testError.message);
      return {
        users: fallbackUsers,
        error: `Database unavailable: ${testError.message}`,
        source: 'fallback'
      };
    }

    // Database is accessible, fetch real users
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.warn('Error fetching users from database, using fallback:', error.message);
      return {
        users: fallbackUsers,
        error: `Fetch error: ${error.message}`,
        source: 'fallback'
      };
    }

    return {
      users: users || fallbackUsers,
      source: 'database'
    };

  } catch (exception) {
    const errorMessage = exception instanceof Error ? exception.message : 'Unknown error';
    console.warn('Exception fetching users, using fallback:', errorMessage);

    return {
      users: fallbackUsers,
      error: `Exception: ${errorMessage}`,
      source: 'fallback'
    };
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.warn(`Error fetching user ${id}:`, error.message);
      return fallbackUsers.find(u => u.id === id) || null;
    }

    return data;
  } catch (exception) {
    console.warn(`Exception fetching user ${id}:`, exception);
    return fallbackUsers.find(u => u.id === id) || null;
  }
}

export async function safeUserOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName = 'User operation'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.warn(`${operationName} failed, using fallback:`, error);
    return fallback;
  }
}