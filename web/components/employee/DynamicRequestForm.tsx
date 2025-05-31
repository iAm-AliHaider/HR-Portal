import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

// Types for request form
export interface RequestFormData {
  // Employee info
  employeeName?: string;
  employeeEmail?: string;
  department?: string;
  manager?: string;
  phone?: string;
  location?: string;

  // Leave request fields
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  returnDate?: string;
  totalDays?: string;
  reason?: string;
  handoverNotes?: string;

  // Equipment request fields
  equipmentType?: string;
  urgency?: string;
  specifications?: string;
  costCenter?: string;
  project?: string;

  // Generic fields
  title?: string;
  description?: string;
  dateNeeded?: string;
  priority?: string;
  attachments?: FileList | null;
  justification?: string;
  additionalApprovers?: string;
  customFields?: Record<string, string>;
  comments?: string;
  
  // Dynamic fields for any request type
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

// Workflow step interface
export interface WorkflowStep {
  stepNumber: number;
  stepName: string;
  approverType: string;
  approverName?: string;
  estimatedTime?: string;
  isRequired: boolean;
}

// Eligibility requirement interface
export interface EligibilityRequirement {
  name: string;
  description: string;
  isMet: boolean;
  metReason?: string;
  notMetReason?: string;
}

export interface RequestType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

interface DynamicRequestFormProps {
  requestType: RequestType;
  formData: RequestFormData;
  formErrors: FormErrors;
  onChange: (field: string, value: any) => void;
  currentUser: any;
}

const DynamicRequestForm: React.FC<DynamicRequestFormProps> = ({
  requestType,
  formData,
  formErrors,
  onChange,
  currentUser
}) => {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibilityMet, setEligibilityMet] = useState(true);
  
  // Effect to check eligibility when request type changes
  useEffect(() => {
    if (requestType) {
      const eligibility = checkEligibility(requestType.id);
      const allRequirementsMet = eligibility.every(req => req.isMet);
      setEligibilityMet(allRequirementsMet);
    }
  }, [requestType]);
  
  // Get fields to display for a specific request type
  const getFormFieldsForRequestType = (typeId: string): string[] => {
    // Define which fields should be shown for each request type
    const fieldMap: Record<string, string[]> = {
      'leave': ['leaveType', 'startDate', 'endDate', 'returnDate', 'totalDays', 'reason', 'handoverNotes'],
      'remote': ['startDate', 'endDate', 'location', 'reason'],
      'equipment': ['equipmentType', 'specifications', 'dateNeeded', 'urgency', 'reason', 'costCenter'],
      'expense': ['expenseDate', 'expenseType', 'amount', 'description', 'costCenter', 'attachments'],
      'training': ['trainingType', 'provider', 'startDate', 'endDate', 'cost', 'justification', 'costCenter'],
      'conference': ['conferenceName', 'location', 'startDate', 'endDate', 'cost', 'justification', 'costCenter'],
      'travel': ['destination', 'purpose', 'startDate', 'endDate', 'transportationType', 'estimatedCost', 'costCenter']
    };
    
    return fieldMap[typeId] || ['title', 'description', 'dateNeeded', 'priority', 'justification'];
  };
  
  // Get workflow steps for a request type
  const getWorkflowSteps = (typeId: string): WorkflowStep[] => {
    // These would be fetched from a workflow configuration in a real implementation
    const workflowMap: Record<string, WorkflowStep[]> = {
      'leave': [
        { stepNumber: 1, stepName: 'Initial Submission', approverType: 'System', isRequired: true },
        { stepNumber: 2, stepName: 'Manager Approval', approverType: 'Manager', approverName: currentUser?.manager, estimatedTime: '1-2 business days', isRequired: true },
        { stepNumber: 3, stepName: 'HR Verification', approverType: 'HR', estimatedTime: '1 business day', isRequired: true }
      ],
      'remote': [
        { stepNumber: 1, stepName: 'Initial Submission', approverType: 'System', isRequired: true },
        { stepNumber: 2, stepName: 'Manager Approval', approverType: 'Manager', approverName: currentUser?.manager, estimatedTime: '1 business day', isRequired: true }
      ],
      'equipment': [
        { stepNumber: 1, stepName: 'Initial Submission', approverType: 'System', isRequired: true },
        { stepNumber: 2, stepName: 'Manager Approval', approverType: 'Manager', approverName: currentUser?.manager, estimatedTime: '1-2 business days', isRequired: true },
        { stepNumber: 3, stepName: 'IT Department Approval', approverType: 'IT Department', estimatedTime: '1-3 business days', isRequired: true },
        { stepNumber: 4, stepName: 'Procurement Processing', approverType: 'Procurement', estimatedTime: '3-5 business days', isRequired: false }
      ],
      'training': [
        { stepNumber: 1, stepName: 'Initial Submission', approverType: 'System', isRequired: true },
        { stepNumber: 2, stepName: 'Manager Approval', approverType: 'Manager', approverName: currentUser?.manager, estimatedTime: '1-2 business days', isRequired: true },
        { stepNumber: 3, stepName: 'Budget Approval', approverType: 'Finance', estimatedTime: '2-3 business days', isRequired: currentUser?.costCenter ? true : false },
        { stepNumber: 4, stepName: 'HR Processing', approverType: 'HR', estimatedTime: '1-2 business days', isRequired: true }
      ]
    };
    
    return workflowMap[typeId] || [
      { stepNumber: 1, stepName: 'Initial Submission', approverType: 'System', isRequired: true },
      { stepNumber: 2, stepName: 'Manager Approval', approverType: 'Manager', approverName: currentUser?.manager, estimatedTime: '1-2 business days', isRequired: true }
    ];
  };
  
  // Check eligibility for a request type
  const checkEligibility = (typeId: string): EligibilityRequirement[] => {
    // This would be fetched from an eligibility service in a real implementation
    const eligibilityMap: Record<string, EligibilityRequirement[]> = {
      'leave': [
        { name: 'Employment Duration', description: 'Must be employed for at least 90 days', isMet: true, metReason: 'Employed since ' + currentUser?.joinDate },
        { name: 'Leave Balance', description: 'Must have sufficient leave balance', isMet: true, metReason: '15 days available' },
        { name: 'Prior Notice', description: 'Request must be made at least 2 weeks in advance for planned leave', isMet: true }
      ],
      'remote': [
        { name: 'Position Eligibility', description: 'Role must be eligible for remote work', isMet: true, metReason: 'Your role is eligible for remote work' },
        { name: 'Manager Approval', description: 'Your manager must pre-approve remote work', isMet: true }
      ],
      'equipment': [
        { name: 'Budget Availability', description: 'Department must have available budget', isMet: true, metReason: 'Budget available for equipment requests' },
        { name: 'Replacement Cycle', description: 'Equipment must be due for replacement', isMet: true, metReason: 'Last equipment provided > 24 months ago' }
      ],
      'training': [
        { name: 'Budget Availability', description: 'Department must have training budget', isMet: true, metReason: 'Training budget available' },
        { name: 'Position Relevance', description: 'Training must be relevant to current role', isMet: true },
        { name: 'Manager Approval', description: 'Your manager must pre-approve training requests', isMet: true }
      ],
      'conference': [
        { name: 'Budget Availability', description: 'Department must have conference budget', isMet: false, notMetReason: 'Conference budget exhausted for current quarter' },
        { name: 'Business Justification', description: 'Must provide clear business justification', isMet: true }
      ]
    };
    
    return eligibilityMap[typeId] || [
      { name: 'Employment Status', description: 'Must be an active employee', isMet: true, metReason: 'You are an active employee' }
    ];
  };
  
  // Render form fields based on the selected request type
  const renderDynamicFormFields = () => {
    if (!requestType) return null;
    
    const fields = getFormFieldsForRequestType(requestType.id);
    
    return (
      <div className="space-y-4">
        {fields.map(field => {
          switch(field) {
            case 'leaveType':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Leave Type*</label>
                  <Select value={formData.leaveType || ''} onValueChange={value => onChange('leaveType', value)}>
                    <SelectTrigger className={formErrors.leaveType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="bereavement">Bereavement Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.leaveType && <p className="text-xs text-red-500 mt-1">{formErrors.leaveType}</p>}
                </div>
              );
            case 'startDate':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Start Date*</label>
                  <Input 
                    type="date" 
                    value={formData.startDate || ''} 
                    onChange={e => onChange('startDate', e.target.value)}
                    className={formErrors.startDate ? 'border-red-500' : ''}
                  />
                  {formErrors.startDate && <p className="text-xs text-red-500 mt-1">{formErrors.startDate}</p>}
                </div>
              );
            case 'endDate':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">End Date*</label>
                  <Input 
                    type="date" 
                    value={formData.endDate || ''} 
                    onChange={e => onChange('endDate', e.target.value)}
                    className={formErrors.endDate ? 'border-red-500' : ''}
                  />
                  {formErrors.endDate && <p className="text-xs text-red-500 mt-1">{formErrors.endDate}</p>}
                </div>
              );
            case 'returnDate':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Return Date</label>
                  <Input 
                    type="date" 
                    value={formData.returnDate || ''} 
                    onChange={e => onChange('returnDate', e.target.value)}
                  />
                </div>
              );
            case 'reason':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Reason*</label>
                  <Textarea 
                    placeholder="Please provide details" 
                    value={formData.reason || ''} 
                    onChange={e => onChange('reason', e.target.value)}
                    className={formErrors.reason ? 'border-red-500' : ''}
                  />
                  {formErrors.reason && <p className="text-xs text-red-500 mt-1">{formErrors.reason}</p>}
                </div>
              );
            case 'equipmentType':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Equipment Type*</label>
                  <Select value={formData.equipmentType || ''} onValueChange={value => onChange('equipmentType', value)}>
                    <SelectTrigger className={formErrors.equipmentType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                      <SelectItem value="keyboard">Keyboard</SelectItem>
                      <SelectItem value="mouse">Mouse</SelectItem>
                      <SelectItem value="headset">Headset</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.equipmentType && <p className="text-xs text-red-500 mt-1">{formErrors.equipmentType}</p>}
                </div>
              );
            case 'specifications':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Specifications</label>
                  <Textarea 
                    placeholder="Describe the specifications needed" 
                    value={formData.specifications || ''} 
                    onChange={e => onChange('specifications', e.target.value)}
                  />
                </div>
              );
            case 'urgency':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Urgency*</label>
                  <Select value={formData.urgency || ''} onValueChange={value => onChange('urgency', value)}>
                    <SelectTrigger className={formErrors.urgency ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Within 4 weeks</SelectItem>
                      <SelectItem value="medium">Medium - Within 2 weeks</SelectItem>
                      <SelectItem value="high">High - Within 1 week</SelectItem>
                      <SelectItem value="critical">Critical - Within 48 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.urgency && <p className="text-xs text-red-500 mt-1">{formErrors.urgency}</p>}
                </div>
              );
            case 'expenseDate':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Expense Date*</label>
                  <Input 
                    type="date" 
                    value={formData.expenseDate || ''} 
                    onChange={e => onChange('expenseDate', e.target.value)}
                    className={formErrors.expenseDate ? 'border-red-500' : ''}
                  />
                  {formErrors.expenseDate && <p className="text-xs text-red-500 mt-1">{formErrors.expenseDate}</p>}
                </div>
              );
            case 'expenseType':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Expense Type*</label>
                  <Select value={formData.expenseType || ''} onValueChange={value => onChange('expenseType', value)}>
                    <SelectTrigger className={formErrors.expenseType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select expense type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="meals">Meals & Entertainment</SelectItem>
                      <SelectItem value="supplies">Office Supplies</SelectItem>
                      <SelectItem value="software">Software Subscription</SelectItem>
                      <SelectItem value="professional">Professional Development</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.expenseType && <p className="text-xs text-red-500 mt-1">{formErrors.expenseType}</p>}
                </div>
              );
            case 'amount':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Amount*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={`pl-7 ${formErrors.amount ? 'border-red-500' : ''}`}
                      value={formData.amount || ''} 
                      onChange={e => onChange('amount', e.target.value)}
                    />
                  </div>
                  {formErrors.amount && <p className="text-xs text-red-500 mt-1">{formErrors.amount}</p>}
                </div>
              );
            case 'trainingType':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Training Type*</label>
                  <Select value={formData.trainingType || ''} onValueChange={value => onChange('trainingType', value)}>
                    <SelectTrigger className={formErrors.trainingType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select training type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.trainingType && <p className="text-xs text-red-500 mt-1">{formErrors.trainingType}</p>}
                </div>
              );
            case 'provider':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Provider*</label>
                  <Input 
                    placeholder="Training provider name" 
                    value={formData.provider || ''} 
                    onChange={e => onChange('provider', e.target.value)}
                    className={formErrors.provider ? 'border-red-500' : ''}
                  />
                  {formErrors.provider && <p className="text-xs text-red-500 mt-1">{formErrors.provider}</p>}
                </div>
              );
            case 'cost':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Cost*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={`pl-7 ${formErrors.cost ? 'border-red-500' : ''}`}
                      value={formData.cost || ''} 
                      onChange={e => onChange('cost', e.target.value)}
                    />
                  </div>
                  {formErrors.cost && <p className="text-xs text-red-500 mt-1">{formErrors.cost}</p>}
                </div>
              );
            case 'conferenceName':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Conference Name*</label>
                  <Input 
                    placeholder="Enter conference name" 
                    value={formData.conferenceName || ''} 
                    onChange={e => onChange('conferenceName', e.target.value)}
                    className={formErrors.conferenceName ? 'border-red-500' : ''}
                  />
                  {formErrors.conferenceName && <p className="text-xs text-red-500 mt-1">{formErrors.conferenceName}</p>}
                </div>
              );
            case 'location':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Location*</label>
                  <Input 
                    placeholder="Enter location" 
                    value={formData.location || ''} 
                    onChange={e => onChange('location', e.target.value)}
                    className={formErrors.location ? 'border-red-500' : ''}
                  />
                  {formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
                </div>
              );
            case 'destination':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Destination*</label>
                  <Input 
                    placeholder="Enter destination" 
                    value={formData.destination || ''} 
                    onChange={e => onChange('destination', e.target.value)}
                    className={formErrors.destination ? 'border-red-500' : ''}
                  />
                  {formErrors.destination && <p className="text-xs text-red-500 mt-1">{formErrors.destination}</p>}
                </div>
              );
            case 'purpose':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Purpose*</label>
                  <Textarea 
                    placeholder="Describe the purpose of travel" 
                    value={formData.purpose || ''} 
                    onChange={e => onChange('purpose', e.target.value)}
                    className={formErrors.purpose ? 'border-red-500' : ''}
                  />
                  {formErrors.purpose && <p className="text-xs text-red-500 mt-1">{formErrors.purpose}</p>}
                </div>
              );
            case 'transportationType':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Transportation Type*</label>
                  <Select value={formData.transportationType || ''} onValueChange={value => onChange('transportationType', value)}>
                    <SelectTrigger className={formErrors.transportationType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select transportation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="taxi">Taxi/Rideshare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.transportationType && <p className="text-xs text-red-500 mt-1">{formErrors.transportationType}</p>}
                </div>
              );
            case 'estimatedCost':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Estimated Cost*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={`pl-7 ${formErrors.estimatedCost ? 'border-red-500' : ''}`}
                      value={formData.estimatedCost || ''} 
                      onChange={e => onChange('estimatedCost', e.target.value)}
                    />
                  </div>
                  {formErrors.estimatedCost && <p className="text-xs text-red-500 mt-1">{formErrors.estimatedCost}</p>}
                </div>
              );
            case 'dateNeeded':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Date Needed</label>
                  <Input 
                    type="date" 
                    value={formData.dateNeeded || ''} 
                    onChange={e => onChange('dateNeeded', e.target.value)}
                  />
                </div>
              );
            case 'title':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Title*</label>
                  <Input 
                    placeholder="Enter request title" 
                    value={formData.title || ''} 
                    onChange={e => onChange('title', e.target.value)}
                    className={formErrors.title ? 'border-red-500' : ''}
                  />
                  {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
                </div>
              );
            case 'description':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Description*</label>
                  <Textarea 
                    placeholder="Please provide details" 
                    value={formData.description || ''} 
                    onChange={e => onChange('description', e.target.value)}
                    className={formErrors.description ? 'border-red-500' : ''}
                  />
                  {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
                </div>
              );
            case 'priority':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={formData.priority || ''} onValueChange={value => onChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            case 'justification':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Justification*</label>
                  <Textarea 
                    placeholder="Why is this request necessary?" 
                    value={formData.justification || ''} 
                    onChange={e => onChange('justification', e.target.value)}
                    className={formErrors.justification ? 'border-red-500' : ''}
                  />
                  {formErrors.justification && <p className="text-xs text-red-500 mt-1">{formErrors.justification}</p>}
                </div>
              );
            case 'attachments':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Attachments</label>
                  <Input 
                    type="file" 
                    onChange={e => onChange('attachments', e.target.files)} 
                    multiple
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG (max 5MB)</p>
                </div>
              );
            case 'costCenter':
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">Cost Center</label>
                  <Input 
                    placeholder="Enter cost center" 
                    value={formData.costCenter || ''} 
                    onChange={e => onChange('costCenter', e.target.value)}
                  />
                </div>
              );
            default:
              return (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium">{field.replace(/([A-Z])/g, ' $1').trim()}*</label>
                  <Input 
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                    value={formData[field] || ''} 
                    onChange={e => onChange(field, e.target.value)}
                    className={formErrors[field] ? 'border-red-500' : ''}
                  />
                  {formErrors[field] && <p className="text-xs text-red-500 mt-1">{formErrors[field]}</p>}
                </div>
              );
          }
        })}
      </div>
    );
  };
  
  // Show workflow steps for the current request type
  const renderWorkflowSteps = () => {
    if (!requestType) return null;
    
    const workflow = getWorkflowSteps(requestType.id);
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Approval Workflow</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowWorkflow(!showWorkflow)}>
              {showWorkflow ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          <CardDescription>See who will approve your request</CardDescription>
        </CardHeader>
        
        {showWorkflow && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {workflow.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.stepName}</div>
                    <div className="text-sm text-gray-500">
                      Approver: {step.approverName || step.approverType}
                      {step.estimatedTime && <span> • Estimated time: {step.estimatedTime}</span>}
                      {!step.isRequired && <span> • (Optional)</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };
  
  // Show eligibility requirements for the current request type
  const renderEligibilityRequirements = () => {
    if (!requestType) return null;
    
    const eligibility = checkEligibility(requestType.id);
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Eligibility Check</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowEligibility(!showEligibility)}>
              {showEligibility ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          <CardDescription>Check if you're eligible for this request</CardDescription>
        </CardHeader>
        
        {!eligibilityMet && (
          <div className="mx-6 mb-2 bg-red-100 text-red-800 p-2 rounded">
            You do not meet all eligibility requirements for this request type.
          </div>
        )}
        
        {showEligibility && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {eligibility.map((req, index) => (
                <div key={index} className="flex items-start">
                  {req.isMet ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{req.name}</div>
                    <div className="text-sm text-gray-500">{req.description}</div>
                    {req.isMet && req.metReason && (
                      <div className="text-sm text-green-600">{req.metReason}</div>
                    )}
                    {!req.isMet && req.notMetReason && (
                      <div className="text-sm text-red-600">{req.notMetReason}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Eligibility Requirements */}
      {renderEligibilityRequirements()}
      
      {/* Workflow Steps */}
      {renderWorkflowSteps()}
      
      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{requestType.name} Details</CardTitle>
          <CardDescription>Fill in the required information</CardDescription>
        </CardHeader>
        <CardContent>
          {renderDynamicFormFields()}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicRequestForm; 