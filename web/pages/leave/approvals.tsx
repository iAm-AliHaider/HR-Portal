import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  submittedDate: string;
  notes?: string;
}

const LeaveApprovalsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure user has access to this page (managers and admins only)
  useEffect(() => {
    if (!allowAccess && !['manager', 'admin'].includes(role)) {
      router.push('/login?redirect=/leave/approvals');
    }
  }, [allowAccess, role, router]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockRequests: LeaveRequest[] = [
      {
        id: '1',
        employeeId: 'emp001',
        employeeName: 'John Smith',
        employeeEmail: 'john.smith@company.com',
        type: 'Annual Leave',
        startDate: '2024-02-15',
        endDate: '2024-02-19',
        days: 5,
        status: 'pending',
        reason: 'Family vacation - pre-planned trip',
        submittedDate: '2024-01-20'
      },
      {
        id: '2',
        employeeId: 'emp002',
        employeeName: 'Sarah Johnson',
        employeeEmail: 'sarah.johnson@company.com',
        type: 'Sick Leave',
        startDate: '2024-01-25',
        endDate: '2024-01-26',
        days: 2,
        status: 'pending',
        reason: 'Medical procedure',
        submittedDate: '2024-01-23'
      },
      {
        id: '3',
        employeeId: 'emp003',
        employeeName: 'Mike Wilson',
        employeeEmail: 'mike.wilson@company.com',
        type: 'Personal Leave',
        startDate: '2024-02-01',
        endDate: '2024-02-01',
        days: 1,
        status: 'approved',
        reason: 'Personal appointment',
        submittedDate: '2024-01-28'
      },
      {
        id: '4',
        employeeId: 'emp004',
        employeeName: 'Lisa Brown',
        employeeEmail: 'lisa.brown@company.com',
        type: 'Annual Leave',
        startDate: '2024-03-10',
        endDate: '2024-03-15',
        days: 6,
        status: 'rejected',
        reason: 'Spring break vacation',
        submittedDate: '2024-01-30',
        notes: 'Rejected due to project deadline conflicts'
      }
    ];
    setLeaveRequests(mockRequests);
    setIsLoading(false);
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    setLeaveRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId ? { ...request, status: newStatus, notes } : request
      )
    );
    // Here you would make an API call to update the status
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length;

  if (!allowAccess && !['manager', 'admin'].includes(role)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Leave Approvals" subtitle="Review and approve team leave requests">
      <Head>
        <title>Leave Approvals - HR Management</title>
        <meta name="description" content="Review and approve employee leave requests" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Header section can be removed since DashboardLayout handles it */}
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
                placeholder="Search by employee name or reason..."
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
              {leaveRequests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Days</h3>
            <p className="text-2xl font-bold text-blue-600">
              {filteredRequests.reduce((sum, r) => sum + r.days, 0)}
            </p>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No leave requests found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Individual Leave Request Card Component
const LeaveRequestCard = ({ request, onStatusChange }: {
  request: LeaveRequest;
  onStatusChange: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(request.notes || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

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
            <h3 className="text-lg font-semibold text-gray-900">{request.employeeName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{request.employeeEmail}</p>
          
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
              <span className="text-xs font-medium text-gray-500">Start Date</span>
              <p className="text-sm text-gray-900">{new Date(request.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">End Date</span>
              <p className="text-sm text-gray-900">{new Date(request.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-500">Reason</span>
            <p className="text-sm text-gray-900">{request.reason}</p>
          </div>

          {request.notes && (
            <div className="mb-3">
              <span className="text-xs font-medium text-gray-500">Manager Notes</span>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{request.notes}</p>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Submitted on {new Date(request.submittedDate).toLocaleDateString()}
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
  );
};

export default LeaveApprovalsPage; 