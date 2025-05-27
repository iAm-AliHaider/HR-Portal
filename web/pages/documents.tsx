import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DocumentsManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const documentsMetrics = [
    { label: 'Total Documents', value: '2,847', icon: '📄', color: 'text-blue-600', trend: 'up' },
    { label: 'Pending Signatures', value: '43', icon: '✍️', color: 'text-orange-600', trend: 'up' },
    { label: 'Compliance Rate', value: '96%', icon: '✅', color: 'text-green-600', trend: 'up' },
    { label: 'Storage Used', value: '28.4 GB', icon: '💾', color: 'text-purple-600', trend: 'up' }
  ];

  const documents = [
    {
      id: 'doc-001',
      name: 'Employment Contract - John Smith.pdf',
      type: 'contract',
      category: 'Employment',
      employeeId: 'EMP-2024-056',
      employeeName: 'John Smith',
      createdDate: '2024-06-15',
      modifiedDate: '2024-06-15',
      status: 'signed',
      size: '2.4 MB',
      version: '1.0',
      createdBy: 'Sarah Johnson',
      tags: ['employment', 'contract', 'new-hire'],
      department: 'Engineering',
      securityLevel: 'confidential',
      retentionPeriod: '7 years',
      signatureRequired: true,
      signedBy: ['John Smith', 'Sarah Johnson'],
      expiryDate: '2025-06-15',
      documentUrl: '/documents/emp-contract-001.pdf'
    },
    {
      id: 'doc-002',
      name: 'Performance Review Q1 2024 - Emily Chen.pdf',
      type: 'review',
      category: 'Performance',
      employeeId: 'EMP-2024-057',
      employeeName: 'Emily Chen',
      createdDate: '2024-04-15',
      modifiedDate: '2024-04-20',
      status: 'pending_signature',
      size: '1.8 MB',
      version: '2.1',
      createdBy: 'David Rodriguez',
      tags: ['performance', 'review', 'q1-2024'],
      department: 'Marketing',
      securityLevel: 'confidential',
      retentionPeriod: '5 years',
      signatureRequired: true,
      signedBy: ['David Rodriguez'],
      expiryDate: null,
      documentUrl: '/documents/perf-review-002.pdf'
    },
    {
      id: 'doc-003',
      name: 'Safety Training Certificate - Alex Thompson.pdf',
      type: 'certificate',
      category: 'Training',
      employeeId: 'EMP-2024-058',
      employeeName: 'Alex Thompson',
      createdDate: '2024-05-10',
      modifiedDate: '2024-05-10',
      status: 'active',
      size: '0.8 MB',
      version: '1.0',
      createdBy: 'Safety Team',
      tags: ['safety', 'training', 'certificate'],
      department: 'Sales',
      securityLevel: 'internal',
      retentionPeriod: '3 years',
      signatureRequired: false,
      signedBy: [],
      expiryDate: '2025-05-10',
      documentUrl: '/documents/safety-cert-003.pdf'
    },
    {
      id: 'doc-004',
      name: 'Employee Handbook 2024.pdf',
      type: 'policy',
      category: 'Policy',
      employeeId: null,
      employeeName: 'All Employees',
      createdDate: '2024-01-01',
      modifiedDate: '2024-06-01',
      status: 'active',
      size: '12.5 MB',
      version: '3.2',
      createdBy: 'HR Team',
      tags: ['handbook', 'policy', '2024'],
      department: 'All',
      securityLevel: 'internal',
      retentionPeriod: 'indefinite',
      signatureRequired: false,
      signedBy: [],
      expiryDate: '2024-12-31',
      documentUrl: '/documents/employee-handbook-2024.pdf'
    },
    {
      id: 'doc-005',
      name: 'Non-Disclosure Agreement - Maria Garcia.pdf',
      type: 'agreement',
      category: 'Legal',
      employeeId: 'EMP-2024-059',
      employeeName: 'Maria Garcia',
      createdDate: '2024-06-20',
      modifiedDate: '2024-06-20',
      status: 'pending_signature',
      size: '1.2 MB',
      version: '1.0',
      createdBy: 'Legal Team',
      tags: ['nda', 'legal', 'confidentiality'],
      department: 'Human Resources',
      securityLevel: 'confidential',
      retentionPeriod: '10 years',
      signatureRequired: true,
      signedBy: [],
      expiryDate: '2027-06-20',
      documentUrl: '/documents/nda-005.pdf'
    }
  ];

  const templates = [
    {
      id: 'temp-001',
      name: 'Employment Contract Template',
      category: 'Employment',
      description: 'Standard employment contract template for all positions',
      lastModified: '2024-05-15',
      version: '2.1',
      createdBy: 'Legal Team',
      usageCount: 45,
      variables: ['employee_name', 'position', 'salary', 'start_date', 'department'],
      approvalRequired: true,
      status: 'active',
      documentType: 'contract',
      fields: [
        { name: 'employee_name', type: 'text', required: true },
        { name: 'position', type: 'text', required: true },
        { name: 'salary', type: 'number', required: true },
        { name: 'start_date', type: 'date', required: true },
        { name: 'department', type: 'select', required: true }
      ]
    },
    {
      id: 'temp-002',
      name: 'Performance Review Template',
      category: 'Performance',
      description: 'Quarterly performance review template',
      lastModified: '2024-04-01',
      version: '1.8',
      createdBy: 'HR Team',
      usageCount: 128,
      variables: ['employee_name', 'review_period', 'goals', 'achievements', 'rating'],
      approvalRequired: false,
      status: 'active',
      documentType: 'review',
      fields: [
        { name: 'employee_name', type: 'text', required: true },
        { name: 'review_period', type: 'text', required: true },
        { name: 'goals', type: 'textarea', required: true },
        { name: 'achievements', type: 'textarea', required: true },
        { name: 'rating', type: 'select', required: true }
      ]
    },
    {
      id: 'temp-003',
      name: 'Offer Letter Template',
      category: 'Recruitment',
      description: 'Job offer letter template for new hires',
      lastModified: '2024-06-01',
      version: '1.5',
      createdBy: 'Recruitment Team',
      usageCount: 67,
      variables: ['candidate_name', 'position', 'salary', 'benefits', 'start_date'],
      approvalRequired: true,
      status: 'active',
      documentType: 'offer',
      fields: [
        { name: 'candidate_name', type: 'text', required: true },
        { name: 'position', type: 'text', required: true },
        { name: 'salary', type: 'number', required: true },
        { name: 'benefits', type: 'textarea', required: false },
        { name: 'start_date', type: 'date', required: true }
      ]
    },
    {
      id: 'temp-004',
      name: 'Termination Letter Template',
      category: 'Offboarding',
      description: 'Employee termination letter template',
      lastModified: '2024-03-15',
      version: '1.2',
      createdBy: 'Legal Team',
      usageCount: 23,
      variables: ['employee_name', 'termination_date', 'reason', 'final_pay'],
      approvalRequired: true,
      status: 'active',
      documentType: 'termination',
      fields: [
        { name: 'employee_name', type: 'text', required: true },
        { name: 'termination_date', type: 'date', required: true },
        { name: 'reason', type: 'textarea', required: true },
        { name: 'final_pay', type: 'number', required: true }
      ]
    }
  ];

  const signatureRequests = [
    {
      id: 'sig-001',
      documentId: 'doc-002',
      documentName: 'Performance Review Q1 2024 - Emily Chen.pdf',
      requester: 'David Rodriguez',
      requestedFrom: 'Emily Chen',
      requestDate: '2024-06-18',
      dueDate: '2024-06-25',
      status: 'pending',
      priority: 'normal',
      remindersSent: 1,
      message: 'Please review and sign your Q1 performance review',
      signatureType: 'digital',
      department: 'Marketing'
    },
    {
      id: 'sig-002',
      documentId: 'doc-005',
      documentName: 'Non-Disclosure Agreement - Maria Garcia.pdf',
      requester: 'Legal Team',
      requestedFrom: 'Maria Garcia',
      requestDate: '2024-06-20',
      dueDate: '2024-06-22',
      status: 'pending',
      priority: 'high',
      remindersSent: 0,
      message: 'Please sign the NDA before your start date',
      signatureType: 'digital',
      department: 'Human Resources'
    },
    {
      id: 'sig-003',
      documentId: 'doc-001',
      documentName: 'Employment Contract - John Smith.pdf',
      requester: 'Sarah Johnson',
      requestedFrom: 'John Smith',
      requestDate: '2024-06-15',
      dueDate: '2024-06-17',
      status: 'completed',
      priority: 'high',
      remindersSent: 0,
      message: 'Please sign your employment contract',
      signatureType: 'digital',
      department: 'Engineering',
      completedDate: '2024-06-16'
    }
  ];

  const auditLogs = [
    {
      id: 'audit-001',
      documentId: 'doc-001',
      action: 'document_signed',
      user: 'John Smith',
      timestamp: '2024-06-16 14:30:22',
      details: 'Document signed digitally',
      ipAddress: '192.168.1.45'
    },
    {
      id: 'audit-002',
      documentId: 'doc-002',
      action: 'document_modified',
      user: 'David Rodriguez',
      timestamp: '2024-06-18 09:15:33',
      details: 'Updated performance ratings and comments',
      ipAddress: '192.168.1.67'
    },
    {
      id: 'audit-003',
      documentId: 'doc-004',
      action: 'document_accessed',
      user: 'Emily Chen',
      timestamp: '2024-06-20 11:22:18',
      details: 'Downloaded employee handbook',
      ipAddress: '192.168.1.89'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': case 'active': case 'completed': return 'bg-green-100 text-green-800';
      case 'pending_signature': case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'contract': return '📄';
      case 'review': return '⭐';
      case 'certificate': return '🏆';
      case 'policy': return '📋';
      case 'agreement': return '🤝';
      case 'offer': return '💼';
      case 'termination': return '📤';
      default: return '📄';
    }
  };

  const getSecurityLevelColor = (level) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'confidential': return 'bg-red-100 text-red-800';
      case 'restricted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Documents Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {documentsMetrics.map((metric, index) => (
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
                <div className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend === 'up' ? '↗' : '↘'}
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
              <span className="text-2xl mb-1">📄</span>
              <span className="text-sm">Upload Document</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📝</span>
              <span className="text-sm">Create from Template</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">✍️</span>
              <span className="text-sm">Request Signature</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">Document Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.slice(0, 4).map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getDocumentTypeIcon(doc.type)}</span>
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.employeeName} • {doc.category}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(doc.createdDate).toLocaleDateString()} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                      {doc.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSecurityLevelColor(doc.securityLevel)}`}>
                      {doc.securityLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {doc.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Employment', 'Performance', 'Training', 'Policy', 'Legal'].map((category, index) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{getDocumentTypeIcon(category.toLowerCase())}</span>
                    <div>
                      <div className="font-medium">{category}</div>
                      <div className="text-sm text-gray-600">
                        {documents.filter(d => d.category === category).length} documents
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {Math.floor(Math.random() * 500 + 100)}
                    </div>
                    <div className="text-xs text-gray-600">total</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signatureRequests.filter(s => s.status === 'pending').slice(0, 4).map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{request.requestedFrom}</div>
                    <div className="text-xs text-gray-600">
                      {request.documentName.slice(0, 40)}...
                    </div>
                    <div className="text-xs text-gray-500">
                      Due: {new Date(request.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {request.remindersSent} reminders
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Document Library</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Categories</option>
            <option>Employment</option>
            <option>Performance</option>
            <option>Training</option>
            <option>Policy</option>
            <option>Legal</option>
          </select>
          <Button>Upload Document</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Document</th>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Security</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{getDocumentTypeIcon(doc.type)}</span>
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-gray-600">
                            {doc.size} • v{doc.version}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{doc.employeeName}</div>
                      <div className="text-sm text-gray-600">{doc.department}</div>
                    </td>
                    <td className="p-4">{doc.category}</td>
                    <td className="p-4">
                      <div>{new Date(doc.createdDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">by {doc.createdBy}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getSecurityLevelColor(doc.securityLevel)}`}>
                        {doc.securityLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          View
                        </Button>
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Share</Button>
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

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Document Templates</h2>
        <Button>Create New Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{template.name}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(template.status)}`}>
                  {template.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Category:</span>
                  <span className="font-medium">{template.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Version:</span>
                  <span className="font-medium">v{template.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Modified:</span>
                  <span className="font-medium">{new Date(template.lastModified).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Usage Count:</span>
                  <span className="font-medium">{template.usageCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Created By:</span>
                  <span className="font-medium">{template.createdBy}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Required Fields:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {variable.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {template.approvalRequired && (
                <div className="mb-4">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    ⚠️ Approval Required
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedTemplate(template)}
                >
                  View Template
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSignatures = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Signature Requests</h2>
        <Button>Request Signature</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Document</th>
                  <th className="text-left p-4">Requested From</th>
                  <th className="text-left p-4">Requester</th>
                  <th className="text-left p-4">Request Date</th>
                  <th className="text-left p-4">Due Date</th>
                  <th className="text-left p-4">Priority</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {signatureRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{request.documentName.slice(0, 30)}...</div>
                      <div className="text-sm text-gray-600">{request.department}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{request.requestedFrom}</div>
                    </td>
                    <td className="p-4">{request.requester}</td>
                    <td className="p-4">{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className={new Date(request.dueDate) < new Date() ? 'text-red-600' : ''}>
                        {new Date(request.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        {request.status === 'pending' && (
                          <Button size="sm" variant="outline">Remind</Button>
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

  const renderAudit = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Audit Trail</h2>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Actions</option>
            <option>Document Created</option>
            <option>Document Modified</option>
            <option>Document Signed</option>
            <option>Document Accessed</option>
            <option>Document Deleted</option>
          </select>
          <Button variant="outline">Export Audit Log</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Timestamp</th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Action</th>
                  <th className="text-left p-4">Document</th>
                  <th className="text-left p-4">Details</th>
                  <th className="text-left p-4">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{log.user}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {log.action.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {documents.find(d => d.id === log.documentId)?.name?.slice(0, 30)}...
                      </div>
                    </td>
                    <td className="p-4">{log.details}</td>
                    <td className="p-4">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Documents Management</h1>
          <p className="text-gray-600">Manage documents, templates, signatures, and compliance tracking</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'documents', label: 'Documents' },
            { id: 'templates', label: 'Templates' },
            { id: 'signatures', label: 'Signatures' },
            { id: 'audit', label: 'Audit Trail' }
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
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'signatures' && renderSignatures()}
        {activeTab === 'audit' && renderAudit()}

        {/* Document Detail Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{getDocumentTypeIcon(selectedDocument.type)}</span>
                  <div>
                    <h3 className="font-medium">Document Information</h3>
                    <div className="text-sm text-gray-600">
                      {selectedDocument.category} • {selectedDocument.size} • v{selectedDocument.version}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Document Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Employee:</span> {selectedDocument.employeeName}</div>
                      <div><span className="font-medium">Department:</span> {selectedDocument.department}</div>
                      <div><span className="font-medium">Created By:</span> {selectedDocument.createdBy}</div>
                      <div><span className="font-medium">Created Date:</span> {new Date(selectedDocument.createdDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Modified Date:</span> {new Date(selectedDocument.modifiedDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedDocument.status)}`}>
                          {selectedDocument.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Security & Compliance</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Security Level:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getSecurityLevelColor(selectedDocument.securityLevel)}`}>
                          {selectedDocument.securityLevel.toUpperCase()}
                        </span>
                      </div>
                      <div><span className="font-medium">Retention Period:</span> {selectedDocument.retentionPeriod}</div>
                      <div><span className="font-medium">Signature Required:</span> {selectedDocument.signatureRequired ? 'Yes' : 'No'}</div>
                      {selectedDocument.expiryDate && (
                        <div><span className="font-medium">Expiry Date:</span> {new Date(selectedDocument.expiryDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedDocument.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {selectedDocument.signedBy.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Signatures</h4>
                    <div className="space-y-1">
                      {selectedDocument.signedBy.map((signer, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>{signer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Download</Button>
                <Button variant="outline" className="flex-1">Edit Document</Button>
                <Button variant="outline" className="flex-1">Share</Button>
                {selectedDocument.signatureRequired && selectedDocument.status !== 'signed' && (
                  <Button variant="outline" className="flex-1">Request Signature</Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Template Detail Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedTemplate.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Template Information</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Category:</span> {selectedTemplate.category}</div>
                      <div><span className="font-medium">Version:</span> v{selectedTemplate.version}</div>
                      <div><span className="font-medium">Created By:</span> {selectedTemplate.createdBy}</div>
                      <div><span className="font-medium">Last Modified:</span> {new Date(selectedTemplate.lastModified).toLocaleDateString()}</div>
                      <div><span className="font-medium">Usage Count:</span> {selectedTemplate.usageCount}</div>
                      <div><span className="font-medium">Approval Required:</span> {selectedTemplate.approvalRequired ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Template Fields</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedTemplate.fields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{field.name.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              field.type === 'text' ? 'bg-blue-100 text-blue-800' :
                              field.type === 'number' ? 'bg-green-100 text-green-800' :
                              field.type === 'date' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="text-red-600 text-xs">*</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Available Variables</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.variables.map((variable, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {`{${variable}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Use Template</Button>
                <Button variant="outline" className="flex-1">Edit Template</Button>
                <Button variant="outline" className="flex-1">Duplicate</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DocumentsManagement; 
