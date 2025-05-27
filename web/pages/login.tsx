import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth';
import MockAccountInfo, { MockAccount } from '../components/ui/MockAccountInfo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const router = useRouter();
  const { user, signIn } = useAuth();
  const redirect = router.query.redirect as string || '/dashboard';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  const roleFilters = {
    all: 'All Accounts',
    admin: 'Administrators',
    hr: 'HR Team',
    manager: 'Managers',
    employee: 'Employees',
    specialized: 'Specialized Roles'
  };

  // Show test accounts in development mode or demo mode
  useEffect(() => {
    // Check if we're in development mode or demo mode
    setShowTestAccounts(isDevelopment || isDemoMode);
  }, [isDevelopment, isDemoMode]);
  
  // Handle redirection if the user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to', redirect);
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push(redirect);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAccountSelect = (account: MockAccount) => {
    setEmail(account.email);
    setPassword(account.password);
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
        <title>Login | HR Portal</title>
      </Head>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">HR</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          HR Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the HR management system
        </p>
        <p className="mt-2 text-center text-sm">
          <a href="/careers" className="text-blue-600 hover:text-blue-500">
            Looking for jobs? Visit our careers page
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          {showTestAccounts && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Test Accounts for UAT
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
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
                
                <MockAccountInfo 
                  onSelect={handleAccountSelect} 
                  filterRoles={selectedFilter !== 'all' ? getFilteredRoles(selectedFilter) : undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 