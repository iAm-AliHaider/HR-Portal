import React, { useState } from 'react';
import Head from 'next/head';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import {
  ChartPie,
  CreditCard,
  Users, 
  Settings,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart
} from 'lucide-react';
import { GetServerSideProps } from 'next';

// Mock analytics data
const LOAN_ANALYTICS = {
  totalActive: 42,
  totalAmount: 4250000,
  totalPending: 8,
  totalOverdue: 3,
  monthlyDisbursement: 560000,
  monthlyRepayment: 380000,
  approvalRate: 87,
  popularTypes: [
    { type: 'Personal Loan', count: 18, amount: 1580000 },
    { type: 'Education Loan', count: 12, amount: 1200000 },
    { type: 'Home Loan', count: 8, amount: 1200000 },
    { type: 'Emergency Loan', count: 4, amount: 270000 }
  ],
  recentActivity: [
    { id: 'LN-2023-042', employee: 'Riley Morgan', action: 'Application Submitted', date: '2023-03-15T10:30:00', type: 'Personal Loan' },
    { id: 'LN-2023-041', employee: 'Casey Brown', action: 'Loan Approved', date: '2023-03-14T16:15:00', type: 'Education Loan' },
    { id: 'LN-2023-039', employee: 'Alex Johnson', action: 'Payment Received', date: '2023-03-14T09:45:00', type: 'Personal Loan' },
    { id: 'LN-2023-037', employee: 'Taylor Wilson', action: 'Application Rejected', date: '2023-03-13T14:20:00', type: 'Home Loan' },
    { id: 'LN-2023-036', employee: 'Jamie Smith', action: 'Documents Uploaded', date: '2023-03-13T11:10:00', type: 'Emergency Loan' }
  ],
  monthlyStats: [
    { month: 'Jan', applications: 12, approvals: 10, disbursements: 8 },
    { month: 'Feb', applications: 15, approvals: 13, disbursements: 11 },
    { month: 'Mar', applications: 10, approvals: 8, disbursements: 7 }
  ]
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function LoanManagementDashboard() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if user has admin rights
  const isAdmin = role === 'admin' || role === 'hr_director' || role === 'finance_manager';
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if user has access
  if (!isAdmin) {
    return (
      <ModernDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the loan management dashboard.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </ModernDashboardLayout>
    );
  }
  
  return (
    <ModernDashboardLayout>
      <Head>
        <title>Loan Management Dashboard | HR Portal</title>
        <meta name="description" content="Admin dashboard for loan management" />
      </Head>
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview and management of the company loan program</p>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" value={activeTab} onChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ChartPie className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="repayments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Repayments
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Program Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Loans</p>
                      <p className="text-2xl font-bold mt-1">{LOAN_ANALYTICS.totalActive}</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+4%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(LOAN_ANALYTICS.totalAmount)}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Applications</p>
                      <p className="text-2xl font-bold mt-1">{LOAN_ANALYTICS.totalPending}</p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">-2</span>
                    <span className="text-gray-500 ml-1">from last week</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Overdue Payments</p>
                      <p className="text-2xl font-bold mt-1">{LOAN_ANALYTICS.totalOverdue}</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <ArrowUpRight className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">+1</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Disbursement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(LOAN_ANALYTICS.monthlyDisbursement)}</p>
                      <p className="text-sm text-gray-500 mt-1">This month</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <ArrowUpRight className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Repayment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(LOAN_ANALYTICS.monthlyRepayment)}</p>
                      <p className="text-sm text-gray-500 mt-1">This month</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ArrowDownRight className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Approval Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{LOAN_ANALYTICS.approvalRate}%</p>
                      <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Popular Loan Types & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Loan Types</CardTitle>
                  <CardDescription>Distribution of active loans by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {LOAN_ANALYTICS.popularTypes.map((type, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 bg-${['blue', 'green', 'purple', 'yellow'][index]}-500`}></div>
                          <span className="text-sm font-medium">{type.type}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{type.count} loans</span>
                          <span className="text-sm font-medium">{formatCurrency(type.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/loans/settings')}
                    >
                      Manage Loan Types
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest loan program activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {LOAN_ANALYTICS.recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <span>{activity.id}</span>
                            <span>•</span>
                            <span>{activity.employee}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/loans/applications')}
                    >
                      View All Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
                <CardDescription>Manage employee loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>To manage loan applications, navigate to the dedicated applications page:</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push('/loans/applications')}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      View All Applications
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('overview')}
                      className="flex items-center gap-2"
                    >
                      <ChartPie className="w-4 h-4" />
                      Back to Overview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Repayments Tab */}
          <TabsContent value="repayments">
            <Card>
              <CardHeader>
                <CardTitle>Loan Repayments</CardTitle>
                <CardDescription>Monitor loan repayment schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>To manage loan repayments, navigate to the dedicated repayment schedule page:</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push('/loans/repayment-schedule')}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      View Repayment Schedules
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('overview')}
                      className="flex items-center gap-2"
                    >
                      <ChartPie className="w-4 h-4" />
                      Back to Overview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Loan Program Settings</CardTitle>
                <CardDescription>Configure the company loan program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>To manage loan program settings, navigate to the dedicated settings page:</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push('/loans/settings')}
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Loan Settings
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('overview')}
                      className="flex items-center gap-2"
                    >
                      <ChartPie className="w-4 h-4" />
                      Back to Overview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModernDashboardLayout>
  );
} 
