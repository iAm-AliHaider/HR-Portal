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
  FileText,
  Settings,
} from "lucide-react";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
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

// Mock workflow data
const mockWorkflows = [
  {
    id: "leave-workflow",
    name: "Leave Request Workflow",
    description: "Approval process for leave requests",
    requestType: "leave",
    steps: [
      {
        id: "step-1",
        name: "Initial Submission",
        approverType: "System",
        estimatedTime: "1 day",
        isRequired: true,
      },
      {
        id: "step-2",
        name: "Manager Approval",
        approverType: "Manager",
        estimatedTime: "2 days",
        isRequired: true,
      },
      {
        id: "step-3",
        name: "HR Verification",
        approverType: "HR",
        estimatedTime: "1 day",
        isRequired: true,
      },
    ],
  },
  {
    id: "equipment-workflow",
    name: "Equipment Request Workflow",
    description: "Approval process for equipment requests",
    requestType: "equipment",
    steps: [
      {
        id: "step-1",
        name: "Initial Submission",
        approverType: "System",
        estimatedTime: "1 day",
        isRequired: true,
      },
      {
        id: "step-2",
        name: "Manager Approval",
        approverType: "Manager",
        estimatedTime: "2 days",
        isRequired: true,
      },
      {
        id: "step-3",
        name: "IT Department Approval",
        approverType: "IT Department",
        estimatedTime: "3 days",
        isRequired: true,
      },
      {
        id: "step-4",
        name: "Procurement Processing",
        approverType: "Procurement",
        estimatedTime: "5 days",
        isRequired: false,
      },
    ],
  },
  {
    id: "expense-workflow",
    name: "Expense Reimbursement Workflow",
    description: "Approval process for expense reimbursements",
    requestType: "expense",
    steps: [
      {
        id: "step-1",
        name: "Initial Submission",
        approverType: "System",
        estimatedTime: "1 day",
        isRequired: true,
      },
      {
        id: "step-2",
        name: "Manager Approval",
        approverType: "Manager",
        estimatedTime: "2 days",
        isRequired: true,
      },
      {
        id: "step-3",
        name: "Finance Department Review",
        approverType: "Finance Department",
        estimatedTime: "3 days",
        isRequired: true,
      },
      {
        id: "step-4",
        name: "Payment Processing",
        approverType: "Finance Department",
        estimatedTime: "2 days",
        isRequired: true,
      },
    ],
  },
];

// Mock approver types
const approverTypes = [
  { id: "system", name: "System" },
  { id: "manager", name: "Manager" },
  { id: "department-head", name: "Department Head" },
  { id: "hr", name: "HR Department" },
  { id: "it", name: "IT Department" },
  { id: "finance", name: "Finance Department" },
  { id: "procurement", name: "Procurement" },
  { id: "ceo", name: "CEO" },
  { id: "legal", name: "Legal Department" },
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

export default function WorkflowManager() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  // Form state for new/editing workflow
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    requestType: "",
    steps: [],
  });

  // Step form data
  const [stepFormData, setStepFormData] = useState({
    id: "",
    name: "",
    approverType: "",
    estimatedTime: "",
    isRequired: true,
  });

  const {
    isOpen: isWorkflowDialogOpen,
    onOpen: openWorkflowDialog,
    onClose: closeWorkflowDialog,
  } = useDisclosure();
  const {
    isOpen: isStepDialogOpen,
    onOpen: openStepDialog,
    onClose: closeStepDialog,
  } = useDisclosure();

  // Load workflow data
  useEffect(() => {
    // In a real app, this would fetch from an API
    // setWorkflows(mockWorkflows);
  }, []);

  // Handle editing workflow
  const handleEditWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setFormData({ ...workflow });
    setIsEditing(true);
    openWorkflowDialog();
  };

  // Handle creating new workflow
  const handleNewWorkflow = () => {
    setSelectedWorkflow(null);
    setFormData({
      id: `workflow-${Date.now()}`,
      name: "",
      description: "",
      requestType: "",
      steps: [],
    });
    setIsEditing(false);
    openWorkflowDialog();
  };

  // Handle saving workflow
  const handleSaveWorkflow = () => {
    if (isEditing) {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === formData.id ? formData : w)),
      );
    } else {
      setWorkflows((prev) => [...prev, formData]);
    }
    closeWorkflowDialog();
  };

  // Handle deleting workflow
  const handleDeleteWorkflow = (id) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
    }
  };

  // Handle adding step
  const handleAddStep = () => {
    setEditingStep(null);
    setStepFormData({
      id: `step-${Date.now()}`,
      name: "",
      approverType: "",
      estimatedTime: "",
      isRequired: true,
    });
    openStepDialog();
  };

  // Handle editing step
  const handleEditStep = (step, index) => {
    setEditingStep(index);
    setStepFormData({ ...step });
    openStepDialog();
  };

  // Handle saving step
  const handleSaveStep = () => {
    if (editingStep !== null) {
      const updatedSteps = [...formData.steps];
      updatedSteps[editingStep] = stepFormData;
      setFormData({ ...formData, steps: updatedSteps });
    } else {
      setFormData({ ...formData, steps: [...formData.steps, stepFormData] });
    }
    closeStepDialog();
  };

  // Handle deleting step
  const handleDeleteStep = (index) => {
    const updatedSteps = [...formData.steps];
    updatedSteps.splice(index, 1);
    setFormData({ ...formData, steps: updatedSteps });
  };

  // Handle reordering steps
  const handleMoveStep = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === formData.steps.length - 1)
    ) {
      return;
    }

    const updatedSteps = [...formData.steps];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [updatedSteps[index], updatedSteps[newIndex]] = [
      updatedSteps[newIndex],
      updatedSteps[index],
    ];

    setFormData({ ...formData, steps: updatedSteps });
  };

  return (
    <ModernDashboardLayout
      title="Workflow Manager"
      subtitle="Configure approval workflows for requests"
    >
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Workflow Manager
            </h1>
            <p className="text-gray-600">
              Configure approval workflows for different request types
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/settings">
              <Button variant="outline">Back to Settings</Button>
            </Link>
            <Link href="/settings/eligibility-manager">
              <Button variant="outline">Eligibility Manager</Button>
            </Link>
            <Button onClick={handleNewWorkflow}>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Workflows List */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Workflows</CardTitle>
            <CardDescription>
              Define the approval process for each request type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable>
              <SimpleTableHeader>
                <SimpleTableRow>
                  <SimpleTableHead>Name</SimpleTableHead>
                  <SimpleTableHead>Request Type</SimpleTableHead>
                  <SimpleTableHead>Steps</SimpleTableHead>
                  <SimpleTableHead>Description</SimpleTableHead>
                  <SimpleTableHead className="text-right">
                    Actions
                  </SimpleTableHead>
                </SimpleTableRow>
              </SimpleTableHeader>
              <SimpleTableBody>
                {workflows.map((workflow) => (
                  <SimpleTableRow key={workflow.id}>
                    <SimpleTableCell className="font-medium">
                      {workflow.name}
                    </SimpleTableCell>
                    <SimpleTableCell>{workflow.requestType}</SimpleTableCell>
                    <SimpleTableCell>{workflow.steps.length}</SimpleTableCell>
                    <SimpleTableCell className="max-w-xs truncate">
                      {workflow.description}
                    </SimpleTableCell>
                    <SimpleTableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditWorkflow(workflow)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </SimpleTableCell>
                  </SimpleTableRow>
                ))}

                {workflows.length === 0 && (
                  <SimpleTableRow>
                    <SimpleTableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No workflows defined. Click "New Workflow" to create one.
                    </SimpleTableCell>
                  </SimpleTableRow>
                )}
              </SimpleTableBody>
            </SimpleTable>
          </CardContent>
        </Card>

        {/* Workflow Dialog */}
        <Dialog isOpen={isWorkflowDialogOpen} onClose={closeWorkflowDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Workflow" : "Create New Workflow"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modify the workflow configuration"
                  : "Define a new approval workflow for a request type"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Leave Request Approval"
                  />
                </div>

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
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the purpose of this workflow"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Approval Steps</label>
                  <Button size="sm" onClick={handleAddStep}>
                    <Plus className="h-3 w-3 mr-1" /> Add Step
                  </Button>
                </div>

                {formData.steps.length > 0 ? (
                  <div className="border rounded-md">
                    {formData.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`p-4 flex items-start justify-between ${
                          index !== formData.steps.length - 1 ? "border-b" : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{step.name}</div>
                            <div className="text-sm text-gray-500">
                              Approver: {step.approverType}
                              {step.estimatedTime && (
                                <span> • Est. time: {step.estimatedTime}</span>
                              )}
                              {!step.isRequired && <span> • (Optional)</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={index === 0}
                            onClick={() => handleMoveStep(index, "up")}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={index === formData.steps.length - 1}
                            onClick={() => handleMoveStep(index, "down")}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(step, index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteStep(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center text-gray-500">
                    <Settings className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p>No steps defined yet</p>
                    <p className="text-sm">
                      Click "Add Step" to define the approval flow
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={closeWorkflowDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveWorkflow}>Save Workflow</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Step Dialog */}
        <Dialog isOpen={isStepDialogOpen} onClose={closeStepDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStep !== null ? "Edit Step" : "Add Step"}
              </DialogTitle>
              <DialogDescription>
                {editingStep !== null
                  ? "Modify this approval step"
                  : "Add a new step to the approval workflow"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Step Name</label>
                <Input
                  value={stepFormData.name}
                  onChange={(e) =>
                    setStepFormData({ ...stepFormData, name: e.target.value })
                  }
                  placeholder="e.g., Manager Approval"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Approver Type</label>
                <Select
                  value={stepFormData.approverType}
                  onValueChange={(value) =>
                    setStepFormData({ ...stepFormData, approverType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select approver type" />
                  </SelectTrigger>
                  <SelectContent>
                    {approverTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Estimated Time</label>
                <Input
                  value={stepFormData.estimatedTime}
                  onChange={(e) =>
                    setStepFormData({
                      ...stepFormData,
                      estimatedTime: e.target.value,
                    })
                  }
                  placeholder="e.g., 2 days"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={stepFormData.isRequired}
                  onChange={(e) =>
                    setStepFormData({
                      ...stepFormData,
                      isRequired: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="isRequired" className="text-sm font-medium">
                  Required Step
                </label>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={closeStepDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveStep}>Save Step</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ModernDashboardLayout>
  );
}
