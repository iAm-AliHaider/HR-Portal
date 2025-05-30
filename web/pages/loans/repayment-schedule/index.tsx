import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft,
  Calendar,
  DollarSign, 
  Search, 
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { GetServerSideProps } from 'next';

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};

export default function RepaymentScheduleListPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [repayments, setRepayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const isAdmin = role === 'admin' || role === 'hr_manager' || role === 'finance_manager';

  // Load repayment data on component mount
  useEffect(() => {
    loadRepaymentData();
  }, [statusFilter]);

  // Load repayment schedule data from API
  const loadRepaymentData = async () => {
    try {
      setIsLoading(true);
      const endpoint = isAdmin 
        ? `/api/loans?type=repayments&status=${statusFilter}`
        : `/api/loans?type=repayments&employee_id=${user?.id || 'current-user'}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setRepayments(data);
      } else {
        // Fallback to mock data
        const mockRepayments = [
          {
            id: 'RPY-001',
            loan_id: 'LN-2024-001',
            installment_number: 1,
            due_date: '2024-02-15',
            amount: 2250.45,
            principal: 1834.12,
            interest: 416.33,
            status: 'paid',
            paid_date: '2024-02-14',
            late_fee: 0,
            loan_applications: {
              employee_name: 'John Smith',
              employee_id: 'EMP-001',
              loan_type: 'Personal Loan',
              amount: 50000,
              term_months: 24
            }
          },
          {
            id: 'RPY-002',
            loan_id: 'LN-2024-001',
            installment_number: 2,
            due_date: '2024-03-15',
            amount: 2250.45,
            principal: 1848.72,
            interest: 401.73,
            status: 'pending',
            paid_date: null,
            late_fee: 0,
            loan_applications: {
              employee_name: 'John Smith',
              employee_id: 'EMP-001',
              loan_type: 'Personal Loan',
              amount: 50000,
              term_months: 24
            }
          },
          {
            id: 'RPY-003',
            loan_id: 'LN-2024-002',
            installment_number: 1,
            due_date: '2024-02-20',
            amount: 2055.50,
            principal: 1731.67,
            interest: 323.83,
            status: 'paid',
            paid_date: '2024-02-20',
            late_fee: 0,
            loan_applications: {
              employee_name: 'Sarah Johnson',
              employee_id: 'EMP-002',
              loan_type: 'Education Loan',
              amount: 100000,
              term_months: 60
            }
          }
        ];
        
        if (!isAdmin) {
          const userRepayments = mockRepayments.filter(
            rep => rep.loan_applications?.employee_id === (user?.id || 'EMP-001')
          );
          setRepayments(userRepayments);
        } else {
          setRepayments(mockRepayments);
        }
      }
    } catch (error) {
      console.error('Error loading repayment data:', error);
      setRepayments([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Filter repayments based on search term
  const filteredRepayments = repayments.filter(repayment => {
    const matchesSearch = searchTerm === '' || 
      repayment.loan_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repayment.loan_applications?.employee_name && 
       repayment.loan_applications.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (repayment.loan_applications?.employee_id && 
       repayment.loan_applications.employee_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (repayment.loan_applications?.loan_type && 
       repayment.loan_applications.loan_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-800">Partial</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Calculate summary statistics
  const summaryStats = {
    totalInstallments: filteredRepayments.length,
    paidInstallments: filteredRepayments.filter(r => r.status === 'paid').length,
    pendingInstallments: filteredRepayments.filter(r => r.status === 'pending').length,
    overdueInstallments: filteredRepayments.filter(r => r.status === 'overdue').length,
    totalAmount: filteredRepayments.reduce((sum, r) => sum + r.amount, 0),
    paidAmount: filteredRepayments.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0)
  };
  
  return (
    <ModernDashboardLayout>
      <>
      <Head>
        <title>Loan Repayment Schedules | HR Portal</title>
        <meta name="description" content="View and manage loan repayment schedules" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'All Loan Repayment Schedules' : 'My Loan Repayment Schedules'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'View and manage all employee loan repayments' : 'View your loan repayment schedules and payment history'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={loadRepaymentData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={() => router.push('/loans')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Loans
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Installments</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryStats.totalInstallments}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Paid</p>
                  <p className="text-2xl font-bold text-green-600">{summaryStats.paidInstallments}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{summaryStats.pendingInstallments}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{summaryStats.overdueInstallments}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by loan ID, employee name, or loan type..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Repayments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Repayment Schedule</span>
              <span className="text-sm font-normal text-gray-500">
                {filteredRepayments.length} installments
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading repayment schedules...</span>
              </div>
            ) : filteredRepayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan Details
                      </th>
                      {isAdmin && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                      )}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Installment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRepayments.map((repayment) => (
                      <tr key={repayment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{repayment.loan_id}</div>
                            <div className="text-sm text-gray-500">{repayment.loan_applications?.loan_type || 'N/A'}</div>
                          </div>
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {repayment.loan_applications?.employee_name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {repayment.loan_applications?.employee_id || 'N/A'}
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{repayment.installment_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              of {repayment.loan_applications?.term_months || 'N/A'} installments
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(repayment.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Principal: {formatCurrency(repayment.principal)} | Interest: {formatCurrency(repayment.interest)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(repayment.due_date)}
                            </div>
                            {repayment.paid_date && (
                              <div className="text-sm text-green-600">
                                Paid: {formatDate(repayment.paid_date)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(repayment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/loans/repayment-schedule/${repayment.loan_id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No repayment schedules found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No repayments match your current filters.' 
                    : 'You don\'t have any active loan repayments yet.'}
                </p>
                <Button onClick={() => router.push('/loans/apply')}>
                  Apply for Loan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Payment Summary */}
        {filteredRepayments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold">{formatCurrency(summaryStats.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Amount</span>
                    <span className="font-semibold text-green-600">{formatCurrency(summaryStats.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Amount</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(summaryStats.totalAmount - summaryStats.paidAmount)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Progress</span>
                      <span className="font-semibold">
                        {summaryStats.totalInstallments > 0 
                          ? Math.round((summaryStats.paidInstallments / summaryStats.totalInstallments) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: summaryStats.totalInstallments > 0 
                            ? `${(summaryStats.paidInstallments / summaryStats.totalInstallments) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Automatic Deductions</h4>
                      <p className="text-gray-600 mt-1">
                        Loan payments are automatically deducted from your salary on the due date.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-3">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Early Payments</h4>
                      <p className="text-gray-600 mt-1">
                        You can make early payments without any prepayment penalties. Contact HR for assistance.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full mr-3">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Late Payments</h4>
                      <p className="text-gray-600 mt-1">
                        Late payments may incur additional charges. Please ensure sufficient balance in your account.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
        </ModernDashboardLayout>
  );
} 
