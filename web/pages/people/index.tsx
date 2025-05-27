import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  useToast,
  useForm, 
  useModal, 
  usePagination, 
  useSearch 
} from '../../hooks/useApi';
import {
  User, Search, Filter, Grid, List, Plus, Edit, Trash2, 
  CheckCircle, AlertCircle, Building, MapPin, Phone, Mail, Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

// Employee form interface
interface EmployeeForm {
  name: string;
  email: string;
  department: string;
  position: string;
  location: string;
  phone: string;
  salary: number;
  manager_id: string;
  hire_date: string;
}

const PeopleDirectory = () => {
  const router = useRouter();
  const toast = useToast();
  
  // Define local state for employees management instead of using the hook
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create employee action functions
  const createEmployee = async (employeeData: any) => {
    try {
      if (supabase) {
        const { data, error: createError } = await supabase
          .from('employees')
          .insert([employeeData])
          .select();
        
        if (createError) throw createError;
        
        const newId = data && data.length > 0 ? data[0].id : Date.now();
        // Refresh employees list
        setEmployees(prev => [...prev, {...employeeData, id: newId}]);
        return data || [];
      } else {
        // Mock operation for demo
        const newEmployee = {...employeeData, id: Date.now(), status: 'active'};
        setEmployees(prev => [...prev, newEmployee]);
        return newEmployee;
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      throw err;
    }
  };

  const updateEmployee = async (id: number | string, employeeData: any) => {
    try {
      if (supabase) {
        const { data, error: updateError } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', id);
        
        if (updateError) throw updateError;
        
        // Update local state
        setEmployees(prev => prev.map(emp => emp.id === id ? {...emp, ...employeeData} : emp));
        return data;
      } else {
        // Mock operation for demo
        setEmployees(prev => prev.map(emp => emp.id === id ? {...emp, ...employeeData} : emp));
        return employeeData;
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  const deleteEmployee = async (id: number | string) => {
    try {
      if (supabase) {
        const { error: deleteError } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);
        
        if (deleteError) throw deleteError;
      }
      
      // Update local state
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  };
  
  // UI state
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals
  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  // Search and pagination
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    employees, 
    ['name', 'email', 'department', 'position']
  );
  const { currentItems, currentPage, totalPages, goToPage, hasNext, hasPrev, nextPage, prevPage } = 
    usePagination(filteredItems, 12);

  // Form management
  const form = useForm<EmployeeForm>({
    name: '',
    email: '',
    department: '',
    position: '',
    location: '',
    phone: '',
    salary: 0,
    manager_id: '',
    hire_date: ''
  });

  // Mock departments and locations for the demo
  const departments = ['Engineering', 'HR', 'Marketing', 'Finance', 'Sales', 'Design', 'Operations'];
  const locations = ['New York', 'San Francisco', 'London', 'Remote', 'Tokyo', 'Berlin'];
  
  // Mock data for employees
  const mockEmployees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
    department: 'Engineering',
      position: 'Senior Developer',
    location: 'San Francisco',
      phone: '+1 (555) 123-4567',
      hire_date: '2022-04-15',
      status: 'active',
      avatar: '/avatars/user-01.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
    department: 'Marketing',
      position: 'Marketing Manager',
      location: 'New York',
      phone: '+1 (555) 987-6543',
      hire_date: '2021-08-10',
      status: 'active',
      avatar: '/avatars/user-02.jpg'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.j@company.com',
      department: 'HR',
      position: 'HR Director',
      location: 'Remote',
      phone: '+1 (555) 456-7890',
      hire_date: '2020-02-28',
      status: 'active',
      avatar: '/avatars/user-03.jpg'
    },
  ];

  // Fetch employees from Supabase or use mock data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        
        // Check if supabase is initialized
        if (typeof supabase !== 'undefined' && supabase !== null) {
          try {
            const { data, error } = await supabase
              .from('employees')
              .select('*')
              .order('name', { ascending: true });

            if (error) throw error;

            // Use real data if available, otherwise fall back to mock data
            setEmployees(data && data.length > 0 ? data : mockEmployees);
          } catch (supabaseError) {
            console.error('Supabase error:', supabaseError);
            setError('Failed to load employees from database. Using demo data instead.');
            setEmployees(mockEmployees); // Fallback to mock data
          }
        } else {
          console.log('Supabase client not available, using mock data');
          setEmployees(mockEmployees); // Use mock data
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees. Using demo data instead.');
        setEmployees(mockEmployees); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    form.setValue(name as keyof EmployeeForm, value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.name) {
      form.setError('name', 'Name is required');
      hasErrors = true;
    }
    
    if (!form.values.email) {
      form.setError('email', 'Email is required');
      hasErrors = true;
    }
    
    if (!form.values.department) {
      form.setError('department', 'Department is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      if (editModal.isOpen && selectedEmployee) {
        // Update existing employee
        await updateEmployee(selectedEmployee.id, form.values);
        toast.success('Employee updated successfully!');
        editModal.closeModal();
      } else {
        // Create new employee
        await createEmployee(form.values);
        toast.success('Employee created successfully!');
        addModal.closeModal();
      }
      
      form.reset();
      setSelectedEmployee(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    // Set form values individually
    form.setValue('name', employee.name);
    form.setValue('email', employee.email);
    form.setValue('department', employee.department);
    form.setValue('position', employee.position);
    form.setValue('location', employee.location);
    form.setValue('phone', employee.phone);
    form.setValue('salary', employee.salary);
    form.setValue('manager_id', employee.manager_id || '');
    form.setValue('hire_date', employee.hire_date);
    editModal.openModal();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedEmployee) return;
    
    setIsSubmitting(true);
    try {
      await deleteEmployee(selectedEmployee.id);
      toast.success('Employee deleted successfully!');
      deleteModal.closeModal();
      setSelectedEmployee(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'active').length,
    departments: Array.from(new Set(employees.map(emp => emp.department))).length,
    newThisMonth: employees.filter(emp => {
      const hireDate = new Date(emp.hire_date);
      const now = new Date();
      return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>People Directory | HR System</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
            {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">People Directory</h1>
              <p className="text-gray-600 mt-2">Manage employees and view directory</p>
            </div>
            <button
              onClick={() => addModal.openModal()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add Employee
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="p-3 bg-purple-100 rounded-full mr-3">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-bold">{stats.departments}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full mr-3">
                  <User className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New This Month</p>
                  <p className="text-2xl font-bold">{stats.newThisMonth}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="flex gap-4">
                <button
                        onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-md ${
                    viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                      >
                        Cards
                </button>
                <button
                    onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md ${
                    viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                      >
                        Table
                </button>
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

        {/* Employee Grid/Table */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredEmployees.map(employee => (
              <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="p-6 flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden flex-shrink-0">
                    {employee.avatar ? (
                      <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-full w-full p-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{employee.name}</h3>
                    <p className="text-gray-500">{employee.position}</p>
                  </div>
                </div>
                <CardContent className="pb-2 border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Mail className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                      <span className="text-gray-600">{employee.email}</span>
                    </div>
                    <div className="flex items-start">
                      <Building className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                      <span className="text-gray-600">{employee.department}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                      <span className="text-gray-600">{employee.location}</span>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                      <span className="text-gray-600">{employee.phone}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Badge className={employee.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {employee.status === 'active' ? 'Active' : 'Inactive'}
                                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardFooter>
                  </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden">
                          {employee.avatar ? (
                            <img src={employee.avatar} alt={employee.name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-full w-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={employee.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                                  </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => router.push(`/people/${employee.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          deleteModal.openModal();
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

        {/* Add/Edit Employee Modal */}
        {(addModal.isOpen || editModal.isOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editModal.isOpen ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.values.name}
                      onChange={(e) => form.setValue('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {form.errors.name && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.values.email}
                      onChange={(e) => form.setValue('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {form.errors.email && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        value={form.values.department}
                        onChange={(e) => form.setValue('department', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                      </select>
                      {form.errors.department && (
                        <p className="text-red-600 text-sm mt-1">{form.errors.department}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={form.values.position}
                        onChange={(e) => form.setValue('position', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        value={form.values.location}
                        onChange={(e) => form.setValue('location', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select location</option>
                        {locations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={form.values.phone}
                        onChange={(e) => form.setValue('phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary
                      </label>
                      <input
                        type="number"
                        value={form.values.salary}
                        onChange={(e) => form.setValue('salary', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hire Date
                      </label>
                      <input
                        type="date"
                        value={form.values.hire_date}
                        onChange={(e) => form.setValue('hire_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      addModal.closeModal();
                      editModal.closeModal();
                      form.reset();
                      setSelectedEmployee(null);
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
                    {isSubmitting ? 'Saving...' : editModal.isOpen ? 'Update Employee' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Employee</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    deleteModal.closeModal();
                    setSelectedEmployee(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Employee'}
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
    </DashboardLayout>
  );
};

export default PeopleDirectory; 
