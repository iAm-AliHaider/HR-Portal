import React, { useState, useEffect } from "react";

import Link from "next/link";

import {
  Check,
  X,
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDisclosure } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Mock eligibility criteria data
const mockEligibilityCriteria = [
  {
    id: "leave-eligibility",
    requestType: "leave",
    requirements: [
      {
        id: "employment-duration",
        name: "Employment Duration",
        description: "Must be employed for at least 90 days",
        evaluationType: "automatic",
        evaluationRule: "employmentDuration >= 90",
        priority: "high",
        active: true,
      },
      {
        id: "leave-balance",
        name: "Leave Balance",
        description: "Must have sufficient leave balance",
        evaluationType: "automatic",
        evaluationRule: "leaveBalance >= requestedDays",
        priority: "high",
        active: true,
      },
      {
        id: "prior-notice",
        name: "Prior Notice",
        description:
          "Request must be made at least 14 days in advance for planned leave",
        evaluationType: "automatic",
        evaluationRule: 'daysUntilStartDate >= 14 || leaveType == "sick"',
        priority: "medium",
        active: true,
      },
    ],
  },
  {
    id: "equipment-eligibility",
    requestType: "equipment",
    requirements: [
      {
        id: "budget-availability",
        name: "Budget Availability",
        description: "Department must have available budget",
        evaluationType: "manager-approval",
        evaluationRule: null,
        priority: "high",
        active: true,
      },
      {
        id: "replacement-cycle",
        name: "Replacement Cycle",
        description:
          "Equipment must be due for replacement (older than 24 months)",
        evaluationType: "automatic",
        evaluationRule: "lastEquipmentProvidedMonths >= 24",
        priority: "medium",
        active: true,
      },
    ],
  },
  {
    id: "training-eligibility",
    requestType: "training",
    requirements: [
      {
        id: "probation-period",
        name: "Probation Period",
        description: "Must have completed probation period",
        evaluationType: "automatic",
        evaluationRule: "employmentDuration >= 180",
        priority: "high",
        active: true,
      },
      {
        id: "training-relevance",
        name: "Position Relevance",
        description: "Training must be relevant to current role",
        evaluationType: "manager-approval",
        evaluationRule: null,
        priority: "high",
        active: true,
      },
      {
        id: "budget-availability",
        name: "Budget Availability",
        description: "Department must have training budget",
        evaluationType: "automatic",
        evaluationRule: "trainingBudgetAvailable == true",
        priority: "medium",
        active: true,
      },
    ],
  },
];

// Mock request types
const requestTypes = [
  { id: "leave", name: "Leave Request" },
  { id: "equipment", name: "Equipment Request" },
  { id: "expense", name: "Expense Reimbursement" },
  { id: "travel", name: "Travel Authorization" },
  { id: "training", name: "Training Request" },
  { id: "software", name: "Software Request" },
  { id: "access", name: "Access Request" },
];

// Evaluation types
const evaluationTypes = [
  { id: "automatic", name: "Automatic (System Check)" },
  { id: "manager-approval", name: "Manager Approval Required" },
  { id: "hr-approval", name: "HR Approval Required" },
  { id: "finance-approval", name: "Finance Approval Required" },
  { id: "custom", name: "Custom Script" },
];

// Use simple component instead to fix missing imports
const SimpleTable = ({ children, ...props }) => (
  <table className="w-full" {...props}>
    {children}
  </table>
);
const SimpleTableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
);
const SimpleTableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);
const SimpleTableRow = ({ children, ...props }) => (
  <tr className="border-b" {...props}>
    {children}
  </tr>
);
const SimpleTableHead = ({ children, ...props }) => (
  <th
    className="px-4 py-3 text-left text-sm font-medium text-gray-500"
    {...props}
  >
    {children}
  </th>
);
const SimpleTableCell = ({ children, ...props }) => (
  <td className="px-4 py-3 text-sm" {...props}>
    {children}
  </td>
);

export default function EligibilityManager() {
  const [eligibilityCriteria, setEligibilityCriteria] = useState(
    mockEligibilityCriteria,
  );
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);

  // Form state for new/editing criteria
  const [formData, setFormData] = useState({
    id: "",
    requestType: "",
    requirements: [],
  });

  // Requirement form data
  const [requirementFormData, setRequirementFormData] = useState({
    id: "",
    name: "",
    description: "",
    evaluationType: "",
    evaluationRule: "",
    priority: "medium",
    active: true,
  });

  const {
    isOpen: isCriteriaDialogOpen,
    onOpen: openCriteriaDialog,
    onClose: closeCriteriaDialog,
  } = useDisclosure();
  const {
    isOpen: isRequirementDialogOpen,
    onOpen: openRequirementDialog,
    onClose: closeRequirementDialog,
  } = useDisclosure();

  // Handle editing criteria
  const handleEditCriteria = (criteria) => {
    setSelectedCriteria(criteria);
    setFormData({ ...criteria });
    setIsEditing(true);
    openCriteriaDialog();
  };

  // Handle creating new criteria
  const handleNewCriteria = () => {
    setSelectedCriteria(null);
    setFormData({
      id: `criteria-${Date.now()}`,
      requestType: "",
      requirements: [],
    });
    setIsEditing(false);
    openCriteriaDialog();
  };

  // Handle saving criteria
  const handleSaveCriteria = () => {
    if (isEditing) {
      setEligibilityCriteria((prev) =>
        prev.map((c) => (c.id === formData.id ? formData : c)),
      );
    } else {
      setEligibilityCriteria((prev) => [...prev, formData]);
    }
    closeCriteriaDialog();
  };

  // Handle deleting criteria
  const handleDeleteCriteria = (id) => {
    if (
      confirm(
        "Are you sure you want to delete this eligibility criteria? This may affect existing requests.",
      )
    ) {
      setEligibilityCriteria((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Handle adding requirement
  const handleAddRequirement = () => {
    setEditingRequirement(null);
    setRequirementFormData({
      id: `req-${Date.now()}`,
      name: "",
      description: "",
      evaluationType: "",
      evaluationRule: "",
      priority: "medium",
      active: true,
    });
    openRequirementDialog();
  };

  // Handle editing requirement
  const handleEditRequirement = (requirement, index) => {
    setEditingRequirement(index);
    setRequirementFormData({ ...requirement });
    openRequirementDialog();
  };

  // Handle saving requirement
  const handleSaveRequirement = () => {
    const newRequirementData = {
      ...requirementFormData,
      evaluationRule:
        requirementFormData.evaluationType === "automatic"
          ? requirementFormData.evaluationRule
          : null,
    };

    if (editingRequirement !== null) {
      const updatedRequirements = [...formData.requirements];
      updatedRequirements[editingRequirement] = newRequirementData;
      setFormData({ ...formData, requirements: updatedRequirements });
    } else {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirementData],
      });
    }
    closeRequirementDialog();
  };

  // Handle deleting requirement
  const handleDeleteRequirement = (index) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);
    setFormData({ ...formData, requirements: updatedRequirements });
  };

  // Handle toggling requirement active status
  const handleToggleRequirementStatus = (index) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = {
      ...updatedRequirements[index],
      active: !updatedRequirements[index].active,
    };
    setFormData({ ...formData, requirements: updatedRequirements });
  };

  return (
    <ModernDashboardLayout
      title="Eligibility Manager"
      subtitle="Configure eligibility requirements for requests"
    >
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Eligibility Manager
            </h1>
            <p className="text-gray-600">
              Define eligibility requirements for each request type
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/settings">
              <Button variant="outline">Back to Settings</Button>
            </Link>
            <Link href="/settings/workflow-manager">
              <Button variant="outline">Workflow Manager</Button>
            </Link>
            <Button onClick={handleNewCriteria}>
              <Plus className="h-4 w-4 mr-2" />
              New Eligibility Criteria
            </Button>
          </div>
        </div>

        {/* Eligibility Criteria List */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
            <CardDescription>
              Define the requirements that employees must meet to submit
              requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable>
              <SimpleTableHeader>
                <SimpleTableRow>
                  <SimpleTableHead>Request Type</SimpleTableHead>
                  <SimpleTableHead>Requirements</SimpleTableHead>
                  <SimpleTableHead>Active Requirements</SimpleTableHead>
                  <SimpleTableHead className="text-right">
                    Actions
                  </SimpleTableHead>
                </SimpleTableRow>
              </SimpleTableHeader>
              <SimpleTableBody>
                {eligibilityCriteria.map((criteria) => {
                  const activeRequirements = criteria.requirements.filter(
                    (r) => r.active,
                  ).length;

                  return (
                    <SimpleTableRow key={criteria.id}>
                      <SimpleTableCell className="font-medium">
                        {requestTypes.find((t) => t.id === criteria.requestType)
                          ?.name || criteria.requestType}
                      </SimpleTableCell>
                      <SimpleTableCell>
                        {criteria.requirements.length} requirements
                      </SimpleTableCell>
                      <SimpleTableCell>
                        <div className="flex items-center">
                          <span className="mr-2">
                            {activeRequirements} active
                          </span>
                          {activeRequirements ===
                          criteria.requirements.length ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              All Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-200"
                            >
                              {criteria.requirements.length -
                                activeRequirements}{" "}
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </SimpleTableCell>
                      <SimpleTableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCriteria(criteria)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteCriteria(criteria.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </SimpleTableCell>
                    </SimpleTableRow>
                  );
                })}

                {eligibilityCriteria.length === 0 && (
                  <SimpleTableRow>
                    <SimpleTableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      No eligibility criteria defined. Click "New Eligibility
                      Criteria" to create one.
                    </SimpleTableCell>
                  </SimpleTableRow>
                )}
              </SimpleTableBody>
            </SimpleTable>
          </CardContent>
        </Card>

        {/* Criteria Dialog */}
        <Dialog isOpen={isCriteriaDialogOpen} onClose={closeCriteriaDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing
                  ? "Edit Eligibility Criteria"
                  : "Create New Eligibility Criteria"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modify eligibility requirements for this request type"
                  : "Define new eligibility requirements for a request type"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-sm font-medium">Request Type</label>
                <Select
                  value={formData.requestType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, requestType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">
                    Eligibility Requirements
                  </label>
                  <Button size="sm" onClick={handleAddRequirement}>
                    <Plus className="h-3 w-3 mr-1" /> Add Requirement
                  </Button>
                </div>

                {formData.requirements.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {formData.requirements.map((requirement, index) => (
                      <div
                        key={requirement.id}
                        className={`p-4 flex items-start justify-between ${requirement.active ? "" : "bg-gray-50"}`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 ${
                              requirement.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {requirement.active ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div
                              className={`font-medium ${requirement.active ? "" : "text-gray-500"}`}
                            >
                              {requirement.name}
                              {requirement.priority === "high" && (
                                <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {requirement.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Evaluation:{" "}
                              {evaluationTypes.find(
                                (t) => t.id === requirement.evaluationType,
                              )?.name || requirement.evaluationType}
                              {requirement.evaluationRule && (
                                <span className="ml-2 font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">
                                  {requirement.evaluationRule}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleRequirementStatus(index)}
                          >
                            {requirement.active ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleEditRequirement(requirement, index)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteRequirement(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center text-gray-500">
                    <ShieldCheck className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p>No eligibility requirements defined yet</p>
                    <p className="text-sm">
                      Click "Add Requirement" to define eligibility criteria
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={closeCriteriaDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveCriteria}>
                Save Eligibility Criteria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Requirement Dialog */}
        <Dialog
          isOpen={isRequirementDialogOpen}
          onClose={closeRequirementDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRequirement !== null
                  ? "Edit Requirement"
                  : "Add Requirement"}
              </DialogTitle>
              <DialogDescription>
                {editingRequirement !== null
                  ? "Modify this eligibility requirement"
                  : "Add a new eligibility requirement"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Requirement Name</label>
                <Input
                  value={requirementFormData.name}
                  onChange={(e) =>
                    setRequirementFormData({
                      ...requirementFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Employment Duration"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={requirementFormData.description}
                  onChange={(e) =>
                    setRequirementFormData({
                      ...requirementFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="e.g., Must be employed for at least 90 days"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Evaluation Type</label>
                <Select
                  value={requirementFormData.evaluationType}
                  onValueChange={(value) =>
                    setRequirementFormData({
                      ...requirementFormData,
                      evaluationType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select evaluation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {requirementFormData.evaluationType === "automatic" && (
                <div>
                  <label className="text-sm font-medium">Evaluation Rule</label>
                  <div className="relative">
                    <Input
                      value={requirementFormData.evaluationRule}
                      onChange={(e) =>
                        setRequirementFormData({
                          ...requirementFormData,
                          evaluationRule: e.target.value,
                        })
                      }
                      placeholder="e.g., employmentDuration >= 90"
                      className="font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use variables like employmentDuration, leaveBalance, etc. in
                    your rule expression
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={requirementFormData.priority}
                  onValueChange={(value) =>
                    setRequirementFormData({
                      ...requirementFormData,
                      priority: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (Required)</SelectItem>
                    <SelectItem value="medium">
                      Medium (Warning if not met)
                    </SelectItem>
                    <SelectItem value="low">
                      Low (Informational only)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={requirementFormData.active}
                  onChange={(e) =>
                    setRequirementFormData({
                      ...requirementFormData,
                      active: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={closeRequirementDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveRequirement}>Save Requirement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ModernDashboardLayout>
  );
}
