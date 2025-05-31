import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Button } from "@/components/ui/button";
import { useComplianceTraining } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function ComplianceTrainingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { trainings, loading, error, assignTraining } = useComplianceTraining();
  const { user, role } = useAuth();
  const isAdmin = role === "admin" || role === "hr";

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Mock employees for assignment
  const mockEmployees = [
    {
      id: "emp-001",
      name: "John Doe",
      department: "Engineering",
      position: "Senior Developer",
    },
    {
      id: "emp-002",
      name: "Jane Smith",
      department: "Marketing",
      position: "Marketing Manager",
    },
    {
      id: "emp-003",
      name: "Robert Johnson",
      department: "HR",
      position: "HR Specialist",
    },
    {
      id: "emp-004",
      name: "Emily Davis",
      department: "Finance",
      position: "Financial Analyst",
    },
    {
      id: "emp-005",
      name: "Michael Wilson",
      department: "Engineering",
      position: "QA Engineer",
    },
  ];

  // Find the current training
  const training = trainings.find((t) => t.id === id);

  // Mock employee progress data
  const employeeProgress = [
    {
      id: "emp-001",
      name: "John Doe",
      department: "Engineering",
      status: "Completed",
      progress: 100,
      completedDate: "2023-08-15",
    },
    {
      id: "emp-002",
      name: "Jane Smith",
      department: "Marketing",
      status: "In Progress",
      progress: 60,
      lastActivity: "2023-09-10",
    },
    {
      id: "emp-003",
      name: "Robert Johnson",
      department: "HR",
      status: "Not Started",
      progress: 0,
      assignedDate: "2023-09-01",
    },
    {
      id: "emp-004",
      name: "Emily Davis",
      department: "Finance",
      status: "Completed",
      progress: 100,
      completedDate: "2023-08-20",
    },
    {
      id: "emp-005",
      name: "Michael Wilson",
      department: "Engineering",
      status: "Overdue",
      progress: 25,
      lastActivity: "2023-08-05",
    },
  ];

  // Handle assigning training to employees
  const handleAssign = async () => {
    if (selectedEmployees.length === 0) return;

    try {
      await assignTraining(id, selectedEmployees);
      setShowAssignModal(false);
      setSelectedEmployees([]);
      // Show success notification
      alert("Training assigned successfully");
    } catch (error) {
      console.error("Error assigning training:", error);
      // Show error notification
      alert("Error assigning training");
    }
  };

  // Toggle employee selection
  const toggleEmployeeSelection = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  if (loading) {
    return (
      <ModernDashboardLayout title="Compliance Training">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  if (error || !training) {
    return (
      <ModernDashboardLayout title="Compliance Training">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            {error || "Training not found"}
          </span>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout
      title={training.title}
      subtitle={`${training.category} • ${training.duration} • Due: ${new Date(training.dueDate).toLocaleDateString()}`}
    >
      {/* Action Buttons */}
      <div className="flex justify-between mb-6">
        <Link href="/compliance">
          <Button variant="outline" className="border-gray-300">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Trainings
          </Button>
        </Link>

        <div className="flex space-x-2">
          {!isAdmin ? (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Training
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => router.push(`/compliance/${id}/edit`)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAssignModal(true)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Assign to Employees
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "modules"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Modules
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "progress"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Employee Progress
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700">{training.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Training Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">
                        Format
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {training.format}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">
                        Duration
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {training.duration}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">
                        Certification
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {training.certificationType}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">
                        Validity Period
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {training.validityPeriod}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="text-sm text-gray-900">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {training.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Audience & Completion
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Required For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {training.requiredFor.map((group, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Completion Rate
                    </h4>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          training.completionRate >= 90
                            ? "bg-green-500"
                            : training.completionRate >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${training.completionRate}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {training.completionRate}% of assigned employees have
                      completed this training
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Due Date
                    </h4>
                    <p className="text-sm text-gray-900">
                      {new Date(training.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {new Date(training.dueDate) < new Date() && (
                      <p className="text-xs text-red-600 mt-1">
                        This training is overdue
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === "modules" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Training Modules
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                This training consists of {training.modules.length} modules.
                Complete all modules to receive your certification.
              </p>
            </div>

            <div className="space-y-4">
              {training.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">
                          {module.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Duration: {module.duration}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" className="border-gray-300">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Employee Progress
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-700">
                    Completed:{" "}
                    {
                      employeeProgress.filter((e) => e.status === "Completed")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-700">
                    In Progress:{" "}
                    {
                      employeeProgress.filter((e) => e.status === "In Progress")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-700">
                    Overdue:{" "}
                    {
                      employeeProgress.filter((e) => e.status === "Overdue")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-sm text-gray-700">
                    Not Started:{" "}
                    {
                      employeeProgress.filter((e) => e.status === "Not Started")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Employee
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Progress
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Activity
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeProgress.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {employee.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            employee.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : employee.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : employee.status === "Overdue"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              employee.progress >= 90
                                ? "bg-green-500"
                                : employee.progress >= 60
                                  ? "bg-yellow-500"
                                  : employee.progress > 0
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                            }`}
                            style={{ width: `${employee.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {employee.progress}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.completedDate
                          ? `Completed on ${employee.completedDate}`
                          : employee.lastActivity
                            ? `Last active on ${employee.lastActivity}`
                            : employee.assignedDate
                              ? `Assigned on ${employee.assignedDate}`
                              : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {isAdmin && (
                          <button className="text-blue-600 hover:text-blue-900">
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab (Admin Only) */}
        {activeTab === "settings" && isAdmin && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Training Settings
            </h3>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-base font-medium text-gray-900 mb-3">
                  Training Status
                </h4>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="status"
                      value="Active"
                      checked={training.status === "Active"}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="status"
                      value="Inactive"
                      checked={training.status === "Inactive"}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">Inactive</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="status"
                      value="Draft"
                      checked={training.status === "Draft"}
                      readOnly
                    />
                    <span className="ml-2 text-sm text-gray-700">Draft</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-base font-medium text-gray-900 mb-3">
                  Delete Training
                </h4>
                <p className="text-sm text-gray-700 mb-4">
                  Permanently delete this training and all associated data. This
                  action cannot be undone.
                </p>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Training
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assign Training Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Assign Training to Employees
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-gray-700 mb-4">
                Select employees to assign to the training{" "}
                <strong>{training.title}</strong>
              </p>

              <div className="space-y-2">
                {mockEmployees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {employee.department} • {employee.position}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAssign}
                disabled={selectedEmployees.length === 0}
              >
                Assign to {selectedEmployees.length}{" "}
                {selectedEmployees.length === 1 ? "Employee" : "Employees"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ModernDashboardLayout>
  );
}
