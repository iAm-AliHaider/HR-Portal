import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const SkillsManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skillCategories = [
    { id: 'technical', name: 'Technical Skills', icon: '💻', count: 45, color: 'bg-blue-100' },
    { id: 'soft', name: 'Soft Skills', icon: '🤝', count: 28, color: 'bg-green-100' },
    { id: 'leadership', name: 'Leadership', icon: '👑', count: 15, color: 'bg-purple-100' },
    { id: 'communication', name: 'Communication', icon: '💬', count: 18, color: 'bg-yellow-100' },
    { id: 'analytical', name: 'Analytical', icon: '📊', count: 22, color: 'bg-indigo-100' },
    { id: 'creative', name: 'Creative', icon: '🎨', count: 12, color: 'bg-pink-100' }
  ];

  const skills = [
    {
      id: 'skill-001',
      name: 'JavaScript',
      category: 'technical',
      description: 'Programming language for web development',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      demand: 'high',
      employees: 35,
      avgProficiency: 2.8,
      courses: ['JavaScript Fundamentals', 'Advanced JavaScript', 'Node.js Development']
    },
    {
      id: 'skill-002',
      name: 'Project Management',
      category: 'soft',
      description: 'Planning, executing, and managing projects',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      demand: 'high',
      employees: 28,
      avgProficiency: 3.1,
      courses: ['PMP Certification', 'Agile Project Management', 'Scrum Master']
    },
    {
      id: 'skill-003',
      name: 'Public Speaking',
      category: 'communication',
      description: 'Effective presentation and speaking skills',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      demand: 'medium',
      employees: 22,
      avgProficiency: 2.3,
      courses: ['Presentation Skills', 'Public Speaking Mastery', 'Communication Excellence']
    },
    {
      id: 'skill-004',
      name: 'Data Analysis',
      category: 'analytical',
      description: 'Analyzing and interpreting complex data',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      demand: 'high',
      employees: 19,
      avgProficiency: 2.6,
      courses: ['Data Analytics', 'Business Intelligence', 'Statistical Analysis']
    },
    {
      id: 'skill-005',
      name: 'Team Leadership',
      category: 'leadership',
      description: 'Leading and motivating teams effectively',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      demand: 'high',
      employees: 15,
      avgProficiency: 2.9,
      courses: ['Leadership Fundamentals', 'Team Management', 'Executive Leadership']
    }
  ];

  const employees = [
    {
      id: 'emp-001',
      name: 'John Smith',
      department: 'Engineering',
      role: 'Senior Developer',
      skills: [
        { skillId: 'skill-001', skillName: 'JavaScript', proficiency: 4, lastAssessed: '2024-05-15' },
        { skillId: 'skill-004', skillName: 'Data Analysis', proficiency: 3, lastAssessed: '2024-04-20' },
        { skillId: 'skill-002', skillName: 'Project Management', proficiency: 2, lastAssessed: '2024-03-10' }
      ],
      skillGaps: ['Team Leadership', 'Public Speaking'],
      overallScore: 3.0
    },
    {
      id: 'emp-002',
      name: 'Sarah Johnson',
      department: 'Marketing',
      role: 'Marketing Manager',
      skills: [
        { skillId: 'skill-003', skillName: 'Public Speaking', proficiency: 4, lastAssessed: '2024-05-01' },
        { skillId: 'skill-005', skillName: 'Team Leadership', proficiency: 3, lastAssessed: '2024-04-15' },
        { skillId: 'skill-002', skillName: 'Project Management', proficiency: 3, lastAssessed: '2024-03-25' }
      ],
      skillGaps: ['Data Analysis', 'JavaScript'],
      overallScore: 3.3
    },
    {
      id: 'emp-003',
      name: 'Mike Wilson',
      department: 'Sales',
      role: 'Sales Representative',
      skills: [
        { skillId: 'skill-003', skillName: 'Public Speaking', proficiency: 3, lastAssessed: '2024-04-30' },
        { skillId: 'skill-002', skillName: 'Project Management', proficiency: 2, lastAssessed: '2024-04-10' }
      ],
      skillGaps: ['Data Analysis', 'Team Leadership', 'JavaScript'],
      overallScore: 2.5
    }
  ];

  const skillGaps = [
    {
      department: 'Engineering',
      criticalGaps: [
        { skill: 'Team Leadership', gapLevel: 'high', affectedEmployees: 8 },
        { skill: 'Public Speaking', gapLevel: 'medium', affectedEmployees: 12 }
      ]
    },
    {
      department: 'Marketing',
      criticalGaps: [
        { skill: 'Data Analysis', gapLevel: 'high', affectedEmployees: 6 },
        { skill: 'JavaScript', gapLevel: 'low', affectedEmployees: 3 }
      ]
    },
    {
      department: 'Sales',
      criticalGaps: [
        { skill: 'Data Analysis', gapLevel: 'high', affectedEmployees: 10 },
        { skill: 'Team Leadership', gapLevel: 'medium', affectedEmployees: 7 }
      ]
    }
  ];

  const competencyFrameworks = [
    {
      id: 'framework-001',
      name: 'Software Engineer Framework',
      description: 'Core competencies for software engineering roles',
      roles: ['Junior Developer', 'Senior Developer', 'Tech Lead', 'Principal Engineer'],
      skills: [
        { name: 'JavaScript', required: true, minLevel: 3 },
        { name: 'Data Analysis', required: true, minLevel: 2 },
        { name: 'Project Management', required: false, minLevel: 2 },
        { name: 'Team Leadership', required: false, minLevel: 3 }
      ]
    },
    {
      id: 'framework-002',
      name: 'Marketing Professional Framework',
      description: 'Essential skills for marketing professionals',
      roles: ['Marketing Specialist', 'Marketing Manager', 'Marketing Director'],
      skills: [
        { name: 'Public Speaking', required: true, minLevel: 3 },
        { name: 'Data Analysis', required: true, minLevel: 3 },
        { name: 'Project Management', required: true, minLevel: 2 },
        { name: 'Team Leadership', required: false, minLevel: 3 }
      ]
    }
  ];

  const skillMetrics = [
    { label: 'Total Skills Tracked', value: '128', icon: '🎯', color: 'text-blue-600' },
    { label: 'Employees Assessed', value: '245', icon: '👥', color: 'text-green-600' },
    { label: 'Skill Gaps Identified', value: '67', icon: '⚠️', color: 'text-orange-600' },
    { label: 'Learning Recommendations', value: '156', icon: '📚', color: 'text-purple-600' }
  ];

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getGapLevelColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Skill Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {skillMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{metric.icon}</span>
                <div>
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skill Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skillCategories.map((category) => (
              <div key={category.id} className={`${category.color} rounded-lg p-4 text-center`}>
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-600">{category.count} skills</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Skills in Demand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Skills in Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skills.filter(s => s.demand === 'high').map((skill) => (
                <div key={skill.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm text-gray-600">{skill.employees} employees</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getDemandColor(skill.demand)}`}>
                      {skill.demand.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Avg: {skill.avgProficiency.toFixed(1)}/4
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Technical Skills</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Soft Skills</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Leadership</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Communication</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Other</span>
                <span className="font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSkillMatrix = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Skill</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Employees</th>
                  <th className="text-left p-2">Avg Proficiency</th>
                  <th className="text-left p-2">Demand</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-sm text-gray-600">{skill.description}</div>
                    </td>
                    <td className="p-2">
                      <span className="flex items-center">
                        {skillCategories.find(c => c.id === skill.category)?.icon}
                        <span className="ml-1">{skillCategories.find(c => c.id === skill.category)?.name}</span>
                      </span>
                    </td>
                    <td className="p-2">{skill.employees}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(skill.avgProficiency / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{skill.avgProficiency.toFixed(1)}/4</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={`font-medium ${getDemandColor(skill.demand)}`}>
                        {skill.demand.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedSkill(skill)}
                      >
                        View Details
                      </Button>
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

  const renderGapAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills Gap Analysis by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skillGaps.map((department, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-3">{department.department} Department</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {department.criticalGaps.map((gap, gapIndex) => (
                    <div key={gapIndex} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{gap.skill}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getGapLevelColor(gap.gapLevel)}`}>
                          {gap.gapLevel.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {gap.affectedEmployees} employees need development
                      </div>
                      <Button size="sm" className="mt-2">Recommend Training</Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmployeeProfiles = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Skill Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                    <p className="text-xs text-gray-500">{employee.department}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{employee.overallScore.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">Overall Score</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-2">Current Skills</h4>
                  <div className="space-y-1">
                    {employee.skills.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{skill.skillName}</span>
                        <span className="font-medium">{skill.proficiency}/4</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-2">Skill Gaps</h4>
                  <div className="flex flex-wrap gap-1">
                    {employee.skillGaps.map((gap, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFrameworks = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competency Frameworks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {competencyFrameworks.map((framework) => (
              <div key={framework.id} className="border rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-lg">{framework.name}</h3>
                  <p className="text-sm text-gray-600">{framework.description}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Applicable Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {framework.roles.map((role, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-1">Skill</th>
                          <th className="text-left p-1">Required</th>
                          <th className="text-left p-1">Min Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {framework.skills.map((skill, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-1">{skill.name}</td>
                            <td className="p-1">
                              <span className={`px-1 py-0.5 rounded text-xs ${
                                skill.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {skill.required ? 'Required' : 'Optional'}
                              </span>
                            </td>
                            <td className="p-1">{skill.minLevel}/4</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Skills Management</h1>
          <p className="text-gray-600">Track competencies, identify gaps, and plan development</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'matrix', label: 'Skills Matrix' },
            { id: 'gaps', label: 'Gap Analysis' },
            { id: 'profiles', label: 'Employee Profiles' },
            { id: 'frameworks', label: 'Competency Frameworks' }
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'matrix' && renderSkillMatrix()}
        {activeTab === 'gaps' && renderGapAnalysis()}
        {activeTab === 'profiles' && renderEmployeeProfiles()}
        {activeTab === 'frameworks' && renderFrameworks()}

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
                <div>
                  <h3 className="font-medium mb-2">Professional Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Role:</span> {selectedEmployee.role}</div>
                    <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                    <div><span className="font-medium">Overall Score:</span> {selectedEmployee.overallScore.toFixed(1)}/4</div>
                    <div><span className="font-medium">Skills Count:</span> {selectedEmployee.skills.length}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Current Skills</h3>
                  <div className="space-y-2">
                    {selectedEmployee.skills.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{skill.skillName}</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(skill.proficiency / 4) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{skill.proficiency}/4</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Identified Skill Gaps</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skillGaps.map((gap, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Assess Skills</Button>
                <Button variant="outline" className="flex-1">Recommend Training</Button>
                <Button variant="outline" className="flex-1">Update Profile</Button>
              </div>
            </div>
          </div>
        )}

        {/* Skill Detail Modal */}
        {selectedSkill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedSkill.name}</h2>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedSkill.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Skill Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Category:</span> {skillCategories.find(c => c.id === selectedSkill.category)?.name}</div>
                      <div><span className="font-medium">Employees:</span> {selectedSkill.employees}</div>
                      <div><span className="font-medium">Average Proficiency:</span> {selectedSkill.avgProficiency.toFixed(1)}/4</div>
                      <div><span className="font-medium">Demand Level:</span> 
                        <span className={`ml-1 font-medium ${getDemandColor(selectedSkill.demand)}`}>
                          {selectedSkill.demand.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Proficiency Levels</h3>
                    <div className="space-y-1 text-sm">
                      {selectedSkill.proficiencyLevels.map((level, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2">
                            {index + 1}
                          </span>
                          {level}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Related Courses</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.courses.map((course, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Create Assessment</Button>
                <Button variant="outline" className="flex-1">View Analytics</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SkillsManagement; 
