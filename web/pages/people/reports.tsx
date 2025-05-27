import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import DataTable, { Column } from '@/components/ui/DataTable';

// Import same mock data used in the directory
const MOCK_PEOPLE = [
  { id: 1, name: 'Alice Johnson', role: 'HR Manager', department: 'Human Resources', location: 'New York', email: 'alice@example.com', phone: '(123) 456-7890', status: 'active', manager: 'Bob Smith', hireDate: '2019-05-12' },
  { id: 2, name: 'Bob Smith', role: 'CEO', department: 'Executive', location: 'New York', email: 'bob@example.com', phone: '(123) 456-7891', status: 'active', manager: null, hireDate: '2018-01-10' },
  { id: 3, name: 'Carlos Rodriguez', role: 'Software Engineer', department: 'Engineering', location: 'San Francisco', email: 'carlos@example.com', phone: '(123) 456-7892', status: 'active', manager: 'Diana Wong', hireDate: '2020-07-15' },
  { id: 4, name: 'Diana Wong', role: 'Engineering Director', department: 'Engineering', location: 'San Francisco', email: 'diana@example.com', phone: '(123) 456-7893', status: 'active', manager: 'Bob Smith', hireDate: '2019-03-20' },
  { id: 5, name: 'Emily Chen', role: 'Marketing Specialist', department: 'Marketing', location: 'Chicago', email: 'emily@example.com', phone: '(123) 456-7894', status: 'active', manager: 'Frank Miller', hireDate: '2021-02-10' },
  { id: 6, name: 'Frank Miller', role: 'Marketing Director', department: 'Marketing', location: 'Chicago', email: 'frank@example.com', phone: '(123) 456-7895', status: 'active', manager: 'Bob Smith', hireDate: '2018-11-05' },
  { id: 7, name: 'Grace Kim', role: 'UI/UX Designer', department: 'Design', location: 'Remote', email: 'grace@example.com', phone: '(123) 456-7896', status: 'active', manager: 'Diana Wong', hireDate: '2020-09-15' },
  { id: 8, name: 'Henry Wilson', role: 'Financial Analyst', department: 'Finance', location: 'New York', email: 'henry@example.com', phone: '(123) 456-7897', status: 'inactive', manager: 'Irene Lopez', hireDate: '2019-06-30' },
  { id: 9, name: 'Irene Lopez', role: 'Finance Director', department: 'Finance', location: 'New York', email: 'irene@example.com', phone: '(123) 456-7898', status: 'active', manager: 'Bob Smith', hireDate: '2018-05-20' },
  { id: 10, name: 'Jack Thompson', role: 'Sales Representative', department: 'Sales', location: 'Miami', email: 'jack@example.com', phone: '(123) 456-7899', status: 'active', manager: 'Kelly Brown', hireDate: '2021-01-10' },
  { id: 11, name: 'Kelly Brown', role: 'Sales Manager', department: 'Sales', location: 'Miami', email: 'kelly@example.com', phone: '(123) 456-7900', status: 'active', manager: 'Bob Smith', hireDate: '2019-04-05' },
  { id: 12, name: 'Leo Garcia', role: 'Customer Support', department: 'Support', location: 'Remote', email: 'leo@example.com', phone: '(123) 456-7901', status: 'active', manager: 'Maria Patel', hireDate: '2020-11-15' },
  { id: 13, name: 'Maria Patel', role: 'Support Manager', department: 'Support', location: 'Austin', email: 'maria@example.com', phone: '(123) 456-7902', status: 'active', manager: 'Bob Smith', hireDate: '2019-02-20' },
  { id: 14, name: 'Noah Robinson', role: 'DevOps Engineer', department: 'Engineering', location: 'San Francisco', email: 'noah@example.com', phone: '(123) 456-7903', status: 'active', manager: 'Diana Wong', hireDate: '2020-08-15' },
  { id: 15, name: 'Olivia Davis', role: 'Content Strategist', department: 'Marketing', location: 'Chicago', email: 'olivia@example.com', phone: '(123) 456-7904', status: 'active', manager: 'Frank Miller', hireDate: '2021-03-10' }
];

type PersonType = typeof MOCK_PEOPLE[0];

interface DepartmentMetric {
  department: string;
  count: number;
  percentage: number;
  averageTenure: number;
  activeCount: number;
  inactiveCount: number;
}

interface LocationMetric {
  location: string;
  count: number;
  percentage: number;
  departments: string[];
}

interface HiringTrend {
  period: string;
  count: number;
  departments: {
    [key: string]: number;
  };
}

const EmployeeReportsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [reportType, setReportType] = useState<'department' | 'location' | 'hiring' | 'tenure'>('department');
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetric[]>([]);
  const [locationMetrics, setLocationMetrics] = useState<LocationMetric[]>([]);
  const [hiringTrends, setHiringTrends] = useState<HiringTrend[]>([]);
  const [tenureData, setTenureData] = useState<any[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [activeEmployees, setActiveEmployees] = useState<number>(0);
  const [inactiveEmployees, setInactiveEmployees] = useState<number>(0);
  const [averageTenure, setAverageTenure] = useState<number>(0);

  // Ensure user has access to this page
  useEffect(() => {
    if (!allowAccess) {
      router.push('/login?redirect=/people/reports');
    }
  }, [allowAccess, router]);

  // Compute metrics on component mount
  useEffect(() => {
    // Calculate basic metrics
    const total = MOCK_PEOPLE.length;
    const active = MOCK_PEOPLE.filter(p => p.status === 'active').length;
    const inactive = total - active;
    
    setTotalEmployees(total);
    setActiveEmployees(active);
    setInactiveEmployees(inactive);

    // Calculate department metrics
    const departments: { [key: string]: any } = {};
    MOCK_PEOPLE.forEach(person => {
      if (!departments[person.department]) {
        departments[person.department] = {
          count: 0,
          active: 0,
          inactive: 0,
          totalTenure: 0
        };
      }
      
      departments[person.department].count++;
      
      if (person.status === 'active') {
        departments[person.department].active++;
      } else {
        departments[person.department].inactive++;
      }
      
      // Calculate tenure in months
      const hireDate = new Date(person.hireDate);
      const today = new Date();
      const tenureMonths = (today.getFullYear() - hireDate.getFullYear()) * 12 + 
        (today.getMonth() - hireDate.getMonth());
      
      departments[person.department].totalTenure += tenureMonths;
    });

    const departmentStats = Object.keys(departments).map(dept => ({
      department: dept,
      count: departments[dept].count,
      percentage: (departments[dept].count / total) * 100,
      averageTenure: departments[dept].totalTenure / departments[dept].count,
      activeCount: departments[dept].active,
      inactiveCount: departments[dept].inactive
    }));
    
    setDepartmentMetrics(departmentStats);

    // Calculate location metrics
    const locations: { [key: string]: any } = {};
    MOCK_PEOPLE.forEach(person => {
      if (!locations[person.location]) {
        locations[person.location] = {
          count: 0,
          departments: new Set()
        };
      }
      
      locations[person.location].count++;
      locations[person.location].departments.add(person.department);
    });

    const locationStats = Object.keys(locations).map(loc => ({
      location: loc,
      count: locations[loc].count,
      percentage: (locations[loc].count / total) * 100,
      departments: Array.from(locations[loc].departments) as string[]
    }));
    
    setLocationMetrics(locationStats);

    // Calculate hiring trends by quarter
    const hires: { [key: string]: any } = {};
    MOCK_PEOPLE.forEach(person => {
      const hireDate = new Date(person.hireDate);
      const quarter = `Q${Math.floor(hireDate.getMonth() / 3) + 1} ${hireDate.getFullYear()}`;
      
      if (!hires[quarter]) {
        hires[quarter] = {
          count: 0,
          departments: {}
        };
      }
      
      hires[quarter].count++;
      
      if (!hires[quarter].departments[person.department]) {
        hires[quarter].departments[person.department] = 0;
      }
      
      hires[quarter].departments[person.department]++;
    });

    const sortedQuarters = Object.keys(hires).sort((a, b) => {
      const [aQ, aY] = a.split(' ');
      const [bQ, bY] = b.split(' ');
      
      if (aY !== bY) {
        return parseInt(aY) - parseInt(bY);
      }
      
      return parseInt(aQ.substring(1)) - parseInt(bQ.substring(1));
    });

    const hiringStats = sortedQuarters.map(quarter => ({
      period: quarter,
      count: hires[quarter].count,
      departments: hires[quarter].departments
    }));
    
    setHiringTrends(hiringStats);

    // Calculate tenure distribution
    const tenureDistribution: { [key: string]: number } = {
      'Less than 1 year': 0,
      '1-2 years': 0,
      '2-3 years': 0,
      '3-4 years': 0,
      '4+ years': 0
    };
    
    let totalTenure = 0;
    
    MOCK_PEOPLE.forEach(person => {
      const hireDate = new Date(person.hireDate);
      const today = new Date();
      const tenureYears = (today.getFullYear() - hireDate.getFullYear()) + 
        (today.getMonth() - hireDate.getMonth()) / 12;
      
      totalTenure += tenureYears;
      
      if (tenureYears < 1) {
        tenureDistribution['Less than 1 year']++;
      } else if (tenureYears < 2) {
        tenureDistribution['1-2 years']++;
      } else if (tenureYears < 3) {
        tenureDistribution['2-3 years']++;
      } else if (tenureYears < 4) {
        tenureDistribution['3-4 years']++;
      } else {
        tenureDistribution['4+ years']++;
      }
    });
    
    setAverageTenure(totalTenure / total);
    
    const tenureStats = Object.keys(tenureDistribution).map(range => ({
      range,
      count: tenureDistribution[range],
      percentage: (tenureDistribution[range] / total) * 100
    }));
    
    setTenureData(tenureStats);
  }, []);

  const departmentColumns: Column<DepartmentMetric>[] = [
    { key: 'department', header: 'Department', accessor: 'department' },
    { key: 'count', header: 'Employee Count', accessor: 'count' },
    { 
      key: 'percentage', 
      header: 'Percentage', 
      accessor: 'percentage',
      cell: (value) => `${value.toFixed(1)}%`
    },
    {
      key: 'activeCount',
      header: 'Active',
      accessor: 'activeCount',
      cell: (value, row) => (
        <div className="flex items-center">
          <span className="font-medium">{value}</span>
          <span className="ml-2 text-xs text-gray-500">({((value / row!.count) * 100).toFixed(0)}%)</span>
        </div>
      )
    },
    {
      key: 'inactiveCount',
      header: 'Inactive',
      accessor: 'inactiveCount',
      cell: (value, row) => (
        <div className="flex items-center">
          <span className="font-medium">{value}</span>
          <span className="ml-2 text-xs text-gray-500">({((value / row!.count) * 100).toFixed(0)}%)</span>
        </div>
      )
    },
    {
      key: 'averageTenure',
      header: 'Avg. Tenure (months)',
      accessor: 'averageTenure',
      cell: (value) => value.toFixed(1)
    }
  ];

  const locationColumns: Column<LocationMetric>[] = [
    { key: 'location', header: 'Location', accessor: 'location' },
    { key: 'count', header: 'Employee Count', accessor: 'count' },
    { 
      key: 'percentage', 
      header: 'Percentage', 
      accessor: 'percentage',
      cell: (value) => `${value.toFixed(1)}%`
    },
    {
      key: 'departments',
      header: 'Departments',
      accessor: 'departments',
      cell: (departments) => (
        <div className="flex flex-wrap gap-1">
          {departments.slice(0, 3).map((dept: string, index: number) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {dept}
            </span>
          ))}
          {departments.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              +{departments.length - 3} more
            </span>
          )}
        </div>
      )
    }
  ];

  const trendsColumns: Column<HiringTrend>[] = [
    { key: 'period', header: 'Period', accessor: 'period' },
    { key: 'count', header: 'New Hires', accessor: 'count' },
    {
      key: 'departments',
      header: 'Top Departments',
      accessor: 'departments',
      cell: (departments) => {
        const sortedDepts = Object.entries(departments as Record<string, number>)
          .sort(([, aCount], [, bCount]) => (bCount as number) - (aCount as number))
          .slice(0, 2);
        
        return (
          <div className="space-y-1">
            {sortedDepts.map(([dept, count], index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs">{dept}</span>
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        );
      }
    }
  ];

  const tenureColumns: Column<any>[] = [
    { key: 'range', header: 'Tenure Range', accessor: 'range' },
    { key: 'count', header: 'Employee Count', accessor: 'count' },
    { 
      key: 'percentage', 
      header: 'Percentage', 
      accessor: 'percentage',
      cell: (value) => `${value.toFixed(1)}%`
    },
    {
      key: 'visualization',
      header: 'Distribution',
      accessor: 'percentage',
      cell: (value) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${value}%` }}
          ></div>
        </div>
      )
    }
  ];

  const renderReport = () => {
    switch (reportType) {
      case 'department':
        return (
          <DataTable 
            columns={departmentColumns}
            data={departmentMetrics}
          />
        );
      case 'location':
        return (
          <DataTable 
            columns={locationColumns}
            data={locationMetrics}
          />
        );
      case 'hiring':
        return (
          <DataTable 
            columns={trendsColumns}
            data={hiringTrends}
          />
        );
      case 'tenure':
        return (
          <DataTable 
            columns={tenureColumns}
            data={tenureData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Back button */}
        <div className="mb-4">
          <button 
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/people')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Directory
          </button>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Employees</div>
              <div className="text-3xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Active Employees</div>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
                <div className="ml-2 text-sm text-gray-500">({((activeEmployees / totalEmployees) * 100).toFixed(0)}%)</div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Inactive Employees</div>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold text-red-600">{inactiveEmployees}</div>
                <div className="ml-2 text-sm text-gray-500">({((inactiveEmployees / totalEmployees) * 100).toFixed(0)}%)</div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Average Tenure</div>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{averageTenure.toFixed(1)}</div>
                <div className="ml-2 text-sm text-gray-500">years</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report selection and display */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Employee Reports & Analytics</CardTitle>
                <CardDescription>View detailed reports and metrics about your organization</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={reportType === 'department' ? 'primary' : 'outline'}
                  onClick={() => setReportType('department')}
                >
                  By Department
                </Button>
                <Button 
                  variant={reportType === 'location' ? 'primary' : 'outline'}
                  onClick={() => setReportType('location')}
                >
                  By Location
                </Button>
                <Button 
                  variant={reportType === 'hiring' ? 'primary' : 'outline'}
                  onClick={() => setReportType('hiring')}
                >
                  Hiring Trends
                </Button>
                <Button 
                  variant={reportType === 'tenure' ? 'primary' : 'outline'}
                  onClick={() => setReportType('tenure')}
                >
                  Tenure Analysis
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderReport()}
          </CardContent>
        </Card>

        {/* Export options */}
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline"
            onClick={() => alert('Report would be exported as CSV')}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => alert('Report would be exported as PDF')}
            className="ml-2 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeReportsPage; 