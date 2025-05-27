import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  FileText, Clock, Check, X, AlertCircle, Filter, Search,
  Plus, Calendar, Laptop, CreditCard, Briefcase, Book,
  HardDrive, FileCheck, ChevronRight, ChevronDown, 
  MoreHorizontal, Download, MessageSquare, Users, Car
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';

export default function RequestPanel() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Request types grouped by category
  const requestTypes = {
    timeAndLeave: [
      { id: 'leave', name: 'Leave/Time-off Request', icon: <Calendar className="h-4 w-4" /> },
      { id: 'remote', name: 'Remote Work Request', icon: <Laptop className="h-4 w-4" /> },
      { id: 'overtime', name: 'Overtime Approval', icon: <Clock className="h-4 w-4" /> },
      { id: 'shift', name: 'Shift Change Request', icon: <Clock className="h-4 w-4" /> },
      { id: 'time-adjustment', name: 'Time Adjustment Request', icon: <Clock className="h-4 w-4" /> }
    ],
    financeAndBenefits: [
      { id: 'expense', name: 'Expense Reimbursement', icon: <CreditCard className="h-4 w-4" /> },
      { id: 'loan', name: 'Salary Advance/Loan Request', icon: <CreditCard className="h-4 w-4" /> },
      { id: 'benefits', name: 'Benefits Change Request', icon: <Users className="h-4 w-4" /> },
      { id: 'compensation', name: 'Compensation Review Request', icon: <CreditCard className="h-4 w-4" /> },
      { id: 'tax', name: 'Tax Document Request', icon: <FileText className="h-4 w-4" /> }
    ],
    equipmentAndResources: [
      { id: 'equipment', name: 'Office Equipment Request', icon: <HardDrive className="h-4 w-4" /> },
      { id: 'software', name: 'Software/License Request', icon: <HardDrive className="h-4 w-4" /> },
      { id: 'access', name: 'Access Permission Request', icon: <FileCheck className="h-4 w-4" /> },
      { id: 'workspace', name: 'Workspace Modification Request', icon: <Briefcase className="h-4 w-4" /> }
    ],
    careerAndDevelopment: [
      { id: 'training', name: 'Training Program Enrollment', icon: <Book className="h-4 w-4" /> },
      { id: 'conference', name: 'Conference/Event Attendance', icon: <Users className="h-4 w-4" /> },
      { id: 'mentorship', name: 'Mentorship Program Request', icon: <Users className="h-4 w-4" /> },
      { id: 'job', name: 'Internal Job Application', icon: <Briefcase className="h-4 w-4" /> },
      { id: 'education', name: 'Education Assistance Request', icon: <Book className="h-4 w-4" /> }
    ],
    administrative: [
      { id: 'document', name: 'Document/Certificate Request', icon: <FileText className="h-4 w-4" /> },
      { id: 'travel', name: 'Travel Authorization', icon: <Car className="h-4 w-4" /> },
      { id: 'namechange', name: 'Business Card/Name Change', icon: <FileText className="h-4 w-4" /> },
      { id: 'exception', name: 'Policy Exception Request', icon: <AlertCircle className="h-4 w-4" /> }
    ]
  };

  // Mock request data
  const [requests, setRequests] = useState([
    {
      id: 'REQ-2023-001',
      type: 'leave',
      category: 'timeAndLeave',
      title: 'Annual Leave Request',
      description: 'Requesting annual leave for a family vacation',
      status: 'approved',
      submittedDate: '2023-11-15',
      decisionDate: '2023-11-17',
      approver: 'Sarah Johnson',
      details: {
        startDate: '2023-12-20',
        endDate: '2023-12-27',
        returnDate: '2023-12-28',
        totalDays: 5,
        leaveType: 'Annual Leave',
        comments: 'Family vacation planned during the holidays'
      }
    },
    {
      id: 'REQ-2023-002',
      type: 'equipment',
      category: 'equipmentAndResources',
      title: 'Laptop Upgrade Request',
      description: 'Requesting a laptop upgrade due to performance issues',
      status: 'pending',
      submittedDate: '2023-11-28',
      approver: 'Michael Chen',
      details: {
        equipmentType: 'Laptop',
        reason: 'Current laptop is over 3 years old and experiencing significant performance issues',
        specifications: 'Prefer 16GB RAM, 512GB SSD, and dedicated graphics card',
        urgency: 'Medium',
        additionalInfo: 'Current laptop model is XPS 13, purchased in 2020'
      }
    },
    {
      id: 'REQ-2023-003',
      type: 'expense',
      category: 'financeAndBenefits',
      title: 'Client Meeting Expense',
      description: 'Expense reimbursement for client lunch meeting',
      status: 'approved',
      submittedDate: '2023-11-20',
      decisionDate: '2023-11-22',
      approver: 'Emma Rodriguez',
      details: {
        amount: 82.50,
        currency: 'USD',
        date: '2023-11-18',
        category: 'Client Entertainment',
        paymentMethod: 'Personal Credit Card',
        receiptProvided: true
      }
    },
    {
      id: 'REQ-2023-004',
      type: 'remote',
      category: 'timeAndLeave',
      title: 'Remote Work Arrangement',
      description: 'Request to work remotely for 2 weeks',
      status: 'pending',
      submittedDate: '2023-11-29',
      approver: 'Sarah Johnson',
      details: {
        startDate: '2023-12-11',
        endDate: '2023-12-22',
        location: 'Home Office',
        reason: 'Family member needs care after surgery',
        connectivity: 'High-speed internet confirmed',
        availability: 'Will be available during regular business hours'
      }
    },
    {
      id: 'REQ-2023-005',
      type: 'training',
      category: 'careerAndDevelopment',
      title: 'React Advanced Training',
      description: 'Request to attend advanced React development course',
      status: 'rejected',
      submittedDate: '2023-11-10',
      decisionDate: '2023-11-15',
      approver: 'Michael Chen',
      rejectionReason: 'Budget constraints for current quarter. Please reapply in Q1 2024.',
      details: {
        courseName: 'Advanced React Patterns',
        provider: 'Frontend Masters',
        cost: 499.00,
        currency: 'USD',
        startDate: '2023-12-05',
        duration: '3 days',
        justification: 'Will help improve our application architecture and performance'
      }
    },
    {
      id: 'REQ-2023-006',
      type: 'access',
      category: 'equipmentAndResources',
      title: 'Database Access Request',
      description: 'Requesting access to production database for troubleshooting',
      status: 'pending',
      submittedDate: '2023-11-30',
      approver: 'James Wilson',
      details: {
        system: 'Production PostgreSQL Database',
        accessLevel: 'Read-only',
        duration: 'Temporary (2 weeks)',
        justification: 'Need to investigate data inconsistency issues reported by clients',
        manager: 'Michael Chen'
      }
    }
  ]);

  // Filter requests based on active tab, search query, and filters
  const filteredRequests = requests.filter(request => {
    // Filter by tab
    if (activeTab !== 'all' && request.status !== activeTab) return false;
    
    // Filter by search query
    if (searchQuery && !request.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !request.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter by status
    if (statusFilter !== 'all' && request.status !== statusFilter) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && request.category !== categoryFilter) return false;
    
    // Filter by date (simplified for demo)
    if (dateFilter === 'last7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const requestDate = new Date(request.submittedDate);
      if (requestDate < sevenDaysAgo) return false;
    }
    else if (dateFilter === 'last30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const requestDate = new Date(request.submittedDate);
      if (requestDate < thirtyDaysAgo) return false;
    }
    
    return true;
  });

  // Get status badge based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Get icon based on request type
  const getRequestTypeIcon = (type) => {
    // Flatten all request types into a single array
    const allTypes = Object.values(requestTypes).flat();
    // Find the matching type
    const requestType = allTypes.find(t => t.id === type);
    return requestType ? requestType.icon : <FileText className="h-4 w-4" />;
  };

  // Get category name from category id
  const getCategoryName = (categoryId) => {
    switch (categoryId) {
      case 'timeAndLeave': return 'Time & Leave';
      case 'financeAndBenefits': return 'Finance & Benefits';
      case 'equipmentAndResources': return 'Equipment & Resources';
      case 'careerAndDevelopment': return 'Career & Development';
      case 'administrative': return 'Administrative';
      default: return categoryId;
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle opening request details
  const handleOpenRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  // Handle initiating a new request
  const handleInitiateRequest = (typeId) => {
    // Flatten all request types into a single array
    const allTypes = Object.values(requestTypes).flat();
    // Find the selected request type
    const requestType = allTypes.find(t => t.id === typeId);
    setSelectedRequestType(requestType);
  };

  // Handle submitting a new request (mock implementation)
  const handleSubmitRequest = () => {
    // In a real implementation, this would validate and submit the form data
    setIsNewRequestOpen(false);
    setSelectedRequestType(null);
    // Could add a success notification here
  };

  return (
    <DashboardLayout title="Request Panel" subtitle="Manage and track your requests">
      <Head>
        <title>Request Panel | HR Portal</title>
        <meta name="description" content="Submit and track requests" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Panel</h1>
            <p className="text-gray-600">Submit and track your approval requests</p>
          </div>
          
          <Button onClick={() => setIsNewRequestOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search requests..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="timeAndLeave">Time & Leave</SelectItem>
                  <SelectItem value="financeAndBenefits">Finance & Benefits</SelectItem>
                  <SelectItem value="equipmentAndResources">Equipment & Resources</SelectItem>
                  <SelectItem value="careerAndDevelopment">Career & Development</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Requests Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded">
                            {getRequestTypeIcon(request.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{request.title}</h3>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-gray-500">{request.id} • Submitted on {formatDate(request.submittedDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getCategoryName(request.category)}</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenRequestDetails(request)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-gray-600 text-sm">
                        {request.description}
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center text-sm">
                        <div className="text-gray-500">
                          {request.status === 'pending' ? (
                            <span>Pending approval from {request.approver}</span>
                          ) : request.status === 'approved' ? (
                            <span>Approved by {request.approver} on {formatDate(request.decisionDate)}</span>
                          ) : request.status === 'rejected' ? (
                            <span>Rejected by {request.approver} on {formatDate(request.decisionDate)}</span>
                          ) : null}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenRequestDetails(request)}>
                              View Details
                            </DropdownMenuItem>
                            {request.status === 'pending' && (
                              <DropdownMenuItem>
                                Cancel Request
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all'
                    ? "No requests match your current filters. Try adjusting your search criteria."
                    : "You haven't submitted any requests yet. Create a new request to get started."}
                </p>
                {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setDateFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Request Dialog */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRequestType 
                ? `New ${selectedRequestType.name}`
                : 'New Request'
              }
            </DialogTitle>
            <DialogDescription>
              {selectedRequestType 
                ? 'Fill in the details for your request'
                : 'Select the type of request you want to submit'
              }
            </DialogDescription>
          </DialogHeader>
          
          {!selectedRequestType ? (
            <div className="mt-4">
              <Accordion type="single" collapsible defaultValue="timeAndLeave">
                {Object.entries(requestTypes).map(([category, types]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-lg font-medium">
                      {getCategoryName(category)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        {types.map(type => (
                          <div 
                            key={type.id}
                            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleInitiateRequest(type.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded">
                                {type.icon}
                              </div>
                              <div>
                                <h3 className="font-medium">{type.name}</h3>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              {/* Dynamic form based on request type */}
              {selectedRequestType.id === 'leave' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Leave Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual Leave</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                          <SelectItem value="bereavement">Bereavement Leave</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Return Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Total Days</label>
                      <Input type="number" disabled />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason/Comments</label>
                    <Textarea placeholder="Provide any additional details or reason for your leave request" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Handover Notes</label>
                    <Textarea placeholder="Provide handover information for your team during your absence" />
                  </div>
                </div>
              )}
              
              {selectedRequestType.id === 'equipment' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Equipment Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="laptop">Laptop</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="monitor">Monitor</SelectItem>
                          <SelectItem value="keyboard">Keyboard</SelectItem>
                          <SelectItem value="mouse">Mouse</SelectItem>
                          <SelectItem value="headset">Headset</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Urgency</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for Request</label>
                    <Textarea placeholder="Explain why you need this equipment" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specifications/Requirements</label>
                    <Textarea placeholder="Describe any specific requirements or specifications needed" />
                  </div>
                </div>
              )}
              
              {/* Generic form for other request types */}
              {!['leave', 'equipment'].includes(selectedRequestType.id) && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Request Title</label>
                    <Input placeholder="Enter a title for your request" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Provide details about your request" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Needed</label>
                      <Input type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments (Optional)</label>
                <Input type="file" />
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            {selectedRequestType ? (
              <>
                <Button variant="outline" onClick={() => setSelectedRequestType(null)}>
                  Back
                </Button>
                <Button onClick={handleSubmitRequest}>
                  Submit Request
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                {selectedRequest.id} • {selectedRequest.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{selectedRequest.title}</h3>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(selectedRequest.submittedDate)}
                  </p>
                </div>
                <Badge variant="outline">{getCategoryName(selectedRequest.category)}</Badge>
              </div>
              
              <div className="border-t border-b py-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedRequest.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  {Object.entries(selectedRequest.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">
                        {typeof value === 'boolean' 
                          ? (value ? 'Yes' : 'No')
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Status Information</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  {selectedRequest.status === 'pending' ? (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Pending approval from {selectedRequest.approver}</span>
                    </div>
                  ) : selectedRequest.status === 'approved' ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-2" />
                      <span>Approved by {selectedRequest.approver} on {formatDate(selectedRequest.decisionDate)}</span>
                    </div>
                  ) : selectedRequest.status === 'rejected' ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-red-600">
                        <X className="h-5 w-5 mr-2" />
                        <span>Rejected by {selectedRequest.approver} on {formatDate(selectedRequest.decisionDate)}</span>
                      </div>
                      {selectedRequest.rejectionReason && (
                        <div className="mt-2 pl-7">
                          <p className="text-gray-600">Reason: {selectedRequest.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <div className="w-full flex justify-between">
                <div>
                  {selectedRequest.status === 'pending' && (
                    <Button variant="outline" className="text-red-600">
                      Cancel Request
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
} 
