import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ExitManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const exitMetrics = [
    { label: 'Active Exits', value: '12', icon: '🚪', color: 'text-blue-600', trend: 'up' },
    { label: 'Completed This Month', value: '8', icon: '✅', color: 'text-green-600', trend: 'down' },
    { label: 'Avg Process Time', value: '7 days', icon: '⏱️', color: 'text-purple-600', trend: 'down' },
    { label: 'Exit Satisfaction', value: '4.2/5', icon: '⭐', color: 'text-orange-600', trend: 'up' }
  ];

  const exitingEmployees = [
    {
      id: 'exit-001',
      employeeId: 'EMP-2024-023',
      name: 'Robert Johnson',
      position: 'Senior Developer',
      department: 'Engineering',
      manager: 'Sarah Wilson',
      resignationDate: '2024-06-10',
      lastWorkingDay: '2024-06-24',
      reason: 'Better Opportunity',
      workflowId: 'exit-wf-001',
      status: 'in_progress',
      completionRate: 65,
      currentStep: 'Knowledge Transfer',
      tasksCompleted: 8,
      totalTasks: 12,
      exitInterviewCompleted: false,
      assetsReturned: {
        laptop: false,
        badge: false,
        keys: true,
        documents: false
      },
      accessRevoked: {
        email: false,
        systems: false,
        building: false
      },
      handoverStatus: 'partial',
      finalSettlement: {
        calculated: true,
        approved: false,
        paid: false,
        amount: 8500
      }
    },
    {
      id: 'exit-002',
      employeeId: 'EMP-2024-019',
      name: 'Michelle Davis',
      position: 'Marketing Manager',
      department: 'Marketing',
      manager: 'David Lee',
      resignationDate: '2024-06-05',
      lastWorkingDay: '2024-06-19',
      reason: 'Relocation',
      workflowId: 'exit-wf-002',
      status: 'completed',
      completionRate: 100,
      currentStep: 'Completed',
      tasksCompleted: 10,
      totalTasks: 10,
      exitInterviewCompleted: true,
      assetsReturned: {
        laptop: true,
        badge: true,
        keys: true,
        documents: true
      },
      accessRevoked: {
        email: true,
        systems: true,
        building: true
      },
      handoverStatus: 'complete',
      finalSettlement: {
        calculated: true,
        approved: true,
        paid: true,
        amount: 12300
      }
    },
    {
      id: 'exit-003',
      employeeId: 'EMP-2024-015',
      name: 'James Rodriguez',
      position: 'Sales Representative',
      department: 'Sales',
      manager: 'Lisa Thompson',
      resignationDate: '2024-06-15',
      lastWorkingDay: '2024-06-29',
      reason: 'Career Change',
      workflowId: 'exit-wf-003',
      status: 'pending',
      completionRate: 25,
      currentStep: 'Documentation Review',
      tasksCompleted: 3,
      totalTasks: 11,
      exitInterviewCompleted: false,
      assetsReturned: {
        laptop: false,
        badge: false,
        keys: false,
        documents: false
      },
      accessRevoked: {
        email: false,
        systems: false,
        building: false
      },
      handoverStatus: 'not_started',
      finalSettlement: {
        calculated: false,
        approved: false,
        paid: false,
        amount: 0
      }
    },
    {
      id: 'exit-004',
      employeeId: 'EMP-2024-008',
      name: 'Amanda Wilson',
      position: 'HR Specialist',
      department: 'Human Resources',
      manager: 'Robert Chen',
      resignationDate: '2024-06-01',
      lastWorkingDay: '2024-06-15',
      reason: 'Personal Reasons',
      workflowId: 'exit-wf-002',
      status: 'completed',
      completionRate: 100,
      currentStep: 'Completed',
      tasksCompleted: 10,
      totalTasks: 10,
      exitInterviewCompleted: true,
      assetsReturned: {
        laptop: true,
        badge: true,
        keys: true,
        documents: true
      },
      accessRevoked: {
        email: true,
        systems: true,
        building: true
      },
      handoverStatus: 'complete',
      finalSettlement: {
        calculated: true,
        approved: true,
        paid: true,
        amount: 9800
      }
    }
  ];

  const exitWorkflows = [
    {
      id: 'exit-wf-001',
      name: 'Senior Staff Exit Process',
      department: 'Engineering',
      duration: '14 days',
      totalSteps: 12,
      description: 'Comprehensive exit process for senior technical staff',
      steps: [
        { id: 1, name: 'Resignation Acknowledgment', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 2, name: 'Exit Interview Scheduling', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 3, name: 'Access Review', duration: '1 day', responsible: 'IT Security', mandatory: true },
        { id: 4, name: 'Project Handover Planning', duration: '3 days', responsible: 'Manager', mandatory: true },
        { id: 5, name: 'Knowledge Transfer Sessions', duration: '5 days', responsible: 'Employee', mandatory: true },
        { id: 6, name: 'Asset Inventory', duration: '1 day', responsible: 'IT/Facilities', mandatory: true },
        { id: 7, name: 'Documentation Handover', duration: '2 days', responsible: 'Employee', mandatory: true },
        { id: 8, name: 'Client/Stakeholder Notification', duration: '1 day', responsible: 'Manager', mandatory: false },
        { id: 9, name: 'Final Settlement Calculation', duration: '2 days', responsible: 'Payroll', mandatory: true },
        { id: 10, name: 'Exit Interview', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 11, name: 'Asset Return & Access Revocation', duration: '1 day', responsible: 'IT/Security', mandatory: true },
        { id: 12, name: 'Final Documentation', duration: '1 day', responsible: 'HR', mandatory: true }
      ],
      active: true
    },
    {
      id: 'exit-wf-002',
      name: 'Standard Exit Process',
      department: 'All',
      duration: '10 days',
      totalSteps: 10,
      description: 'Standard exit process for regular employees',
      steps: [
        { id: 1, name: 'Resignation Acknowledgment', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 2, name: 'Exit Interview Scheduling', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 3, name: 'Handover Planning', duration: '2 days', responsible: 'Manager', mandatory: true },
        { id: 4, name: 'Knowledge Transfer', duration: '3 days', responsible: 'Employee', mandatory: true },
        { id: 5, name: 'Asset Collection', duration: '1 day', responsible: 'IT/Facilities', mandatory: true },
        { id: 6, name: 'Final Settlement', duration: '1 day', responsible: 'Payroll', mandatory: true },
        { id: 7, name: 'Exit Interview', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 8, name: 'Access Revocation', duration: '1 day', responsible: 'IT', mandatory: true },
        { id: 9, name: 'Documentation', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 10, name: 'Final Clearance', duration: '1 day', responsible: 'HR', mandatory: true }
      ],
      active: true
    },
    {
      id: 'exit-wf-003',
      name: 'Sales Exit Process',
      department: 'Sales',
      duration: '12 days',
      totalSteps: 11,
      description: 'Specialized exit process for sales team members',
      steps: [
        { id: 1, name: 'Resignation Acknowledgment', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 2, name: 'Client Portfolio Review', duration: '2 days', responsible: 'Sales Manager', mandatory: true },
        { id: 3, name: 'Commission Calculation', duration: '2 days', responsible: 'Finance', mandatory: true },
        { id: 4, name: 'Territory Handover', duration: '3 days', responsible: 'Sales Manager', mandatory: true },
        { id: 5, name: 'Client Relationship Transfer', duration: '2 days', responsible: 'Employee', mandatory: true },
        { id: 6, name: 'CRM Data Verification', duration: '1 day', responsible: 'Sales Ops', mandatory: true },
        { id: 7, name: 'Asset Return', duration: '1 day', responsible: 'IT', mandatory: true },
        { id: 8, name: 'Exit Interview', duration: '1 day', responsible: 'HR', mandatory: true },
        { id: 9, name: 'Final Settlement', duration: '1 day', responsible: 'Finance', mandatory: true },
        { id: 10, name: 'Access Revocation', duration: '1 day', responsible: 'IT', mandatory: true },
        { id: 11, name: 'Final Documentation', duration: '1 day', responsible: 'HR', mandatory: true }
      ],
      active: true
    }
  ];

  const exitInterviews = [
    {
      id: 'interview-001',
      employeeId: 'exit-002',
      employeeName: 'Michelle Davis',
      interviewer: 'HR Director',
      scheduledDate: '2024-06-18',
      status: 'completed',
      duration: '45 minutes',
      ratings: {
        jobSatisfaction: 4,
        management: 5,
        workEnvironment: 4,
        compensation: 3,
        careerDevelopment: 4,
        workLifeBalance: 5
      },
      feedback: {
        positive: [
          'Great team collaboration',
          'Flexible work arrangements',
          'Supportive management',
          'Good learning opportunities'
        ],
        improvements: [
          'Better career progression paths',
          'More competitive compensation',
          'Clearer role expectations'
        ]
      },
      wouldRecommend: true,
      wouldRehire: true,
      overallRating: 4.2
    },
    {
      id: 'interview-002',
      employeeId: 'exit-004',
      employeeName: 'Amanda Wilson',
      interviewer: 'HR Manager',
      scheduledDate: '2024-06-14',
      status: 'completed',
      duration: '50 minutes',
      ratings: {
        jobSatisfaction: 5,
        management: 4,
        workEnvironment: 5,
        compensation: 4,
        careerDevelopment: 3,
        workLifeBalance: 4
      },
      feedback: {
        positive: [
          'Excellent work culture',
          'Supportive colleagues',
          'Good benefits package',
          'Professional development opportunities'
        ],
        improvements: [
          'More advancement opportunities',
          'Better project allocation',
          'Improved communication tools'
        ]
      },
      wouldRecommend: true,
      wouldRehire: true,
      overallRating: 4.2
    },
    {
      id: 'interview-003',
      employeeId: 'exit-001',
      employeeName: 'Robert Johnson',
      interviewer: 'HR Director',
      scheduledDate: '2024-06-23',
      status: 'scheduled',
      duration: '60 minutes',
      ratings: null,
      feedback: null,
      wouldRecommend: null,
      wouldRehire: null,
      overallRating: null
    }
  ];

  const assetTracking = [
    {
      id: 'asset-001',
      employeeId: 'exit-001',
      employeeName: 'Robert Johnson',
      assets: [
        { type: 'Laptop', model: 'MacBook Pro 16"', serialNumber: 'MB123456', status: 'pending', condition: null },
        { type: 'Monitor', model: 'Dell 27" 4K', serialNumber: 'DL789012', status: 'pending', condition: null },
        { type: 'Badge', model: 'Access Card', serialNumber: 'AC001234', status: 'pending', condition: null },
        { type: 'Phone', model: 'iPhone 13', serialNumber: 'IP567890', status: 'pending', condition: null },
        { type: 'Keys', model: 'Office Keys', serialNumber: 'KEY-001', status: 'returned', condition: 'good' }
      ],
      totalAssets: 5,
      returnedAssets: 1,
      pendingAssets: 4
    },
    {
      id: 'asset-002',
      employeeId: 'exit-002',
      employeeName: 'Michelle Davis',
      assets: [
        { type: 'Laptop', model: 'MacBook Air 13"', serialNumber: 'MA234567', status: 'returned', condition: 'excellent' },
        { type: 'Badge', model: 'Access Card', serialNumber: 'AC002345', status: 'returned', condition: 'good' },
        { type: 'Keys', model: 'Office Keys', serialNumber: 'KEY-002', status: 'returned', condition: 'good' },
        { type: 'Headset', model: 'Bose QC45', serialNumber: 'BQ345678', status: 'returned', condition: 'good' }
      ],
      totalAssets: 4,
      returnedAssets: 4,
      pendingAssets: 0
    }
  ];

  const knowledgeTransfer = [
    {
      id: 'kt-001',
      employeeId: 'exit-001',
      employeeName: 'Robert Johnson',
      transferTo: 'Sarah Kim',
      areas: [
        { topic: 'Project Alpha - Backend Architecture', status: 'in_progress', priority: 'high', hours: 8 },
        { topic: 'Database Optimization Scripts', status: 'completed', priority: 'medium', hours: 4 },
        { topic: 'API Documentation', status: 'pending', priority: 'high', hours: 6 },
        { topic: 'Client Integration Process', status: 'in_progress', priority: 'medium', hours: 5 }
      ],
      totalHours: 23,
      completedHours: 4,
      progress: 17,
      startDate: '2024-06-16',
      targetDate: '2024-06-22'
    },
    {
      id: 'kt-002',
      employeeId: 'exit-002',
      employeeName: 'Michelle Davis',
      transferTo: 'Tom Wilson',
      areas: [
        { topic: 'Campaign Strategy Framework', status: 'completed', priority: 'high', hours: 6 },
        { topic: 'Client Relationship Management', status: 'completed', priority: 'high', hours: 8 },
        { topic: 'Marketing Automation Setup', status: 'completed', priority: 'medium', hours: 4 },
        { topic: 'Budget Planning Process', status: 'completed', priority: 'low', hours: 3 }
      ],
      totalHours: 21,
      completedHours: 21,
      progress: 100,
      startDate: '2024-06-08',
      targetDate: '2024-06-15'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'returned': return 'bg-green-100 text-green-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
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
      {/* Exit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {exitMetrics.map((metric, index) => (
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
              <span className="text-sm">Add Exit Request</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📋</span>
              <span className="text-sm">Schedule Interview</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">💼</span>
              <span className="text-sm">Track Assets</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">Exit Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Exits */}
      <Card>
        <CardHeader>
          <CardTitle>Active Exit Processes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exitingEmployees.filter(e => e.status !== 'completed').map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                      <p className="text-xs text-gray-500">
                        Last Day: {new Date(employee.lastWorkingDay).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(employee.status)}`}>
                    {employee.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Current Step: {employee.currentStep}</span>
                    <span className="text-sm font-medium">{employee.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${employee.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tasks: </span>
                    <span className="font-medium">{employee.tasksCompleted}/{employee.totalTasks}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assets: </span>
                    <span className={`font-medium ${Object.values(employee.assetsReturned).every(v => v) ? 'text-green-600' : 'text-orange-600'}`}>
                      {Object.values(employee.assetsReturned).every(v => v) ? 'Returned' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Access: </span>
                    <span className={`font-medium ${Object.values(employee.accessRevoked).every(v => v) ? 'text-green-600' : 'text-red-600'}`}>
                      {Object.values(employee.accessRevoked).every(v => v) ? 'Revoked' : 'Active'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Settlement: </span>
                    <span className={`font-medium ${employee.finalSettlement.paid ? 'text-green-600' : 'text-orange-600'}`}>
                      {employee.finalSettlement.paid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Exit Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exitInterviews.filter(i => i.status === 'scheduled').map((interview) => (
                <div key={interview.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{interview.employeeName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(interview.scheduledDate).toLocaleDateString()} • {interview.duration}
                    </div>
                    <div className="text-xs text-gray-500">Interviewer: {interview.interviewer}</div>
                  </div>
                  <Button size="sm" variant="outline">Conduct</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Return Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assetTracking.filter(a => a.pendingAssets > 0).map((tracking) => (
                <div key={tracking.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{tracking.employeeName}</div>
                    <div className="text-sm text-gray-600">
                      {tracking.returnedAssets}/{tracking.totalAssets} assets returned
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${tracking.pendingAssets > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {tracking.pendingAssets} pending
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

  const renderExitingEmployees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Exiting Employees</h2>
        <Button>Add Exit Request</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exitingEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.employeeId}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(employee.status)}`}>
                  {employee.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span>Position:</span>
                  <span className="font-medium">{employee.position}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Department:</span>
                  <span className="font-medium">{employee.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Manager:</span>
                  <span className="font-medium">{employee.manager}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Resignation Date:</span>
                  <span className="font-medium">{new Date(employee.resignationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Working Day:</span>
                  <span className="font-medium">{new Date(employee.lastWorkingDay).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Reason:</span>
                  <span className="font-medium">{employee.reason}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">{employee.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${employee.completionRate}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">Current: {employee.currentStep}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{employee.tasksCompleted}</div>
                  <div className="text-gray-600">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${employee.finalSettlement.calculated ? 'text-green-600' : 'text-orange-600'}`}>
                    ${employee.finalSettlement.amount.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Settlement</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Update Status
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
        <h2 className="text-lg font-semibold">Exit Workflows</h2>
        <Button>Create New Workflow</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exitWorkflows.map((workflow) => (
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
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Process Steps:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {workflow.steps.slice(0, 5).map((step) => (
                    <div key={step.id} className="flex items-center text-sm">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2">
                        {step.id}
                      </span>
                      <span className="flex-1">{step.name}</span>
                      <span className="text-gray-500">({step.duration})</span>
                    </div>
                  ))}
                  {workflow.steps.length > 5 && (
                    <div className="text-xs text-blue-600 cursor-pointer">
                      +{workflow.steps.length - 5} more steps...
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

  const renderInterviews = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Exit Interviews</h2>
        <Button>Schedule Interview</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Interviewer</th>
                  <th className="text-left p-4">Scheduled Date</th>
                  <th className="text-left p-4">Duration</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exitInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{interview.employeeName}</div>
                    </td>
                    <td className="p-4">{interview.interviewer}</td>
                    <td className="p-4">{new Date(interview.scheduledDate).toLocaleDateString()}</td>
                    <td className="p-4">{interview.duration}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(interview.status)}`}>
                        {interview.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      {interview.overallRating ? (
                        <div className="flex items-center">
                          <span className="font-medium">{interview.overallRating}</span>
                          <span className="text-yellow-500 ml-1">⭐</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        {interview.status === 'scheduled' && (
                          <Button size="sm">Conduct</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interview Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exit Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Better Opportunity', 'Relocation', 'Career Change', 'Personal Reasons', 'Compensation'].map((reason, index) => (
                <div key={reason} className="flex justify-between items-center">
                  <span className="text-sm">{reason}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{Math.floor(Math.random() * 50) + 10}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: 'Job Satisfaction', rating: 4.1 },
                { category: 'Management', rating: 4.5 },
                { category: 'Work Environment', rating: 4.4 },
                { category: 'Compensation', rating: 3.5 },
                { category: 'Career Development', rating: 3.8 },
                { category: 'Work-Life Balance', rating: 4.6 }
              ].map((item) => (
                <div key={item.category} className="flex justify-between items-center">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">{item.rating}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star}
                          className={`text-sm ${star <= item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ⭐
                        </span>
                      ))}
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

  const renderAssets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Asset Tracking</h2>
        <Button>Add Asset</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assetTracking.map((tracking) => (
          <Card key={tracking.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{tracking.employeeName}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {tracking.returnedAssets}/{tracking.totalAssets} returned
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tracking.pendingAssets === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {tracking.pendingAssets === 0 ? 'COMPLETE' : `${tracking.pendingAssets} PENDING`}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3">Asset Type</th>
                      <th className="text-left p-3">Model</th>
                      <th className="text-left p-3">Serial Number</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Condition</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracking.assets.map((asset, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{asset.type}</td>
                        <td className="p-3">{asset.model}</td>
                        <td className="p-3 font-mono text-sm">{asset.serialNumber}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(asset.status)}`}>
                            {asset.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          {asset.condition ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              asset.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                              asset.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {asset.condition.toUpperCase()}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-3">
                          {asset.status === 'pending' ? (
                            <Button size="sm" variant="outline">Mark Returned</Button>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderKnowledgeTransfer = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Knowledge Transfer</h2>
        <Button>Schedule Session</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {knowledgeTransfer.map((transfer) => (
          <Card key={transfer.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{transfer.employeeName}</CardTitle>
                  <p className="text-sm text-gray-600">Transferring to: {transfer.transferTo}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{transfer.progress}%</div>
                  <div className="text-xs text-gray-600">
                    {transfer.completedHours}/{transfer.totalHours} hours
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{transfer.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${transfer.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Started: {new Date(transfer.startDate).toLocaleDateString()}</span>
                  <span>Target: {new Date(transfer.targetDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Transfer Areas</h4>
                {transfer.areas.map((area, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium">{area.topic}</h5>
                        <div className="text-sm text-gray-600">{area.hours} hours allocated</div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(area.priority)}`}>
                          {area.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(area.status)}`}>
                          {area.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">Update Progress</Button>
                <Button size="sm" variant="outline" className="flex-1">Schedule Session</Button>
                <Button size="sm" variant="outline" className="flex-1">View Details</Button>
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
          <h1 className="text-2xl font-bold text-gray-800">Exit Management</h1>
          <p className="text-gray-600">Manage employee exits, asset returns, and knowledge transfer</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'employees', label: 'Exiting Employees' },
            { id: 'workflows', label: 'Workflows' },
            { id: 'interviews', label: 'Exit Interviews' },
            { id: 'assets', label: 'Asset Tracking' },
            { id: 'knowledge', label: 'Knowledge Transfer' }
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
        {activeTab === 'employees' && renderExitingEmployees()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'interviews' && renderInterviews()}
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'knowledge' && renderKnowledgeTransfer()}

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Employee Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Employee ID:</span> {selectedEmployee.employeeId}</div>
                      <div><span className="font-medium">Position:</span> {selectedEmployee.position}</div>
                      <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                      <div><span className="font-medium">Manager:</span> {selectedEmployee.manager}</div>
                      <div><span className="font-medium">Resignation Date:</span> {new Date(selectedEmployee.resignationDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Last Working Day:</span> {new Date(selectedEmployee.lastWorkingDay).toLocaleDateString()}</div>
                      <div><span className="font-medium">Reason:</span> {selectedEmployee.reason}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Progress Status</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedEmployee.status)}`}>
                          {selectedEmployee.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div><span className="font-medium">Completion:</span> {selectedEmployee.completionRate}%</div>
                      <div><span className="font-medium">Current Step:</span> {selectedEmployee.currentStep}</div>
                      <div><span className="font-medium">Tasks:</span> {selectedEmployee.tasksCompleted}/{selectedEmployee.totalTasks}</div>
                      <div><span className="font-medium">Exit Interview:</span> {selectedEmployee.exitInterviewCompleted ? 'Completed' : 'Pending'}</div>
                      <div><span className="font-medium">Handover:</span> 
                        <span className={`ml-1 capitalize ${
                          selectedEmployee.handoverStatus === 'complete' ? 'text-green-600' :
                          selectedEmployee.handoverStatus === 'partial' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selectedEmployee.handoverStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Settlement Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Amount:</span> ${selectedEmployee.finalSettlement.amount.toLocaleString()}</div>
                      <div><span className="font-medium">Calculated:</span> {selectedEmployee.finalSettlement.calculated ? 'Yes' : 'No'}</div>
                      <div><span className="font-medium">Approved:</span> {selectedEmployee.finalSettlement.approved ? 'Yes' : 'Pending'}</div>
                      <div><span className="font-medium">Paid:</span> {selectedEmployee.finalSettlement.paid ? 'Yes' : 'Pending'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Asset Return Status</h4>
                    <div className="space-y-1">
                      {Object.entries(selectedEmployee.assetsReturned).map(([asset, returned]) => (
                        <div key={asset} className="flex justify-between items-center text-sm">
                          <span className="capitalize">{asset}:</span>
                          <span className={`font-medium ${returned ? 'text-green-600' : 'text-red-600'}`}>
                            {returned ? 'Returned' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Access Revocation</h4>
                    <div className="space-y-1">
                      {Object.entries(selectedEmployee.accessRevoked).map(([access, revoked]) => (
                        <div key={access} className="flex justify-between items-center text-sm">
                          <span className="capitalize">{access}:</span>
                          <span className={`font-medium ${revoked ? 'text-green-600' : 'text-red-600'}`}>
                            {revoked ? 'Revoked' : 'Active'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Update Progress</Button>
                <Button variant="outline" className="flex-1">Schedule Interview</Button>
                <Button variant="outline" className="flex-1">Track Assets</Button>
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
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Process Steps</h4>
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
                <Button variant="outline" className="flex-1">View Usage</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExitManagement; 
