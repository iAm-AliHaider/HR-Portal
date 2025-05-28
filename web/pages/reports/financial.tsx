import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  DollarSign, TrendingUp, TrendingDown, BarChart2,
  PieChart, Users, Calendar, CreditCard, Briefcase,
  Activity, FileText, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';
import { GetServerSideProps } from 'next';

// Mock data for financial reports
const financialOverview = {
  totalBudget: 1250000,
  spent: 780000,
  remaining: 470000,
  budgetUtilization: 62.4,
  forecastAccuracy: 94.2,
  fiscalYear: '2024',
  fiscalQuarter: 'Q2'
};

const departmentBudgets = [
  { department: 'HR', allocated: 180000, spent: 112000, remaining: 68000 },
  { department: 'Engineering', allocated: 420000, spent: 310000, remaining: 110000 },
  { department: 'Marketing', allocated: 150000, spent: 98000, remaining: 52000 },
  { department: 'Sales', allocated: 230000, spent: 145000, remaining: 85000 },
  { department: 'Operations', allocated: 180000, spent: 90000, remaining: 90000 },
  { department: 'Finance', allocated: 90000, spent: 25000, remaining: 65000 }
];

const monthlyExpenses = [
  { month: 'Jan', amount: 110000 },
  { month: 'Feb', amount: 125000 },
  { month: 'Mar', amount: 135000 },
  { month: 'Apr', amount: 140000 },
  { month: 'May', amount: 130000 },
  { month: 'Jun', amount: 140000 }
];

const expenseCategories = [
  { category: 'Salaries', amount: 480000, percentage: 61.5 },
  { category: 'Benefits', amount: 120000, percentage: 15.4 },
  { category: 'Office Space', amount: 85000, percentage: 10.9 },
  { category: 'Equipment', amount: 35000, percentage: 4.5 },
  { category: 'Software', amount: 40000, percentage: 5.1 },
  { category: 'Travel', amount: 15000, percentage: 1.9 },
  { category: 'Training', amount: 5000, percentage: 0.7 }
];

const recentTransactions = [
  { 
    id: 1, 
    description: 'Employee Benefits Package', 
    amount: 45000, 
    date: '2024-06-01', 
    department: 'HR',
    status: 'completed'
  },
  { 
    id: 2, 
    description: 'Software Licenses Renewal', 
    amount: 12500, 
    date: '2024-05-28', 
    department: 'IT',
    status: 'completed'
  },
  { 
    id: 3, 
    description: 'Marketing Campaign Q2', 
    amount: 35000, 
    date: '2024-05-20', 
    department: 'Marketing',
    status: 'completed'
  },
  { 
    id: 4, 
    description: 'Office Supplies', 
    amount: 3200, 
    date: '2024-05-15', 
    department: 'Operations',
    status: 'completed'
  },
  { 
    id: 5, 
    description: 'Training Program Development', 
    amount: 8500, 
    date: '2024-05-10', 
    department: 'HR',
    status: 'completed'
  }
];


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function FinancialReportPage() {
  const [dateRange, setDateRange] = useState('lastQuarter');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Filter data based on department if needed
  const filteredDepartmentBudgets = departmentFilter === 'all' 
    ? departmentBudgets 
    : departmentBudgets.filter(item => item.department === departmentFilter);

  // Filter transactions based on department if needed
  const filteredTransactions = departmentFilter === 'all' 
    ? recentTransactions 
    : recentTransactions.filter(item => item.department === departmentFilter);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <DashboardLayout>
      <Head>
        <title>Financial Reports | HR Portal</title>
        <meta name="description" content="Financial reporting and analytics" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600 mt-1">
              {financialOverview.fiscalYear} • {financialOverview.fiscalQuarter} • Financial performance and budget tracking
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departmentBudgets.map(item => (
                <option key={item.department} value={item.department}>{item.department}</option>
              ))}
            </select>
            
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <option value="lastMonth">Last Month</option>
              <option value="lastQuarter">Last Quarter</option>
              <option value="ytd">Year to Date</option>
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
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Budget</p>
                <p className="text-2xl font-semibold">{formatCurrency(financialOverview.totalBudget)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Spent to Date</p>
                <p className="text-2xl font-semibold">{formatCurrency(financialOverview.spent)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Remaining</p>
                <p className="text-2xl font-semibold">{formatCurrency(financialOverview.remaining)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Budget Utilization</p>
                <p className="text-2xl font-semibold">{financialOverview.budgetUtilization}%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Budget Usage & Monthly Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Budget Usage</h3>
            <div className="space-y-4">
              {filteredDepartmentBudgets.map(dept => {
                const utilizationRate = (dept.spent / dept.allocated) * 100;
                return (
                  <div key={dept.department}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatCurrency(dept.spent)} / {formatCurrency(dept.allocated)} ({utilizationRate.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          utilizationRate > 90 ? 'bg-red-500' :
                          utilizationRate > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${utilizationRate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
            <div className="h-64 flex items-end space-x-2">
              {monthlyExpenses.map(month => {
                // Calculate height based on max value
                const maxAmount = Math.max(...monthlyExpenses.map(m => m.amount));
                const height = (month.amount / maxAmount) * 80;
                
                return (
                  <div key={month.month} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 rounded-t w-full" 
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs font-medium mt-2">{month.month}</span>
                    <span className="text-xs text-gray-500">{formatCurrency(month.amount)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Monthly Spending</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span>+4.2% from previous period</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Expense Categories & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
            <div className="space-y-4">
              {expenseCategories.map(category => (
                <div key={category.category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(category.amount)} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <button className="text-blue-600 text-sm hover:text-blue-800 flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Budget Forecast */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Forecast</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-base font-medium text-gray-700">Projected Spend</h4>
                <span className="text-xs text-gray-500">End of Year</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(1150000)}</p>
              <div className="flex items-center text-xs text-green-600">
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>8% under annual budget</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-base font-medium text-gray-700">Forecast Accuracy</h4>
                <span className="text-xs text-gray-500">Last 6 Months</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{financialOverview.forecastAccuracy}%</p>
              <div className="flex items-center text-xs text-green-600">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>2.3% improvement from Q1</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-base font-medium text-gray-700">Budget Health</h4>
                <span className="text-xs text-gray-500">Current Status</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mb-2">Good</p>
              <div className="flex items-center text-xs text-gray-600">
                <span>On track with projections</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Generate Detailed Forecast
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
