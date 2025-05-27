import { useState, useEffect, useCallback } from 'react';
import { 
  employeeService, 
  jobService, 
  leaveService, 
  trainingService, 
  complianceService, 
  workflowService,
  performanceService,
  applicationService,
  expenseService,
  notificationService,
  fileService,
  getInterviews,
  getOffers,
  ApiResponse 
} from '../services/api';
import { supabase } from '../lib/supabase/client';

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction();
      
      if (response.error) {
        setError(response.error);
        setData(null);
      } else {
        setData(response.data);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Employee Management Hooks
export function useEmployees() {
  const { data, loading, error, refetch } = useApiCall(employeeService.getEmployees);
  
  const createEmployee = async (employeeData: any) => {
    const response = await employeeService.createEmployee(employeeData);
    if (!response.error) {
      refetch(); // Refresh the list
      return response;
    }
    throw new Error(response.error);
  };

  const updateEmployee = async (id: string, updates: any) => {
    const response = await employeeService.updateEmployee(id, updates);
    if (!response.error) {
      refetch(); // Refresh the list
      return response;
    }
    throw new Error(response.error);
  };

  const deleteEmployee = async (id: string) => {
    const response = await employeeService.deleteEmployee(id);
    if (!response.error) {
      refetch(); // Refresh the list
      return response;
    }
    throw new Error(response.error);
  };

  return {
    employees: data || [],
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refetch
  };
}

// Single Employee Hook
export function useEmployee(id: string) {
  const { data, loading, error, refetch } = useApiCall(
    () => employeeService.getEmployeeById(id),
    [id]
  );

  return {
    employee: data,
    loading,
    error,
    refetch
  };
}

// Job Management Hooks
export function useJobs() {
  const { data, loading, error, refetch } = useApiCall(jobService.getJobs);
  
  const createJob = async (jobData: any) => {
    const response = await jobService.createJob(jobData);
    if (!response.error) {
      refetch();
      return response;
    }
    throw new Error(response.error);
  };

  const updateJob = async (id: string, updates: any) => {
    const response = await jobService.updateJob(id, updates);
    if (!response.error) {
      refetch();
      return response;
    }
    throw new Error(response.error);
  };

  const closeJob = async (id: string) => {
    const response = await jobService.closeJob(id);
    if (!response.error) {
      refetch();
      return response;
    }
    throw new Error(response.error);
  };

  return {
    jobs: data || [],
    loading,
    error,
    createJob,
    updateJob,
    closeJob,
    refetch
  };
}

// Single Job Hook
export function useJob(id: string) {
  const { data, loading, error, refetch } = useApiCall(
    () => jobService.getJobById(id),
    [id]
  );

  return {
    job: data,
    loading,
    error,
    refetch
  };
}

// Job Applications Hook
export function useJobApplications(jobId: string) {
  const { data, loading, error, refetch } = useApiCall(
    () => jobService.getApplicationsForJob(jobId),
    [jobId]
  );

  return {
    applications: data || [],
    loading,
    error,
    refetch
  };
}

// Leave Management Hooks
export function useLeaveRequests() {
  const { data, loading, error, refetch } = useApiCall(leaveService.getLeaveRequests);
  
  const submitRequest = async (leaveData: any) => {
    const response = await leaveService.submitLeaveRequest(leaveData);
    if (!response.error) {
      refetch();
      notificationService.send('email', leaveData.manager_email, 
        `New leave request from ${leaveData.employee_name}`);
      return response;
    }
    throw new Error(response.error);
  };

  const approveRequest = async (id: string, notes?: string) => {
    const response = await leaveService.approveLeaveRequest(id, notes);
    if (!response.error) {
      refetch();
      // Find the request to notify the employee
      const request = data?.find(r => r.id === id);
      if (request) {
        notificationService.send('email', request.employee_email, 
          `Your leave request has been approved`);
      }
      return response;
    }
    throw new Error(response.error);
  };

  const rejectRequest = async (id: string, reason: string) => {
    const response = await leaveService.rejectLeaveRequest(id, reason);
    if (!response.error) {
      refetch();
      // Find the request to notify the employee
      const request = data?.find(r => r.id === id);
      if (request) {
        notificationService.send('email', request.employee_email, 
          `Your leave request has been rejected: ${reason}`);
      }
      return response;
    }
    throw new Error(response.error);
  };

  return {
    requests: data || [],
    loading,
    error,
    submitRequest,
    approveRequest,
    rejectRequest,
    refetch
  };
}

// Training Management Hooks
export function useTrainingCourses() {
  const { data, loading, error, refetch } = useApiCall(trainingService.getCourses);
  
  const enrollInCourse = async (courseId: string, employeeId: string) => {
    const response = await trainingService.enrollInCourse(courseId, employeeId);
    if (!response.error) {
      refetch();
      return response;
    }
    throw new Error(response.error);
  };

  const createCourse = async (courseData: any) => {
    const response = await trainingService.createCourse(courseData);
    if (!response.error) {
      refetch();
      return response;
    }
    throw new Error(response.error);
  };

  return {
    courses: data || [],
    loading,
    error,
    enrollInCourse,
    createCourse,
    refetch
  };
}

// Compliance Management Hooks
export function useCompliance() {
  const { data, loading, error, refetch } = useApiCall(complianceService.getComplianceRequirements);
  
  const startAudit = async (requirementId: string) => {
    const response = await complianceService.startAudit(requirementId);
    if (!response.error) {
      refetch();
      // Notify relevant stakeholders
      notificationService.send('email', 'compliance@company.com', 
        `Audit started for requirement ${requirementId}`);
      return response;
    }
    throw new Error(response.error);
  };

  const updateStatus = async (id: string, status: string) => {
    const response = await complianceService.updateComplianceStatus(id, status);
    if (!response.error) {
      refetch();
      return response;
    }
    throw new Error(response.error);
  };

  return {
    requirements: data || [],
    loading,
    error,
    startAudit,
    updateStatus,
    refetch
  };
}

// Workflow Management Hooks
export function useWorkflows() {
  const { data, loading, error, refetch } = useApiCall(workflowService.getWorkflows);
  
  const createWorkflow = async (workflowData: any) => {
    const response = await workflowService.createWorkflow(workflowData);
    if (!response.error) {
      refetch();
      return response;
    }
    throw new Error(response.error);
  };

  const startWorkflow = async (workflowId: string, contextData: any) => {
    const response = await workflowService.startWorkflow(workflowId, contextData);
    if (!response.error) {
      // Notify relevant stakeholders
      notificationService.send('email', contextData.assignee_email, 
        `New workflow task assigned: ${contextData.title}`);
      return response;
    }
    throw new Error(response.error);
  };

  return {
    workflows: data || [],
    loading,
    error,
    createWorkflow,
    startWorkflow,
    refetch
  };
}

// Performance Review Hooks
export function usePerformanceReviews() {
  const { data, loading, error, refetch } = useApiCall(performanceService.getPerformanceReviews);
  
  const createReview = async (reviewData: any) => {
    const response = await performanceService.createReview(reviewData);
    if (!response.error) {
      refetch();
      notificationService.send('email', reviewData.employee_email, 
        `New performance review has been assigned to you`);
      return response;
    }
    throw new Error(response.error);
  };

  const submitReview = async (id: string, reviewData: any) => {
    const response = await performanceService.submitReview(id, reviewData);
    if (!response.error) {
      refetch();
      // Notify manager that review is complete
      notificationService.send('email', reviewData.manager_email, 
        `Performance review has been completed for ${reviewData.employee_name}`);
      return response;
    }
    throw new Error(response.error);
  };

  return {
    reviews: data || [],
    loading,
    error,
    createReview,
    submitReview,
    refetch
  };
}

// Application Management Hooks
export function useApplications() {
  const { data, loading, error, refetch } = useApiCall(applicationService.getApplications);
  
  const createApplication = async (applicationData: any) => {
    const response = await applicationService.createApplication(applicationData);
    if (!response.error) {
      refetch();
      notificationService.send('email', 'hr@company.com', 
        `New application received for ${applicationData.job_title}`);
      return response;
    }
    throw new Error(response.error);
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    const response = await applicationService.updateApplicationStatus(id, status, notes);
    if (!response.error) {
      refetch();
      // Notify candidate of status change
      const application = data?.find(app => app.id === id);
      if (application) {
        notificationService.send('email', application.candidate_email, 
          `Your application status has been updated to: ${status}`);
      }
      return response;
    }
    throw new Error(response.error);
  };

  const scheduleInterview = async (applicationId: string, interviewData: any) => {
    const response = await applicationService.scheduleInterview(applicationId, interviewData);
    if (!response.error) {
      refetch();
      // Notify candidate and interviewer
      notificationService.send('email', interviewData.candidate_email, 
        `Interview scheduled for ${interviewData.datetime}`);
      notificationService.send('email', interviewData.interviewer_email, 
        `Interview scheduled with ${interviewData.candidate_name}`);
      return response;
    }
    throw new Error(response.error);
  };

  return {
    applications: data || [],
    loading,
    error,
    createApplication,
    updateStatus,
    scheduleInterview,
    refetch
  };
}

// Expense Management Hooks
export function useExpenses() {
  const { data, loading, error, refetch } = useApiCall(expenseService.getExpenses);
  
  const submitExpense = async (expenseData: any) => {
    const response = await expenseService.submitExpense(expenseData);
    if (!response.error) {
      refetch();
      notificationService.send('email', expenseData.manager_email, 
        `New expense submission from ${expenseData.employee_name}: $${expenseData.amount}`);
      return response;
    }
    throw new Error(response.error);
  };

  const approveExpense = async (id: string) => {
    const response = await expenseService.approveExpense(id);
    if (!response.error) {
      refetch();
      // Notify employee of approval
      const expense = data?.find(exp => exp.id === id);
      if (expense) {
        notificationService.send('email', expense.employee_email, 
          `Your expense of $${expense.amount} has been approved`);
      }
      return response;
    }
    throw new Error(response.error);
  };

  const rejectExpense = async (id: string, reason: string) => {
    const response = await expenseService.rejectExpense(id, reason);
    if (!response.error) {
      refetch();
      // Notify employee of rejection
      const expense = data?.find(exp => exp.id === id);
      if (expense) {
        notificationService.send('email', expense.employee_email, 
          `Your expense has been rejected: ${reason}`);
      }
      return response;
    }
    throw new Error(response.error);
  };

  return {
    expenses: data || [],
    loading,
    error,
    submitExpense,
    approveExpense,
    rejectExpense,
    refetch
  };
}

// File Upload Hook
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File, folder?: string) => {
    setUploading(true);
    setUploadError(null);
    
    try {
      const response = await fileService.upload(file, folder);
      
      if (response.error) {
        setUploadError(response.error);
        return null;
      }
      
      setUploadError(null);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, uploadError };
}

// Form Management Hook
export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const setError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const setTouched = (field: keyof T) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    reset,
    isValid
  };
}

// Toast Notification Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>>([]);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, duration = 5000) => {
    const id = Date.now().toString();
    const toast = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    info: (message: string) => showToast('info', message),
    warning: (message: string) => showToast('warning', message)
  };
}

// Modal Management Hook
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const openModal = (modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setData(null);
  };

  return {
    isOpen,
    data,
    openModal,
    closeModal
  };
}

// Pagination Hook
export function usePagination<T>(items: T[], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}

// Search and Filter Hook
export function useSearch<T>(items: T[], searchFields: (keyof T)[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredItems = items.filter(item => {
    // Apply search
    if (searchTerm) {
      const matchesSearch = searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (!matchesSearch) return false;
    }

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value && item[key as keyof T] !== value) {
        return false;
      }
    }

    return true;
  });

  const setFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters,
    filteredItems
  };
}

// Company Settings Hook
export const useCompanySettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Environment-aware data loading
      if (process.env.NODE_ENV === 'development') {
        // Mock company settings data
        const mockSettings = {
          name: 'Acme Corporation',
          industry: 'Technology',
          size: '101-500',
          address: '123 Business Street, Tech City, TC 12345',
          phone: '+1 (555) 123-4567',
          email: 'contact@acme.com',
          website: 'https://acme.com',
          description: 'Leading technology company providing innovative solutions for modern businesses.',
          logo_url: 'https://via.placeholder.com/200x60/2563eb/ffffff?text=ACME',
          timezone: 'America/New_York',
          currency: 'USD',
          date_format: 'MM/DD/YYYY',
          working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          working_hours_start: '09:00',
          working_hours_end: '17:00',
          leave_policy: {
            annual_leave_days: 20,
            sick_leave_days: 10,
            personal_leave_days: 5,
            maternity_leave_days: 90,
            paternity_leave_days: 15
          },
          probation_period_months: 3,
          notice_period_days: 30,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: new Date().toISOString()
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setSettings(mockSettings);
      } else {
        // Production: Use Supabase
        const { data, error: apiError } = await supabase
          .from('company_settings')
          .select('*')
          .single();
        
        if (apiError) throw apiError;
        setSettings(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settingsData: any) => {
    try {
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        // Mock update
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSettings({ ...settings, ...settingsData, updated_at: new Date().toISOString() });
      } else {
        // Production: Use Supabase
        const { data, error: apiError } = await supabase
          .from('company_settings')
          .upsert(settingsData)
          .select()
          .single();
        
        if (apiError) throw apiError;
        setSettings(data);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update company settings');
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: loadSettings
  };
};

// Facilities Rooms Hook
export const useFacilitiesRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Environment-aware data loading
      if (process.env.NODE_ENV === 'development') {
        // Mock facilities rooms data
        const mockRooms = [
          {
            id: 'room1',
            name: 'Main Conference Room',
            description: 'Large conference room with video conferencing capabilities',
            location: 'Building A, 2nd Floor',
            building: 'Building A',
            floor: '2nd Floor',
            capacity: 12,
            equipment: ['Projector', 'Whiteboard', 'Video Conference', 'Microphone'],
            amenities: ['WiFi', 'Air Conditioning', 'Coffee Machine'],
            hourly_rate: 50,
            contact_person: 'John Smith',
            contact_email: 'john.smith@company.com',
            contact_phone: '+1 (555) 123-4567',
            video_conference_enabled: true,
            accessibility_features: ['Wheelchair Accessible', 'Elevator Access'],
            status: 'available',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
          },
          {
            id: 'room2',
            name: 'Small Meeting Room',
            description: 'Intimate meeting space for small teams',
            location: 'Building A, 1st Floor',
            building: 'Building A',
            floor: '1st Floor',
            capacity: 6,
            equipment: ['TV Monitor', 'Whiteboard'],
            amenities: ['WiFi', 'Natural Light'],
            hourly_rate: 25,
            contact_person: 'Jane Doe',
            contact_email: 'jane.doe@company.com',
            contact_phone: '+1 (555) 987-6543',
            video_conference_enabled: false,
            accessibility_features: [],
            status: 'occupied',
            created_at: '2024-01-02T00:00:00Z',
            updated_at: new Date().toISOString()
          },
          {
            id: 'room3',
            name: 'Executive Boardroom',
            description: 'Premium boardroom for executive meetings',
            location: 'Building B, 3rd Floor',
            building: 'Building B',
            floor: '3rd Floor',
            capacity: 20,
            equipment: ['Large Display', 'Conference Phone', 'Video Conference', 'Wireless Presenter'],
            amenities: ['WiFi', 'Air Conditioning', 'Catering Available', 'Executive Chairs'],
            hourly_rate: 100,
            contact_person: 'Mike Johnson',
            contact_email: 'mike.johnson@company.com',
            contact_phone: '+1 (555) 456-7890',
            video_conference_enabled: true,
            accessibility_features: ['Wheelchair Accessible', 'Elevator Access', 'Accessible Restroom'],
            status: 'maintenance',
            created_at: '2024-01-03T00:00:00Z',
            updated_at: new Date().toISOString()
          },
          {
            id: 'room4',
            name: 'Training Room Alpha',
            description: 'Large training room with presentation capabilities',
            location: 'Building C, 1st Floor',
            building: 'Building C',
            floor: '1st Floor',
            capacity: 30,
            equipment: ['Projector', 'Sound System', 'Microphone', 'Flipchart'],
            amenities: ['WiFi', 'Air Conditioning', 'Parking'],
            hourly_rate: 75,
            contact_person: 'Sarah Wilson',
            contact_email: 'sarah.wilson@company.com',
            contact_phone: '+1 (555) 321-0987',
            video_conference_enabled: true,
            accessibility_features: ['Wheelchair Accessible', 'Wide Doorways'],
            status: 'available',
            created_at: '2024-01-04T00:00:00Z',
            updated_at: new Date().toISOString()
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setRooms(mockRooms);
      } else {
        // Production: Use Supabase
        const { data, error: apiError } = await supabase
          .from('facilities_rooms')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (apiError) throw apiError;
        setRooms(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (roomData: any) => {
    try {
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        // Mock create
        const newRoom = {
          id: `room${Date.now()}`,
          ...roomData,
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRooms(prev => [newRoom, ...prev]);
      } else {
        // Production: Use Supabase
        const { data, error: apiError } = await supabase
          .from('facilities_rooms')
          .insert(roomData)
          .select()
          .single();
        
        if (apiError) throw apiError;
        setRooms(prev => [data, ...prev]);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create room');
    }
  };

  const updateRoom = async (roomId: string, roomData: any) => {
    try {
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        // Mock update
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRooms(prev => prev.map(room => 
          room.id === roomId 
            ? { ...room, ...roomData, updated_at: new Date().toISOString() }
            : room
        ));
      } else {
        // Production: Use Supabase
        const { data, error: apiError } = await supabase
          .from('facilities_rooms')
          .update(roomData)
          .eq('id', roomId)
          .select()
          .single();
        
        if (apiError) throw apiError;
        setRooms(prev => prev.map(room => room.id === roomId ? data : room));
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update room');
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        // Mock delete
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRooms(prev => prev.filter(room => room.id !== roomId));
      } else {
        // Production: Use Supabase
        const { error: apiError } = await supabase
          .from('facilities_rooms')
          .delete()
          .eq('id', roomId);
        
        if (apiError) throw apiError;
        setRooms(prev => prev.filter(room => room.id !== roomId));
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete room');
    }
  };

  return {
    rooms,
    loading,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
    refetch: loadRooms
  };
};

// Dashboard Analytics Hook
export const useDashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Environment-aware data loading
      if (process.env.NODE_ENV === 'development') {
        // Mock dashboard analytics data
        const mockAnalytics = {
          // Summary metrics
          totalEmployees: 156,
          activeLeaveRequests: 8,
          trainingCompletion: 87,
          openPositions: 12,
          
          // Department distribution
          departmentDistribution: [
            { label: 'Engineering', value: 45 },
            { label: 'Sales', value: 25 },
            { label: 'Marketing', value: 15 },
            { label: 'HR', value: 10 },
            { label: 'Finance', value: 8 },
            { label: 'Operations', value: 18 },
            { label: 'Customer Support', value: 22 },
            { label: 'Research', value: 13 }
          ],
          
          // Recruitment metrics
          monthlyRecruitment: [
            { label: 'Jan', value: 8, interviews: 24, applications: 145 },
            { label: 'Feb', value: 12, interviews: 32, applications: 178 },
            { label: 'Mar', value: 15, interviews: 38, applications: 210 },
            { label: 'Apr', value: 10, interviews: 28, applications: 185 },
            { label: 'May', value: 18, interviews: 42, applications: 255 },
            { label: 'Jun', value: 22, interviews: 50, applications: 310 },
            { label: 'Jul', value: 14, interviews: 36, applications: 230 },
            { label: 'Aug', value: 12, interviews: 30, applications: 195 },
            { label: 'Sep', value: 20, interviews: 48, applications: 280 },
            { label: 'Oct', value: 16, interviews: 40, applications: 245 },
            { label: 'Nov', value: 11, interviews: 32, applications: 190 },
            { label: 'Dec', value: 8, interviews: 25, applications: 160 }
          ],
          
          // Leave analytics
          leaveTypes: [
            { label: 'Annual Leave', value: 40, color: '#4C51BF' },
            { label: 'Sick Leave', value: 25, color: '#ED8936' },
            { label: 'Personal Leave', value: 20, color: '#48BB78' },
            { label: 'Maternity/Paternity', value: 15, color: '#9F7AEA' },
            { label: 'Bereavement', value: 5, color: '#718096' },
            { label: 'Unpaid Leave', value: 8, color: '#F56565' }
          ],
          
          leaveAnalytics: {
            monthlyTrend: [
              { month: 'Jan', count: 35 },
              { month: 'Feb', count: 28 },
              { month: 'Mar', count: 32 },
              { month: 'Apr', count: 42 },
              { month: 'May', count: 48 },
              { month: 'Jun', count: 58 },
              { month: 'Jul', count: 62 },
              { month: 'Aug', count: 70 },
              { month: 'Sep', count: 45 },
              { month: 'Oct', count: 38 },
              { month: 'Nov', count: 32 },
              { month: 'Dec', count: 45 }
            ],
            averageDuration: 4.2,
            approvalRate: 92,
            pendingRequests: 8
          },
          
          // Performance metrics
          performanceRatings: [
            { label: 'Excellent', value: 25, color: '#48BB78' },
            { label: 'Good', value: 45, color: '#4299E1' },
            { label: 'Average', value: 20, color: '#ECC94B' },
            { label: 'Needs Improvement', value: 8, color: '#ED8936' },
            { label: 'Poor', value: 2, color: '#F56565' }
          ],
          
          performanceAnalytics: {
            departmentAverages: [
              { department: 'Engineering', score: 4.2 },
              { department: 'Sales', score: 3.9 },
              { department: 'Marketing', score: 4.0 },
              { department: 'HR', score: 4.3 },
              { department: 'Finance', score: 3.8 },
              { department: 'Operations', score: 3.7 },
              { department: 'Customer Support', score: 4.1 },
              { department: 'Research', score: 4.4 }
            ],
            yearlyTrend: [
              { year: '2020', score: 3.6 },
              { year: '2021', score: 3.7 },
              { year: '2022', score: 3.9 },
              { year: '2023', score: 4.0 },
              { year: '2024', score: 4.1 }
            ],
            skillGaps: [
              { skill: 'Leadership', gap: 15 },
              { skill: 'Technical', gap: 8 },
              { skill: 'Communication', gap: 12 },
              { skill: 'Time Management', gap: 20 },
              { skill: 'Problem Solving', gap: 10 }
            ]
          },
          
          // Training analytics
          trainingAnalytics: {
            completionByDepartment: [
              { department: 'Engineering', rate: 92 },
              { department: 'Sales', rate: 85 },
              { department: 'Marketing', rate: 88 },
              { department: 'HR', rate: 95 },
              { department: 'Finance', rate: 90 },
              { department: 'Operations', rate: 82 },
              { department: 'Customer Support', rate: 89 },
              { department: 'Research', rate: 91 }
            ],
            popularCourses: [
              { course: 'Leadership Fundamentals', enrollments: 89 },
              { course: 'Technical Skills', enrollments: 76 },
              { course: 'Communication', enrollments: 92 },
              { course: 'Project Management', enrollments: 68 },
              { course: 'Data Analysis', enrollments: 54 }
            ],
            certificationRate: 78,
            averageCompletionTime: 14 // days
          },
          
          // Top performers
          topPerformers: [
            { name: 'Sarah Johnson', department: 'Engineering', score: 98, avatar: 'https://i.pravatar.cc/150?img=1' },
            { name: 'Mike Chen', department: 'Sales', score: 96, avatar: 'https://i.pravatar.cc/150?img=2' },
            { name: 'Lisa Brown', department: 'Marketing', score: 94, avatar: 'https://i.pravatar.cc/150?img=3' },
            { name: 'David Wilson', department: 'Engineering', score: 92, avatar: 'https://i.pravatar.cc/150?img=4' },
            { name: 'Emma Davis', department: 'HR', score: 90, avatar: 'https://i.pravatar.cc/150?img=5' }
          ],
          
          // Salary analytics
          salaryAnalytics: {
            departmentAverages: [
              { department: 'Engineering', amount: 95000 },
              { department: 'Sales', amount: 82000 },
              { department: 'Marketing', amount: 78000 },
              { department: 'HR', amount: 75000 },
              { department: 'Finance', amount: 88000 },
              { department: 'Operations', amount: 72000 },
              { department: 'Customer Support', amount: 65000 },
              { department: 'Research', amount: 98000 }
            ],
            salaryRanges: [
              { range: '40K-60K', count: 28 },
              { range: '60K-80K', count: 45 },
              { range: '80K-100K', count: 52 },
              { range: '100K-120K', count: 18 },
              { range: '120K+', count: 13 }
            ],
            genderParity: {
              male: 1.0,
              female: 0.94,
              other: 0.97
            }
          },
          
          // Upcoming events
          upcomingEvents: [
            { title: 'Q3 Performance Reviews', date: '2024-07-15', type: 'Performance' },
            { title: 'Leadership Training', date: '2024-07-20', type: 'Training' },
            { title: 'All Hands Meeting', date: '2024-07-25', type: 'Company' },
            { title: 'New Hire Orientation', date: '2024-08-01', type: 'Onboarding' },
            { title: 'Team Building Event', date: '2024-08-10', type: 'Culture' }
          ],
          
          // Recent activity
          recentActivity: [
            {
              user: 'Sarah Johnson',
              action: 'completed training course',
              target: 'Leadership Fundamentals',
              time: '2 hours ago',
              type: 'training',
              avatar: 'https://i.pravatar.cc/150?img=1'
            },
            {
              user: 'Mike Chen',
              action: 'submitted leave request',
              target: 'Annual Leave (July 15-20)',
              time: '4 hours ago',
              type: 'leave',
              avatar: 'https://i.pravatar.cc/150?img=2'
            },
            {
              user: 'Lisa Brown',
              action: 'received performance review',
              target: 'Q2 Evaluation - Excellent',
              time: '1 day ago',
              type: 'performance',
              avatar: 'https://i.pravatar.cc/150?img=3'
            },
            {
              user: 'John Smith',
              action: 'hired new team member',
              target: 'Emily Parker - Frontend Developer',
              time: '2 days ago',
              type: 'recruitment',
              avatar: 'https://i.pravatar.cc/150?img=6'
            },
            {
              user: 'Anna Rodriguez',
              action: 'approved salary increase',
              target: 'For 5 team members',
              time: '3 days ago',
              type: 'compensation',
              avatar: 'https://i.pravatar.cc/150?img=7'
            }
          ],
          
          // Growth and trends
          trends: {
            employeeGrowth: 5.2,
            leaveUtilization: 68.5,
            trainingEngagement: 12.3,
            performanceImprovement: 8.7,
            turnoverRate: -2.1,
            hiringEfficiency: 3.8
          },
          
          // Retention analytics
          retentionAnalytics: {
            riskAssessment: [
              { riskLevel: 'High', count: 12 },
              { riskLevel: 'Medium', count: 28 },
              { riskLevel: 'Low', count: 116 }
            ],
            departmentTurnover: [
              { department: 'Engineering', rate: 4.2 },
              { department: 'Sales', rate: 7.5 },
              { department: 'Marketing', rate: 5.8 },
              { department: 'HR', rate: 3.5 },
              { department: 'Finance', rate: 4.0 },
              { department: 'Operations', rate: 6.2 },
              { department: 'Customer Support', rate: 8.5 },
              { department: 'Research', rate: 3.8 }
            ],
            exitReasons: [
              { reason: 'Better Opportunity', percentage: 42 },
              { reason: 'Relocation', percentage: 18 },
              { reason: 'Work-Life Balance', percentage: 15 },
              { reason: 'Compensation', percentage: 12 },
              { reason: 'Career Growth', percentage: 8 },
              { reason: 'Other', percentage: 5 }
            ]
          },
          
          created_at: '2024-01-01T00:00:00Z',
          updated_at: new Date().toISOString()
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnalytics(mockAnalytics);
      } else {
        // Production: Use Supabase
        const { data, error: apiError } = await supabase
          .from('dashboard_analytics')
          .select('*')
          .single();
        
        if (apiError) throw apiError;
        setAnalytics(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: loadAnalytics
  };
};

// Comprehensive Compliance Training Hooks
export const useComplianceTraining = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrainings = async () => {
    setLoading(true);
    try {
      // In development mode, use mock data
      if (process.env.NODE_ENV === 'development') {
        const mockTrainings = [
          {
            id: 'ct-001',
            title: 'Data Privacy and GDPR',
            description: 'Essential training on data privacy regulations and GDPR compliance requirements.',
            category: 'Legal',
            requiredFor: ['All Employees'],
            dueDate: '2023-12-31',
            status: 'Active',
            completionRate: 78,
            duration: '2 hours',
            format: 'Online Course',
            modules: [
              { id: 'm1', title: 'Introduction to Data Privacy', duration: '20 min' },
              { id: 'm2', title: 'GDPR Key Principles', duration: '30 min' },
              { id: 'm3', title: 'Data Subject Rights', duration: '25 min' },
              { id: 'm4', title: 'Breach Notification Procedures', duration: '20 min' },
              { id: 'm5', title: 'Assessment Quiz', duration: '25 min' }
            ],
            certificationType: 'Internal Certification',
            validityPeriod: '12 months',
            createdAt: '2023-01-15'
          },
          {
            id: 'ct-002',
            title: 'Workplace Harassment Prevention',
            description: 'Comprehensive training on identifying and preventing workplace harassment.',
            category: 'HR',
            requiredFor: ['All Employees', 'Managers'],
            dueDate: '2023-11-30',
            status: 'Active',
            completionRate: 92,
            duration: '1.5 hours',
            format: 'Video + Quiz',
            modules: [
              { id: 'm1', title: 'Types of Workplace Harassment', duration: '20 min' },
              { id: 'm2', title: 'Reporting Procedures', duration: '15 min' },
              { id: 'm3', title: 'Manager Responsibilities', duration: '25 min' },
              { id: 'm4', title: 'Case Studies', duration: '15 min' },
              { id: 'm5', title: 'Assessment', duration: '15 min' }
            ],
            certificationType: 'State Compliance Certificate',
            validityPeriod: '24 months',
            createdAt: '2023-02-10'
          },
          {
            id: 'ct-003',
            title: 'Cybersecurity Essentials',
            description: 'Critical training on cybersecurity best practices and threat prevention.',
            category: 'IT Security',
            requiredFor: ['All Employees'],
            dueDate: '2023-10-31',
            status: 'Active',
            completionRate: 65,
            duration: '3 hours',
            format: 'Interactive Course',
            modules: [
              { id: 'm1', title: 'Password Security', duration: '30 min' },
              { id: 'm2', title: 'Phishing Prevention', duration: '45 min' },
              { id: 'm3', title: 'Secure Remote Work', duration: '30 min' },
              { id: 'm4', title: 'Device Security', duration: '30 min' },
              { id: 'm5', title: 'Incident Reporting', duration: '30 min' },
              { id: 'm6', title: 'Final Assessment', duration: '15 min' }
            ],
            certificationType: 'Internal Certification',
            validityPeriod: '12 months',
            createdAt: '2023-03-22'
          },
          {
            id: 'ct-004',
            title: 'Fire Safety and Emergency Response',
            description: 'Essential training on fire prevention and emergency evacuation procedures.',
            category: 'Health & Safety',
            requiredFor: ['All Employees', 'Emergency Wardens'],
            dueDate: '2023-09-30',
            status: 'Active',
            completionRate: 88,
            duration: '2 hours',
            format: 'In-person + Practical',
            modules: [
              { id: 'm1', title: 'Fire Prevention', duration: '30 min' },
              { id: 'm2', title: 'Using Fire Extinguishers', duration: '30 min' },
              { id: 'm3', title: 'Evacuation Procedures', duration: '30 min' },
              { id: 'm4', title: 'Emergency Response Roles', duration: '15 min' },
              { id: 'm5', title: 'Practical Exercise', duration: '15 min' }
            ],
            certificationType: 'Safety Compliance Certificate',
            validityPeriod: '24 months',
            createdAt: '2023-01-05'
          },
          {
            id: 'ct-005',
            title: 'Diversity and Inclusion',
            description: 'Comprehensive training on fostering a diverse and inclusive workplace culture.',
            category: 'HR',
            requiredFor: ['All Employees', 'Hiring Managers'],
            dueDate: '2023-12-15',
            status: 'Active',
            completionRate: 72,
            duration: '2.5 hours',
            format: 'Online Course',
            modules: [
              { id: 'm1', title: 'Understanding Unconscious Bias', duration: '45 min' },
              { id: 'm2', title: 'Inclusive Communication', duration: '30 min' },
              { id: 'm3', title: 'Creating Inclusive Teams', duration: '30 min' },
              { id: 'm4', title: 'Inclusive Hiring Practices', duration: '30 min' },
              { id: 'm5', title: 'Assessment', duration: '15 min' }
            ],
            certificationType: 'Internal Certification',
            validityPeriod: '24 months',
            createdAt: '2023-02-28'
          }
        ];
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setData(mockTrainings);
        setError(null);
      } else {
        // For production, would use actual API call
        const { data, error } = await supabase
          .from('compliance_trainings')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw new Error(error.message);
        setData(data);
      }
    } catch (err) {
      console.error('Error loading compliance trainings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTraining = async (trainingData) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Create new training with ID
        const newTraining = {
          id: `ct-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          ...trainingData,
          createdAt: new Date().toISOString(),
          status: 'Active',
          completionRate: 0
        };
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setData(prevData => [newTraining, ...prevData]);
        
        return { data: newTraining, error: null };
      } else {
        // For production, would use actual API call
        const { data, error } = await supabase
          .from('compliance_trainings')
          .insert(trainingData)
          .single();
          
        if (error) throw new Error(error.message);
        loadTrainings(); // Refresh the list
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error creating compliance training:', err);
      return { data: null, error: err.message };
    }
  };

  const updateTraining = async (id, trainingData) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setData(prevData => 
          prevData.map(item => 
            item.id === id ? { ...item, ...trainingData } : item
          )
        );
        
        return { data: trainingData, error: null };
      } else {
        // For production, would use actual API call
        const { data, error } = await supabase
          .from('compliance_trainings')
          .update(trainingData)
          .eq('id', id)
          .single();
          
        if (error) throw new Error(error.message);
        loadTrainings(); // Refresh the list
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error updating compliance training:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteTraining = async (id) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setData(prevData => prevData.filter(item => item.id !== id));
        
        return { data: { id }, error: null };
      } else {
        // For production, would use actual API call
        const { error } = await supabase
          .from('compliance_trainings')
          .delete()
          .eq('id', id);
          
        if (error) throw new Error(error.message);
        loadTrainings(); // Refresh the list
        return { data: { id }, error: null };
      }
    } catch (err) {
      console.error('Error deleting compliance training:', err);
      return { data: null, error: err.message };
    }
  };

  // Assign employee to training
  const assignTraining = async (trainingId, employeeIds) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return { data: { trainingId, employeeIds }, error: null };
      } else {
        // For production, would use actual API call with appropriate structure
        const assignments = employeeIds.map(employeeId => ({
          training_id: trainingId,
          employee_id: employeeId,
          status: 'Assigned',
          assigned_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        }));
        
        const { data, error } = await supabase
          .from('training_assignments')
          .insert(assignments);
          
        if (error) throw new Error(error.message);
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error assigning training:', err);
      return { data: null, error: err.message };
    }
  };

  // Load on mount
  useEffect(() => {
    loadTrainings();
  }, []);

  return {
    trainings: data || [],
    loading,
    error,
    loadTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    assignTraining
  };
};

// Workplace Safety Management Hooks
export const useWorkplaceSafety = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [safetyChecks, setSafetyChecks] = useState([]);
  const [equipmentInspections, setEquipmentInspections] = useState([]);

  const loadSafetyData = async () => {
    setLoading(true);
    try {
      // In development mode, use mock data
      if (process.env.NODE_ENV === 'development') {
        // Mock incidents data
        const mockIncidents = [
          {
            id: 'inc-001',
            title: 'Minor Fall Incident',
            description: 'Employee slipped on wet floor in kitchen area',
            date: '2023-09-05T14:30:00',
            location: 'Office Kitchen',
            reportedBy: 'John Doe',
            severity: 'Low',
            status: 'Resolved',
            type: 'Slip and Fall',
            injuryType: 'Minor Bruising',
            medicalAttention: 'First Aid Only',
            witnesses: ['Jane Smith', 'Michael Brown'],
            followUpActions: 'Installed wet floor signs, scheduled safety briefing',
            resolutionDate: '2023-09-08',
            attachments: ['incident-report-001.pdf', 'photo-evidence-001.jpg']
          },
          {
            id: 'inc-002',
            title: 'Electrical Equipment Malfunction',
            description: 'Printer caught fire due to electrical short',
            date: '2023-08-22T11:15:00',
            location: 'Marketing Department',
            reportedBy: 'Emily Johnson',
            severity: 'Medium',
            status: 'Under Investigation',
            type: 'Equipment Failure',
            injuryType: 'None',
            medicalAttention: 'None Required',
            witnesses: ['Robert Wilson', 'Sarah Davis'],
            followUpActions: 'Equipment removed, electrical inspection scheduled',
            resolutionDate: null,
            attachments: ['incident-report-002.pdf', 'equipment-log.pdf']
          },
          {
            id: 'inc-003',
            title: 'Chemical Spill',
            description: 'Cleaning solution spilled in janitor closet',
            date: '2023-09-12T09:45:00',
            location: 'Maintenance Area',
            reportedBy: 'Carlos Rodriguez',
            severity: 'Medium',
            status: 'Resolved',
            type: 'Chemical Incident',
            injuryType: 'Minor Skin Irritation',
            medicalAttention: 'First Aid Treatment',
            witnesses: ['Maria Garcia'],
            followUpActions: 'Staff retraining on chemical handling, updated storage procedures',
            resolutionDate: '2023-09-14',
            attachments: ['incident-report-003.pdf', 'chemical-msds.pdf']
          },
          {
            id: 'inc-004',
            title: 'Near Miss - Falling Object',
            description: 'Ceiling tile nearly fell on employee workstation',
            date: '2023-09-18T15:20:00',
            location: 'Engineering Department',
            reportedBy: 'Alex Thompson',
            severity: 'High',
            status: 'Under Investigation',
            type: 'Structural Hazard',
            injuryType: 'None',
            medicalAttention: 'None Required',
            witnesses: ['Lisa Wang', 'David Miller'],
            followUpActions: 'Area cordoned off, building maintenance emergency inspection',
            resolutionDate: null,
            attachments: ['incident-report-004.pdf', 'area-photos.zip']
          }
        ];
        
        // Mock safety checks data
        const mockSafetyChecks = [
          {
            id: 'sc-001',
            title: 'Monthly Fire Safety Inspection',
            dueDate: '2023-10-05',
            status: 'Scheduled',
            assignedTo: 'Safety Committee',
            location: 'All Buildings',
            frequency: 'Monthly',
            lastCompleted: '2023-09-05',
            checkItems: [
              { id: 'item-1', description: 'Fire extinguishers inspection', status: 'Pending' },
              { id: 'item-2', description: 'Emergency exit accessibility', status: 'Pending' },
              { id: 'item-3', description: 'Smoke detector functionality', status: 'Pending' },
              { id: 'item-4', description: 'Fire alarm system test', status: 'Pending' },
              { id: 'item-5', description: 'Evacuation signage check', status: 'Pending' }
            ],
            notes: 'Focus on new west wing extension',
            priority: 'High'
          },
          {
            id: 'sc-002',
            title: 'Quarterly Electrical Safety Audit',
            dueDate: '2023-11-15',
            status: 'Scheduled',
            assignedTo: 'Facilities Team',
            location: 'Main Office Building',
            frequency: 'Quarterly',
            lastCompleted: '2023-08-15',
            checkItems: [
              { id: 'item-1', description: 'Electrical panel inspection', status: 'Pending' },
              { id: 'item-2', description: 'Power outlets testing', status: 'Pending' },
              { id: 'item-3', description: 'Extension cord usage check', status: 'Pending' },
              { id: 'item-4', description: 'Equipment grounding verification', status: 'Pending' },
              { id: 'item-5', description: 'Surge protector inspection', status: 'Pending' }
            ],
            notes: 'Special attention to server room',
            priority: 'Medium'
          },
          {
            id: 'sc-003',
            title: 'Weekly Trip Hazard Walkthrough',
            dueDate: '2023-09-29',
            status: 'In Progress',
            assignedTo: 'Department Safety Representatives',
            location: 'All Departments',
            frequency: 'Weekly',
            lastCompleted: '2023-09-22',
            checkItems: [
              { id: 'item-1', description: 'Clear walkways check', status: 'In Progress' },
              { id: 'item-2', description: 'Cable management inspection', status: 'Completed' },
              { id: 'item-3', description: 'Floor mat placement check', status: 'In Progress' },
              { id: 'item-4', description: 'Spill response kit verification', status: 'Not Started' }
            ],
            notes: 'Focus on high traffic areas',
            priority: 'Medium'
          },
          {
            id: 'sc-004',
            title: 'Annual Workplace Ergonomics Assessment',
            dueDate: '2023-12-10',
            status: 'Scheduled',
            assignedTo: 'HR Department',
            location: 'All Workstations',
            frequency: 'Annual',
            lastCompleted: '2022-12-12',
            checkItems: [
              { id: 'item-1', description: 'Chair adjustment check', status: 'Pending' },
              { id: 'item-2', description: 'Monitor positioning assessment', status: 'Pending' },
              { id: 'item-3', description: 'Keyboard and mouse placement', status: 'Pending' },
              { id: 'item-4', description: 'Lighting adequacy evaluation', status: 'Pending' },
              { id: 'item-5', description: 'Employee posture observation', status: 'Pending' }
            ],
            notes: 'Will require ergonomics specialist',
            priority: 'Low'
          }
        ];
        
        // Mock equipment inspections data
        const mockEquipmentInspections = [
          {
            id: 'eq-001',
            equipmentName: 'Forklift #F-103',
            inspectionType: 'Monthly Mechanical Inspection',
            lastInspection: '2023-09-10',
            nextDueDate: '2023-10-10',
            status: 'Passed',
            assignedTo: 'Maintenance Team',
            location: 'Warehouse',
            notes: 'Hydraulic system maintenance recommended within next 3 months',
            attachments: ['forklift-103-inspection-sept.pdf']
          },
          {
            id: 'eq-002',
            equipmentName: 'Conference Room A/V System',
            inspectionType: 'Quarterly Electrical Safety Check',
            lastInspection: '2023-08-05',
            nextDueDate: '2023-11-05',
            status: 'Passed',
            assignedTo: 'IT Department',
            location: 'Main Conference Room',
            notes: 'All components functioning normally',
            attachments: ['av-system-inspection-aug.pdf']
          },
          {
            id: 'eq-003',
            equipmentName: 'Emergency Generator',
            inspectionType: 'Monthly Operational Test',
            lastInspection: '2023-09-15',
            nextDueDate: '2023-10-15',
            status: 'Failed',
            assignedTo: 'Facilities Manager',
            location: 'Utilities Room',
            notes: 'Failed to start automatically, manual intervention required. Repair scheduled.',
            attachments: ['generator-inspection-sept.pdf', 'repair-order-82734.pdf']
          },
          {
            id: 'eq-004',
            equipmentName: 'Fire Suppression System',
            inspectionType: 'Annual Certification',
            lastInspection: '2023-05-20',
            nextDueDate: '2024-05-20',
            status: 'Passed',
            assignedTo: 'External Vendor (FireSafe Inc.)',
            location: 'All Buildings',
            notes: 'Certification renewed, pressure tests completed',
            attachments: ['fire-system-certification-2023.pdf']
          },
          {
            id: 'eq-005',
            equipmentName: 'Loading Dock Leveler',
            inspectionType: 'Bi-Monthly Mechanical Check',
            lastInspection: '2023-09-08',
            nextDueDate: '2023-11-08',
            status: 'Passed with Concerns',
            assignedTo: 'Maintenance Team',
            location: 'Shipping & Receiving',
            notes: 'Hydraulic fluid level lower than normal, topped off during inspection. Monitor for potential leak.',
            attachments: ['dock-leveler-inspection-sept.pdf']
          }
        ];
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setIncidents(mockIncidents);
        setSafetyChecks(mockSafetyChecks);
        setEquipmentInspections(mockEquipmentInspections);
        setData({
          statistics: {
            incidentCount: mockIncidents.length,
            openIncidents: mockIncidents.filter(inc => inc.status !== 'Resolved').length,
            upcomingChecks: mockSafetyChecks.filter(check => check.status === 'Scheduled').length,
            equipmentIssues: mockEquipmentInspections.filter(eq => eq.status === 'Failed' || eq.status === 'Passed with Concerns').length,
            inspectionCompliance: 92, // Percentage
            trainingCompliance: 85 // Percentage
          }
        });
        setError(null);
      } else {
        // For production, would use actual API calls
        const { data: incidentsData, error: incidentsError } = await supabase
          .from('safety_incidents')
          .select('*')
          .order('date', { ascending: false });
          
        if (incidentsError) throw new Error(incidentsError.message);
        
        const { data: checksData, error: checksError } = await supabase
          .from('safety_checks')
          .select('*')
          .order('dueDate', { ascending: true });
          
        if (checksError) throw new Error(checksError.message);
        
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment_inspections')
          .select('*')
          .order('nextDueDate', { ascending: true });
          
        if (equipmentError) throw new Error(equipmentError.message);
        
        // Set all the data
        setIncidents(incidentsData);
        setSafetyChecks(checksData);
        setEquipmentInspections(equipmentData);
        
        // Calculate statistics
        setData({
          statistics: {
            incidentCount: incidentsData.length,
            openIncidents: incidentsData.filter(inc => inc.status !== 'Resolved').length,
            upcomingChecks: checksData.filter(check => check.status === 'Scheduled').length,
            equipmentIssues: equipmentData.filter(eq => eq.status === 'Failed' || eq.status === 'Passed with Concerns').length,
            // These would likely come from more complex queries in production
            inspectionCompliance: 92,
            trainingCompliance: 85
          }
        });
      }
    } catch (err) {
      console.error('Error loading workplace safety data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new safety incident
  const createIncident = async (incidentData) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Create new incident with ID
        const newIncident = {
          id: `inc-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          ...incidentData,
          status: 'Reported',
          date: new Date().toISOString()
        };
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setIncidents(prevData => [newIncident, ...prevData]);
        
        return { data: newIncident, error: null };
      } else {
        // For production, would use actual API call
        const { data, error } = await supabase
          .from('safety_incidents')
          .insert(incidentData)
          .single();
          
        if (error) throw new Error(error.message);
        loadSafetyData(); // Refresh the data
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error creating safety incident:', err);
      return { data: null, error: err.message };
    }
  };

  // Schedule a new safety check
  const scheduleSafetyCheck = async (checkData) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Create new check with ID
        const newCheck = {
          id: `sc-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          ...checkData,
          status: 'Scheduled'
        };
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setSafetyChecks(prevData => [newCheck, ...prevData]);
        
        return { data: newCheck, error: null };
      } else {
        // For production, would use actual API call
        const { data, error } = await supabase
          .from('safety_checks')
          .insert(checkData)
          .single();
          
        if (error) throw new Error(error.message);
        loadSafetyData(); // Refresh the data
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error scheduling safety check:', err);
      return { data: null, error: err.message };
    }
  };

  // Add equipment inspection
  const addEquipmentInspection = async (inspectionData) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Create new inspection with ID
        const newInspection = {
          id: `eq-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
          ...inspectionData,
          lastInspection: new Date().toISOString()
        };
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setEquipmentInspections(prevData => [newInspection, ...prevData]);
        
        return { data: newInspection, error: null };
      } else {
        // For production, would use actual API call
        const { data, error } = await supabase
          .from('equipment_inspections')
          .insert(inspectionData)
          .single();
          
        if (error) throw new Error(error.message);
        loadSafetyData(); // Refresh the data
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error adding equipment inspection:', err);
      return { data: null, error: err.message };
    }
  };

  // Update incident status
  const updateIncidentStatus = async (id, status, resolutionDetails = null) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setIncidents(prevData => 
          prevData.map(item => 
            item.id === id ? { 
              ...item, 
              status, 
              resolutionDate: status === 'Resolved' ? new Date().toISOString() : null,
              ...resolutionDetails
            } : item
          )
        );
        
        return { data: { id, status }, error: null };
      } else {
        // For production, would use actual API call
        const updateData = { 
          status,
          ...(status === 'Resolved' ? { resolutionDate: new Date().toISOString() } : {}),
          ...resolutionDetails
        };
        
        const { data, error } = await supabase
          .from('safety_incidents')
          .update(updateData)
          .eq('id', id)
          .single();
          
        if (error) throw new Error(error.message);
        loadSafetyData(); // Refresh the data
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error updating incident status:', err);
      return { data: null, error: err.message };
    }
  };

  // Complete a safety check
  const completeSafetyCheck = async (id, checkResults) => {
    try {
      // In development mode, simulate API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setSafetyChecks(prevData => 
          prevData.map(item => 
            item.id === id ? { 
              ...item, 
              status: 'Completed',
              lastCompleted: new Date().toISOString(),
              checkItems: item.checkItems.map((checkItem, idx) => ({
                ...checkItem,
                status: checkResults[idx]?.status || checkItem.status
              }))
            } : item
          )
        );
        
        return { data: { id, status: 'Completed' }, error: null };
      } else {
        // For production, would use actual API call
        // This would likely involve multiple operations in a transaction
        const { data, error } = await supabase
          .from('safety_checks')
          .update({
            status: 'Completed',
            lastCompleted: new Date().toISOString()
          })
          .eq('id', id)
          .single();
          
        if (error) throw new Error(error.message);
        
        // Update check items in a separate call
        // This is simplified - in production this might be a more complex transaction
        for (const result of checkResults) {
          await supabase
            .from('safety_check_items')
            .update({ status: result.status })
            .eq('id', result.id);
        }
        
        loadSafetyData(); // Refresh the data
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error completing safety check:', err);
      return { data: null, error: err.message };
    }
  };

  // Load on mount
  useEffect(() => {
    loadSafetyData();
  }, []);

  return {
    safetyData: data || { statistics: {} },
    incidents: incidents || [],
    safetyChecks: safetyChecks || [],
    equipmentInspections: equipmentInspections || [],
    loading,
    error,
    loadSafetyData,
    createIncident,
    scheduleSafetyCheck,
    addEquipmentInspection,
    updateIncidentStatus,
    completeSafetyCheck
  };
}; 

export const useInterviews = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const data = await getInterviews();
        setInterviews(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch interviews'));
        console.error('Error fetching interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return { interviews, loading, error };
};

export const useOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch offers'));
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return { offers, loading, error };
};