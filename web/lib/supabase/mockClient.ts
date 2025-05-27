// Mock Supabase client for testing

export function createMockTable<T>(initial: T[] = []) {
  let data = [...initial];
  return {
    select: () => ({ data, error: null }),
    insert: (rows: T[]) => {
      data.push(...rows);
      return { data: rows, error: null };
    },
    update: (updates: Partial<T>, match: (row: T) => boolean) => {
      data = data.map(row => (match(row) ? { ...row, ...updates } : row));
      return { data, error: null };
    },
    delete: (match: (row: T) => boolean) => {
      const before = data.length;
      data = data.filter(row => !match(row));
      return { data: null, error: null, count: before - data.length };
    },
    reset: (rows: T[]) => { data = [...rows]; },
    getAll: () => data,
  };
}

export function createMockSupabaseClient(mockTables: Record<string, any>) {
  return {
    from: (table: string) => mockTables[table],
    auth: {
      getSession: async () => ({ data: { session: { user: { id: 'mock-user-id', email: 'mock@example.com' } } } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: null }),
    },
  };
} 