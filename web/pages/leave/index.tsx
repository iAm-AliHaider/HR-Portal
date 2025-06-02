import Head from "next/head";
import React, { useState } from "react";
import Layout from "../../components/layout/Layout";

interface LeaveRequest {
  id: number;
  employee_name: string;
  employee_email: string;
  type: "vacation" | "sick" | "personal" | "maternity" | "paternity";
  start_date: string;
  end_date: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  created_at: string;
  manager_notes?: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employee_name: "John Doe",
    employee_email: "john.doe@company.com",
    type: "vacation",
    start_date: "2024-02-15",
    end_date: "2024-02-20",
    days: 4,
    status: "pending",
    reason: "Family vacation to Hawaii",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    employee_name: "Jane Smith",
    employee_email: "jane.smith@company.com",
    type: "sick",
    start_date: "2024-01-22",
    end_date: "2024-01-23",
    days: 2,
    status: "approved",
    reason: "Doctor appointment and recovery",
    created_at: "2024-01-20T09:30:00Z",
    manager_notes: "Approved. Get well soon!",
  },
  {
    id: 3,
    employee_name: "Bob Wilson",
    employee_email: "bob.wilson@company.com",
    type: "personal",
    start_date: "2024-02-01",
    end_date: "2024-02-01",
    days: 1,
    status: "rejected",
    reason: "Personal errands",
    created_at: "2024-01-25T14:15:00Z",
    manager_notes: "Not enough notice provided",
  },
];

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(mockLeaveRequests);
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_email: "",
    type: "vacation" as LeaveRequest["type"],
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const days = calculateDays(formData.start_date, formData.end_date);

      const newRequest: LeaveRequest = {
        id: Date.now(),
        ...formData,
        days,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // Simulate API call
      setTimeout(() => {
        setLeaveRequests((prev) => [newRequest, ...prev]);
        setShowForm(false);
        setFormData({
          employee_name: "",
          employee_email: "",
          type: "vacation",
          start_date: "",
          end_date: "",
          reason: "",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: number,
    status: "approved" | "rejected",
    notes?: string,
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request.id === id
              ? { ...request, status, manager_notes: notes }
              : request,
          ),
        );
        setSelectedRequest(null);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to update leave request:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: LeaveRequest["type"]) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "maternity":
        return "bg-pink-100 text-pink-800";
      case "paternity":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequests =
    filter === "all"
      ? leaveRequests
      : leaveRequests.filter((req) => req.status === filter);

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter((req) => req.status === "pending").length,
    approved: leaveRequests.filter((req) => req.status === "approved").length,
    rejected: leaveRequests.filter((req) => req.status === "rejected").length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Head>
          <title>Leave Management | HR Portal</title>
        </Head>

        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Leave Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage employee leave requests and approvals
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Request Leave
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Total Requests
              </h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Approved</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
              <p className="text-3xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex space-x-4">
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            {(["all", "pending", "approved", "rejected"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === status
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title={`Filter by ${status} requests`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ),
            )}
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
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.employee_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.employee_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}
                      >
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {new Date(request.start_date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        to {new Date(request.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(request.id, "approved")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(request.id, "rejected")
                            }
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

          {/* Leave Request Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Request Leave
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="employee_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employee Name
                      </label>
                      <input
                        type="text"
                        id="employee_name"
                        name="employee_name"
                        required
                        value={formData.employee_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter employee name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="employee_email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="employee_email"
                        name="employee_email"
                        required
                        value={formData.employee_email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Leave Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        title="Select leave type"
                      >
                        <option value="vacation">Vacation</option>
                        <option value="sick">Sick Leave</option>
                        <option value="personal">Personal</option>
                        <option value="maternity">Maternity</option>
                        <option value="paternity">Paternity</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="start_date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="start_date"
                          name="start_date"
                          required
                          value={formData.start_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          title="Select start date"
                          placeholder="YYYY-MM-DD"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="end_date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          id="end_date"
                          name="end_date"
                          required
                          value={formData.end_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          title="Select end date"
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Reason
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        rows={3}
                        required
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please provide a reason for your leave request"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Request Details Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Leave Request Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Employee:</span>{" "}
                      {selectedRequest.employee_name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedRequest.employee_email}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedRequest.type}
                    </div>
                    <div>
                      <span className="font-medium">Dates:</span>{" "}
                      {new Date(
                        selectedRequest.start_date,
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(selectedRequest.end_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Days:</span>{" "}
                      {selectedRequest.days}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {selectedRequest.status}
                    </div>
                    <div>
                      <span className="font-medium">Reason:</span>{" "}
                      {selectedRequest.reason}
                    </div>
                    {selectedRequest.manager_notes && (
                      <div>
                        <span className="font-medium">Manager Notes:</span>{" "}
                        {selectedRequest.manager_notes}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
