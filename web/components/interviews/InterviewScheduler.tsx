import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/useApi';

interface Interviewer {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  availability?: string[];
}

interface InterviewSchedulerProps {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  stage: 'initial' | 'technical' | 'culture' | 'final';
  onSchedule: (data: any) => Promise<void>;
  existingInterview?: any;
  interviewers?: Interviewer[];
}

// Mock interview durations
const interviewDurations = [
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' }
];

// Mock interview types based on stage
const interviewTypes = {
  initial: [
    { value: 'phone', label: 'Phone Screen' },
    { value: 'video', label: 'Video Call' }
  ],
  technical: [
    { value: 'coding', label: 'Coding Assessment' },
    { value: 'system-design', label: 'System Design' },
    { value: 'technical-discussion', label: 'Technical Discussion' },
    { value: 'pair-programming', label: 'Pair Programming' }
  ],
  culture: [
    { value: 'team-fit', label: 'Team Fit' },
    { value: 'values', label: 'Values & Culture' },
    { value: 'behavioral', label: 'Behavioral Interview' }
  ],
  final: [
    { value: 'executive', label: 'Executive Interview' },
    { value: 'team', label: 'Team Panel' },
    { value: 'final-technical', label: 'Final Technical Review' }
  ]
};

// Mock interview locations
const interviewLocations = [
  { value: 'video-zoom', label: 'Zoom Call' },
  { value: 'video-teams', label: 'Microsoft Teams' },
  { value: 'video-meet', label: 'Google Meet' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'onsite-conference', label: 'Conference Room' },
  { value: 'onsite-office', label: 'Office Building' }
];

export default function InterviewScheduler({
  applicationId,
  candidateName,
  jobTitle,
  stage,
  onSchedule,
  existingInterview,
  interviewers = []
}: InterviewSchedulerProps) {
  const toast = useToast();
  
  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [interviewType, setInterviewType] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [sendCalendarInvite, setSendCalendarInvite] = useState(true);
  const [sendCandidateReminder, setSendCandidateReminder] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load existing interview if present
  useEffect(() => {
    if (existingInterview) {
      if (existingInterview.date) setDate(existingInterview.date);
      if (existingInterview.time) setTime(existingInterview.time);
      if (existingInterview.duration) setDuration(existingInterview.duration);
      if (existingInterview.type) setInterviewType(existingInterview.type);
      if (existingInterview.location) setLocation(existingInterview.location);
      if (existingInterview.notes) setNotes(existingInterview.notes);
      if (existingInterview.interviewers && Array.isArray(existingInterview.interviewers)) {
        setSelectedInterviewers(existingInterview.interviewers.map((i: any) => i.id));
      }
    } else {
      // Set default interview type based on stage
      if (interviewTypes[stage] && interviewTypes[stage].length > 0) {
        setInterviewType(interviewTypes[stage][0].value);
      }
      
      // Set default location
      setLocation('video-zoom');
    }
  }, [existingInterview, stage]);
  
  // Toggle interviewer selection
  const toggleInterviewer = (interviewerId: string) => {
    setSelectedInterviewers(prev => 
      prev.includes(interviewerId)
        ? prev.filter(id => id !== interviewerId)
        : [...prev, interviewerId]
    );
  };
  
  // Validate form
  const validateForm = () => {
    if (!date) {
      toast.error('Please select an interview date');
      return false;
    }
    
    if (!time) {
      toast.error('Please select an interview time');
      return false;
    }
    
    if (!interviewType) {
      toast.error('Please select an interview type');
      return false;
    }
    
    if (!location) {
      toast.error('Please select an interview location');
      return false;
    }
    
    if (selectedInterviewers.length === 0) {
      toast.error('Please select at least one interviewer');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSchedule = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const interviewData = {
        applicationId,
        candidateName,
        jobTitle,
        stage,
        date,
        time,
        duration: parseInt(duration),
        type: interviewType,
        location,
        notes,
        interviewers: interviewers.filter(i => selectedInterviewers.includes(i.id)),
        sendCalendarInvite,
        sendCandidateReminder,
        scheduledAt: new Date().toISOString()
      };
      
      await onSchedule(interviewData);
      toast.success('Interview scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule interview');
      console.error('Error scheduling interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get interview type label
  const getInterviewTypeLabel = (value: string) => {
    const types = interviewTypes[stage];
    return types?.find(t => t.value === value)?.label || value;
  };
  
  // Get location label
  const getLocationLabel = (value: string) => {
    return interviewLocations.find(l => l.value === value)?.label || value;
  };
  
  // Check if interviewer is available (placeholder)
  const isInterviewerAvailable = (interviewer: Interviewer) => {
    if (!date || !time) return true;
    if (!interviewer.availability) return true;
    
    // This would be replaced with actual availability checking logic
    return true;
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md shadow-sm border p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-xl font-semibold">{candidateName}</h2>
            <p className="text-gray-500">{jobTitle} - {stage.charAt(0).toUpperCase() + stage.slice(1)} Interview</p>
          </div>
          {existingInterview && (
            <div className="mt-2 md:mt-0 px-4 py-2 bg-blue-50 rounded-md border border-blue-200 text-blue-800">
              Interview Scheduled
            </div>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="interview-date">Date</Label>
              <Input
                id="interview-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="interview-time">Time</Label>
              <Input
                id="interview-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="interview-duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="interview-duration" className="mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {interviewDurations.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="interview-type">Interview Type</Label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger id="interview-type" className="mt-1">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  {interviewTypes[stage]?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="interview-location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="interview-location" className="mt-1">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {interviewLocations.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="interviewers">Select Interviewers</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {interviewers.length === 0 ? (
                <p className="text-gray-500 col-span-2">No interviewers available</p>
              ) : (
                interviewers.map((interviewer) => (
                  <div 
                    key={interviewer.id} 
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedInterviewers.includes(interviewer.id) ? 'bg-blue-50 border-blue-300' : ''
                    } ${!isInterviewerAvailable(interviewer) ? 'opacity-50' : ''}`}
                    onClick={() => isInterviewerAvailable(interviewer) && toggleInterviewer(interviewer.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Checkbox 
                          id={`interviewer-${interviewer.id}`}
                          checked={selectedInterviewers.includes(interviewer.id)}
                          onCheckedChange={() => isInterviewerAvailable(interviewer) && toggleInterviewer(interviewer.id)}
                          disabled={!isInterviewerAvailable(interviewer)}
                        />
                      </div>
                      <div>
                        <Label 
                          htmlFor={`interviewer-${interviewer.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {interviewer.name}
                        </Label>
                        <p className="text-sm text-gray-500">{interviewer.role} · {interviewer.department}</p>
                        {!isInterviewerAvailable(interviewer) && (
                          <span className="text-xs text-red-600">Not available at selected time</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="interview-notes">Interview Instructions / Notes</Label>
            <Textarea
              id="interview-notes"
              placeholder="Add any specific instructions for the interviewers or candidate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="send-calendar" 
                checked={sendCalendarInvite}
                onCheckedChange={(checked) => setSendCalendarInvite(checked as boolean)}
              />
              <Label htmlFor="send-calendar" className="cursor-pointer">
                Send calendar invites to all participants
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="send-reminder" 
                checked={sendCandidateReminder}
                onCheckedChange={(checked) => setSendCandidateReminder(checked as boolean)}
              />
              <Label htmlFor="send-reminder" className="cursor-pointer">
                Send reminder to candidate 24 hours before interview
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3 border-t pt-6">
          <Button variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSchedule}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : existingInterview ? 'Update Interview' : 'Schedule Interview'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Preview */}
      {date && time && interviewType && location && selectedInterviewers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">{new Date(date).toLocaleDateString()} at {time}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{interviewDurations.find(d => d.value === duration)?.label}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Interview Type</p>
                  <p className="font-medium">{getInterviewTypeLabel(interviewType)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{getLocationLabel(location)}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Interviewers</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedInterviewers.map(id => {
                      const interviewer = interviewers.find(i => i.id === id);
                      return interviewer ? (
                        <span 
                          key={id}
                          className="px-2 py-1 bg-white border rounded-md text-sm"
                        >
                          {interviewer.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
