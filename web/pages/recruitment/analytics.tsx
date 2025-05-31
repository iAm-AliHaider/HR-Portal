import { useState, useEffect } from "react";

import Head from "next/head";

import { format, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useJobs,
  useApplications,
  useInterviews,
  useOffers,
} from "@/hooks/useApi";

interface MetricsData {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  interviewsScheduled: number;
  interviewsCompleted: number;
  offersExtended: number;
  offersAccepted: number;
  hires: number;
}

interface ConversionRate {
  stage: string;
  rate: number;
  previous: number;
  change: number;
}

interface SourceEffectiveness {
  source: string;
  applications: number;
  interviews: number;
  offers: number;
  hires: number;
  conversionRate: number;
}

interface TimeToHire {
  department: string;
  daysToHire: number;
  previousDaysToHire: number;
  change: number;
}

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function RecruitmentAnalytics() {
  const [timeframe, setTimeframe] = useState("30days");
  const [department, setDepartment] = useState("all");

  const { jobs, loading: jobsLoading } = useJobs();
  const { applications, loading: applicationsLoading } = useApplications();
  const { interviews, loading: interviewsLoading } = useInterviews();
  const { offers, loading: offersLoading } = useOffers();

  const [metrics, setMetrics] = useState<MetricsData>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    interviewsScheduled: 0,
    interviewsCompleted: 0,
    offersExtended: 0,
    offersAccepted: 0,
    hires: 0,
  });

  const [conversionRates, setConversionRates] = useState<ConversionRate[]>([]);
  const [sourceEffectiveness, setSourceEffectiveness] = useState<
    SourceEffectiveness[]
  >([]);
  const [timeToHire, setTimeToHire] = useState<TimeToHire[]>([]);
  const [topDepartments, setTopDepartments] = useState<
    { department: string; count: number }[]
  >([]);

  // Helper function to filter data by timeframe
  const filterByTimeframe = (data: any[], dateField: string) => {
    const cutoffDate = getCutoffDate(timeframe);
    return data.filter((item) => new Date(item[dateField]) >= cutoffDate);
  };

  // Get cutoff date based on timeframe
  const getCutoffDate = (tf: string) => {
    const now = new Date();
    switch (tf) {
      case "7days":
        return subDays(now, 7);
      case "30days":
        return subDays(now, 30);
      case "90days":
        return subDays(now, 90);
      case "6months":
        return subMonths(now, 6);
      case "1year":
        return subYears(now, 1);
      default:
        return subDays(now, 30);
    }
  };

  // Calculate previous period cutoff date
  const getPreviousPeriodCutoff = (tf: string) => {
    const cutoffDate = getCutoffDate(tf);
    const now = new Date();
    const periodLength = now.getTime() - cutoffDate.getTime();
    return new Date(cutoffDate.getTime() - periodLength);
  };

  // Filter data by department
  const filterByDepartment = (data: any[]) => {
    if (department === "all") return data;
    return data.filter((item) => item.department === department);
  };

  // Calculate metrics
  useEffect(() => {
    if (
      jobsLoading ||
      applicationsLoading ||
      interviewsLoading ||
      offersLoading
    )
      return;

    const cutoffDate = getCutoffDate(timeframe);
    const previousCutoff = getPreviousPeriodCutoff(timeframe);

    // Filter data based on timeframe and department
    const filteredJobs = filterByDepartment(jobs).filter(
      (job) => new Date(job.created_at) >= cutoffDate,
    );
    const filteredApplications = filterByDepartment(applications).filter(
      (app) => new Date(app.applied_at) >= cutoffDate,
    );
    const filteredInterviews = filterByDepartment(interviews).filter(
      (interview) => new Date(interview.scheduled_at) >= cutoffDate,
    );
    const filteredOffers = filterByDepartment(offers).filter(
      (offer) => new Date(offer.created_at) >= cutoffDate,
    );

    // Calculate metrics
    const activeJobs = filteredJobs.filter(
      (job) => job.status === "open",
    ).length;
    const newApplications = filteredApplications.filter(
      (app) => app.status === "Applied",
    ).length;
    const interviewsScheduled = filteredInterviews.length;
    const interviewsCompleted = filteredInterviews.filter(
      (interview) => interview.status === "completed",
    ).length;
    const offersExtended = filteredOffers.length;
    const offersAccepted = filteredOffers.filter(
      (offer) => offer.status === "accepted",
    ).length;
    const hires = offersAccepted;

    setMetrics({
      totalJobs: filteredJobs.length,
      activeJobs,
      totalApplications: filteredApplications.length,
      newApplications,
      interviewsScheduled,
      interviewsCompleted,
      offersExtended,
      offersAccepted,
      hires,
    });

    // Calculate conversion rates
    const totalApps = filteredApplications.length;
    const screeningToInterview =
      totalApps > 0 ? (interviewsScheduled / totalApps) * 100 : 0;
    const interviewToOffer =
      interviewsCompleted > 0
        ? (offersExtended / interviewsCompleted) * 100
        : 0;
    const offerToHire =
      offersExtended > 0 ? (offersAccepted / offersExtended) * 100 : 0;
    const overallConversion = totalApps > 0 ? (hires / totalApps) * 100 : 0;

    // Calculate previous period rates for comparison
    const prevApplications = filterByDepartment(applications).filter(
      (app) =>
        new Date(app.applied_at) >= previousCutoff &&
        new Date(app.applied_at) < cutoffDate,
    );
    const prevInterviews = filterByDepartment(interviews).filter(
      (interview) =>
        new Date(interview.scheduled_at) >= previousCutoff &&
        new Date(interview.scheduled_at) < cutoffDate,
    );
    const prevOffers = filterByDepartment(offers).filter(
      (offer) =>
        new Date(offer.created_at) >= previousCutoff &&
        new Date(offer.created_at) < cutoffDate,
    );

    const prevScreeningToInterview =
      prevApplications.length > 0
        ? (prevInterviews.length / prevApplications.length) * 100
        : 0;
    const prevInterviewToOffer =
      prevInterviews.filter((i) => i.status === "completed").length > 0
        ? (prevOffers.length /
            prevInterviews.filter((i) => i.status === "completed").length) *
          100
        : 0;
    const prevOfferToHire =
      prevOffers.length > 0
        ? (prevOffers.filter((o) => o.status === "accepted").length /
            prevOffers.length) *
          100
        : 0;
    const prevOverallConversion =
      prevApplications.length > 0
        ? (prevOffers.filter((o) => o.status === "accepted").length /
            prevApplications.length) *
          100
        : 0;

    setConversionRates([
      {
        stage: "Application to Interview",
        rate: screeningToInterview,
        previous: prevScreeningToInterview,
        change: screeningToInterview - prevScreeningToInterview,
      },
      {
        stage: "Interview to Offer",
        rate: interviewToOffer,
        previous: prevInterviewToOffer,
        change: interviewToOffer - prevInterviewToOffer,
      },
      {
        stage: "Offer to Hire",
        rate: offerToHire,
        previous: prevOfferToHire,
        change: offerToHire - prevOfferToHire,
      },
      {
        stage: "Overall (Application to Hire)",
        rate: overallConversion,
        previous: prevOverallConversion,
        change: overallConversion - prevOverallConversion,
      },
    ]);

    // Calculate source effectiveness
    const sources = Array.from(
      new Set(filteredApplications.map((app) => app.source || "Direct")),
    );
    const sourceData = sources
      .map((source) => {
        const sourceApps = filteredApplications.filter(
          (app) => (app.source || "Direct") === source,
        );
        const sourceAppIds = sourceApps.map((app) => app.id);
        const sourceInterviews = filteredInterviews.filter((i) =>
          sourceAppIds.includes(i.application_id),
        );
        const sourceOffers = filteredOffers.filter((o) =>
          sourceAppIds.includes(o.application_id),
        );
        const sourceHires = sourceOffers.filter((o) => o.status === "accepted");

        return {
          source,
          applications: sourceApps.length,
          interviews: sourceInterviews.length,
          offers: sourceOffers.length,
          hires: sourceHires.length,
          conversionRate:
            sourceApps.length > 0
              ? (sourceHires.length / sourceApps.length) * 100
              : 0,
        };
      })
      .sort((a, b) => b.applications - a.applications);

    setSourceEffectiveness(sourceData);

    // Calculate time to hire by department
    const departments = Array.from(
      new Set(applications.map((app) => app.department || "General")),
    );
    const timeToHireData = departments
      .map((dept) => {
        const deptApps = applications.filter(
          (app) =>
            (app.department || "General") === dept && app.status === "Hired",
        );

        // Calculate average days to hire for this department
        const daysToHire =
          deptApps.length > 0
            ? deptApps.reduce((sum, app) => {
                const appliedDate = new Date(app.applied_at);
                const hiredDate = new Date(app.hired_at || app.updated_at);
                return (
                  sum +
                  Math.round(
                    (hiredDate.getTime() - appliedDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )
                );
              }, 0) / deptApps.length
            : 0;

        // Calculate previous period
        const prevDeptApps = applications.filter(
          (app) =>
            (app.department || "General") === dept &&
            app.status === "Hired" &&
            new Date(app.applied_at) >= previousCutoff &&
            new Date(app.applied_at) < cutoffDate,
        );

        const prevDaysToHire =
          prevDeptApps.length > 0
            ? prevDeptApps.reduce((sum, app) => {
                const appliedDate = new Date(app.applied_at);
                const hiredDate = new Date(app.hired_at || app.updated_at);
                return (
                  sum +
                  Math.round(
                    (hiredDate.getTime() - appliedDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )
                );
              }, 0) / prevDeptApps.length
            : 0;

        return {
          department: dept,
          daysToHire,
          previousDaysToHire: prevDaysToHire,
          change: prevDaysToHire > 0 ? daysToHire - prevDaysToHire : 0,
        };
      })
      .filter((d) => d.daysToHire > 0)
      .sort((a, b) => a.daysToHire - b.daysToHire);

    setTimeToHire(timeToHireData);

    // Calculate top departments by hiring
    const deptHires = departments
      .map((dept) => {
        const hires = applications.filter(
          (app) =>
            (app.department || "General") === dept &&
            app.status === "Hired" &&
            new Date(app.applied_at) >= cutoffDate,
        ).length;

        return { department: dept, count: hires };
      })
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);

    setTopDepartments(deptHires);
  }, [
    jobs,
    applications,
    interviews,
    offers,
    timeframe,
    department,
    jobsLoading,
    applicationsLoading,
    interviewsLoading,
    offersLoading,
  ]);

  // Get timeframe display text
  const getTimeframeText = () => {
    switch (timeframe) {
      case "7days":
        return "Last 7 days";
      case "30days":
        return "Last 30 days";
      case "90days":
        return "Last 90 days";
      case "6months":
        return "Last 6 months";
      case "1year":
        return "Last year";
      default:
        return "Last 30 days";
    }
  };

  return (
    <>
      <Head>
        <title>Recruitment Analytics | HR Portal</title>
        <meta name="description" content="Recruitment analytics and insights" />
      </Head>

      <ModernDashboardLayout
        title="Recruitment Analytics"
        subtitle="Insights and metrics for your hiring process"
      >
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeframe
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md border border-blue-200 flex items-center">
            <span className="text-sm font-medium">
              Showing data for: {getTimeframeText()}{" "}
              {department !== "all" ? ` • ${department}` : ""}
            </span>
          </div>
        </div>

        {jobsLoading ||
        applicationsLoading ||
        interviewsLoading ||
        offersLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-medium text-gray-500">
                      Open Positions
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {metrics.activeJobs}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      of {metrics.totalJobs} total
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-medium text-gray-500">
                      Applications
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {metrics.totalApplications}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {metrics.newApplications} new
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-medium text-gray-500">
                      Interviews
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {metrics.interviewsScheduled}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {metrics.interviewsCompleted} completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-medium text-gray-500">Hires</h3>
                    <p className="text-3xl font-bold mt-2">{metrics.hires}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      of {metrics.offersExtended} offers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {conversionRates.map((rate, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {rate.stage}
                        </span>
                        <div className="flex items-center">
                          <span className="text-xl font-bold">
                            {rate.rate.toFixed(1)}%
                          </span>
                          {rate.change !== 0 && (
                            <span
                              className={`ml-2 text-xs ${rate.change > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {rate.change > 0 ? "↑" : "↓"}{" "}
                              {Math.abs(rate.change).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, rate.rate)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3">Source</th>
                        <th className="text-right pb-3">Applications</th>
                        <th className="text-right pb-3">Interviews</th>
                        <th className="text-right pb-3">Offers</th>
                        <th className="text-right pb-3">Hires</th>
                        <th className="text-right pb-3">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourceEffectiveness.map((source, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3">{source.source}</td>
                          <td className="py-3 text-right">
                            {source.applications}
                          </td>
                          <td className="py-3 text-right">
                            {source.interviews}
                          </td>
                          <td className="py-3 text-right">{source.offers}</td>
                          <td className="py-3 text-right">{source.hires}</td>
                          <td className="py-3 text-right">
                            <span
                              className={`font-medium ${
                                source.conversionRate > 5
                                  ? "text-green-600"
                                  : source.conversionRate > 2
                                    ? "text-blue-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {source.conversionRate.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}

                      {sourceEffectiveness.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-4 text-center text-gray-500"
                          >
                            No source data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time to Hire */}
              <Card>
                <CardHeader>
                  <CardTitle>Time to Hire by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  {timeToHire.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hire time data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {timeToHire.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {item.department}
                            </span>
                            <div className="flex items-center">
                              <span>{Math.round(item.daysToHire)} days</span>
                              {item.change !== 0 && (
                                <span
                                  className={`ml-2 text-xs ${item.change < 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {item.change < 0 ? "↓" : "↑"}{" "}
                                  {Math.abs(Math.round(item.change))} days
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                item.daysToHire < 30
                                  ? "bg-green-500"
                                  : item.daysToHire < 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(100, (item.daysToHire / 90) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Hiring Departments */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Hiring Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  {topDepartments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hiring data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topDepartments.map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {dept.department}
                            </span>
                            <span>
                              {dept.count} {dept.count === 1 ? "hire" : "hires"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(100, (dept.count / Math.max(...topDepartments.map((d) => d.count))) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </ModernDashboardLayout>
    </>
  );
}
