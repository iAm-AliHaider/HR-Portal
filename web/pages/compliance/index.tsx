import React, { useState } from "react";

import Link from "next/link";

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

export default function ComplianceTrainingPage() {
  const { trainings, loading, error } = useComplianceTraining();
  const [activeTab, setActiveTab] = useState("all");
  const { user, role } = useAuth();
  const isAdmin = role === "admin" || role === "hr";

  // Calculate statistics
  const totalTrainings = trainings.length;
  const activeTrainings = trainings.filter((t) => t.status === "Active").length;
  const completionRate =
    trainings.reduce((sum, t) => sum + t.completionRate, 0) / totalTrainings ||
    0;
  const overdueTrainings = trainings.filter((t) => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.completionRate < 100;
  }).length;

  // Filter trainings based on active tab
  const filteredTrainings = trainings.filter((training) => {
    if (activeTab === "all") return true;
    if (activeTab === "required")
      return training.requiredFor.includes("All Employees");
    if (activeTab === "overdue") {
      const dueDate = new Date(training.dueDate);
      return dueDate < new Date() && training.completionRate < 100;
    }
    if (activeTab === "completed") return training.completionRate === 100;
    return true;
  });

  if (loading) {
    return (
      <ModernDashboardLayout title="Compliance Training">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  if (error) {
    return (
      <ModernDashboardLayout title="Compliance Training">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout
      title="Compliance Training"
      subtitle="Manage and track mandatory compliance training modules"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">
                Total Trainings
              </h2>
              <p className="text-2xl font-semibold text-gray-800">
                {totalTrainings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">
                Active Trainings
              </h2>
              <p className="text-2xl font-semibold text-gray-800">
                {activeTrainings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">
                Overdue Trainings
              </h2>
              <p className="text-2xl font-semibold text-gray-800">
                {overdueTrainings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">
                Avg. Completion Rate
              </h2>
              <p className="text-2xl font-semibold text-gray-800">
                {Math.round(completionRate)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4 md:mb-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === "all"
                ? "bg-white shadow text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("required")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === "required"
                ? "bg-white shadow text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Required
          </button>
          <button
            onClick={() => setActiveTab("overdue")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === "overdue"
                ? "bg-white shadow text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Overdue
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === "completed"
                ? "bg-white shadow text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Completed
          </button>
        </div>

        {isAdmin && (
          <div className="flex space-x-2">
            <Link href="/compliance/new">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Training
              </Button>
            </Link>
            <Link href="/compliance/reports">
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Reports
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Training List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTrainings.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              No trainings found in this category.
            </li>
          ) : (
            filteredTrainings.map((training) => {
              // Calculate if the training is overdue
              const dueDate = new Date(training.dueDate);
              const isOverdue =
                dueDate < new Date() && training.completionRate < 100;

              return (
                <li key={training.id}>
                  <Link
                    href={`/compliance/${training.id}`}
                    className="block hover:bg-gray-50 transition duration-150"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {training.category === "Legal" && (
                              <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
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
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                  />
                                </svg>
                              </span>
                            )}
                            {training.category === "HR" && (
                              <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                              </span>
                            )}
                            {training.category === "IT Security" && (
                              <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-600">
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
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                              </span>
                            )}
                            {training.category === "Health & Safety" && (
                              <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
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
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900">
                                {training.title}
                              </h3>
                              {isOverdue && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Overdue
                                </span>
                              )}
                              {training.requiredFor.includes(
                                "All Employees",
                              ) && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Required
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              <p>{training.description}</p>
                              <p className="mt-1">
                                <span className="font-medium">Format:</span>{" "}
                                {training.format} |
                                <span className="font-medium ml-2">
                                  Duration:
                                </span>{" "}
                                {training.duration} |
                                <span className="font-medium ml-2">Due:</span>{" "}
                                {new Date(
                                  training.dueDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6 flex-shrink-0 flex flex-col items-end">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 mr-2">
                              {training.completionRate}% Complete
                            </div>
                          </div>
                          <div className="w-32 mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                          <span className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-900">
                            View Details
                            <svg
                              className="ml-1 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </ModernDashboardLayout>
  );
}
