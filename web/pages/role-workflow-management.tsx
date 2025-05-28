import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GetServerSideProps } from 'next';

// Enhanced types for role-workflow integration
interface RoleWorkflowAssignment {
  id: string;
  roleId: string;
  workflowId: string;
  assignmentType: 'approver' | 'reviewer' | 'notification' | 'escalation' | 'owner';
  priority: number;
  autoAssign: boolean;
  conditions?: string[];
  delegationAllowed: boolean;
  escalationTimeout?: number; // hours
}

interface WorkflowRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  hierarchyLevel: number;
  assignedWorkflows: RoleWorkflowAssignment[];
  userCount: number;
  complianceRequirements: string[];
  status: 'active' | 'inactive';
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'compliance' | 'hr' | 'finance' | 'operations' | 'custom';
  requiredRoles: string[];
  approvalSteps: WorkflowStep[];
  complianceRules: string[];
  automationLevel: 'manual' | 'semi-auto' | 'full-auto';
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
}

interface WorkflowStep {
  id: string;
  name: string;
  roleRequired: string;
  type: 'approval' | 'review' | 'notification' | 'task' | 'decision';
  isRequired: boolean;
  timeLimit?: number;
  escalationRule?: string;
  complianceChecks: string[];
}

export default function RoleWorkflowManagementPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const { hasPermission } = usePermissions();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roles' | 'workflows' | 'assignments' | 'compliance'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [workflowRoles, setWorkflowRoles] = useState<WorkflowRole[]>([]);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [assignments, setAssignments] = useState<RoleWorkflowAssignment[]>([]);
  const [selectedRole, setSelectedRole] = useState<WorkflowRole | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Check permissions - simplified to use role directly for better compatibility
  const hasAdminAccess = role === 'admin' || role === 'hr_director';
  const canManageRoles = hasAdminAccess || hasPermission('user_permissions', 'manage_settings');
  const canManageWorkflows = hasAdminAccess || hasPermission('workflows', 'manage_settings');

  useEffect(() => {
    // Skip permission check in development mode for testing
    if (process.env.NODE_ENV === 'development') {
      loadData();
      return;
    }

    if (!canManageRoles && !canManageWorkflows) {
      setPermissionError('You do not have permission to access this page');
      // Don't redirect immediately to show error message
      setTimeout(() => {
        router.push('/dashboard?error=insufficient_permissions');
      }, 3000);
    } else {
      loadData();
    }
  }, [canManageRoles, canManageWorkflows, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - in real implementation, fetch from API
      const mockRoles: WorkflowRole[] = [
        {
          id: 'role_admin',
          name: 'System Administrator',
          description: 'Full system access with all workflow permissions',
          permissions: ['*'],
          hierarchyLevel: 1,
          assignedWorkflows: [
            {
              id: 'aw_1',
              roleId: 'role_admin',
              workflowId: 'wf_policy_approval',
              assignmentType: 'owner',
              priority: 1,
              autoAssign: true,
              delegationAllowed: true
            }
          ],
          userCount: 3,
          complianceRequirements: ['SOX', 'GDPR', 'OSHA'],
          status: 'active'
        },
        {
          id: 'role_hr_manager',
          name: 'HR Manager',
          description: 'Human resources management with employee workflow access',
          permissions: ['hr:*', 'employee:*', 'compliance:view'],
          hierarchyLevel: 3,
          assignedWorkflows: [
            {
              id: 'aw_2',
              roleId: 'role_hr_manager',
              workflowId: 'wf_leave_approval',
              assignmentType: 'approver',
              priority: 2,
              autoAssign: true,
              delegationAllowed: true,
              escalationTimeout: 48
            },
            {
              id: 'aw_3',
              roleId: 'role_hr_manager',
              workflowId: 'wf_compliance_training',
              assignmentType: 'owner',
              priority: 1,
              autoAssign: true,
              delegationAllowed: false
            }
          ],
          userCount: 8,
          complianceRequirements: ['EEOC', 'FMLA', 'HIPAA'],
          status: 'active'
        },
        {
          id: 'role_compliance_officer',
          name: 'Compliance Officer',
          description: 'Compliance monitoring and audit workflow management',
          permissions: ['compliance:*', 'audit:*', 'policy:*'],
          hierarchyLevel: 2,
          assignedWorkflows: [
            {
              id: 'aw_4',
              roleId: 'role_compliance_officer',
              workflowId: 'wf_risk_assessment',
              assignmentType: 'owner',
              priority: 1,
              autoAssign: true,
              delegationAllowed: false
            },
            {
              id: 'aw_5',
              roleId: 'role_compliance_officer',
              workflowId: 'wf_audit_process',
              assignmentType: 'approver',
              priority: 1,
              autoAssign: true,
              delegationAllowed: true,
              escalationTimeout: 24
            }
          ],
          userCount: 2,
          complianceRequirements: ['SOX', 'GDPR', 'OSHA', 'HIPAA'],
          status: 'active'
        },
        {
          id: 'role_department_manager',
          name: 'Department Manager',
          description: 'Department-level approval authority for team workflows',
          permissions: ['team:*', 'approval:department'],
          hierarchyLevel: 4,
          assignedWorkflows: [
            {
              id: 'aw_6',
              roleId: 'role_department_manager',
              workflowId: 'wf_expense_approval',
              assignmentType: 'approver',
              priority: 1,
              autoAssign: true,
              delegationAllowed: true,
              escalationTimeout: 72
            }
          ],
          userCount: 15,
          complianceRequirements: ['SOX'],
          status: 'active'
        },
        {
          id: 'role_employee',
          name: 'Employee',
          description: 'Standard employee access for basic workflows',
          permissions: ['profile:edit', 'request:create'],
          hierarchyLevel: 6,
          assignedWorkflows: [
            {
              id: 'aw_7',
              roleId: 'role_employee',
              workflowId: 'wf_leave_request',
              assignmentType: 'owner',
              priority: 1,
              autoAssign: true,
              delegationAllowed: false
            }
          ],
          userCount: 247,
          complianceRequirements: ['GDPR'],
          status: 'active'
        }
      ];

      const mockWorkflowTemplates: WorkflowTemplate[] = [
        {
          id: 'wf_policy_approval',
          name: 'Policy Approval Workflow',
          description: 'Multi-step approval process for organizational policies',
          category: 'compliance',
          requiredRoles: ['role_compliance_officer', 'role_admin'],
          approvalSteps: [
            {
              id: 'step_1',
              name: 'Compliance Review',
              roleRequired: 'role_compliance_officer',
              type: 'review',
              isRequired: true,
              timeLimit: 48,
              complianceChecks: ['GDPR', 'SOX']
            },
            {
              id: 'step_2',
              name: 'Executive Approval',
              roleRequired: 'role_admin',
              type: 'approval',
              isRequired: true,
              timeLimit: 72,
              complianceChecks: []
            }
          ],
          complianceRules: ['SOX_404', 'GDPR_Art_25'],
          automationLevel: 'semi-auto',
          businessImpact: 'high'
        },
        {
          id: 'wf_leave_approval',
          name: 'Leave Request Approval',
          description: 'Employee leave request approval with manager escalation',
          category: 'hr',
          requiredRoles: ['role_department_manager', 'role_hr_manager'],
          approvalSteps: [
            {
              id: 'step_1',
              name: 'Manager Approval',
              roleRequired: 'role_department_manager',
              type: 'approval',
              isRequired: true,
              timeLimit: 48,
              escalationRule: 'escalate_to_hr',
              complianceChecks: ['FMLA']
            },
            {
              id: 'step_2',
              name: 'HR Notification',
              roleRequired: 'role_hr_manager',
              type: 'notification',
              isRequired: false,
              complianceChecks: []
            }
          ],
          complianceRules: ['FMLA_501'],
          automationLevel: 'semi-auto',
          businessImpact: 'medium'
        },
        {
          id: 'wf_compliance_training',
          name: 'Compliance Training Assignment',
          description: 'Automated compliance training assignment and tracking',
          category: 'compliance',
          requiredRoles: ['role_hr_manager', 'role_compliance_officer'],
          approvalSteps: [
            {
              id: 'step_1',
              name: 'Training Assignment',
              roleRequired: 'role_hr_manager',
              type: 'task',
              isRequired: true,
              complianceChecks: ['OSHA', 'GDPR']
            },
            {
              id: 'step_2',
              name: 'Compliance Verification',
              roleRequired: 'role_compliance_officer',
              type: 'approval',
              isRequired: true,
              timeLimit: 168, // 1 week
              complianceChecks: ['OSHA', 'GDPR']
            }
          ],
          complianceRules: ['OSHA_1926', 'GDPR_Art_32'],
          automationLevel: 'full-auto',
          businessImpact: 'high'
        },
        {
          id: 'wf_risk_assessment',
          name: 'Risk Assessment Process',
          description: 'Comprehensive risk assessment and mitigation workflow',
          category: 'compliance',
          requiredRoles: ['role_compliance_officer', 'role_admin'],
          approvalSteps: [
            {
              id: 'step_1',
              name: 'Risk Identification',
              roleRequired: 'role_compliance_officer',
              type: 'review',
              isRequired: true,
              timeLimit: 72,
              complianceChecks: ['SOX', 'COSO']
            },
            {
              id: 'step_2',
              name: 'Mitigation Planning',
              roleRequired: 'role_compliance_officer',
              type: 'task',
              isRequired: true,
              timeLimit: 120,
              complianceChecks: ['SOX']
            },
            {
              id: 'step_3',
              name: 'Executive Review',
              roleRequired: 'role_admin',
              type: 'approval',
              isRequired: true,
              timeLimit: 48,
              complianceChecks: []
            }
          ],
          complianceRules: ['SOX_302', 'SOX_404'],
          automationLevel: 'manual',
          businessImpact: 'critical'
        }
      ];

      setWorkflowRoles(mockRoles);
      setWorkflowTemplates(mockWorkflowTemplates);
      
      // Extract all assignments
      const allAssignments = mockRoles.flatMap(role => role.assignedWorkflows);
      setAssignments(allAssignments);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'compliance': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'hr': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'finance': return 'text-green-600 bg-green-50 border-green-200';
      case 'operations': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Page Title and Info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Role-Workflow Integration</h1>
        <p className="text-gray-600 mt-2">Manage role assignments and workflow permissions across the organization</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{workflowRoles.length}</div>
                <div className="text-sm text-gray-600">Active Roles</div>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{workflowTemplates.length}</div>
                <div className="text-sm text-gray-600">Workflow Templates</div>
              </div>
              <span className="text-2xl">⚙️</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{assignments.length}</div>
                <div className="text-sm text-gray-600">Active Assignments</div>
              </div>
              <span className="text-2xl">🔗</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
              <span className="text-2xl">🤖</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => alert('Creating new role with workflow assignments...')}
            >
              <span className="text-2xl mb-1">➕</span>
              <span className="text-sm">New Role</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => alert('Designing new workflow template...')}
            >
              <span className="text-2xl mb-1">🔧</span>
              <span className="text-sm">New Workflow</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => alert('Bulk assigning workflow permissions...')}
            >
              <span className="text-2xl mb-1">🔗</span>
              <span className="text-sm">Bulk Assign</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => alert('Generating role-workflow compliance report...')}
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">Compliance Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role-Workflow Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Workflow Assignment Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Users</th>
                  <th className="text-left p-3">Assigned Workflows</th>
                  <th className="text-left p-3">Compliance</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workflowRoles.map((role) => (
                  <tr key={role.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-gray-600">Level {role.hierarchyLevel}</div>
                    </td>
                    <td className="p-3">
                      {role.userCount}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {role.assignedWorkflows.map((assignment) => {
                          const workflow = workflowTemplates.find(w => w.id === assignment.workflowId);
                          return workflow ? (
                            <span 
                              key={assignment.id}
                              className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(workflow.category)}`}
                            >
                              {workflow.name.split(' ').slice(0, 2).join(' ')}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {role.complianceRequirements.map((req) => (
                          <span 
                            key={req}
                            className="text-xs px-2 py-1 rounded-full text-gray-600 bg-gray-100 border border-gray-200"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setSelectedRole(role)}
                        >
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          View
                        </button>
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

  // If permission error, show access denied message
  if (permissionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">{permissionError}</p>
            <p className="text-gray-500 text-sm mb-4">Redirecting to dashboard...</p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Head>
        <title>Role-Workflow Integration | HR Portal</title>
      </Head>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          {['dashboard', 'roles', 'workflows', 'assignments', 'compliance'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {/* Add other tab contents here */}
    </div>
  );
}

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
