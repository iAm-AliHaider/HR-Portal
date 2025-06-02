import { supabase } from './supabase/client';

interface DatabaseStatus {
  isConnected: boolean;
  tablesAccessible: number;
  totalTables: number;
  connectionTime: number;
  healthStatus: 'healthy' | 'degraded' | 'error';
  message: string;
  details: string[];
}

export async function getComprehensiveDatabaseStatus(): Promise<DatabaseStatus> {
  const startTime = performance.now();
  const status: DatabaseStatus = {
    isConnected: false,
    tablesAccessible: 0,
    totalTables: 10,
    connectionTime: 0,
    healthStatus: 'error',
    message: '',
    details: []
  };

  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    status.connectionTime = Math.round(performance.now() - startTime);

    if (testError) {
      status.isConnected = false;
      status.healthStatus = 'error';
      status.message = 'Database connection failed';
      status.details.push(`Connection error: ${testError.message}`);
      return status;
    }

    status.isConnected = true;
    status.details.push('Database connection successful');

    // Test all critical tables
    const tables = [
      'profiles', 'employees', 'jobs', 'applications',
      'leave_requests', 'assets', 'bookings', 'incidents',
      'training_courses', 'companies'
    ];

    const tableResults = await Promise.allSettled(
      tables.map(async (tableName) => {
        const { error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
          .limit(1);

        return { tableName, accessible: !error, error: error?.message };
      })
    );

    tableResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { tableName, accessible, error } = result.value;
        if (accessible) {
          status.tablesAccessible++;
          status.details.push(`✅ ${tableName} table accessible`);
        } else {
          status.details.push(`❌ ${tableName} table error: ${error}`);
        }
      } else {
        status.details.push(`❌ ${tables[index]} table check failed`);
      }
    });

    // Determine health status
    const accessibilityRatio = status.tablesAccessible / status.totalTables;

    if (accessibilityRatio === 1) {
      status.healthStatus = 'healthy';
      status.message = `Database fully operational - ${status.tablesAccessible}/${status.totalTables} tables accessible`;
    } else if (accessibilityRatio >= 0.8) {
      status.healthStatus = 'degraded';
      status.message = `Database partially operational - ${status.tablesAccessible}/${status.totalTables} tables accessible`;
    } else {
      status.healthStatus = 'error';
      status.message = `Database severely degraded - ${status.tablesAccessible}/${status.totalTables} tables accessible`;
    }

    return status;

  } catch (exception) {
    status.connectionTime = Math.round(performance.now() - startTime);
    status.isConnected = false;
    status.healthStatus = 'error';
    status.message = 'Database connection exception';
    status.details.push(`Exception: ${exception instanceof Error ? exception.message : 'Unknown error'}`);
    return status;
  }
}

export function formatDatabaseStatusMessage(status: DatabaseStatus): string {
  const healthEmoji = {
    'healthy': '✅',
    'degraded': '⚠️',
    'error': '❌'
  };

  return `${healthEmoji[status.healthStatus]} ${status.message} (${status.connectionTime}ms)`;
}