import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  CreditCard, 
  FileText, 
  Filter, 
  Search, 
  ExternalLink,
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Eye,
  Plus,
  AlertCircle,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { GetServerSideProps } from 'next';

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};

export default function LoanApplicationsPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0
  });

  const isAdmin = role === 'admin' || role === 'hr_manager' || role === 'finance_manager';
  
  // Load applications on component mount
  useEffect(() => {
    loadApplications();
    if (isAdmin) {
      loadAnalytics();
    }
  }, [statusFilter]);

  // Load loan applications from API
  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const endpoint = isAdmin 
        ? `/api/loans?type=applications&status=${statusFilter}`
        : `/api/loans?type=employee-loans&employee_id=${user?.id || 'current-user'}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        // Fallback to mock data
        const mockApplications = [
          {
            id: 'LN-2024-001',
            employee_name: 'John Smith',
            employee_email: 'john.smith@company.com',
            loan_type: 'Personal Loan',
            amount: 50000,
            purpose: 'Home renovation',
            term_months: 24,
            status: 'pending',
            application_date: '2024-01-15',
            monthly_payment: 2250.45,
            interest_rate: 9.5,
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 'LN-2024-002',
            employee_name: 'Sarah Johnson',
            employee_email: 'sarah.johnson@company.com',
            loan_type: 'Education Loan',
            amount: 100000,
            purpose: 'Masters degree program',
            term_months: 60,
            status: 'approved',
            application_date: '2024-01-10',
            monthly_payment: 2055.50,
            interest_rate: 8.5,
            disbursement_date: '2024-01-20',
            created_at: '2024-01-10T14:30:00Z'
          },
          {
            id: 'LN-2024-003',
            employee_name: 'Mike Wilson',
            employee_email: 'mike.wilson@company.com',
            loan_type: 'Emergency Loan',
            amount: 25000,
            purpose: 'Medical emergency',
            term_months: 12,
            status: 'rejected',
            application_date: '2024-01-08',
            rejection_reason: 'Insufficient documentation',
            created_at: '2024-01-08T09:00:00Z'
          }
        ];
        
        // Filter mock data based on user role
        if (!isAdmin) {
          const userApplications = mockApplications.filter(
            app => app.employee_email === (user?.email || 'john.smith@company.com')
          );
          setApplications(userApplications);
        } else {
          setApplications(mockApplications);
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load analytics for admin users
  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/loans?type=analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics({
          total: data.total_applications || 0,
          pending: data.pending_applications || 0,
          approved: data.approved_applications || 0,
          rejected: data.rejected_applications || 0,
          disbursed: data.disbursed_applications || 0
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // Handle application approval (admin only)
  const handleApproveApplication = async (applicationId: string) => {
    if (!isAdmin) return;

    const approvedAmount = prompt('Enter approved amount:');
    const notes = prompt('Enter approval notes (optional):');
    
    if (!approvedAmount) return;

    try {
      const response = await fetch('/api/loans?type=approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loan_id: applicationId,
          approved_amount: parseFloat(approvedAmount),
          interest_rate: 9.5, // Default rate - should be calculated based on loan type
          notes: notes || '',
          approver_id: user?.id || 'current-admin'
        }),
      });

      if (response.ok) {
        alert('Application approved successfully!');
        loadApplications(); // Refresh the list
      } else {
        alert('Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Error approving application');
    }
  };

  // Handle application rejection (admin only)
  const handleRejectApplication = async (applicationId: string) => {
    if (!isAdmin) return;

    const rejectionReason = prompt('Enter rejection reason:');
    if (!rejectionReason) return;

    try {
      const response = await fetch('/api/loans?type=reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loan_id: applicationId,
          rejection_reason: rejectionReason,
          approver_id: user?.id || 'current-admin'
        }),
      });

      if (response.ok) {
        alert('Application rejected successfully!');
        loadApplications(); // Refresh the list
      } else {
        alert('Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error rejecting application');
    }
  };
  
  // Function to view application details
  const handleViewApplication = (id: string) => {
    router.push(`/loans/applications/${id}`);
  };
  
  // Filter applications based on search term and status filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loan_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.employee_name && app.employee_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'disbursed':
        return <Badge className="bg-blue-100 text-blue-800">Disbursed</Badge>;
      case 'under_review':
        return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <>
      <Head>
        <title>Loan Applications | HR Portal</title>
        <meta name="description" content="View and manage loan applications" />
      </Head>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'All Loan Applications' : 'My Loan Applications'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'Review and manage employee loan applications' : 'View and track your loan applications'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={loadApplications}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={() => router.push('/loans/apply')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Application
            </Button>
          </div>
        </div>

        {/* Analytics Cards (Admin Only) */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
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
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{analytics.pending}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.approved}</p>
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
                    <p className="text-sm font-medium text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.rejected}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Disbursed</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.disbursed}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                    placeholder="Search applications..."
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
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Loan Applications</span>
              <span className="text-sm font-normal text-gray-500">
                {filteredApplications.length} of {applications.length} applications
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading applications...</span>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No applications match your current filters.' 
                    : 'You haven\'t submitted any loan applications yet.'}
                </p>
                <Button onClick={() => router.push('/loans/apply')}>
                  Apply for Loan
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan Information
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount & Term
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
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{app.id}</div>
                            {isAdmin && app.employee_name && (
                              <div className="text-sm text-gray-500">{app.employee_name}</div>
                            )}
                            <div className="text-sm text-gray-500">
                              Applied: {formatDate(app.application_date)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{app.loan_type}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate" title={app.purpose}>
                              {app.purpose}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(app.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.term_months} months
                            </div>
                            {app.monthly_payment && (
                              <div className="text-sm text-gray-500">
                                EMI: {formatCurrency(app.monthly_payment)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {getStatusBadge(app.status)}
                            {app.disbursement_date && (
                              <div className="text-xs text-gray-500">
                                Disbursed: {formatDate(app.disbursement_date)}
                              </div>
                            )}
                            {app.rejection_reason && (
                              <div className="text-xs text-red-600" title={app.rejection_reason}>
                                Reason: {app.rejection_reason.substring(0, 30)}...
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewApplication(app.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {isAdmin && app.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveApplication(app.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectApplication(app.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/loans/apply')}
                className="flex items-center gap-2 justify-start h-auto p-4"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Apply for New Loan</div>
                  <div className="text-sm text-gray-500">Submit a new loan application</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/loans/repayment-schedule')}
                className="flex items-center gap-2 justify-start h-auto p-4"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">View Repayment Schedule</div>
                  <div className="text-sm text-gray-500">Check your loan repayment timeline</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/loans')}
                className="flex items-center gap-2 justify-start h-auto p-4"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Loan Dashboard</div>
                  <div className="text-sm text-gray-500">Go to main loans overview</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 
