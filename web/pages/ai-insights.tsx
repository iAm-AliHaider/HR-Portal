import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

// Advanced AI Insights Interfaces
interface PredictiveInsight {
  id: string;
  title: string;
  type: "turnover" | "performance" | "engagement" | "productivity" | "risk";
  confidence: number;
  impact: "low" | "medium" | "high" | "critical";
  timeline: string;
  prediction: string;
  accuracy: number;
  data_points: Array<{
    metric: string;
    current: number;
    predicted: number;
    trend: "increasing" | "decreasing" | "stable";
  }>;
  recommendations: Array<{
    action: string;
    priority: number;
    effort: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    timeline: string;
  }>;
}

interface MLModel {
  name: string;
  type: "classification" | "regression" | "clustering" | "forecasting";
  accuracy: number;
  last_trained: string;
  features: string[];
  performance_metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    auc_roc?: number;
    mse?: number;
    mae?: number;
  };
}

interface RealTimeMetrics {
  employee_sentiment: {
    score: number;
    trend: "positive" | "negative" | "neutral";
    sources: string[];
  };
  productivity_index: {
    score: number;
    benchmark: number;
    factors: Array<{
      name: string;
      impact: number;
      trend: "improving" | "declining" | "stable";
    }>;
  };
  retention_risk: {
    high_risk_employees: number;
    risk_factors: string[];
    mitigation_actions: string[];
  };
  skill_gaps: Array<{
    skill: string;
    gap_severity: number;
    affected_departments: string[];
    training_recommendations: string[];
  }>;
}

const AIInsightsPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [models, setModels] = useState<MLModel[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] =
    useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  useEffect(() => {
    fetchAIData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const [insightsRes, modelsRes, metricsRes] = await Promise.all([
        fetch("/api/ai-insights?type=predictive"),
        fetch("/api/ai-insights?type=models"),
        fetch("/api/ai-insights?type=realtime"),
      ]);

      if (!insightsRes.ok || !modelsRes.ok || !metricsRes.ok) {
        throw new Error("Failed to fetch AI data");
      }

      const [insightsData, modelsData, metricsData] = await Promise.all([
        insightsRes.json(),
        modelsRes.json(),
        metricsRes.json(),
      ]);

      setInsights(generateMockInsights());
      setModels(generateMockModels());
      setRealTimeMetrics(generateMockMetrics());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch AI insights",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch("/api/ai-insights?type=realtime");
      if (response.ok) {
        const data = await response.json();
        setRealTimeMetrics(data);
      }
    } catch (err) {
      console.error("Failed to fetch real-time metrics:", err);
    }
  };

  // Mock data generators
  const generateMockInsights = (): PredictiveInsight[] => [
    {
      id: "insight_001",
      title: "Employee Turnover Risk Prediction",
      type: "turnover",
      confidence: 92.3,
      impact: "high",
      timeline: "90 days",
      prediction: "18% increase in turnover expected in Engineering department",
      accuracy: 89.7,
      data_points: [
        {
          metric: "Satisfaction Score",
          current: 7.2,
          predicted: 6.8,
          trend: "decreasing",
        },
        {
          metric: "Workload Index",
          current: 8.1,
          predicted: 8.5,
          trend: "increasing",
        },
        {
          metric: "Career Growth Score",
          current: 6.5,
          predicted: 6.2,
          trend: "decreasing",
        },
      ],
      recommendations: [
        {
          action: "Implement retention bonuses for high-risk engineers",
          priority: 9,
          effort: "medium",
          impact: "high",
          timeline: "2 weeks",
        },
        {
          action: "Launch career development program",
          priority: 8,
          effort: "high",
          impact: "high",
          timeline: "1 month",
        },
      ],
    },
    {
      id: "insight_002",
      title: "Performance Improvement Opportunity",
      type: "performance",
      confidence: 87.1,
      impact: "medium",
      timeline: "60 days",
      prediction:
        "Sales team performance can improve by 23% with targeted training",
      accuracy: 91.2,
      data_points: [
        {
          metric: "Conversion Rate",
          current: 14.2,
          predicted: 17.5,
          trend: "increasing",
        },
        {
          metric: "Training Completion",
          current: 67.0,
          predicted: 95.0,
          trend: "increasing",
        },
        {
          metric: "Customer Satisfaction",
          current: 8.1,
          predicted: 8.7,
          trend: "increasing",
        },
      ],
      recommendations: [
        {
          action: "Deploy advanced sales methodology training",
          priority: 7,
          effort: "medium",
          impact: "high",
          timeline: "3 weeks",
        },
      ],
    },
    {
      id: "insight_003",
      title: "Employee Engagement Anomaly Detection",
      type: "engagement",
      confidence: 94.5,
      impact: "critical",
      timeline: "14 days",
      prediction: "Unusual drop in engagement detected in Product Development",
      accuracy: 88.9,
      data_points: [
        {
          metric: "Daily Standup Participation",
          current: 78.0,
          predicted: 65.0,
          trend: "decreasing",
        },
        {
          metric: "Collaboration Score",
          current: 7.8,
          predicted: 7.2,
          trend: "decreasing",
        },
        {
          metric: "Innovation Index",
          current: 8.2,
          predicted: 7.6,
          trend: "decreasing",
        },
      ],
      recommendations: [
        {
          action: "Conduct immediate team health assessment",
          priority: 10,
          effort: "low",
          impact: "high",
          timeline: "1 week",
        },
        {
          action: "Organize team building activities",
          priority: 8,
          effort: "medium",
          impact: "medium",
          timeline: "2 weeks",
        },
      ],
    },
  ];

  const generateMockModels = (): MLModel[] => [
    {
      name: "Employee Retention Predictor",
      type: "classification",
      accuracy: 89.7,
      last_trained: "2024-01-20T10:00:00Z",
      features: [
        "tenure",
        "satisfaction_score",
        "salary_percentile",
        "promotion_history",
        "manager_rating",
      ],
      performance_metrics: {
        precision: 0.891,
        recall: 0.874,
        f1_score: 0.882,
        auc_roc: 0.923,
      },
    },
    {
      name: "Performance Forecasting Model",
      type: "regression",
      accuracy: 91.2,
      last_trained: "2024-01-18T14:30:00Z",
      features: [
        "skills_score",
        "training_hours",
        "project_complexity",
        "team_dynamics",
        "workload",
      ],
      performance_metrics: {
        precision: 0.912,
        recall: 0.895,
        f1_score: 0.903,
        mse: 0.087,
        mae: 0.234,
      },
    },
    {
      name: "Skills Gap Analyzer",
      type: "clustering",
      accuracy: 85.4,
      last_trained: "2024-01-15T09:15:00Z",
      features: [
        "current_skills",
        "required_skills",
        "learning_pace",
        "role_requirements",
      ],
      performance_metrics: {
        precision: 0.854,
        recall: 0.838,
        f1_score: 0.846,
      },
    },
  ];

  const generateMockMetrics = (): RealTimeMetrics => ({
    employee_sentiment: {
      score: 7.8,
      trend: "positive",
      sources: [
        "surveys",
        "slack_sentiment",
        "email_analysis",
        "meeting_feedback",
      ],
    },
    productivity_index: {
      score: 8.2,
      benchmark: 7.5,
      factors: [
        { name: "Code Quality", impact: 0.23, trend: "improving" },
        { name: "Collaboration", impact: 0.19, trend: "stable" },
        { name: "Innovation", impact: 0.18, trend: "improving" },
        { name: "Efficiency", impact: 0.21, trend: "declining" },
        { name: "Focus Time", impact: 0.19, trend: "stable" },
      ],
    },
    retention_risk: {
      high_risk_employees: 12,
      risk_factors: [
        "workload_stress",
        "career_stagnation",
        "compensation_gaps",
      ],
      mitigation_actions: [
        "salary_review",
        "career_planning",
        "workload_balancing",
      ],
    },
    skill_gaps: [
      {
        skill: "Machine Learning",
        gap_severity: 8.2,
        affected_departments: ["Engineering", "Data Science", "Product"],
        training_recommendations: [
          "ML Fundamentals Course",
          "Advanced Python",
          "TensorFlow Certification",
        ],
      },
      {
        skill: "Cloud Architecture",
        gap_severity: 7.1,
        affected_departments: ["Engineering", "DevOps"],
        training_recommendations: [
          "AWS Solutions Architect",
          "Kubernetes Training",
          "Microservices Design",
        ],
      },
    ],
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${colors[impact as keyof typeof colors]}`;
  };

  if (loading) {
    return (
      <Layout title="AI Insights">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="AI Insights">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="AI-Powered Workforce Insights">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🤖 AI Workforce Insights</h1>
              <p className="text-purple-100 mt-2">
                Machine learning-powered analytics and predictive insights for
                workforce optimization
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">89.2%</div>
              <div className="text-sm text-purple-100">Model Accuracy</div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Dashboard */}
        {realTimeMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">😊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Employee Sentiment
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {realTimeMetrics.employee_sentiment.score}/10
                  </p>
                  <p
                    className={`text-sm ${
                      realTimeMetrics.employee_sentiment.trend === "positive"
                        ? "text-green-600"
                        : realTimeMetrics.employee_sentiment.trend ===
                            "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {realTimeMetrics.employee_sentiment.trend}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Productivity Index
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {realTimeMetrics.productivity_index.score}/10
                  </p>
                  <p className="text-sm text-green-600">
                    +
                    {(
                      (realTimeMetrics.productivity_index.score /
                        realTimeMetrics.productivity_index.benchmark -
                        1) *
                      100
                    ).toFixed(1)}
                    % vs benchmark
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Retention Risk
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {realTimeMetrics.retention_risk.high_risk_employees}
                  </p>
                  <p className="text-sm text-red-600">high-risk employees</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Skill Gaps
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {realTimeMetrics.skill_gaps.length}
                  </p>
                  <p className="text-sm text-yellow-600">critical areas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "predictions", label: "Predictions", icon: "🔮" },
              { id: "models", label: "ML Models", icon: "🧠" },
              { id: "recommendations", label: "Recommendations", icon: "💡" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "predictions" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Predictive Insights
            </h2>
            <div className="grid gap-6">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {insight.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {insight.prediction}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={getImpactBadge(insight.impact)}>
                          {insight.impact} impact
                        </span>
                        <div className="text-right">
                          <p
                            className={`text-2xl font-bold ${getConfidenceColor(insight.confidence)}`}
                          >
                            {insight.confidence}%
                          </p>
                          <p className="text-sm text-gray-500">confidence</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Data Points */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Key Metrics
                        </h4>
                        <div className="space-y-3">
                          {insight.data_points.map((point, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <span className="text-sm text-gray-600">
                                {point.metric}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  {point.current}
                                </span>
                                <span className="text-sm text-gray-400">→</span>
                                <span
                                  className={`text-sm font-medium ${
                                    point.trend === "increasing"
                                      ? "text-green-600"
                                      : point.trend === "decreasing"
                                        ? "text-red-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {point.predicted}
                                </span>
                                <span
                                  className={`text-xs ${
                                    point.trend === "increasing"
                                      ? "text-green-600"
                                      : point.trend === "decreasing"
                                        ? "text-red-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {point.trend === "increasing"
                                    ? "↗️"
                                    : point.trend === "decreasing"
                                      ? "↘️"
                                      : "→"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Recommended Actions
                        </h4>
                        <div className="space-y-3">
                          {insight.recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {rec.action}
                                </p>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Priority {rec.priority}/10
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Effort: {rec.effort}</span>
                                <span>Impact: {rec.impact}</span>
                                <span>{rec.timeline}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "models" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Machine Learning Models
            </h2>
            <div className="grid gap-6">
              {models.map((model, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {model.name}
                      </h3>
                      <p className="text-gray-600">Type: {model.type}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${getConfidenceColor(model.accuracy)}`}
                      >
                        {model.accuracy}%
                      </p>
                      <p className="text-sm text-gray-500">accuracy</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {model.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Performance Metrics
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Precision:</span>
                          <span className="font-medium">
                            {(
                              model.performance_metrics.precision * 100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recall:</span>
                          <span className="font-medium">
                            {(model.performance_metrics.recall * 100).toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>F1 Score:</span>
                          <span className="font-medium">
                            {(model.performance_metrics.f1_score * 100).toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                        {model.performance_metrics.auc_roc && (
                          <div className="flex justify-between">
                            <span>AUC-ROC:</span>
                            <span className="font-medium">
                              {(
                                model.performance_metrics.auc_roc * 100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Last trained:{" "}
                      {new Date(model.last_trained).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "overview" && realTimeMetrics && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              AI Insights Overview
            </h2>

            {/* Productivity Factors */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Productivity Factors Analysis
              </h3>
              <div className="space-y-4">
                {realTimeMetrics.productivity_index.factors.map(
                  (factor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {factor.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {(factor.impact * 100).toFixed(0)}% impact
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              factor.trend === "improving"
                                ? "bg-green-500"
                                : factor.trend === "declining"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                            style={{ width: `${factor.impact * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span
                        className={`ml-4 text-sm ${
                          factor.trend === "improving"
                            ? "text-green-600"
                            : factor.trend === "declining"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {factor.trend === "improving"
                          ? "↗️"
                          : factor.trend === "declining"
                            ? "↘️"
                            : "→"}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Skill Gaps Analysis */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Critical Skill Gaps
              </h3>
              <div className="space-y-4">
                {realTimeMetrics.skill_gaps.map((gap, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{gap.skill}</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                        Severity: {gap.gap_severity}/10
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">
                          Affected Departments:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {gap.affected_departments.map((dept, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">
                          Recommended Training:
                        </p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {gap.training_recommendations.map((rec, idx) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              AI-Generated Recommendations
            </h2>

            {/* High Priority Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🚨 High Priority Actions
              </h3>
              <div className="space-y-4">
                {insights
                  .flatMap((insight) => insight.recommendations)
                  .filter((rec) => rec.priority >= 8)
                  .sort((a, b) => b.priority - a.priority)
                  .map((rec, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {rec.action}
                        </h4>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                            Priority {rec.priority}/10
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                            {rec.timeline}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Effort Required: {rec.effort}</span>
                        <span>Expected Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Medium Priority Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Medium Priority Actions
              </h3>
              <div className="space-y-4">
                {insights
                  .flatMap((insight) => insight.recommendations)
                  .filter((rec) => rec.priority >= 5 && rec.priority < 8)
                  .sort((a, b) => b.priority - a.priority)
                  .map((rec, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {rec.action}
                        </h4>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Priority {rec.priority}/10
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                            {rec.timeline}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Effort Required: {rec.effort}</span>
                        <span>Expected Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIInsightsPage;
