import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockTrainingCourses } from '../../services/mockData';
import {
  BookOpen, Award, CheckCircle, Star, Clock, BarChart,
  Search, Filter, Calendar, Play, Download, FileText,
  Grid, List, ChevronRight, ThumbsUp, MessageSquare, Bookmark,
  Award as Certificate, PlayCircle, TrendingUp, Plus, Zap, 
  FileCheck, AlertTriangle, Users, Briefcase, BookOpen as Book
} from 'lucide-react';
import { GetServerSideProps } from 'next';

// Define types for our course data
interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  instructor: string;
  enrolled: number;
  capacity: number;
  status: string;
  start_date: string;
  end_date: string;
  price: number;
  location: string;
  certification?: boolean;
  completed?: number;
}

// Form interface
interface CourseForm {
  title: string;
  description: string;
  category: string;
  duration: string;
  instructor: string;
  capacity: number;
  price: number;
  requirements: string;
  certification: boolean;
}


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function TrainingIndexPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const isClient = typeof window !== 'undefined';
  
  // State
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form state
  const [formValues, setFormValues] = useState<CourseForm>({
    title: '',
    description: '',
    category: '',
    duration: '',
    instructor: '',
    capacity: 20,
    price: 0,
    requirements: '',
    certification: false
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Toast state
  const [toasts, setToasts] = useState<Array<{id: string, type: string, message: string}>>([]);

  // Pagination and search
  const itemsPerPage = 9;
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentItems = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Preserve scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    if (isClient) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isClient]);

  // Restore scroll position after state updates
  useEffect(() => {
    if (isClient && scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [isClient, currentItems, currentPage, searchTerm, scrollPosition]);

  // Override browser's automatic scroll restoration
  useEffect(() => {
    if (isClient && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
      return () => {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'auto';
        }
      };
    }
  }, [isClient]);

  // Fetch courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses (using mock data for now)
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be a call to Supabase or an API
      // For now, we'll use the mock data with a timeout to simulate a real API call
      setTimeout(() => {
        setCourses(mockTrainingCourses);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load training courses. Please try again later.');
      setLoading(false);
    }
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormValues(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    
    if (!formValues.title) {
      errors.title = 'Course title is required';
    }
    
    if (!formValues.description) {
      errors.description = 'Course description is required';
    }
    
    if (!formValues.category) {
      errors.category = 'Category is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, this would call an API or Supabase
    setTimeout(() => {
      const newCourse: TrainingCourse = {
        id: Date.now().toString(),
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
        duration: formValues.duration,
        instructor: formValues.instructor,
        enrolled: 0,
        capacity: formValues.capacity,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: formValues.price,
        location: 'Online',
        certification: formValues.certification,
        completed: 0
      };
      
      setCourses(prev => [...prev, newCourse]);
      showToast('success', 'Training course created successfully!');
      setShowAddModal(false);
      resetForm();
      setIsSubmitting(false);
    }, 500);
  };

  // Handle enrollment
  const handleEnroll = (courseId: string) => {
    setIsSubmitting(true);
    
    // In a real app, this would call an API or Supabase
    setTimeout(() => {
      setCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, enrolled: course.enrolled + 1 } 
            : course
        )
      );
      
      showToast('success', 'Successfully enrolled in course!');
      setShowEnrollModal(false);
      setSelectedCourse(null);
      setIsSubmitting(false);
    }, 500);
  };

  // Toast functions
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setFormValues({
      title: '',
      description: '',
      category: '',
      duration: '',
      instructor: '',
      capacity: 20,
      price: 0,
      requirements: '',
      certification: false
    });
    setFormErrors({});
  };

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate statistics
  const stats = {
    total: courses.length,
    active: courses.filter(course => course.status === 'active').length,
    enrolled: courses.reduce((sum, course) => sum + course.enrolled, 0),
    completed: courses.reduce((sum, course) => sum + (course.completed || 0), 0)
  };

  const categories = ['Leadership', 'Safety', 'Technical', 'Soft Skills', 'Compliance', 'HR', 'Management'];

  if (loading) {
    return (
      <DashboardLayout title="Training Management" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Training Management" subtitle="Manage training courses and enrollments">
      <Head>
        <title>Training Management | HR Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      
      <div className="container mx-auto px-4 py-8" ref={pageRef}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
              <p className="text-gray-600 mt-2">Manage training courses and enrollments</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Course
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="text-3xl">📚</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.enrolled}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <div className="text-3xl">🎓</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search courses..."
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
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{course.category}</p>
                  <p className="text-sm text-gray-500">{course.duration}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.status}
                </span>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{course.description}</p>
              
              <div className="space-y-2 text-sm mb-4">
                <p><span className="font-medium">Instructor:</span> {course.instructor}</p>
                <p><span className="font-medium">Enrolled:</span> {course.enrolled} / {course.capacity}</p>
                <p><span className="font-medium">Completed:</span> {course.completed || 0}</p>
                {course.certification && (
                  <p><span className="font-medium">Certification:</span> ✅ Available</p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowEnrollModal(true);
                  }}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-200"
                >
                  Enroll
                </button>
                <button
                  onClick={() => router.push(`/training/course/${course.id}`)}
                  className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm hover:bg-green-200"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No courses match "${searchTerm}". Try another search term.` 
                : "No training courses have been created yet."}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create a Course
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} results
            </p>
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-900">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Add Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Course</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formValues.title}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                      required
                    />
                    {formErrors.title && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formValues.category}
                        onChange={handleInputChange}
                        className={`w-full border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {formErrors.category && (
                        <p className="text-red-600 text-sm mt-1">{formErrors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formValues.duration}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g., 2 weeks, 40 hours"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                      rows={3}
                      required
                    />
                    {formErrors.description && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructor
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formValues.instructor}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formValues.capacity}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id="certification"
                        name="certification"
                        checked={formValues.certification}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="certification" className="text-sm font-medium text-gray-700">
                        Certification Available
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements
                    </label>
                    <textarea
                      name="requirements"
                      value={formValues.requirements}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={2}
                      placeholder="List any prerequisites or requirements..."
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
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
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enrollment Modal */}
        {showEnrollModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enroll in Course</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to enroll in "{selectedCourse.title}"?
              </p>
              
              <div className="space-y-2 text-sm mb-4">
                <p><span className="font-medium">Duration:</span> {selectedCourse.duration}</p>
                <p><span className="font-medium">Instructor:</span> {selectedCourse.instructor}</p>
                <p><span className="font-medium">Available Spots:</span> {selectedCourse.capacity - selectedCourse.enrolled}</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowEnrollModal(false);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEnroll(selectedCourse.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting || selectedCourse.enrolled >= selectedCourse.capacity}
                >
                  {isSubmitting ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Details Modal */}
        {showDetailsModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedCourse.title}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedCourse.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Course Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Category:</span> {selectedCourse.category}</p>
                      <p><span className="font-medium">Duration:</span> {selectedCourse.duration}</p>
                      <p><span className="font-medium">Instructor:</span> {selectedCourse.instructor}</p>
                      <p><span className="font-medium">Capacity:</span> {selectedCourse.capacity}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Enrollment Stats</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Enrolled:</span> {selectedCourse.enrolled}</p>
                      <p><span className="font-medium">Completed:</span> {selectedCourse.completed || 0}</p>
                      <p><span className="font-medium">Available:</span> {selectedCourse.capacity - selectedCourse.enrolled}</p>
                      <p><span className="font-medium">Certification:</span> {selectedCourse.certification ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowEnrollModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Enroll in Course
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white ${
                toast.type === 'success' ? 'bg-green-500' :
                toast.type === 'error' ? 'bg-red-500' :
                toast.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
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
} 
