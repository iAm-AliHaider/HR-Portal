import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, UserPlus, UserMinus, UserCheck, Clock, Calendar,
  BarChart2, PieChart, TrendingUp, TrendingDown, Briefcase,
  Map, Globe, DollarSign, Award, BookOpen
} from 'lucide-react';

// Mock data for workforce analytics
const departmentDistribution = [
  { name: 'Engineering', count: 45, percentage: 30 },
  { name: 'Marketing', count: 20, percentage: 13.3 },
  { name: 'Sales', count: 30, percentage: 20 },
  { name: 'HR', count: 15, percentage: 10 },
  { name: 'Finance', count: 18, percentage: 12 },
  { name: 'Operations', count: 22, percentage: 14.7 }
];

const turnoverTrend = [
  { month: 'Jan', rate: 2.1 },
  { month: 'Feb', rate: 1.8 },
  { month: 'Mar', rate: 2.3 },
  { month: 'Apr', rate: 1.9 },
  { month: 'May', rate: 1.5 },
  { month: 'Jun', rate: 1.7 }
];

const locationDistribution = [
  { location: 'New York', count: 38, percentage: 25.3 },
  { location: 'San Francisco', count: 42, percentage: 28 },
  { location: 'Chicago', count: 25, percentage: 16.7 },
  { location: 'Remote', count: 45, percentage: 30 }
];

const workforceMetrics = {
  total: 150,
  newHires: 12,
  terminations: 5,
  openPositions: 8,
  avgTenure: '3.2 years',
  diversity: {
    gender: { male: 55, female: 43, other: 2 }, // percentage
    ethnicity: { white: 60, asian: 20, black: 10, hispanic: 8, other: 2 } // percentage
  },
  performance: {
    exceeds: 22,
    meets: 68,
    needsImprovement: 10
  }
};

export default function WorkforceReportPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last6Months');
  
  return (
    <DashboardLayout>
      <Head>
        <title>Workforce Analytics | HR Portal</title>
        <meta name="description" content="Workforce analytics and reporting" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workforce Analytics</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive workforce metrics and insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
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
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-semibold">{workforceMetrics.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New Hires (MTD)</p>
                <p className="text-2xl font-semibold">{workforceMetrics.newHires}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <UserMinus className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Terminations (MTD)</p>
                <p className="text-2xl font-semibold">{workforceMetrics.terminations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Tenure</p>
                <p className="text-2xl font-semibold">{workforceMetrics.avgTenure}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('demographics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'demographics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Demographics
            </button>
            <button
              onClick={() => setActiveTab('turnover')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'turnover'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Turnover Analysis
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performance
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Departmental Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
                <div className="space-y-4">
                  {departmentDistribution.map(dept => (
                    <div key={dept.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                        <span className="text-sm font-medium text-gray-700">{dept.count} ({dept.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${dept.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Distribution</h3>
                <div className="space-y-4">
                  {locationDistribution.map(location => (
                    <div key={location.location}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{location.location}</span>
                        <span className="text-sm font-medium text-gray-700">{location.count} ({location.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Turnover Trend */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Turnover Trend</h3>
                <div className="h-64 flex items-end space-x-2">
                  {turnoverTrend.map(month => (
                    <div key={month.month} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-red-500 rounded-t w-full" 
                        style={{ height: `${month.rate * 20}%` }}
                      ></div>
                      <span className="text-xs font-medium mt-2">{month.month}</span>
                      <span className="text-xs text-gray-500">{month.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Open Positions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Open Positions</h3>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-6 bg-blue-100 rounded-full mb-4">
                      <Briefcase className="h-12 w-12 text-blue-600" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{workforceMetrics.openPositions}</p>
                    <p className="text-gray-600 mt-2">Open Positions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'demographics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Male</span>
                      <span className="text-sm font-medium text-gray-700">{workforceMetrics.diversity.gender.male}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${workforceMetrics.diversity.gender.male}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Female</span>
                      <span className="text-sm font-medium text-gray-700">{workforceMetrics.diversity.gender.female}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-pink-500 h-2.5 rounded-full" 
                        style={{ width: `${workforceMetrics.diversity.gender.female}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Other</span>
                      <span className="text-sm font-medium text-gray-700">{workforceMetrics.diversity.gender.other}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-500 h-2.5 rounded-full" 
                        style={{ width: `${workforceMetrics.diversity.gender.other}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ethnicity Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ethnicity Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(workforceMetrics.diversity.ethnicity).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className="text-sm font-medium text-gray-700">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Age Distribution Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Age distribution chart will be displayed here</p>
                </div>
              </div>
              
              {/* Education Level Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education Level</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Education level chart will be displayed here</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'turnover' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Turnover */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Turnover Rate</h3>
                <div className="h-64 flex items-end space-x-2">
                  {turnoverTrend.map(month => (
                    <div key={month.month} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-red-500 rounded-t w-full" 
                        style={{ height: `${month.rate * 20}%` }}
                      ></div>
                      <span className="text-xs font-medium mt-2">{month.month}</span>
                      <span className="text-xs text-gray-500">{month.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Turnover by Department Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Turnover by Department</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Department turnover chart will be displayed here</p>
                </div>
              </div>
              
              {/* Exit Reasons Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit Reasons</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Exit reasons chart will be displayed here</p>
                </div>
              </div>
              
              {/* Retention Rate Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Rate</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Retention rate chart will be displayed here</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Exceeds Expectations</span>
                      <span className="text-sm font-medium text-gray-700">{workforceMetrics.performance.exceeds}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${workforceMetrics.performance.exceeds}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Meets Expectations</span>
                      <span className="text-sm font-medium text-gray-700">{workforceMetrics.performance.meets}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${workforceMetrics.performance.meets}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Needs Improvement</span>
                      <span className="text-sm font-medium text-gray-700">{workforceMetrics.performance.needsImprovement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{ width: `${workforceMetrics.performance.needsImprovement}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Performance by Department Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Department</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Department performance chart will be displayed here</p>
                </div>
              </div>
              
              {/* Performance vs Tenure Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Tenure</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Performance vs tenure chart will be displayed here</p>
                </div>
              </div>
              
              {/* Performance Trend Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Performance trend chart will be displayed here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 