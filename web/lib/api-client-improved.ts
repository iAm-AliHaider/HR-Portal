interface ApiResponse<T> {
  data?: T;
  error?: string;
  fallback?: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async fetchWithFallback<T>(
    endpoint: string,
    fallback: T,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        console.warn(`API warning: ${endpoint} returned ${response.status}`);
        return { fallback, error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };

    } catch (error) {
      console.warn(`API warning: ${endpoint} failed`, error);
      return { fallback, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async fetchUsers() {
    return this.fetchWithFallback('/users', []);
  }

  async fetchEmployees() {
    return this.fetchWithFallback('/employees', []);
  }
}

export const apiClient = new ApiClient();

// Utility function for safe API calls
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T,
  errorMessage = 'API call failed'
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.warn(errorMessage, error);
    return fallback;
  }
}