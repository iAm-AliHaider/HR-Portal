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
  const handleFieldChange = (field: string, value: string | boolean, nested?: string) => {
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
      const amount = parseFloat(field === 'amount' ? value as string : applicationData.amount);
      const term = parseInt(field === 'term_months' ? value as string : applicationData.term_months);
      
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Choose Your Loan Type</h3>
              <p className="text-gray-600 text-lg">Select the type of loan that best fits your financial needs</p>
            </div>
            
            <div className="grid gap-6 max-h-[400px] overflow-y-auto pr-2">
              {LOAN_TYPES.map((loanType) => (
                <Card 
                  key={loanType.id} 
                  className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-xl ${
                    selectedLoanType?.id === loanType.id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleLoanTypeSelect(loanType)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${
                          loanType.id === 'personal' ? 'bg-green-100 text-green-600' :
                          loanType.id === 'education' ? 'bg-blue-100 text-blue-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{loanType.name}</h4>
                          <p className="text-gray-600 mt-1">{loanType.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1 text-sm font-semibold">
                          {loanType.interest_rate_min}%-{loanType.interest_rate_max}% APR
                        </Badge>
                        {selectedLoanType?.id === loanType.id && (
                          <CheckCircle className="w-6 h-6 text-blue-600 mt-2 ml-auto" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-sm mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <span className="text-gray-500 block">Amount Range</span>
                        <p className="font-bold text-gray-900">{formatCurrency(loanType.min_amount)} - {formatCurrency(loanType.max_amount)}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <span className="text-gray-500 block">Loan Term</span>
                        <p className="font-bold text-gray-900">{loanType.min_term_months}-{loanType.max_term_months} months</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <span className="text-gray-500 block">Processing</span>
                        <p className="font-bold text-gray-900">2-3 days</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-blue-900 mb-1">Eligibility Requirements</h5>
                          <p className="text-blue-800 text-sm">{loanType.eligibility_criteria}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Interest rates are subject to credit assessment and company policies. Final rates may vary based on your employment history and creditworthiness.
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Loan Application Details</h3>
              <p className="text-gray-600 text-lg">Enter your loan requirements and see instant calculations</p>
            </div>

            {/* Selected Loan Type Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Selected: {selectedLoanType?.name}</h4>
                  <p className="text-gray-600">{selectedLoanType?.description}</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-white text-blue-800 border border-blue-300 px-3 py-1">
                    {selectedLoanType?.interest_rate_min}%-{selectedLoanType?.interest_rate_max}% APR
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Loan Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min={selectedLoanType?.min_amount}
                      max={selectedLoanType?.max_amount}
                      placeholder={`${formatCurrency(selectedLoanType?.min_amount || 0)} - ${formatCurrency(selectedLoanType?.max_amount || 0)}`}
                      className="pl-12 w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                      value={applicationData.amount}
                      onChange={(e) => handleFieldChange('amount', e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Minimum: {formatCurrency(selectedLoanType?.min_amount || 0)}</span>
                    <span>Maximum: {formatCurrency(selectedLoanType?.max_amount || 0)}</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Loan Term <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <select
                      className="pl-12 w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold appearance-none bg-white"
                      value={applicationData.term_months}
                      onChange={(e) => handleFieldChange('term_months', e.target.value)}
                    >
                      <option value="">Select loan term</option>
                      {Array.from(
                        { length: Math.floor(((selectedLoanType?.max_term_months || 60) - (selectedLoanType?.min_term_months || 6)) / 6) + 1 },
                        (_, i) => {
                          const months = (selectedLoanType?.min_term_months || 6) + i * 6;
                          return months <= (selectedLoanType?.max_term_months || 60) ? (
                            <option key={months} value={months}>
                              {months} months ({Math.round(months / 12 * 10) / 10} years)
                            </option>
                          ) : null;
                        }
                      )}
                    </select>
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Purpose of Loan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Please describe the purpose of your loan application in detail..."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    value={applicationData.purpose}
                    onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">Be specific about how you plan to use the loan funds.</p>
                </div>
              </div>

              {/* Right Column - EMI Calculator & Summary */}
              <div className="space-y-6">
                {/* EMI Calculator */}
                {calculatedEMI > 0 && (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <Calculator className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-green-900">EMI Calculation</h4>
                          <p className="text-green-700 text-sm">Monthly payment breakdown</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">{formatCurrency(calculatedEMI)}</p>
                          <p className="text-green-700 font-medium">Monthly EMI</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                            <p className="text-green-600 font-semibold">{applicationData.term_months} months</p>
                            <p className="text-gray-600">Loan Term</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                            <p className="text-green-600 font-semibold">{formatCurrency(calculatedEMI * parseInt(applicationData.term_months))}</p>
                            <p className="text-gray-600">Total Payment</p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Principal Amount:</span>
                            <span className="font-semibold">{formatCurrency(parseFloat(applicationData.amount))}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-600">Total Interest:</span>
                            <span className="font-semibold">{formatCurrency((calculatedEMI * parseInt(applicationData.term_months)) - parseFloat(applicationData.amount))}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Loan Guidelines */}
                <Card className="border-2 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Loan Guidelines
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Funds will be disbursed within 2-3 business days after approval</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>EMI will be automatically deducted from your salary</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>No prepayment penalties or hidden charges</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Flexible repayment options available</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Employment Verification</h3>
              <p className="text-gray-600 text-lg">Verify your employment details for loan processing</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="EMP-001"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={applicationData.employment_details.employee_id}
                      onChange={(e) => handleFieldChange('employee_id', e.target.value, 'employment_details')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Software Engineer"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={applicationData.employment_details.designation}
                      onChange={(e) => handleFieldChange('designation', e.target.value, 'employment_details')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tenure (Years) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="2.5"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={applicationData.employment_details.tenure_years}
                      onChange={(e) => handleFieldChange('tenure_years', e.target.value, 'employment_details')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Monthly Salary <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        placeholder="50000"
                        className="pl-12 w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={applicationData.employment_details.monthly_salary}
                        onChange={(e) => handleFieldChange('monthly_salary', e.target.value, 'employment_details')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Information */}
              <div className="space-y-6">
                <Card className="border-2 border-yellow-200 bg-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
                        <p className="text-sm text-yellow-700">
                          Your employment details will be verified with HR records. Please ensure all information is accurate and matches your official employment data.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      Verification Process
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <span>HR department will verify employment status</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <span>Salary details will be cross-checked with payroll</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <span>Verification typically takes 1-2 business days</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Review & Submit Application</h3>
              <p className="text-gray-600 text-lg">Please review all details before submitting your loan application</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Application Summary */}
              <div className="space-y-6">
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <CreditCard className="h-5 w-5" />
                      Loan Application Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Loan Type:</span>
                        <p className="font-semibold text-lg">{selectedLoanType?.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Amount:</span>
                        <p className="font-semibold text-lg text-green-600">{formatCurrency(parseFloat(applicationData.amount) || 0)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Term:</span>
                        <p className="font-semibold">{applicationData.term_months} months</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Monthly EMI:</span>
                        <p className="font-semibold text-blue-600">{formatCurrency(calculatedEMI)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Purpose:</span>
                      <p className="font-medium mt-1">{applicationData.purpose}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <User className="h-5 w-5" />
                      Employment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Employee ID:</span>
                        <p className="font-medium">{applicationData.employment_details.employee_id}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Designation:</span>
                        <p className="font-medium">{applicationData.employment_details.designation}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tenure:</span>
                        <p className="font-medium">{applicationData.employment_details.tenure_years} years</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Monthly Salary:</span>
                        <p className="font-medium">{formatCurrency(parseFloat(applicationData.employment_details.monthly_salary) || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Terms & Declaration */}
              <div className="space-y-6">
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      Terms & Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-700 space-y-3 max-h-48 overflow-y-auto">
                      <p>• Loan approval is subject to company policies and creditworthiness assessment.</p>
                      <p>• Interest rates are as per current company loan policy and may be revised.</p>
                      <p>• EMI will be automatically deducted from monthly salary.</p>
                      <p>• Prepayment is allowed without any penalty charges.</p>
                      <p>• Late payment charges may apply for missed EMIs.</p>
                      <p>• Loan insurance is mandatory for amounts above ₹1,00,000.</p>
                      <p>• All disputes are subject to company jurisdiction.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="declaration"
                        checked={applicationData.declaration}
                        onChange={(e) => handleFieldChange('declaration', e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="declaration" className="text-sm text-gray-700 leading-relaxed">
                        <strong className="text-red-800">Declaration:</strong> I hereby declare that all the information provided above is true, accurate, and complete to the best of my knowledge. I understand that any false information may lead to the rejection of my loan application and may result in disciplinary action. I agree to the terms and conditions mentioned above.
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-900">Ready to Submit!</h4>
                      <p className="text-green-700 text-sm">Your application will be processed within 2-3 business days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className="w-[95vw] max-w-[1600px] max-h-[90vh] overflow-hidden bg-white rounded-xl shadow-2xl">
        {/* Header with better spacing */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              Apply for Employee Loan
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              Complete your loan application in a few simple steps. All information is secure and confidential.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Enhanced Progress indicator */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { step: 1, label: 'Loan Type', icon: CreditCard },
              { step: 2, label: 'Details', icon: Calculator },
              { step: 3, label: 'Employment', icon: User },
              { step: 4, label: 'Review', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                      currentStep >= step 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : currentStep === step
                        ? 'bg-blue-50 border-blue-300 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`w-20 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Step content with proper padding */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            {renderStepContent()}
          </div>
        </div>

        {/* Enhanced Navigation buttons with better spacing */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <span>Step {currentStep} of 4</span>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep === 1) {
                    onClose();
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                {currentStep === 4 ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Submit Application
                  </div>
                ) : (
                  'Next Step'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 