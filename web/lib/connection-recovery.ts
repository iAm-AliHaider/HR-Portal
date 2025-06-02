import { supabase } from './supabase/client';

interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  errorCount: number;
  maxErrors: number;
}

class DatabaseConnectionRecovery {
  private status: ConnectionStatus;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.status = {
      isConnected: false,
      lastChecked: new Date(),
      errorCount: 0,
      maxErrors: 5
    };
  }

  async checkConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        this.status.errorCount++;
        this.status.isConnected = false;
        console.warn(`Database connection check failed (${this.status.errorCount}/${this.status.maxErrors}):`, error.message);
      } else {
        this.status.errorCount = 0;
        this.status.isConnected = true;
      }

      this.status.lastChecked = new Date();
      return this.status.isConnected;

    } catch (exception) {
      this.status.errorCount++;
      this.status.isConnected = false;
      this.status.lastChecked = new Date();
      console.warn(`Database connection exception (${this.status.errorCount}/${this.status.maxErrors}):`, exception);
      return false;
    }
  }

  isHealthy(): boolean {
    return this.status.isConnected && this.status.errorCount < this.status.maxErrors;
  }

  getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  startMonitoring(intervalMs = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkConnection();
    }, intervalMs);

    // Initial check
    this.checkConnection();
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const dbConnectionRecovery = new DatabaseConnectionRecovery();

// Auto-start monitoring in browser environment
if (typeof window !== 'undefined') {
  dbConnectionRecovery.startMonitoring();
}