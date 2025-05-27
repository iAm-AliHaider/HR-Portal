import React, { useState } from 'react';
import Head from 'next/head';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Calendar, 
  Cpu, 
  Package, 
  Search,
  Filter,
  Plus,
  Download,
  PaperclipIcon,
  MessageSquare,
  Calendar as CalendarIcon,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for requests
const initialRequests = [
  { 
    id: 'REQ-2023-001', 
    type: 'Leave', 
    subType: 'Annual Leave',
    status: 'Approved', 
    priority: 'Normal',
    submittedDate: '2023-12-15', 
    lastUpdated: '2023-12-16',
    details: 'Annual leave from December 24-26, 2023 for holiday travel', 
    attachments: [
      { name: 'travel_itinerary.pdf', url: '#' }
    ], 
    history: [
      { date: '2023-12-15T10:30:00', action: 'Request Submitted', actor: 'Alex Johnson', notes: 'Initial submission' },
      { date: '2023-12-16T14:20:00', action: 'Request Approved', actor: 'Sarah Wilson (Manager)', notes: 'Approved as requested' }
    ],
    startDate: '2023-12-24',
    endDate: '2023-12-26',
    approver: 'Sarah Wilson'
  },
  { 
    id: 'REQ-2023-002', 
    type: 'Equipment', 
    subType: 'Computer Hardware',
    status: 'Pending', 
    priority: 'High',
    submittedDate: '2023-12-18', 
    lastUpdated: '2023-12-18',
    details: 'Request for a new laptop. Current device is experiencing frequent crashes and affecting productivity.', 
    attachments: [
      { name: 'system_diagnostics.pdf', url: '#' },
      { name: 'laptop_specs.pdf', url: '#' }
    ], 
    history: [
      { date: '2023-12-18T09:15:00', action: 'Request Submitted', actor: 'Alex Johnson', notes: 'Initial submission' }
    ],
    approver: 'IT Department'
  },
  { 
    id: 'REQ-2023-003', 
    type: 'Leave', 
    subType: 'Sick Leave',
    status: 'Completed', 
    priority: 'Normal',
    submittedDate: '2023-11-02', 
    lastUpdated: '2023-11-05',
    details: 'Sick leave due to flu. Doctor recommended 3 days of rest.', 
    attachments: [
      { name: 'medical_certificate.pdf', url: '#' }
    ], 
    history: [
      { date: '2023-11-02T08:30:00', action: 'Request Submitted', actor: 'Alex Johnson', notes: 'Initial submission' },
      { date: '2023-11-02T10:45:00', action: 'Request Approved', actor: 'Sarah Wilson (Manager)', notes: 'Approved based on medical certificate' },
      { date: '2023-11-05T09:00:00', action: 'Request Completed', actor: 'System', notes: 'Automatically marked as completed after end date' }
    ],
    startDate: '2023-11-02',
    endDate: '2023-11-04',
    approver: 'Sarah Wilson'
  },
  { 
    id: 'REQ-2023-004', 
    type: 'Document', 
    subType: 'Certificate',
    status: 'Rejected', 
    priority: 'Normal',
    submittedDate: '2023-10-25', 
    lastUpdated: '2023-10-26',
    details: 'Request for employment verification letter for mortgage application', 
    attachments: [], 
    history: [
      { date: '2023-10-25T14:20:00', action: 'Request Submitted', actor: 'Alex Johnson', notes: 'Initial submission' },
      { date: '2023-10-26T11:30:00', action: 'Request Rejected', actor: 'HR Department', notes: 'Please use the dedicated form for employment verification requests. The form is available in the HR portal.' }
    ],
    approver: 'HR Department'
  },
  { 
    id: 'REQ-2023-005', 
    type: 'Other', 
    subType: 'Parking Permit',
    status: 'Pending', 
    priority: 'Low',
    submittedDate: '2023-12-19', 
    lastUpdated: '2023-12-19',
    details: 'Request for parking permit in the company garage starting January 2024', 
    attachments: [
      { name: 'vehicle_registration.pdf', url: '#' }
    ], 
    history: [
      { date: '2023-12-19T15:45:00', action: 'Request Submitted', actor: 'Alex Johnson', notes: 'Initial submission' }
    ],
    approver: 'Facilities Management'
  }
];

// Request type options for new requests
const requestTypes = [
  { 
    value: 'Leave', 
    label: 'Leave Request',
    subTypes: [
      { value: 'Annual Leave', label: 'Annual Leave' },
      { value: 'Sick Leave', label: 'Sick Leave' },
      { value: 'Personal Leave', label: 'Personal Leave' },
      { value: 'Bereavement', label: 'Bereavement' },
      { value: 'Study Leave', label: 'Study Leave' }
    ]
  },
  { 
    value: 'Equipment', 
    label: 'Equipment Request',
    subTypes: [
      { value: 'Computer Hardware', label: 'Computer Hardware' },
      { value: 'Computer Software', label: 'Computer Software' },
      { value: 'Office Supplies', label: 'Office Supplies' },
      { value: 'Furniture', label: 'Furniture' }
    ]
  },
  { 
    value: 'Document', 
    label: 'Document Request',
    subTypes: [
      { value: 'Certificate', label: 'Certificate' },
      { value: 'Letter', label: 'Letter' },
      { value: 'Contract', label: 'Contract' }
    ]
  },
  { 
    value: 'Other', 
    label: 'Other Request',
    subTypes: [
      { value: 'Parking Permit', label: 'Parking Permit' },
      { value: 'Building Access', label: 'Building Access' },
      { value: 'Travel Approval', label: 'Travel Approval' },
      { value: 'Reimbursement', label: 'Reimbursement' }
    ]
  }
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  
  // New request form state
  const [newRequest, setNewRequest] = useState({
    type: '',
    subType: '',
    details: '',
    priority: 'Normal',
    attachments: [],
    startDate: '',
    endDate: ''
  });
  
  // Form for adding comments/attachments to existing requests
  const [newComment, setNewComment] = useState('');
  const [newAttachment, setNewAttachment] = useState({ name: '', url: '' });

  // Get available sub-types based on selected type
  const getSubTypes = () => {
    const selectedType = requestTypes.find(type => type.value === newRequest.type);
    return selectedType ? selectedType.subTypes : [];
  };

  // Filter requests based on active tab and search query
  const filteredRequests = requests.filter(request => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'pending' && request.status === 'Pending') ||
      (activeTab === 'approved' && request.status === 'Approved') ||
      (activeTab === 'completed' && request.status === 'Completed') ||
      (activeTab === 'rejected' && request.status === 'Rejected') ||
      (activeTab === 'leave' && request.type === 'Leave') ||
      (activeTab === 'equipment' && request.type === 'Equipment') ||
      (activeTab === 'document' && request.type === 'Document') ||
      (activeTab === 'other' && request.type === 'Other');
    
    const matchesSearch = 
      searchQuery === '' ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.subType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Handle creating a new request
  const handleCreateRequest = () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `REQ-${new Date().getFullYear()}-${(requests.length + 1).toString().padStart(3, '0')}`;
    
    const createdRequest = {
      id: newId,
      type: newRequest.type,
      subType: newRequest.subType,
      status: 'Pending',
      priority: newRequest.priority,
      submittedDate: today,
      lastUpdated: today,
      details: newRequest.details,
      attachments: newRequest.attachments,
      history: [
        { 
          date: new Date().toISOString(), 
          action: 'Request Submitted', 
          actor: 'Alex Johnson', 
          notes: 'Initial submission'
        }
      ],
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      approver: getApproverByType(newRequest.type)
    };
    
    setRequests([createdRequest, ...requests]);
    setIsNewRequestOpen(false);
    resetNewRequestForm();
  };

  // Get approver based on request type
  const getApproverByType = (type) => {
    switch(type) {
      case 'Leave': return 'Sarah Wilson (Manager)';
      case 'Equipment': return 'IT Department';
      case 'Document': return 'HR Department';
      default: return 'Department Head';
    }
  };

  // Handle adding a comment to a request
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedRequest) return;
    
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        const today = new Date().toISOString();
        return {
          ...req,
          lastUpdated: today.split('T')[0],
          history: [
            ...req.history,
            {
              date: today,
              action: 'Comment Added',
              actor: 'Alex Johnson',
              notes: newComment
            }
          ]
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setNewComment('');
    // Update the selected request to show the new comment
    setSelectedRequest(updatedRequests.find(req => req.id === selectedRequest.id));
  };

  // Handle adding an attachment to a request
  const handleAddAttachment = () => {
    if (!newAttachment.name.trim() || !selectedRequest) return;
    
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        const today = new Date().toISOString();
        return {
          ...req,
          lastUpdated: today.split('T')[0],
          attachments: [...req.attachments, newAttachment],
          history: [
            ...req.history,
            {
              date: today,
              action: 'Attachment Added',
              actor: 'Alex Johnson',
              notes: `Added attachment: ${newAttachment.name}`
            }
          ]
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setNewAttachment({ name: '', url: '' });
    // Update the selected request to show the new attachment
    setSelectedRequest(updatedRequests.find(req => req.id === selectedRequest.id));
  };

  // Handle cancelling a request
  const handleCancelRequest = () => {
    if (!selectedRequest) return;
    
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        const today = new Date().toISOString();
        return {
          ...req,
          status: 'Cancelled',
          lastUpdated: today.split('T')[0],
          history: [
            ...req.history,
            {
              date: today,
              action: 'Request Cancelled',
              actor: 'Alex Johnson',
              notes: 'Request cancelled by employee'
            }
          ]
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    // Update the selected request to show the cancelled status
    setSelectedRequest(updatedRequests.find(req => req.id === selectedRequest.id));
  };

  // Reset new request form
  const resetNewRequestForm = () => {
    setNewRequest({
      type: '',
      subType: '',
      details: '',
      priority: 'Normal',
      attachments: [],
      startDate: '',
      endDate: ''
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format date and time for display
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Get priority badge with appropriate styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Normal':
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case 'Low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  // Get request type icon
  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'Leave':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'Equipment':
        return <Cpu className="h-5 w-5 text-purple-500" />;
      case 'Document':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <>
      <Head>
        <title>My Requests | HR Portal</title>
        <meta name="description" content="View and manage your requests" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container px-4 sm:px-6 mx-auto py-6 space-y-6 max-w-full lg:max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
            <p className="text-gray-600">View and manage your requests and approvals</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search requests..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsNewRequestOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full min-w-max">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="leave">Leave</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="pt-4">
            {filteredRequests.length > 0 ? (
              <div className="space-y-4 overflow-x-auto">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-1 flex justify-center">
                          {getRequestTypeIcon(request.type)}
                        </div>
                        
                        <div className="md:col-span-5">
                          <div className="flex flex-col">
                            <div className="flex items-center flex-wrap gap-1">
                              <span className="font-medium mr-2">{request.id}</span>
                              {getStatusBadge(request.status)}
                              <span className="mx-2 hidden sm:inline">•</span>
                              {getPriorityBadge(request.priority)}
                            </div>
                            <p className="text-sm text-gray-500">{request.subType}</p>
                            <p className="text-sm line-clamp-1">{request.details}</p>
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 text-sm">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <p className="text-gray-500">Submitted:</p>
                              <p>{formatDate(request.submittedDate)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Updated:</p>
                              <p>{formatDate(request.lastUpdated)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 flex flex-col sm:flex-row justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedRequest(request)}
                            className="w-full sm:w-auto"
                          >
                            View Details
                          </Button>
                          
                          {request.status === 'Pending' && (
                            <Button 
                              variant="outline" 
                              className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                              onClick={() => {
                                setSelectedRequest(request);
                                setTimeout(() => handleCancelRequest(), 100);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery 
                    ? "No requests match your search criteria. Try adjusting your search terms."
                    : "You don't have any requests in this category yet. Create a new request to get started."}
                </p>
                <Button 
                  className="mt-6"
                  onClick={() => setIsNewRequestOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Request
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="max-w-4xl w-[95%]">
            {selectedRequest && (
              <>
                <DialogHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <DialogTitle>Request {selectedRequest.id}</DialogTitle>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div>
                      {selectedRequest.status === 'Pending' && (
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                          onClick={handleCancelRequest}
                        >
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </div>
                  <DialogDescription>
                    Submitted on {formatDate(selectedRequest.submittedDate)} • Last updated on {formatDate(selectedRequest.lastUpdated)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Request Information */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Request Details</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          {getRequestTypeIcon(selectedRequest.type)}
                          <span className="ml-2 font-medium">{selectedRequest.type} - {selectedRequest.subType}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedRequest.details}</p>
                      </div>
                    </div>
                    
                    {/* Dates (if available) */}
                    {selectedRequest.startDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Date Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Start Date</p>
                              <p className="font-medium">{formatDate(selectedRequest.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">End Date</p>
                              <p className="font-medium">{formatDate(selectedRequest.endDate)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Attachments */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Attachments ({selectedRequest.attachments.length})</h3>
                      {selectedRequest.attachments.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-md space-y-2">
                          {selectedRequest.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                <span>{attachment.name}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <a href={attachment.url} download>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
          ))}
        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                          No attachments
                        </div>
                      )}
                      
                      {/* Add attachment form */}
                      {selectedRequest.status === 'Pending' && (
                        <div className="mt-2 flex gap-2">
                          <Input
                            placeholder="Attachment name"
                            value={newAttachment.name}
                            onChange={(e) => setNewAttachment({...newAttachment, name: e.target.value})}
                            className="flex-1"
                          />
                          <Input
                            placeholder="URL (optional)"
                            value={newAttachment.url}
                            onChange={(e) => setNewAttachment({...newAttachment, url: e.target.value})}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleAddAttachment}
                            disabled={!newAttachment.name.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Add comment (if request is still active) */}
                    {['Pending', 'Approved'].includes(selectedRequest.status) && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Add Comment</h3>
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add a comment to this request..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            className="self-end"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Timeline and Status Information */}
                  <div className="space-y-6">
                    {/* Status Information */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Status Information</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Priority</p>
                            <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Approver</p>
                            <p className="font-medium">{selectedRequest.approver}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Activity Timeline</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-4">
                          {selectedRequest.history.map((event, index) => (
                            <div key={index} className="relative pl-6 pb-4">
                              {/* Timeline connector */}
                              {index < selectedRequest.history.length - 1 && (
                                <div className="absolute left-[9px] top-[24px] bottom-0 w-0.5 bg-gray-200" />
                              )}
                              
                              {/* Status indicator */}
                              <div className="absolute left-0 top-1">
                                {event.action.includes('Approved') ? (
                                  <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                                ) : event.action.includes('Rejected') ? (
                                  <XCircle className="h-4.5 w-4.5 text-red-500" />
                                ) : event.action.includes('Cancelled') ? (
                                  <XCircle className="h-4.5 w-4.5 text-gray-500" />
                                ) : event.action.includes('Completed') ? (
                                  <CheckCircle className="h-4.5 w-4.5 text-blue-500" />
                                ) : (
                                  <Clock className="h-4.5 w-4.5 text-gray-400" />
                                )}
                              </div>
                              
                              {/* Event content */}
                              <div>
                                <p className="font-medium text-sm">{event.action}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDateTime(event.date)} by {event.actor}
                                </p>
                                {event.notes && (
                                  <p className="mt-1 text-sm text-gray-600">{event.notes}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* New Request Dialog */}
        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogContent className="max-w-2xl w-[95%]">
            <DialogHeader>
              <DialogTitle>Create New Request</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit a new request.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="request-type">Request Type</Label>
                  <Select 
                    value={newRequest.type}
                    onValueChange={(value) => setNewRequest({...newRequest, type: value, subType: ''})}
                  >
                    <SelectTrigger id="request-type">
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="request-subtype">Sub Type</Label>
                  <Select 
                    value={newRequest.subType}
                    onValueChange={(value) => setNewRequest({...newRequest, subType: value})}
                    disabled={!newRequest.type}
                  >
                    <SelectTrigger id="request-subtype">
                      <SelectValue placeholder="Select sub type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubTypes().map((subType) => (
                        <SelectItem key={subType.value} value={subType.value}>
                          {subType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="request-details">Request Details</Label>
                <Textarea 
                  id="request-details"
                  placeholder="Provide details about your request..."
                  value={newRequest.details}
                  onChange={(e) => setNewRequest({...newRequest, details: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="request-priority">Priority</Label>
                  <Select 
                    value={newRequest.priority}
                    onValueChange={(value) => setNewRequest({...newRequest, priority: value})}
                  >
                    <SelectTrigger id="request-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <Input 
                    id="attachment"
                    placeholder="Enter attachment name"
                    onChange={(e) => {
                      if (e.target.value) {
                        setNewRequest({
                          ...newRequest, 
                          attachments: [{name: e.target.value, url: '#'}]
                        });
                      } else {
                        setNewRequest({...newRequest, attachments: []});
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Date fields for leave requests */}
              {newRequest.type === 'Leave' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input 
                      id="start-date"
                      type="date"
                      value={newRequest.startDate}
                      onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                    />
              </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input 
                      id="end-date"
                      type="date"
                      value={newRequest.endDate}
                      onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                    />
            </div>
          </div>
        )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsNewRequestOpen(false);
                resetNewRequestForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRequest}
                disabled={!newRequest.type || !newRequest.subType || !newRequest.details}
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
} 