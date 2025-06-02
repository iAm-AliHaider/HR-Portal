import Link from "next/link";
import React, { useState } from "react";

interface LeaveRequest {
  id: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
  requestDate: string;
}

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeName: "John Doe",
      leaveType: "Annual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-19",
      days: 5,
      status: "Pending",
      reason: "Family vacation",
      requestDate: "2024-01-25",
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      leaveType: "Sick Leave",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      days: 3,
      status: "Approved",
      reason: "Medical appointment",
      requestDate: "2024-02-08",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    employeeName: "",
    leaveType: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const navigation = [
    { name: "Dashboard", href: "/dashboard-modern" },
    { name: "People", href: "/people-modern" },
    { name: "Jobs", href: "/jobs-modern" },
    { name: "Leave", href: "/leave-modern", current: true },
    { name: "Assets", href: "/assets-modern" },
  ];

  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Personal Leave",
    "Maternity/Paternity Leave",
    "Emergency Leave",
  ];

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateDays(newRequest.startDate, newRequest.endDate);
    const request: LeaveRequest = {
      ...newRequest,
      id: Math.max(...leaveRequests.map((req) => req.id)) + 1,
      days,
      status: "Pending",
      requestDate: new Date().toISOString().split("T")[0],
    };
    setLeaveRequests([...leaveRequests, request]);
    setNewRequest({
      employeeName: "",
      leaveType: "Annual Leave",
      startDate: "",
      endDate: "",
      reason: "",
    });
    setShowAddForm(false);
  };

  const updateRequestStatus = (id: number, status: "Approved" | "Rejected") => {
    setLeaveRequests(
      leaveRequests.map((req) => (req.id === id ? { ...req, status } : req)),
    );
  };

  const deleteRequest = (id: number) => {
    if (confirm("Are you sure you want to delete this leave request?")) {
      setLeaveRequests(leaveRequests.filter((req) => req.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">HR Portal</h1>
              <div className="ml-10 flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Leave Management
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Request Leave
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Requests
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {leaveRequests.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {leaveRequests.filter((req) => req.status === "Pending").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-bold text-green-600">
                {
                  leaveRequests.filter((req) => req.status === "Approved")
                    .length
                }
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Days</h3>
              <p className="text-2xl font-bold text-blue-600">
                {leaveRequests
                  .filter((req) => req.status === "Approved")
                  .reduce((sum, req) => sum + req.days, 0)}
              </p>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
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
                    Reason
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.employeeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Requested {request.requestDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.startDate} to {request.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateRequestStatus(request.id, "Approved")
                            }
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateRequestStatus(request.id, "Rejected")
                            }
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Leave Request Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Request Leave
                </h3>
                <form onSubmit={handleAddRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Employee Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newRequest.employeeName}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          employeeName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Leave Type
                    </label>
                    <select
                      value={newRequest.leaveType}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          leaveType: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {leaveTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newRequest.startDate}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          startDate: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newRequest.endDate}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          endDate: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason
                    </label>
                    <textarea
                      required
                      value={newRequest.reason}
                      onChange={(e) =>
                        setNewRequest({ ...newRequest, reason: e.target.value })
                      }
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {newRequest.startDate && newRequest.endDate && (
                    <div className="text-sm text-gray-600">
                      Total days:{" "}
                      {calculateDays(newRequest.startDate, newRequest.endDate)}
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaveManagement;
