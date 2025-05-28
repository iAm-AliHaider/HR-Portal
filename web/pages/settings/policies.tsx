import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionGuard, PermissionButton } from '../../components/ui/PermissionGuard';
import { shouldBypassAuth } from '@/lib/auth';
import { GetServerSideProps } from 'next';

// Policy and Compliance types
interface Policy {
  id: string;
  title: string;
  description: string;
  category: PolicyCategory;
  type: PolicyType;
  status: PolicyStatus;
  version: number;
  content: string;
  tags: string[];
  effective_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  workflow_id?: string;
  compliance_requirements: ComplianceRequirement[];
  stakeholders: PolicyStakeholder[];
  documents: PolicyDocument[];
  review_schedule: ReviewSchedule;
  impact_assessment?: ImpactAssessment;
  training_required: boolean;
  acknowledgment_required: boolean;
  applicability: PolicyApplicability;
}

type PolicyCategory = 'HR' | 'IT' | 'Security' | 'Finance' | 'Legal' | 'Operations' | 'Quality' | 'Safety' | 'Compliance' | 'General';
type PolicyType = 'policy' | 'procedure' | 'guideline' | 'standard' | 'framework' | 'code_of_conduct';
type PolicyStatus = 'draft' | 'under_review' | 'approved' | 'active' | 'archived' | 'superseded';

interface ComplianceRequirement {
  id: string;
  regulation: string;
  requirement: string;
  description: string;
  mandatory: boolean;
  deadline?: string;
  responsible_party: string;
  evidence_required: string[];
  status: 'pending' | 'in_progress' | 'compliant' | 'non_compliant' | 'exempt';
  last_assessment: string;
  next_assessment: string;
}

interface PolicyStakeholder {
  id: string;
  user_id: string;
  name: string;
  role: 'owner' | 'reviewer' | 'approver' | 'contributor' | 'affected_party';
  department: string;
  responsibilities: string[];
  contact_info: string;
}

interface PolicyDocument {
  id: string;
  name: string;
  type: 'attachment' | 'template' | 'form' | 'checklist' | 'procedure';
  url: string;
  version: string;
  uploaded_by: string;
  uploaded_at: string;
  description?: string;
}

interface ReviewSchedule {
  frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'bi_annually' | 'custom';
  next_review_date: string;
  reviewer_id: string;
  review_criteria: string[];
  notification_days_before: number;
}

interface ImpactAssessment {
  business_impact: 'low' | 'medium' | 'high' | 'critical';
  implementation_effort: 'low' | 'medium' | 'high';
  cost_impact: 'none' | 'low' | 'medium' | 'high';
  timeline_to_implement: string;
  affected_departments: string[];
  risks: string[];
  benefits: string[];
}

interface PolicyApplicability {
  applies_to: 'all_employees' | 'specific_roles' | 'specific_departments' | 'contractors' | 'custom';
  roles: string[];
  departments: string[];
  locations: string[];
  exceptions: string[];
}

interface ComplianceRecord {
  id: string;
  policy_id: string;
  requirement_id: string;
  assessment_date: string;
  assessor_id: string;
  status: 'compliant' | 'non_compliant' | 'partial_compliant' | 'not_applicable';
  score?: number;
  findings: string[];
  recommendations: string[];
  corrective_actions: CorrectiveAction[];
  evidence: string[];
  next_assessment_date: string;
}

interface CorrectiveAction {
  id: string;
  description: string;
  assigned_to: string;
  due_date: string;
  status: 'open' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress_notes: string[];
}

interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  type: PolicyType;
  template_content: string;
  required_sections: string[];
  optional_sections: string[];
  compliance_requirements: string[];
  tags: string[];
}

const PolicyComplianceManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const allowAccess = shouldBypassAuth(router.query);
  
  const [isLoading, setIsLoading] = useState(true);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'templates' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [complianceFilter, setComplianceFilter] = useState<string>('all');

  // Check permissions
  const canManagePolicies = hasPermission('policies', 'create') || hasPermission('system_settings', 'update');
  const canViewCompliance = hasPermission('compliance_records', 'read') || hasPermission('system_settings', 'read');

  // Redirect if no access
  useEffect(() => {
    if (!allowAccess && !canManagePolicies && !canViewCompliance) {
      router.push('/dashboard?error=insufficient_permissions');
    }
  }, [allowAccess, canManagePolicies, canViewCompliance, router]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - in real implementation, fetch from API
      const mockPolicies: Policy[] = [
        {
          id: 'policy_001',
          title: 'Remote Work Policy',
          description: 'Guidelines for remote work arrangements and expectations',
          category: 'HR',
          type: 'policy',
          status: 'active',
          version: 2,
          content: 'This policy establishes guidelines for remote work arrangements...',
          tags: ['remote work', 'flexibility', 'productivity'],
          effective_date: '2024-01-01',
          expiry_date: '2025-12-31',
          created_at: '2023-11-15T10:00:00Z',
          updated_at: '2024-01-15T14:30:00Z',
          created_by: 'hr_admin',
          approved_by: 'john_doe',
          approved_at: '2023-12-01T09:00:00Z',
          workflow_id: 'wf_policy_review',
          compliance_requirements: [
            {
              id: 'req_001',
              regulation: 'GDPR',
              requirement: 'Data Protection in Remote Work',
              description: 'Ensure data protection compliance for remote workers',
              mandatory: true,
              deadline: '2024-06-01',
              responsible_party: 'IT Security Team',
              evidence_required: ['Security assessments', 'Training records'],
              status: 'compliant',
              last_assessment: '2024-01-15',
              next_assessment: '2024-07-15'
            }
          ],
          stakeholders: [
            {
              id: 'stake_001',
              user_id: 'hr_manager_001',
              name: 'Sarah Johnson',
              role: 'owner',
              department: 'Human Resources',
              responsibilities: ['Policy maintenance', 'Implementation oversight'],
              contact_info: 'sarah.johnson@company.com'
            }
          ],
          documents: [
            {
              id: 'doc_001',
              name: 'Remote Work Agreement Template',
              type: 'template',
              url: '/documents/remote-work-template.pdf',
              version: '1.0',
              uploaded_by: 'hr_admin',
              uploaded_at: '2024-01-10T12:00:00Z',
              description: 'Standard agreement template for remote work arrangements'
            }
          ],
          review_schedule: {
            frequency: 'annually',
            next_review_date: '2025-01-01',
            reviewer_id: 'hr_manager_001',
            review_criteria: ['Effectiveness', 'Compliance', 'Employee feedback'],
            notification_days_before: 30
          },
          impact_assessment: {
            business_impact: 'medium',
            implementation_effort: 'low',
            cost_impact: 'low',
            timeline_to_implement: '30 days',
            affected_departments: ['All'],
            risks: ['Security concerns', 'Communication challenges'],
            benefits: ['Increased flexibility', 'Better work-life balance', 'Cost savings']
          },
          training_required: true,
          acknowledgment_required: true,
          applicability: {
            applies_to: 'all_employees',
            roles: [],
            departments: [],
            locations: ['All locations'],
            exceptions: ['Security-sensitive roles']
          }
        },
        {
          id: 'policy_002',
          title: 'Information Security Policy',
          description: 'Comprehensive information security guidelines and procedures',
          category: 'Security',
          type: 'policy',
          status: 'active',
          version: 3,
          content: 'This policy establishes security standards and procedures...',
          tags: ['security', 'data protection', 'cyber security'],
          effective_date: '2024-02-01',
          created_at: '2023-10-01T08:00:00Z',
          updated_at: '2024-02-01T10:00:00Z',
          created_by: 'security_admin',
          approved_by: 'ciso',
          approved_at: '2024-01-25T16:00:00Z',
          compliance_requirements: [
            {
              id: 'req_002',
              regulation: 'ISO 27001',
              requirement: 'Information Security Management',
              description: 'Maintain ISO 27001 compliance for information security',
              mandatory: true,
              responsible_party: 'CISO',
              evidence_required: ['Audit reports', 'Risk assessments', 'Training records'],
              status: 'compliant',
              last_assessment: '2024-01-30',
              next_assessment: '2024-07-30'
            },
            {
              id: 'req_003',
              regulation: 'SOX',
              requirement: 'IT General Controls',
              description: 'Ensure IT controls comply with SOX requirements',
              mandatory: true,
              responsible_party: 'IT Governance Team',
              evidence_required: ['Control testing', 'Documentation'],
              status: 'in_progress',
              last_assessment: '2024-01-20',
              next_assessment: '2024-04-20'
            }
          ],
          stakeholders: [
            {
              id: 'stake_002',
              user_id: 'ciso_001',
              name: 'Michael Chen',
              role: 'owner',
              department: 'Information Security',
              responsibilities: ['Policy enforcement', 'Security oversight'],
              contact_info: 'michael.chen@company.com'
            }
          ],
          documents: [],
          review_schedule: {
            frequency: 'quarterly',
            next_review_date: '2024-05-01',
            reviewer_id: 'ciso_001',
            review_criteria: ['Threat landscape changes', 'Regulatory updates', 'Incident analysis'],
            notification_days_before: 14
          },
          training_required: true,
          acknowledgment_required: true,
          applicability: {
            applies_to: 'all_employees',
            roles: [],
            departments: [],
            locations: ['All locations'],
            exceptions: []
          }
        },
        {
          id: 'policy_003',
          title: 'Code of Conduct',
          description: 'Ethical guidelines and behavioral expectations for all employees',
          category: 'General',
          type: 'code_of_conduct',
          status: 'under_review',
          version: 1,
          content: 'This code of conduct outlines the ethical standards...',
          tags: ['ethics', 'conduct', 'behavior'],
          effective_date: '2024-03-01',
          created_at: '2024-01-01T12:00:00Z',
          updated_at: '2024-01-25T15:00:00Z',
          created_by: 'legal_admin',
          workflow_id: 'wf_policy_review',
          compliance_requirements: [
            {
              id: 'req_004',
              regulation: 'Corporate Governance',
              requirement: 'Ethical Standards',
              description: 'Maintain ethical standards as per corporate governance requirements',
              mandatory: true,
              responsible_party: 'Legal Department',
              evidence_required: ['Training completion', 'Acknowledgment records'],
              status: 'pending',
              last_assessment: '2024-01-01',
              next_assessment: '2024-06-01'
            }
          ],
          stakeholders: [
            {
              id: 'stake_003',
              user_id: 'legal_counsel_001',
              name: 'Amanda Rodriguez',
              role: 'owner',
              department: 'Legal',
              responsibilities: ['Policy development', 'Compliance monitoring'],
              contact_info: 'amanda.rodriguez@company.com'
            }
          ],
          documents: [],
          review_schedule: {
            frequency: 'bi_annually',
            next_review_date: '2024-09-01',
            reviewer_id: 'legal_counsel_001',
            review_criteria: ['Regulatory changes', 'Employee feedback', 'Industry best practices'],
            notification_days_before: 45
          },
          training_required: true,
          acknowledgment_required: true,
          applicability: {
            applies_to: 'all_employees',
            roles: [],
            departments: [],
            locations: ['All locations'],
            exceptions: []
          }
        }
      ];

      const mockComplianceRecords: ComplianceRecord[] = [
        {
          id: 'comp_001',
          policy_id: 'policy_001',
          requirement_id: 'req_001',
          assessment_date: '2024-01-15',
          assessor_id: 'compliance_officer_001',
          status: 'compliant',
          score: 95,
          findings: ['Strong data protection measures in place', 'Regular security training conducted'],
          recommendations: ['Consider additional VPN monitoring', 'Update remote access guidelines'],
          corrective_actions: [],
          evidence: ['Security audit report', 'Training completion records'],
          next_assessment_date: '2024-07-15'
        },
        {
          id: 'comp_002',
          policy_id: 'policy_002',
          requirement_id: 'req_003',
          assessment_date: '2024-01-20',
          assessor_id: 'compliance_officer_001',
          status: 'partial_compliant',
          score: 75,
          findings: ['Some IT controls need strengthening', 'Documentation gaps identified'],
          recommendations: ['Implement additional access controls', 'Complete control documentation'],
          corrective_actions: [
            {
              id: 'action_001',
              description: 'Implement multi-factor authentication for critical systems',
              assigned_to: 'it_security_team',
              due_date: '2024-03-15',
              status: 'in_progress',
              priority: 'high',
              progress_notes: ['MFA solution selected', 'Implementation started']
            }
          ],
          evidence: ['Control testing results', 'Risk assessment report'],
          next_assessment_date: '2024-04-20'
        }
      ];

      const mockTemplates: PolicyTemplate[] = [
        {
          id: 'template_001',
          name: 'HR Policy Template',
          description: 'Standard template for HR-related policies',
          category: 'HR',
          type: 'policy',
          template_content: 'Standard HR policy structure with required sections...',
          required_sections: ['Purpose', 'Scope', 'Policy Statement', 'Procedures', 'Responsibilities'],
          optional_sections: ['Definitions', 'Related Policies', 'Appendices'],
          compliance_requirements: ['Equal Employment Opportunity', 'Labor Law Compliance'],
          tags: ['HR', 'template', 'standard']
        },
        {
          id: 'template_002',
          name: 'Security Policy Template',
          description: 'Template for information security policies',
          category: 'Security',
          type: 'policy',
          template_content: 'Security policy framework with security controls...',
          required_sections: ['Objective', 'Scope', 'Risk Assessment', 'Controls', 'Monitoring'],
          optional_sections: ['Technical Standards', 'Implementation Guidelines'],
          compliance_requirements: ['ISO 27001', 'NIST Framework'],
          tags: ['security', 'template', 'ISO 27001']
        }
      ];

      setPolicies(mockPolicies);
      setComplianceRecords(mockComplianceRecords);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePolicy = () => {
    setIsCreating(true);
    setSelectedPolicy(null);
    setActiveTab('overview');
  };

  const getStatusColor = (status: PolicyStatus) => {
    const colors: Record<PolicyStatus, string> = {
      draft: 'bg-gray-100 text-gray-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-600',
      superseded: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getCategoryColor = (category: PolicyCategory) => {
    const colors: Record<PolicyCategory, string> = {
      HR: 'bg-blue-100 text-blue-800',
      IT: 'bg-purple-100 text-purple-800',
      Security: 'bg-red-100 text-red-800',
      Finance: 'bg-green-100 text-green-800',
      Legal: 'bg-gray-100 text-gray-800',
      Operations: 'bg-orange-100 text-orange-800',
      Quality: 'bg-pink-100 text-pink-800',
      Safety: 'bg-yellow-100 text-yellow-800',
      Compliance: 'bg-indigo-100 text-indigo-800',
      General: 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  const getComplianceStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      compliant: 'bg-green-100 text-green-800',
      non_compliant: 'bg-red-100 text-red-800',
      partial_compliant: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800',
      exempt: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Filter policies
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter compliance records
  const filteredComplianceRecords = complianceRecords.filter(record => {
    return complianceFilter === 'all' || record.status === complianceFilter;
  });

  // Calculate compliance statistics
  const complianceStats = {
    total: complianceRecords.length,
    compliant: complianceRecords.filter(r => r.status === 'compliant').length,
    nonCompliant: complianceRecords.filter(r => r.status === 'non_compliant').length,
    partialCompliant: complianceRecords.filter(r => r.status === 'partial_compliant').length,
    averageScore: complianceRecords.reduce((sum, r) => sum + (r.score || 0), 0) / complianceRecords.length
  };

  if (!allowAccess && !canManagePolicies && !canViewCompliance) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Policy & Compliance Management - HR Management</title>
        <meta name="description" content="Manage organizational policies and compliance requirements" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Policy & Compliance Management</h1>
            <p className="text-gray-600">Create, manage, and track organizational policies and compliance</p>
          </div>
          <div className="flex space-x-3">
            <PermissionButton
              permissions={['policies.create', 'system_settings.update']}
              onClick={handleCreatePolicy}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Policy
            </PermissionButton>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Policies Overview', icon: '📋' },
              { id: 'compliance', name: 'Compliance Tracking', icon: '✅' },
              { id: 'templates', name: 'Policy Templates', icon: '📄' },
              { id: 'analytics', name: 'Analytics & Reports', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Policies</p>
                        <p className="text-2xl font-semibold text-gray-900">{policies.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Policies</p>
                        <p className="text-2xl font-semibold text-gray-900">{policies.filter(p => p.status === 'active').length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Under Review</p>
                        <p className="text-2xl font-semibold text-gray-900">{policies.filter(p => p.status === 'under_review').length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                        <p className="text-2xl font-semibold text-gray-900">{Math.round(complianceStats.averageScore)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Search policies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="HR">HR</option>
                      <option value="IT">IT</option>
                      <option value="Security">Security</option>
                      <option value="Finance">Finance</option>
                      <option value="Legal">Legal</option>
                      <option value="Operations">Operations</option>
                      <option value="Quality">Quality</option>
                      <option value="Safety">Safety</option>
                      <option value="Compliance">Compliance</option>
                      <option value="General">General</option>
                    </select>
                    
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                      <option value="superseded">Superseded</option>
                    </select>
                    
                    <div className="text-sm text-gray-500 flex items-center">
                      Showing {filteredPolicies.length} of {policies.length} policies
                    </div>
                  </div>
                </div>

                {/* Policies List */}
                <div className="bg-white rounded-lg shadow">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Review</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPolicies.map((policy) => (
                          <tr key={policy.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{policy.title}</div>
                                <div className="text-sm text-gray-500">{policy.description}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {policy.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(policy.category)}`}>
                                {policy.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                                {policy.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">v{policy.version}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{new Date(policy.effective_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{new Date(policy.review_schedule.next_review_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setSelectedPolicy(policy)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  View
                                </button>
                                <PermissionGuard permissions={['policies.update', 'system_settings.update']}>
                                  <button className="text-green-600 hover:text-green-900 text-sm">
                                    Edit
                                  </button>
                                </PermissionGuard>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                {/* Compliance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Compliant</p>
                        <p className="text-2xl font-semibold text-gray-900">{complianceStats.compliant}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                        <p className="text-2xl font-semibold text-gray-900">{complianceStats.nonCompliant}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Partial</p>
                        <p className="text-2xl font-semibold text-gray-900">{complianceStats.partialCompliant}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg Score</p>
                        <p className="text-2xl font-semibold text-gray-900">{Math.round(complianceStats.averageScore)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Filter */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <select
                    value={complianceFilter}
                    onChange={(e) => setComplianceFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Compliance Status</option>
                    <option value="compliant">Compliant</option>
                    <option value="non_compliant">Non-Compliant</option>
                    <option value="partial_compliant">Partial Compliant</option>
                  </select>
                </div>

                {/* Compliance Records */}
                <div className="bg-white rounded-lg shadow">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Assessment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Assessment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredComplianceRecords.map((record) => {
                          const policy = policies.find(p => p.id === record.policy_id);
                          const requirement = policy?.compliance_requirements.find(r => r.id === record.requirement_id);
                          
                          return (
                            <tr key={record.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{policy?.title}</div>
                                <div className="text-sm text-gray-500">{policy?.category}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{requirement?.regulation}</div>
                                <div className="text-sm text-gray-500">{requirement?.requirement}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplianceStatusColor(record.status)}`}>
                                  {record.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">{record.score || 'N/A'}%</div>
                                  {record.score && (
                                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${record.score >= 80 ? 'bg-green-500' : record.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${record.score}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{new Date(record.assessment_date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{new Date(record.next_assessment_date).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                                    View Details
                                  </button>
                                  <PermissionGuard permissions={['compliance_records.update', 'system_settings.update']}>
                                    <button className="text-green-600 hover:text-green-900 text-sm">
                                      Update
                                    </button>
                                  </PermissionGuard>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Required Sections:</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.required_sections.slice(0, 3).map((section) => (
                              <span key={section} className="inline-flex px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                {section}
                              </span>
                            ))}
                            {template.required_sections.length > 3 && (
                              <span className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                                +{template.required_sections.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Compliance:</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.compliance_requirements.slice(0, 2).map((req) => (
                              <span key={req} className="inline-flex px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <PermissionButton
                          permissions={['policies.create', 'system_settings.update']}
                          onClick={() => {/* Handle use template */}}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm text-center"
                        >
                          Use Template
                        </PermissionButton>
                        <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2">Policy & Compliance Analytics</h3>
                  <p className="text-gray-500 mb-4">Advanced analytics and reporting coming soon!</p>
                  <div className="bg-purple-50 p-4 rounded-lg max-w-md mx-auto">
                    <h4 className="font-medium text-purple-900 mb-2">Planned Analytics:</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Policy adoption rates</li>
                      <li>• Compliance trend analysis</li>
                      <li>• Risk assessment reports</li>
                      <li>• Training completion tracking</li>
                      <li>• Policy effectiveness metrics</li>
                      <li>• Regulatory compliance dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Policy Details Modal/Sidebar */}
        {selectedPolicy && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedPolicy(null)} />
            <div className="absolute right-0 top-0 h-full w-1/2 bg-white shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPolicy.title}</h2>
                  <button
                    onClick={() => setSelectedPolicy(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Policy Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Policy Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Category:</span>
                        <span className="ml-2">{selectedPolicy.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>
                        <span className="ml-2">{selectedPolicy.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPolicy.status)}`}>
                          {selectedPolicy.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Version:</span>
                        <span className="ml-2">v{selectedPolicy.version}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Effective Date:</span>
                        <span className="ml-2">{new Date(selectedPolicy.effective_date).toLocaleDateString()}</span>
                      </div>
                      {selectedPolicy.expiry_date && (
                        <div>
                          <span className="font-medium text-gray-600">Expiry Date:</span>
                          <span className="ml-2">{new Date(selectedPolicy.expiry_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600">{selectedPolicy.description}</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPolicy.tags.map((tag) => (
                        <span key={tag} className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Requirements */}
                  {selectedPolicy.compliance_requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Compliance Requirements</h3>
                      <div className="space-y-3">
                        {selectedPolicy.compliance_requirements.map((req) => (
                          <div key={req.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{req.regulation}</h4>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplianceStatusColor(req.status)}`}>
                                {req.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                            <div className="text-xs text-gray-500">
                              <span>Responsible: {req.responsible_party}</span>
                              {req.deadline && <span className="ml-4">Deadline: {new Date(req.deadline).toLocaleDateString()}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stakeholders */}
                  {selectedPolicy.stakeholders.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Stakeholders</h3>
                      <div className="space-y-2">
                        {selectedPolicy.stakeholders.map((stakeholder) => (
                          <div key={stakeholder.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{stakeholder.name}</div>
                              <div className="text-sm text-gray-600">{stakeholder.department} • {stakeholder.role}</div>
                            </div>
                            <div className="text-sm text-gray-500">{stakeholder.contact_info}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Schedule */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Review Schedule</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Frequency:</span>
                          <span className="ml-2">{selectedPolicy.review_schedule.frequency}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Next Review:</span>
                          <span className="ml-2">{new Date(selectedPolicy.review_schedule.next_review_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Assessment */}
                  {selectedPolicy.impact_assessment && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Impact Assessment</h3>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Business Impact:</span>
                            <span className="ml-2 capitalize">{selectedPolicy.impact_assessment.business_impact}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Implementation Effort:</span>
                            <span className="ml-2 capitalize">{selectedPolicy.impact_assessment.implementation_effort}</span>
                          </div>
                        </div>
                        {selectedPolicy.impact_assessment.risks.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600 block mb-1">Risks:</span>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {selectedPolicy.impact_assessment.risks.map((risk, index) => (
                                <li key={index}>• {risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default PolicyComplianceManagementPage; 
