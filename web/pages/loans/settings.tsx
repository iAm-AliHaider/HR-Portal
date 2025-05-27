import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings, 
  Save, 
  Plus, 
  Edit, 
  Trash, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  DollarSign
} from 'lucide-react';

// Mock data for loan program settings
const LOAN_TYPES = [
  {
    id: 1,
    name: 'Personal Loan',
    maxAmount: 50000,
    minAmount: 5000,
    maxTerm: 3, // years
    minTerm: 0.5, // years
    interestRate: 9.5,
    status: 'active',
    description: 'General purpose loans for personal expenses',
    eligibility: 'Must have completed 1 year of service',
    documents: ['Identity proof', 'Salary statements (last 3 months)', 'Bank statements (last 3 months)']
  },
  {
    id: 2,
    name: 'Education Loan',
    maxAmount: 100000,
    minAmount: 10000,
    maxTerm: 5, // years
    minTerm: 1, // years
    interestRate: 8.5,
    status: 'active',
    description: 'Loans for higher education and professional development',
    eligibility: 'Must have completed 1 year of service',
    documents: ['Identity proof', 'Admission letter', 'Course fee structure', 'Salary statements (last 3 months)']
  },
  {
    id: 3,
    name: 'Home Loan',
    maxAmount: 5000000,
    minAmount: 500000,
    maxTerm: 20, // years
    minTerm: 5, // years
    interestRate: 7.5,
    status: 'active',
    description: 'Loans for home purchase, construction, or renovation',
    eligibility: 'Must have completed 3 years of service',
    documents: ['Identity proof', 'Property documents', 'Salary statements (last 6 months)', 'Bank statements (last 6 months)', 'Property valuation report']
  },
  {
    id: 4,
    name: 'Emergency Loan',
    maxAmount: 30000,
    minAmount: 5000,
    maxTerm: 1, // years
    minTerm: 0.25, // years
    interestRate: 7,
    status: 'active',
    description: 'Short-term loans for medical or family emergencies',
    eligibility: 'Available to all employees',
    documents: ['Identity proof', 'Emergency proof (medical bills, etc.)', 'Salary statement']
  },
  {
    id: 5,
    name: 'Vehicle Loan',
    maxAmount: 200000,
    minAmount: 50000,
    maxTerm: 5, // years
    minTerm: 1, // years
    interestRate: 8,
    status: 'inactive',
    description: 'Loans for purchasing vehicles',
    eligibility: 'Must have completed 2 years of service',
    documents: ['Identity proof', 'Vehicle quotation', 'Salary statements (last 3 months)', 'Bank statements (last 3 months)']
  }
];

// Global loan program settings
const PROGRAM_SETTINGS = {
  maxActiveLoans: 2,
  minCreditScore: 650,
  eligibilityPeriod: 12, // months
  paymentMethods: ['Salary Deduction', 'Bank Transfer'],
  defaultPaymentMethod: 'Salary Deduction',
  gracePeriod: 5, // days
  lateFeePercentage: 1,
  prepaymentPenalty: 0,
  approvalWorkflow: ['HR Manager', 'Finance Director'],
  disbursementTime: 3 // days
};

export default function LoanSettingsPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('loan-types');
  const [loanTypes, setLoanTypes] = useState(LOAN_TYPES);
  const [programSettings, setProgramSettings] = useState(PROGRAM_SETTINGS);
  const [editingLoanType, setEditingLoanType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Check if user has admin rights
  const isAdmin = role === 'admin' || role === 'hr_director' || role === 'finance_manager';
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle saving loan type changes
  const handleSaveLoanType = (loanType) => {
    // In a real app, this would make an API call
    if (editingLoanType) {
      // Update existing loan type
      const updatedLoanTypes = loanTypes.map(lt => 
        lt.id === editingLoanType.id ? {...loanType, id: lt.id} : lt
      );
      setLoanTypes(updatedLoanTypes);
    } else {
      // Add new loan type
      const newLoanType = {
        ...loanType,
        id: Math.max(...loanTypes.map(lt => lt.id)) + 1,
        status: 'active'
      };
      setLoanTypes([...loanTypes, newLoanType]);
    }
    
    setEditingLoanType(null);
    setEditMode(false);
  };
  
  // Handle saving program settings
  const handleSaveProgramSettings = (settings) => {
    // In a real app, this would make an API call
    setProgramSettings(settings);
    alert('Program settings updated successfully!');
  };
  
  // Handle loan type status toggle
  const handleToggleLoanTypeStatus = (id) => {
    const updatedLoanTypes = loanTypes.map(lt => 
      lt.id === id ? {...lt, status: lt.status === 'active' ? 'inactive' : 'active'} : lt
    );
    setLoanTypes(updatedLoanTypes);
  };
  
  // Check if user has access
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access the loan settings page.</p>
        <Button onClick={() => router.push('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Loan Program Settings | HR Portal</title>
        <meta name="description" content="Configure the company loan program settings" />
      </Head>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Program Settings</h1>
            <p className="text-gray-600 mt-1">Configure loan types and program parameters</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/loans/management')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Management Dashboard
            </Button>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="loan-types" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="loan-types">Loan Types</TabsTrigger>
            <TabsTrigger value="program-settings">Program Settings</TabsTrigger>
          </TabsList>
          
          {/* Loan Types Tab */}
          <TabsContent value="loan-types">
            {!editMode ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Available Loan Types</CardTitle>
                    <CardDescription>Configure the types of loans available to employees</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingLoanType(null);
                    setEditMode(true);
                  }} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Loan Type
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {loanTypes.map((loanType) => (
                      <div key={loanType.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium">{loanType.name}</h3>
                              <Badge className={loanType.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {loanType.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{loanType.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleLoanTypeStatus(loanType.id)}
                              className="flex items-center gap-1"
                            >
                              {loanType.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingLoanType(loanType);
                                setEditMode(true);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </Button>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Amount Range</p>
                            <p className="text-sm">{formatCurrency(loanType.minAmount)} - {formatCurrency(loanType.maxAmount)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Term Range</p>
                            <p className="text-sm">
                              {loanType.minTerm < 1 ? `${loanType.minTerm * 12} months` : `${loanType.minTerm} ${loanType.minTerm === 1 ? 'year' : 'years'}`} - 
                              {loanType.maxTerm} {loanType.maxTerm === 1 ? 'year' : 'years'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                            <p className="text-sm">{loanType.interestRate}%</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Eligibility</p>
                          <p className="text-sm">{loanType.eligibility}</p>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">Required Documents</p>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {loanType.documents.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{editingLoanType ? `Edit ${editingLoanType.name}` : 'Add New Loan Type'}</CardTitle>
                  <CardDescription>Configure the loan type details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loan Type Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          defaultValue={editingLoanType?.name || ''}
                          placeholder="e.g., Personal Loan"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          defaultValue={editingLoanType?.interestRate || ''}
                          placeholder="e.g., 9.5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          defaultValue={editingLoanType?.minAmount || ''}
                          placeholder="e.g., 5000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          defaultValue={editingLoanType?.maxAmount || ''}
                          placeholder="e.g., 50000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Term (years)
                        </label>
                        <input
                          type="number"
                          step="0.25"
                          min="0.25"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          defaultValue={editingLoanType?.minTerm || ''}
                          placeholder="e.g., 0.5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Term (years)
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          defaultValue={editingLoanType?.maxTerm || ''}
                          placeholder="e.g., 3"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={editingLoanType?.description || ''}
                        placeholder="Describe the purpose of this loan type"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Eligibility Criteria
                      </label>
                      <textarea
                        rows={2}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={editingLoanType?.eligibility || ''}
                        placeholder="Specify who is eligible for this loan type"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Required Documents
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={editingLoanType?.documents?.join('\n') || ''}
                        placeholder="List documents, one per line"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter each document on a new line</p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingLoanType(null);
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // In a real app, we would get values from form
                      const mockLoanType = editingLoanType || {
                        name: 'New Loan Type',
                        minAmount: 10000,
                        maxAmount: 100000,
                        minTerm: 1,
                        maxTerm: 5,
                        interestRate: 8.5,
                        description: 'New loan type description',
                        eligibility: 'Available to employees with 1+ year of service',
                        documents: ['Identity proof', 'Salary statements', 'Purpose documentation']
                      };
                      handleSaveLoanType(mockLoanType);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Loan Type
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          {/* Program Settings Tab */}
          <TabsContent value="program-settings">
            <Card>
              <CardHeader>
                <CardTitle>Program Settings</CardTitle>
                <CardDescription>Configure global settings for the loan program</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Active Loans Per Employee
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.maxActiveLoans}
                      />
                      <p className="mt-1 text-xs text-gray-500">Maximum number of loans an employee can have at once</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Credit Score
                      </label>
                      <input
                        type="number"
                        min="300"
                        max="900"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.minCreditScore}
                      />
                      <p className="mt-1 text-xs text-gray-500">Minimum credit score required for loan approval</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Eligibility Period (months)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="36"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.eligibilityPeriod}
                      />
                      <p className="mt-1 text-xs text-gray-500">Minimum employment period before loan eligibility</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grace Period (days)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.gracePeriod}
                      />
                      <p className="mt-1 text-xs text-gray-500">Grace period before a payment is considered late</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Late Fee Percentage
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.lateFeePercentage}
                      />
                      <p className="mt-1 text-xs text-gray-500">Percentage fee applied to late payments</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prepayment Penalty Percentage
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.prepaymentPenalty}
                      />
                      <p className="mt-1 text-xs text-gray-500">Penalty for early loan repayment (0 for no penalty)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Disbursement Time (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.disbursementTime}
                      />
                      <p className="mt-1 text-xs text-gray-500">Standard time for loan disbursement after approval</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Payment Method
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={programSettings.defaultPaymentMethod}
                      >
                        {programSettings.paymentMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">Default method for loan repayments</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approval Workflow
                    </label>
                    <textarea
                      rows={2}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      defaultValue={programSettings.approvalWorkflow.join('\n')}
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter each approver role on a new line, in order of approval</p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">About Program Settings</p>
                        <p className="text-sm text-blue-600 mt-1">
                          These settings apply to all loan types across the organization. Changes to these settings will affect all future loan applications and may impact existing loans.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => handleSaveProgramSettings(programSettings)}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
} 
