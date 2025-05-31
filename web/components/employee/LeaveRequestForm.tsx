import React, { useState, useEffect } from "react";

import { Badge } from "@chakra-ui/react";
import {
  Calendar,
  Clock,
  FileText,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface LeaveType {
  id: string;
  name: string;
  maxDays: number;
  requiresApproval: boolean;
  minNotice: number; // days
  color: string;
  icon: string;
  balance: number; // remaining days
}

interface LeaveRequest {
  id?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  emergencyContact?: string;
  handoverNotes?: string;
  managerApproval: boolean;
  hrApproval: boolean;
  status: "draft" | "submitted" | "approved" | "rejected" | "cancelled";
  submissionDate?: string;
  approvalDate?: string;
  rejectionReason?: string;
}

interface LeaveBalance {
  leaveType: string;
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
}

const LeaveRequestForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [request, setRequest] = useState<LeaveRequest>({
    leaveType: "",
    startDate: "",
    endDate: "",
    totalDays: 0,
    reason: "",
    emergencyContact: "",
    handoverNotes: "",
    managerApproval: false,
    hrApproval: false,
    status: "draft",
  });

  const [leaveTypes] = useState<LeaveType[]>([
    {
      id: "annual",
      name: "Annual Leave",
      maxDays: 25,
      requiresApproval: true,
      minNotice: 7,
      color: "blue",
      icon: "🏖️",
      balance: 18,
    },
    {
      id: "sick",
      name: "Sick Leave",
      maxDays: 10,
      requiresApproval: false,
      minNotice: 0,
      color: "red",
      icon: "🤒",
      balance: 8,
    },
    {
      id: "personal",
      name: "Personal Leave",
      maxDays: 5,
      requiresApproval: true,
      minNotice: 3,
      color: "purple",
      icon: "👤",
      balance: 3,
    },
    {
      id: "maternity",
      name: "Maternity Leave",
      maxDays: 120,
      requiresApproval: true,
      minNotice: 30,
      color: "pink",
      icon: "👶",
      balance: 120,
    },
    {
      id: "paternity",
      name: "Paternity Leave",
      maxDays: 14,
      requiresApproval: true,
      minNotice: 30,
      color: "green",
      icon: "👨‍👶",
      balance: 14,
    },
  ]);

  const [leaveBalances] = useState<LeaveBalance[]>([
    { leaveType: "annual", allocated: 25, used: 7, pending: 0, remaining: 18 },
    { leaveType: "sick", allocated: 10, used: 2, pending: 0, remaining: 8 },
    { leaveType: "personal", allocated: 5, used: 2, pending: 0, remaining: 3 },
    {
      leaveType: "maternity",
      allocated: 120,
      used: 0,
      pending: 0,
      remaining: 120,
    },
    {
      leaveType: "paternity",
      allocated: 14,
      used: 0,
      pending: 0,
      remaining: 14,
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total days between start and end date
  useEffect(() => {
    if (request.startDate && request.endDate) {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      setRequest((prev) => ({ ...prev, totalDays: diffDays }));
    }
  }, [request.startDate, request.endDate]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!request.leaveType)
        newErrors.leaveType = "Please select a leave type";
      if (!request.startDate) newErrors.startDate = "Start date is required";
      if (!request.endDate) newErrors.endDate = "End date is required";
      if (
        request.startDate &&
        request.endDate &&
        new Date(request.startDate) > new Date(request.endDate)
      ) {
        newErrors.endDate = "End date must be after start date";
      }

      // Check minimum notice period
      if (request.leaveType && request.startDate) {
        const selectedLeaveType = leaveTypes.find(
          (type) => type.id === request.leaveType,
        );
        if (selectedLeaveType) {
          const startDate = new Date(request.startDate);
          const today = new Date();
          const daysDiff = Math.ceil(
            (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysDiff < selectedLeaveType.minNotice) {
            newErrors.startDate = `Minimum ${selectedLeaveType.minNotice} days notice required`;
          }
        }
      }

      // Check available balance
      if (request.leaveType && request.totalDays > 0) {
        const balance = leaveBalances.find(
          (b) => b.leaveType === request.leaveType,
        );
        if (balance && request.totalDays > balance.remaining) {
          newErrors.totalDays = `Insufficient balance. Available: ${balance.remaining} days`;
        }
      }
    }

    if (step === 2) {
      if (!request.reason.trim()) newErrors.reason = "Reason is required";
      if (request.reason.trim().length < 10)
        newErrors.reason =
          "Please provide a detailed reason (minimum 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update request status
      setRequest((prev) => ({
        ...prev,
        status: "submitted",
        submissionDate: new Date().toISOString(),
      }));

      // Show success and reset form
      setCurrentStep(4); // Success step
    } catch (error) {
      console.error("Error submitting leave request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLeaveTypeById = (id: string) =>
    leaveTypes.find((type) => type.id === id);
  const getBalanceByType = (type: string) =>
    leaveBalances.find((b) => b.leaveType === type);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Select Leave Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaveTypes.map((type) => {
            const balance = getBalanceByType(type.id);
            return (
              <div
                key={type.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  request.leaveType === type.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setRequest((prev) => ({ ...prev, leaveType: type.id }))
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-gray-500">
                        {type.requiresApproval
                          ? "Requires approval"
                          : "Auto-approved"}
                      </p>
                    </div>
                  </div>
                  <Badge colorScheme={type.color} variant="subtle">
                    {balance?.remaining || 0} days left
                  </Badge>
                </div>
                {type.minNotice > 0 && (
                  <p className="text-xs text-gray-400">
                    Minimum {type.minNotice} days notice required
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {errors.leaveType && (
          <p className="text-red-500 text-sm mt-2">{errors.leaveType}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={request.startDate}
            onChange={(e) =>
              setRequest((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={request.endDate}
            onChange={(e) =>
              setRequest((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min={request.startDate || new Date().toISOString().split("T")[0]}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      {request.totalDays > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">
              Total Days: {request.totalDays}
            </span>
          </div>
          {request.startDate && request.endDate && (
            <p className="text-sm text-blue-700 mt-1">
              From {formatDate(request.startDate)} to{" "}
              {formatDate(request.endDate)}
            </p>
          )}
          {errors.totalDays && (
            <p className="text-red-500 text-sm mt-2">{errors.totalDays}</p>
          )}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Leave *
        </label>
        <textarea
          value={request.reason}
          onChange={(e) =>
            setRequest((prev) => ({ ...prev, reason: e.target.value }))
          }
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Please provide a detailed reason for your leave request..."
        />
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {request.reason.length}/200 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emergency Contact (Optional)
        </label>
        <input
          type="text"
          value={request.emergencyContact}
          onChange={(e) =>
            setRequest((prev) => ({
              ...prev,
              emergencyContact: e.target.value,
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Name and phone number of emergency contact"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Handover Notes (Optional)
        </label>
        <textarea
          value={request.handoverNotes}
          onChange={(e) =>
            setRequest((prev) => ({ ...prev, handoverNotes: e.target.value }))
          }
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Instructions for colleagues covering your responsibilities..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedLeaveType = getLeaveTypeById(request.leaveType);
    const balance = getBalanceByType(request.leaveType);

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Review Your Request</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Leave Type</p>
                <div className="flex items-center mt-1">
                  <span className="text-lg mr-2">
                    {selectedLeaveType?.icon}
                  </span>
                  <p className="font-medium">{selectedLeaveType?.name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{request.totalDays} days</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p className="font-medium">
                {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Reason</p>
              <p className="mt-1">{request.reason}</p>
            </div>

            {request.emergencyContact && (
              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p className="mt-1">{request.emergencyContact}</p>
              </div>
            )}

            {request.handoverNotes && (
              <div>
                <p className="text-sm text-gray-500">Handover Notes</p>
                <p className="mt-1">{request.handoverNotes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Important Information</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>
                  • Your remaining balance after this request:{" "}
                  {(balance?.remaining || 0) - request.totalDays} days
                </li>
                {selectedLeaveType?.requiresApproval && (
                  <li>• This request requires manager approval</li>
                )}
                <li>
                  • You will receive email notifications about the status of
                  your request
                </li>
                <li>• You can cancel this request before it's approved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Request Submitted Successfully!
        </h3>
        <p className="text-gray-600">
          Your leave request has been submitted and is now pending approval.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700">
          <strong>What happens next?</strong>
          <br />
          1. Your manager will be notified to review your request
          <br />
          2. You'll receive an email notification once it's approved or rejected
          <br />
          3. You can track the status in your leave requests dashboard
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => (window.location.href = "/leave/requests")}
          className="bg-blue-600 text-white"
        >
          View My Requests
        </Button>
        <Button
          onClick={() => {
            setCurrentStep(1);
            setRequest({
              leaveType: "",
              startDate: "",
              endDate: "",
              totalDays: 0,
              reason: "",
              emergencyContact: "",
              handoverNotes: "",
              managerApproval: false,
              hrApproval: false,
              status: "draft",
            });
          }}
          variant="outline"
        >
          Submit Another Request
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Leave Request</CardTitle>
        {currentStep < 4 && renderStepIndicator()}
      </CardHeader>

      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestForm;
