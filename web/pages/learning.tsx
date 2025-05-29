import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { GetServerSideProps } from 'next';
import { useSSR } from '@/hooks/useSSR';
import ClientOnly from '@/components/ui/ClientOnly';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in hours
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  enrolled: boolean;
  completed: boolean;
  progress: number; // 0-100
  certificate?: string;
  thumbnail?: string;
  rating: number;
  enrolledCount: number;
  mandatory: boolean;
  modules: number;
  assignments: number;
  price: string;
  skills: string[];
  prerequisites: string[];
  status: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[];
  completed: number;
  total: number;
  difficulty: string;
  skills: string[];
  courseIds: string[];
  thumbnail: string;
}

const LearningPortal = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const { isClient, isLoaded } = useSSR();

  // Ensure user has access to this page
  useEffect(() => {
    if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
      router.push('/login?redirect=/learning');
    }
  }, [allowAccess, role, router]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Company Values & Culture',
        description: 'Learn about our mission, values, and company culture.',
        category: 'Onboarding',
        duration: 2,
        level: 'Beginner',
        instructor: 'HR Team',
        enrolled: true,
        completed: true,
        progress: 100,
        certificate: 'company-values-cert.pdf',
        rating: 4.8,
        enrolledCount: 250,
        mandatory: true,
        modules: 8,
        assignments: 5,
        price: 'free',
        skills: ['Company Values', 'Culture'],
        prerequisites: [],
        thumbnail: '💻',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Workplace Safety Training',
        description: 'Mandatory safety training for all employees.',
        category: 'Safety',
        duration: 3,
        level: 'Beginner',
        instructor: 'Safety Team',
        enrolled: true,
        completed: true,
        progress: 100,
        certificate: 'safety-cert.pdf',
        rating: 4.6,
        enrolledCount: 300,
        mandatory: true,
        modules: 6,
        assignments: 3,
        price: 'free',
        skills: ['Safety', 'Risk Management'],
        prerequisites: [],
        thumbnail: '💪',
        status: 'completed'
      },
      {
        id: '3',
        title: 'Diversity & Inclusion',
        description: 'Fostering an inclusive workplace for everyone.',
        category: 'HR',
        duration: 1.5,
        level: 'Beginner',
        instructor: 'D&I Team',
        enrolled: true,
        completed: false,
        progress: 60,
        rating: 4.7,
        enrolledCount: 180,
        mandatory: true,
        modules: 4,
        assignments: 2,
        price: 'free',
        skills: ['Diversity', 'Inclusion'],
        prerequisites: [],
        thumbnail: '👥',
        status: 'in_progress'
      },
      {
        id: '4',
        title: 'Time Management Mastery',
        description: 'Boost your productivity with effective time management.',
        category: 'Professional Development',
        duration: 4,
        level: 'Intermediate',
        instructor: 'John Smith',
        enrolled: false,
        completed: false,
        progress: 0,
        rating: 4.9,
        enrolledCount: 120,
        mandatory: false,
        modules: 10,
        assignments: 7,
        price: 'premium',
        skills: ['Time Management', 'Productivity'],
        prerequisites: ['Basic Time Management'],
        thumbnail: '⏰',
        status: 'not_started'
      },
      {
        id: '5',
        title: 'Leadership Fundamentals',
        description: 'Essential leadership skills for emerging leaders.',
        category: 'Leadership',
        duration: 8,
        level: 'Intermediate',
        instructor: 'Sarah Johnson',
        enrolled: false,
        completed: false,
        progress: 0,
        rating: 4.8,
        enrolledCount: 90,
        mandatory: false,
        modules: 6,
        assignments: 3,
        price: 'premium',
        skills: ['Leadership', 'Team Management'],
        prerequisites: ['Basic Leadership'],
        thumbnail: '👑',
        status: 'not_started'
      },
      {
        id: '6',
        title: 'Data Analysis with Excel',
        description: 'Master data analysis techniques using Excel.',
        category: 'Technical',
        duration: 6,
        level: 'Intermediate',
        instructor: 'Mike Wilson',
        enrolled: true,
        completed: false,
        progress: 25,
        rating: 4.5,
        enrolledCount: 150,
        mandatory: false,
        modules: 10,
        assignments: 7,
        price: 'free',
        skills: ['Excel', 'Data Analysis'],
        prerequisites: ['Basic Excel'],
        thumbnail: '📊',
        status: 'in_progress'
      }
    ];

    const mockLearningPaths: LearningPath[] = [
      {
        id: '1',
        title: 'Full Stack Developer',
        description: 'Complete learning path to become a full stack web developer',
        courses: ['1', '2', '3'],
        completed: 2,
        total: 3,
        difficulty: 'intermediate',
        skills: ['JavaScript', 'React', 'Node.js', 'Database Design'],
        courseIds: ['1', '2'],
        thumbnail: '💻'
      },
      {
        id: '2',
        title: 'Management Excellence',
        description: 'Develop comprehensive management and leadership capabilities',
        courses: ['4', '5'],
        completed: 0,
        total: 2,
        difficulty: 'advanced',
        skills: ['Leadership', 'Project Management', 'Team Building'],
        courseIds: ['4', '5'],
        thumbnail: '👔'
      },
      {
        id: '3',
        title: 'Data Analyst Professional',
        description: 'Master data analysis tools and techniques for business insights',
        courses: ['6'],
        completed: 1,
        total: 1,
        difficulty: 'intermediate',
        skills: ['Excel', 'SQL', 'Python', 'Data Visualization'],
        courseIds: ['6'],
        thumbnail: '📈'
      }
    ];

    setCourses(mockCourses);
    setLearningPaths(mockLearningPaths);
    setIsLoading(false);
  }, []);

  const handleEnroll = (courseId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId ? { ...course, enrolled: true } : course
      )
    );
  };

  const handleStartCourse = (courseId: string) => {
    // Navigate to course content or start course
    router.push(`/training/course/${courseId}`);
  };

  const categories = ['All', ...Array.from(new Set(courses.map(course => course.category)))];
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                         course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const enrolledCourses = courses.filter(course => course.enrolled);
  const completedCourses = courses.filter(course => course.completed);
  const overallProgress = enrolledCourses.length > 0 
    ? Math.round((completedCourses.length / enrolledCourses.length) * 100)
    : 0;

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Onboarding': return '🎓';
      case 'Safety': return '💪';
      case 'HR': return '👥';
      case 'Professional Development': return '⏰';
      case 'Leadership': return '👑';
      case 'Technical': return '💻';
      case 'Marketing': return '📱';
      case 'Design': return '🎨';
      default: return '📚';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Learning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎓</span>
                <div>
                  <div className="text-2xl font-bold text-green-600">{completedCourses.length}</div>
                  <div className="text-sm text-gray-600">Courses Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⏱️</span>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{courses.filter(c => c.certificate).length}</div>
                  <div className="text-sm text-gray-600">Certificates Earned</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔥</span>
                <div>
                  <div className="text-2xl font-bold text-orange-600">12 days</div>
                  <div className="text-sm text-gray-600">Learning Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🔍</span>
              <span className="text-sm">Browse Courses</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📚</span>
              <span className="text-sm">Continue Learning</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🎯</span>
              <span className="text-sm">Learning Paths</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🏆</span>
              <span className="text-sm">View Certificates</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.filter(c => c.status === 'in_progress').map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{course.thumbnail}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <Button size="sm" className="w-full">Continue Course</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Add recent achievements component here */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Add recommended courses component here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">All Courses</h2>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{course.thumbnail}</span>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)} mb-1`}>
                      {course.level}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(course.status)}`}>
                      {course.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">{course.duration}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Instructor:</span>
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rating:</span>
                    <span className="font-medium">⭐ {course.rating} ({course.enrolledCount})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Modules:</span>
                    <span className="font-medium">{course.modules}</span>
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {course.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedCourse(course)}
                  >
                    {course.status === 'not_started' ? 'Enroll' : 
                     course.status === 'in_progress' ? 'Continue' : 'Review'}
                  </Button>
                  <Button size="sm" variant="outline">
                    {course.price === 'free' ? 'Free' : '$99'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaths = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Learning Paths</h2>
        <Button>Create Custom Path</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPaths.map((path) => (
          <Card key={path.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{path.thumbnail}</span>
                  <CardTitle>{path.title}</CardTitle>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(path.difficulty)}`}>
                  {path.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{path.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{path.total} hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Courses:</span>
                  <span className="font-medium">{path.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span className="font-medium">{path.completed}/{path.total} completed</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{Math.round((path.completed / path.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(path.completed / path.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Skills You'll Master:</h4>
                <div className="flex flex-wrap gap-1">
                  {path.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedPath(path)}
                >
                  View Path
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.filter(c => c.certificate).map((course) => (
              <div key={course.certificate} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🏆</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(course.status)}`}>
                    {course.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="font-medium mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Issued by {course.instructor}</p>
                
                <div className="space-y-1 text-xs text-gray-500 mb-3">
                  <div>Earned: {new Date(course.certificate).toLocaleDateString()}</div>
                  <div>Expires: {new Date(course.certificate).toLocaleDateString()}</div>
                  <div>ID: {course.certificate}</div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {course.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">View</Button>
                  <Button size="sm" variant="outline" className="flex-1">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Server-safe rendering
  if (!isLoaded) {
    return (
      <ModernDashboardLayout>
        <div className="p-4 md:p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </ModernDashboardLayout>
    );
  }
  
  return (
    <ModernDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Learning Portal</h1>
          <p className="text-gray-600">Expand your skills and advance your career through continuous learning</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'courses', label: 'Courses' },
            { id: 'paths', label: 'Learning Paths' },
            { id: 'certifications', label: 'Certifications' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'paths' && renderPaths()}
        {activeTab === 'certifications' && renderCertifications()}

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{selectedCourse.thumbnail}</span>
                  <div>
                    <h3 className="font-medium">Instructor: {selectedCourse.instructor}</h3>
                    <div className="text-sm text-gray-600">
                      ⭐ {selectedCourse.rating} ({selectedCourse.enrolledCount} students)
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600">{selectedCourse.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Course Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Duration:</span> {selectedCourse.duration}h</div>
                      <div><span className="font-medium">Level:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getLevelColor(selectedCourse.level)}`}>
                          {selectedCourse.level}
                        </span>
                      </div>
                      <div><span className="font-medium">Modules:</span> {selectedCourse.modules}</div>
                      <div><span className="font-medium">Assignments:</span> {selectedCourse.assignments}</div>
                      <div><span className="font-medium">Price:</span> {selectedCourse.price === 'free' ? 'Free' : '$99'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills You'll Learn</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCourse.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {selectedCourse.prerequisites.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Prerequisites</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedCourse.prerequisites.map((prereq, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              {prereq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedCourse.progress > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Your Progress</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion</span>
                      <span>{selectedCourse.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedCourse.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">
                  {selectedCourse.status === 'not_started' ? 'Enroll Now' : 
                   selectedCourse.status === 'in_progress' ? 'Continue Learning' : 'Review Course'}
                </Button>
                <Button variant="outline" className="flex-1">Add to Wishlist</Button>
              </div>
            </div>
          </div>
        )}

        {/* Learning Path Detail Modal */}
        {selectedPath && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedPath.title}</h2>
                <button
                  onClick={() => setSelectedPath(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{selectedPath.thumbnail}</span>
                  <div>
                    <p className="text-gray-600">{selectedPath.description}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedPath.total} hours • {selectedPath.total} courses
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Learning Path Progress</h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Completion</span>
                    <span>{Math.round((selectedPath.completed / selectedPath.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(selectedPath.completed / selectedPath.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Skills You'll Master</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPath.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Courses in This Path</h4>
                  <div className="space-y-2">
                    {selectedPath.courseIds.map((courseId, index) => {
                      const course = courses.find(c => c.id === courseId);
                      if (!course) return null;
                      
                      return (
                        <div key={courseId} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{course.thumbnail}</span>
                            <div>
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-gray-600">{course.duration}</div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(course.status)}`}>
                            {course.status.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">Start Learning Path</Button>
                <Button variant="outline" className="flex-1">Save for Later</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernDashboardLayout>
  );
};

export default LearningPortal;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
}; 
