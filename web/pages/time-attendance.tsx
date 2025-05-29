import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { GetServerSideProps } from 'next';

const TimeAndAttendance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTimeEntry, setSelectedTimeEntry] = useState(null);

  const attendanceMetrics = [
    { label: 'Present Today', value: '234/247', icon: '✅', color: 'text-green-600', trend: 'up' },
    { label: 'Overtime Hours', value: '128.5h', icon: '⏰', color: 'text-orange-600', trend: 'up' },
    { label: 'PTO Pending', value: '23', icon: '🏖️', color: 'text-blue-600', trend: 'down' },
    { label: 'Avg Hours/Week', value: '41.2h', icon: '📊', color: 'text-purple-600', trend: 'stable' }
  ];

  const todayAttendance = [
    {
      id: 'att-001',
      employeeId: 'EMP-2024-045',
      name: 'Sarah Johnson',
      position: 'Senior Developer',
      department: 'Engineering',
      clockIn: '08:15',
      clockOut: null,
      breakTime: '00:45',
      hoursWorked: 7.25,
      status: 'present',
      location: 'Office',
      overtimeHours: 0,
      notes: null
    },
    {
      id: 'att-002',
      employeeId: 'EMP-2024-032',
      name: 'Michael Chen',
      position: 'Sales Manager',
      department: 'Sales',
      clockIn: '09:00',
      clockOut: '18:30',
      breakTime: '01:00',
      hoursWorked: 8.5,
      status: 'completed',
      location: 'Remote',
      overtimeHours: 0.5,
      notes: 'Client meeting ran over'
    },
    {
      id: 'att-003',
      employeeId: 'EMP-2024-018',
      name: 'Emily Rodriguez',
      position: 'Marketing Specialist',
      department: 'Marketing',
      clockIn: null,
      clockOut: null,
      breakTime: null,
      hoursWorked: 0,
      status: 'pto',
      location: null,
      overtimeHours: 0,
      notes: 'Vacation Day'
    },
    {
      id: 'att-004',
      employeeId: 'EMP-2024-067',
      name: 'David Wilson',
      position: 'HR Specialist',
      department: 'HR',
      clockIn: '08:30',
      clockOut: null,
      breakTime: '00:30',
      hoursWorked: 6.5,
      status: 'present',
      location: 'Office',
      overtimeHours: 0,
      notes: null
    }
  ];

  const ptoRequests = [
    {
      id: 'pto-001',
      employeeId: 'EMP-2024-045',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      requestDate: '2024-06-15',
      startDate: '2024-07-15',
      endDate: '2024-07-19',
      totalDays: 5,
      type: 'vacation',
      reason: 'Family vacation',
      status: 'pending',
      approver: 'John Smith',
      submittedBy: 'Sarah Johnson',
      comments: 'Planning a family trip to Europe',
      balance: {
        vacation: 15,
        sick: 8,
        personal: 3
      }
    },
    {
      id: 'pto-002',
      employeeId: 'EMP-2024-032',
      employeeName: 'Michael Chen',
      department: 'Sales',
      requestDate: '2024-06-18',
      startDate: '2024-06-25',
      endDate: '2024-06-25',
      totalDays: 1,
      type: 'sick',
      reason: 'Medical appointment',
      status: 'approved',
      approver: 'Lisa Thompson',
      submittedBy: 'Michael Chen',
      comments: 'Routine medical checkup',
      balance: {
        vacation: 12,
        sick: 7,
        personal: 2
      }
    },
    {
      id: 'pto-003',
      employeeId: 'EMP-2024-018',
      employeeName: 'Emily Rodriguez',
      department: 'Marketing',
      requestDate: '2024-06-10',
      startDate: '2024-06-20',
      endDate: '2024-06-21',
      totalDays: 2,
      type: 'personal',
      reason: 'Personal matters',
      status: 'approved',
      approver: 'David Lee',
      submittedBy: 'Emily Rodriguez',
      comments: 'Moving to new apartment',
      balance: {
        vacation: 18,
        sick: 10,
        personal: 1
      }
    }
  ];

  const schedules = [
    {
      id: 'sched-001',
      name: 'Standard Business Hours',
      type: 'fixed',
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      breakDuration: 60,
      totalHours: 40,
      employees: 156,
      status: 'active',
      description: 'Standard 9-5 office schedule'
    },
    {
      id: 'sched-002',
      name: 'Early Morning Shift',
      type: 'fixed',
      startTime: '06:00',
      endTime: '14:00',
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      breakDuration: 60,
      totalHours: 40,
      employees: 45,
      status: 'active',
      description: 'Early morning shift for operations team'
    },
    {
      id: 'sched-003',
      name: 'Flexible Schedule',
      type: 'flexible',
      coreHours: '10:00-15:00',
      minHours: 8,
      maxHours: 10,
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      employees: 46,
      status: 'active',
      description: 'Flexible schedule with core hours requirement'
    }
  ];

  const timeEntries = [
    {
      id: 'entry-001',
      employeeId: 'EMP-2024-045',
      employeeName: 'Sarah Johnson',
      date: '2024-06-20',
      clockIn: '08:15',
      clockOut: '17:30',
      breakStart: '12:00',
      breakEnd: '12:45',
      totalHours: 8.25,
      regularHours: 8,
      overtimeHours: 0.25,
      location: 'Office',
      project: 'Project Alpha',
      taskDescription: 'Backend development',
      status: 'approved',
      approvedBy: 'John Smith',
      modifiedBy: null
    },
    {
      id: 'entry-002',
      employeeId: 'EMP-2024-032',
      employeeName: 'Michael Chen',
      date: '2024-06-20',
      clockIn: '09:00',
      clockOut: '19:15',
      breakStart: '12:30',
      breakEnd: '13:30',
      totalHours: 9.25,
      regularHours: 8,
      overtimeHours: 1.25,
      location: 'Remote',
      project: 'Sales Campaign',
      taskDescription: 'Client presentations',
      status: 'pending',
      approvedBy: null,
      modifiedBy: null
    }
  ];

  const overtimeReports = [
    {
      employeeId: 'EMP-2024-032',
      employeeName: 'Michael Chen',
      department: 'Sales',
      weeklyOT: 5.25,
      monthlyOT: 18.75,
      ytdOT: 127.5,
      rate: 1.5,
      cost: 1875.00
    },
    {
      employeeId: 'EMP-2024-045',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      weeklyOT: 3.5,
      monthlyOT: 12.25,
      ytdOT: 89.75,
      rate: 1.5,
      cost: 1537.50
    },
    {
      employeeId: 'EMP-2024-067',
      employeeName: 'David Wilson',
      department: 'HR',
      weeklyOT: 2.0,
      monthlyOT: 8.5,
      ytdOT: 45.25,
      rate: 1.5,
      cost: 1265.00
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': case 'approved': case 'active': case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'absent': case 'denied': case 'late': return 'bg-red-100 text-red-800';
      case 'pto': case 'remote': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPTOTypeIcon = (type) => {
    switch (type) {
      case 'vacation': return '🏖️';
      case 'sick': return '🏥';
      case 'personal': return '👤';
      case 'emergency': return '🚨';
      default: return '📅';
    }
  };

  const getLocationIcon = (location) => {
    switch (location) {
      case 'Office': return '🏢';
      case 'Remote': return '🏠';
      case 'Field': return '🌍';
      default: return '📍';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Attendance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {attendanceMetrics.map((metric, index) => (
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
              <span className="text-2xl mb-1">⏰</span>
              <span className="text-sm">Clock In/Out</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🏖️</span>
              <span className="text-sm">Request PTO</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📅</span>
              <span className="text-sm">View Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">Time Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance - {new Date().toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAttendance.slice(0, 6).map((attendance) => (
              <div key={attendance.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">{attendance.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{attendance.name}</h3>
                      <p className="text-sm text-gray-600">{attendance.position} • {attendance.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {attendance.location && (
                      <span className="text-lg">{getLocationIcon(attendance.location)}</span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(attendance.status)}`}>
                      {attendance.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Clock In: </span>
                    <span className="font-medium">{attendance.clockIn || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Clock Out: </span>
                    <span className="font-medium">{attendance.clockOut || 'In Progress'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hours: </span>
                    <span className="font-medium">{attendance.hoursWorked}h</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Overtime: </span>
                    <span className={`font-medium ${attendance.overtimeHours > 0 ? 'text-orange-600' : ''}`}>
                      {attendance.overtimeHours}h
                    </span>
                  </div>
                </div>
                
                {attendance.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {attendance.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PTO & Overtime Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending PTO Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ptoRequests.filter(p => p.status === 'pending').map((request) => (
                <div key={request.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{getPTOTypeIcon(request.type)}</span>
                    <div>
                      <div className="font-medium">{request.employeeName}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">{request.totalDays} days • {request.type}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">Approve</Button>
                    <Button size="sm" variant="outline">Deny</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Overtime This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overtimeReports.slice(0, 4).map((report, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{report.employeeName}</div>
                    <div className="text-sm text-gray-600">{report.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{report.weeklyOT}h</div>
                    <div className="text-xs text-gray-500">${report.cost.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTimeTracking = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Time Tracking</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <Button>Export Timesheet</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Clock In</th>
                  <th className="text-left p-4">Clock Out</th>
                  <th className="text-left p-4">Break</th>
                  <th className="text-left p-4">Total Hours</th>
                  <th className="text-left p-4">Overtime</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...timeEntries, ...todayAttendance.filter(a => a.status !== 'pto')].map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{entry.location ? getLocationIcon(entry.location) : '📍'}</span>
                        <div>
                          <div className="font-medium">{'employeeName' in entry ? entry.employeeName : entry.name}</div>
                          <div className="text-sm text-gray-600">{'position' in entry ? entry.position : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{'date' in entry ? entry.date : new Date().toISOString().split('T')[0]}</td>
                    <td className="p-4">{entry.clockIn}</td>
                    <td className="p-4">{entry.clockOut || 'In Progress'}</td>
                    <td className="p-4">
                      {'breakTime' in entry ? entry.breakTime : 
                       (entry.breakStart && entry.breakEnd ? `${entry.breakStart}-${entry.breakEnd}` : 'N/A')}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{'totalHours' in entry ? entry.totalHours : entry.hoursWorked}h</div>
                    </td>
                    <td className="p-4">
                      <div className={`font-medium ${(entry.overtimeHours > 0) ? 'text-orange-600' : ''}`}>
                        {entry.overtimeHours}h
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entry.status)}`}>
                        {entry.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTimeEntry(entry)}
                        >
                          View
                        </Button>
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

  const renderSchedules = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Work Schedules</h2>
        <Button>Create Schedule</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{schedule.name}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(schedule.status)}`}>
                  {schedule.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{schedule.description}</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-medium capitalize">{schedule.type}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Employees:</span>
                    <div className="font-medium">{schedule.employees}</div>
                  </div>
                </div>
                
                {schedule.type === 'fixed' ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Hours:</span>
                      <div className="font-medium">{schedule.startTime} - {schedule.endTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Hours:</span>
                      <div className="font-medium">{schedule.totalHours}h/week</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Core Hours:</span>
                      <div className="font-medium">{schedule.coreHours}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Daily Range:</span>
                      <div className="font-medium">{schedule.minHours}-{schedule.maxHours}h</div>
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600 text-sm">Working Days:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {schedule.daysOfWeek.map((day, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Break Duration:</span>
                  <span className="font-medium ml-1">{schedule.breakDuration || schedule.totalHours ? schedule.breakDuration : 'Flexible'} minutes</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">Edit Schedule</Button>
                <Button size="sm" variant="outline" className="flex-1">View Employees</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPTO = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">PTO Management</h2>
        <Button>New PTO Request</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Dates</th>
                  <th className="text-left p-4">Days</th>
                  <th className="text-left p-4">Reason</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Approver</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ptoRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getPTOTypeIcon(request.type)}</span>
                        <div>
                          <div className="font-medium">{request.employeeName}</div>
                          <div className="text-sm text-gray-600">{request.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-medium">{request.type}</span>
                    </td>
                    <td className="p-4">
                      <div>{new Date(request.startDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">
                        to {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{request.totalDays}</div>
                    </td>
                    <td className="p-4">
                      <div>{request.reason}</div>
                      {request.comments && (
                        <div className="text-sm text-gray-600">{request.comments}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{request.approver}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        {request.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">Approve</Button>
                            <Button size="sm" variant="outline">Deny</Button>
                          </>
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

      {/* PTO Balance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>PTO Balance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['vacation', 'sick', 'personal'].map((type) => (
              <div key={type} className="text-center">
                <div className="text-3xl mb-2">{getPTOTypeIcon(type)}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(Math.random() * 20 + 10)}
                </div>
                <div className="text-sm text-gray-600 capitalize">Average {type} Days</div>
                <div className="text-xs text-gray-500">Available per employee</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Time & Attendance Reports</h2>
        <Button>Generate Report</Button>
      </div>

      {/* Overtime Report */}
      <Card>
        <CardHeader>
          <CardTitle>Overtime Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Department</th>
                  <th className="text-left p-4">This Week</th>
                  <th className="text-left p-4">This Month</th>
                  <th className="text-left p-4">YTD</th>
                  <th className="text-left p-4">OT Rate</th>
                  <th className="text-left p-4">Cost</th>
                </tr>
              </thead>
              <tbody>
                {overtimeReports.map((report, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{report.employeeName}</div>
                      <div className="text-sm text-gray-600">{report.employeeId}</div>
                    </td>
                    <td className="p-4">{report.department}</td>
                    <td className="p-4">
                      <div className="font-medium text-orange-600">{report.weeklyOT}h</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{report.monthlyOT}h</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{report.ytdOT}h</div>
                    </td>
                    <td className="p-4">{report.rate}x</td>
                    <td className="p-4">
                      <div className="font-medium">${report.cost.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'On-Time Arrivals', value: '89%', trend: 'up' },
                { label: 'Average Hours/Day', value: '8.2h', trend: 'stable' },
                { label: 'Remote Work Rate', value: '35%', trend: 'up' },
                { label: 'Absence Rate', value: '3.2%', trend: 'down' }
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stat.value}</span>
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Engineering', 'Sales', 'Marketing', 'HR'].map((dept, index) => (
                <div key={dept} className="flex justify-between items-center">
                  <span className="text-sm">{dept}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Present: </span>
                      <span className="font-medium">{Math.floor(Math.random() * 50 + 30)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Hours: </span>
                      <span className="font-medium">{(Math.random() * 2 + 7).toFixed(1)}h</span>
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

  return (
    <SimpleDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Time & Attendance</h1>
          <p className="text-gray-600">Track employee time, manage schedules, and monitor attendance</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'tracking', label: 'Time Tracking' },
            { id: 'schedules', label: 'Schedules' },
            { id: 'pto', label: 'PTO Management' },
            { id: 'reports', label: 'Reports' }
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
        {activeTab === 'tracking' && renderTimeTracking()}
        {activeTab === 'schedules' && renderSchedules()}
        {activeTab === 'pto' && renderPTO()}
        {activeTab === 'reports' && renderReports()}

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedEmployee.name} - Attendance Details</h2>
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
                      <div><span className="font-medium">Position:</span> {selectedEmployee.position}</div>
                      <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                      <div><span className="font-medium">Employee ID:</span> {selectedEmployee.employeeId}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Today's Status</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedEmployee.status)}`}>
                          {selectedEmployee.status.toUpperCase()}
                        </span>
                      </div>
                      <div><span className="font-medium">Location:</span> {selectedEmployee.location || 'N/A'}</div>
                      <div><span className="font-medium">Hours Worked:</span> {selectedEmployee.hoursWorked}h</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Edit Time</Button>
                <Button variant="outline" className="flex-1">View History</Button>
              </div>
            </div>
          </div>
        )}

        {/* Time Entry Detail Modal */}
        {selectedTimeEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Time Entry Details</h2>
                <button
                  onClick={() => setSelectedTimeEntry(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Time Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Employee:</span> {selectedTimeEntry.employeeName || selectedTimeEntry.name}</div>
                      <div><span className="font-medium">Date:</span> {selectedTimeEntry.date || new Date().toISOString().split('T')[0]}</div>
                      <div><span className="font-medium">Clock In:</span> {selectedTimeEntry.clockIn}</div>
                      <div><span className="font-medium">Clock Out:</span> {selectedTimeEntry.clockOut || 'In Progress'}</div>
                      <div><span className="font-medium">Total Hours:</span> {selectedTimeEntry.totalHours || selectedTimeEntry.hoursWorked}h</div>
                      <div><span className="font-medium">Overtime:</span> {selectedTimeEntry.overtimeHours}h</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Additional Information</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Location:</span> {selectedTimeEntry.location}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTimeEntry.status)}`}>
                          {selectedTimeEntry.status.toUpperCase()}
                        </span>
                      </div>
                      {selectedTimeEntry.project && (
                        <div><span className="font-medium">Project:</span> {selectedTimeEntry.project}</div>
                      )}
                      {selectedTimeEntry.taskDescription && (
                        <div><span className="font-medium">Task:</span> {selectedTimeEntry.taskDescription}</div>
                      )}
                      {selectedTimeEntry.approvedBy && (
                        <div><span className="font-medium">Approved By:</span> {selectedTimeEntry.approvedBy}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedTimeEntry.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedTimeEntry.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Edit Entry</Button>
                <Button variant="outline" className="flex-1">Approve</Button>
                <Button variant="outline" className="flex-1">Export</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SimpleDashboardLayout>
  );
};

export default TimeAndAttendance;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
