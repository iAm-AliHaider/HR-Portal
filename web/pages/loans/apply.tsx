import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Calendar, InfoIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { GetServerSideProps } from 'next';

// Mock loan programs
const loanPrograms = [
  { id: 1, name: 'Personal Loan', interestRate: '8-12%', maxAmount: 50000, term: '1-5 years', eligibility: 'All permanent employees' },
  { id: 2, name: 'Education Loan', interestRate: '5-7%', maxAmount: 100000, term: '1-10 years', eligibility: 'Employees with >2 years tenure' },
  { id: 3, name: 'Home Loan', interestRate: '6-9%', maxAmount: 5000000, term: '5-30 years', eligibility: 'Confirmed employees with >3 years tenure' },
  { id: 4, name: 'Emergency Loan', interestRate: '0-3%', maxAmount: 30000, term: '1-3 years', eligibility: 'All employees (case-by-case approval)' },
];


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function LoanApplicationPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Form state
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    loanAmount: '',
    loanPurpose: '',
    loanTerm: '',
    repaymentMethod: 'salary_deduction',
    additionalComments: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedDetails, setCalculatedDetails] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
  } | null>(null);

  // Set the program from query params
  useEffect(() => {
    if (router.query.program) {
      const programId = Number(router.query.program);
      if (!isNaN(programId)) {
        setSelectedProgram(programId);
      }
    }
  }, [router.query]);

  // Get the selected program details
  const currentProgram = selectedProgram 
    ? loanPrograms.find(p => p.id === selectedProgram) 
    : null;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Recalculate loan details if amount or term changes
    if ((name === 'loanAmount' || name === 'loanTerm') && currentProgram) {
      calculateLoanDetails();
    }
  };

  // Handle program selection
  const handleProgramSelect = (programId: number) => {
    setSelectedProgram(programId);
    
    // Reset form when changing programs
    setFormData({
      loanAmount: '',
      loanPurpose: '',
      loanTerm: '',
      repaymentMethod: 'salary_deduction',
      additionalComments: '',
      agreeToTerms: false,
    });
    setCalculatedDetails(null);
  };

  // Calculate loan details (mock calculation)
  const calculateLoanDetails = () => {
    if (!currentProgram || !formData.loanAmount || !formData.loanTerm) {
      setCalculatedDetails(null);
      return;
    }

    const amount = parseFloat(formData.loanAmount);
    const termInYears = parseFloat(formData.loanTerm);
    
    if (isNaN(amount) || isNaN(termInYears) || amount <= 0 || termInYears <= 0) {
      setCalculatedDetails(null);
      return;
    }

    // Get middle of interest rate range
    const interestRateStr = currentProgram.interestRate;
    const interestRates = interestRateStr.replace(/%/g, '').split('-').map(Number);
    const avgInterestRate = interestRates.reduce((a, b) => a + b, 0) / interestRates.length;
    
    // Calculate monthly payment (P * r * (1+r)^n / ((1+r)^n - 1))
    const monthlyRate = avgInterestRate / 100 / 12;
    const numberOfPayments = termInYears * 12;
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthlyPayment = (amount * monthlyRate * x) / (x - 1);
    
    // Calculate total interest
    const totalRepayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalRepayment - amount;
    
    setCalculatedDetails({
      monthlyPayment,
      totalInterest,
      totalRepayment
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedProgram) {
      newErrors.program = 'Please select a loan program';
    }
    
    if (!formData.loanAmount) {
      newErrors.loanAmount = 'Loan amount is required';
    } else if (isNaN(parseFloat(formData.loanAmount)) || parseFloat(formData.loanAmount) <= 0) {
      newErrors.loanAmount = 'Please enter a valid loan amount';
    } else if (currentProgram && parseFloat(formData.loanAmount) > currentProgram.maxAmount) {
      newErrors.loanAmount = `Maximum amount for this loan is ₹${currentProgram.maxAmount.toLocaleString()}`;
    }
    
    if (!formData.loanPurpose) {
      newErrors.loanPurpose = 'Loan purpose is required';
    } else if (formData.loanPurpose.length < 10) {
      newErrors.loanPurpose = 'Please provide more details about the purpose';
    }
    
    if (!formData.loanTerm) {
      newErrors.loanTerm = 'Loan term is required';
    } else if (isNaN(parseFloat(formData.loanTerm)) || parseFloat(formData.loanTerm) <= 0) {
      newErrors.loanTerm = 'Please enter a valid loan term';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mock API call to submit loan application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert('Loan application submitted successfully!');
      
      // Redirect to loans dashboard
      router.push('/loans');
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({
        form: 'An error occurred while submitting your application. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Apply for Loan | HR Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/loans')}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Apply for Loan</h1>
              <p className="text-gray-500">Fill out the form below to apply for an employee loan</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Loan Programs */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Loan Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Select a loan program to apply for:
                </p>
                
                {loanPrograms.map(program => (
                  <div 
                    key={program.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedProgram === program.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleProgramSelect(program.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{program.name}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {program.interestRate}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Up to ₹{program.maxAmount.toLocaleString()}</p>
                      <p>Term: {program.term}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Eligibility: {program.eligibility}
                      </p>
                    </div>
                  </div>
                ))}
                
                {errors.program && (
                  <p className="text-red-500 text-sm mt-1">{errors.program}</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Column - Application Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentProgram 
                    ? `${currentProgram.name} Application` 
                    : 'Loan Application Form'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedProgram ? (
                  <div className="py-8 text-center">
                    <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No Loan Program Selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please select a loan program from the left panel to continue.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Loan Details */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Loan Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">
                            Loan Amount (₹) <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="loanAmount"
                              name="loanAmount"
                              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                errors.loanAmount ? 'border-red-300' : ''
                              }`}
                              value={formData.loanAmount}
                              onChange={handleInputChange}
                              min="1000"
                              max={currentProgram.maxAmount}
                              placeholder={`Max: ₹${currentProgram.maxAmount.toLocaleString()}`}
                            />
                            {errors.loanAmount && (
                              <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">
                            Loan Term (Years) <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="loanTerm"
                              name="loanTerm"
                              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                errors.loanTerm ? 'border-red-300' : ''
                              }`}
                              value={formData.loanTerm}
                              onChange={handleInputChange}
                              min="1"
                              max="30"
                              placeholder="e.g., 3"
                            />
                            {errors.loanTerm && (
                              <p className="text-red-500 text-sm mt-1">{errors.loanTerm}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Term range for {currentProgram.name}: {currentProgram.term}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="loanPurpose" className="block text-sm font-medium text-gray-700">
                            Loan Purpose <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="loanPurpose"
                              name="loanPurpose"
                              rows={3}
                              className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                errors.loanPurpose ? 'border-red-300' : ''
                              }`}
                              value={formData.loanPurpose}
                              onChange={handleInputChange}
                              placeholder="Please describe the purpose of this loan"
                            />
                            {errors.loanPurpose && (
                              <p className="text-red-500 text-sm mt-1">{errors.loanPurpose}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="repaymentMethod" className="block text-sm font-medium text-gray-700">
                            Preferred Repayment Method
                          </label>
                          <div className="mt-1">
                            <select
                              id="repaymentMethod"
                              name="repaymentMethod"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              value={formData.repaymentMethod}
                              onChange={handleInputChange}
                            >
                              <option value="salary_deduction">Salary Deduction</option>
                              <option value="bank_transfer">Bank Transfer</option>
                              <option value="check">Check</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Loan Calculation */}
                    {calculatedDetails && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Loan Calculation</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Monthly Payment</p>
                            <p className="text-xl font-bold text-blue-600">
                              ₹{calculatedDetails.monthlyPayment.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Total Interest</p>
                            <p className="text-xl font-bold text-blue-600">
                              ₹{calculatedDetails.totalInterest.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">Total Repayment</p>
                            <p className="text-xl font-bold text-blue-600">
                              ₹{calculatedDetails.totalRepayment.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          This is an approximate calculation based on average interest rate. 
                          Actual values may vary.
                        </p>
                      </div>
                    )}
                    
                    {/* Additional Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                      
                      <div>
                        <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
                          Comments or Special Requests
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="additionalComments"
                            name="additionalComments"
                            rows={2}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.additionalComments}
                            onChange={handleInputChange}
                            placeholder="Any additional information you'd like to provide"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${
                              errors.agreeToTerms ? 'border-red-300' : ''
                            }`}
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                            I agree to the terms and conditions
                          </label>
                          <p className="text-gray-500">
                            I confirm that all information provided is accurate and I have read and accept the
                            <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => router.push('/loans/terms')}>
                              Loan Terms and Conditions
                            </Button>.
                          </p>
                          {errors.agreeToTerms && (
                            <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Form error */}
                    {errors.form && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.form}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/loans')}
                        className="mr-3"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 
