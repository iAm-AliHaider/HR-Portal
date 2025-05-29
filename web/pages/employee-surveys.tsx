import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { GetServerSideProps } from 'next';

const EmployeeSurveysFeedback = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const surveyMetrics = [
    { label: 'Active Surveys', value: '8', icon: '📋', color: 'text-blue-600', trend: 'up' },
    { label: 'Response Rate', value: '87%', icon: '📊', color: 'text-green-600', trend: 'up' },
    { label: 'Engagement Score', value: '4.3/5', icon: '⭐', color: 'text-purple-600', trend: 'up' },
    { label: 'Pending Responses', value: '45', icon: '⏳', color: 'text-orange-600', trend: 'down' }
  ];

  const surveys = [
    {
      id: 'survey-001',
      title: 'Q2 2024 Employee Engagement Survey',
      type: 'engagement',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      targetAudience: 'All Employees',
      totalTargets: 247,
      responses: 189,
      responseRate: 76.5,
      createdBy: 'HR Team',
      description: 'Quarterly assessment of employee engagement, satisfaction, and organizational culture',
      questions: [
        { id: 'q1', type: 'rating', question: 'How satisfied are you with your current role?', required: true },
        { id: 'q2', type: 'rating', question: 'How would you rate work-life balance?', required: true },
        { id: 'q3', type: 'multiple', question: 'What motivates you most at work?', required: false },
        { id: 'q4', type: 'text', question: 'What would improve your work experience?', required: false }
      ],
      avgScore: 4.3,
      categories: ['Job Satisfaction', 'Work-Life Balance', 'Career Development', 'Management', 'Culture']
    },
    {
      id: 'survey-002',
      title: 'Remote Work Effectiveness Survey',
      type: 'pulse',
      status: 'active',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
      targetAudience: 'Remote Workers',
      totalTargets: 89,
      responses: 67,
      responseRate: 75.3,
      createdBy: 'Operations Team',
      description: 'Weekly pulse survey to assess remote work productivity and challenges',
      questions: [
        { id: 'q1', type: 'rating', question: 'How productive were you working remotely this week?', required: true },
        { id: 'q2', type: 'rating', question: 'How well did you collaborate with your team?', required: true },
        { id: 'q3', type: 'multiple', question: 'What challenges did you face?', required: false }
      ],
      avgScore: 4.1,
      categories: ['Productivity', 'Collaboration', 'Challenges']
    },
    {
      id: 'survey-003',
      title: '360-Degree Feedback - Management',
      type: '360_feedback',
      status: 'completed',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      targetAudience: 'Managers & Direct Reports',
      totalTargets: 56,
      responses: 52,
      responseRate: 92.9,
      createdBy: 'Leadership Development',
      description: 'Comprehensive 360-degree feedback for management development',
      questions: [
        { id: 'q1', type: 'rating', question: 'How effectively does this manager communicate?', required: true },
        { id: 'q2', type: 'rating', question: 'How well does this manager support your development?', required: true },
        { id: 'q3', type: 'text', question: 'What should this manager start doing?', required: false },
        { id: 'q4', type: 'text', question: 'What should this manager stop doing?', required: false }
      ],
      avgScore: 4.0,
      categories: ['Communication', 'Leadership', 'Development', 'Decision Making']
    },
    {
      id: 'survey-004',
      title: 'Training Needs Assessment',
      type: 'training',
      status: 'draft',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      targetAudience: 'All Employees',
      totalTargets: 247,
      responses: 0,
      responseRate: 0,
      createdBy: 'Learning & Development',
      description: 'Assessment to identify training and development needs across the organization',
      questions: [
        { id: 'q1', type: 'multiple', question: 'Which skills would you like to develop?', required: true },
        { id: 'q2', type: 'rating', question: 'How confident are you in your current technical skills?', required: true },
        { id: 'q3', type: 'multiple', question: 'What training format do you prefer?', required: false }
      ],
      avgScore: null,
      categories: ['Technical Skills', 'Soft Skills', 'Leadership', 'Industry Knowledge']
    }
  ];

  const responses = [
    {
      id: 'resp-001',
      surveyId: 'survey-001',
      surveyTitle: 'Q2 2024 Employee Engagement Survey',
      employeeId: 'EMP-2024-045',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      submittedDate: '2024-06-10',
      responses: [
        { questionId: 'q1', question: 'How satisfied are you with your current role?', answer: 5, type: 'rating' },
        { questionId: 'q2', question: 'How would you rate work-life balance?', answer: 4, type: 'rating' },
        { questionId: 'q3', question: 'What motivates you most at work?', answer: 'Learning new technologies', type: 'multiple' },
        { questionId: 'q4', question: 'What would improve your work experience?', answer: 'More flexible hours and better equipment', type: 'text' }
      ],
      overallScore: 4.5,
      completionTime: 8
    },
    {
      id: 'resp-002',
      surveyId: 'survey-001',
      surveyTitle: 'Q2 2024 Employee Engagement Survey',
      employeeId: 'EMP-2024-032',
      employeeName: 'Michael Chen',
      department: 'Sales',
      submittedDate: '2024-06-12',
      responses: [
        { questionId: 'q1', question: 'How satisfied are you with your current role?', answer: 4, type: 'rating' },
        { questionId: 'q2', question: 'How would you rate work-life balance?', answer: 3, type: 'rating' },
        { questionId: 'q3', question: 'What motivates you most at work?', answer: 'Commission and recognition', type: 'multiple' },
        { questionId: 'q4', question: 'What would improve your work experience?', answer: 'Better CRM tools and clearer targets', type: 'text' }
      ],
      overallScore: 3.5,
      completionTime: 12
    }
  ];

  const feedbackTemplates = [
    {
      id: 'template-001',
      name: 'Employee Engagement Survey',
      type: 'engagement',
      description: 'Standard employee engagement assessment',
      questions: 15,
      estimatedTime: '10-15 minutes',
      frequency: 'Quarterly',
      status: 'active'
    },
    {
      id: 'template-002',
      name: 'Weekly Pulse Survey',
      type: 'pulse',
      description: 'Quick weekly check-in on team morale',
      questions: 5,
      estimatedTime: '2-3 minutes',
      frequency: 'Weekly',
      status: 'active'
    },
    {
      id: 'template-003',
      name: '360-Degree Feedback',
      type: '360_feedback',
      description: 'Comprehensive feedback for managers',
      questions: 25,
      estimatedTime: '15-20 minutes',
      frequency: 'Bi-annual',
      status: 'active'
    },
    {
      id: 'template-004',
      name: 'Exit Interview Survey',
      type: 'exit',
      description: 'Survey for departing employees',
      questions: 12,
      estimatedTime: '8-10 minutes',
      frequency: 'As needed',
      status: 'active'
    }
  ];

  const analytics = {
    engagementTrends: [
      { month: 'Jan 2024', score: 4.1 },
      { month: 'Feb 2024', score: 4.2 },
      { month: 'Mar 2024', score: 4.0 },
      { month: 'Apr 2024', score: 4.3 },
      { month: 'May 2024', score: 4.4 },
      { month: 'Jun 2024', score: 4.3 }
    ],
    departmentScores: [
      { department: 'Engineering', score: 4.5, responses: 45 },
      { department: 'Product', score: 4.3, responses: 18 },
      { department: 'Sales', score: 4.1, responses: 32 },
      { department: 'Marketing', score: 4.4, responses: 15 },
      { department: 'HR', score: 4.2, responses: 12 },
      { department: 'Finance', score: 3.9, responses: 8 }
    ],
    responseRates: [
      { survey: 'Q1 Engagement', rate: 89 },
      { survey: 'Remote Work Pulse', rate: 75 },
      { survey: '360 Feedback', rate: 93 },
      { survey: 'Training Needs', rate: 0 }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSurveyTypeIcon = (type) => {
    switch (type) {
      case 'engagement': return '⭐';
      case 'pulse': return '💓';
      case '360_feedback': return '🔄';
      case 'training': return '📚';
      case 'exit': return '🚪';
      case 'onboarding': return '👋';
      default: return '📋';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-yellow-600';
    if (score >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Survey Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {surveyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{metric.icon}</span>
                  <div>
                    <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                </div>
                <div className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📝</span>
              <span className="text-sm">Create Survey</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">💓</span>
              <span className="text-sm">Pulse Survey</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📤</span>
              <span className="text-sm">Send Reminders</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Surveys */}
      <Card>
        <CardHeader>
          <CardTitle>Active Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveys.filter(survey => survey.status === 'active').map((survey) => (
              <div key={survey.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getSurveyTypeIcon(survey.type)}</span>
                    <div>
                      <h3 className="font-medium">{survey.title}</h3>
                      <p className="text-sm text-gray-600">{survey.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(survey.startDate).toLocaleDateString()} - {new Date(survey.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(survey.status)}`}>
                    {survey.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{survey.responses}</div>
                    <div className="text-xs text-gray-600">Responses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{survey.responseRate}%</div>
                    <div className="text-xs text-gray-600">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getScoreColor(survey.avgScore)}`}>
                      {survey.avgScore ? `${survey.avgScore}/5` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{survey.totalTargets - survey.responses}</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Response Progress</span>
                    <span className="text-sm font-medium">{survey.responseRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${survey.responseRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedSurvey(survey)}
                  >
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Responses
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Send Reminder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Trends & Department Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.engagementTrends.map((trend, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{trend.month}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getScoreColor(trend.score)}`}>{trend.score}/5</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(trend.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.departmentScores.map((dept, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{dept.department}</div>
                    <div className="text-xs text-gray-500">{dept.responses} responses</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getScoreColor(dept.score)}`}>{dept.score}/5</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(dept.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSurveys = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Surveys</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Surveys</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Draft</option>
          </select>
          <Button>Create Survey</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{getSurveyTypeIcon(survey.type)}</span>
                  <div>
                    <CardTitle>{survey.title}</CardTitle>
                    <p className="text-sm text-gray-600">{survey.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {survey.createdBy}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(survey.status)}`}>
                  {survey.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{survey.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Survey Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Target:</span> {survey.targetAudience}</div>
                    <div><span className="font-medium">Period:</span> {new Date(survey.startDate).toLocaleDateString()} - {new Date(survey.endDate).toLocaleDateString()}</div>
                    <div><span className="font-medium">Questions:</span> {survey.questions.length}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Response Stats</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Total Targets:</span> {survey.totalTargets}</div>
                    <div><span className="font-medium">Responses:</span> {survey.responses}</div>
                    <div><span className="font-medium">Response Rate:</span> {survey.responseRate}%</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Avg Score:</span> 
                      <span className={`ml-1 ${getScoreColor(survey.avgScore)}`}>
                        {survey.avgScore ? `${survey.avgScore}/5` : 'N/A'}
                      </span>
                    </div>
                    <div><span className="font-medium">Pending:</span> {survey.totalTargets - survey.responses}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {survey.categories.slice(0, 3).map((category, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {category}
                      </span>
                    ))}
                    {survey.categories.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{survey.categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {survey.status === 'active' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Response Progress</span>
                    <span className="text-sm font-medium">{survey.responseRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${survey.responseRate}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedSurvey(survey)}
                >
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  {survey.status === 'draft' ? 'Edit' : 'View Responses'}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  {survey.status === 'active' ? 'Analytics' : survey.status === 'draft' ? 'Launch' : 'Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderResponses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Survey Responses</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Surveys</option>
            <option>Q2 2024 Employee Engagement Survey</option>
            <option>Remote Work Effectiveness Survey</option>
            <option>360-Degree Feedback - Management</option>
          </select>
          <Button>Export Responses</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Survey</th>
                  <th className="text-left p-4">Submitted</th>
                  <th className="text-left p-4">Score</th>
                  <th className="text-left p-4">Completion Time</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{response.employeeName}</div>
                        <div className="text-sm text-gray-600">{response.department}</div>
                        <div className="text-xs text-gray-500">{response.employeeId}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{response.surveyTitle}</div>
                    </td>
                    <td className="p-4">{new Date(response.submittedDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`font-medium ${getScoreColor(response.overallScore)}`}>
                        {response.overallScore}/5
                      </span>
                    </td>
                    <td className="p-4">{response.completionTime} minutes</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedResponse(response)}
                        >
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Follow Up
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Survey Templates</h2>
        <Button>Create Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbackTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getSurveyTypeIcon(template.type)}</span>
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <p className="text-sm text-gray-600">{template.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(template.status)}`}>
                  {template.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <div className="font-bold">{template.questions}</div>
                </div>
                <div>
                  <span className="text-gray-600">Est. Time:</span>
                  <div className="font-medium">{template.estimatedTime}</div>
                </div>
                <div>
                  <span className="text-gray-600">Frequency:</span>
                  <div className="font-medium">{template.frequency}</div>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <div className="font-medium capitalize">{template.type.replace('_', ' ')}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">Use Template</Button>
                <Button size="sm" variant="outline" className="flex-1">Preview</Button>
                <Button size="sm" variant="outline" className="flex-1">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Survey Analytics</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Response Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Response Rates by Survey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.responseRates.map((rate, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{rate.survey}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${rate.rate > 80 ? 'bg-green-600' : rate.rate > 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                      style={{ width: `${rate.rate}%` }}
                    ></div>
                  </div>
                  <span className="font-bold w-12">{rate.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Trends & Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.engagementTrends.map((trend, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{trend.month}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(trend.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`font-medium ${getScoreColor(trend.score)}`}>{trend.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-1">
                  <span className="text-green-600 mr-2">✅</span>
                  <span className="font-medium text-green-800">High Engagement</span>
                </div>
                <p className="text-sm text-green-700">Engineering team shows consistently high satisfaction scores (4.5/5)</p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-1">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <span className="font-medium text-yellow-800">Improvement Needed</span>
                </div>
                <p className="text-sm text-yellow-700">Finance department has lower scores - focus on work-life balance</p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-1">
                  <span className="text-blue-600 mr-2">📈</span>
                  <span className="font-medium text-blue-800">Trending Up</span>
                </div>
                <p className="text-sm text-blue-700">Overall engagement increased 5% from last quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Department</th>
                  <th className="text-left p-4">Avg Score</th>
                  <th className="text-left p-4">Responses</th>
                  <th className="text-left p-4">Response Rate</th>
                  <th className="text-left p-4">Trend</th>
                </tr>
              </thead>
              <tbody>
                {analytics.departmentScores.map((dept, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{dept.department}</td>
                    <td className="p-4">
                      <span className={`font-bold ${getScoreColor(dept.score)}`}>{dept.score}/5</span>
                    </td>
                    <td className="p-4">{dept.responses}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.random() * 30 + 70}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{Math.floor(Math.random() * 30 + 70)}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.random() > 0.5 ? '↗ +0.2' : '↘ -0.1'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SimpleDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Surveys & Feedback</h1>
          <p className="text-gray-600">Create, manage, and analyze employee surveys and feedback</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'surveys', label: 'Surveys' },
            { id: 'responses', label: 'Responses' },
            { id: 'templates', label: 'Templates' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'surveys' && renderSurveys()}
        {activeTab === 'responses' && renderResponses()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'analytics' && renderAnalytics()}

        {/* Survey Detail Modal */}
        {selectedSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedSurvey.title}</h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{getSurveyTypeIcon(selectedSurvey.type)}</span>
                  <div>
                    <h3 className="text-lg font-medium">{selectedSurvey.description}</h3>
                    <p className="text-gray-600">Created by {selectedSurvey.createdBy}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedSurvey.startDate).toLocaleDateString()} - {new Date(selectedSurvey.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Survey Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedSurvey.status)}`}>
                          {selectedSurvey.status.toUpperCase()}
                        </span>
                      </div>
                      <div><span className="font-medium">Target Audience:</span> {selectedSurvey.targetAudience}</div>
                      <div><span className="font-medium">Total Questions:</span> {selectedSurvey.questions.length}</div>
                      <div><span className="font-medium">Type:</span> {selectedSurvey.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Response Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Total Targets:</span> {selectedSurvey.totalTargets}</div>
                      <div><span className="font-medium">Responses Received:</span> {selectedSurvey.responses}</div>
                      <div><span className="font-medium">Response Rate:</span> {selectedSurvey.responseRate}%</div>
                      <div><span className="font-medium">Average Score:</span> 
                        <span className={`ml-1 ${getScoreColor(selectedSurvey.avgScore)}`}>
                          {selectedSurvey.avgScore ? `${selectedSurvey.avgScore}/5` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedSurvey.categories.map((category, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Survey Questions</h4>
                  <div className="space-y-2">
                    {selectedSurvey.questions.map((question, index) => (
                      <div key={question.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">Q{index + 1}:</span> {question.question}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{question.type}</span>
                          {question.required && <span className="text-xs text-red-600">Required</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">View Responses</Button>
                <Button variant="outline" className="flex-1">Analytics</Button>
                <Button variant="outline" className="flex-1">Export Data</Button>
              </div>
            </div>
          </div>
        )}

        {/* Response Detail Modal */}
        {selectedResponse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Survey Response - {selectedResponse.employeeName}</h2>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Response Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Employee:</span> {selectedResponse.employeeName}</div>
                      <div><span className="font-medium">Department:</span> {selectedResponse.department}</div>
                      <div><span className="font-medium">Survey:</span> {selectedResponse.surveyTitle}</div>
                      <div><span className="font-medium">Submitted:</span> {new Date(selectedResponse.submittedDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Completion Time:</span> {selectedResponse.completionTime} minutes</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Overall Score</h4>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(selectedResponse.overallScore)}`}>
                        {selectedResponse.overallScore}/5
                      </div>
                      <div className="text-sm text-gray-600">Overall Rating</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Individual Responses</h4>
                  <div className="space-y-3">
                    {selectedResponse.responses.map((resp, index) => (
                      <div key={resp.questionId} className="border rounded-lg p-3">
                        <div className="font-medium mb-2">Q{index + 1}: {resp.question}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Answer:</span>
                          {resp.type === 'rating' ? (
                            <span className={`font-medium ${getScoreColor(resp.answer)}`}>
                              {resp.answer}/5
                            </span>
                          ) : (
                            <span className="font-medium">{resp.answer}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Follow Up</Button>
                <Button variant="outline" className="flex-1">View Profile</Button>
                <Button variant="outline" className="flex-1">Export</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SimpleDashboardLayout>
  );
};

export default EmployeeSurveysFeedback;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
