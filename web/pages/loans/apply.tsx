import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  ArrowLeft,
  Calendar,
  InfoIcon,
  DollarSign,
  Calculator,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { GetServerSideProps } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function LoanApplicationPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State management
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanPurpose: "",
    loanTerm: "",
    repaymentMethod: "salary_deduction",
    additionalComments: "",
    agreeToTerms: false,
    documents: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedDetails, setCalculatedDetails] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
  } | null>(null);

  // Load loan programs on component mount
  useEffect(() => {
    loadLoanPrograms();
  }, []);

  // Set the program from query params
  useEffect(() => {
    if (router.query.program && loanPrograms.length > 0) {
      const programId = Number(router.query.program);
      if (!isNaN(programId)) {
        setSelectedProgram(programId.toString());
      }
    }
  }, [router.query, loanPrograms]);

  // Recalculate when amount or term changes
  useEffect(() => {
    if (formData.loanAmount && formData.loanTerm && selectedProgram) {
      calculateLoanDetails();
    }
  }, [formData.loanAmount, formData.loanTerm, selectedProgram]);

  // Load loan programs from API
  const loadLoanPrograms = async () => {
    try {
      const response = await fetch("/api/loans?type=settings");
      if (response.ok) {
        const data = await response.json();
        setLoanPrograms(data.loan_types || []);
      } else {
        // Fallback to mock data
        setLoanPrograms([
          {
            id: "personal",
            name: "Personal Loan",
            interest_rate_min: 8,
            interest_rate_max: 12,
            max_amount: 200000,
            min_amount: 10000,
            max_term_months: 60,
            min_term_months: 6,
            eligibility_criteria: "All permanent employees",
            required_documents: ["salary_slip", "bank_statement", "id_proof"],
          },
          {
            id: "education",
            name: "Education Loan",
            interest_rate_min: 7.5,
            interest_rate_max: 9.5,
            max_amount: 500000,
            min_amount: 25000,
            max_term_months: 120,
            min_term_months: 12,
            eligibility_criteria: "Employees with >2 years tenure",
            required_documents: [
              "admission_letter",
              "fee_structure",
              "salary_slip",
              "guarantor_details",
            ],
          },
          {
            id: "emergency",
            name: "Emergency Loan",
            interest_rate_min: 6,
            interest_rate_max: 8,
            max_amount: 50000,
            min_amount: 5000,
            max_term_months: 24,
            min_term_months: 3,
            eligibility_criteria: "All employees eligible",
            required_documents: ["emergency_proof", "salary_slip"],
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading loan programs:", error);
      // Use fallback data
      setLoanPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the selected program details
  const currentProgram = selectedProgram
    ? loanPrograms.find((p) => p.id === selectedProgram)
    : null;

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Handle program selection
  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);

    // Reset form when changing programs
    setFormData({
      loanAmount: "",
      loanPurpose: "",
      loanTerm: "",
      repaymentMethod: "salary_deduction",
      additionalComments: "",
      agreeToTerms: false,
      documents: [],
    });
    setCalculatedDetails(null);
    setErrors({});
  };

  // Calculate loan details
  const calculateLoanDetails = () => {
    if (!currentProgram || !formData.loanAmount || !formData.loanTerm) {
      setCalculatedDetails(null);
      return;
    }

    const amount = parseFloat(formData.loanAmount);
    const termInMonths = parseFloat(formData.loanTerm);

    if (
      isNaN(amount) ||
      isNaN(termInMonths) ||
      amount <= 0 ||
      termInMonths <= 0
    ) {
      setCalculatedDetails(null);
      return;
    }

    // Calculate average interest rate
    const avgInterestRate =
      (currentProgram.interest_rate_min + currentProgram.interest_rate_max) / 2;

    // Calculate monthly payment using loan formula
    const monthlyRate = avgInterestRate / 100 / 12;
    const numberOfPayments = termInMonths;
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthlyPayment = (amount * monthlyRate * x) / (x - 1);

    // Calculate totals
    const totalRepayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalRepayment - amount;

    setCalculatedDetails({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedProgram) {
      newErrors.program = "Please select a loan program";
    }

    if (!formData.loanAmount) {
      newErrors.loanAmount = "Loan amount is required";
    } else if (
      isNaN(parseFloat(formData.loanAmount)) ||
      parseFloat(formData.loanAmount) <= 0
    ) {
      newErrors.loanAmount = "Please enter a valid loan amount";
    } else if (currentProgram) {
      const amount = parseFloat(formData.loanAmount);
      if (amount < currentProgram.min_amount) {
        newErrors.loanAmount = `Minimum amount for this loan is ₹${currentProgram.min_amount.toLocaleString()}`;
      } else if (amount > currentProgram.max_amount) {
        newErrors.loanAmount = `Maximum amount for this loan is ₹${currentProgram.max_amount.toLocaleString()}`;
      }
    }

    if (!formData.loanPurpose) {
      newErrors.loanPurpose = "Loan purpose is required";
    } else if (formData.loanPurpose.length < 10) {
      newErrors.loanPurpose =
        "Please provide more details about the purpose (minimum 10 characters)";
    }

    if (!formData.loanTerm) {
      newErrors.loanTerm = "Loan term is required";
    } else if (
      isNaN(parseFloat(formData.loanTerm)) ||
      parseFloat(formData.loanTerm) <= 0
    ) {
      newErrors.loanTerm = "Please enter a valid loan term";
    } else if (currentProgram) {
      const termMonths = parseFloat(formData.loanTerm);
      if (termMonths < currentProgram.min_term_months) {
        newErrors.loanTerm = `Minimum term for this loan is ${currentProgram.min_term_months} months`;
      } else if (termMonths > currentProgram.max_term_months) {
        newErrors.loanTerm = `Maximum term for this loan is ${currentProgram.max_term_months} months`;
      }
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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
      const applicationData = {
        employee_id: user?.id || "current-user",
        employee_name: user?.name || "Current User",
        employee_email: user?.email || "user@company.com",
        loan_type: selectedProgram,
        amount: parseFloat(formData.loanAmount),
        purpose: formData.loanPurpose,
        term_months: parseFloat(formData.loanTerm),
        documents: formData.documents.map((file) => file.name), // In production, upload files first
      };

      const response = await fetch("/api/loans?type=apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Loan application submitted successfully! Application ID: ${result.id}`,
        );
        router.push("/loans/applications");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to submit application"}`);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Apply for Loan | HR Portal</title>
        <meta name="description" content="Apply for employee loan programs" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/loans")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Loans
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Apply for Loan</h1>
            <p className="text-gray-600 mt-1">
              Complete the application form to apply for a loan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Selection */}
            {!selectedProgram && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Loan Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loanPrograms.map((program) => (
                      <div
                        key={program.id}
                        className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        onClick={() => handleProgramSelect(program.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            {program.name}
                          </h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {program.interest_rate_min}%-
                            {program.interest_rate_max}%
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Amount Range:</span>
                            <span>
                              {formatCurrency(program.min_amount)} -{" "}
                              {formatCurrency(program.max_amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Term:</span>
                            <span>
                              {program.min_term_months}-
                              {program.max_term_months} months
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium">Eligibility:</span>
                            <p className="text-gray-600 mt-1">
                              {program.eligibility_criteria}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Form */}
            {selectedProgram && currentProgram && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected Program Info */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        {currentProgram.name}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProgram(null)}
                      >
                        Change Program
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Interest Rate</span>
                        <p className="font-medium">
                          {currentProgram.interest_rate_min}%-
                          {currentProgram.interest_rate_max}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount Range</span>
                        <p className="font-medium">
                          {formatCurrency(currentProgram.min_amount)} -{" "}
                          {formatCurrency(currentProgram.max_amount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Term Range</span>
                        <p className="font-medium">
                          {currentProgram.min_term_months}-
                          {currentProgram.max_term_months} months
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status</span>
                        <p className="font-medium text-green-600">Available</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loan Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loan Amount (₹) *
                        </label>
                        <input
                          type="number"
                          name="loanAmount"
                          value={formData.loanAmount}
                          onChange={handleInputChange}
                          placeholder={`${currentProgram.min_amount} - ${currentProgram.max_amount}`}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.loanAmount ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.loanAmount && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.loanAmount}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loan Term (months) *
                        </label>
                        <input
                          type="number"
                          name="loanTerm"
                          value={formData.loanTerm}
                          onChange={handleInputChange}
                          placeholder={`${currentProgram.min_term_months} - ${currentProgram.max_term_months}`}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.loanTerm ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.loanTerm && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.loanTerm}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose of Loan *
                      </label>
                      <textarea
                        name="loanPurpose"
                        value={formData.loanPurpose}
                        onChange={handleInputChange}
                        placeholder="Describe the purpose of your loan application..."
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.loanPurpose ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.loanPurpose && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.loanPurpose}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repayment Method
                      </label>
                      <select
                        name="repaymentMethod"
                        value={formData.repaymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="salary_deduction">
                          Salary Deduction
                        </option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Comments
                      </label>
                      <textarea
                        name="additionalComments"
                        value={formData.additionalComments}
                        onChange={handleInputChange}
                        placeholder="Any additional information..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Required Documents for {currentProgram.name}:
                      </h4>
                      <ul className="list-disc pl-5 text-sm text-blue-800">
                        {currentProgram.required_documents.map((doc, index) => (
                          <li key={index} className="capitalize">
                            {doc.replace(/_/g, " ")}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Documents
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB
                        each)
                      </p>
                    </div>

                    {formData.documents.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Uploaded Documents:
                        </h4>
                        <div className="space-y-2">
                          {formData.documents.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                            >
                              <span className="text-sm">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className={`mt-1 ${errors.agreeToTerms ? "border-red-500" : ""}`}
                      />
                      <div className="text-sm">
                        <p>
                          I agree to the{" "}
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                          >
                            terms and conditions
                          </button>{" "}
                          of the loan program and confirm that all information
                          provided is accurate.
                        </p>
                        {errors.agreeToTerms && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.agreeToTerms}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column - Calculation Summary */}
          {selectedProgram && currentProgram && (
            <div className="space-y-6">
              {/* Loan Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Loan Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {calculatedDetails ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Monthly Payment
                            </span>
                            <span className="font-semibold text-green-700">
                              {formatCurrency(calculatedDetails.monthlyPayment)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Interest
                            </span>
                            <span className="font-medium">
                              {formatCurrency(calculatedDetails.totalInterest)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Total Repayment
                            </span>
                            <span className="font-medium">
                              {formatCurrency(calculatedDetails.totalRepayment)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        * Calculations are based on average interest rate.
                        Actual rates may vary based on approval.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Enter loan amount and term to see calculations</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Eligibility Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <InfoIcon className="w-5 h-5" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <span className="font-medium">Application Review</span>
                        <p className="text-gray-600">2-3 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <span className="font-medium">
                          Document Verification
                        </span>
                        <p className="text-gray-600">1-2 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <span className="font-medium">Approval Decision</span>
                        <p className="text-gray-600">1 business day</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div>
                        <span className="font-medium">Disbursement</span>
                        <p className="text-gray-600">2-3 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
