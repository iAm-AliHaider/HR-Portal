import React, { useState } from "react";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import TabGroup, { Tab } from "@/components/ui/TabGroup";
import { useDashboardAnalytics } from "@/hooks/useApi";

export default function HRAnalyticsPage() {
  const { analytics, loading, error } = useDashboardAnalytics();
  const [activeTab, setActiveTab] = useState("hr-overview");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <ModernDashboardLayout title="HR Analytics" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  if (error) {
    return (
      <ModernDashboardLayout title="HR Analytics">
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

  // Define tabs for the HR Analytics TabGroup
  const tabs: Tab[] = [
    {
      id: "hr-overview",
      label: "HR Overview",
      content: (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">HR Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-600 text-sm font-medium">
                      Total Employees
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800">
                      {analytics?.totalEmployees || 0}
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
                      Training Completion
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800">
                      {analytics?.trainingCompletion || 0}%
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
                      Open Positions
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800">
                      {analytics?.openPositions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HR Department Distribution */}
            <div className="bg-white rounded-lg shadow p-6 mt-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Department Distribution
              </h3>
              <div className="space-y-4">
                {analytics?.departmentDistribution?.map((dept) => (
                  <div key={dept.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {dept.label}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {dept.value} (
                        {Math.round(
                          (dept.value / analytics.totalEmployees) * 100,
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${(dept.value / analytics.totalEmployees) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "headcount",
      label: "Headcount Analysis",
      content: (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Headcount Analysis</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Headcount Trends
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
                    Headcount trend chart will be displayed here
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Headcount by Location
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
                    Headcount by location chart will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "turnover",
      label: "Turnover & Retention",
      content: (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">
              Turnover & Retention Analytics
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Turnover Rate
                  </h3>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      4.2%
                    </div>
                    <p className="text-sm text-gray-500">
                      Annual turnover rate
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Average Tenure
                  </h3>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      3.7
                    </div>
                    <p className="text-sm text-gray-500">
                      Years of service (average)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Exit Reasons Analysis
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
                    Exit reasons chart will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <ModernDashboardLayout
      title="HR Analytics"
      subtitle="Comprehensive HR analytics and insights"
    >
      <TabGroup tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
    </ModernDashboardLayout>
  );
}

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
};
