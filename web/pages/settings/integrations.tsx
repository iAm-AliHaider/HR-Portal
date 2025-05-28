import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import { GetServerSideProps } from 'next';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  configured: boolean;
  logo?: string;
  settings?: Record<string, any>;
}

const IntegrationsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Ensure user has access to this page (admins only)
  useEffect(() => {
    if (!allowAccess && role !== 'admin') {
      router.push('/login?redirect=/settings/integrations');
    }
  }, [allowAccess, role, router]);

  // Load integrations
  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        // Mock data - replace with actual API call
        const mockIntegrations: Integration[] = [
          {
            id: 'slack',
            name: 'Slack',
            description: 'Send notifications and updates to Slack channels',
            category: 'Communication',
            enabled: true,
            configured: true
          },
          {
            id: 'gmail',
            name: 'Gmail',
            description: 'Send emails through Gmail SMTP',
            category: 'Email',
            enabled: true,
            configured: true
          },
          {
            id: 'zoom',
            name: 'Zoom',
            description: 'Create and manage video interviews',
            category: 'Video Conferencing',
            enabled: false,
            configured: false
          },
          {
            id: 'google-calendar',
            name: 'Google Calendar',
            description: 'Sync interviews and meetings with Google Calendar',
            category: 'Calendar',
            enabled: true,
            configured: true
          },
          {
            id: 'linkedin',
            name: 'LinkedIn',
            description: 'Post job openings and find candidates',
            category: 'Recruitment',
            enabled: false,
            configured: false
          },
          {
            id: 'indeed',
            name: 'Indeed',
            description: 'Automatically post jobs to Indeed',
            category: 'Recruitment',
            enabled: true,
            configured: true
          },
          {
            id: 'paypal',
            name: 'PayPal',
            description: 'Process payments and reimbursements',
            category: 'Finance',
            enabled: false,
            configured: false
          },
          {
            id: 'stripe',
            name: 'Stripe',
            description: 'Handle payment processing',
            category: 'Finance',
            enabled: true,
            configured: true
          }
        ];
        setIntegrations(mockIntegrations);
      } catch (error) {
        console.error('Error loading integrations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrations();
  }, []);

  const toggleIntegration = async (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
    // Here you would make an API call to update the integration
  };

  const configureIntegration = (id: string) => {
    // Navigate to configuration page or open modal
    alert(`Configure ${integrations.find(i => i.id === id)?.name} integration`);
  };

  const categories = ['All', ...Array.from(new Set(integrations.map(i => i.category)))];
  const filteredIntegrations = selectedCategory === 'All' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  if (!allowAccess && role !== 'admin') {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Integrations - HR Management</title>
        <meta name="description" content="Manage third-party integrations and API connections" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600">Manage third-party integrations and API connections</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Integrations</h3>
            <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <p className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.enabled).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Configured</h3>
            <p className="text-2xl font-bold text-blue-600">
              {integrations.filter(i => i.configured).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Needs Setup</h3>
            <p className="text-2xl font-bold text-orange-600">
              {integrations.filter(i => !i.configured).length}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <div key={integration.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl">
                        {integration.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {integration.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={integration.enabled}
                        onChange={() => toggleIntegration(integration.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      integration.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.enabled ? 'Active' : 'Inactive'}
                    </span>
                    {integration.configured ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Configured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Setup Required
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => configureIntegration(integration.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {integration.configured ? 'Manage' : 'Setup'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Integration Tips</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Enable only the integrations you actively use to maintain security</li>
            <li>• Review integration permissions regularly and revoke unused access</li>
            <li>• Test integrations after configuration to ensure proper functionality</li>
            <li>• Contact support if you need help setting up specific integrations</li>
            <li>• Some integrations may require additional configuration in the third-party service</li>
          </ul>
        </div>
      </div>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default IntegrationsPage; 
