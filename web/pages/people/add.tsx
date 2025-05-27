import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';

// Mock data for departments and locations - same as in directory
const DEPARTMENTS = [
  { id: 1, name: 'Human Resources', employeeCount: 5, head: 'Alice Johnson' },
  { id: 2, name: 'Engineering', employeeCount: 32, head: 'Diana Wong' },
  { id: 3, name: 'Marketing', employeeCount: 18, head: 'Frank Miller' },
  { id: 4, name: 'Sales', employeeCount: 25, head: 'Kelly Brown' },
  { id: 5, name: 'Finance', employeeCount: 12, head: 'Irene Lopez' },
  { id: 6, name: 'Executive', employeeCount: 3, head: 'Bob Smith' },
  { id: 7, name: 'Support', employeeCount: 15, head: 'Maria Patel' },
  { id: 8, name: 'Design', employeeCount: 8, head: 'Diana Wong' }
];

const LOCATIONS = [
  { id: 1, name: 'New York', employeeCount: 45 },
  { id: 2, name: 'San Francisco', employeeCount: 38 },
  { id: 3, name: 'Chicago', employeeCount: 22 },
  { id: 4, name: 'Miami', employeeCount: 15 },
  { id: 5, name: 'Austin', employeeCount: 17 },
  { id: 6, name: 'Remote', employeeCount: 28 }
];

// Mock people data for managers selection
const MOCK_PEOPLE = [
  { id: 2, name: 'Bob Smith', role: 'CEO', department: 'Executive' },
  { id: 4, name: 'Diana Wong', role: 'Engineering Director', department: 'Engineering' },
  { id: 6, name: 'Frank Miller', role: 'Marketing Director', department: 'Marketing' },
  { id: 9, name: 'Irene Lopez', role: 'Finance Director', department: 'Finance' },
  { id: 11, name: 'Kelly Brown', role: 'Sales Manager', department: 'Sales' },
  { id: 13, name: 'Maria Patel', role: 'Support Manager', department: 'Support' }
];

interface FormData {
  // Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  email: string;
  personalEmail: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Employment Information
  employeeId: string;
  role: string;
  department: string;
  team: string;
  location: string;
  workType: string; // Remote, Hybrid, On-site
  manager: string;
  startDate: string;
  probationEndDate: string;
  employmentType: string; // Full-time, Part-time, Contract, etc.
  status: 'active' | 'inactive';
  
  // Compensation Information
  salary: string;
  paymentFrequency: string; // Monthly, Bi-weekly, etc.
  currency: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  
  // Additional Information
  skills: string[];
  education: string;
  certifications: string;
  notes: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  role?: string;
  department?: string;
  location?: string;
  manager?: string;
  startDate?: string;
  employeeId?: string;
  emergencyContactPhone?: string;
  personalEmail?: string;
  probationEndDate?: string;
}

const AddEmployeePage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    email: '',
    personalEmail: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Employment Information
    employeeId: '',
    role: '',
    department: '',
    team: '',
    location: '',
    workType: '',
    manager: '',
    startDate: '',
    probationEndDate: '',
    employmentType: 'Full-time',
    status: 'active',
    
    // Compensation Information
    salary: '',
    paymentFrequency: 'Monthly',
    currency: 'USD',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    
    // Additional Information
    skills: [],
    education: '',
    certifications: '',
    notes: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Ensure user has access to this page
  useEffect(() => {
    // Check if user has appropriate role
    if (!allowAccess && !(role === 'admin' || role === 'hr')) {
      router.push('/login?redirect=/people/add');
    }
  }, [allowAccess, role, router]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Required fields
    ['firstName', 'lastName', 'email', 'role', 'department', 'location', 'manager', 'startDate', 'employeeId'].forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field as keyof FormErrors] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Optional personal email validation
    if (formData.personalEmail && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Invalid email address';
    }
    
    // Phone validation (required field)
    if (formData.phone && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    // Emergency contact phone validation (if provided)
    if (formData.emergencyContactPhone && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = 'Invalid phone number';
    }
    
    // Date validation - ensure start date is not in the future
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      
      if (startDate > today) {
        newErrors.startDate = 'Start date cannot be in the future';
      }
    }
    
    // Date of birth validation - ensure employee is at least 18 years old
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'Employee must be at least 18 years old';
      }
    }
    
    // Probation end date validation - ensure it's after start date
    if (formData.startDate && formData.probationEndDate) {
      const startDate = new Date(formData.startDate);
      const probationEndDate = new Date(formData.probationEndDate);
      
      if (probationEndDate <= startDate) {
        newErrors.probationEndDate = 'Probation end date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors and submission state
    setSubmitError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd make an API call here
      // For mock, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        router.push('/people');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred while adding the employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options for dropdowns
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const workTypeOptions = ['On-site', 'Remote', 'Hybrid'];
  const employmentTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Intern'];
  const paymentFrequencyOptions = ['Monthly', 'Bi-weekly', 'Weekly'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  const relationshipOptions = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Back button */}
        <div className="mb-4">
          <button 
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/people')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Directory
          </button>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
            <CardDescription>Fill in the details to add a new employee to the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {showSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                <div className="flex items-center mb-2">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Employee added successfully!</span>
                </div>
                <p>Redirecting to the people directory...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <div className="flex items-center mb-2">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-medium">Error</span>
                    </div>
                    <p>{submitError}</p>
                  </div>
                )}

                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-600 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Name
                      </label>
                      <input
                        type="text"
                        id="preferredName"
                        name="preferredName"
                        value={formData.preferredName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Personal Email
                      </label>
                      <input
                        type="email"
                        id="personalEmail"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(123) 456-7890"
                        className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        {genderOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <input
                        type="text"
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2 text-gray-700">Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Zip/Postal Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-600 border-b pb-2">Employment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.employeeId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                      {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>

                    <div>
                      <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                        Team
                      </label>
                      <input
                        type="text"
                        id="team"
                        name="team"
                        value={formData.team}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Location</option>
                        {LOCATIONS.map(loc => (
                          <option key={loc.id} value={loc.name}>{loc.name}</option>
                        ))}
                      </select>
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-1">
                        Work Type
                      </label>
                      <select
                        id="workType"
                        name="workType"
                        value={formData.workType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Work Type</option>
                        {workTypeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                        Manager <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="manager"
                        name="manager"
                        value={formData.manager}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.manager ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Manager</option>
                        {MOCK_PEOPLE.map(person => (
                          <option key={person.id} value={person.name}>{person.name} - {person.role}</option>
                        ))}
                      </select>
                      {errors.manager && <p className="text-red-500 text-xs mt-1">{errors.manager}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="probationEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Probation End Date
                      </label>
                      <input
                        type="date"
                        id="probationEndDate"
                        name="probationEndDate"
                        value={formData.probationEndDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                        Employment Type
                      </label>
                      <select
                        id="employmentType"
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {employmentTypeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Compensation Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-600 border-b pb-2">Compensation Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                        Salary
                      </label>
                      <input
                        type="text"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Frequency
                      </label>
                      <select
                        id="paymentFrequency"
                        name="paymentFrequency"
                        value={formData.paymentFrequency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {paymentFrequencyOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {currencyOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-600 border-b pb-2">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        id="emergencyContactName"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <select
                        id="emergencyContactRelationship"
                        name="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Relationship</option>
                        {relationshipOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="emergencyContactPhone"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                        placeholder="(123) 456-7890"
                        className={`w-full px-3 py-2 border ${errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.emergencyContactPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.emergencyContactPhone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-600 border-b pb-2">Additional Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                        Education
                      </label>
                      <textarea
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Academic background and qualifications"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
                        Certifications
                      </label>
                      <textarea
                        id="certifications"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Professional certifications and licenses"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any additional notes or information..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/people')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddEmployeePage; 