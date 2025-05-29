import React, { useState } from 'react';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { GetServerSideProps } from 'next';

export default function AssetManagementPage() {
  const { user, role } = useAuth();
  const isAdmin = role === 'admin' || role === 'manager' || role === 'facilities_manager';
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock assets data
  const assets = [
    { id: 'ast-001', name: 'MacBook Pro 16"', type: 'Computer', assignedTo: 'John Doe', department: 'Engineering', status: 'In Use', lastUpdated: '2023-09-15' },
    { id: 'ast-002', name: 'Dell XPS 15', type: 'Computer', assignedTo: 'Jane Smith', department: 'Marketing', status: 'In Use', lastUpdated: '2023-08-22' },
    { id: 'ast-003', name: 'iPhone 13 Pro', type: 'Mobile Device', assignedTo: 'Michael Johnson', department: 'Sales', status: 'In Use', lastUpdated: '2023-09-01' },
    { id: 'ast-004', name: 'Samsung Galaxy S22', type: 'Mobile Device', assignedTo: 'Emily Davis', department: 'HR', status: 'In Use', lastUpdated: '2023-07-12' },
    { id: 'ast-005', name: 'HP LaserJet Pro', type: 'Printer', assignedTo: null, department: 'Office', status: 'Available', lastUpdated: '2023-09-18' },
    { id: 'ast-006', name: 'Logitech MX Master 3', type: 'Peripheral', assignedTo: 'David Wilson', department: 'Engineering', status: 'In Use', lastUpdated: '2023-08-05' },
    { id: 'ast-007', name: 'Dell 27" Monitor', type: 'Display', assignedTo: null, department: 'IT Storage', status: 'In Maintenance', lastUpdated: '2023-09-10' },
    { id: 'ast-008', name: 'Cisco IP Phone', type: 'Telecom', assignedTo: 'Lisa Brown', department: 'Finance', status: 'In Use', lastUpdated: '2023-07-30' }
  ];
  
  // Filter assets based on active tab
  const filteredAssets = assets.filter(asset => {
    if (activeTab === 'all') return true;
    if (activeTab === 'available') return asset.status === 'Available';
    if (activeTab === 'inUse') return asset.status === 'In Use';
    if (activeTab === 'maintenance') return asset.status === 'In Maintenance';
    return true;
  });
  
  return (
    <SimpleDashboardLayout title="Asset Management" subtitle="Track and manage company assets and equipment">
      {/* Tabs and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4 md:mb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === 'all' 
                ? 'bg-white shadow text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Assets
          </button>
          <button
            onClick={() => setActiveTab('inUse')}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === 'inUse' 
                ? 'bg-white shadow text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            In Use
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === 'available' 
                ? 'bg-white shadow text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === 'maintenance' 
                ? 'bg-white shadow text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Maintenance
          </button>
        </div>
        
        {isAdmin && (
          <div className="flex space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Asset
            </Button>
            <Button variant="outline" className="border-gray-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </Button>
          </div>
        )}
      </div>
      
      {/* Assets Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No assets found in this category.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {asset.type === 'Computer' && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                          {asset.type === 'Mobile Device' && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                          {asset.type === 'Printer' && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          )}
                          {!['Computer', 'Mobile Device', 'Printer'].includes(asset.type) && (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">ID: {asset.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.assignedTo ? (
                        <div className="text-sm text-gray-900">{asset.assignedTo}</div>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        asset.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                        asset.status === 'Available' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                      {isAdmin && (
                        <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SimpleDashboardLayout>
  );
}

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
