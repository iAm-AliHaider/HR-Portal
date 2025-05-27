import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MockAccountInfo, { MockAccount } from '../components/ui/MockAccountInfo';
import { useAuth } from '../hooks/useAuth';
import { mockAccounts } from '../components/ui/MockAccountInfo';

// In-memory storage fallback
let memoryStorage: { [key: string]: string } = {};

export default function DevEntryPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [message, setMessage] = useState<string | null>(null);
  const [isMemoryMode, setIsMemoryMode] = useState<boolean>(false);
  const [directLinks, setDirectLinks] = useState<boolean>(false);
  
  // Generate base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Check if localStorage is available
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Test localStorage
        window.localStorage.setItem('test', 'test');
        window.localStorage.removeItem('test');
      }
    } catch (err) {
      console.warn('localStorage not available, using memory fallback', err);
      setIsMemoryMode(true);
      setMessage('Using memory storage mode (cookies disabled)');
      setDirectLinks(true);
    }
  }, []);
  
  const roleFilters = {
    all: 'All Accounts',
    admin: 'Administrators',
    hr: 'HR Team',
    manager: 'Managers',
    employee: 'Employees',
    specialized: 'Specialized Roles'
  };
  
  const handleAccountSelect = async (account: MockAccount) => {
    try {
      setMessage('Logging in...');
      
      // If localStorage fails, provide a direct login option that skips it
      if (isMemoryMode) {
        // Store in memory instead
        memoryStorage['mockUserEmail'] = account.email;
        // Navigate directly with query params as fallback
        router.push({
          pathname: '/dashboard',
          query: { 
            mockEmail: account.email,
            mockRole: account.role,
            mockName: account.name,
            mockBypass: 'true'
          }
        });
        return;
      }
      
      const result = await signIn(account.email, account.password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setMessage(`Login failed: ${result.error}`);
        // Show direct links as fallback
        setDirectLinks(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('An error occurred during login. Using direct navigation instead...');
      setDirectLinks(true);
      
      // Fallback to direct navigation
      setTimeout(() => {
        router.push({
          pathname: '/dashboard',
          query: { 
            mockEmail: account.email,
            mockRole: account.role,
            mockName: account.name,
            mockBypass: 'true'
          }
        });
      }, 2000);
    }
  };
  
  const getFilteredRoles = (filter: string): string[] => {
    switch(filter) {
      case 'admin':
        return ['admin'];
      case 'hr':
        return ['hr', 'hr_director', 'hr_manager'];
      case 'manager':
        return ['manager', 'team_lead'];
      case 'employee':
        return ['employee'];
      case 'specialized':
        return ['recruiter', 'recruiting_manager', 'payroll_admin', 'compliance_officer', 'facilities_manager', 'safety_officer'];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Test Account Selection | HR Portal</title>
      </Head>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">HR</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          HR Portal Test Accounts
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select a test account to access the HR management system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">{message}</p>
                </div>
              </div>
            </div>
          )}
          
          {isMemoryMode && (
            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Cookie/localStorage access is restricted in your browser. Using direct navigation instead.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="text-sm text-gray-600 mr-2">Filter by role:</div>
              {Object.entries(roleFilters).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedFilter === key
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            {directLinks ? (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Direct Login Links</h2>
                <p className="text-sm text-gray-500 mb-4">Click on a link to log in directly without using localStorage</p>
                
                <div className="space-y-3">
                  {mockAccounts
                    .filter(account => selectedFilter === 'all' || getFilteredRoles(selectedFilter).includes(account.role))
                    .map((account) => (
                      <div 
                        key={account.email}
                        className="p-3 bg-white rounded border border-gray-200 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{account.name || 'User'}</div>
                            <div className="text-sm text-gray-600">{account.email}</div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{account.role}</span>
                            {account.department && (
                              <span className="text-xs text-gray-500 mt-1">{account.department}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 flex justify-between">
                          <span className="italic">{account.position}</span>
                        </div>
                        <div className="mt-3">
                          <a 
                            href={`${baseUrl}/dashboard?mockEmail=${encodeURIComponent(account.email)}&mockRole=${encodeURIComponent(account.role)}&mockName=${encodeURIComponent(account.name || '')}&mockBypass=true`} 
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Login as {account.name}
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <MockAccountInfo 
                onSelect={handleAccountSelect} 
                filterRoles={selectedFilter !== 'all' ? getFilteredRoles(selectedFilter) : undefined}
              />
            )}
            
            {!directLinks && (
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setDirectLinks(true)} 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Show direct login links instead
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-800">
              Go to regular login page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
