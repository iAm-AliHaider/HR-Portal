import Link from "next/link";
import { useState } from "react";

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("overview");

  const navigation = [
    { name: "Dashboard", href: "/dashboard-modern" },
    { name: "People", href: "/people-modern" },
    { name: "Jobs", href: "/jobs-modern" },
    { name: "Leave", href: "/leave-modern" },
    { name: "Assets", href: "/assets-modern" },
    { name: "Reports", href: "/reports-modern", current: true },
  ];

  const reports = {
    overview: {
      title: "Overview Analytics",
      metrics: [
        { label: "Total Employees", value: 125, change: "+5.2%", trend: "up" },
        { label: "Active Jobs", value: 8, change: "-12.5%", trend: "down" },
        { label: "Applications", value: 234, change: "+18.3%", trend: "up" },
        { label: "Hired This Month", value: 12, change: "+33.3%", trend: "up" },
      ],
    },
    people: {
      title: "People Analytics",
      metrics: [
        {
          label: "Employee Retention",
          value: "94.2%",
          change: "+2.1%",
          trend: "up",
        },
        {
          label: "Avg. Tenure",
          value: "3.2 years",
          change: "+0.3y",
          trend: "up",
        },
        {
          label: "Turnover Rate",
          value: "5.8%",
          change: "-1.2%",
          trend: "down",
        },
        {
          label: "Satisfaction Score",
          value: "4.6/5",
          change: "+0.2",
          trend: "up",
        },
      ],
    },
    recruitment: {
      title: "Recruitment Analytics",
      metrics: [
        {
          label: "Time to Hire",
          value: "21 days",
          change: "-3 days",
          trend: "down",
        },
        {
          label: "Cost per Hire",
          value: "$3,200",
          change: "-$400",
          trend: "down",
        },
        {
          label: "Application Rate",
          value: "29.1/job",
          change: "+5.3",
          trend: "up",
        },
        {
          label: "Interview Success",
          value: "68%",
          change: "+8%",
          trend: "up",
        },
      ],
    },
  };

  const currentReport = reports[selectedReport as keyof typeof reports];

  const departmentData = [
    { name: "Engineering", employees: 45, budget: 850000, utilization: 92 },
    { name: "Sales", employees: 28, budget: 420000, utilization: 88 },
    { name: "Marketing", employees: 18, budget: 320000, utilization: 76 },
    { name: "HR", employees: 12, budget: 180000, utilization: 85 },
    { name: "Finance", employees: 15, budget: 225000, utilization: 94 },
  ];

  const leaveStats = [
    { type: "Annual Leave", requests: 45, approved: 42, pending: 3 },
    { type: "Sick Leave", requests: 23, approved: 23, pending: 0 },
    { type: "Personal Leave", requests: 12, approved: 10, pending: 2 },
    { type: "Maternity/Paternity", requests: 6, approved: 6, pending: 0 },
  ];

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
              Reports & Analytics
            </h2>
            <div className="flex space-x-4">
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overview">Overview</option>
                <option value="people">People</option>
                <option value="recruitment">Recruitment</option>
              </select>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentReport.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentReport.metrics.map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </p>
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : metric.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Department Analysis
              </h3>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {dept.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {dept.employees} employees
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${dept.utilization}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Utilization: {dept.utilization}%</span>
                        <span>Budget: ${dept.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Leave Analysis
              </h3>
              <div className="space-y-4">
                {leaveStats.map((leave, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {leave.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {leave.requests} total
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-800">
                          {leave.approved}
                        </div>
                        <div className="text-green-600">Approved</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-semibold text-yellow-800">
                          {leave.pending}
                        </div>
                        <div className="text-yellow-600">Pending</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-800">
                          {Math.round((leave.approved / leave.requests) * 100)}%
                        </div>
                        <div className="text-blue-600">Approval Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Export Reports
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export as PDF
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export as Excel
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsAnalytics;
