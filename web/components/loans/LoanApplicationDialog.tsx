import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText, 
  User, 
  CheckCircle,
  AlertCircle,
  Calculator
} from 'lucide-react';

interface LoanType {
  id: string;
  name: string;
  interest_rate_min: number;
  interest_rate_max: number;
  max_amount: number;
  min_amount: number;
  max_term_months: number;
  min_term_months: number;
  eligibility_criteria: string;
  description?: string;
}

interface LoanApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (applicationData: any) => void;
}

const LOAN_TYPES: LoanType[] = [
  {
    id: 'personal',
    name: 'Personal Loan',
    interest_rate_min: 8.5,
    interest_rate_max: 12.0,
    max_amount: 200000,
    min_amount: 10000,
    max_term_months: 60,
    min_term_months: 6,
    eligibility_criteria: 'All permanent employees with 1+ year tenure',
    description: 'For personal expenses, home improvement, or emergencies'
  },
  {
    id: 'education',
    name: 'Education Loan',
    interest_rate_min: 7.5,
    interest_rate_max: 9.5,
    max_amount: 500000,
    min_amount: 25000,
    max_term_months: 120,
    min_term_months: 12,
    eligibility_criteria: 'Employees with 2+ years tenure',
    description: 'For education, training, and skill development'
  },
  {
    id: 'emergency',
    name: 'Emergency Loan',
    interest_rate_min: 6.0,
    interest_rate_max: 8.0,
    max_amount: 50000,
    min_amount: 5000,
    max_term_months: 24,
    min_term_months: 3,
    eligibility_criteria: 'All employees eligible',
    description: 'For urgent financial needs and medical emergencies'
  }
];

export default function LoanApplicationDialog({ isOpen, onClose, onSuccess }: LoanApplicationDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(null);
  const [applicationData, setApplicationData] = useState({
    loan_type_id: '',
    amount: '',
    purpose: '',
    term_months: '',
    employment_details: {
      employee_id: '',
      designation: '',
      tenure_years: '',
      monthly_salary: ''
    },
    documents: [],
    declaration: false
  });
  const [calculatedEMI, setCalculatedEMI] = useState(0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate EMI
  const calculateEMI = (principal: number, ratePercent: number, termMonths: number) => {
    const monthlyRate = ratePercent / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                (Math.pow(1 + monthlyRate, termMonths) - 1);
    return emi;
  };

  // Handle loan type selection
  const handleLoanTypeSelect = (loanType: LoanType) => {
    setSelectedLoanType(loanType);
    setApplicationData(prev => ({
      ...prev,
      loan_type_id: loanType.id
    }));
    setCurrentStep(2);
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: string, nested?: string) => {
    if (nested) {
      setApplicationData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Recalculate EMI if amount or term changes
    if (field === 'amount' || field === 'term_months') {
      const amount = parseFloat(field === 'amount' ? value : applicationData.amount);
      const term = parseInt(field === 'term_months' ? value : applicationData.term_months);
      
      if (amount && term && selectedLoanType) {
        const avgRate = (selectedLoanType.interest_rate_min + selectedLoanType.interest_rate_max) / 2;
        const emi = calculateEMI(amount, avgRate, term);
        setCalculatedEMI(emi);
      }
    }
  };

  // Submit application
  const handleSubmit = async () => {
    try {
      // Prepare the application data with the correct format expected by the API
      const submissionData = {
        employee_id: applicationData.employment_details.employee_id || 'EMP-001', // Default for demo
        employee_name: 'Demo User', // This should come from authentication context
        employee_email: 'demo@company.com', // This should come from authentication context
        loan_type: applicationData.loan_type_id, // API expects the loan type ID
        amount: parseFloat(applicationData.amount),
        purpose: applicationData.purpose,
        term_months: parseInt(applicationData.term_months),
        documents: applicationData.documents || []
      };

      console.log('Submitting loan application:', submissionData);

      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const responseText = await response.text();
      console.log('API Response:', response.status, responseText);

      if (response.ok) {
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { message: 'Application submitted successfully' };
        }
        
        onSuccess?.(result);
        onClose();
        
        // Reset form
        setCurrentStep(1);
        setSelectedLoanType(null);
        setApplicationData({
          loan_type_id: '',
          amount: '',
          purpose: '',
          term_months: '',
          employment_details: {
            employee_id: '',
            designation: '',
            tenure_years: '',
            monthly_salary: ''
          },
          documents: [],
          declaration: false
        });
        setCalculatedEMI(0);
      } else {
        throw new Error(`Failed to submit application: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert(`Failed to submit application: ${error.message}. Please try again.`);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Loan Type</h3>
              <p className="text-gray-600">Select the type of loan that best fits your needs</p>
            </div>
            
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {LOAN_TYPES.map((loanType) => (
                <Card 
                  key={loanType.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                  onClick={() => handleLoanTypeSelect(loanType)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{loanType.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{loanType.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {loanType.interest_rate_min}%-{loanType.interest_rate_max}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Amount Range:</span>
                        <p className="font-medium">{formatCurrency(loanType.min_amount)} - {formatCurrency(loanType.max_amount)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Term:</span>
                        <p className="font-medium">{loanType.min_term_months}-{loanType.max_term_months} months</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-xs text-gray-500">Eligibility: {loanType.eligibility_criteria}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loan Details</h3>
              <p className="text-gray-600">Enter your loan requirements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min={selectedLoanType?.min_amount}
                    max={selectedLoanType?.max_amount}
                    placeholder={`${formatCurrency(selectedLoanType?.min_amount || 0)} - ${formatCurrency(selectedLoanType?.max_amount || 0)}`}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={applicationData.amount}
                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={applicationData.term_months}
                    onChange={(e) => handleFieldChange('term_months', e.target.value)}
                  >
                    <option value="">Select loan term</option>
                    {Array.from(
                      { length: ((selectedLoanType?.max_term_months || 60) - (selectedLoanType?.min_term_months || 6)) / 6 + 1 },
                      (_, i) => {
                        const months = (selectedLoanType?.min_term_months || 6) + i * 6;
                        return months <= (selectedLoanType?.max_term_months || 60) ? (
                          <option key={months} value={months}>
                            {months} months ({Math.round(months / 12)} years)
                          </option>
                        ) : null;
                      }
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Loan *
              </label>
              <textarea
                placeholder="Please describe the purpose of your loan application..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={applicationData.purpose}
                onChange={(e) => handleFieldChange('purpose', e.target.value)}
              />
            </div>

            {calculatedEMI > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calculator className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Estimated EMI</h4>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculatedEMI)}</p>
                      <p className="text-sm text-blue-700">
                        Monthly payment for {applicationData.term_months} months
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employment Details</h3>
              <p className="text-gray-600">Verify your employment information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  placeholder="EMP-001"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={applicationData.employment_details.employee_id}
                  onChange={(e) => handleFieldChange('employee_id', e.target.value, 'employment_details')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={applicationData.employment_details.designation}
                  onChange={(e) => handleFieldChange('designation', e.target.value, 'employment_details')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenure (Years) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="2.5"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={applicationData.employment_details.tenure_years}
                  onChange={(e) => handleFieldChange('tenure_years', e.target.value, 'employment_details')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Salary *
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={applicationData.employment_details.monthly_salary}
                  onChange={(e) => handleFieldChange('monthly_salary', e.target.value, 'employment_details')}
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your employment details will be verified with HR records. Ensure all information is accurate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review & Submit</h3>
              <p className="text-gray-600">Please review your application before submitting</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Application Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Loan Type:</span>
                    <p className="font-medium">{selectedLoanType?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Amount:</span>
                    <p className="font-medium">{formatCurrency(parseFloat(applicationData.amount) || 0)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Term:</span>
                    <p className="font-medium">{applicationData.term_months} months</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Estimated EMI:</span>
                    <p className="font-medium text-blue-600">{formatCurrency(calculatedEMI)}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Purpose:</span>
                  <p className="font-medium">{applicationData.purpose}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="declaration"
                checked={applicationData.declaration}
                onChange={(e) => handleFieldChange('declaration', e.target.checked.toString())}
                className="mt-1"
              />
              <label htmlFor="declaration" className="text-sm text-gray-700">
                I declare that all the information provided is true and accurate. I understand that any false information may lead to rejection of my application.
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Apply for Loan
          </DialogTitle>
          <DialogDescription>
            Complete your loan application in a few simple steps
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6 px-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'}`}
              >
                {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="px-4 py-2">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 px-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === 1) {
                onClose();
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <Button
            onClick={() => {
              if (currentStep === 4) {
                handleSubmit();
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={
              (currentStep === 2 && (!applicationData.amount || !applicationData.term_months || !applicationData.purpose)) ||
              (currentStep === 3 && (!applicationData.employment_details.employee_id || !applicationData.employment_details.designation || !applicationData.employment_details.tenure_years || !applicationData.employment_details.monthly_salary)) ||
              (currentStep === 4 && !applicationData.declaration)
            }
          >
            {currentStep === 4 ? 'Submit Application' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 