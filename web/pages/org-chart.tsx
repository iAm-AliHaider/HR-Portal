import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const OrgChartDirectory = () => {
  const [activeTab, setActiveTab] = useState('org-chart');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const organizationMetrics = [
    { label: 'Total Employees', value: '247', icon: '👥', color: 'text-blue-600', trend: 'up' },
    { label: 'Departments', value: '12', icon: '🏢', color: 'text-green-600', trend: 'stable' },
    { label: 'Managers', value: '28', icon: '👔', color: 'text-purple-600', trend: 'up' },
    { label: 'Remote Workers', value: '89', icon: '🏠', color: 'text-orange-600', trend: 'up' }
  ];

  const organizationStructure = [
    {
      id: 'ceo-001',
      name: 'John Smith',
      position: 'Chief Executive Officer',
      department: 'Executive',
      level: 1,
      parentId: null,
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      hireDate: '2018-01-15',
      employeeCount: 247,
      reports: ['cto-001', 'cfo-001', 'coo-001', 'chro-001'],
      avatar: null,
      status: 'active'
    },
    {
      id: 'cto-001',
      name: 'Sarah Johnson',
      position: 'Chief Technology Officer',
      department: 'Technology',
      level: 2,
      parentId: 'ceo-001',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      hireDate: '2019-03-10',
      employeeCount: 85,
      reports: ['eng-dir-001', 'prod-dir-001', 'qa-dir-001'],
      avatar: null,
      status: 'active'
    },
    {
      id: 'cfo-001',
      name: 'Michael Chen',
      position: 'Chief Financial Officer',
      department: 'Finance',
      level: 2,
      parentId: 'ceo-001',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 345-6789',
      location: 'New York, NY',
      hireDate: '2019-06-20',
      employeeCount: 25,
      reports: ['acc-mgr-001', 'fin-mgr-001'],
      avatar: null,
      status: 'active'
    },
    {
      id: 'coo-001',
      name: 'Emily Rodriguez',
      position: 'Chief Operating Officer',
      department: 'Operations',
      level: 2,
      parentId: 'ceo-001',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      hireDate: '2020-01-08',
      employeeCount: 95,
      reports: ['sales-dir-001', 'mkt-dir-001', 'ops-dir-001'],
      avatar: null,
      status: 'active'
    },
    {
      id: 'chro-001',
      name: 'David Wilson',
      position: 'Chief Human Resources Officer',
      department: 'Human Resources',
      level: 2,
      parentId: 'ceo-001',
      email: 'david.wilson@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Austin, TX',
      hireDate: '2020-04-15',
      employeeCount: 42,
      reports: ['hr-dir-001', 'rec-mgr-001'],
      avatar: null,
      status: 'active'
    },
    {
      id: 'eng-dir-001',
      name: 'Alex Thompson',
      position: 'Director of Engineering',
      department: 'Engineering',
      level: 3,
      parentId: 'cto-001',
      email: 'alex.thompson@company.com',
      phone: '+1 (555) 678-9012',
      location: 'San Francisco, CA',
      hireDate: '2020-08-12',
      employeeCount: 45,
      reports: ['se-lead-001', 'se-lead-002', 'se-lead-003'],
      avatar: null,
      status: 'active'
    },
    {
      id: 'sales-dir-001',
      name: 'Lisa Garcia',
      position: 'Director of Sales',
      department: 'Sales',
      level: 3,
      parentId: 'coo-001',
      email: 'lisa.garcia@company.com',
      phone: '+1 (555) 789-0123',
      location: 'Boston, MA',
      hireDate: '2021-02-05',
      employeeCount: 32,
      reports: ['sales-mgr-001', 'sales-mgr-002'],
      avatar: null,
      status: 'active'
    }
  ];

  const departments = [
    {
      id: 'dept-tech',
      name: 'Technology',
      description: 'Software development, infrastructure, and technical operations',
      headId: 'cto-001',
      headName: 'Sarah Johnson',
      employeeCount: 85,
      teams: ['Engineering', 'Product', 'QA', 'DevOps'],
      budget: 4500000,
      location: 'San Francisco, CA',
      established: '2019-01-01',
      status: 'active'
    },
    {
      id: 'dept-sales',
      name: 'Sales',
      description: 'Revenue generation, client acquisition, and relationship management',
      headId: 'sales-dir-001',
      headName: 'Lisa Garcia',
      employeeCount: 32,
      teams: ['Inside Sales', 'Enterprise Sales', 'Customer Success'],
      budget: 2100000,
      location: 'Boston, MA',
      established: '2018-01-01',
      status: 'active'
    },
    {
      id: 'dept-marketing',
      name: 'Marketing',
      description: 'Brand management, digital marketing, and lead generation',
      headId: 'mkt-dir-001',
      headName: 'Jennifer Lee',
      employeeCount: 18,
      teams: ['Digital Marketing', 'Content', 'Design', 'Events'],
      budget: 1200000,
      location: 'New York, NY',
      established: '2018-06-01',
      status: 'active'
    },
    {
      id: 'dept-hr',
      name: 'Human Resources',
      description: 'Employee relations, recruitment, and organizational development',
      headId: 'chro-001',
      headName: 'David Wilson',
      employeeCount: 42,
      teams: ['Recruitment', 'Employee Relations', 'Learning & Development', 'Compensation'],
      budget: 950000,
      location: 'Austin, TX',
      established: '2018-01-01',
      status: 'active'
    },
    {
      id: 'dept-finance',
      name: 'Finance',
      description: 'Financial planning, accounting, and corporate finance',
      headId: 'cfo-001',
      headName: 'Michael Chen',
      employeeCount: 25,
      teams: ['Accounting', 'Financial Planning', 'Treasury', 'Compliance'],
      budget: 750000,
      location: 'New York, NY',
      established: '2018-01-01',
      status: 'active'
    }
  ];

  const employeeDirectory = [
    {
      id: 'emp-001',
      employeeId: 'EMP-2024-045',
      name: 'Robert Davis',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      team: 'Backend Team',
      managerId: 'se-lead-001',
      managerName: 'Alex Thompson',
      email: 'robert.davis@company.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      workLocation: 'Office',
      hireDate: '2022-03-15',
      birthDate: '1988-07-22',
      skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
      projects: ['Project Alpha', 'Database Migration'],
      status: 'active',
      avatar: null
    },
    {
      id: 'emp-002',
      employeeId: 'EMP-2024-032',
      name: 'Amanda Johnson',
      position: 'Product Manager',
      department: 'Product',
      team: 'Product Strategy',
      managerId: 'prod-dir-001',
      managerName: 'Sarah Johnson',
      email: 'amanda.johnson@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Remote',
      workLocation: 'Remote',
      hireDate: '2021-08-10',
      birthDate: '1990-11-15',
      skills: ['Product Strategy', 'Data Analysis', 'Agile', 'User Research'],
      projects: ['Mobile App Redesign', 'Feature Roadmap Q4'],
      status: 'active',
      avatar: null
    },
    {
      id: 'emp-003',
      employeeId: 'EMP-2024-018',
      name: 'Marcus Williams',
      position: 'Sales Representative',
      department: 'Sales',
      team: 'Enterprise Sales',
      managerId: 'sales-mgr-002',
      managerName: 'Lisa Garcia',
      email: 'marcus.williams@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Boston, MA',
      workLocation: 'Hybrid',
      hireDate: '2023-01-20',
      birthDate: '1985-03-08',
      skills: ['Enterprise Sales', 'CRM', 'Negotiation', 'Presentation'],
      projects: ['Q4 Enterprise Pipeline', 'Customer Expansion Program'],
      status: 'active',
      avatar: null
    }
  ];

  const teams = [
    {
      id: 'team-001',
      name: 'Backend Engineering',
      department: 'Engineering',
      leadId: 'se-lead-001',
      leadName: 'Alex Thompson',
      memberCount: 12,
      description: 'Server-side development and API design',
      technologies: ['Python', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      projects: ['API Redesign', 'Microservices Migration', 'Performance Optimization'],
      location: 'San Francisco, CA',
      workStyle: 'Hybrid',
      budget: 850000,
      status: 'active'
    },
    {
      id: 'team-002',
      name: 'Frontend Engineering',
      department: 'Engineering',
      leadId: 'se-lead-002',
      leadName: 'Jessica Martinez',
      memberCount: 10,
      description: 'User interface development and user experience',
      technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Figma'],
      projects: ['Dashboard Redesign', 'Mobile Responsive Updates', 'Component Library'],
      location: 'San Francisco, CA',
      workStyle: 'Remote-First',
      budget: 720000,
      status: 'active'
    },
    {
      id: 'team-003',
      name: 'Enterprise Sales',
      department: 'Sales',
      leadId: 'sales-mgr-002',
      leadName: 'Tom Rodriguez',
      memberCount: 8,
      description: 'Large enterprise client acquisition and management',
      technologies: ['Salesforce', 'HubSpot', 'Zoom', 'Slack'],
      projects: ['Fortune 500 Outreach', 'Sales Process Automation', 'Customer Expansion'],
      location: 'Boston, MA',
      workStyle: 'Field + Remote',
      budget: 450000,
      status: 'active'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkLocationIcon = (location) => {
    switch (location) {
      case 'Office': return '🏢';
      case 'Remote': return '🏠';
      case 'Hybrid': case 'Field + Remote': return '🔄';
      case 'Field': return '🌍';
      default: return '📍';
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department) {
      case 'Technology': case 'Engineering': case 'Product': return '💻';
      case 'Sales': return '💼';
      case 'Marketing': return '📢';
      case 'Human Resources': return '👥';
      case 'Finance': return '💰';
      case 'Operations': return '⚙️';
      case 'Executive': return '🎯';
      default: return '🏢';
    }
  };

  const renderOrgChart = () => (
    <div className="space-y-6">
      {/* Organization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {organizationMetrics.map((metric, index) => (
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

      {/* Organizational Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Organizational Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* CEO Level */}
            {organizationStructure.filter(emp => emp.level === 1).map((ceo) => (
              <div key={ceo.id} className="text-center">
                <div 
                  className="inline-block bg-blue-100 border-2 border-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-200"
                  onClick={() => setSelectedEmployee(ceo)}
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-lg">{ceo.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="font-bold">{ceo.name}</div>
                  <div className="text-sm text-gray-600">{ceo.position}</div>
                  <div className="text-xs text-gray-500">{ceo.employeeCount} employees</div>
                </div>
                
                {/* C-Level Reports */}
                <div className="flex justify-center mt-6 space-x-8">
                  {organizationStructure.filter(emp => emp.level === 2).map((exec) => (
                    <div key={exec.id} className="text-center">
                      <div 
                        className="bg-green-100 border-2 border-green-300 rounded-lg p-3 cursor-pointer hover:bg-green-200"
                        onClick={() => setSelectedEmployee(exec)}
                      >
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-medium text-sm">{exec.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="font-medium text-sm">{exec.name}</div>
                        <div className="text-xs text-gray-600">{exec.position.replace('Chief ', '').replace(' Officer', '')}</div>
                        <div className="text-xs text-gray-500">{exec.employeeCount} reports</div>
                      </div>
                      
                      {/* Department Directors */}
                      <div className="flex justify-center mt-4 space-x-4">
                        {organizationStructure.filter(emp => emp.parentId === exec.id).map((director) => (
                          <div 
                            key={director.id}
                            className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 cursor-pointer hover:bg-yellow-200"
                            onClick={() => setSelectedEmployee(director)}
                          >
                            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-1">
                              <span className="text-white font-medium text-xs">{director.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div className="font-medium text-xs">{director.name.split(' ')[0]}</div>
                            <div className="text-xs text-gray-600">{director.department}</div>
                            <div className="text-xs text-gray-500">{director.employeeCount}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departments.slice(0, 5).map((dept) => (
                <div 
                  key={dept.id} 
                  className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{getDepartmentIcon(dept.name)}</span>
                    <div>
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-sm text-gray-600">{dept.headName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{dept.employeeCount}</div>
                    <div className="text-xs text-gray-500">employees</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { location: 'San Francisco, CA', count: 89, percentage: 36 },
                { location: 'Remote', count: 67, percentage: 27 },
                { location: 'New York, NY', count: 43, percentage: 17 },
                { location: 'Boston, MA', count: 32, percentage: 13 },
                { location: 'Austin, TX', count: 16, percentage: 7 }
              ].map((loc, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{loc.location}</div>
                    <div className="text-sm text-gray-600">{loc.percentage}% of workforce</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{loc.count}</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${loc.percentage}%` }}
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

  const renderDirectory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Employee Directory</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="border rounded-md px-3 py-2 text-sm w-64"
          />
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
          </select>
          <Button>Export Directory</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeDirectory.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <p className="text-xs text-gray-500">{employee.employeeId}</p>
                  </div>
                </div>
                <span className="text-lg">{getWorkLocationIcon(employee.workLocation)}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{employee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Team:</span>
                  <span className="font-medium">{employee.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manager:</span>
                  <span className="font-medium">{employee.managerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{employee.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hire Date:</span>
                  <span className="font-medium">{new Date(employee.hireDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-1">Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {employee.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {employee.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{employee.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  View Profile
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Departments</h2>
        <Button>Add Department</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{getDepartmentIcon(dept.name)}</span>
                  <div>
                    <CardTitle>{dept.name}</CardTitle>
                    <p className="text-sm text-gray-600">Head: {dept.headName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dept.status)}`}>
                  {dept.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{dept.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Employees:</span>
                  <div className="font-bold text-blue-600">{dept.employeeCount}</div>
                </div>
                <div>
                  <span className="text-gray-600">Teams:</span>
                  <div className="font-bold">{dept.teams.length}</div>
                </div>
                <div>
                  <span className="text-gray-600">Budget:</span>
                  <div className="font-bold text-green-600">${(dept.budget / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <div className="font-medium">{dept.location}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Teams:</div>
                <div className="flex flex-wrap gap-1">
                  {dept.teams.map((team, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {team}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Teams</h2>
        <Button>Create Team</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getDepartmentIcon(team.department)}</span>
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <p className="text-sm text-gray-600">{team.department} • Led by {team.leadName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getWorkLocationIcon(team.workStyle)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(team.status)}`}>
                    {team.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{team.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Team Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Members:</span> {team.memberCount}</div>
                    <div><span className="font-medium">Location:</span> {team.location}</div>
                    <div><span className="font-medium">Work Style:</span> {team.workStyle}</div>
                    <div><span className="font-medium">Budget:</span> ${(team.budget / 1000).toLocaleString()}K</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                    {team.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{team.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Active Projects</h4>
                  <div className="space-y-1 text-sm">
                    {team.projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="text-gray-700">• {project}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">View Members</Button>
                <Button size="sm" variant="outline" className="flex-1">Edit Team</Button>
                <Button size="sm" variant="outline" className="flex-1">Team Analytics</Button>
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
          <h1 className="text-2xl font-bold text-gray-800">Organization Chart & Directory</h1>
          <p className="text-gray-600">Explore organizational structure, employee directory, and team information</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'org-chart', label: 'Org Chart' },
            { id: 'directory', label: 'Employee Directory' },
            { id: 'departments', label: 'Departments' },
            { id: 'teams', label: 'Teams' }
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
        {activeTab === 'org-chart' && renderOrgChart()}
        {activeTab === 'directory' && renderDirectory()}
        {activeTab === 'departments' && renderDepartments()}
        {activeTab === 'teams' && renderTeams()}

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
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold">{selectedEmployee.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{selectedEmployee.position}</h3>
                    <p className="text-gray-600">{selectedEmployee.department}</p>
                    <p className="text-sm text-gray-500">{selectedEmployee.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Email:</span> {selectedEmployee.email}</div>
                      <div><span className="font-medium">Phone:</span> {selectedEmployee.phone}</div>
                      <div><span className="font-medium">Employee ID:</span> {selectedEmployee.employeeId || selectedEmployee.id}</div>
                      <div><span className="font-medium">Hire Date:</span> {new Date(selectedEmployee.hireDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Reporting Structure</h4>
                    <div className="space-y-2 text-sm">
                      {selectedEmployee.parentId && (
                        <div><span className="font-medium">Reports to:</span> {organizationStructure.find(emp => emp.id === selectedEmployee.parentId)?.name || 'N/A'}</div>
                      )}
                      {selectedEmployee.managerName && (
                        <div><span className="font-medium">Manager:</span> {selectedEmployee.managerName}</div>
                      )}
                      {selectedEmployee.employeeCount > 0 && (
                        <div><span className="font-medium">Direct Reports:</span> {selectedEmployee.employeeCount}</div>
                      )}
                      <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                    </div>
                  </div>
                </div>
                
                {selectedEmployee.skills && (
                  <div>
                    <h4 className="font-medium mb-3">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEmployee.projects && (
                  <div>
                    <h4 className="font-medium mb-3">Current Projects</h4>
                    <div className="space-y-1">
                      {selectedEmployee.projects.map((project, index) => (
                        <div key={index} className="text-sm text-gray-700">• {project}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Edit Profile</Button>
                <Button variant="outline" className="flex-1">View Team</Button>
                <Button variant="outline" className="flex-1">Contact</Button>
              </div>
            </div>
          </div>
        )}

        {/* Department Detail Modal */}
        {selectedDepartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedDepartment.name} Department</h2>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{getDepartmentIcon(selectedDepartment.name)}</span>
                  <div>
                    <h3 className="text-lg font-medium">{selectedDepartment.description}</h3>
                    <p className="text-gray-600">Led by {selectedDepartment.headName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Department Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Head of Department:</span> {selectedDepartment.headName}</div>
                      <div><span className="font-medium">Employee Count:</span> {selectedDepartment.employeeCount}</div>
                      <div><span className="font-medium">Location:</span> {selectedDepartment.location}</div>
                      <div><span className="font-medium">Established:</span> {new Date(selectedDepartment.established).getFullYear()}</div>
                      <div><span className="font-medium">Annual Budget:</span> ${(selectedDepartment.budget / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Teams & Structure</h4>
                    <div className="space-y-1">
                      {selectedDepartment.teams.map((team, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          {team}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">View Employees</Button>
                <Button variant="outline" className="flex-1">Department Analytics</Button>
                <Button variant="outline" className="flex-1">Edit Department</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrgChartDirectory; 