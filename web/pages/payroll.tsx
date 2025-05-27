import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [showEditSalaryForm, setShowEditSalaryForm] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showDeductionForm, setShowDeductionForm] = useState(false);
  const [showPayrollProcessForm, setShowPayrollProcessForm] = useState(false);

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    department: '',
    payType: 'salary',
    baseSalary: '',
    hourlyRate: '',
    startDate: '',
    taxExemptions: '0',
    benefits: {
      health_insurance: false,
      dental_insurance: false,
      retirement_401k: false,
      life_insurance: false
    }
  });

  const [salaryForm, setSalaryForm] = useState({
    employeeId: '',
    payType: 'salary',
    baseSalary: '',
    hourlyRate: '',
    effectiveDate: '',
    reason: '',
    bonus: '',
    commission: ''
  });

  const [taxForm, setTaxForm] = useState({
    name: '',
    type: 'federal',
    rate: '',
    calculation: 'percentage',
    applicableGross: 'all',
    limit: '',
    status: 'active'
  });

  const [deductionForm, setDeductionForm] = useState({
    name: '',
    type: 'pre_tax',
    amount: '',
    calculation: 'fixed',
    frequency: 'monthly',
    isActive: true,
    description: ''
  });

  const [payrollProcessForm, setPayrollProcessForm] = useState({
    period: '',
    startDate: '',
    endDate: '',
    payDate: '',
    includeBonus: false,
    includeCommission: false,
    includeOvertime: true,
    notes: ''
  });

  const payrollMetrics = [
    { label: 'Total Payroll', value: '$485,600', icon: '💰', color: 'text-green-600', trend: 'up' },
    { label: 'Employees Paid', value: '247', icon: '👥', color: 'text-blue-600', trend: 'stable' },
    { label: 'Processing Status', value: '98%', icon: '⚡', color: 'text-purple-600', trend: 'up' },
    { label: 'Tax Liability', value: '$124,800', icon: '🏛️', color: 'text-orange-600', trend: 'down' }
  ];

  const payrollPeriods = [
    {
      id: 'payroll-001',
      period: 'June 2024',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      payDate: '2024-07-05',
      status: 'processing',
      totalGross: 485600,
      totalNet: 364200,
      totalDeductions: 121400,
      totalTaxes: 97120,
      employeeCount: 247,
      hoursWorked: 39456,
      overtimeHours: 1248,
      bonuses: 15600,
      commissions: 8900,
      processingProgress: 85
    },
    {
      id: 'payroll-002',
      period: 'May 2024',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      payDate: '2024-06-05',
      status: 'completed',
      totalGross: 478200,
      totalNet: 358650,
      totalDeductions: 119550,
      totalTaxes: 95640,
      employeeCount: 245,
      hoursWorked: 39200,
      overtimeHours: 1156,
      bonuses: 12400,
      commissions: 7800,
      processingProgress: 100
    },
    {
      id: 'payroll-003',
      period: 'April 2024',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      payDate: '2024-05-05',
      status: 'completed',
      totalGross: 461800,
      totalNet: 346350,
      totalDeductions: 115450,
      totalTaxes: 92360,
      employeeCount: 243,
      hoursWorked: 38864,
      overtimeHours: 967,
      bonuses: 8600,
      commissions: 6200,
      processingProgress: 100
    }
  ];

  const employeePayroll = [
    {
      id: 'emp-pay-001',
      employeeId: 'EMP-2024-045',
      name: 'Sarah Johnson',
      position: 'Senior Developer',
      department: 'Engineering',
      payType: 'salary',
      baseSalary: 95000,
      hourlyRate: null,
      hoursWorked: 160,
      overtimeHours: 8,
      grossPay: 8250.50,
      netPay: 6187.88,
      deductions: {
        federal_tax: 1485.00,
        state_tax: 577.53,
        social_security: 511.33,
        medicare: 119.63,
        health_insurance: 285.00,
        dental_insurance: 45.00,
        retirement_401k: 825.05,
        life_insurance: 12.00
      },
      bonuses: 500.00,
      commissions: 0,
      reimbursements: 125.50,
      ytdGross: 49503.00,
      ytdNet: 37127.28,
      lastPayDate: '2024-06-05'
    },
    {
      id: 'emp-pay-002',
      employeeId: 'EMP-2024-032',
      name: 'Michael Chen',
      position: 'Sales Manager',
      department: 'Sales',
      payType: 'salary_commission',
      baseSalary: 85000,
      hourlyRate: null,
      hoursWorked: 160,
      overtimeHours: 12,
      grossPay: 8645.25,
      netPay: 6483.94,
      deductions: {
        federal_tax: 1555.15,
        state_tax: 605.17,
        social_security: 536.00,
        medicare: 125.36,
        health_insurance: 285.00,
        dental_insurance: 45.00,
        retirement_401k: 691.62,
        life_insurance: 12.00
      },
      bonuses: 0,
      commissions: 1562.50,
      reimbursements: 89.75,
      ytdGross: 51871.50,
      ytdNet: 38903.63,
      lastPayDate: '2024-06-05'
    },
    {
      id: 'emp-pay-003',
      employeeId: 'EMP-2024-018',
      name: 'Emily Rodriguez',
      position: 'Marketing Specialist',
      department: 'Marketing',
      payType: 'hourly',
      baseSalary: null,
      hourlyRate: 32.50,
      hoursWorked: 152,
      overtimeHours: 6,
      grossPay: 5232.50,
      netPay: 3924.38,
      deductions: {
        federal_tax: 941.85,
        state_tax: 366.28,
        social_security: 324.41,
        medicare: 75.87,
        health_insurance: 215.00,
        dental_insurance: 32.50,
        retirement_401k: 418.60,
        life_insurance: 8.00
      },
      bonuses: 0,
      commissions: 0,
      reimbursements: 45.00,
      ytdGross: 31395.00,
      ytdNet: 23546.25,
      lastPayDate: '2024-06-05'
    }
  ];

  const taxSettings = [
    {
      id: 'tax-001',
      name: 'Federal Income Tax',
      type: 'federal',
      rate: 18.0,
      calculation: 'percentage',
      applicableGross: 'all',
      status: 'active',
      lastUpdated: '2024-01-01'
    },
    {
      id: 'tax-002',
      name: 'State Income Tax',
      type: 'state',
      rate: 7.0,
      calculation: 'percentage',
      applicableGross: 'all',
      status: 'active',
      lastUpdated: '2024-01-01'
    },
    {
      id: 'tax-003',
      name: 'Social Security',
      type: 'federal',
      rate: 6.2,
      calculation: 'percentage',
      applicableGross: 'up_to_limit',
      limit: 160200,
      status: 'active',
      lastUpdated: '2024-01-01'
    },
    {
      id: 'tax-004',
      name: 'Medicare',
      type: 'federal',
      rate: 1.45,
      calculation: 'percentage',
      applicableGross: 'all',
      status: 'active',
      lastUpdated: '2024-01-01'
    }
  ];

  const deductionTypes = [
    {
      id: 'ded-001',
      name: 'Health Insurance',
      type: 'benefit',
      category: 'pre_tax',
      defaultAmount: 285.00,
      frequency: 'monthly',
      status: 'active',
      description: 'Employee health insurance premium'
    },
    {
      id: 'ded-002',
      name: '401(k) Contribution',
      type: 'retirement',
      category: 'pre_tax',
      defaultAmount: null,
      percentage: 10.0,
      frequency: 'per_paycheck',
      status: 'active',
      description: 'Employee 401(k) retirement contribution'
    },
    {
      id: 'ded-003',
      name: 'Dental Insurance',
      type: 'benefit',
      category: 'pre_tax',
      defaultAmount: 45.00,
      frequency: 'monthly',
      status: 'active',
      description: 'Employee dental insurance premium'
    },
    {
      id: 'ded-004',
      name: 'Life Insurance',
      type: 'benefit',
      category: 'post_tax',
      defaultAmount: 12.00,
      frequency: 'monthly',
      status: 'active',
      description: 'Basic life insurance premium'
    }
  ];

  const payrollReports = [
    {
      id: 'report-001',
      name: 'Payroll Summary Report',
      type: 'summary',
      period: 'June 2024',
      generatedDate: '2024-06-30',
      generatedBy: 'Payroll Administrator',
      status: 'ready',
      fileSize: '2.4 MB'
    },
    {
      id: 'report-002',
      name: 'Tax Liability Report',
      type: 'tax',
      period: 'Q2 2024',
      generatedDate: '2024-06-30',
      generatedBy: 'Finance Team',
      status: 'ready',
      fileSize: '1.8 MB'
    },
    {
      id: 'report-003',
      name: 'Employee Earnings Statement',
      type: 'earnings',
      period: 'June 2024',
      generatedDate: '2024-07-01',
      generatedBy: 'HR System',
      status: 'processing',
      fileSize: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayTypeIcon = (type) => {
    switch (type) {
      case 'salary': return '💼';
      case 'hourly': return '⏰';
      case 'salary_commission': return '💼💰';
      case 'contract': return '📋';
      default: return '💰';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Payroll Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {payrollMetrics.map((metric, index) => (
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
              <span className="text-2xl mb-1">▶️</span>
              <span className="text-sm">Run Payroll</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">Generate Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🧾</span>
              <span className="text-sm">View Pay Stubs</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">⚙️</span>
              <span className="text-sm">Tax Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Payroll Period */}
      <Card>
        <CardHeader>
          <CardTitle>Current Payroll Period - June 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Pay Period: June 1 - June 30, 2024</h3>
                <p className="text-sm text-gray-600">Pay Date: July 5, 2024</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('processing')}`}>
                PROCESSING
              </span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Processing Progress</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$485,600</div>
                <div className="text-sm text-gray-600">Total Gross</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$364,200</div>
                <div className="text-sm text-gray-600">Total Net</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">$121,400</div>
                <div className="text-sm text-gray-600">Total Deductions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">247</div>
                <div className="text-sm text-gray-600">Employees</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payroll Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payroll Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payrollPeriods.slice(0, 3).map((period) => (
                <div key={period.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{period.period}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(period.status)}`}>
                      {period.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Gross: </span>
                      <span className="font-medium">${period.totalGross.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Net: </span>
                      <span className="font-medium">${period.totalNet.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Employees: </span>
                      <span className="font-medium">{period.employeeCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Summary (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Federal Income Tax', amount: 89145, rate: '18.0%' },
                { name: 'State Income Tax', amount: 34628, rate: '7.0%' },
                { name: 'Social Security', amount: 30667, rate: '6.2%' },
                { name: 'Medicare', amount: 7173, rate: '1.45%' }
              ].map((tax, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{tax.name}</div>
                    <div className="text-sm text-gray-600">{tax.rate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">${tax.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPayrollPeriods = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Payroll Periods</h2>
        <Button>Create New Period</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {payrollPeriods.map((period) => (
          <Card key={period.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{period.period}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(period.status)}`}>
                  {period.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Period Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Start Date:</span> {new Date(period.startDate).toLocaleDateString()}</div>
                    <div><span className="font-medium">End Date:</span> {new Date(period.endDate).toLocaleDateString()}</div>
                    <div><span className="font-medium">Pay Date:</span> {new Date(period.payDate).toLocaleDateString()}</div>
                    <div><span className="font-medium">Employees:</span> {period.employeeCount}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Hours & Compensation</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Regular Hours:</span> {period.hoursWorked.toLocaleString()}</div>
                    <div><span className="font-medium">Overtime Hours:</span> {period.overtimeHours.toLocaleString()}</div>
                    <div><span className="font-medium">Bonuses:</span> ${period.bonuses.toLocaleString()}</div>
                    <div><span className="font-medium">Commissions:</span> ${period.commissions.toLocaleString()}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Financial Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Gross Pay:</span> ${period.totalGross.toLocaleString()}</div>
                    <div><span className="font-medium">Total Deductions:</span> ${period.totalDeductions.toLocaleString()}</div>
                    <div><span className="font-medium">Total Taxes:</span> ${period.totalTaxes.toLocaleString()}</div>
                    <div><span className="font-medium">Net Pay:</span> ${period.totalNet.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {period.status === 'processing' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Processing Progress</span>
                    <span className="text-sm font-medium">{period.processingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${period.processingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedPayroll(period)}
                >
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Generate Report
                </Button>
                {period.status === 'processing' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    Continue Processing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Employee Payroll</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
            <option>Finance</option>
          </select>
          <Button>Export Payroll Data</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Pay Type</th>
                  <th className="text-left p-4">Hours</th>
                  <th className="text-left p-4">Gross Pay</th>
                  <th className="text-left p-4">Deductions</th>
                  <th className="text-left p-4">Net Pay</th>
                  <th className="text-left p-4">YTD Gross</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeePayroll.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{getPayTypeIcon(employee.payType)}</span>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-600">{employee.position}</div>
                          <div className="text-xs text-gray-500">{employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium capitalize">{employee.payType.replace('_', ' + ')}</div>
                      <div className="text-sm text-gray-600">
                        {employee.baseSalary ? `$${employee.baseSalary.toLocaleString()}/yr` : 
                         employee.hourlyRate ? `$${employee.hourlyRate}/hr` : ''}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{employee.hoursWorked}h</div>
                      {employee.overtimeHours > 0 && (
                        <div className="text-sm text-orange-600">+{employee.overtimeHours}h OT</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">${employee.grossPay.toLocaleString()}</div>
                      {(employee.bonuses > 0 || employee.commissions > 0) && (
                        <div className="text-sm text-green-600">
                          +${(employee.bonuses + employee.commissions).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-red-600">
                        ${Object.values(employee.deductions).reduce((a: number, b: number) => a + b, 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-green-600">${employee.netPay.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">${employee.ytdGross.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          View
                        </Button>
                        <Button size="sm" variant="outline">Pay Stub</Button>
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

  const renderTaxes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tax Settings</h2>
        <Button>Add Tax Type</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Tax Type</th>
                  <th className="text-left p-4">Rate</th>
                  <th className="text-left p-4">Calculation</th>
                  <th className="text-left p-4">Applicable To</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Last Updated</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taxSettings.map((tax) => (
                  <tr key={tax.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{tax.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{tax.type}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{tax.rate}%</div>
                      {tax.limit && (
                        <div className="text-sm text-gray-600">Up to ${tax.limit.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="p-4 capitalize">{tax.calculation}</td>
                    <td className="p-4 capitalize">{tax.applicableGross.replace('_', ' ')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tax.status)}`}>
                        {tax.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{new Date(tax.lastUpdated).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">History</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deduction Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deductionTypes.map((deduction) => (
              <div key={deduction.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{deduction.name}</h3>
                    <p className="text-sm text-gray-600">{deduction.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(deduction.status)}`}>
                    {deduction.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type: </span>
                    <span className="font-medium capitalize">{deduction.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category: </span>
                    <span className="font-medium capitalize">{deduction.category.replace('_', '-')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount: </span>
                    <span className="font-medium">
                      {deduction.defaultAmount ? `$${deduction.defaultAmount}` : 
                       deduction.percentage ? `${deduction.percentage}%` : 'Variable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Frequency: </span>
                    <span className="font-medium capitalize">{deduction.frequency.replace('_', ' ')}</span>
                  </div>
                </div>
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
        <h2 className="text-lg font-semibold">Payroll Reports</h2>
        <Button>Generate New Report</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Report Name</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Period</th>
                  <th className="text-left p-4">Generated Date</th>
                  <th className="text-left p-4">Generated By</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrollReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{report.name}</div>
                      {report.fileSize && (
                        <div className="text-sm text-gray-600">{report.fileSize}</div>
                      )}
                    </td>
                    <td className="p-4 capitalize">{report.type}</td>
                    <td className="p-4">{report.period}</td>
                    <td className="p-4">{new Date(report.generatedDate).toLocaleDateString()}</td>
                    <td className="p-4">{report.generatedBy}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {report.status === 'ready' ? (
                          <>
                            <Button size="sm" variant="outline">Download</Button>
                            <Button size="sm" variant="outline">View</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Processing...
                          </Button>
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
    </div>
  );

  // Form submission handlers
  const handleAddEmployee = (e) => {
    e.preventDefault();
    console.log('Adding employee:', employeeForm);
    // Add employee logic here
    setShowAddEmployeeForm(false);
    setEmployeeForm({
      name: '',
      position: '',
      department: '',
      payType: 'salary',
      baseSalary: '',
      hourlyRate: '',
      startDate: '',
      taxExemptions: '0',
      benefits: {
        health_insurance: false,
        dental_insurance: false,
        retirement_401k: false,
        life_insurance: false
      }
    });
  };

  const handleEditSalary = (e) => {
    e.preventDefault();
    console.log('Updating salary:', salaryForm);
    // Update salary logic here
    setShowEditSalaryForm(false);
    setSalaryForm({
      employeeId: '',
      payType: 'salary',
      baseSalary: '',
      hourlyRate: '',
      effectiveDate: '',
      reason: '',
      bonus: '',
      commission: ''
    });
  };

  const handleAddTax = (e) => {
    e.preventDefault();
    console.log('Adding tax setting:', taxForm);
    // Add tax logic here
    setShowTaxForm(false);
    setTaxForm({
      name: '',
      type: 'federal',
      rate: '',
      calculation: 'percentage',
      applicableGross: 'all',
      limit: '',
      status: 'active'
    });
  };

  const handleAddDeduction = (e) => {
    e.preventDefault();
    console.log('Adding deduction:', deductionForm);
    // Add deduction logic here
    setShowDeductionForm(false);
    setDeductionForm({
      name: '',
      type: 'pre_tax',
      amount: '',
      calculation: 'fixed',
      frequency: 'monthly',
      isActive: true,
      description: ''
    });
  };

  const handleProcessPayroll = (e) => {
    e.preventDefault();
    console.log('Processing payroll:', payrollProcessForm);
    // Process payroll logic here
    setShowPayrollProcessForm(false);
    setPayrollProcessForm({
      period: '',
      startDate: '',
      endDate: '',
      payDate: '',
      includeBonus: false,
      includeCommission: false,
      includeOvertime: true,
      notes: ''
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
          <p className="text-gray-600">Manage employee payroll, taxes, deductions, and reports</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'periods', label: 'Payroll Periods' },
            { id: 'employees', label: 'Employee Payroll' },
            { id: 'taxes', label: 'Tax & Deductions' },
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
        {activeTab === 'periods' && renderPayrollPeriods()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'taxes' && renderTaxes()}
        {activeTab === 'reports' && renderReports()}

        {/* Payroll Period Detail Modal */}
        {selectedPayroll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Payroll Period - {selectedPayroll.period}</h2>
                <button
                  onClick={() => setSelectedPayroll(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Period Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Period:</span> {selectedPayroll.period}</div>
                      <div><span className="font-medium">Start Date:</span> {new Date(selectedPayroll.startDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">End Date:</span> {new Date(selectedPayroll.endDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Pay Date:</span> {new Date(selectedPayroll.payDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPayroll.status)}`}>
                          {selectedPayroll.status.toUpperCase()}
                        </span>
                      </div>
                      <div><span className="font-medium">Employees:</span> {selectedPayroll.employeeCount}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Total Gross:</span> ${selectedPayroll.totalGross.toLocaleString()}</div>
                      <div><span className="font-medium">Total Deductions:</span> ${selectedPayroll.totalDeductions.toLocaleString()}</div>
                      <div><span className="font-medium">Total Taxes:</span> ${selectedPayroll.totalTaxes.toLocaleString()}</div>
                      <div><span className="font-medium">Total Net:</span> ${selectedPayroll.totalNet.toLocaleString()}</div>
                      <div><span className="font-medium">Bonuses:</span> ${selectedPayroll.bonuses.toLocaleString()}</div>
                      <div><span className="font-medium">Commissions:</span> ${selectedPayroll.commissions.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Hours Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Regular Hours:</span> {selectedPayroll.hoursWorked.toLocaleString()}</div>
                    <div><span className="font-medium">Overtime Hours:</span> {selectedPayroll.overtimeHours.toLocaleString()}</div>
                  </div>
                </div>
                
                {selectedPayroll.status === 'processing' && (
                  <div>
                    <h4 className="font-medium mb-3">Processing Status</h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{selectedPayroll.processingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${selectedPayroll.processingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Generate Report</Button>
                <Button variant="outline" className="flex-1">View Employee Details</Button>
                {selectedPayroll.status === 'processing' && (
                  <Button variant="outline" className="flex-1">Continue Processing</Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Employee Payroll Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedEmployee.name} - Payroll Details</h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Employee Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Employee ID:</span> {selectedEmployee.employeeId}</div>
                      <div><span className="font-medium">Position:</span> {selectedEmployee.position}</div>
                      <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                      <div><span className="font-medium">Pay Type:</span> {selectedEmployee.payType.replace('_', ' + ')}</div>
                      <div><span className="font-medium">Base Salary:</span> {selectedEmployee.baseSalary ? `$${selectedEmployee.baseSalary.toLocaleString()}/year` : 'N/A'}</div>
                      <div><span className="font-medium">Hourly Rate:</span> {selectedEmployee.hourlyRate ? `$${selectedEmployee.hourlyRate}/hour` : 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Current Period</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Hours Worked:</span> {selectedEmployee.hoursWorked}</div>
                      <div><span className="font-medium">Overtime Hours:</span> {selectedEmployee.overtimeHours}</div>
                      <div><span className="font-medium">Gross Pay:</span> ${selectedEmployee.grossPay.toLocaleString()}</div>
                      <div><span className="font-medium">Net Pay:</span> ${selectedEmployee.netPay.toLocaleString()}</div>
                      <div><span className="font-medium">Bonuses:</span> ${selectedEmployee.bonuses.toLocaleString()}</div>
                      <div><span className="font-medium">Commissions:</span> ${selectedEmployee.commissions.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Deductions Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedEmployee.deductions).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-medium">${value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Deductions</span>
                      <span>${Object.values(selectedEmployee.deductions).reduce((a: number, b: number) => a + b, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Year-to-Date Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">YTD Gross:</span> ${selectedEmployee.ytdGross.toLocaleString()}</div>
                    <div><span className="font-medium">YTD Net:</span> ${selectedEmployee.ytdNet.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Generate Pay Stub</Button>
                <Button variant="outline" className="flex-1">Edit Deductions</Button>
                <Button variant="outline" className="flex-1">View History</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PayrollManagement; 
