import React from 'react';

export type MockAccount = {
  email: string;
  password: string;
  role: string;
  department?: string;
  name?: string;
  position?: string;
  description: string;
}

export const mockAccounts: MockAccount[] = [
  // System Administrators
  {
    email: 'admin@hrportal.com',
    password: 'admin123',
    role: 'admin',
    name: 'Alex Johnson',
    position: 'System Administrator',
    description: 'Full access to all features, settings, and workflows'
  },
  {
    email: 'it-admin@hrportal.com',
    password: 'admin123',
    role: 'admin',
    name: 'Taylor Chen',
    position: 'IT Administrator',
    department: 'IT',
    description: 'Full system access with focus on technical configurations'
  },
  
  // HR Department
  {
    email: 'hr-director@hrportal.com',
    password: 'hr123',
    role: 'hr_director',
    name: 'Morgan Williams',
    position: 'HR Director',
    department: 'Human Resources',
    description: 'Oversees all HR operations, policies and approvals'
  },
  {
    email: 'hr-manager@hrportal.com',
    password: 'hr123',
    role: 'hr_manager',
    name: 'Jamie Rodriguez',
    position: 'HR Manager',
    department: 'Human Resources',
    description: 'Manages HR processes, personnel records and compliance'
  },
  {
    email: 'hr-specialist@hrportal.com',
    password: 'hr123',
    role: 'hr',
    name: 'Robin Smith',
    position: 'HR Specialist',
    department: 'Human Resources',
    description: 'Handles onboarding, employee records, and general HR tasks'
  },
  
  // Recruitment Team
  {
    email: 'recruiting-manager@hrportal.com',
    password: 'recruit123',
    role: 'recruiting_manager',
    name: 'Dana Wilson',
    position: 'Recruiting Manager',
    department: 'Talent Acquisition',
    description: 'Manages recruitment processes, job postings, and hiring decisions'
  },
  {
    email: 'recruiter@hrportal.com',
    password: 'recruit123',
    role: 'recruiter',
    name: 'Jordan Lee',
    position: 'Recruiter',
    department: 'Talent Acquisition',
    description: 'Handles job postings, candidate screening, and interview scheduling'
  },
  
  // Department Managers
  {
    email: 'engineering-manager@hrportal.com',
    password: 'manager123',
    role: 'manager',
    name: 'Casey Mitchell',
    position: 'Engineering Manager',
    department: 'Engineering',
    description: 'Manages engineering team, approves leave, and conducts performance reviews'
  },
  {
    email: 'sales-manager@hrportal.com',
    password: 'manager123',
    role: 'manager',
    name: 'Riley Thompson',
    position: 'Sales Manager',
    department: 'Sales',
    description: 'Manages sales team, approves expenses, and handles department resources'
  },
  {
    email: 'finance-manager@hrportal.com',
    password: 'manager123',
    role: 'manager',
    name: 'Avery Garcia',
    position: 'Finance Manager',
    department: 'Finance',
    description: 'Manages finance team, approves budgets, and handles department reports'
  },
  
  // Team Leads
  {
    email: 'team-lead@hrportal.com',
    password: 'lead123',
    role: 'team_lead',
    name: 'Sam Parker',
    position: 'Team Lead',
    department: 'Engineering',
    description: 'Leads development team, initial approvals, and project management'
  },
  
  // Employees
  {
    email: 'engineer@hrportal.com',
    password: 'employee123',
    role: 'employee',
    name: 'Quinn Foster',
    position: 'Software Engineer',
    department: 'Engineering',
    description: 'Regular employee with access to self-service features'
  },
  {
    email: 'sales@hrportal.com',
    password: 'employee123',
    role: 'employee',
    name: 'Blake Roberts',
    position: 'Sales Representative',
    department: 'Sales',
    description: 'Regular employee with access to self-service features'
  },
  {
    email: 'accountant@hrportal.com',
    password: 'employee123',
    role: 'employee',
    name: 'Jesse Nguyen',
    position: 'Accountant',
    department: 'Finance',
    description: 'Regular employee with access to self-service features'
  },
  
  // Specialized Roles
  {
    email: 'payroll@hrportal.com',
    password: 'payroll123',
    role: 'payroll_admin',
    name: 'Reese Morgan',
    position: 'Payroll Administrator',
    department: 'Finance',
    description: 'Manages payroll processing, compensation, and benefits'
  },
  {
    email: 'compliance@hrportal.com',
    password: 'compliance123',
    role: 'compliance_officer',
    name: 'Drew Washington',
    position: 'Compliance Officer',
    department: 'Legal',
    description: 'Oversees compliance training, policies, and regulatory requirements'
  },
  {
    email: 'facilities@hrportal.com',
    password: 'facilities123',
    role: 'facilities_manager',
    name: 'Cameron Brooks',
    position: 'Facilities Manager',
    department: 'Operations',
    description: 'Manages workplace facilities, equipment, and resource booking'
  },
  {
    email: 'safety@hrportal.com',
    password: 'safety123',
    role: 'safety_officer',
    name: 'Hayden Cooper',
    position: 'Safety Officer',
    department: 'Operations',
    description: 'Manages workplace safety, incident reports, and safety training'
  }
];

interface MockAccountInfoProps {
  onSelect?: (account: MockAccount) => void;
  filterRoles?: string[];
}

export default function MockAccountInfo({ onSelect, filterRoles }: MockAccountInfoProps) {
  const displayAccounts = filterRoles 
    ? mockAccounts.filter(account => filterRoles.includes(account.role))
    : mockAccounts;

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Test Accounts</h2>
      <p className="text-sm text-gray-500 mb-4">Click on an account to automatically fill login credentials</p>
      
      <div className="space-y-3">
        {displayAccounts.map((account) => (
          <div 
            key={account.email}
            onClick={() => onSelect && onSelect(account)}
            className="p-3 bg-white rounded border border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{account.name || 'User'}</div>
                <div className="text-sm text-gray-600">{account.email}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{account.role}</span>
                {account.department && (
                  <span className="text-xs text-gray-500 mt-1">{account.department}</span>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>Password: {account.password}</span>
              <span className="italic">{account.position}</span>
            </div>
            <div className="mt-1 text-xs text-gray-600">{account.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 