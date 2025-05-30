import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { 
  BookOpen, Award, CheckCircle, Star, Clock, BarChart, 
  Search, Filter, Calendar, Play, Download, FileText,
  Grid, List, ChevronRight, ThumbsUp, MessageSquare, Bookmark,
  Award as Certificate, PlayCircle, TrendingUp, Plus, Zap, Heart, User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function LearningPortal() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Mock user skills data
  const userSkills = [
    { id: 1, name: 'Project Management', level: 80, category: 'Management' },
    { id: 2, name: 'Data Analysis', level: 65, category: 'Technical' },
    { id: 3, name: 'Leadership', level: 70, category: 'Soft Skills' },
    { id: 4, name: 'React Development', level: 85, category: 'Technical' },
    { id: 5, name: 'Communication', level: 75, category: 'Soft Skills' }
  ];
  
  // Mock recommended courses
  // Image fallback handler
  const getImageFallback = (courseName: string) => {
    const fallbacks = {
      'react-advanced': '⚛️',
      'leadership': '👨‍💼',
      'data-science': '📊',
      'communication': '💬',
      'project-management': '📋',
      'business-analytics': '📈',
      'javascript': '📟',
      'time-management': '⏰'
    };
    return fallbacks[courseName] || '📚';
  };

  const recommendedCourses = [
    { 
      id: 1, 
      title: 'Advanced React Patterns', 
      description: 'Learn advanced patterns and best practices for React development.',
      thumbnail: '📚',
      instructor: 'Michael Johnson',
      duration: '4 hours',
      level: 'Advanced',
      rating: 4.8,
      reviews: 342,
      category: 'Technical',
      popular: true,
      progress: 0
    },
    { 
      id: 2, 
      title: 'Effective Leadership Skills', 
      description: 'Develop the essential skills needed to lead teams effectively.',
      thumbnail: '📚',
      instructor: 'Sarah Williams',
      duration: '6 hours',
      level: 'Intermediate',
      rating: 4.7,
      reviews: 215,
      category: 'Soft Skills',
      popular: true,
      progress: 0
    },
    { 
      id: 3, 
      title: 'Data Science Fundamentals', 
      description: 'Understand the basics of data science and analytics.',
      thumbnail: '📚',
      instructor: 'David Chen',
      duration: '8 hours',
      level: 'Beginner',
      rating: 4.5,
      reviews: 189,
      category: 'Technical',
      popular: false,
      progress: 0
    },
    { 
      id: 4, 
      title: 'Effective Communication', 
      description: 'Improve your communication skills in professional settings.',
      thumbnail: '📚',
      instructor: 'Emily Rodriguez',
      duration: '3 hours',
      level: 'Beginner',
      rating: 4.9,
      reviews: 410,
      category: 'Soft Skills',
      popular: true,
      progress: 0
    }
  ];
  
  // Mock in-progress courses
  const inProgressCourses = [
    { 
      id: 5, 
      title: 'Project Management Essentials', 
      description: 'Learn the fundamentals of project management and deliver successful projects.',
      thumbnail: '📚',
      instructor: 'Robert Taylor',
      duration: '5 hours',
      level: 'Intermediate',
      rating: 4.6,
      reviews: 278,
      category: 'Management',
      popular: false,
      progress: 45,
      nextLesson: 'Risk Management Techniques'
    },
    { 
      id: 6, 
      title: 'Business Analytics', 
      description: 'Discover how to use data to drive business decisions.',
      thumbnail: '📚',
      instructor: 'Lisa Wang',
      duration: '7 hours',
      level: 'Intermediate',
      rating: 4.4,
      reviews: 156,
      category: 'Technical',
      popular: false,
      progress: 75,
      nextLesson: 'Predictive Analytics Models'
    }
  ];
  
  // Mock completed courses
  const completedCourses = [
    { 
      id: 7, 
      title: 'Introduction to JavaScript', 
      description: 'Learn the basics of JavaScript programming language.',
      thumbnail: '📚',
      instructor: 'James Wilson',
      duration: '6 hours',
      level: 'Beginner',
      rating: 4.7,
      reviews: 325,
      category: 'Technical',
      completedDate: '2023-11-15',
      certificate: true
    },
    { 
      id: 8, 
      title: 'Time Management', 
      description: 'Master techniques to manage your time efficiently.',
      thumbnail: '📚',
      instructor: 'Patricia Lewis',
      duration: '2 hours',
      level: 'Beginner',
      rating: 4.5,
      reviews: 198,
      category: 'Soft Skills',
      completedDate: '2023-10-22',
      certificate: true
    }
  ];
  
  // Mock upcoming training events
  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Design Thinking Workshop', 
      date: '2023-12-15 09:00 AM',
      instructor: 'Anna Kim',
      location: 'Training Room A',
      category: 'Design',
      duration: '3 hours'
    },
    { 
      id: 2, 
      title: 'Agile Development Masterclass', 
      date: '2023-12-18 01:00 PM',
      instructor: 'Thomas Brown',
      location: 'Virtual - Zoom',
      category: 'Technical',
      duration: '4 hours'
    }
  ];
  
  // Mock certifications
  const certifications = [
    { 
      id: 1, 
      name: 'JavaScript Developer', 
      issuer: 'Web Development Institute',
      date: '2023-09-15',
      expiryDate: '2025-09-15',
      credentialId: 'JS-DEV-2023-4578',
      skills: ['JavaScript', 'HTML', 'CSS']
    },
    { 
      id: 2, 
      name: 'Project Management Professional', 
      issuer: 'Project Management Association',
      date: '2023-06-10',
      expiryDate: '2026-06-10',
      credentialId: 'PMP-2023-7823',
      skills: ['Project Management', 'Risk Assessment', 'Resource Planning']
    }
  ];
  
  // Client-side check
  const isClient = typeof window !== 'undefined';
  
  // Preserve scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    // Add scroll event listener only on client side
    if (isClient) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Cleanup
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
  }, [isClient, viewMode, activeTab, categoryFilter, scrollPosition]);

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

  // Filter courses based on search and category
  const filterCourses = (courses) => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === '' || 
                           course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  const filteredRecommended = filterCourses(recommendedCourses);
  const filteredInProgress = filterCourses(inProgressCourses);
  const filteredCompleted = filterCourses(completedCourses);
  
  // Get all available categories
  const allCategories = Array.from(
    new Set([
      ...recommendedCourses.map(c => c.category),
      ...inProgressCourses.map(c => c.category),
      ...completedCourses.map(c => c.category)
    ])
  );
  
  // Get level badge with appropriate styling
  const getLevelBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return <Badge className="bg-green-100 text-green-800">Beginner</Badge>;
      case 'Intermediate':
        return <Badge className="bg-blue-100 text-blue-800">Intermediate</Badge>;
      case 'Advanced':
        return <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{level}</Badge>;
    }
  };
  
  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format datetime string
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  return (
    <ModernDashboardLayout title="Learning Portal" subtitle="Develop your skills and advance your career">
      <Head>
        <title>Learning Portal | HR Portal</title>
        <meta name="description" content="Explore courses and training opportunities" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      <div ref={pageRef} className="container px-4 sm:px-6 mx-auto py-6 space-y-6 max-w-full lg:max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Portal</h1>
            <p className="text-gray-600">Discover, learn, and grow your professional skills</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search courses..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Button 
                variant={viewMode === 'grid' ? 'outline' : 'ghost'} 
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'outline' : 'ghost'} 
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Learning Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-3">
                <PlayCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCourses.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-3">
                <Certificate className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Certifications</p>
                <p className="text-2xl font-bold">{certifications.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Skills Assessment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Skills Profile</CardTitle>
            <CardDescription>Skills assessment based on your completed courses and manager feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSkills.map(skill => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{skill.name}</p>
                    <Badge className="bg-gray-100 text-gray-800">{skill.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.level} className="h-2" />
                    <span className="text-sm font-medium">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
              <Button>
                <TrendingUp className="h-4 w-4 mr-2" />
                Full Skills Assessment
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Courses Tabs */}
        <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="certifications">My Certifications</TabsTrigger>
          </TabsList>
          
          {/* Recommended Courses */}
          <TabsContent value="recommended">
            {filteredRecommended.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-4"
              }>
                {filteredRecommended.map(course => (
                  viewMode === 'grid' ? (
                    <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow h-full">
                      <div className="h-40 bg-gray-200 relative">
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {course.popular && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Zap className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getLevelBadge(course.level)}
                          <Badge className="bg-gray-100 text-gray-800">{course.duration}</Badge>
                          <Badge className="bg-gray-100 text-gray-800">{course.category}</Badge>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{course.rating}</span>
                          </div>
                          <span className="text-gray-500 text-xs ml-2">({course.reviews} reviews)</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Start Course
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                          {course.image ? (
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{course.title}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-1">{course.description}</p>
                            </div>
                            {course.popular && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Zap className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {getLevelBadge(course.level)}
                            <Badge className="bg-gray-100 text-gray-800">{course.duration}</Badge>
                            <Badge className="bg-gray-100 text-gray-800">{course.category}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{course.rating}</span>
                              <span className="text-gray-500 text-xs ml-2">({course.reviews} reviews)</span>
                            </div>
                            <Button>
                              <Play className="h-4 w-4 mr-2" />
                              Start Course
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== 'all' 
                    ? "No courses match your search criteria. Try adjusting your filters."
                    : "We don't have any recommended courses for you at the moment."}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* In Progress Courses */}
          <TabsContent value="inprogress">
            {filteredInProgress.length > 0 ? (
              <div className="space-y-4">
                {filteredInProgress.map(course => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-40 h-32 md:h-auto flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                          {course.image ? (
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <BookOpen className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{course.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {getLevelBadge(course.level)}
                            <Badge className="bg-gray-100 text-gray-800">{course.duration}</Badge>
                            <Badge className="bg-gray-100 text-gray-800">{course.category}</Badge>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Progress: {course.progress}%</span>
                              <span className="text-sm text-gray-500">Next: {course.nextLesson}</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="flex justify-end">
                            <Button>
                              <Play className="h-4 w-4 mr-2" />
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses In Progress</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== 'all' 
                    ? "No in-progress courses match your search criteria. Try adjusting your filters."
                    : "You don't have any courses in progress. Start a new course to see it here."}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Completed Courses */}
          <TabsContent value="completed">
            {filteredCompleted.length > 0 ? (
              <div className="space-y-4">
                {filteredCompleted.map(course => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-32 h-24 md:h-auto flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{course.title}</h3>
                            <p className="text-sm text-gray-500">
                              Completed on {formatDate(course.completedDate)}
                            </p>
                          </div>
                          {course.certificate && (
                            <Badge className="bg-green-100 text-green-800">
                              <Award className="h-3 w-3 mr-1" />
                              Certificate
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                          {getLevelBadge(course.level)}
                          <Badge className="bg-gray-100 text-gray-800">{course.duration}</Badge>
                          <Badge className="bg-gray-100 text-gray-800">{course.category}</Badge>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Review Materials
                          </Button>
                          {course.certificate && (
                            <Button>
                              <Download className="h-4 w-4 mr-2" />
                              Download Certificate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Courses</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== 'all' 
                    ? "No completed courses match your search criteria. Try adjusting your filters."
                    : "You haven't completed any courses yet. Complete a course to see it here."}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Upcoming Events */}
          <TabsContent value="events">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <p className="text-gray-600">{formatDateTime(event.date)}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{event.category}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">{event.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Instructor</p>
                          <p className="font-medium">{event.instructor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline">Add to Calendar</Button>
                        <Button>Register</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no upcoming training events scheduled at the moment.
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Certifications */}
          <TabsContent value="certifications">
            {certifications.length > 0 ? (
              <div className="space-y-4">
                {certifications.map(cert => (
                  <Card key={cert.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{cert.name}</h3>
                          <p className="text-gray-600">Issued by {cert.issuer}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className="bg-green-100 text-green-800 mb-1">
                            <Award className="h-3 w-3 mr-1" />
                            Credential
                          </Badge>
                          <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Issue Date</p>
                          <p className="font-medium">{formatDate(cert.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiry Date</p>
                          <p className="font-medium">{formatDate(cert.expiryDate)}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Associated Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {cert.skills.map((skill, idx) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Certifications</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You don't have any certifications yet. Complete certified courses to earn them.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Learning Paths */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recommended Learning Paths</CardTitle>
            <CardDescription>Structured learning programs to achieve your career goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">Leadership Development</h3>
                    <p className="text-gray-600">Develop essential leadership skills for management roles</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>
                </div>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>8 Courses</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>24 Hours</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Certificate</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" className="w-full">View Path</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">Full-Stack Development</h3>
                    <p className="text-gray-600">Master modern web development technologies</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Intermediate</Badge>
                </div>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>12 Courses</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>40 Hours</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Certificate</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" className="w-full">View Path</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Explore All Learning Paths
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ModernDashboardLayout>
  );
} 
