import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { useLeaveRequests, useToast, useForm } from '../../hooks/useApi';
import { PermissionGuard, PermissionButton } from '../../components/ui/PermissionGuard';
import { shouldBypassAuth } from '@/lib/auth';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { GetServerSideProps } from 'next';

// Leave request form interface
interface LeaveRequestForm {
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  manager_email: string;
  employee_name: string;
  employee_email: string;
}

const LeaveManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const allowAccess = shouldBypassAuth(router.query);
  const toast = useToast();
  
  // API hooks
  const { 
    requests: supabaseRequests, 
    loading, 
    error: apiError, 
    submitRequest, 
    approveRequest, 
    rejectRequest 
  } = useLeaveRequests();
  
  // States
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState(apiError);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectModalRequest, setRejectModalRequest] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Fallback mock data in case Supabase fails
  useEffect(() => {
    // Only update state if we have new data or different error state
    if (supabaseRequests?.length > 0 && (!requests.length || JSON.stringify(supabaseRequests) !== JSON.stringify(requests))) {
      setRequests(supabaseRequests);
      if (error) setError(null);
    } else if (apiError && error !== apiError) {
      // If there's an error and we haven't loaded mock data yet
      console.warn('Using fallback mock data due to error:', apiError);
      const mockData = [
      {
        id: '1',
          employee_id: '1',
          employee_name: 'John Smith',
          employee_email: 'john.smith@company.com',
        type: 'Annual Leave',
          start_date: '2024-06-15',
          end_date: '2024-06-20',
        days: 5,
          status: 'pending',
        reason: 'Family vacation',
          created_at: '2024-06-01T10:00:00Z',
          manager_email: 'manager@company.com'
      },
      {
        id: '2',
          employee_id: '2',
          employee_name: 'Sarah Johnson',
          employee_email: 'sarah.johnson@company.com',
        type: 'Sick Leave',
          start_date: '2024-06-10',
          end_date: '2024-06-11',
          days: 2,
        status: 'approved',
        reason: 'Medical appointment',
          created_at: '2024-06-05T14:30:00Z',
          approved_at: '2024-06-06T09:15:00Z',
          manager_email: 'manager@company.com'
      },
      {
        id: '3',
          employee_id: '3',
          employee_name: 'Alex Chen',
          employee_email: 'alex.chen@company.com',
          type: 'Personal Leave',
          start_date: '2024-07-01',
          end_date: '2024-07-03',
        days: 3,
          status: 'pending',
          reason: 'Moving to new apartment',
          created_at: '2024-06-10T16:45:00Z',
          manager_email: 'manager@company.com'
        }
      ];
      setRequests(mockData);
      setError(apiError);
    }
  }, [supabaseRequests, apiError, requests, error]);
  
  // Form management
  const form = useForm<LeaveRequestForm>({
    type: '',
    start_date: '',
    end_date: '',
    reason: '',
    manager_email: '',
    employee_name: user?.name || user?.email || '',
    employee_email: user?.email || ''
  });

  // Make sure modals can be closed even if there are errors
  const closeRequestModal = () => {
    setShowRequestModal(false);
  };

  const closeRejectModal = () => {
    setRejectModalRequest(null);
  };

  // Handle form submission
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.type) {
      form.setError('type', 'Leave type is required');
      hasErrors = true;
    }
    
    if (!form.values.start_date) {
      form.setError('start_date', 'Start date is required');
      hasErrors = true;
    }
    
    if (!form.values.end_date) {
      form.setError('end_date', 'End date is required');
      hasErrors = true;
    }
    
    if (!form.values.reason) {
      form.setError('reason', 'Reason is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      // Create the request data
      const requestData = {
        ...form.values,
        id: `temp-${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString(),
        days: calculateDays(form.values.start_date, form.values.end_date)
      };
      
      // Optimistically update UI
      setRequests(prev => [requestData, ...prev]);
      
      // Make the API call
      await submitRequest(form.values);
      toast.success('Leave request submitted successfully!');
      form.reset();
      closeRequestModal();
    } catch (error) {
      // Remove the optimistic update
      setRequests(prev => prev.filter(req => !req.id.startsWith('temp-')));
      
      toast.error(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    } catch (err) {
      console.error('Error calculating days:', err);
      return 1;
    }
  };

  // Handle approve request
  const handleApprove = async (requestId: string) => {
    try {
      // Optimistically update the UI
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved', approved_at: new Date().toISOString() } 
            : req
        )
      );
      
      // Make the API call
      await approveRequest(requestId);
      toast.success('Leave request approved!');
    } catch (error) {
      // Revert the optimistic update
      if (supabaseRequests) {
        setRequests([...supabaseRequests]);
      }
      toast.error(error instanceof Error ? error.message : 'Failed to approve request');
    }
  };

  // Handle reject request
  const handleReject = async (requestId: string, reason: string) => {
    try {
      // Optimistically update the UI
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'rejected', 
                rejected_at: new Date().toISOString(),
                rejection_reason: reason
              } 
            : req
        )
      );
      
      // Make the API call
      await rejectRequest(requestId, reason);
      toast.success('Leave request rejected');
      setRejectModalRequest(null);
    } catch (error) {
      // Revert the optimistic update
      if (supabaseRequests) {
        setRequests([...supabaseRequests]);
      }
      toast.error(error instanceof Error ? error.message : 'Failed to reject request');
    }
  };

  // Calculate leave statistics
  const leaveStats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    total: requests.length,
    thisMonth: requests.filter(r => {
      try {
        return new Date(r.created_at).getMonth() === new Date().getMonth();
      } catch (err) {
        return false;
      }
    }).length
  };

  if (loading && !requests.length) {
    return (
      <SimpleDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </SimpleDashboardLayout>
    );
  }

  if (!allowAccess && !user) {
    return (
      <SimpleDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Please log in to access leave management.</p>
          </div>
        </div>
      </SimpleDashboardLayout>
    );
  }

  return (
    <SimpleDashboardLayout>
      <Head>
        <title>Leave Management | HR System</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
              <p className="text-gray-600 mt-2">Manage leave requests and approvals</p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Request Leave
            </button>
          </div>
                  </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{leaveStats.pending}</p>
                  </div>
              <div className="text-3xl">⏳</div>
                </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
                </div>
              <div className="text-3xl">✅</div>
                </div>
                </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{leaveStats.total}</p>
                  </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">{leaveStats.thisMonth}</p>
              </div>
              <div className="text-3xl">📅</div>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
            </div>
            
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
              <p className="text-gray-500 mb-6">Start by creating a new leave request using the button above.</p>
              <button
                onClick={() => setShowRequestModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Request Leave
              </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map(request => (
                      <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.employee_name}</div>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.type}</div>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </div>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.days}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                          </span>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        {request.status === 'pending' && hasPermission('leave_requests', 'approve') && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectModalRequest(request)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        {/* Request Leave Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Leave</h3>
                <button 
                  onClick={closeRequestModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Type
                    </label>
                    <select
                      value={form.values.type}
                      onChange={(e) => form.setValue('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select leave type</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Personal Leave">Personal Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                      <option value="Paternity Leave">Paternity Leave</option>
                    </select>
                    {form.errors.type && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.type}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={form.values.start_date}
                        onChange={(e) => form.setValue('start_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                      {form.errors.start_date && (
                        <p className="text-red-600 text-sm mt-1">{form.errors.start_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={form.values.end_date}
                        onChange={(e) => form.setValue('end_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                      {form.errors.end_date && (
                        <p className="text-red-600 text-sm mt-1">{form.errors.end_date}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager Email
                    </label>
                    <input
                      type="email"
                      value={form.values.manager_email}
                      onChange={(e) => form.setValue('manager_email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="manager@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <textarea
                      value={form.values.reason}
                      onChange={(e) => form.setValue('reason', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Please provide a reason for your leave..."
                      required
                    />
                    {form.errors.reason && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.reason}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={closeRequestModal}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectModalRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reject Leave Request</h3>
                <button 
                  onClick={closeRejectModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject this leave request for {rejectModalRequest.employee_name}?
              </p>
              
              <textarea
                placeholder="Reason for rejection..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                rows={3}
                id="rejection-reason"
              />

              <div className="flex space-x-4">
                <button
                  onClick={closeRejectModal}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement)?.value;
                    if (reason) {
                      handleReject(rejectModalRequest.id, reason);
                    } else {
                      toast.warning('Please provide a reason for rejection');
                    }
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toast.toasts.map(t => (
            <div
              key={t.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white ${
                t.type === 'success' ? 'bg-green-500' :
                t.type === 'error' ? 'bg-red-500' :
                t.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{t.message}</span>
                <button
                  onClick={() => toast.removeToast(t.id)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </SimpleDashboardLayout>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default LeaveManagementPage; 
