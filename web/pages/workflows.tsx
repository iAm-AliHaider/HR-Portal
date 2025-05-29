import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { 
  useWorkflows, 
  useToast, 
  useForm, 
  useModal, 
  usePagination, 
  useSearch 
} from '../hooks/useApi';
import { GetServerSideProps } from 'next';

// Workflow form interface
interface WorkflowForm {
  name: string;
  description: string;
  category: string;
  steps: string;
  trigger_type: string;
  approvers: string;
  deadline_days: number;
}

const WorkflowManagementPage = () => {
  const router = useRouter();
  const toast = useToast();
  
  // API hooks
  const { 
    workflows, 
    loading, 
    error, 
    createWorkflow, 
    startWorkflow 
  } = useWorkflows();

  // UI state
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startWorkflowData, setStartWorkflowData] = useState({ title: '', assignee_email: '' });
  
  // Modals
  const addModal = useModal();
  const startModal = useModal();
  const detailsModal = useModal();

  // Search and pagination
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    workflows, 
    ['name', 'category', 'description']
  );
  const { currentItems, currentPage, totalPages, goToPage, hasNext, hasPrev, nextPage, prevPage } = 
    usePagination(filteredItems, 9);

  // Form management
  const form = useForm<WorkflowForm>({
    name: '',
    description: '',
    category: '',
    steps: '',
    trigger_type: '',
    approvers: '',
    deadline_days: 7
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.name) {
      form.setError('name', 'Workflow name is required');
      hasErrors = true;
    }
    
    if (!form.values.description) {
      form.setError('description', 'Description is required');
      hasErrors = true;
    }
    
    if (!form.values.category) {
      form.setError('category', 'Category is required');
      hasErrors = true;
    }

    if (!form.values.steps) {
      form.setError('steps', 'Workflow steps are required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      // Convert steps string to array
      const stepsArray = form.values.steps.split('\n').filter(step => step.trim());
      const approversArray = form.values.approvers.split(',').map(approver => approver.trim()).filter(a => a);
      
      await createWorkflow({
        ...form.values,
        steps: stepsArray,
        approvers: approversArray
      });
      toast.success('Workflow created successfully!');
      addModal.closeModal();
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create workflow');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle start workflow
  const handleStartWorkflow = async () => {
    if (!selectedWorkflow || !startWorkflowData.title || !startWorkflowData.assignee_email) return;
    
    setIsSubmitting(true);
    try {
      await startWorkflow(selectedWorkflow.id, startWorkflowData);
      toast.success('Workflow started successfully!');
      startModal.closeModal();
      setSelectedWorkflow(null);
      setStartWorkflowData({ title: '', assignee_email: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start workflow');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: workflows.length,
    active: workflows.filter(workflow => workflow.status === 'active').length,
    draft: workflows.filter(workflow => workflow.status === 'draft').length,
    completed: workflows.filter(workflow => workflow.status === 'completed').length
  };

  const categories = ['HR', 'Finance', 'IT', 'Operations', 'Compliance', 'Recruitment'];
  const triggerTypes = ['Manual', 'Automatic', 'Scheduled', 'Event-based'];

  if (loading) {
    return (
      <SimpleDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </SimpleDashboardLayout>
    );
  }

  return (
    <SimpleDashboardLayout>
      <Head>
        <title>Workflow Management | HR System</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflow Management</h1>
              <p className="text-gray-600 mt-2">Create and manage business process workflows</p>
            </div>
            <button
              onClick={() => addModal.openModal()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Workflow
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="text-3xl">⚙️</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="text-3xl">🟢</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map(workflow => (
            <div key={workflow.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{workflow.category}</p>
                  <p className="text-sm text-gray-500">{workflow.trigger_type} trigger</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                  workflow.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {workflow.status}
                </span>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{workflow.description}</p>
              
              <div className="space-y-2 text-sm mb-4">
                <p><span className="font-medium">Steps:</span> {workflow.steps.length}</p>
                <p><span className="font-medium">Deadline:</span> {workflow.deadline_days} days</p>
                <p><span className="font-medium">Created:</span> {new Date(workflow.created_at).toLocaleDateString()}</p>
                {workflow.approvers && workflow.approvers.length > 0 && (
                  <p><span className="font-medium">Approvers:</span> {workflow.approvers.length}</p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    detailsModal.openModal();
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    startModal.openModal();
                  }}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-200"
                >
                  Start
                </button>
                <button
                  onClick={() => router.push(`/workflows/${workflow.id}`)}
                  className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm hover:bg-green-200"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 9) + 1} to {Math.min(currentPage * 9, filteredItems.length)} of {filteredItems.length} results
            </p>
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={!hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-900">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={!hasNext}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create Workflow Modal */}
        {addModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Workflow</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workflow Name
                    </label>
                    <input
                      type="text"
                      value={form.values.name}
                      onChange={(e) => form.setValue('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Employee Onboarding, Leave Approval, etc."
                      required
                    />
                    {form.errors.name && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={form.values.category}
                        onChange={(e) => form.setValue('category', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {form.errors.category && (
                        <p className="text-red-600 text-sm mt-1">{form.errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trigger Type
                      </label>
                      <select
                        value={form.values.trigger_type}
                        onChange={(e) => form.setValue('trigger_type', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select trigger</option>
                        {triggerTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={form.values.description}
                      onChange={(e) => form.setValue('description', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Describe what this workflow accomplishes..."
                      required
                    />
                    {form.errors.description && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workflow Steps (one per line)
                    </label>
                    <textarea
                      value={form.values.steps}
                      onChange={(e) => form.setValue('steps', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={5}
                      placeholder="Step 1: Initial request&#10;Step 2: Manager review&#10;Step 3: HR approval&#10;Step 4: Documentation"
                      required
                    />
                    {form.errors.steps && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.steps}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Approvers (comma-separated emails)
                      </label>
                      <input
                        type="text"
                        value={form.values.approvers}
                        onChange={(e) => form.setValue('approvers', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="manager@company.com, hr@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deadline (days)
                      </label>
                      <input
                        type="number"
                        value={form.values.deadline_days}
                        onChange={(e) => form.setValue('deadline_days', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      addModal.closeModal();
                      form.reset();
                    }}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Workflow'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Start Workflow Modal */}
        {startModal.isOpen && selectedWorkflow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Workflow</h3>
              <p className="text-gray-600 mb-4">
                Starting workflow: "{selectedWorkflow.name}"
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={startWorkflowData.title}
                    onChange={(e) => setStartWorkflowData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Specific task name for this workflow instance"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee Email
                  </label>
                  <input
                    type="email"
                    value={startWorkflowData.assignee_email}
                    onChange={(e) => setStartWorkflowData(prev => ({ ...prev, assignee_email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="employee@company.com"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    startModal.closeModal();
                    setSelectedWorkflow(null);
                    setStartWorkflowData({ title: '', assignee_email: '' });
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartWorkflow}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting || !startWorkflowData.title || !startWorkflowData.assignee_email}
                >
                  {isSubmitting ? 'Starting...' : 'Start Workflow'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Details Modal */}
        {detailsModal.isOpen && selectedWorkflow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedWorkflow.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedWorkflow.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Workflow Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Category:</span> {selectedWorkflow.category}</p>
                      <p><span className="font-medium">Trigger:</span> {selectedWorkflow.trigger_type}</p>
                      <p><span className="font-medium">Deadline:</span> {selectedWorkflow.deadline_days} days</p>
                      <p><span className="font-medium">Status:</span> {selectedWorkflow.status}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Steps:</span> {selectedWorkflow.steps.length}</p>
                      <p><span className="font-medium">Approvers:</span> {selectedWorkflow.approvers?.length || 0}</p>
                      <p><span className="font-medium">Created:</span> {new Date(selectedWorkflow.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Workflow Steps</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedWorkflow.approvers && selectedWorkflow.approvers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Approvers</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedWorkflow.approvers.map((approver: string, index: number) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          {approver}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    detailsModal.closeModal();
                    setSelectedWorkflow(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    detailsModal.closeModal();
                    startModal.openModal();
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Start This Workflow
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toast.toasts.map(t => (
            <div
              key={t.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white ${
                t.type === 'success' ? 'bg-green-500' :
                t.type === 'error' ? 'bg-red-500' :
                t.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{t.message}</span>
                <button
                  onClick={() => toast.removeToast(t.id)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimpleDashboardLayout>
  );
};

export default WorkflowManagementPage;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
