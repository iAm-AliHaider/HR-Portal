import React, { useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";

import {
  useLeaveRequests,
  useToast,
  useForm,
  useModal,
} from "../../hooks/useApi";

// Calendar Component
const Calendar = ({
  currentDate,
  onDateChange,
  leaveRequests,
  onDateClick,
}: any) => {
  const [viewDate, setViewDate] = useState(currentDate);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getLeaveForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return leaveRequests.filter((request: any) => {
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const leaves = getLeaveForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          onClick={() => onDateClick(date)}
          className={`p-2 min-h-[80px] border border-gray-200 cursor-pointer hover:bg-gray-50 ${
            isToday ? "bg-blue-50 border-blue-300" : ""
          }`}
        >
          <div className="font-medium text-sm mb-1">{day}</div>
          <div className="space-y-1">
            {leaves.slice(0, 2).map((leave: any, index: number) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  leave.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : leave.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {leave.employee_name?.split(" ")[0] || "Employee"} -{" "}
                {leave.type}
              </div>
            ))}
            {leaves.length > 2 && (
              <div className="text-xs text-gray-500">
                +{leaves.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ← Previous
        </button>
        <h2 className="text-xl font-semibold">{getMonthName(viewDate)}</h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          Next →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium text-gray-600 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

// Leave Request Form Interface
interface LeaveRequestForm {
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  manager_email: string;
  employee_name: string;
  employee_email: string;
}

const LeaveCalendarPage = () => {
  const router = useRouter();
  const toast = useToast();

  // API hooks
  const {
    requests,
    loading,
    error,
    submitRequest,
    approveRequest,
    rejectRequest,
  } = useLeaveRequests();

  // UI state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Modals
  const requestModal = useModal();
  const detailsModal = useModal();
  const approvalModal = useModal();

  // Form management
  const form = useForm<LeaveRequestForm>({
    type: "",
    start_date: "",
    end_date: "",
    reason: "",
    manager_email: "",
    employee_name: "",
    employee_email: "",
  });

  // Handle form submission
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let hasErrors = false;

    if (!form.values.type) {
      form.setError("type", "Leave type is required");
      hasErrors = true;
    }

    if (!form.values.start_date) {
      form.setError("start_date", "Start date is required");
      hasErrors = true;
    }

    if (!form.values.end_date) {
      form.setError("end_date", "End date is required");
      hasErrors = true;
    }

    if (!form.values.reason) {
      form.setError("reason", "Reason is required");
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);

    try {
      await submitRequest(form.values);
      toast.success("Leave request submitted successfully!");
      form.reset();
      requestModal.closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit request",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const leavesForDate = requests.filter((request: any) => {
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      return date >= startDate && date <= endDate;
    });

    if (leavesForDate.length > 0) {
      setSelectedRequest(leavesForDate[0]);
      detailsModal.openModal();
    } else {
      // Pre-fill form with selected date
      form.setValue("start_date", date.toISOString().split("T")[0]);
      form.setValue("end_date", date.toISOString().split("T")[0]);
      requestModal.openModal();
    }
  };

  // Handle approve/reject
  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest(requestId);
      toast.success("Leave request approved!");
      approvalModal.closeModal();
      detailsModal.closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve request",
      );
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      await rejectRequest(requestId, reason);
      toast.success("Leave request rejected");
      approvalModal.closeModal();
      detailsModal.closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject request",
      );
    }
  };

  // Calculate statistics
  const stats = {
    totalRequests: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    thisMonth: requests.filter((r) => {
      const requestDate = new Date(r.start_date);
      const now = new Date();
      return (
        requestDate.getMonth() === now.getMonth() &&
        requestDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Personal Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Emergency Leave",
    "Unpaid Leave",
  ];

  if (loading) {
    return (
      <ModernDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      <Head>
        <title>Leave Calendar | HR System</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Leave Calendar
              </h1>
              <p className="text-gray-600 mt-2">
                Visual calendar view of leave requests
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() =>
                  setViewMode(viewMode === "calendar" ? "list" : "calendar")
                }
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
              >
                {viewMode === "calendar" ? "List View" : "Calendar View"}
              </button>
              <button
                onClick={() => {
                  form.reset();
                  requestModal.openModal();
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Request Leave
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRequests}
                  </p>
                </div>
                <div className="text-3xl">📋</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.approved}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
                <div className="text-3xl">❌</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.thisMonth}
                  </p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Calendar/List View */}
        {viewMode === "calendar" ? (
          <Calendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            leaveRequests={requests}
            onDateClick={handleDateClick}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Leave Requests</h3>
            <div className="space-y-4">
              {requests.map((request: any) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {request.employee_name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.type}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                        {new Date(request.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        {request.reason}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          detailsModal.openModal();
                        }}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leave Request Modal */}
        {requestModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Request Leave
              </h3>

              <form onSubmit={handleSubmitRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Type *
                    </label>
                    <select
                      value={form.values.type}
                      onChange={(e) => form.setValue("type", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {form.errors.type && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.errors.type}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={form.values.start_date}
                      onChange={(e) =>
                        form.setValue("start_date", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {form.errors.start_date && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.errors.start_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={form.values.end_date}
                      onChange={(e) =>
                        form.setValue("end_date", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {form.errors.end_date && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.errors.end_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason *
                    </label>
                    <textarea
                      value={form.values.reason}
                      onChange={(e) => form.setValue("reason", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      required
                      placeholder="Please provide a reason for your leave request..."
                    />
                    {form.errors.reason && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.errors.reason}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager Email
                    </label>
                    <input
                      type="email"
                      value={form.values.manager_email}
                      onChange={(e) =>
                        form.setValue("manager_email", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="manager@company.com"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      requestModal.closeModal();
                      form.reset();
                    }}
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
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailsModal.isOpen && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Leave Request Details
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="font-medium">Employee:</span>{" "}
                  {selectedRequest.employee_name}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {selectedRequest.type}
                </div>
                <div>
                  <span className="font-medium">Dates:</span>{" "}
                  {new Date(selectedRequest.start_date).toLocaleDateString()} -{" "}
                  {new Date(selectedRequest.end_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      selectedRequest.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : selectedRequest.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Reason:</span>
                  <p className="mt-1 text-gray-700">{selectedRequest.reason}</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    detailsModal.closeModal();
                    setSelectedRequest(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        approvalModal.openModal();
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toast.toasts.map((t) => (
            <div
              key={t.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white ${
                t.type === "success"
                  ? "bg-green-500"
                  : t.type === "error"
                    ? "bg-red-500"
                    : t.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
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
    </ModernDashboardLayout>
  );
};

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default LeaveCalendarPage;
