import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { 
  useExpenses, 
  useToast, 
  useForm, 
  useModal, 
  usePagination, 
  useSearch 
} from '../../hooks/useApi';
import { GetServerSideProps } from 'next';

// Expense form interface
interface ExpenseForm {
  description: string;
  amount: number;
  category: string;
  date: string;
  receipt_url?: string;
  notes?: string;
}

const ExpensesPage = () => {
  const router = useRouter();
  const toast = useToast();
  
  // API hooks
  const { 
    expenses, 
    loading, 
    error, 
    submitExpense, 
    approveExpense, 
    rejectExpense 
  } = useExpenses();

  // UI state
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Modals
  const addModal = useModal();
  const approveModal = useModal();
  const rejectModal = useModal();
  const detailsModal = useModal();

  // Search and pagination
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    expenses, 
    ['description', 'category', 'employee_name']
  );
  const { currentItems, currentPage, totalPages, goToPage, hasNext, hasPrev, nextPage, prevPage } = 
    usePagination(filteredItems, 12);

  // Form management
  const form = useForm<ExpenseForm>({
    description: '',
    amount: 0,
    category: '',
    date: '',
    receipt_url: '',
    notes: ''
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.description) {
      form.setError('description', 'Description is required');
      hasErrors = true;
    }
    
    if (!form.values.amount || form.values.amount <= 0) {
      form.setError('amount', 'Valid amount is required');
      hasErrors = true;
    }
    
    if (!form.values.category) {
      form.setError('category', 'Category is required');
      hasErrors = true;
    }

    if (!form.values.date) {
      form.setError('date', 'Date is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      await submitExpense({
        ...form.values,
        employee_id: 'current-user-id', // In real app, get from auth context
        employee_name: 'Current User',
        employee_email: 'user@company.com',
        manager_email: 'manager@company.com'
      });
      toast.success('Expense submitted successfully!');
      addModal.closeModal();
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle approval
  const handleApprove = async () => {
    if (!selectedExpense) return;
    
    setIsSubmitting(true);
    try {
      await approveExpense(selectedExpense.id);
      toast.success('Expense approved successfully!');
      approveModal.closeModal();
      setSelectedExpense(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!selectedExpense || !rejectionReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await rejectExpense(selectedExpense.id, rejectionReason);
      toast.success('Expense rejected successfully!');
      rejectModal.closeModal();
      setSelectedExpense(null);
      setRejectionReason('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    pending: expenses.filter(expense => expense.status === 'pending').length,
    approved: expenses.filter(expense => expense.status === 'approved').length,
    rejected: expenses.filter(expense => expense.status === 'rejected').length
  };

  const categories = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Training', 'Equipment', 'Other'];

  if (loading) {
    return (
      <ModernDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout title="Expense Management" subtitle="Submit and manage expense reports">
      <Head>
        <title>Expense Management | HR System</title>
      </Head>
      
      <div className="container mx-auto">
        {/* Submit Expense Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => addModal.openModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Submit Expense
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.total.toFixed(2)}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
              </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
              </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="text-3xl">❌</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
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

        {/* Expenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map(expense => (
            <div key={expense.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{expense.description}</h3>
                  <p className="text-sm text-gray-600 mb-1">{expense.category}</p>
                  <p className="text-sm text-gray-500">{expense.employee_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                  expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {expense.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <p><span className="font-medium">Amount:</span> ${expense.amount.toFixed(2)}</p>
                <p><span className="font-medium">Date:</span> {new Date(expense.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Submitted:</span> {new Date(expense.submitted_at).toLocaleDateString()}</p>
                {expense.receipt_url && (
                  <p><span className="font-medium">Receipt:</span> 📎 Available</p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedExpense(expense);
                    detailsModal.openModal();
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                >
                  Details
                </button>
                {expense.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedExpense(expense);
                        approveModal.openModal();
                      }}
                      className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm hover:bg-green-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedExpense(expense);
                        rejectModal.openModal();
                      }}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, filteredItems.length)} of {filteredItems.length} results
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

        {/* Submit Expense Modal */}
        {addModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Expense</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={form.values.description}
                      onChange={(e) => form.setValue('description', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Business lunch, travel expenses, etc."
                      required
                    />
                    {form.errors.description && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        value={form.values.amount}
                        onChange={(e) => form.setValue('amount', parseFloat(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="0"
                        step="0.01"
                        required
                      />
                      {form.errors.amount && (
                        <p className="text-red-600 text-sm mt-1">{form.errors.amount}</p>
                      )}
                    </div>

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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.values.date}
                      onChange={(e) => form.setValue('date', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {form.errors.date && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Receipt URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={form.values.receipt_url}
                      onChange={(e) => form.setValue('receipt_url', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={form.values.notes}
                      onChange={(e) => form.setValue('notes', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Additional details about this expense..."
                    />
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
                    {isSubmitting ? 'Submitting...' : 'Submit Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Approve Modal */}
        {approveModal.isOpen && selectedExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Expense</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to approve this expense of ${selectedExpense.amount.toFixed(2)} for "{selectedExpense.description}"?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    approveModal.closeModal();
                    setSelectedExpense(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Approving...' : 'Approve Expense'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal.isOpen && selectedExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Expense</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this expense:
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                rows={3}
                placeholder="Reason for rejection..."
                required
              />

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    rejectModal.closeModal();
                    setSelectedExpense(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={isSubmitting || !rejectionReason.trim()}
                >
                  {isSubmitting ? 'Rejecting...' : 'Reject Expense'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expense Details Modal */}
        {detailsModal.isOpen && selectedExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedExpense.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Amount</h4>
                    <p className="text-gray-700">${selectedExpense.amount.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                    <p className="text-gray-700">{selectedExpense.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Date</h4>
                    <p className="text-gray-700">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedExpense.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedExpense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedExpense.status}
                        </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Submitted By</h4>
                  <p className="text-gray-700">{selectedExpense.employee_name}</p>
                </div>

                {selectedExpense.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                    <p className="text-gray-700">{selectedExpense.notes}</p>
                  </div>
                )}

                {selectedExpense.rejection_reason && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Rejection Reason</h4>
                    <p className="text-gray-700">{selectedExpense.rejection_reason}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    detailsModal.closeModal();
                    setSelectedExpense(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                {selectedExpense.receipt_url && (
                  <button
                    onClick={() => window.open(selectedExpense.receipt_url, '_blank')}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Receipt
                  </button>
                )}
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
    </ModernDashboardLayout>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default ExpensesPage; 
