import React, { useState } from "react";

import {
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Calculator,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

// Loan types data
const LOAN_TYPES: LoanType[] = [
  {
    id: "personal",
    name: "Personal Loan",
    description: "For personal expenses and financial needs",
    interest_rate_min: 8.5,
    interest_rate_max: 12.0,
    max_amount: 200000,
    min_amount: 10000,
    max_term_months: 60,
    min_term_months: 6,
    eligibility_criteria:
      "All permanent employees with minimum 6 months tenure",
  },
  {
    id: "education",
    name: "Education Loan",
    description: "For educational expenses and skill development",
    interest_rate_min: 7.5,
    interest_rate_max: 9.5,
    max_amount: 500000,
    min_amount: 25000,
    max_term_months: 120,
    min_term_months: 12,
    eligibility_criteria:
      "Employees with minimum 2 years tenure and valid educational documents",
  },
  {
    id: "emergency",
    name: "Emergency Loan",
    description: "For urgent financial needs and emergencies",
    interest_rate_min: 6.0,
    interest_rate_max: 8.0,
    max_amount: 50000,
    min_amount: 5000,
    max_term_months: 24,
    min_term_months: 3,
    eligibility_criteria:
      "All employees eligible, faster processing for urgent needs",
  },
];

export default function LoanApplicationDialog({
  isOpen,
  onClose,
  onSuccess,
}: LoanApplicationDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(
    null,
  );
  const [applicationData, setApplicationData] = useState({
    loan_type_id: "",
    amount: "",
    purpose: "",
    term_months: "",
    employment_details: {
      employee_id: "",
      designation: "",
      tenure_years: "",
      monthly_salary: "",
    },
    documents: [],
    declaration: false,
  });
  const [calculatedEMI, setCalculatedEMI] = useState(0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate EMI
  const calculateEMI = (
    principal: number,
    ratePercent: number,
    termMonths: number,
  ) => {
    const monthlyRate = ratePercent / 12 / 100;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    return emi;
  };

  // Handle loan type selection
  const handleLoanTypeSelect = (loanType: LoanType) => {
    setSelectedLoanType(loanType);
    setApplicationData((prev) => ({
      ...prev,
      loan_type_id: loanType.id,
    }));
    setCurrentStep(2);
  };

  // Handle form field changes
  const handleFieldChange = (
    field: string,
    value: string | boolean,
    nested?: string,
  ) => {
    if (nested) {
      setApplicationData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setApplicationData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Recalculate EMI if amount or term changes
    if (field === "amount" || field === "term_months") {
      const amount = parseFloat(
        field === "amount" ? (value as string) : applicationData.amount,
      );
      const term = parseInt(
        field === "term_months"
          ? (value as string)
          : applicationData.term_months,
      );

      if (amount && term && selectedLoanType) {
        const avgRate =
          (selectedLoanType.interest_rate_min +
            selectedLoanType.interest_rate_max) /
          2;
        const emi = calculateEMI(amount, avgRate, term);
        setCalculatedEMI(emi);
      }
    }
  };

  // Submit application
  const handleSubmit = async () => {
    try {
      const submissionData = {
        employee_id:
          applicationData.employment_details.employee_id || "EMP-001",
        employee_name: "Demo User",
        employee_email: "demo@company.com",
        loan_type: applicationData.loan_type_id,
        amount: parseFloat(applicationData.amount),
        purpose: applicationData.purpose,
        term_months: parseInt(applicationData.term_months),
        documents: applicationData.documents || [],
      };

      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        onSuccess?.(result);
        onClose();
        resetForm();
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting loan application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedLoanType(null);
    setApplicationData({
      loan_type_id: "",
      amount: "",
      purpose: "",
      term_months: "",
      employment_details: {
        employee_id: "",
        designation: "",
        tenure_years: "",
        monthly_salary: "",
      },
      documents: [],
      declaration: false,
    });
    setCalculatedEMI(0);
  };

  // Progress indicator component
  const ProgressIndicator = () => (
    <div className="mb-6 px-4">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  step
                )}
              </div>
              <span className="text-xs mt-1 text-gray-600 hidden sm:block">
                {step === 1
                  ? "Type"
                  : step === 2
                    ? "Details"
                    : step === 3
                      ? "Employment"
                      : "Review"}
              </span>
            </div>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Step 1: Loan Type Selection
  const renderStepOne = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Choose Your Loan Type
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Select the loan that best fits your needs
        </p>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {LOAN_TYPES.map((loanType) => (
          <Card
            key={loanType.id}
            className={`cursor-pointer transition-all border-2 hover:shadow-md ${
              selectedLoanType?.id === loanType.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => handleLoanTypeSelect(loanType)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {loanType.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {loanType.description}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {loanType.interest_rate_min}%-{loanType.interest_rate_max}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Amount:</span>
                  <p className="font-medium">
                    {formatCurrency(loanType.min_amount)} -{" "}
                    {formatCurrency(loanType.max_amount)}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Term:</span>
                  <p className="font-medium">
                    {loanType.min_term_months}-{loanType.max_term_months} months
                  </p>
                </div>
              </div>

              <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                <p className="text-blue-800">{loanType.eligibility_criteria}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Step 2: Loan Details
  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Loan Details
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Enter your loan requirements
        </p>
      </div>

      {/* Selected Loan Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-900">
                {selectedLoanType?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedLoanType?.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                min={selectedLoanType?.min_amount}
                max={selectedLoanType?.max_amount}
                placeholder="Enter amount"
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={applicationData.amount}
                onChange={(e) => handleFieldChange("amount", e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Range: {formatCurrency(selectedLoanType?.min_amount || 0)} -{" "}
              {formatCurrency(selectedLoanType?.max_amount || 0)}
            </p>
          </div>

          {/* Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={applicationData.term_months}
              onChange={(e) => handleFieldChange("term_months", e.target.value)}
            >
              <option value="">Select term</option>
              {Array.from(
                {
                  length:
                    Math.floor(
                      ((selectedLoanType?.max_term_months || 60) -
                        (selectedLoanType?.min_term_months || 6)) /
                        6,
                    ) + 1,
                },
                (_, i) => {
                  const months =
                    (selectedLoanType?.min_term_months || 6) + i * 6;
                  return months <= (selectedLoanType?.max_term_months || 60) ? (
                    <option key={months} value={months}>
                      {months} months ({Math.round((months / 12) * 10) / 10}{" "}
                      years)
                    </option>
                  ) : null;
                },
              )}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe the purpose of your loan..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              value={applicationData.purpose}
              onChange={(e) => handleFieldChange("purpose", e.target.value)}
            />
          </div>
        </div>

        {/* Right Column - EMI Calculator */}
        <div>
          {applicationData.amount && applicationData.term_months && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  EMI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {formatCurrency(calculatedEMI)}
                  </p>
                  <p className="text-green-700 font-medium">Monthly EMI</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <p className="text-green-600 font-semibold">
                      {applicationData.term_months} months
                    </p>
                    <p className="text-gray-600">Loan Term</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-green-600 font-semibold">
                      {formatCurrency(
                        calculatedEMI * parseInt(applicationData.term_months),
                      )}
                    </p>
                    <p className="text-gray-600">Total Payment</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal:</span>
                    <span className="font-semibold">
                      {formatCurrency(parseFloat(applicationData.amount))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        calculatedEMI * parseInt(applicationData.term_months) -
                          parseFloat(applicationData.amount),
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // Step 3: Employment Details
  const renderStepThree = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Employment Details
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Verify your employment information
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="EMP-001"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={applicationData.employment_details.employee_id}
            onChange={(e) =>
              handleFieldChange(
                "employee_id",
                e.target.value,
                "employment_details",
              )
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Software Engineer"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={applicationData.employment_details.designation}
            onChange={(e) =>
              handleFieldChange(
                "designation",
                e.target.value,
                "employment_details",
              )
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tenure (Years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="2.5"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={applicationData.employment_details.tenure_years}
            onChange={(e) =>
              handleFieldChange(
                "tenure_years",
                e.target.value,
                "employment_details",
              )
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Salary <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              placeholder="50000"
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={applicationData.employment_details.monthly_salary}
              onChange={(e) =>
                handleFieldChange(
                  "monthly_salary",
                  e.target.value,
                  "employment_details",
                )
              }
            />
          </div>
        </div>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">
                Verification Note
              </h4>
              <p className="text-sm text-yellow-700">
                Employment details will be verified with HR records. Please
                ensure accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Step 4: Review & Submit
  const renderStepFour = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Please review your application details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium">{selectedLoanType?.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <p className="font-medium text-green-600">
                    {formatCurrency(parseFloat(applicationData.amount) || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Term:</span>
                  <p className="font-medium">
                    {applicationData.term_months} months
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Monthly EMI:</span>
                  <p className="font-medium text-blue-600">
                    {formatCurrency(calculatedEMI)}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <span className="text-gray-500 text-sm">Purpose:</span>
                <p className="font-medium text-sm mt-1">
                  {applicationData.purpose}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Employee ID:</span>
                <p className="font-medium">
                  {applicationData.employment_details.employee_id}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Designation:</span>
                <p className="font-medium">
                  {applicationData.employment_details.designation}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Tenure:</span>
                <p className="font-medium">
                  {applicationData.employment_details.tenure_years} years
                </p>
              </div>
              <div>
                <span className="text-gray-500">Monthly Salary:</span>
                <p className="font-medium">
                  {formatCurrency(
                    parseFloat(
                      applicationData.employment_details.monthly_salary,
                    ) || 0,
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms & Declaration */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto">
              <p>• Loan approval subject to company policies</p>
              <p>• EMI deducted from monthly salary</p>
              <p>• No prepayment penalties</p>
              <p>• Processing within 2-3 business days</p>
              <p>• All information will be verified</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={applicationData.declaration}
                  onChange={(e) =>
                    handleFieldChange("declaration", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="declaration" className="text-sm text-gray-700">
                  <strong className="text-red-800">Declaration:</strong> I
                  declare that all information provided is true and accurate. I
                  agree to the terms and conditions.
                </label>
              </div>
            </CardContent>
          </Card>

          {applicationData.declaration && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">
                    Ready to Submit!
                  </h4>
                  <p className="text-green-700 text-sm">
                    Application will be processed within 2-3 days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      case 4:
        return renderStepFour();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedLoanType;
      case 2:
        return (
          applicationData.amount &&
          applicationData.term_months &&
          applicationData.purpose
        );
      case 3:
        return (
          applicationData.employment_details.employee_id &&
          applicationData.employment_details.designation &&
          applicationData.employment_details.tenure_years &&
          applicationData.employment_details.monthly_salary
        );
      case 4:
        return applicationData.declaration;
      default:
        return false;
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-hidden bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Apply for Employee Loan
              </h2>
              <p className="text-sm text-gray-600 hidden sm:block">
                Complete your application in simple steps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <ProgressIndicator />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Step {currentStep} of 4
            </span>

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
                className="px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? "Cancel" : "Previous"}
              </Button>

              <Button
                onClick={() => {
                  if (currentStep === 4) {
                    handleSubmit();
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                disabled={!canProceed()}
                className="px-4 py-2"
              >
                {currentStep === 4 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
