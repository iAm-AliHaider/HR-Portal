import React, { useState } from 'react';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import TabGroup, { Tab } from '@/components/ui/TabGroup';
import { GetServerSideProps } from 'next';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('general');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Define tabs for the Reports TabGroup
  const tabs: Tab[] = [
    {
      id: 'general',
      label: 'General Reports',
      content: (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">General Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Census Report</h3>
                <p className="text-gray-600 mb-4">Complete breakdown of all employees by department, role, and status.</p>
                <div className="text-sm text-gray-500">Last generated: 3 days ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Headcount Summary</h3>
                <p className="text-gray-600 mb-4">Monthly headcount trends across all departments.</p>
                <div className="text-sm text-gray-500">Last generated: 1 week ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Diversity Report</h3>
                <p className="text-gray-600 mb-4">Breakdown of workforce diversity metrics and trends.</p>
                <div className="text-sm text-gray-500">Last generated: 2 weeks ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Annual Review Summary</h3>
                <p className="text-gray-600 mb-4">Summary of performance reviews across departments.</p>
                <div className="text-sm text-gray-500">Last generated: 1 month ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'compliance',
      label: 'Compliance Reports',
      content: (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Compliance Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Compliance</h3>
                <p className="text-gray-600 mb-4">Employee compliance with required training programs.</p>
                <div className="text-sm text-gray-500">Last generated: 5 days ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Status</h3>
                <p className="text-gray-600 mb-4">Status of employee professional certifications.</p>
                <div className="text-sm text-gray-500">Last generated: 2 weeks ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Incidents</h3>
                <p className="text-gray-600 mb-4">Summary of workplace safety incidents and resolutions.</p>
                <div className="text-sm text-gray-500">Last generated: 1 week ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Acknowledgement</h3>
                <p className="text-gray-600 mb-4">Tracking of employee acknowledgements of company policies.</p>
                <div className="text-sm text-gray-500">Last generated: 3 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'financial',
      label: 'Financial Reports',
      content: (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Financial Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payroll Summary</h3>
                <p className="text-gray-600 mb-4">Monthly payroll costs by department and category.</p>
                <div className="text-sm text-gray-500">Last generated: 2 days ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits Utilization</h3>
                <p className="text-gray-600 mb-4">Analysis of employee benefits usage and costs.</p>
                <div className="text-sm text-gray-500">Last generated: 1 week ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense Trends</h3>
                <p className="text-gray-600 mb-4">Employee expense patterns and reimbursement data.</p>
                <div className="text-sm text-gray-500">Last generated: 3 days ago</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Variance</h3>
                <p className="text-gray-600 mb-4">HR budget variance analysis by category.</p>
                <div className="text-sm text-gray-500">Last generated: 2 weeks ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'custom',
      label: 'Custom Reports',
      content: (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Custom Reports</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Report</h3>
                <p className="text-gray-600 mb-4">Build a custom report by selecting data points and filters below.</p>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>Employee Data</option>
                      <option>Payroll</option>
                      <option>Time & Attendance</option>
                      <option>Performance</option>
                      <option>Training</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      <input type="date" className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
                    <select multiple className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24">
                      <option>All Departments</option>
                      <option>Engineering</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                      <option>HR</option>
                      <option>Finance</option>
                      <option>Operations</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Custom Reports</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div>
                      <h4 className="font-medium">Quarterly Turnover Analysis</h4>
                      <p className="text-sm text-gray-500">Created 2 months ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Run</button>
                      <button className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded">Edit</button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div>
                      <h4 className="font-medium">Department Skills Gap</h4>
                      <p className="text-sm text-gray-500">Created 3 weeks ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Run</button>
                      <button className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <ModernDashboardLayout title="Reports" subtitle="Access and generate company reports">
      <TabGroup tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
    </ModernDashboardLayout>
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
