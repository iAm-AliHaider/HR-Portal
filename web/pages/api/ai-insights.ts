import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../services/supabase";

// AI Insights interfaces
interface AIInsight {
  id: string;
  type: "prediction" | "anomaly" | "recommendation" | "trend" | "risk";
  module:
    | "hr"
    | "recruitment"
    | "performance"
    | "leave"
    | "training"
    | "compliance"
    | "finance";
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: "low" | "medium" | "high" | "critical";
  priority: number; // 1-10
  data_points: DataPoint[];
  actionable_items: ActionableItem[];
  created_at: string;
  expires_at?: string;
}

interface DataPoint {
  metric: string;
  current_value: number | string;
  predicted_value?: number | string;
  trend: "increasing" | "decreasing" | "stable";
  change_percentage?: number;
}

interface ActionableItem {
  id: string;
  action: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high" | "critical";
  timeline: string;
  responsible_role: string;
}

interface PredictiveModel {
  name: string;
  accuracy: number;
  last_trained: string;
  prediction_horizon: string; // e.g., "30 days", "6 months"
}

interface AIAnalytics {
  employee_turnover: {
    current_rate: number;
    predicted_rate: number;
    risk_factors: string[];
    at_risk_employees: string[];
  };
  recruitment_efficiency: {
    avg_time_to_hire: number;
    predicted_next_month: number;
    bottlenecks: string[];
    optimization_suggestions: string[];
  };
  performance_trends: {
    overall_score: number;
    trending_up: string[];
    trending_down: string[];
    improvement_areas: string[];
  };
  leave_patterns: {
    peak_periods: string[];
    unusual_patterns: string[];
    coverage_risks: string[];
    recommendations: string[];
  };
  training_effectiveness: {
    completion_rate: number;
    skill_gap_analysis: SkillGap[];
    recommended_programs: string[];
  };
  compliance_risks: {
    risk_score: number;
    critical_areas: string[];
    upcoming_deadlines: string[];
    mitigation_actions: string[];
  };
}

interface SkillGap {
  skill: string;
  required_level: number;
  current_level: number;
  gap_score: number;
  affected_employees: number;
}

// Mock AI models and data
const mockPredictiveModels: PredictiveModel[] = [
  {
    name: "Employee Turnover Predictor",
    accuracy: 89.3,
    last_trained: "2024-01-15T10:00:00Z",
    prediction_horizon: "3 months",
  },
  {
    name: "Performance Trend Analyzer",
    accuracy: 84.7,
    last_trained: "2024-01-18T14:30:00Z",
    prediction_horizon: "6 months",
  },
  {
    name: "Recruitment Efficiency Optimizer",
    accuracy: 92.1,
    last_trained: "2024-01-20T09:15:00Z",
    prediction_horizon: "2 months",
  },
];

const mockAIInsights: AIInsight[] = [
  {
    id: "ai_insight_001",
    type: "prediction",
    module: "hr",
    title: "Predicted Increase in Turnover",
    description:
      "Our AI model predicts a 15% increase in employee turnover over the next 3 months based on performance reviews, satisfaction surveys, and historical patterns.",
    confidence: 89,
    impact: "high",
    priority: 8,
    data_points: [
      {
        metric: "Current Turnover Rate",
        current_value: 12.3,
        predicted_value: 14.1,
        trend: "increasing",
        change_percentage: 14.6,
      },
      {
        metric: "Employee Satisfaction",
        current_value: 7.2,
        trend: "decreasing",
        change_percentage: -8.3,
      },
    ],
    actionable_items: [
      {
        id: "action_001",
        action:
          "Conduct focused satisfaction surveys in Engineering department",
        effort: "medium",
        impact: "high",
        timeline: "2 weeks",
        responsible_role: "HR Manager",
      },
      {
        id: "action_002",
        action: "Implement retention bonuses for high-risk employees",
        effort: "high",
        impact: "high",
        timeline: "1 month",
        responsible_role: "C-Suite",
      },
    ],
    created_at: "2024-01-20T10:00:00Z",
    expires_at: "2024-04-20T10:00:00Z",
  },
  {
    id: "ai_insight_002",
    type: "anomaly",
    module: "recruitment",
    title: "Unusual Recruitment Delay Pattern",
    description:
      "AI detected an anomalous pattern in recruitment timelines for Software Engineer positions - average time-to-hire has increased by 40% in the last month.",
    confidence: 94,
    impact: "medium",
    priority: 6,
    data_points: [
      {
        metric: "Average Time to Hire",
        current_value: 35,
        trend: "increasing",
        change_percentage: 40.0,
      },
      {
        metric: "Interview-to-Offer Conversion",
        current_value: 0.65,
        trend: "decreasing",
        change_percentage: -18.7,
      },
    ],
    actionable_items: [
      {
        id: "action_003",
        action: "Review interview panel availability and scheduling",
        effort: "low",
        impact: "medium",
        timeline: "1 week",
        responsible_role: "Recruitment Manager",
      },
      {
        id: "action_004",
        action: "Analyze competitor compensation packages",
        effort: "medium",
        impact: "high",
        timeline: "2 weeks",
        responsible_role: "Compensation Analyst",
      },
    ],
    created_at: "2024-01-19T15:30:00Z",
  },
  {
    id: "ai_insight_003",
    type: "recommendation",
    module: "training",
    title: "Skill Development Opportunity",
    description:
      "AI analysis reveals a significant skill gap in cloud technologies. Implementing targeted training could improve team productivity by 25%.",
    confidence: 87,
    impact: "high",
    priority: 7,
    data_points: [
      {
        metric: "Cloud Skills Gap",
        current_value: 3.2,
        trend: "stable",
      },
      {
        metric: "Productivity Impact",
        current_value: 0,
        predicted_value: 25,
        trend: "increasing",
      },
    ],
    actionable_items: [
      {
        id: "action_005",
        action: "Implement AWS/Azure certification program",
        effort: "high",
        impact: "high",
        timeline: "3 months",
        responsible_role: "Learning & Development",
      },
      {
        id: "action_006",
        action: "Partner with cloud training providers for bulk discounts",
        effort: "medium",
        impact: "medium",
        timeline: "2 weeks",
        responsible_role: "Procurement",
      },
    ],
    created_at: "2024-01-18T11:00:00Z",
  },
  {
    id: "ai_insight_004",
    type: "risk",
    module: "compliance",
    title: "Compliance Risk Alert",
    description:
      "AI monitoring detected potential GDPR compliance issues with data retention practices. Immediate action required to avoid potential penalties.",
    confidence: 96,
    impact: "critical",
    priority: 10,
    data_points: [
      {
        metric: "Data Retention Violations",
        current_value: 23,
        trend: "increasing",
      },
      {
        metric: "Compliance Score",
        current_value: 78.5,
        trend: "decreasing",
        change_percentage: -12.3,
      },
    ],
    actionable_items: [
      {
        id: "action_007",
        action: "Audit all employee data retention policies",
        effort: "high",
        impact: "critical",
        timeline: "1 week",
        responsible_role: "Data Protection Officer",
      },
      {
        id: "action_008",
        action: "Implement automated data purging system",
        effort: "high",
        impact: "high",
        timeline: "1 month",
        responsible_role: "IT Security",
      },
    ],
    created_at: "2024-01-20T08:00:00Z",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req;

  try {
    switch (method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("AI Insights API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { type, module, priority, limit } = req.query;

  switch (type) {
    case "insights":
      return await getAIInsights(req, res);
    case "analytics":
      return await getAIAnalytics(req, res);
    case "models":
      return await getPredictiveModels(req, res);
    case "dashboard":
      return await getAIDashboard(req, res);
    default:
      return await getAIInsights(req, res);
  }
}

async function getAIInsights(req: NextApiRequest, res: NextApiResponse) {
  const { module, priority, limit, impact } = req.query;

  try {
    let filteredInsights = mockAIInsights;

    // Apply filters
    if (module) {
      filteredInsights = filteredInsights.filter(
        (insight) => insight.module === module,
      );
    }
    if (priority) {
      filteredInsights = filteredInsights.filter(
        (insight) => insight.priority >= parseInt(priority as string),
      );
    }
    if (impact) {
      filteredInsights = filteredInsights.filter(
        (insight) => insight.impact === impact,
      );
    }

    // Sort by priority and confidence
    filteredInsights.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return b.confidence - a.confidence;
    });

    // Apply limit
    if (limit) {
      filteredInsights = filteredInsights.slice(0, parseInt(limit as string));
    }

    return res.status(200).json({
      insights: filteredInsights,
      total: filteredInsights.length,
      summary: {
        critical: filteredInsights.filter((i) => i.impact === "critical")
          .length,
        high: filteredInsights.filter((i) => i.impact === "high").length,
        medium: filteredInsights.filter((i) => i.impact === "medium").length,
        low: filteredInsights.filter((i) => i.impact === "low").length,
      },
    });
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return res.status(500).json({ error: "Failed to fetch AI insights" });
  }
}

async function getAIAnalytics(req: NextApiRequest, res: NextApiResponse) {
  try {
    const analytics: AIAnalytics = {
      employee_turnover: {
        current_rate: 12.3,
        predicted_rate: 14.1,
        risk_factors: [
          "Decreased satisfaction scores in Engineering",
          "Increased workload without compensation adjustment",
          "Limited career advancement opportunities",
        ],
        at_risk_employees: ["EMP-001", "EMP-005", "EMP-012"],
      },
      recruitment_efficiency: {
        avg_time_to_hire: 35,
        predicted_next_month: 28,
        bottlenecks: [
          "Interview scheduling delays",
          "Slow reference checks",
          "Compensation negotiation lengthening",
        ],
        optimization_suggestions: [
          "Implement automated scheduling system",
          "Streamline reference check process",
          "Pre-define compensation bands",
        ],
      },
      performance_trends: {
        overall_score: 7.8,
        trending_up: ["Sales Team", "Product Development", "Customer Success"],
        trending_down: ["Operations", "IT Support"],
        improvement_areas: [
          "Technical skills development",
          "Leadership training",
          "Cross-functional collaboration",
        ],
      },
      leave_patterns: {
        peak_periods: ["December", "July-August", "March (Spring Break)"],
        unusual_patterns: [
          "Increased sick leave in Engineering team",
          "Unusual vacation clustering in Q1",
        ],
        coverage_risks: [
          "Customer Support during December",
          "Development team in August",
        ],
        recommendations: [
          "Implement mandatory coverage planning",
          "Cross-train team members",
          "Hire temporary staff for peak periods",
        ],
      },
      training_effectiveness: {
        completion_rate: 87.4,
        skill_gap_analysis: [
          {
            skill: "Cloud Technologies",
            required_level: 8,
            current_level: 5.2,
            gap_score: 2.8,
            affected_employees: 24,
          },
          {
            skill: "Data Analytics",
            required_level: 7,
            current_level: 4.8,
            gap_score: 2.2,
            affected_employees: 18,
          },
          {
            skill: "Leadership",
            required_level: 6,
            current_level: 4.1,
            gap_score: 1.9,
            affected_employees: 12,
          },
        ],
        recommended_programs: [
          "AWS Certification Program",
          "Advanced Excel and Power BI Training",
          "Management Fundamentals Course",
        ],
      },
      compliance_risks: {
        risk_score: 78.5,
        critical_areas: [
          "Data retention policy violations",
          "Incomplete audit trails",
          "Missing security training certifications",
        ],
        upcoming_deadlines: [
          "GDPR audit review - 2 weeks",
          "SOX compliance certification - 1 month",
          "Security training renewal - 3 weeks",
        ],
        mitigation_actions: [
          "Implement automated data purging",
          "Enhance logging mechanisms",
          "Schedule mandatory training sessions",
        ],
      },
    };

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching AI analytics:", error);
    return res.status(500).json({ error: "Failed to fetch AI analytics" });
  }
}

async function getPredictiveModels(req: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json({
      models: mockPredictiveModels,
      model_performance: {
        overall_accuracy: 88.7,
        prediction_success_rate: 91.3,
        false_positive_rate: 4.2,
        last_model_update: "2024-01-20T09:15:00Z",
      },
      training_schedule: {
        next_training: "2024-02-15T02:00:00Z",
        frequency: "monthly",
        data_sources: [
          "employee_data",
          "performance_metrics",
          "satisfaction_surveys",
          "market_data",
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching predictive models:", error);
    return res.status(500).json({ error: "Failed to fetch predictive models" });
  }
}

async function getAIDashboard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dashboard = {
      overview: {
        total_insights: mockAIInsights.length,
        critical_alerts: mockAIInsights.filter((i) => i.impact === "critical")
          .length,
        accuracy_score: 88.7,
        last_updated: new Date().toISOString(),
      },
      top_insights: mockAIInsights
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5),
      model_status: {
        active_models: mockPredictiveModels.length,
        avg_accuracy:
          mockPredictiveModels.reduce((sum, m) => sum + m.accuracy, 0) /
          mockPredictiveModels.length,
        last_training: mockPredictiveModels.reduce((latest, model) => {
          return new Date(model.last_trained) > new Date(latest)
            ? model.last_trained
            : latest;
        }, mockPredictiveModels[0].last_trained),
      },
      trends: {
        insights_generated: [
          { date: "2024-01-15", count: 12 },
          { date: "2024-01-16", count: 15 },
          { date: "2024-01-17", count: 18 },
          { date: "2024-01-18", count: 22 },
          { date: "2024-01-19", count: 19 },
          { date: "2024-01-20", count: 25 },
        ],
        accuracy_trends: [
          { date: "2024-01-15", accuracy: 87.2 },
          { date: "2024-01-16", accuracy: 88.1 },
          { date: "2024-01-17", accuracy: 87.9 },
          { date: "2024-01-18", accuracy: 88.5 },
          { date: "2024-01-19", accuracy: 88.8 },
          { date: "2024-01-20", accuracy: 89.2 },
        ],
      },
      recommendations: {
        immediate_actions: mockAIInsights
          .filter((i) => i.impact === "critical" || i.priority >= 8)
          .flatMap((i) => i.actionable_items)
          .slice(0, 5),
        optimization_opportunities: [
          "Increase data collection frequency for better predictions",
          "Implement real-time anomaly detection",
          "Add external data sources for market trend analysis",
        ],
      },
    };

    return res.status(200).json(dashboard);
  } catch (error) {
    console.error("Error fetching AI dashboard:", error);
    return res.status(500).json({ error: "Failed to fetch AI dashboard" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  const data = req.body;

  switch (type) {
    case "train-model":
      return await trainModel(req, res);
    case "generate-insight":
      return await generateInsight(req, res);
    case "feedback":
      return await submitInsightFeedback(req, res);
    default:
      return res.status(400).json({ error: "Invalid operation type" });
  }
}

async function trainModel(req: NextApiRequest, res: NextApiResponse) {
  const { model_name, data_sources, parameters } = req.body;

  try {
    // Mock model training process
    const trainingJob = {
      id: `training_${Date.now()}`,
      model_name,
      status: "in_progress",
      started_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      data_sources,
      parameters: parameters || {},
      progress: 0,
    };

    // In real implementation, this would start an actual ML training job
    console.log(`[AI] Starting training for model: ${model_name}`);

    return res.status(202).json({
      message: "Model training started",
      training_job: trainingJob,
    });
  } catch (error) {
    console.error("Error starting model training:", error);
    return res.status(500).json({ error: "Failed to start model training" });
  }
}

async function generateInsight(req: NextApiRequest, res: NextApiResponse) {
  const { module, data_context, insight_type } = req.body;

  try {
    // Mock insight generation
    const newInsight: AIInsight = {
      id: `ai_insight_${Date.now()}`,
      type: insight_type || "recommendation",
      module: module || "hr",
      title: "Custom Generated Insight",
      description: "AI-generated insight based on provided context",
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100
      impact: "medium",
      priority: Math.floor(Math.random() * 5) + 5, // 5-10
      data_points: [],
      actionable_items: [],
      created_at: new Date().toISOString(),
    };

    return res.status(201).json({
      message: "Insight generated successfully",
      insight: newInsight,
    });
  } catch (error) {
    console.error("Error generating insight:", error);
    return res.status(500).json({ error: "Failed to generate insight" });
  }
}

async function submitInsightFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { insight_id, rating, feedback, useful } = req.body;

  try {
    // Mock feedback storage
    const feedbackRecord = {
      id: `feedback_${Date.now()}`,
      insight_id,
      rating: rating || 0,
      feedback: feedback || "",
      useful: useful || false,
      submitted_at: new Date().toISOString(),
      user_id: "current_user", // In real implementation, get from auth
    };

    console.log(
      `[AI] Feedback received for insight ${insight_id}: ${rating}/5 stars`,
    );

    return res.status(200).json({
      message: "Feedback submitted successfully",
      feedback_id: feedbackRecord.id,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ error: "Failed to submit feedback" });
  }
}
