// Auth bypass for testing and development
export const isDevelopment = process.env.NODE_ENV === 'development';

export const mockUser = {
  id: 'test-user-1',
  email: 'test@company.com',
  role: 'admin',
  name: 'Test User'
};

export function shouldBypassAuth(): boolean {
  // Bypass auth in development mode or when testing
  return isDevelopment || process.env.BYPASS_AUTH === 'true';
}

export function getMockUser() {
  return mockUser;
}