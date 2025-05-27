import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const OnboardingManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const onboardingMetrics = [
    { label: 'Active Onboardings', value: '24', icon: '👋', color: 'text-blue-600', trend: 'up' },
    { label: 'Completed This Month', value: '18', icon: '✅', color: 'text-green-600', trend: 'up' },
    { label: 'Average Duration', value: '8.5 days', icon: '📅', color: 'text-purple-600', trend: 'down' },
    { label: 'Completion Rate', value: '94%', icon: '📊', color: 'text-orange-600', trend: 'up' }
  ];

  const newHires = [
    {
      id: 'nh-001',
      employeeId: 'EMP-2024-056',
      name: 'John Smith',
      position: 'Software Engineer',
    department: 'Engineering',
      manager: 'Sarah Johnson',
      startDate: '2024-06-15',
      workflowId: 'wf-001',
      status: 'in_progress',
      completionRate: 75,
      currentStep: 'IT Setup',
      tasksCompleted: 12,
      totalTasks: 16,
      buddy: 'Mike Wilson',
      documents: {
        total: 8,
        completed: 6,
        pending: 2
      }
    },
    {
      id: 'nh-002',
      employeeId: 'EMP-2024-057',
      name: 'Emily Chen',
      position: 'Marketing Coordinator',
      department: 'Marketing',
      manager: 'David Rodriguez',
      startDate: '2024-06-18',
      workflowId: 'wf-002',
      status: 'in_progress',
      completionRate: 45,
      currentStep: 'Department Introduction',
      tasksCompleted: 7,
      totalTasks: 14,
      buddy: 'Lisa Wang',
      documents: {
        total: 6,
        completed: 3,
        pending: 3
      }
    },
    {
      id: 'nh-003',
      employeeId: 'EMP-2024-058',
      name: 'Alex Thompson',
      position: 'Sales Representative',
    department: 'Sales',
      manager: 'Jennifer Lee',
      startDate: '2024-06-10',
      workflowId: 'wf-003',
      status: 'completed',
      completionRate: 100,
      currentStep: 'Completed',
      tasksCompleted: 12,
      totalTasks: 12,
      buddy: 'Tom Brown',
      documents: {
        total: 5,
        completed: 5,
        pending: 0
      }
    },
    {
      id: 'nh-004',
      employeeId: 'EMP-2024-059',
      name: 'Maria Garcia',
      position: 'HR Specialist',
      department: 'Human Resources',
      manager: 'Robert Davis',
      startDate: '2024-06-20',
      workflowId: 'wf-004',
      status: 'pending',
      completionRate: 15,
      currentStep: 'Welcome Package',
      tasksCompleted: 2,
      totalTasks: 13,
      buddy: 'Anna Martinez',
      documents: {
        total: 7,
        completed: 1,
        pending: 6
      }
    }
  ];

  const workflows = [
    {
      id: 'wf-001',
      name: 'Software Engineer Onboarding',
    department: 'Engineering',
      duration: '10 days',
      totalSteps: 8,
      description: 'Comprehensive onboarding for software engineering roles',
      steps: [
        { id: 1, name: 'Welcome Package', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 2, name: 'Document Collection', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 3, name: 'IT Setup', duration: '2 days', responsible: 'IT', mandatory: true },
        { id: 4, name: 'Security Training', duration: '1 day', responsible: 'Security', mandatory: true },
        { id: 5, name: 'Team Introduction', duration: '1 day', responsible: 'Manager', mandatory: true },
        { id: 6, name: 'Technical Orientation', duration: '2 days', responsible: 'Tech Lead', mandatory: true },
        { id: 7, name: 'Code Review Process', duration: '1 day', responsible: 'Senior Dev', mandatory: true },
        { id: 8, name: 'First Project Assignment', duration: '1 day', responsible: 'Manager', mandatory: false }
      ],
      documents: [
        'Employment Contract',
        'Tax Forms',
        'Emergency Contacts',
        'Bank Details',
        'Confidentiality Agreement',
        'Code of Conduct',
        'IT Policies',
        'Development Guidelines'
      ],
      active: true
    },
    {
      id: 'wf-002',
      name: 'Marketing Team Onboarding',
      department: 'Marketing',
      duration: '8 days',
      totalSteps: 7,
      description: 'Onboarding process for marketing team members',
      steps: [
        { id: 1, name: 'Welcome Package', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 2, name: 'Document Collection', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 3, name: 'IT Setup', duration: '1 day', responsible: 'IT', mandatory: true },
        { id: 4, name: 'Brand Guidelines Training', duration: '1 day', responsible: 'Brand Manager', mandatory: true },
        { id: 5, name: 'Marketing Tools Training', duration: '2 days', responsible: 'Marketing Lead', mandatory: true },
        { id: 6, name: 'Campaign Overview', duration: '1 day', responsible: 'Campaign Manager', mandatory: true },
        { id: 7, name: 'First Campaign Assignment', duration: '1 day', responsible: 'Manager', mandatory: false }
      ],
      documents: [
        'Employment Contract',
        'Tax Forms',
        'Emergency Contacts',
        'Bank Details',
        'Brand Guidelines',
        'Marketing Policies'
      ],
      active: true
    },
    {
      id: 'wf-003',
      name: 'Sales Representative Onboarding',
    department: 'Sales',
      duration: '7 days',
      totalSteps: 6,
      description: 'Onboarding workflow for sales team members',
      steps: [
        { id: 1, name: 'Welcome Package', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 2, name: 'Document Collection', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 3, name: 'CRM Training', duration: '2 days', responsible: 'Sales Ops', mandatory: true },
        { id: 4, name: 'Product Training', duration: '2 days', responsible: 'Product Team', mandatory: true },
        { id: 5, name: 'Sales Process Training', duration: '1 day', responsible: 'Sales Manager', mandatory: true },
        { id: 6, name: 'Territory Assignment', duration: '1 day', responsible: 'Sales Director', mandatory: false }
      ],
      documents: [
        'Employment Contract',
        'Tax Forms',
        'Emergency Contacts',
        'Bank Details',
        'Sales Policies',
        'Commission Structure'
      ],
      active: true
    }
  ];

  const onboardingTasks = [
    {
      id: 'task-001',
      employeeId: 'nh-001',
      workflowId: 'wf-001',
      stepId: 3,
      title: 'Set up development environment',
      description: 'Install necessary software and configure development tools',
      assignedTo: 'IT Department',
      assignedBy: 'System',
      dueDate: '2024-06-17',
    status: 'in_progress',
      priority: 'high',
      estimatedTime: '4 hours',
      instructions: 'Follow the development setup guide in the knowledge base',
      dependencies: ['Hardware delivery', 'Account creation'],
      completedAt: null
    },
    {
      id: 'task-002',
      employeeId: 'nh-001',
      workflowId: 'wf-001',
      stepId: 4,
      title: 'Complete security training',
      description: 'Watch security awareness videos and pass the quiz',
      assignedTo: 'John Smith',
      assignedBy: 'Security Team',
      dueDate: '2024-06-18',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '2 hours',
      instructions: 'Access the training portal and complete all modules',
      dependencies: ['IT Setup'],
      completedAt: null
    },
    {
      id: 'task-003',
      employeeId: 'nh-002',
      workflowId: 'wf-002',
      stepId: 2,
      title: 'Submit required documents',
      description: 'Upload identification and tax documents',
      assignedTo: 'Emily Chen',
      assignedBy: 'HR Department',
      dueDate: '2024-06-19',
      status: 'overdue',
      priority: 'high',
      estimatedTime: '30 minutes',
      instructions: 'Use the employee portal to upload documents',
      dependencies: [],
      completedAt: null
    }
  ];

  const buddySystem = [
    {
      id: 'buddy-001',
      newHireId: 'nh-001',
      newHireName: 'John Smith',
      buddyId: 'emp-015',
      buddyName: 'Mike Wilson',
      buddyDepartment: 'Engineering',
      assignedDate: '2024-06-15',
      status: 'active',
      meetingsScheduled: 3,
      meetingsCompleted: 2,
      nextMeeting: '2024-06-20',
      feedback: 'Great progress, very engaged and asking good questions'
    },
    {
      id: 'buddy-002',
      newHireId: 'nh-002',
      newHireName: 'Emily Chen',
      buddyId: 'emp-023',
      buddyName: 'Lisa Wang',
      buddyDepartment: 'Marketing',
      assignedDate: '2024-06-18',
      status: 'active',
      meetingsScheduled: 2,
      meetingsCompleted: 1,
      nextMeeting: '2024-06-21',
      feedback: 'Adapting well to the team culture'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Onboarding Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {onboardingMetrics.map((metric, index) => (
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
                <div className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend === 'up' ? '↗' : '↘'}
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
              <span className="text-2xl mb-1">👤</span>
              <span className="text-sm">Add New Hire</span>
                </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📋</span>
              <span className="text-sm">Create Workflow</span>
                </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">👥</span>
              <span className="text-sm">Assign Buddy</span>
                </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">View Reports</span>
                </Button>
          </div>
        </CardContent>
          </Card>

      {/* Recent New Hires */}
      <Card>
            <CardHeader>
          <CardTitle>Recent New Hires</CardTitle>
            </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newHires.filter(h => h.status !== 'completed').slice(0, 3).map((hire) => (
              <div key={hire.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{hire.name}</h3>
                      <p className="text-sm text-gray-600">{hire.position} • {hire.department}</p>
                      <p className="text-xs text-gray-500">Started: {new Date(hire.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(hire.status)}`}>
                    {hire.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Current Step: {hire.currentStep}</span>
                    <span className="text-sm font-medium">{hire.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${hire.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Tasks: {hire.tasksCompleted}/{hire.totalTasks}</span>
                  <span>Documents: {hire.documents.completed}/{hire.documents.total}</span>
                  <span>Buddy: {hire.buddy}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
          </Card>

      {/* Onboarding Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{workflow.name}</div>
                    <div className="text-sm text-gray-600">{workflow.department} • {workflow.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {Math.floor(Math.random() * 30 + 70)}%
                    </div>
                    <div className="text-xs text-gray-600">completion rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onboardingTasks.filter(t => t.status !== 'completed').slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-gray-600">
                      {newHires.find(h => h.id === task.employeeId)?.name} • Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNewHires = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">New Hires</h2>
        <Button>Add New Hire</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newHires.map((hire) => (
          <Card key={hire.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{hire.name}</h3>
                    <p className="text-sm text-gray-600">{hire.employeeId}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(hire.status)}`}>
                  {hire.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span>Position:</span>
                  <span className="font-medium">{hire.position}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Department:</span>
                  <span className="font-medium">{hire.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Manager:</span>
                  <span className="font-medium">{hire.manager}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Start Date:</span>
                  <span className="font-medium">{new Date(hire.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Buddy:</span>
                  <span className="font-medium">{hire.buddy}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">{hire.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${hire.completionRate}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">Current: {hire.currentStep}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{hire.tasksCompleted}</div>
                  <div className="text-gray-600">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{hire.documents.completed}</div>
                  <div className="text-gray-600">Docs Signed</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedEmployee(hire)}
                >
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Onboarding Workflows</h2>
        <Button>Create New Workflow</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{workflow.name}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{workflow.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Department:</span>
                  <span className="font-medium">{workflow.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{workflow.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Steps:</span>
                  <span className="font-medium">{workflow.totalSteps}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Documents:</span>
                  <span className="font-medium">{workflow.documents.length}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Workflow Steps:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {workflow.steps.slice(0, 4).map((step) => (
                    <div key={step.id} className="flex items-center text-sm">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2">
                        {step.id}
                      </span>
                      <span className="flex-1">{step.name}</span>
                      <span className="text-gray-500">({step.duration})</span>
                    </div>
                  ))}
                  {workflow.steps.length > 4 && (
                    <div className="text-xs text-blue-600 cursor-pointer">
                      +{workflow.steps.length - 4} more steps...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                                        size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                                          View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                                          Edit Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Onboarding Tasks</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Overdue</option>
          </select>
          <Button>Create Task</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Task</th>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Assigned To</th>
                  <th className="text-left p-4">Due Date</th>
                  <th className="text-left p-4">Priority</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {onboardingTasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600">{task.description}</div>
                      <div className="text-xs text-gray-500">Est. time: {task.estimatedTime}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {newHires.find(h => h.id === task.employeeId)?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {newHires.find(h => h.id === task.employeeId)?.department}
                      </div>
                    </td>
                    <td className="p-4">{task.assignedTo}</td>
                    <td className="p-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
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

  const renderBuddySystem = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Buddy System</h2>
        <Button>Assign New Buddy</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buddySystem.map((buddy) => (
          <Card key={buddy.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{buddy.newHireName}</h3>
                    <p className="text-sm text-gray-600">New Hire</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(buddy.status)}`}>
                  {buddy.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">🤝</span>
                </div>
                <div>
                  <h3 className="font-medium">{buddy.buddyName}</h3>
                  <p className="text-sm text-gray-600">Buddy • {buddy.buddyDepartment}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Assigned Date:</span>
                  <span className="font-medium">{new Date(buddy.assignedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Meetings:</span>
                  <span className="font-medium">{buddy.meetingsCompleted}/{buddy.meetingsScheduled}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Meeting:</span>
                  <span className="font-medium">{new Date(buddy.nextMeeting).toLocaleDateString()}</span>
                </div>
              </div>

              {buddy.feedback && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Recent Feedback:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{buddy.feedback}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">Schedule Meeting</Button>
                <Button size="sm" variant="outline" className="flex-1">Add Feedback</Button>
              </div>
            </CardContent>
                        </Card>
                      ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Onboarding Management</h1>
          <p className="text-gray-600">Streamline new employee onboarding with workflows and tracking</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'newhires', label: 'New Hires' },
            { id: 'workflows', label: 'Workflows' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'buddy', label: 'Buddy System' }
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
        {activeTab === 'newhires' && renderNewHires()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'buddy' && renderBuddySystem()}

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Employee Information</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Employee ID:</span> {selectedEmployee.employeeId}</div>
                      <div><span className="font-medium">Position:</span> {selectedEmployee.position}</div>
                      <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                      <div><span className="font-medium">Manager:</span> {selectedEmployee.manager}</div>
                      <div><span className="font-medium">Start Date:</span> {new Date(selectedEmployee.startDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Buddy:</span> {selectedEmployee.buddy}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Progress Overview</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedEmployee.status)}`}>
                          {selectedEmployee.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div><span className="font-medium">Completion:</span> {selectedEmployee.completionRate}%</div>
                      <div><span className="font-medium">Current Step:</span> {selectedEmployee.currentStep}</div>
                      <div><span className="font-medium">Tasks:</span> {selectedEmployee.tasksCompleted}/{selectedEmployee.totalTasks}</div>
                      <div><span className="font-medium">Documents:</span> {selectedEmployee.documents.completed}/{selectedEmployee.documents.total}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Progress Timeline</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-white text-xs font-medium" 
                      style={{ width: `${selectedEmployee.completionRate}%` }}
                    >
                      {selectedEmployee.completionRate}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Document Status</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{selectedEmployee.documents.total}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{selectedEmployee.documents.completed}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{selectedEmployee.documents.pending}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Update Progress</Button>
                <Button variant="outline" className="flex-1">Send Reminder</Button>
                <Button variant="outline" className="flex-1">View Tasks</Button>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Detail Modal */}
        {selectedWorkflow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedWorkflow.name}</h2>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedWorkflow.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Workflow Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Department:</span> {selectedWorkflow.department}</div>
                      <div><span className="font-medium">Duration:</span> {selectedWorkflow.duration}</div>
                      <div><span className="font-medium">Total Steps:</span> {selectedWorkflow.totalSteps}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          selectedWorkflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedWorkflow.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Required Documents</h4>
                    <div className="max-h-24 overflow-y-auto">
                      {selectedWorkflow.documents.map((doc, index) => (
                        <div key={index} className="text-xs text-gray-600 mb-1">• {doc}</div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Workflow Steps</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedWorkflow.steps.map((step) => (
                      <div key={step.id} className="flex items-center p-2 border rounded">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-3">
                          {step.id}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{step.name}</div>
                          <div className="text-xs text-gray-600">
                            {step.responsible} • {step.duration} • {step.mandatory ? 'Mandatory' : 'Optional'}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          step.mandatory ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {step.mandatory ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Edit Workflow</Button>
                <Button variant="outline" className="flex-1">Clone Workflow</Button>
                <Button variant="outline" className="flex-1">View Analytics</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      </DashboardLayout>
  );
};

export default OnboardingManagement; 
