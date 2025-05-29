import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { 
  Heart, Activity, BarChart, Calendar, Clock, Zap, 
  Coffee, Moon, Sun, Utensils, Droplet, BatteryCharging,
  Award, BookOpen, Users, Clipboard, Check, Plus,
  ThumbsUp, AlertCircle, Info, Search, Download, Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function WellnessTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  
  // Mock wellness metrics data
  const wellnessMetrics = {
    overall: 78,
    sleep: 85,
    stress: 62,
    activity: 80,
    nutrition: 75,
    hydration: 90
  };
  
  // Mock wellness trends data (last 7 days)
  const wellnessTrends = [
    { date: '2023-12-01', overall: 76, sleep: 82, stress: 60, activity: 75, nutrition: 70, hydration: 88 },
    { date: '2023-12-02', overall: 75, sleep: 80, stress: 62, activity: 72, nutrition: 72, hydration: 85 },
    { date: '2023-12-03', overall: 72, sleep: 75, stress: 65, activity: 68, nutrition: 70, hydration: 82 },
    { date: '2023-12-04', overall: 74, sleep: 78, stress: 64, activity: 70, nutrition: 72, hydration: 84 },
    { date: '2023-12-05', overall: 77, sleep: 82, stress: 63, activity: 76, nutrition: 74, hydration: 87 },
    { date: '2023-12-06', overall: 76, sleep: 83, stress: 62, activity: 78, nutrition: 73, hydration: 85 },
    { date: '2023-12-07', overall: 78, sleep: 85, stress: 62, activity: 80, nutrition: 75, hydration: 90 }
  ];
  
  // Mock daily wellness entries
  const dailyEntries = [
    { 
      id: 1, 
      date: '2023-12-07', 
      type: 'sleep', 
      value: 7.5, 
      unit: 'hours',
      notes: 'Slept well, woke up once during the night',
      time: '06:30 AM'
    },
    { 
      id: 2, 
      date: '2023-12-07', 
      type: 'water', 
      value: 2200, 
      unit: 'ml',
      notes: 'Met hydration goal',
      time: '08:00 PM'
    },
    { 
      id: 3, 
      date: '2023-12-07', 
      type: 'exercise', 
      value: 45, 
      unit: 'minutes',
      notes: 'Morning jog and quick workout',
      time: '07:15 AM'
    },
    { 
      id: 4, 
      date: '2023-12-07', 
      type: 'meals', 
      value: 3, 
      unit: 'meals',
      notes: 'Healthy breakfast and lunch, light dinner',
      time: '07:30 PM'
    },
    { 
      id: 5, 
      date: '2023-12-07', 
      type: 'stress', 
      value: 3, 
      unit: 'level',
      notes: 'Moderate stress during afternoon meeting',
      time: '05:00 PM'
    }
  ];
  
  // Mock wellness programs
  const wellnessPrograms = [
    { 
      id: 1, 
      title: 'Mindfulness Meditation', 
      description: 'Learn the basics of mindfulness meditation to reduce stress and improve focus.',
      category: 'Mental Health',
      duration: '4 weeks',
      enrolled: true,
      progress: 75,
      nextSession: 'Dec 8, 2023 - 12:00 PM',
      image: '/wellness-images/meditation.jpg'
    },
    { 
      id: 2, 
      title: 'Step Challenge', 
      description: 'Join our corporate step challenge and compete with colleagues while improving your fitness.',
      category: 'Physical Activity',
      duration: '30 days',
      enrolled: true,
      progress: 60,
      nextSession: 'Ongoing',
      image: '/wellness-images/steps.jpg'
    },
    { 
      id: 3, 
      title: 'Healthy Eating Habits', 
      description: 'A nutrition workshop series to help you develop healthier eating habits.',
      category: 'Nutrition',
      duration: '6 weeks',
      enrolled: false,
      startDate: 'Jan 10, 2024',
      image: '/wellness-images/nutrition.jpg'
    },
    { 
      id: 4, 
      title: 'Stress Management Workshop', 
      description: 'Practical techniques to manage workplace stress and prevent burnout.',
      category: 'Mental Health',
      duration: '3 sessions',
      enrolled: false,
      startDate: 'Dec 15, 2023',
      image: '/wellness-images/stress.jpg'
    }
  ];
  
  // Mock wellness resources
  const wellnessResources = [
    { 
      id: 1, 
      title: 'Employee Assistance Program Guide', 
      type: 'PDF',
      description: 'Information about our EAP services and how to access them.',
      category: 'Support Services',
      popular: true
    },
    { 
      id: 2, 
      title: 'Desk Stretches for Office Workers', 
      type: 'Video',
      description: 'Simple stretches you can do at your desk to prevent stiffness.',
      category: 'Physical Wellness',
      popular: true
    },
    { 
      id: 3, 
      title: 'Healthy Meal Prep Ideas', 
      type: 'Article',
      description: 'Quick and nutritious meal ideas for busy professionals.',
      category: 'Nutrition',
      popular: false
    },
    { 
      id: 4, 
      title: 'Sleep Hygiene Best Practices', 
      type: 'PDF',
      description: 'Tips for improving your sleep quality and establishing healthy sleep routines.',
      category: 'Sleep',
      popular: true
    }
  ];
  
  // Get wellness metric icon based on type
  const getMetricIcon = (type, className = "h-6 w-6") => {
    switch (type) {
      case 'sleep':
        return <Moon className={className} />;
      case 'stress':
        return <Activity className={className} />;
      case 'activity':
        return <Zap className={className} />;
      case 'nutrition':
        return <Utensils className={className} />;
      case 'hydration':
        return <Droplet className={className} />;
      case 'water':
        return <Droplet className={className} />;
      case 'exercise':
        return <Activity className={className} />;
      case 'meals':
        return <Utensils className={className} />;
      default:
        return <Heart className={className} />;
    }
  };
  
  // Get color based on metric value
  const getMetricColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Get background color based on metric value
  const getMetricBgColor = (value) => {
    if (value >= 80) return 'bg-green-100';
    if (value >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get category badge
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Mental Health':
        return <Badge className="bg-purple-100 text-purple-800">{category}</Badge>;
      case 'Physical Activity':
        return <Badge className="bg-blue-100 text-blue-800">{category}</Badge>;
      case 'Nutrition':
        return <Badge className="bg-green-100 text-green-800">{category}</Badge>;
      case 'Support Services':
        return <Badge className="bg-yellow-100 text-yellow-800">{category}</Badge>;
      case 'Physical Wellness':
        return <Badge className="bg-blue-100 text-blue-800">{category}</Badge>;
      case 'Sleep':
        return <Badge className="bg-indigo-100 text-indigo-800">{category}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{category}</Badge>;
    }
  };
  
  return (
    <ModernDashboardLayout title="Wellness Tracker" subtitle="Monitor and improve your health and wellbeing">
      <Head>
        <title>Wellness Tracker | HR Portal</title>
        <meta name="description" content="Track and improve your wellness" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wellness Tracker</h1>
            <p className="text-gray-600">Monitor and improve your wellbeing</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-auto"
            />
            
            <Button onClick={() => setIsAddEntryOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="entries">Daily Entries</TabsTrigger>
            <TabsTrigger value="programs">Wellness Programs</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {/* Overall Wellness Score */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Overall Wellness Score</CardTitle>
                <CardDescription>Your wellness score based on all tracked metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center h-36 w-36 rounded-full ${getMetricBgColor(wellnessMetrics.overall)} mb-4`}>
                    <div className="text-center">
                      <span className={`text-4xl font-bold ${getMetricColor(wellnessMetrics.overall)}`}>{wellnessMetrics.overall}</span>
                      <span className="block text-gray-500 text-sm">/ 100</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-center max-w-md">
                    Your overall wellness score is {wellnessMetrics.overall}%, which is {wellnessMetrics.overall >= 80 ? 'excellent! Keep it up!' : wellnessMetrics.overall >= 60 ? 'good. There\'s room for improvement.' : 'below target. Focus on improving your habits.'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Wellness Metrics */}
            <h2 className="text-lg font-medium mb-3">Wellness Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {Object.entries(wellnessMetrics).filter(([key]) => key !== 'overall').map(([key, value]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${getMetricBgColor(value)}`}>
                        {getMetricIcon(key)}
                      </div>
                      <div>
                        <h3 className="capitalize font-medium">{key}</h3>
                        <div className="flex items-center">
                          <span className={`text-xl font-bold ${getMetricColor(value)}`}>{value}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Weekly Trends */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>Your wellness metrics over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(wellnessMetrics).map(([key]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          {getMetricIcon(key, "h-4 w-4 mr-2")}
                          <span className="capitalize font-medium">{key}</span>
                        </div>
                        <span className={`font-medium ${getMetricColor(wellnessMetrics[key])}`}>
                          {wellnessMetrics[key]}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${key === 'overall' ? 'bg-blue-500' : key === 'sleep' ? 'bg-indigo-500' : key === 'stress' ? 'bg-red-500' : key === 'activity' ? 'bg-green-500' : key === 'nutrition' ? 'bg-yellow-500' : 'bg-cyan-500'}`}
                          style={{ width: `${wellnessMetrics[key]}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        {wellnessTrends.map((day, index) => (
                          <div key={index} className="text-center">
                            <div className={`h-1.5 w-1.5 rounded-full mx-auto mb-1 ${day[key] > wellnessTrends[index > 0 ? index - 1 : index][key] ? 'bg-green-500' : day[key] < wellnessTrends[index > 0 ? index - 1 : index][key] ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                            <span>{formatDate(day.date).split(',')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Daily Entries Tab */}
          <TabsContent value="entries">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Daily Entries for {formatDate(selectedDate)}</h2>
              <Button variant="outline" onClick={() => setIsAddEntryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
            
            {dailyEntries.length > 0 ? (
              <div className="space-y-4">
                {dailyEntries.map(entry => (
                  <Card key={entry.id} className="overflow-hidden">
                    <div className="p-4 flex items-start gap-4">
                      <div className={`p-3 rounded-full ${getMetricBgColor(75)} flex-shrink-0`}>
                        {getMetricIcon(entry.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium capitalize">{entry.type}</h3>
                          <span className="text-gray-500">{entry.time}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-xl font-bold mr-2">{entry.value}</span>
                          <span className="text-gray-500">{entry.unit}</span>
                        </div>
                        {entry.notes && (
                          <p className="text-gray-600 mt-2">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Clipboard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Entries for This Day</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You haven't recorded any wellness entries for this date. Add an entry to start tracking your wellness metrics.
                </p>
                <Button className="mt-4" onClick={() => setIsAddEntryOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Entry
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Wellness Programs Tab */}
          <TabsContent value="programs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">My Programs</h2>
                {wellnessPrograms.filter(program => program.enrolled).length > 0 ? (
                  <div className="space-y-4">
                    {wellnessPrograms.filter(program => program.enrolled).map(program => (
                      <Card key={program.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-32 h-24 bg-gray-200 rounded overflow-hidden">
                              {program.image ? (
                                <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Heart className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-lg">{program.title}</h3>
                                  <div className="flex items-center mt-1">
                                    {getCategoryBadge(program.category)}
                                    <span className="text-gray-500 text-sm ml-2">{program.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">Progress: {program.progress}%</span>
                                </div>
                                <Progress value={program.progress} className="h-2" />
                              </div>
                              <div className="mt-3 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                  <span>Next: {program.nextSession}</span>
                                </div>
                                <Button>Continue</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">You are not enrolled in any wellness programs yet.</p>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Available Programs</h2>
                <div className="space-y-4">
                  {wellnessPrograms.filter(program => !program.enrolled).map(program => (
                    <Card key={program.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-32 h-24 bg-gray-200 rounded overflow-hidden">
                            {program.image ? (
                              <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Heart className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{program.title}</h3>
                                <div className="flex items-center mt-1">
                                  {getCategoryBadge(program.category)}
                                  <span className="text-gray-500 text-sm ml-2">{program.duration}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{program.description}</p>
                            <div className="mt-3 flex justify-between items-center">
                              <div className="text-sm text-gray-600">
                                <span>Starts: {program.startDate}</span>
                              </div>
                              <Button>Enroll</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-lg font-medium">Wellness Resources</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wellnessResources.map(resource => (
                <Card key={resource.id} className="overflow-hidden h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between">
                      {getCategoryBadge(resource.category)}
                      {resource.popular && (
                        <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full" variant="outline">
                      {resource.type === 'PDF' ? (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      ) : resource.type === 'Video' ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Watch
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Need Support?</CardTitle>
                <CardDescription>Our Employee Assistance Program offers confidential counseling and support services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center md:w-1/3">
                    <Users className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium">Counseling Services</h3>
                    <p className="text-sm text-gray-600">Confidential professional counseling for personal issues</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center text-center md:w-1/3">
                    <Heart className="h-8 w-8 text-purple-600 mb-2" />
                    <h3 className="font-medium">Mental Health Resources</h3>
                    <p className="text-sm text-gray-600">Self-help tools and resources for mental wellbeing</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center text-center md:w-1/3">
                    <Clipboard className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-medium">Work-Life Services</h3>
                    <p className="text-sm text-gray-600">Resources to help balance work and personal life</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center">
                  <p className="text-gray-500 mb-3">All services are completely confidential and available 24/7</p>
                  <Button>
                    Contact EAP Services
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Entry Dialog */}
      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Wellness Entry</DialogTitle>
            <DialogDescription>
              Record a new wellness metric for {formatDate(selectedDate)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Metric Type</label>
              <Select defaultValue="sleep">
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="water">Water Intake</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="meals">Meals</SelectItem>
                  <SelectItem value="stress">Stress Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input type="number" placeholder="Enter value" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Select defaultValue="hours">
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="ml">Milliliters</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="level">Level (1-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input type="time" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Input placeholder="Add notes about this entry" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAddEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle adding entry
              setIsAddEntryOpen(false);
            }}>
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModernDashboardLayout>
  );
} 
