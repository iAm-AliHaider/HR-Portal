import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  ClipboardList, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Mock data for demonstration
const loanPrograms = [
  { id: 1, name: 'Personal Loan', interestRate: '8-12%', maxAmount: 50000, term: '1-5 years', eligibility: 'All permanent employees' },
  { id: 2, name: 'Education Loan', interestRate: '5-7%', maxAmount: 100000, term: '1-10 years', eligibility: 'Employees with >2 years tenure' },
  { id: 3, name: 'Home Loan', interestRate: '6-9%', maxAmount: 5000000, term: '5-30 years', eligibility: 'Confirmed employees with >3 years tenure' },
  { id: 4, name: 'Emergency Loan', interestRate: '0-3%', maxAmount: 30000, term: '1-3 years', eligibility: 'All employees (case-by-case approval)' },
];

const recentApplications = [
  { id: 'LN-2023-001', employeeName: 'Alex Johnson', type: 'Personal Loan', amount: 25000, date: '2023-11-15', status: 'Approved' },
  { id: 'LN-2023-002', employeeName: 'Jamie Smith', type: 'Education Loan', amount: 75000, date: '2023-11-10', status: 'Pending Approval' },
  { id: 'LN-2023-003', employeeName: 'Taylor Wilson', type: 'Emergency Loan', amount: 15000, date: '2023-11-08', status: 'Under Review' },
  { id: 'LN-2023-004', employeeName: 'Morgan Lee', type: 'Home Loan', amount: 2500000, date: '2023-11-01', status: 'Documentation Required' },
  { id: 'LN-2023-005', employeeName: 'Casey Brown', type: 'Personal Loan', amount: 30000, date: '2023-10-28', status: 'Approved' },
];

const upcomingRepayments = [
  { id: 'PMT-2023-042', employeeName: 'Dana Parker', loanId: 'LN-2022-089', amount: 5000, dueDate: '2023-11-30', status: 'Upcoming' },
  { id: 'PMT-2023-041', employeeName: 'Robin Taylor', loanId: 'LN-2022-124', amount: 8500, dueDate: '2023-11-30', status: 'Upcoming' },
  { id: 'PMT-2023-040', employeeName: 'Alex Johnson', loanId: 'LN-2023-001', amount: 2250, dueDate: '2023-11-25', status: 'Upcoming' },
  { id: 'PMT-2023-039', employeeName: 'Jordan Miller', loanId: 'LN-2022-156', amount: 12000, dueDate: '2023-11-15', status: 'Overdue' },
];

export default function LoansManagementPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  const isAdmin = role === 'admin' || role === 'hr_director' || role === 'hr_manager' || role === 'finance_manager';
  
  // Dashboard metrics
  const metrics = {
    activeLoans: 183,
    disbursedAmount: 12500000,
    pendingApplications: 14,
    upcomingRepayments: 42,
    overdue: 5
  };

  const handleNewLoanApplication = () => {
    router.push('/loans/apply');
  };

  const handleViewApplication = (id: string) => {
    router.push(`/loans/applications/${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Pending Approval':
        return <Badge className="bg-blue-100 text-blue-800">Pending Approval</Badge>;
      case 'Under Review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'Documentation Required':
        return <Badge className="bg-purple-100 text-purple-800">Documentation Required</Badge>;
      case 'Upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <>
      <Head>
        <title>Loan Management | HR Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
            <p className="text-gray-600 mt-1">Manage employee loans, applications, and repayments</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleNewLoanApplication}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Apply for Loan
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => router.push('/loans/settings')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Loan Settings
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="my-loans">My Loans</TabsTrigger>
            {isAdmin && <TabsTrigger value="management">Management</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Loans</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.activeLoans}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Disbursed Amount</p>
                      <p className="text-2xl font-bold text-gray-900">₹{(metrics.disbursedAmount).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.pendingApplications}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Upcoming Repayments</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.upcomingRepayments}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Overdue</p>
                      <p className="text-2xl font-bold text-red-600">{metrics.overdue}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Loan Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Available Loan Programs</span>
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => router.push('/loans/programs')}>
                      Manage Programs
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {loanPrograms.map(program => (
                    <div key={program.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{program.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {program.interestRate}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Max Amount:</span>
                        </div>
                        <div>₹{program.maxAmount.toLocaleString()}</div>
                        <div>
                          <span className="text-gray-500">Term:</span>
                        </div>
                        <div>{program.term}</div>
                        <div>
                          <span className="text-gray-500">Eligibility:</span>
                        </div>
                        <div>{program.eligibility}</div>
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push({
                            pathname: '/loans/apply',
                            query: { program: program.id }
                          })}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Recent Applications</span>
                  <Button 
                    variant="link" 
                    onClick={() => setSelectedTab('applications')}
                    className="text-blue-600"
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map(app => (
                        <tr key={app.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{app.id}</td>
                          <td className="py-3 px-4">{app.employeeName}</td>
                          <td className="py-3 px-4">{app.type}</td>
                          <td className="py-3 px-4">₹{app.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">{new Date(app.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewApplication(app.id)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Repayments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Upcoming Repayments</span>
                  <Button 
                    variant="link" 
                    onClick={() => router.push('/loans/repayments')}
                    className="text-blue-600"
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Loan ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingRepayments.map(payment => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{payment.id}</td>
                          <td className="py-3 px-4">{payment.employeeName}</td>
                          <td className="py-3 px-4">{payment.loanId}</td>
                          <td className="py-3 px-4">₹{payment.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">{new Date(payment.dueDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => router.push(`/loans/repayments/${payment.id}`)}
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-gray-500">
                  Applications tab content will be displayed here. You'll be able to view all loan applications, filter them by status, and manage them.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => router.push('/loans/applications')}>
                    View All Applications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-loans" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>My Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-gray-500">
                  My Loans tab content will be displayed here. You'll be able to view your active loans, repayment schedules, and make payments.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => router.push('/loans/my-loans')}>
                    View My Loans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="management" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-6 text-gray-500">
                    Management tab content will be displayed here. You'll be able to approve/reject applications, manage loan programs, and view reports.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => router.push('/loans/management')}>
                      View Management Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/loans/reports')}>
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
} 
