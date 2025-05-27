import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, MessageSquare, Calendar, FileText, PlusCircle, 
  CheckCircle, Clock, Search, Filter, ArrowUpRight, ThumbsUp, 
  Send, Paperclip, Link2, Smile
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TeamCollaboration() {
  const [activeTab, setActiveTab] = useState('teamchat');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  
  // Mock team members data
  const teamMembers = [
    { id: 1, name: 'Sarah Johnson', role: 'Team Lead', avatarUrl: '/avatars/avatar-1.jpg', status: 'online' },
    { id: 2, name: 'Michael Chen', role: 'Senior Developer', avatarUrl: '/avatars/avatar-2.jpg', status: 'online' },
    { id: 3, name: 'Priya Patel', role: 'UX Designer', avatarUrl: '/avatars/avatar-3.jpg', status: 'away' },
    { id: 4, name: 'James Wilson', role: 'Developer', avatarUrl: '/avatars/avatar-4.jpg', status: 'offline' },
    { id: 5, name: 'Emma Rodriguez', role: 'Product Manager', avatarUrl: '/avatars/avatar-5.jpg', status: 'online' }
  ];
  
  // Mock team chat messages
  const [teamChatMessages, setTeamChatMessages] = useState([
    { 
      id: 1, 
      sender: 'Sarah Johnson', 
      senderAvatar: '/avatars/avatar-1.jpg', 
      content: 'Good morning team! Let\'s discuss our goals for this week.', 
      timestamp: '09:15 AM',
      reactions: [
        { emoji: '👍', count: 3 },
        { emoji: '🙌', count: 2 }
      ]
    },
    { 
      id: 2, 
      sender: 'Michael Chen', 
      senderAvatar: '/avatars/avatar-2.jpg', 
      content: 'I\'ve finished the API integration we discussed yesterday. Ready for testing.', 
      timestamp: '09:22 AM',
      reactions: [
        { emoji: '🎉', count: 4 }
      ]
    },
    { 
      id: 3, 
      sender: 'Priya Patel', 
      senderAvatar: '/avatars/avatar-3.jpg', 
      content: 'I\'ve shared the latest design mockups in our shared drive. Can everyone please review and provide feedback by EOD?', 
      timestamp: '09:35 AM',
      reactions: []
    }
  ]);
  
  // Mock team events
  const teamEvents = [
    { id: 1, title: 'Sprint Planning', date: '2023-12-06 10:00 AM', location: 'Conference Room A', attendees: [1, 2, 3, 4, 5] },
    { id: 2, title: 'UI/UX Review', date: '2023-12-07 02:00 PM', location: 'Virtual - Zoom', attendees: [1, 3, 5] },
    { id: 3, title: 'Team Lunch', date: '2023-12-08 12:30 PM', location: 'Cafeteria', attendees: [1, 2, 3, 4, 5] },
    { id: 4, title: 'Code Review Session', date: '2023-12-08 03:00 PM', location: 'Virtual - Teams', attendees: [1, 2, 4] }
  ];
  
  // Mock shared documents
  const sharedDocuments = [
    { id: 1, title: 'Project Requirements', type: 'PDF', lastUpdated: '2023-12-01', updatedBy: 'Emma Rodriguez' },
    { id: 2, title: 'Sprint Backlog', type: 'Spreadsheet', lastUpdated: '2023-12-04', updatedBy: 'Sarah Johnson' },
    { id: 3, title: 'UI Component Library', type: 'Design', lastUpdated: '2023-12-02', updatedBy: 'Priya Patel' },
    { id: 4, title: 'API Documentation', type: 'Document', lastUpdated: '2023-12-03', updatedBy: 'Michael Chen' },
    { id: 5, title: 'Meeting Notes', type: 'Document', lastUpdated: '2023-12-05', updatedBy: 'James Wilson' }
  ];
  
  // Handle sending a new message in team chat
  const handleSendMessage = () => {
    if (!newMessageContent.trim()) return;
    
    const newMessage = {
      id: teamChatMessages.length + 1,
      sender: 'You', // In a real app, this would be the current user's name
      senderAvatar: '/avatars/avatar-4.jpg', // In a real app, this would be the current user's avatar
      content: newMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };
    
    setTeamChatMessages([...teamChatMessages, newMessage]);
    setNewMessageContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'online':
        return <span className="h-2.5 w-2.5 bg-green-500 rounded-full block"></span>;
      case 'away':
        return <span className="h-2.5 w-2.5 bg-yellow-500 rounded-full block"></span>;
      case 'offline':
        return <span className="h-2.5 w-2.5 bg-gray-400 rounded-full block"></span>;
      default:
        return <span className="h-2.5 w-2.5 bg-gray-400 rounded-full block"></span>;
    }
  };
  
  return (
    <DashboardLayout title="Team Collaboration" subtitle="Connect and collaborate with your team members">
      <Head>
        <title>Team Collaboration | HR Portal</title>
        <meta name="description" content="Connect and collaborate with your team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container px-4 sm:px-6 mx-auto py-6 space-y-6 max-w-full lg:max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Collaboration</h1>
            <p className="text-gray-600">Connect and collaborate with your team members</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsNewEventDialogOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              New Event
            </Button>
            
            <Button className="w-full sm:w-auto" onClick={() => setIsNewMessageDialogOpen(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Team Members */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Your team and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg text-gray-600">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        {getStatusIndicator(member.status)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                View Team Directory
              </Button>
            </CardFooter>
          </Card>

          {/* Main Collaboration Area */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="teamchat" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="teamchat">Team Chat</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="documents">Shared Documents</TabsTrigger>
              </TabsList>
              
              {/* Team Chat */}
              <TabsContent value="teamchat">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Team Chat</CardTitle>
                    <CardDescription>Communicate with your team in real-time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {teamChatMessages.map(message => (
                        <div key={message.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                            {message.senderAvatar ? (
                              <img src={message.senderAvatar} alt={message.sender} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm text-gray-600 flex items-center justify-center h-full">
                                {message.sender.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium">{message.sender}</span>
                              <span className="text-xs text-gray-500 ml-2">{message.timestamp}</span>
                            </div>
                            <p className="text-gray-800 mt-1">{message.content}</p>
                            {message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {message.reactions.map((reaction, idx) => (
                                  <div key={idx} className="bg-gray-100 rounded-full px-2 py-0.5 text-xs flex items-center">
                                    <span>{reaction.emoji}</span>
                                    <span className="ml-1 text-gray-600">{reaction.count}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input 
                            placeholder="Type your message..."
                            value={newMessageContent}
                            onChange={(e) => setNewMessageContent(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="pr-24"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Paperclip className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Smile className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Team Events */}
              <TabsContent value="events">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Team Events</CardTitle>
                    <CardDescription>Upcoming meetings and team activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamEvents.map(event => (
                        <div key={event.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <p className="text-gray-600">{formatDate(event.date)}</p>
                              <p className="text-gray-500 text-sm mt-1">Location: {event.location}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              {event.attendees.length} Attendees
                            </Badge>
                          </div>
                          <div className="mt-3 flex">
                            <div className="flex -space-x-2 overflow-hidden">
                              {event.attendees.slice(0, 4).map(attendeeId => {
                                const attendee = teamMembers.find(m => m.id === attendeeId);
                                return (
                                  <div key={attendeeId} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                                    {attendee?.avatarUrl ? (
                                      <img src={attendee.avatarUrl} alt={attendee.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <span className="flex items-center justify-center h-full w-full text-xs">
                                        {attendee?.name.charAt(0) || '?'}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                              {event.attendees.length > 4 && (
                                <div className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center bg-gray-100 text-xs">
                                  +{event.attendees.length - 4}
                                </div>
                              )}
                            </div>
                            <div className="ml-auto space-x-2">
                              <Button variant="outline" size="sm">Details</Button>
                              <Button size="sm">Join</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setIsNewEventDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Event
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Shared Documents */}
              <TabsContent value="documents">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Shared Documents</CardTitle>
                    <CardDescription>Access and collaborate on team documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sharedDocuments.map(doc => (
                        <div key={doc.id} className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-blue-600 mr-3" />
                              <div>
                                <h3 className="font-medium">{doc.title}</h3>
                                <p className="text-xs text-gray-500">
                                  {doc.type} • Updated {formatDate(doc.lastUpdated)} by {doc.updatedBy}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Link2 className="h-4 w-4 mr-2" />
                      Open Shared Drive
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* New Message Dialog */}
      <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a message to a team member or create a group chat
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Type your message here..." rows={4} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsNewMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle sending direct message
              setIsNewMessageDialogOpen(false);
            }}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Event Dialog */}
      <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Schedule a team meeting or event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input placeholder="Enter event title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="Enter location" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe the event..." rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Participants</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsNewEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle creating new event
              setIsNewEventDialogOpen(false);
            }}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 
