import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const EmployeeRecognition = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRecognition, setSelectedRecognition] = useState(null);
  const [showNominationForm, setShowNominationForm] = useState(false);

  const recognitionPrograms = [
    {
      id: 'prog-001',
      name: 'Employee of the Month',
      description: 'Recognizing outstanding performance and dedication',
      type: 'monthly',
      category: 'performance',
      participants: 248,
      nextDeadline: '2024-06-30',
      rewards: ['$500 bonus', 'Premium parking spot', 'Recognition plaque'],
      status: 'active'
    },
    {
      id: 'prog-002',
      name: 'Innovation Award',
      description: 'Celebrating creative solutions and new ideas',
      type: 'quarterly',
      category: 'innovation',
      participants: 89,
      nextDeadline: '2024-09-30',
      rewards: ['$1000 bonus', 'Innovation trophy', 'Feature in newsletter'],
      status: 'active'
    },
    {
      id: 'prog-003',
      name: 'Team Player Award',
      description: 'Honoring collaboration and teamwork excellence',
      type: 'monthly',
      category: 'teamwork',
      participants: 156,
      nextDeadline: '2024-06-30',
      rewards: ['Team lunch voucher', 'Recognition certificate', 'Public acknowledgment'],
      status: 'active'
    },
    {
      id: 'prog-004',
      name: 'Customer Champion',
      description: 'Recognizing exceptional customer service',
      type: 'quarterly',
      category: 'service',
      participants: 67,
      nextDeadline: '2024-09-30',
      rewards: ['$750 bonus', 'Customer service trophy', 'Training opportunity'],
      status: 'active'
    }
  ];

  const recognitions = [
    {
      id: 'rec-001',
      nominee: 'Sarah Johnson',
      nominator: 'Mike Wilson',
      program: 'Employee of the Month',
      category: 'performance',
      reason: 'Exceeded quarterly sales targets by 150% and mentored 3 new team members',
      dateSubmitted: '2024-06-01',
      status: 'approved',
      points: 100,
      department: 'Sales',
      approvedBy: 'Jennifer Lee'
    },
    {
      id: 'rec-002',
      nominee: 'John Smith',
      nominator: 'Sarah Johnson',
      program: 'Innovation Award',
      category: 'innovation',
      reason: 'Developed automated testing framework that reduced deployment time by 60%',
      dateSubmitted: '2024-05-28',
      status: 'pending',
      points: 150,
      department: 'Engineering',
      approvedBy: null
    },
    {
      id: 'rec-003',
      nominee: 'Emily Chen',
      nominator: 'David Rodriguez',
      program: 'Team Player Award',
      category: 'teamwork',
      reason: 'Coordinated cross-functional project that delivered ahead of schedule',
      dateSubmitted: '2024-05-25',
      status: 'approved',
      points: 75,
      department: 'Marketing',
      approvedBy: 'Michael Brown'
    },
    {
      id: 'rec-004',
      nominee: 'Alex Thompson',
      nominator: 'Lisa Wang',
      program: 'Customer Champion',
      category: 'service',
      reason: 'Resolved complex customer issue that saved $50K account',
      dateSubmitted: '2024-05-20',
      status: 'rejected',
      points: 0,
      department: 'Support',
      approvedBy: 'Jennifer Lee'
    }
  ];

  const leaderboard = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      department: 'Sales',
      points: 450,
      recognitions: 8,
      achievements: ['Employee of the Month x2', 'Top Performer Q1'],
      avatar: '👩‍💼'
    },
    {
      rank: 2,
      name: 'John Smith',
      department: 'Engineering',
      points: 425,
      recognitions: 6,
      achievements: ['Innovation Award', 'Technical Excellence'],
      avatar: '👨‍💻'
    },
    {
      rank: 3,
      name: 'Emily Chen',
      department: 'Marketing',
      points: 380,
      recognitions: 7,
      achievements: ['Team Player Award x3', 'Project Excellence'],
      avatar: '👩‍🎨'
    },
    {
      rank: 4,
      name: 'Mike Wilson',
      department: 'Sales',
      points: 350,
      recognitions: 5,
      achievements: ['Customer Champion', 'Sales Excellence'],
      avatar: '👨‍💼'
    },
    {
      rank: 5,
      name: 'Lisa Wang',
      department: 'Support',
      points: 320,
      recognitions: 6,
      achievements: ['Customer Service Star', 'Problem Solver'],
      avatar: '👩‍🔧'
    }
  ];

  const recognitionMetrics = [
    { label: 'Total Recognitions', value: '1,247', icon: '🏆', color: 'text-yellow-600' },
    { label: 'Active Programs', value: '8', icon: '⭐', color: 'text-blue-600' },
    { label: 'Points Awarded', value: '15,680', icon: '💎', color: 'text-purple-600' },
    { label: 'Participation Rate', value: '89%', icon: '📈', color: 'text-green-600' }
  ];

  const recentRecognitions = [
    {
      id: 1,
      type: 'nomination',
      message: 'Mike Wilson nominated Sarah Johnson for Employee of the Month',
      time: '2 hours ago',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      type: 'approval',
      message: 'Emily Chen received Team Player Award for exceptional collaboration',
      time: '5 hours ago',
      avatar: '👩‍🎨'
    },
    {
      id: 3,
      type: 'milestone',
      message: 'John Smith reached 500 recognition points milestone',
      time: '1 day ago',
      avatar: '👨‍💻'
    },
    {
      id: 4,
      type: 'program',
      message: 'New "Wellness Champion" recognition program launched',
      time: '2 days ago',
      avatar: '🏥'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'performance': return '🎯';
      case 'innovation': return '💡';
      case 'teamwork': return '🤝';
      case 'service': return '🌟';
      default: return '🏆';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Recognition Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {recognitionMetrics.map((metric, index) => (
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

      {/* Recognition Programs Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Recognition Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recognitionPrograms.slice(0, 4).map((program) => (
              <div key={program.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{getCategoryIcon(program.category)}</span>
                  <h3 className="font-medium">{program.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{program.participants} participants</span>
                  <span>Due: {new Date(program.nextDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((person) => (
                <div key={person.rank} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{person.avatar}</span>
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-gray-600">{person.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{person.points} pts</div>
                    <div className="text-xs text-gray-600">{person.recognitions} recognitions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRecognitions.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <span className="text-xl mr-3 mt-1">{activity.avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recognition Programs</h2>
        <Button>Create New Program</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recognitionPrograms.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getCategoryIcon(program.category)}</span>
                  <CardTitle>{program.name}</CardTitle>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {program.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{program.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Type:</span>
                  <span className="font-medium">{program.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Participants:</span>
                  <span className="font-medium">{program.participants}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Deadline:</span>
                  <span className="font-medium">{new Date(program.nextDeadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Rewards:</h4>
                <div className="flex flex-wrap gap-1">
                  {program.rewards.map((reward, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {reward}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">View Details</Button>
                <Button size="sm" variant="outline" className="flex-1">Nominate</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNominations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recognition Nominations</h2>
        <Button onClick={() => setShowNominationForm(true)}>Submit Nomination</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Nominee</th>
                  <th className="text-left p-4">Program</th>
                  <th className="text-left p-4">Nominator</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Points</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recognitions.map((recognition) => (
                  <tr key={recognition.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{recognition.nominee}</div>
                      <div className="text-sm text-gray-600">{recognition.department}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getCategoryIcon(recognition.category)}</span>
                        {recognition.program}
                      </div>
                    </td>
                    <td className="p-4">{recognition.nominator}</td>
                    <td className="p-4">{new Date(recognition.dateSubmitted).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(recognition.status)}`}>
                        {recognition.status.charAt(0).toUpperCase() + recognition.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-blue-600">{recognition.points}</span>
                    </td>
                    <td className="p-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedRecognition(recognition)}
                      >
                        View
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

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recognition Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((person) => (
              <div key={person.rank} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    person.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                    person.rank === 2 ? 'bg-gray-100 text-gray-800' :
                    person.rank === 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    #{person.rank}
                  </div>
                  <span className="text-3xl mr-4">{person.avatar}</span>
                  <div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.department}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {person.achievements.slice(0, 2).map((achievement, index) => (
                        <span key={index} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{person.points}</div>
                  <div className="text-sm text-gray-600">points</div>
                  <div className="text-xs text-gray-500">{person.recognitions} recognitions</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recognition Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>This Month</span>
                <span className="font-bold text-green-600">↗ +23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Month</span>
                <span className="font-bold text-blue-600">↗ +15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Quarter Average</span>
                <span className="font-bold text-yellow-600">→ +8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Employee of the Month</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Team Player Award</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm">72%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Innovation Award</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm">68%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-gray-600">Sales Department</div>
              <div className="text-xs text-gray-500">156 recognitions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Engineering</div>
              <div className="text-xs text-gray-500">134 recognitions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">83%</div>
              <div className="text-sm text-gray-600">Marketing</div>
              <div className="text-xs text-gray-500">98 recognitions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Recognition</h1>
          <p className="text-gray-600">Celebrate achievements and foster a culture of appreciation</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'programs', label: 'Programs' },
            { id: 'nominations', label: 'Nominations' },
            { id: 'leaderboard', label: 'Leaderboard' },
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
        {activeTab === 'programs' && renderPrograms()}
        {activeTab === 'nominations' && renderNominations()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
        {activeTab === 'analytics' && renderAnalytics()}

        {/* Recognition Detail Modal */}
        {selectedRecognition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recognition Details</h2>
                <button
                  onClick={() => setSelectedRecognition(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Nominee Information</h3>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedRecognition.nominee}</div>
                      <div><span className="font-medium">Department:</span> {selectedRecognition.department}</div>
                      <div><span className="font-medium">Nominated by:</span> {selectedRecognition.nominator}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Recognition Details</h3>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Program:</span> {selectedRecognition.program}</div>
                      <div><span className="font-medium">Category:</span> {selectedRecognition.category}</div>
                      <div><span className="font-medium">Date:</span> {new Date(selectedRecognition.dateSubmitted).toLocaleDateString()}</div>
                      <div><span className="font-medium">Points:</span> {selectedRecognition.points}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Reason for Recognition</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedRecognition.reason}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRecognition.status)}`}>
                    {selectedRecognition.status.charAt(0).toUpperCase() + selectedRecognition.status.slice(1)}
                  </span>
                  {selectedRecognition.approvedBy && (
                    <span className="text-sm text-gray-600">
                      Approved by: {selectedRecognition.approvedBy}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Edit</Button>
                <Button variant="outline" className="flex-1">Share</Button>
              </div>
            </div>
          </div>
        )}

        {/* Nomination Form Modal */}
        {showNominationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submit Nomination</h2>
                <button
                  onClick={() => setShowNominationForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nominee</label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option>Select employee...</option>
                      <option>John Smith</option>
                      <option>Sarah Johnson</option>
                      <option>Emily Chen</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Recognition Program</label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option>Select program...</option>
                      {recognitionPrograms.map((program) => (
                        <option key={program.id}>{program.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Reason for Recognition</label>
                  <textarea 
                    className="w-full border rounded-md px-3 py-2 h-24"
                    placeholder="Describe why this person deserves recognition..."
                  ></textarea>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Submit Nomination</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowNominationForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeRecognition; 
