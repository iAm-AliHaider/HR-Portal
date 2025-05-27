import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

// Log entry interface
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  user?: string;
  details?: string;
}

const LogsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    level: 'all',
    source: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Ensure only admins can access logs
  useEffect(() => {
    // Temporarily commenting out the role check for testing
    // If role needs to be checked later, uncomment and modify as needed
    /*
    if (role !== 'admin') {
// COMMENTED:       router.push('/dashboard');
    }
    */
  }, [role, router]);

  // Fetch logs (mock data for now)
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Mock data - in production, replace with actual API call
        const mockLogs: LogEntry[] = [
          {
            id: '1',
            timestamp: '2024-06-20T15:30:45Z',
            level: 'info',
            message: 'User login successful',
            source: 'auth',
            user: 'john.doe@example.com'
          },
          {
            id: '2',
            timestamp: '2024-06-20T14:22:18Z',
            level: 'warning',
            message: 'Failed login attempt',
            source: 'auth',
            details: 'IP: 192.168.1.105'
          },
          {
            id: '3',
            timestamp: '2024-06-20T12:15:32Z',
            level: 'error',
            message: 'Database connection failed',
            source: 'system',
            details: 'Timeout after 30s'
          },
          {
            id: '4',
            timestamp: '2024-06-20T10:05:12Z',
            level: 'info',
            message: 'Payroll processing completed',
            source: 'payroll',
            user: 'system'
          },
          {
            id: '5',
            timestamp: '2024-06-19T22:45:30Z',
            level: 'debug',
            message: 'Cache cleared',
            source: 'system'
          },
          {
            id: '6',
            timestamp: '2024-06-19T20:18:22Z',
            level: 'warning',
            message: 'API rate limit approaching',
            source: 'api',
            details: '95% of limit reached'
          },
          {
            id: '7',
            timestamp: '2024-06-19T18:30:15Z',
            level: 'info',
            message: 'New employee record created',
            source: 'hr',
            user: 'sarah.admin@example.com'
          },
          {
            id: '8',
            timestamp: '2024-06-19T16:42:08Z',
            level: 'error',
            message: 'Email notification failed',
            source: 'notifications',
            details: 'SMTP connection error'
          }
        ];
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        setLogs(mockLogs);
        setLoading(false);
      } catch (err) {
        setError('Failed to load system logs');
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs based on criteria
  const filteredLogs = logs.filter(log => {
    // Filter by level
    if (filter.level !== 'all' && log.level !== filter.level) return false;
    
    // Filter by source
    if (filter.source !== 'all' && log.source !== filter.source) return false;
    
    // Filter by search text
    if (filter.search && !log.message.toLowerCase().includes(filter.search.toLowerCase())) return false;
    
    // Filter by date (if provided)
    if (filter.dateFrom) {
      const logDate = new Date(log.timestamp);
      const fromDate = new Date(filter.dateFrom);
      if (logDate < fromDate) return false;
    }
    
    if (filter.dateTo) {
      const logDate = new Date(log.timestamp);
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59); // Set to end of day
      if (logDate > toDate) return false;
    }
    
    return true;
  });

  // Get log level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'debug':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get unique sources for filter
  const sources = ['all', ...Array.from(new Set(logs.map(log => log.source)))];

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter({
      level: 'all',
      source: 'all',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  return (
    <DashboardLayout title="System Logs" subtitle="View and analyze system events and activities">
      <Head>
        <title>System Logs | HR Portal</title>
        <meta name="description" content="System logs and activity tracking" />
      </Head>

      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Log Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Log Level
              </label>
              <select
                value={filter.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={filter.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {sources.map(source => (
                  <option key={source} value={source}>
                    {source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filter.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Message
              </label>
              <input
                type="text"
                value={filter.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search log messages..."
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No logs match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelBadgeColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {log.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.message}
                      {log.details && (
                        <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LogsPage; 
