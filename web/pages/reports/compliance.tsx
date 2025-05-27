import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  FileCheck, AlertTriangle, CheckCircle, Clock, Calendar,
  BarChart2, PieChart, TrendingUp, TrendingDown, Shield,
  AlertOctagon, BookOpen, Layers, FileText, Flag
} from 'lucide-react';

// Mock data
const complianceOverview = {
  totalRequirements: 48,
  compliant: 42,
  nonCompliant: 6,
  upcomingDeadlines: 5,
  complianceRate: 87.5,
  lastAudit: '2023-11-15',
  nextAudit: '2024-05-15'
};

const requirementStatus = [
  { category: 'Data Privacy', total: 12, compliant: 11, pending: 1, overdue: 0 },
  { category: 'Workplace Safety', total: 8, compliant: 6, pending: 1, overdue: 1 },
  { category: 'Financial Reporting', total: 10, compliant: 9, pending: 1, overdue: 0 },
  { category: 'HR Compliance', total: 8, compliant: 7, pending: 0, overdue: 1 },
  { category: 'Legal', total: 6, compliant: 5, pending: 1, overdue: 0 },
  { category: 'Industry Specific', total: 4, compliant: 4, pending: 0, overdue: 0 }
];

const complianceTrend = [
  { month: 'Jan', rate: 81 },
  { month: 'Feb', rate: 83 },
  { month: 'Mar', rate: 85 },
  { month: 'Apr', rate: 84 },
  { month: 'May', rate: 86 },
  { month: 'Jun', rate: 87.5 }
];

const upcomingDeadlines = [
  { 
    id: 1, 
    requirement: 'Annual Data Privacy Training', 
    deadline: '2024-06-15', 
    responsible: 'Sarah Johnson',
    status: 'pending',
    category: 'Data Privacy'
  },
  { 
    id: 2, 
    requirement: 'Quarterly Financial Audit', 
    deadline: '2024-06-30', 
    responsible: 'David Wilson',
    status: 'pending',
    category: 'Financial Reporting'
  },
  { 
    id: 3, 
    requirement: 'Workplace Safety Inspection', 
    deadline: '2024-06-10', 
    responsible: 'Mike Rodriguez',
    status: 'pending',
    category: 'Workplace Safety'
  },
  { 
    id: 4, 
    requirement: 'Employee Handbook Update', 
    deadline: '2024-07-01', 
    responsible: 'Sarah Johnson',
    status: 'pending',
    category: 'HR Compliance'
  },
  { 
    id: 5, 
    requirement: 'Contract Renewal Review', 
    deadline: '2024-06-20', 
    responsible: 'James Wilson',
    status: 'pending',
    category: 'Legal'
  }
];

export default function ComplianceReportPage() {
  const [dateRange, setDateRange] = useState('last6Months');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Filter requirements by category if needed
  const filteredRequirements = categoryFilter === 'all' 
    ? requirementStatus 
    : requirementStatus.filter(item => item.category === categoryFilter);

  // Filter deadlines by category if needed
  const filteredDeadlines = categoryFilter === 'all' 
    ? upcomingDeadlines 
    : upcomingDeadlines.filter(item => item.category === categoryFilter);
  
  // Format date string to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days until deadline
  const daysUntil = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Compliance Reports | HR Portal</title>
        <meta name="description" content="Compliance reporting and analytics" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Reports</h1>
            <p className="text-gray-600 mt-1">
              Compliance status, metrics and upcoming deadlines
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {requirementStatus.map(item => (
                <option key={item.category} value={item.category}>{item.category}</option>
              ))}
            </select>
            
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <option value="last3Months">Last 3 Months</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
                <p className="text-2xl font-semibold">{complianceOverview.complianceRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Compliant Items</p>
                <p className="text-2xl font-semibold">{complianceOverview.compliant}/{complianceOverview.totalRequirements}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Non-Compliant Items</p>
                <p className="text-2xl font-semibold">{complianceOverview.nonCompliant}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
                <p className="text-2xl font-semibold">{complianceOverview.upcomingDeadlines}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Compliance Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Trend</h3>
            <div className="h-64 flex items-end space-x-2">
              {complianceTrend.map(month => (
                <div key={month.month} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-blue-500 rounded-t w-full" 
                    style={{ height: `${(month.rate/100) * 80}%` }}
                  ></div>
                  <span className="text-xs font-medium mt-2">{month.month}</span>
                  <span className="text-xs text-gray-500">{month.rate}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance by Category</h3>
            <div className="space-y-4">
              {filteredRequirements.map(category => {
                const complianceRate = (category.compliant / category.total) * 100;
                return (
                  <div key={category.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {category.compliant}/{category.total} ({complianceRate.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          complianceRate >= 90 ? 'bg-green-500' :
                          complianceRate >= 75 ? 'bg-blue-500' :
                          complianceRate >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${complianceRate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Upcoming Deadlines & Audit Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            
            {filteredDeadlines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requirement
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsible
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDeadlines.map(item => {
                      const days = daysUntil(item.deadline);
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.requirement}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.deadline)}
                            <span className={`ml-2 text-xs inline-block px-2 py-0.5 rounded-full ${
                              days < 7 ? 'bg-red-100 text-red-800' :
                              days < 14 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {days} days left
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.responsible}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No upcoming deadlines for the selected category</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Schedule</h3>
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700">Last Compliance Audit</p>
                  <p className="text-base">{formatDate(complianceOverview.lastAudit)}</p>
                  <p className="text-xs text-gray-500">Overall score: 92/100</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700">Next Scheduled Audit</p>
                  <p className="text-base">{formatDate(complianceOverview.nextAudit)}</p>
                  <p className="text-xs text-gray-500">{daysUntil(complianceOverview.nextAudit)} days remaining</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                  View Audit History
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Non-Compliant Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Non-Compliant Items</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requirement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsible
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Workplace Safety Training Update
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Workplace Safety
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-600 font-medium">Overdue (15 days)</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mike Rodriguez
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Details</button>
                    <button className="text-blue-600 hover:text-blue-900">Send Reminder</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Employee Background Check Documentation
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    HR Compliance
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-600 font-medium">Overdue (8 days)</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Sarah Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Details</button>
                    <button className="text-blue-600 hover:text-blue-900">Send Reminder</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Generate Action Plan
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 