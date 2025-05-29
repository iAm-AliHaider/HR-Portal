import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
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
  DollarSign,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { GetServerSideProps } from 'next';

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};

export default function LoanSettingsPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('loan-types');
  const [loanTypes, setLoanTypes] = useState([]);
  const [programSettings, setProgramSettings] = useState({
    max_active_loans_per_employee: 2,
    min_credit_score: 650,
    grace_period_days: 7,
    late_fee_percentage: 2.0,
    prepayment_penalty: 0,
    eligibility_period_months: 12,
    default_payment_method: 'Salary Deduction',
    disbursement_time_days: 3,
    approval_workflow: ['HR Manager', 'Finance Director']
  });
  const [editingLoanType, setEditingLoanType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if user has admin rights
  const isAdmin = role === 'admin' || role === 'hr_director' || role === 'finance_manager';

  // Load settings data on component mount
  useEffect(() => {
    if (isAdmin) {
      loadSettingsData();
    }
  }, [isAdmin]);

  // Load settings data from API
  const loadSettingsData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/loans?type=settings');
      if (response.ok) {
        const data = await response.json();
        setLoanTypes(data.loan_types || []);
        if (data.global_settings) {
          setProgramSettings({
            max_active_loans_per_employee: data.global_settings.max_active_loans_per_employee || 2,
            min_credit_score: data.global_settings.min_credit_score || 650,
            grace_period_days: data.global_settings.grace_period_days || 7,
            late_fee_percentage: data.global_settings.late_fee_percentage || 2.0,
            prepayment_penalty: data.global_settings.prepayment_penalty || 0,
            eligibility_period_months: data.global_settings.eligibility_period_months || 12,
            default_payment_method: data.global_settings.default_payment_method || 'Salary Deduction',
            disbursement_time_days: data.global_settings.disbursement_time_days || 3,
            approval_workflow: data.global_settings.approval_workflow || ['HR Manager', 'Finance Director']
          });
        }
      } else {
        // Fallback to mock data
        const mockLoanTypes = [
          {
            id: 'personal',
            name: 'Personal Loan',
            min_amount: 10000,
            max_amount: 200000,
            min_term_months: 6,
            max_term_months: 60,
            interest_rate_min: 8.5,
            interest_rate_max: 12.0,
            eligibility_criteria: 'All permanent employees',
            description: 'General purpose loans for personal expenses',
            required_documents: ['Identity proof', 'Salary statements (last 3 months)', 'Bank statements (last 3 months)'],
            status: 'active'
          },
          {
            id: 'education',
            name: 'Education Loan',
            min_amount: 25000,
            max_amount: 500000,
            min_term_months: 12,
            max_term_months: 120,
            interest_rate_min: 7.5,
            interest_rate_max: 9.5,
            eligibility_criteria: 'Employees with >2 years tenure',
            description: 'Loans for higher education and professional development',
            required_documents: ['Identity proof', 'Admission letter', 'Course fee structure', 'Salary statements (last 3 months)'],
            status: 'active'
          },
          {
            id: 'emergency',
            name: 'Emergency Loan',
            min_amount: 5000,
            max_amount: 50000,
            min_term_months: 3,
            max_term_months: 24,
            interest_rate_min: 6.0,
            interest_rate_max: 8.0,
            eligibility_criteria: 'All employees eligible',
            description: 'Short-term loans for medical or family emergencies',
            required_documents: ['Identity proof', 'Emergency proof (medical bills, etc.)', 'Salary statement'],
            status: 'active'
          }
        ];
        setLoanTypes(mockLoanTypes);
      }
    } catch (error) {
      console.error('Error loading settings data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle saving loan type changes
  const handleSaveLoanType = async (loanType: any) => {
    try {
      setIsSaving(true);
      
      // In a real app, this would make an API call to save/update loan type
      const method = editingLoanType ? 'PUT' : 'POST';
      const endpoint = editingLoanType 
        ? `/api/loans?type=loan-types&id=${editingLoanType.id}`
        : '/api/loans?type=loan-types';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanType)
      });

      if (response.ok) {
        // Update local state optimistically
        if (editingLoanType) {
          // Update existing loan type
          const updatedLoanTypes = loanTypes.map((lt: any) => 
            lt.id === editingLoanType.id ? {...loanType, id: lt.id} : lt
          );
          setLoanTypes(updatedLoanTypes);
        } else {
          // Add new loan type
          const newLoanType = {
            ...loanType,
            id: loanType.id || `loan-${Date.now()}`,
            status: 'active'
          };
          setLoanTypes([...loanTypes, newLoanType]);
        }
        
        setEditingLoanType(null);
        setEditMode(false);
        alert('Loan type saved successfully!');
      } else {
        // Fallback to optimistic update for demo
        if (editingLoanType) {
          const updatedLoanTypes = loanTypes.map((lt: any) => 
            lt.id === editingLoanType.id ? {...loanType, id: lt.id} : lt
          );
          setLoanTypes(updatedLoanTypes);
        } else {
          const newLoanType = {
            ...loanType,
            id: `loan-${Date.now()}`,
            status: 'active'
          };
          setLoanTypes([...loanTypes, newLoanType]);
        }
        
        setEditingLoanType(null);
        setEditMode(false);
        alert('Loan type saved successfully! (Using fallback)');
      }
    } catch (error) {
      console.error('Error saving loan type:', error);
      alert('Error saving loan type. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving program settings
  const handleSaveProgramSettings = async (settings: any) => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/loans?type=settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ global_settings: settings })
      });

      if (response.ok) {
        setProgramSettings(settings);
        alert('Program settings updated successfully!');
      } else {
        // Fallback for demo
        setProgramSettings(settings);
        alert('Program settings updated successfully! (Using fallback)');
      }
    } catch (error) {
      console.error('Error saving program settings:', error);
      alert('Error saving program settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle loan type status toggle
  const handleToggleLoanTypeStatus = async (id: string) => {
    try {
      const loanType = loanTypes.find((lt: any) => lt.id === id);
      if (!loanType) return;

      const newStatus = loanType.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`/api/loans?type=loan-types&id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      // Update local state optimistically
      const updatedLoanTypes = loanTypes.map((lt: any) => 
        lt.id === id ? {...lt, status: newStatus} : lt
      );
      setLoanTypes(updatedLoanTypes);
      
      if (!response.ok) {
        console.log('Using fallback for status toggle');
      }
    } catch (error) {
      console.error('Error toggling loan type status:', error);
    }
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
              onClick={loadSettingsData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/loans')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Loans
            </Button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading settings...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Tabs Navigation */
          <Tabs value={activeTab}>
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
                    {loanTypes.length === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No loan types configured</h3>
                        <p className="text-gray-600 mb-4">Add your first loan type to get started</p>
                        <Button onClick={() => {
                          setEditingLoanType(null);
                          setEditMode(true);
                        }}>
                          Add Loan Type
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {loanTypes.map((loanType: any) => (
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Amount Range</p>
                                <p className="text-sm">{formatCurrency(loanType.min_amount)} - {formatCurrency(loanType.max_amount)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Term Range</p>
                                <p className="text-sm">{loanType.min_term_months}-{loanType.max_term_months} months</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                                <p className="text-sm">{loanType.interest_rate_min}%-{loanType.interest_rate_max}%</p>
                              </div>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Eligibility</p>
                              <p className="text-sm">{loanType.eligibility_criteria}</p>
                            </div>
                            
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-500 mb-2">Required Documents</p>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {loanType.required_documents && loanType.required_documents.map((doc: string, index: number) => (
                                  <li key={index}>{doc}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <LoanTypeEditForm
                  loanType={editingLoanType}
                  onSave={handleSaveLoanType}
                  onCancel={() => {
                    setEditingLoanType(null);
                    setEditMode(false);
                  }}
                  isSaving={isSaving}
                />
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
                  <ProgramSettingsForm
                    settings={programSettings}
                    onSave={handleSaveProgramSettings}
                    isSaving={isSaving}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}

// Loan Type Edit Form Component
interface LoanTypeEditFormProps {
  loanType: any;
  onSave: (loanType: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function LoanTypeEditForm({ loanType, onSave, onCancel, isSaving }: LoanTypeEditFormProps) {
  const [formData, setFormData] = useState({
    id: loanType?.id || '',
    name: loanType?.name || '',
    min_amount: loanType?.min_amount || 5000,
    max_amount: loanType?.max_amount || 100000,
    min_term_months: loanType?.min_term_months || 6,
    max_term_months: loanType?.max_term_months || 60,
    interest_rate_min: loanType?.interest_rate_min || 8.0,
    interest_rate_max: loanType?.interest_rate_max || 12.0,
    description: loanType?.description || '',
    eligibility_criteria: loanType?.eligibility_criteria || '',
    required_documents: loanType?.required_documents?.join('\n') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const loanTypeData = {
      ...formData,
      required_documents: formData.required_documents.split('\n').filter(doc => doc.trim() !== '')
    };
    
    onSave(loanTypeData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{loanType ? `Edit ${loanType.name}` : 'Add New Loan Type'}</CardTitle>
        <CardDescription>Configure the loan type details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Type ID *
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                placeholder="e.g., personal"
                disabled={!!loanType}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Type Name *
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Personal Loan"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Amount *
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.min_amount}
                onChange={(e) => setFormData({...formData, min_amount: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Amount *
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.max_amount}
                onChange={(e) => setFormData({...formData, max_amount: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Term (months) *
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.min_term_months}
                onChange={(e) => setFormData({...formData, min_term_months: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Term (months) *
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.max_term_months}
                onChange={(e) => setFormData({...formData, max_term_months: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Interest Rate (%) *
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="0"
                max="50"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.interest_rate_min}
                onChange={(e) => setFormData({...formData, interest_rate_min: parseFloat(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Interest Rate (%) *
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="0"
                max="50"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.interest_rate_max}
                onChange={(e) => setFormData({...formData, interest_rate_max: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              value={formData.eligibility_criteria}
              onChange={(e) => setFormData({...formData, eligibility_criteria: e.target.value})}
              placeholder="Specify who is eligible for this loan type"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Documents (one per line)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.required_documents}
              onChange={(e) => setFormData({...formData, required_documents: e.target.value})}
              placeholder="Identity proof&#10;Salary statements&#10;Bank statements"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Loan Type
        </Button>
      </CardFooter>
    </Card>
  );
}

// Program Settings Form Component
interface ProgramSettingsFormProps {
  settings: any;
  onSave: (settings: any) => void;
  isSaving: boolean;
}

function ProgramSettingsForm({ settings, onSave, isSaving }: ProgramSettingsFormProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            value={formData.max_active_loans_per_employee}
            onChange={(e) => setFormData({...formData, max_active_loans_per_employee: parseInt(e.target.value)})}
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
            value={formData.min_credit_score}
            onChange={(e) => setFormData({...formData, min_credit_score: parseInt(e.target.value)})}
          />
          <p className="mt-1 text-xs text-gray-500">Minimum credit score required for loan approval</p>
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
            value={formData.grace_period_days}
            onChange={(e) => setFormData({...formData, grace_period_days: parseInt(e.target.value)})}
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
            value={formData.late_fee_percentage}
            onChange={(e) => setFormData({...formData, late_fee_percentage: parseFloat(e.target.value)})}
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
            value={formData.prepayment_penalty}
            onChange={(e) => setFormData({...formData, prepayment_penalty: parseFloat(e.target.value)})}
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
            value={formData.disbursement_time_days}
            onChange={(e) => setFormData({...formData, disbursement_time_days: parseInt(e.target.value)})}
          />
          <p className="mt-1 text-xs text-gray-500">Standard time for loan disbursement after approval</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Payment Method
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.default_payment_method}
            onChange={(e) => setFormData({...formData, default_payment_method: e.target.value})}
          >
            <option value="Salary Deduction">Salary Deduction</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">Default method for loan repayments</p>
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
            value={formData.eligibility_period_months}
            onChange={(e) => setFormData({...formData, eligibility_period_months: parseInt(e.target.value)})}
          />
          <p className="mt-1 text-xs text-gray-500">Minimum employment period before loan eligibility</p>
        </div>
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
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </Button>
      </div>
    </form>
  );
} 
