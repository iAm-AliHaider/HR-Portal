interface ApiErrorHandler {
  retryCount: number;
  maxRetries: number;
  retryDelay: number;
}

class EnhancedApiClient {
  private errorHandler: ApiErrorHandler;

  constructor() {
    this.errorHandler = {
      retryCount: 0,
      maxRetries: 3,
      retryDelay: 1000
    };
  }

  async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    fallback: T
  ): Promise<{ data: T; error?: string; fromFallback: boolean }> {

    for (let attempt = 0; attempt <= this.errorHandler.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`API endpoint not found: ${url}`);
            return { data: fallback, error: 'Endpoint not found', fromFallback: true };
          }

          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data, fromFallback: false };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`API call attempt ${attempt + 1} failed:`, errorMessage);

        if (attempt < this.errorHandler.maxRetries) {
          await this.delay(this.errorHandler.retryDelay * (attempt + 1));
          continue;
        }

        // All retries failed, return fallback
        console.warn(`All retries failed for ${url}, using fallback`);
        return {
          data: fallback,
          error: `Failed after ${this.errorHandler.maxRetries + 1} attempts: ${errorMessage}`,
          fromFallback: true
        };
      }
    }

    // Should never reach here, but TypeScript requires it
    return { data: fallback, error: 'Unexpected error', fromFallback: true };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchUsers() {
    return this.fetchWithRetry('/api/users', {}, []);
  }

  async fetchEmployees() {
    return this.fetchWithRetry('/api/employees', {}, []);
  }
}

export const enhancedApiClient = new EnhancedApiClient();

// Global error handler for uncaught API errors
export function setupGlobalApiErrorHandler() {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message) {
        const message = event.reason.message;

        // Handle known API errors gracefully
        if (message.includes('Failed to fetch') ||
            message.includes('TypeError: fetch') ||
            message.includes('NetworkError')) {
          console.warn('🔇 [API Error Handled]', message);
          event.preventDefault(); // Prevent console error
        }
      }
    });
  }
}