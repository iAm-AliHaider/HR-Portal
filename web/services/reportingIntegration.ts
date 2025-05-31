import { supabase } from "@/lib/supabase/client";

// Cross-module reporting interfaces
export interface CrossModuleReport {
  id: string;
  name: string;
  description: string;
  type:
    | "workflow_performance"
    | "employee_activity"
    | "integration_health"
    | "compliance"
    | "custom";
  modules: ReportModule[];
  data_sources: DataSource[];
  metrics: ReportMetric[];
  filters: ReportFilter[];
  schedule?: ReportSchedule;
  recipients: string[];
  format: "pdf" | "excel" | "csv" | "json" | "dashboard";
  created_at: string;
  updated_at: string;
  last_generated?: string;
  next_generation?: string;
}

export interface ReportModule {
  name:
    | "workflows"
    | "leave"
    | "expenses"
    | "recruitment"
    | "training"
    | "compliance"
    | "calendar"
    | "notifications";
  enabled: boolean;
  weight: number; // 1-10, for importance in combined metrics
  api_endpoint: string;
  data_fields: string[];
}

export interface DataSource {
  id: string;
  name: string;
  type: "database" | "api" | "file" | "webhook";
  connection_string?: string;
  api_endpoint?: string;
  auth_config?: Record<string, any>;
  data_mapping: Record<string, string>;
  refresh_interval: number; // minutes
  last_updated?: string;
}

export interface ReportMetric {
  id: string;
  name: string;
  description: string;
  type: "count" | "sum" | "average" | "percentage" | "ratio" | "trend";
  calculation: string;
  unit?: string;
  target_value?: number;
  warning_threshold?: number;
  critical_threshold?: number;
  chart_type?: "line" | "bar" | "pie" | "gauge" | "table";
}

export interface ReportFilter {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "between"
    | "in"
    | "contains";
  value: any;
  label: string;
}

export interface ReportSchedule {
  frequency: "hourly" | "daily" | "weekly" | "monthly" | "quarterly";
  time: string; // HH:MM
  timezone: string;
  enabled: boolean;
  last_run?: string;
  next_run?: string;
}

export interface WorkflowPerformanceData {
  workflow_id: string;
  workflow_name: string;
  category: string;
  total_instances: number;
  completed_instances: number;
  pending_instances: number;
  escalated_instances: number;
  avg_completion_time: number; // hours
  success_rate: number; // percentage
  bottlenecks: WorkflowBottleneck[];
  efficiency_score: number; // 0-100
  trend: "improving" | "declining" | "stable";
}

export interface WorkflowBottleneck {
  step_id: string;
  step_name: string;
  avg_time: number;
  delay_incidents: number;
  impact_score: number; // 1-10
}

export interface IntegrationHealthData {
  integration_name: string;
  type: "email" | "calendar" | "api" | "webhook" | "database";
  status: "healthy" | "warning" | "critical" | "down";
  uptime_percentage: number;
  response_time: number; // ms
  error_rate: number; // percentage
  last_successful_call?: string;
  last_error?: string;
  health_score: number; // 0-100
}

export interface EmployeeActivityData {
  employee_id: string;
  employee_name: string;
  department: string;
  workflow_participation: {
    initiated: number;
    completed: number;
    pending: number;
    avg_response_time: number;
  };
  leave_utilization: {
    days_taken: number;
    days_remaining: number;
    requests_submitted: number;
  };
  training_progress: {
    courses_completed: number;
    hours_completed: number;
    certifications_earned: number;
  };
  productivity_score: number; // 0-100
}

export interface ComplianceData {
  policy_adherence: {
    total_policies: number;
    compliant_policies: number;
    violations: PolicyViolation[];
    compliance_score: number; // 0-100
  };
  audit_trail: {
    total_actions: number;
    audited_actions: number;
    missing_logs: number;
    audit_score: number; // 0-100
  };
  data_retention: {
    expired_records: number;
    scheduled_deletions: number;
    retention_compliance: number; // percentage
  };
}

export interface PolicyViolation {
  id: string;
  policy_id: string;
  policy_name: string;
  employee_id: string;
  violation_type: string;
  severity: "low" | "medium" | "high" | "critical";
  detected_at: string;
  resolved: boolean;
  resolution_date?: string;
}

// Mock data for development
const mockWorkflowPerformance: WorkflowPerformanceData[] = [
  {
    workflow_id: "wf_leave_approval",
    workflow_name: "Leave Request Approval",
    category: "HR",
    total_instances: 247,
    completed_instances: 228,
    pending_instances: 19,
    escalated_instances: 8,
    avg_completion_time: 18.5,
    success_rate: 94.7,
    bottlenecks: [
      {
        step_id: "step_manager_review",
        step_name: "Manager Review",
        avg_time: 42.3,
        delay_incidents: 12,
        impact_score: 7,
      },
    ],
    efficiency_score: 87,
    trend: "improving",
  },
  {
    workflow_id: "wf_expense_approval",
    workflow_name: "Expense Report Approval",
    category: "Finance",
    total_instances: 189,
    completed_instances: 165,
    pending_instances: 24,
    escalated_instances: 5,
    avg_completion_time: 32.1,
    success_rate: 91.5,
    bottlenecks: [
      {
        step_id: "step_finance_review",
        step_name: "Finance Review",
        avg_time: 56.8,
        delay_incidents: 18,
        impact_score: 8,
      },
    ],
    efficiency_score: 82,
    trend: "stable",
  },
];

const mockIntegrationHealth: IntegrationHealthData[] = [
  {
    integration_name: "Email Service",
    type: "email",
    status: "healthy",
    uptime_percentage: 99.8,
    response_time: 245,
    error_rate: 0.2,
    last_successful_call: "2024-01-20T14:30:00Z",
    health_score: 98,
  },
  {
    integration_name: "Calendar Sync",
    type: "calendar",
    status: "warning",
    uptime_percentage: 97.5,
    response_time: 1250,
    error_rate: 2.5,
    last_successful_call: "2024-01-20T14:25:00Z",
    last_error: "API rate limit exceeded",
    health_score: 85,
  },
  {
    integration_name: "Accounting System",
    type: "api",
    status: "healthy",
    uptime_percentage: 99.2,
    response_time: 890,
    error_rate: 0.8,
    last_successful_call: "2024-01-20T14:28:00Z",
    health_score: 94,
  },
];

export class ReportingIntegrationService {
  // Generate cross-module performance dashboard
  static async generatePerformanceDashboard(filters?: {
    start_date?: string;
    end_date?: string;
    modules?: string[];
    department?: string;
  }): Promise<{
    overview: {
      total_workflows: number;
      active_instances: number;
      completion_rate: number;
      avg_processing_time: number;
      integration_health: number;
    };
    workflow_performance: WorkflowPerformanceData[];
    integration_health: IntegrationHealthData[];
    employee_productivity: EmployeeActivityData[];
    compliance_status: ComplianceData;
    notifications_summary: any;
    trends: {
      workflow_volume: Array<{ date: string; count: number }>;
      completion_times: Array<{ date: string; avg_time: number }>;
      error_rates: Array<{ date: string; error_rate: number }>;
    };
  }> {
    try {
      // Fetch data from multiple sources
      const [
        workflowData,
        integrationData,
        employeeData,
        complianceData,
        notificationData,
      ] = await Promise.all([
        this.getWorkflowPerformanceData(filters),
        this.getIntegrationHealthData(),
        this.getEmployeeActivityData(filters),
        this.getComplianceData(),
        this.getMockNotificationAnalytics(filters),
      ]);

      // Calculate overview metrics
      const overview = {
        total_workflows: workflowData.reduce(
          (sum, w) => sum + w.total_instances,
          0,
        ),
        active_instances: workflowData.reduce(
          (sum, w) => sum + w.pending_instances,
          0,
        ),
        completion_rate:
          workflowData.reduce((sum, w) => sum + w.success_rate, 0) /
          workflowData.length,
        avg_processing_time:
          workflowData.reduce((sum, w) => sum + w.avg_completion_time, 0) /
          workflowData.length,
        integration_health:
          integrationData.reduce((sum, i) => sum + i.health_score, 0) /
          integrationData.length,
      };

      // Generate trend data
      const trends = {
        workflow_volume: this.generateWorkflowVolumeTrend(),
        completion_times: this.generateCompletionTimeTrend(),
        error_rates: this.generateErrorRateTrend(),
      };

      return {
        overview,
        workflow_performance: workflowData,
        integration_health: integrationData,
        employee_productivity: employeeData,
        compliance_status: complianceData,
        notifications_summary: notificationData,
        trends,
      };
    } catch (error) {
      console.error("Error generating performance dashboard:", error);
      throw error;
    }
  }

  // Generate workflow efficiency report
  static async generateWorkflowEfficiencyReport(workflowId?: string): Promise<{
    summary: {
      total_workflows: number;
      avg_efficiency: number;
      top_performers: WorkflowPerformanceData[];
      bottlenecks: WorkflowBottleneck[];
    };
    detailed_analysis: WorkflowPerformanceData[];
    recommendations: {
      optimization_opportunities: string[];
      automation_suggestions: string[];
      process_improvements: string[];
    };
  }> {
    try {
      const workflowData = await this.getWorkflowPerformanceData({
        workflow_id: workflowId,
      });

      // Sort by efficiency score
      const sortedByEfficiency = [...workflowData].sort(
        (a, b) => b.efficiency_score - a.efficiency_score,
      );

      // Collect all bottlenecks
      const allBottlenecks = workflowData.flatMap((w) => w.bottlenecks);
      const criticalBottlenecks = allBottlenecks
        .filter((b) => b.impact_score >= 7)
        .sort((a, b) => b.impact_score - a.impact_score);

      // Generate recommendations
      const recommendations =
        this.generateOptimizationRecommendations(workflowData);

      return {
        summary: {
          total_workflows: workflowData.length,
          avg_efficiency:
            workflowData.reduce((sum, w) => sum + w.efficiency_score, 0) /
            workflowData.length,
          top_performers: sortedByEfficiency.slice(0, 3),
          bottlenecks: criticalBottlenecks.slice(0, 5),
        },
        detailed_analysis: workflowData,
        recommendations,
      };
    } catch (error) {
      console.error("Error generating workflow efficiency report:", error);
      throw error;
    }
  }

  // Generate integration health report
  static async generateIntegrationHealthReport(): Promise<{
    overall_health: number;
    critical_issues: IntegrationHealthData[];
    performance_metrics: {
      avg_response_time: number;
      total_uptime: number;
      error_rate: number;
    };
    recommendations: string[];
  }> {
    try {
      const integrationData = await this.getIntegrationHealthData();

      const criticalIssues = integrationData.filter(
        (i) =>
          i.status === "critical" || i.status === "down" || i.health_score < 70,
      );

      const performanceMetrics = {
        avg_response_time:
          integrationData.reduce((sum, i) => sum + i.response_time, 0) /
          integrationData.length,
        total_uptime:
          integrationData.reduce((sum, i) => sum + i.uptime_percentage, 0) /
          integrationData.length,
        error_rate:
          integrationData.reduce((sum, i) => sum + i.error_rate, 0) /
          integrationData.length,
      };

      const overallHealth =
        integrationData.reduce((sum, i) => sum + i.health_score, 0) /
        integrationData.length;

      const recommendations =
        this.generateIntegrationRecommendations(integrationData);

      return {
        overall_health: overallHealth,
        critical_issues: criticalIssues,
        performance_metrics: performanceMetrics,
        recommendations,
      };
    } catch (error) {
      console.error("Error generating integration health report:", error);
      throw error;
    }
  }

  // Generate compliance report
  static async generateComplianceReport(): Promise<
    ComplianceData & {
      risk_assessment: {
        overall_risk: "low" | "medium" | "high" | "critical";
        risk_factors: string[];
        mitigation_actions: string[];
      };
      audit_findings: {
        total_findings: number;
        critical_findings: number;
        resolved_findings: number;
        pending_actions: number;
      };
    }
  > {
    try {
      const complianceData = await this.getComplianceData();

      // Risk assessment
      const riskAssessment = this.assessComplianceRisk(complianceData);

      // Audit findings summary
      const auditFindings = {
        total_findings: complianceData.policy_adherence.violations.length,
        critical_findings: complianceData.policy_adherence.violations.filter(
          (v) => v.severity === "critical",
        ).length,
        resolved_findings: complianceData.policy_adherence.violations.filter(
          (v) => v.resolved,
        ).length,
        pending_actions: complianceData.policy_adherence.violations.filter(
          (v) => !v.resolved,
        ).length,
      };

      return {
        ...complianceData,
        risk_assessment: riskAssessment,
        audit_findings: auditFindings,
      };
    } catch (error) {
      console.error("Error generating compliance report:", error);
      throw error;
    }
  }

  // Schedule automated report
  static async scheduleReport(
    reportConfig: Omit<CrossModuleReport, "id" | "created_at" | "updated_at">,
  ): Promise<CrossModuleReport> {
    try {
      const newReport: CrossModuleReport = {
        ...reportConfig,
        id: `report_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Calculate next generation time
      if (newReport.schedule?.enabled) {
        newReport.next_generation = this.calculateNextGenerationTime(
          newReport.schedule,
        );
      }

      const { data, error } = await supabase
        .from("scheduled_reports")
        .insert([newReport])
        .select()
        .single();

      if (error) {
        console.log("Database insert failed, using mock report");
        return newReport;
      }

      return data;
    } catch (error) {
      console.error("Error scheduling report:", error);
      throw error;
    }
  }

  // Private helper methods
  private static async getWorkflowPerformanceData(
    filters?: any,
  ): Promise<WorkflowPerformanceData[]> {
    try {
      // In real implementation, query workflow database
      let filteredData = mockWorkflowPerformance;

      if (filters?.workflow_id) {
        filteredData = filteredData.filter(
          (w) => w.workflow_id === filters.workflow_id,
        );
      }

      return filteredData;
    } catch (error) {
      console.error("Error fetching workflow performance data:", error);
      return mockWorkflowPerformance;
    }
  }

  private static async getIntegrationHealthData(): Promise<
    IntegrationHealthData[]
  > {
    try {
      // In real implementation, check integration health
      return mockIntegrationHealth;
    } catch (error) {
      console.error("Error fetching integration health data:", error);
      return mockIntegrationHealth;
    }
  }

  private static async getEmployeeActivityData(
    filters?: any,
  ): Promise<EmployeeActivityData[]> {
    try {
      // Mock employee activity data
      return [
        {
          employee_id: "EMP-001",
          employee_name: "John Doe",
          department: "Engineering",
          workflow_participation: {
            initiated: 12,
            completed: 10,
            pending: 2,
            avg_response_time: 8.5,
          },
          leave_utilization: {
            days_taken: 15,
            days_remaining: 10,
            requests_submitted: 3,
          },
          training_progress: {
            courses_completed: 8,
            hours_completed: 45,
            certifications_earned: 2,
          },
          productivity_score: 87,
        },
        {
          employee_id: "EMP-002",
          employee_name: "Jane Smith",
          department: "Marketing",
          workflow_participation: {
            initiated: 8,
            completed: 7,
            pending: 1,
            avg_response_time: 6.2,
          },
          leave_utilization: {
            days_taken: 8,
            days_remaining: 17,
            requests_submitted: 2,
          },
          training_progress: {
            courses_completed: 12,
            hours_completed: 68,
            certifications_earned: 3,
          },
          productivity_score: 92,
        },
      ];
    } catch (error) {
      console.error("Error fetching employee activity data:", error);
      return [];
    }
  }

  private static async getComplianceData(): Promise<ComplianceData> {
    try {
      // Mock compliance data
      return {
        policy_adherence: {
          total_policies: 45,
          compliant_policies: 42,
          violations: [
            {
              id: "violation_001",
              policy_id: "pol_001",
              policy_name: "Data Retention Policy",
              employee_id: "EMP-003",
              violation_type: "Exceeded retention period",
              severity: "medium",
              detected_at: "2024-01-18T10:00:00Z",
              resolved: false,
            },
            {
              id: "violation_002",
              policy_id: "pol_002",
              policy_name: "Access Control Policy",
              employee_id: "EMP-004",
              violation_type: "Unauthorized access attempt",
              severity: "high",
              detected_at: "2024-01-19T14:30:00Z",
              resolved: true,
              resolution_date: "2024-01-19T16:45:00Z",
            },
          ],
          compliance_score: 93.3,
        },
        audit_trail: {
          total_actions: 15678,
          audited_actions: 15234,
          missing_logs: 444,
          audit_score: 97.2,
        },
        data_retention: {
          expired_records: 23,
          scheduled_deletions: 156,
          retention_compliance: 98.5,
        },
      };
    } catch (error) {
      console.error("Error fetching compliance data:", error);
      throw error;
    }
  }

  private static generateOptimizationRecommendations(
    workflowData: WorkflowPerformanceData[],
  ): {
    optimization_opportunities: string[];
    automation_suggestions: string[];
    process_improvements: string[];
  } {
    const recommendations = {
      optimization_opportunities: [],
      automation_suggestions: [],
      process_improvements: [],
    };

    workflowData.forEach((workflow) => {
      if (workflow.efficiency_score < 80) {
        recommendations.optimization_opportunities.push(
          `Optimize ${workflow.workflow_name} - current efficiency: ${workflow.efficiency_score}%`,
        );
      }

      workflow.bottlenecks.forEach((bottleneck) => {
        if (bottleneck.impact_score >= 7) {
          recommendations.process_improvements.push(
            `Address bottleneck in ${workflow.workflow_name}: ${bottleneck.step_name} (${bottleneck.avg_time}h avg)`,
          );
        }

        if (
          bottleneck.step_name.toLowerCase().includes("manual") ||
          bottleneck.step_name.toLowerCase().includes("review")
        ) {
          recommendations.automation_suggestions.push(
            `Consider automating ${bottleneck.step_name} in ${workflow.workflow_name}`,
          );
        }
      });

      if (workflow.escalated_instances > workflow.total_instances * 0.1) {
        recommendations.process_improvements.push(
          `Reduce escalations in ${workflow.workflow_name} - current rate: ${((workflow.escalated_instances / workflow.total_instances) * 100).toFixed(1)}%`,
        );
      }
    });

    return recommendations;
  }

  private static generateIntegrationRecommendations(
    integrationData: IntegrationHealthData[],
  ): string[] {
    const recommendations: string[] = [];

    integrationData.forEach((integration) => {
      if (integration.health_score < 90) {
        recommendations.push(
          `Improve ${integration.integration_name} health score (currently ${integration.health_score}%)`,
        );
      }

      if (integration.response_time > 1000) {
        recommendations.push(
          `Optimize ${integration.integration_name} response time (currently ${integration.response_time}ms)`,
        );
      }

      if (integration.error_rate > 2) {
        recommendations.push(
          `Reduce ${integration.integration_name} error rate (currently ${integration.error_rate}%)`,
        );
      }

      if (integration.uptime_percentage < 99) {
        recommendations.push(
          `Improve ${integration.integration_name} uptime (currently ${integration.uptime_percentage}%)`,
        );
      }
    });

    return recommendations;
  }

  private static assessComplianceRisk(data: ComplianceData): {
    overall_risk: "low" | "medium" | "high" | "critical";
    risk_factors: string[];
    mitigation_actions: string[];
  } {
    const riskFactors: string[] = [];
    const mitigationActions: string[] = [];
    let riskScore = 0;

    // Policy adherence risk
    if (data.policy_adherence.compliance_score < 95) {
      riskScore += 20;
      riskFactors.push("Low policy compliance score");
      mitigationActions.push("Review and update policy adherence procedures");
    }

    // Critical violations
    const criticalViolations = data.policy_adherence.violations.filter(
      (v) => v.severity === "critical" && !v.resolved,
    );
    if (criticalViolations.length > 0) {
      riskScore += 30;
      riskFactors.push(
        `${criticalViolations.length} unresolved critical violations`,
      );
      mitigationActions.push("Immediately address critical policy violations");
    }

    // Audit trail completeness
    if (data.audit_trail.audit_score < 95) {
      riskScore += 15;
      riskFactors.push("Incomplete audit trail");
      mitigationActions.push("Improve logging and audit trail completeness");
    }

    // Data retention compliance
    if (data.data_retention.retention_compliance < 98) {
      riskScore += 10;
      riskFactors.push("Data retention issues");
      mitigationActions.push("Implement automated data retention policies");
    }

    let overallRisk: "low" | "medium" | "high" | "critical";
    if (riskScore >= 50) overallRisk = "critical";
    else if (riskScore >= 30) overallRisk = "high";
    else if (riskScore >= 15) overallRisk = "medium";
    else overallRisk = "low";

    return {
      overall_risk: overallRisk,
      risk_factors: riskFactors,
      mitigation_actions: mitigationActions,
    };
  }

  private static calculateNextGenerationTime(schedule: ReportSchedule): string {
    const now = new Date();
    const next = new Date(now);

    switch (schedule.frequency) {
      case "hourly":
        next.setHours(next.getHours() + 1);
        break;
      case "daily":
        next.setDate(next.getDate() + 1);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "quarterly":
        next.setMonth(next.getMonth() + 3);
        break;
    }

    return next.toISOString();
  }

  private static generateWorkflowVolumeTrend(): Array<{
    date: string;
    count: number;
  }> {
    // Mock trend data
    return [
      { date: "2024-01-15", count: 45 },
      { date: "2024-01-16", count: 52 },
      { date: "2024-01-17", count: 48 },
      { date: "2024-01-18", count: 61 },
      { date: "2024-01-19", count: 38 },
      { date: "2024-01-20", count: 44 },
    ];
  }

  private static generateCompletionTimeTrend(): Array<{
    date: string;
    avg_time: number;
  }> {
    // Mock trend data
    return [
      { date: "2024-01-15", avg_time: 26.5 },
      { date: "2024-01-16", avg_time: 24.8 },
      { date: "2024-01-17", avg_time: 22.1 },
      { date: "2024-01-18", avg_time: 23.9 },
      { date: "2024-01-19", avg_time: 21.7 },
      { date: "2024-01-20", avg_time: 20.3 },
    ];
  }

  private static generateErrorRateTrend(): Array<{
    date: string;
    error_rate: number;
  }> {
    // Mock trend data
    return [
      { date: "2024-01-15", error_rate: 2.1 },
      { date: "2024-01-16", error_rate: 1.8 },
      { date: "2024-01-17", error_rate: 1.5 },
      { date: "2024-01-18", error_rate: 1.9 },
      { date: "2024-01-19", error_rate: 1.2 },
      { date: "2024-01-20", error_rate: 0.8 },
    ];
  }

  private static async getMockNotificationAnalytics(
    filters?: any,
  ): Promise<any> {
    // Mock notification analytics data
    return {
      total_sent: 1248,
      delivery_rate: 97.8,
      read_rate: 84.2,
      by_channel: {
        email: { sent: 892, delivered: 876, failed: 16 },
        in_app: { sent: 1248, delivered: 1248, failed: 0 },
        sms: { sent: 234, delivered: 229, failed: 5 },
        slack: { sent: 156, delivered: 152, failed: 4 },
      },
      by_type: {
        workflow: 478,
        calendar: 234,
        system: 189,
        info: 156,
        warning: 89,
        error: 23,
      },
      by_priority: {
        low: 234,
        medium: 789,
        high: 178,
        urgent: 47,
      },
      performance_trends: [
        { date: "2024-01-15", sent: 156, delivered: 152, read: 128 },
        { date: "2024-01-16", sent: 189, delivered: 185, read: 159 },
        { date: "2024-01-17", sent: 234, delivered: 230, read: 198 },
        { date: "2024-01-18", sent: 267, delivered: 261, read: 224 },
        { date: "2024-01-19", sent: 198, delivered: 194, read: 167 },
        { date: "2024-01-20", sent: 204, delivered: 200, read: 172 },
      ],
    };
  }
}
