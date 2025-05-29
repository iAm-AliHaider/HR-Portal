import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GetServerSideProps } from 'next';

interface Request {
  id: string;
  employeeId?: string;
  employee_name?: string;
  employee_email?: string;
  type: string;
  category: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  status: 'pending' | 'approved' | 'rejected';
  details: any;
  submittedDate: string;
  submitted_date?: string;
  notes?: string;
  approver: string;
}

const ApprovalsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure user has access to this page (managers and admins only)
  useEffect(() => {
    if (!allowAccess && !['manager', 'admin', 'hr_manager'].includes(role)) {
      router.push('/login?redirect=/leave/approvals');
    }
  }, [allowAccess, role, router]);

  // Load all requests for approval
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        // Fallback to mock data
        const mockRequests: Request[] = [
          {
            id: 'REQ-2023-001',
            employee_name: 'John Smith',
            employee_email: 'john.smith@company.com',
            type: 'leave',
            category: 'timeAndLeave',
            title: 'Annual Leave Request',
            description: 'Family vacation - pre-planned trip',
            startDate: '2024-02-15',
            endDate: '2024-02-19',
            days: 5,
            status: 'pending',
            details: {
              leaveType: 'Annual Leave',
              startDate: '2024-02-15',
              endDate: '2024-02-19',
              reason: 'Family vacation - pre-planned trip'
            },
            submittedDate: '2024-01-20',
            approver: 'Sarah Johnson'
          },
          {
            id: 'REQ-2023-002',
            employee_name: 'Sarah Johnson',
            employee_email: 'sarah.johnson@company.com',
            type: 'equipment',
            category: 'equipmentAndResources',
            title: 'Laptop Upgrade Request',
            description: 'Current laptop experiencing performance issues',
            status: 'pending',
            details: {
              equipmentType: 'Laptop',
              urgency: 'High',
              reason: 'Current laptop is 4 years old and affecting productivity'
            },
            submittedDate: '2024-01-23',
            approver: 'IT Department'
          },
          {
            id: 'REQ-2023-003',
            employee_name: 'Mike Wilson',
            employee_email: 'mike.wilson@company.com',
            type: 'training',
            category: 'careerAndDevelopment', 
            title: 'React Training Course',
            description: 'Advanced React development training',
            status: 'pending',
            details: {
              courseName: 'Advanced React Patterns',
              cost: 599,
              duration: '3 days',
              justification: 'Needed for upcoming project requirements'
            },
            submittedDate: '2024-01-28',
            approver: 'HR Department'
          }
        ];
        setRequests(mockRequests);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    try {
      const response = await fetch('/api/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          status: newStatus,
          notes,
          approver_id: user?.id || 'current-manager'
        }),
      });

      if (response.ok) {
        // Update local state
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId ? { 
              ...request, 
              status: newStatus, 
              notes: notes || request.notes 
            } : request
          )
        );
      } else {
        // Fallback: update local state only
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId ? { 
              ...request, 
              status: newStatus, 
              notes: notes || request.notes 
            } : request
          )
        );
      }
    } catch (error) {
      console.error('Error updating request:', error);
      // Still update local state as fallback
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { 
            ...request, 
            status: newStatus, 
            notes: notes || request.notes 
          } : request
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      timeAndLeave: 'Time & Leave',
      financeAndBenefits: 'Finance & Benefits',
      equipmentAndResources: 'Equipment & Resources',
      careerAndDevelopment: 'Career & Development',
      administrative: 'Administrative'
    };
    return categoryMap[category] || category;
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesSearch = 
      (request.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (request.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (request.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (!allowAccess && !['manager', 'admin', 'hr_manager'].includes(role)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Approval Center" subtitle="Review and approve employee requests">
      <Head>
        <title>Approval Center - HR Management</title>
        <meta name="description" content="Review and approve employee requests" />
      </Head>
      
      <div className="p-4 md:p-6">
        {pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium float-right mb-4">
            {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by employee name, request title, or description..."
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="timeAndLeave">Time & Leave</option>
                <option value="equipmentAndResources">Equipment & Resources</option>
                <option value="careerAndDevelopment">Career & Development</option>
                <option value="financeAndBenefits">Finance & Benefits</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
            <p className="text-2xl font-bold text-gray-900">{filteredRequests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">This Week</h3>
            <p className="text-2xl font-bold text-blue-600">
              {requests.filter(r => {
                const submitDate = new Date(r.submittedDate || r.submitted_date || '');
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return submitDate >= weekAgo;
              }).length}
            </p>
          </div>
        </div>

        {/* Requests */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Requests for Approval</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No requests found matching your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                  getCategoryName={getCategoryName}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Individual Request Card Component
const RequestCard = ({ request, onStatusChange, getCategoryName, getStatusColor }: {
  request: Request;
  onStatusChange: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  getCategoryName: (category: string) => string;
  getStatusColor: (status: string) => string;
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(request.notes || '');

  const handleApproval = (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !notes.trim()) {
      alert('Please provide a reason for rejection.');
      setShowNotes(true);
      return;
    }
    onStatusChange(request.id, status, notes);
    setShowNotes(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{request.employee_email}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            <div>
              <span className="text-xs font-medium text-gray-500">Leave Type</span>
              <p className="text-sm text-gray-900">{request.type}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Duration</span>
              <p className="text-sm text-gray-900">{request.days} day{request.days !== 1 ? 's' : ''}</p>
            </div>
            <div>
              {request.startDate && request.endDate && (
                <>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Start Date</span>
                    <p className="text-sm text-gray-900">{new Date(request.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">End Date</span>
                    <p className="text-sm text-gray-900">{new Date(request.endDate).toLocaleDateString()}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="mb-3">
              <span className="text-xs font-medium text-gray-500">Description</span>
              <p className="text-sm text-gray-900">{request.description}</p>
            </div>

            {request.notes && (
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">Manager Notes</span>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{request.notes}</p>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Submitted on {new Date(request.submittedDate || request.submitted_date || '').toLocaleDateString()}
            </p>
          </div>

          {request.status === 'pending' && (
            <div className="ml-4">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => handleApproval('approved')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
              
              {showNotes && (
                <div className="mt-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full text-sm border border-gray-300 rounded p-2 mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval('rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setShowNotes(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default ApprovalsPage; 
