import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionGuard, PermissionButton } from '../components/ui/PermissionGuard';
import { shouldBypassAuth } from '@/lib/auth';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { GetServerSideProps } from 'next';

// Offboarding types
interface OffboardingCase {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  department: string;
  position: string;
  manager_id: string;
  manager_name: string;
  termination_type: 'voluntary' | 'involuntary' | 'retirement' | 'contract_end' | 'layoff';
  reason: string;
  last_working_day: string;
  notice_period_days: number;
  status: 'initiated' | 'in_progress' | 'pending_clearance' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  initiated_by: string;
  initiated_at: string;
  completed_at?: string;
  checklist_items: ChecklistItem[];
  exit_interview: ExitInterview | null;
  assets: AssetReturn[];
  access_revocation: AccessRevocation[];
  knowledge_transfer: KnowledgeTransfer[];
  clearances: Clearance[];
  documents: OffboardingDocument[];
  final_settlement: FinalSettlement | null;
  alumni_status?: AlumniStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface ChecklistItem {
  id: string;
  category: 'documentation' | 'assets' | 'access' | 'knowledge_transfer' | 'hr_tasks' | 'finance' | 'it' | 'facilities';
  task: string;
  description: string;
  responsible_party: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
  completed_by?: string;
  completed_at?: string;
  evidence?: string;
  notes?: string;
  is_mandatory: boolean;
  dependencies: string[];
}

interface ExitInterview {
  id: string;
  interviewer_id: string;
  interviewer_name: string;
  interview_date: string;
  interview_type: 'in_person' | 'virtual' | 'survey_only';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  survey_responses: SurveyResponse[];
  feedback: string;
  recommendations: string[];
  satisfaction_rating: number; // 1-5
  would_recommend_company: boolean;
  rehire_eligible: boolean;
  conducted_at?: string;
}

interface SurveyResponse {
  question_id: string;
  question: string;
  category: 'job_satisfaction' | 'management' | 'work_environment' | 'compensation' | 'growth_opportunities' | 'work_life_balance';
  response_type: 'rating' | 'text' | 'multiple_choice' | 'yes_no';
  response: any;
  score?: number;
}

interface AssetReturn {
  id: string;
  asset_id: string;
  asset_name: string;
  asset_type: 'laptop' | 'phone' | 'tablet' | 'monitor' | 'keyboard' | 'mouse' | 'headset' | 'badge' | 'keys' | 'uniform' | 'other';
  serial_number?: string;
  assigned_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  condition_on_return?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'lost';
  return_location: string;
  received_by?: string;
  status: 'pending' | 'returned' | 'damaged' | 'lost' | 'not_applicable';
  replacement_cost?: number;
  notes?: string;
}

interface AccessRevocation {
  id: string;
  system_name: string;
  access_type: 'email' | 'vpn' | 'application' | 'database' | 'building' | 'parking' | 'cloud_service';
  account_id: string;
  revocation_date: string;
  revoked_by?: string;
  status: 'pending' | 'revoked' | 'disabled' | 'deleted' | 'failed' | 'not_applicable';
  backup_required: boolean;
  backup_status?: 'pending' | 'completed' | 'not_required';
  data_location?: string;
  retention_period?: string;
  notes?: string;
}

interface KnowledgeTransfer {
  id: string;
  area: string;
  description: string;
  transfer_to_id: string;
  transfer_to_name: string;
  transfer_method: 'documentation' | 'shadowing' | 'training_session' | 'video_recording' | 'handover_meeting';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_hours: number;
  actual_hours?: number;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
  documents_created: string[];
  knowledge_gaps?: string[];
  completed_at?: string;
  notes?: string;
}

interface Clearance {
  id: string;
  department: string;
  clearance_type: 'hr' | 'finance' | 'it' | 'facilities' | 'security' | 'legal' | 'manager';
  clearer_id: string;
  clearer_name: string;
  requirements: string[];
  due_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'conditionally_approved';
  cleared_at?: string;
  conditions?: string[];
  notes?: string;
}

interface OffboardingDocument {
  id: string;
  name: string;
  type: 'resignation_letter' | 'termination_letter' | 'exit_interview_form' | 'asset_return_receipt' | 'clearance_certificate' | 'final_settlement' | 'non_compete' | 'other';
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
  signed: boolean;
  signed_at?: string;
  version: string;
}

interface FinalSettlement {
  id: string;
  final_salary: number;
  unused_leave_payment: number;
  bonus_payment: number;
  deductions: SettlementDeduction[];
  total_amount: number;
  currency: string;
  payment_date: string;
  payment_method: 'bank_transfer' | 'check' | 'cash';
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  processed_by?: string;
  notes?: string;
}

interface SettlementDeduction {
  type: 'asset_replacement' | 'overpaid_salary' | 'advance_recovery' | 'other';
  description: string;
  amount: number;
  reason: string;
}

interface AlumniStatus {
  eligible_for_alumni_network: boolean;
  alumni_group: string;
  contact_preferences: string[];
  future_opportunities: boolean;
  reference_eligible: boolean;
  rehire_status: 'eligible' | 'not_eligible' | 'conditional';
  rehire_conditions?: string[];
}

const OffboardingManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const allowAccess = shouldBypassAuth(router.query);
  
  const [isLoading, setIsLoading] = useState(true);
  const [offboardingCases, setOffboardingCases] = useState<OffboardingCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<OffboardingCase | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockOffboardingCases: OffboardingCase[] = [
    {
      id: 'ob-001',
      employee_id: 'emp-045',
      employee_name: 'John Smith',
      employee_email: 'john.smith@company.com',
    department: 'Engineering',
      position: 'Senior Software Engineer',
      manager_id: 'mgr-012',
      manager_name: 'Sarah Johnson',
      termination_type: 'voluntary',
      reason: 'Career advancement opportunity',
      last_working_day: '2024-07-15',
      notice_period_days: 14,
    status: 'in_progress',
      priority: 'medium',
      initiated_by: 'HR Team',
      initiated_at: '2024-07-01T09:00:00Z',
      checklist_items: [
        {
          id: 'ci-001',
          category: 'documentation',
          task: 'Collect resignation letter',
          description: 'Obtain signed resignation letter with last working day',
          responsible_party: 'HR Team',
          due_date: '2024-07-02',
    status: 'completed',
          completed_by: 'Alice Johnson',
          completed_at: '2024-07-01T15:30:00Z',
          is_mandatory: true,
          dependencies: []
        },
        {
          id: 'ci-002',
          category: 'assets',
          task: 'Return company laptop',
          description: 'Collect company-issued laptop and accessories',
          responsible_party: 'IT Department',
          due_date: '2024-07-15',
          status: 'pending',
          is_mandatory: true,
          dependencies: []
        },
        {
          id: 'ci-003',
          category: 'access',
          task: 'Revoke system access',
          description: 'Disable all system accounts and permissions',
          responsible_party: 'IT Security',
          due_date: '2024-07-15',
          status: 'pending',
          is_mandatory: true,
          dependencies: []
        }
      ],
      exit_interview: {
        id: 'ei-001',
        interviewer_id: 'hr-001',
        interviewer_name: 'Alice Johnson',
        interview_date: '2024-07-14',
        interview_type: 'in_person',
        status: 'scheduled',
        survey_responses: [],
        feedback: '',
        recommendations: [],
        satisfaction_rating: 0,
        would_recommend_company: false,
        rehire_eligible: true
      },
      assets: [
        {
          id: 'ar-001',
          asset_id: 'LAP-1234',
          asset_name: 'MacBook Pro 16"',
          asset_type: 'laptop',
          serial_number: 'MBP123456',
          assigned_date: '2023-01-15',
          expected_return_date: '2024-07-15',
          return_location: 'IT Department',
          status: 'pending'
        },
        {
          id: 'ar-002',
          asset_id: 'PHN-5678',
          asset_name: 'iPhone 14 Pro',
          asset_type: 'phone',
          serial_number: 'IP123456',
          assigned_date: '2023-01-15',
          expected_return_date: '2024-07-15',
          return_location: 'IT Department',
          status: 'pending'
        }
      ],
      access_revocation: [
        {
          id: 'ar-001',
          system_name: 'Corporate Email',
          access_type: 'email',
          account_id: 'john.smith@company.com',
          revocation_date: '2024-07-15',
    status: 'pending',
          backup_required: true,
          backup_status: 'pending'
        },
        {
          id: 'ar-002',
          system_name: 'VPN Access',
          access_type: 'vpn',
          account_id: 'jsmith_vpn',
          revocation_date: '2024-07-15',
          status: 'pending',
          backup_required: false
        }
      ],
      knowledge_transfer: [
        {
          id: 'kt-001',
          area: 'Project Alpha Leadership',
          description: 'Transfer knowledge about Project Alpha architecture and roadmap',
          transfer_to_id: 'emp-067',
          transfer_to_name: 'Mike Wilson',
          transfer_method: 'documentation',
    priority: 'high',
          estimated_hours: 8,
          due_date: '2024-07-10',
          status: 'in_progress',
          documents_created: ['Project Alpha Overview.pdf', 'Architecture Diagrams.zip']
        }
      ],
      clearances: [
        {
          id: 'cl-001',
          department: 'HR',
          clearance_type: 'hr',
          clearer_id: 'hr-001',
          clearer_name: 'Alice Johnson',
          requirements: ['Complete exit interview', 'Return ID badge'],
          due_date: '2024-07-15',
          status: 'pending'
        }
      ],
      documents: [
        {
          id: 'doc-001',
          name: 'Resignation Letter - John Smith.pdf',
          type: 'resignation_letter',
          file_url: '/documents/resignation-john-smith.pdf',
          uploaded_by: 'John Smith',
          uploaded_at: '2024-07-01T14:30:00Z',
          signed: true,
          signed_at: '2024-07-01T14:30:00Z',
          version: '1.0'
        }
      ],
      final_settlement: {
        id: 'fs-001',
        final_salary: 8500,
        unused_leave_payment: 2340,
        bonus_payment: 0,
        deductions: [],
        total_amount: 10840,
        currency: 'USD',
        payment_date: '2024-07-20',
        payment_method: 'bank_transfer',
        status: 'pending'
      },
      alumni_status: {
        eligible_for_alumni_network: true,
        alumni_group: 'Engineering Alumni',
        contact_preferences: ['email', 'linkedin'],
        future_opportunities: true,
        reference_eligible: true,
        rehire_status: 'eligible'
      },
      notes: 'Excellent employee leaving for career advancement. Maintain good relationship.',
      created_at: '2024-07-01T09:00:00Z',
      updated_at: '2024-07-01T15:30:00Z'
    }
  ];

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Loading timeout')), 5000)
      );
      const dataPromise = new Promise(resolve => {
        setTimeout(() => {
          setOffboardingCases(mockOffboardingCases);
          resolve(true);
        }, 1000);
      });
      
      await Promise.race([dataPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to load offboarding data:', error);
      setOffboardingCases([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (allowAccess || user) {
      loadData();
    } else {
      // If no access and no user, stop loading immediately
      setIsLoading(false);
    }
  }, [user, allowAccess]);

  const handleCreateOffboarding = () => {
    setIsCreating(true);
    setSelectedCase(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending_clearance': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTerminationTypeColor = (type: string) => {
    switch (type) {
      case 'voluntary': return 'bg-green-100 text-green-800';
      case 'involuntary': return 'bg-red-100 text-red-800';
      case 'retirement': return 'bg-blue-100 text-blue-800';
      case 'contract_end': return 'bg-yellow-100 text-yellow-800';
      case 'layoff': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (checklist: ChecklistItem[]) => {
    if (checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.status === 'completed').length;
    return Math.round((completed / checklist.length) * 100);
  };

  if (isLoading) {
    return (
      <ModernDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  if (!allowAccess && !user) {
    return (
      <ModernDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Please log in to access the offboarding system.</p>
          </div>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      <Head>
        <title>Offboarding Management | HR System</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Offboarding Management</h1>
              <p className="text-gray-600 mt-2">Manage employee exits and offboarding processes</p>
            </div>
            <PermissionButton
              permissions={['employees.update', 'user_permissions.manage_settings']}
              onClick={handleCreateOffboarding}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Initiate Offboarding
            </PermissionButton>
          </div>
        </div>

        {isCreating ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Offboarding Case</h2>
            <p className="text-gray-600">Offboarding creation form would go here...</p>
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create Case
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cases List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Offboarding Cases</h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {offboardingCases.map(case_ => (
                    <div 
                      key={case_.id}
                      onClick={() => setSelectedCase(case_)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedCase?.id === case_.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 truncate">{case_.employee_name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusColor(case_.status)}`}>
                          {case_.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{case_.position}</p>
                      <p className="text-sm text-gray-500">{case_.department}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs rounded ${getPriorityColor(case_.priority)}`}>
                          {case_.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getProgressPercentage(case_.checklist_items)}% complete
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Case Details */}
            <div className="lg:col-span-2">
              {selectedCase ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{selectedCase.employee_name}</h2>
                        <p className="text-gray-600">{selectedCase.position} - {selectedCase.department}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded ${getStatusColor(selectedCase.status)}`}>
                          {selectedCase.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded ${getPriorityColor(selectedCase.priority)}`}>
                          {selectedCase.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex">
                      {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'checklist', label: 'Checklist' },
                        { id: 'assets', label: 'Assets' },
                        { id: 'access', label: 'Access' },
                        { id: 'knowledge', label: 'Knowledge Transfer' },
                        { id: 'documents', label: 'Documents' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Information</h3>
                            <dl className="space-y-3">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="text-sm text-gray-900">{selectedCase.employee_email}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Manager</dt>
                                <dd className="text-sm text-gray-900">{selectedCase.manager_name}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Last Working Day</dt>
                                <dd className="text-sm text-gray-900">{new Date(selectedCase.last_working_day).toLocaleDateString()}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Notice Period</dt>
                                <dd className="text-sm text-gray-900">{selectedCase.notice_period_days} days</dd>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Termination Details</h3>
                            <dl className="space-y-3">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Type</dt>
                                <dd>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTerminationTypeColor(selectedCase.termination_type)}`}>
                                    {selectedCase.termination_type.replace('_', ' ')}
                                  </span>
                                </dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Reason</dt>
                                <dd className="text-sm text-gray-900">{selectedCase.reason}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Initiated By</dt>
                                <dd className="text-sm text-gray-900">{selectedCase.initiated_by}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Progress</dt>
                                <dd className="text-sm text-gray-900">{getProgressPercentage(selectedCase.checklist_items)}% complete</dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                        
                        {selectedCase.notes && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedCase.notes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'checklist' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">Offboarding Checklist</h3>
                          <PermissionButton
                            permissions={['employees.update', 'user_permissions.manage_settings']}
                            onClick={() => {/* Handle add checklist item */}}
                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Add Item
                          </PermissionButton>
                        </div>
                        
                        <div className="space-y-3">
                          {selectedCase.checklist_items.map(item => (
                            <div key={item.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.task}</h4>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ml-4 ${
                                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-500">Category:</span>
                                  <span className="ml-1 capitalize">{item.category.replace('_', ' ')}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">Responsible:</span>
                                  <span className="ml-1">{item.responsible_party}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">Due:</span>
                                  <span className="ml-1">{new Date(item.due_date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                  {item.is_mandatory && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                                      Mandatory
                                    </span>
                                  )}
                                </div>
                              </div>
                              {item.completed_by && (
                                <div className="mt-2 text-sm text-gray-600">
                                  Completed by {item.completed_by} on {new Date(item.completed_at!).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'assets' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">Asset Returns</h3>
                          <PermissionButton
                            permissions={['employees.update', 'user_permissions.manage_settings']}
                            onClick={() => {/* Handle add asset */}}
                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Add Asset
                          </PermissionButton>
                        </div>
                        
                        {selectedCase.assets.length > 0 ? (
                          <div className="space-y-3">
                            {selectedCase.assets.map(asset => (
                              <div key={asset.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{asset.asset_name}</h4>
                                    <p className="text-sm text-gray-600 capitalize">{asset.asset_type}</p>
                                    {asset.serial_number && (
                                      <p className="text-xs text-gray-500">Serial: {asset.serial_number}</p>
                                    )}
                                  </div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                    asset.status === 'returned' ? 'bg-green-100 text-green-800' :
                                    asset.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {asset.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-500">Assigned:</span>
                                    <span className="ml-1">{new Date(asset.assigned_date).toLocaleDateString()}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-500">Expected Return:</span>
                                    <span className="ml-1">{new Date(asset.expected_return_date).toLocaleDateString()}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-500">Return Location:</span>
                                    <span className="ml-1">{asset.return_location}</span>
                                  </div>
                                </div>
                                {asset.actual_return_date && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    Returned on {new Date(asset.actual_return_date).toLocaleDateString()}
                                    {asset.received_by && ` to ${asset.received_by}`}
                                    {asset.condition_on_return && (
                                      <span className="ml-2 capitalize">
                                        (Condition: {asset.condition_on_return})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-gray-400">
                              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                              </svg>
                              <h4 className="text-lg font-medium mb-2">No Assets to Return</h4>
                              <p className="text-gray-500 mb-4">Add company assets that need to be returned.</p>
                              <PermissionButton
                                permissions={['employees.update', 'user_permissions.manage_settings']}
                                onClick={() => {/* Handle add asset */}}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                              >
                                Add Asset
                              </PermissionButton>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'access' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">Access Revocation</h3>
                          <PermissionButton
                            permissions={['employees.update', 'user_permissions.manage_settings']}
                            onClick={() => {/* Handle add access item */}}
                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Add System Access
                          </PermissionButton>
                        </div>

                        {selectedCase.access_revocation.length > 0 ? (
                          <div className="space-y-4">
                            {selectedCase.access_revocation.map(access => (
                              <div key={access.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{access.system_name}</h4>
                                    <p className="text-sm text-gray-600 capitalize">{access.access_type.replace('_', ' ')}</p>
                                    <p className="text-xs text-gray-500">Account: {access.account_id}</p>
                                  </div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                    access.status === 'revoked' || access.status === 'disabled' || access.status === 'deleted' 
                                      ? 'bg-green-100 text-green-800' :
                                    access.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {access.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-600">Revocation Date:</span>
                                    <span className="ml-2 text-gray-900">{new Date(access.revocation_date).toLocaleDateString()}</span>
                                  </div>
                                  {access.revoked_by && (
                                    <div>
                                      <span className="font-medium text-gray-600">Revoked By:</span>
                                      <span className="ml-2 text-gray-900">{access.revoked_by}</span>
                                    </div>
                                  )}
                                </div>
                                {access.backup_required && (
                                  <div className="mt-1">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                      access.backup_status === 'completed' ? 'bg-green-100 text-green-800' :
                                      access.backup_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      Backup: {access.backup_status || 'pending'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No system access to revoke.</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'knowledge' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">Knowledge Transfer</h3>
                          <PermissionButton
                            permissions={['employees.update', 'user_permissions.manage_settings']}
                            onClick={() => {/* Handle add knowledge transfer */}}
                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Add Transfer Item
                          </PermissionButton>
                        </div>

                        {selectedCase.knowledge_transfer.length > 0 ? (
                          <div className="space-y-4">
                            {selectedCase.knowledge_transfer.map(kt => (
                              <div key={kt.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{kt.area}</h4>
                                    <p className="text-sm text-gray-600">{kt.description}</p>
                                  </div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                    kt.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    kt.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {kt.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-600">Transfer to:</span>
                                    <span className="ml-2 text-gray-900">{kt.transfer_to_name}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">Method:</span>
                                    <span className="ml-2 text-gray-900 capitalize">{kt.transfer_method.replace('_', ' ')}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">Priority:</span>
                                    <span className={`ml-2 capitalize ${
                                      kt.priority === 'critical' ? 'text-red-600 font-semibold' :
                                      kt.priority === 'high' ? 'text-orange-600' :
                                      'text-gray-900'
                                    }`}>
                                      {kt.priority}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">Due date:</span>
                                    <span className="ml-2 text-gray-900">{new Date(kt.due_date).toLocaleDateString()}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">Estimated hours:</span>
                                    <span className="ml-2 text-gray-900">{kt.estimated_hours}h</span>
                                  </div>
                                  {kt.actual_hours && (
                                    <div>
                                      <span className="font-medium text-gray-600">Actual hours:</span>
                                      <span className="ml-2 text-gray-900">{kt.actual_hours}h</span>
                                    </div>
                                  )}
                                </div>
                                {kt.documents_created.length > 0 && (
                                  <div className="mt-3">
                                    <span className="font-medium text-gray-600 block mb-1">Documents created:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {kt.documents_created.map((doc, index) => (
                                        <span key={index} className="inline-flex px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                          {doc}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-gray-400">
                              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <h4 className="text-lg font-medium mb-2">No Knowledge Transfer Items</h4>
                              <p className="text-gray-500 mb-4">Add knowledge transfer items to ensure smooth transition.</p>
                              <PermissionButton
                                permissions={['employees.update', 'user_permissions.manage_settings']}
                                onClick={() => {/* Handle add knowledge transfer */}}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                              >
                                Add Transfer Item
                              </PermissionButton>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'documents' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                          <PermissionButton
                            permissions={['employees.update', 'user_permissions.manage_settings']}
                            onClick={() => {/* Handle upload document */}}
                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Upload Document
                          </PermissionButton>
                        </div>

                        {selectedCase.documents.length > 0 ? (
                          <div className="space-y-3">
                            {selectedCase.documents.map(doc => (
                              <div key={doc.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                  <p className="text-sm text-gray-600 capitalize">{doc.type.replace('_', ' ')}</p>
                                  <p className="text-xs text-gray-500">
                                    Uploaded by {doc.uploaded_by} on {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {doc.signed && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                                      Signed
                                    </span>
                                  )}
                                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                                    Download
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-gray-400">
                              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <h4 className="text-lg font-medium mb-2">No Documents</h4>
                              <p className="text-gray-500 mb-4">Upload offboarding documents and forms.</p>
                              <PermissionButton
                                permissions={['employees.update', 'user_permissions.manage_settings']}
                                onClick={() => {/* Handle upload document */}}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                              >
                                Upload Document
                              </PermissionButton>
                            </div>
                          </div>
                        )}

                        {/* Final Settlement */}
                        {selectedCase.final_settlement && (
                          <div className="border-t pt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Final Settlement</h4>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Final Salary:</span>
                                  <span className="ml-2 text-gray-900">${selectedCase.final_settlement.final_salary.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Unused Leave:</span>
                                  <span className="ml-2 text-gray-900">${selectedCase.final_settlement.unused_leave_payment.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Bonus:</span>
                                  <span className="ml-2 text-gray-900">${selectedCase.final_settlement.bonus_payment.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Total Amount:</span>
                                  <span className="ml-2 text-gray-900 font-semibold">${selectedCase.final_settlement.total_amount.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Payment Date:</span>
                                  <span className="ml-2 text-gray-900">{new Date(selectedCase.final_settlement.payment_date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Status:</span>
                                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                    selectedCase.final_settlement.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    selectedCase.final_settlement.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {selectedCase.final_settlement.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3 3 3 0 013 3v2a3 3 0 01-3 3zm8-10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">Select an offboarding case to view details</h3>
                    <p className="text-gray-500 mb-4">Choose a case from the list to manage the offboarding process.</p>
                    <PermissionButton
                      permissions={['employees.update', 'user_permissions.manage_settings']}
                      onClick={handleCreateOffboarding}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                      Initiate Offboarding
                    </PermissionButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ModernDashboardLayout>
  );
};

export default OffboardingManagementPage;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
