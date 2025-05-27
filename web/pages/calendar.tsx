import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCalendar } from '@/hooks/useCalendar';
import CalendarEventModal from '@/components/ui/CalendarEventModal';
import { CalendarEvent } from '@/services/calendar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useRouter } from 'next/router';
import { shouldBypassAuth } from '@/lib/auth';

// Helper function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get all days to display in month view (including prev/next month days)
const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const days = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // Next month days
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }
  
  return days;
};

// Helper function to check if a date has events
const getEventsForDate = (date: Date, events: CalendarEvent[]) => {
  return events.filter(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};

// Helper function to get hour range for day/week view
const getHourRange = () => {
  const hours = [];
  for (let i = 7; i <= 19; i++) { // 7 AM to 7 PM
    hours.push(i);
  }
  return hours;
};

// Helper function to format time
const formatTime = (hours: number) => {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours} ${ampm}`;
};

// Helper to get event position in day view
const getEventPosition = (event: CalendarEvent) => {
  const startHour = event.start.getHours() + (event.start.getMinutes() / 60);
  const endHour = event.end.getHours() + (event.end.getMinutes() / 60);
  const duration = endHour - startHour;
  
  // Calculate position relative to our hour range (7AM-7PM)
  const top = (startHour - 7) * 60; // 60px per hour
  const height = duration * 60;
  
  return { top, height };
};

// Component for the event pill/card
const EventCard = ({ event, onClick, compact = false }: { event: CalendarEvent, onClick: (event: CalendarEvent) => void, compact?: boolean }) => {
  const typeColors = {
    meeting: 'bg-blue-100 text-blue-800 border-blue-300',
    interview: 'bg-purple-100 text-purple-800 border-purple-300',
    deadline: 'bg-red-100 text-red-800 border-red-300',
    review: 'bg-amber-100 text-amber-800 border-amber-300',
    event: 'bg-green-100 text-green-800 border-green-300'
  };
  
  const colorClass = typeColors[event.type] || 'bg-gray-100 text-gray-800 border-gray-300';
  
  if (compact) {
    return (
      <div 
        className={`px-1 py-0.5 text-xs truncate rounded border ${colorClass} cursor-pointer hover:opacity-90`}
        onClick={() => onClick(event)}
      >
        {event.title}
      </div>
    );
  }
  
  return (
    <div 
      className={`px-2 py-1 rounded border ${colorClass} cursor-pointer hover:opacity-90`}
      onClick={() => onClick(event)}
    >
      <div className="font-medium text-sm truncate">{event.title}</div>
      <div className="text-xs">
        {event.start.getHours()}:{event.start.getMinutes().toString().padStart(2, '0')} - 
        {event.end.getHours()}:{event.end.getMinutes().toString().padStart(2, '0')}
      </div>
    </div>
  );
};

// Main Calendar Component
const Calendar = () => {
  const { role } = useAuth();
  const { events, loading, error, addEvent, updateEvent, deleteEvent } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthDays = getMonthDays(year, month);
  const hourRange = getHourRange();
  
  // Function to navigate to prev/next month
  const navigatePrevMonth = () => {
    setCurrentDate(prev => {
      // Create new date to avoid mutating state directly
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const navigateNextMonth = () => {
    setCurrentDate(prev => {
      // Create new date to avoid mutating state directly
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (view === 'month') {
      setView('day');
    }
  };
  
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsEditMode(false);
    setShowEventModal(true);
  };
  
  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setShowEventModal(true);
    setShowEventDetails(false);
  };
  
  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id'> | CalendarEvent) => {
    if ('id' in eventData) {
      await updateEvent(eventData);
    } else {
      await addEvent(eventData);
    }
  };
  
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
      setShowEventDetails(false);
    }
  };
  
  // Titles for each view
  const viewTitles = {
    month: `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`,
    week: `Week of ${new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    ).toLocaleDateString()} - ${new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() + 6
    ).toLocaleDateString()}`,
    day: selectedDate.toLocaleDateString('default', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  };

  return (
    <div className="space-y-6">
      {/* Title and Controls */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Manage your schedule and events</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleCreateEvent}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={navigatePrevMonth}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateNextMonth}
          >
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
          <Button variant="secondary" size="sm" onClick={navigateToday}>
            Today
          </Button>
          <h2 className="text-xl font-semibold ml-4">{viewTitles[view]}</h2>
        </div>
        
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button 
            className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setView('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setView('day')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <Card variant="bordered">
        {loading ? (
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">Loading your calendar...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Month View */}
            {view === 'month' && (
              <div className="grid grid-cols-7 h-[700px]">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-gray-500 border-b">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {monthDays.map((day, i) => {
                  const isToday = new Date().toDateString() === day.date.toDateString();
                  const isSelected = selectedDate.toDateString() === day.date.toDateString();
                  const dayEvents = getEventsForDate(day.date, events);
                  
                  return (
                    <div
                      key={i}
                      className={`p-2 border-b border-r h-[100px] overflow-y-auto ${
                        day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                      } ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                      onClick={() => handleDateClick(day.date)}
                    >
                      <div className={`text-right mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <EventCard key={event.id} event={event} onClick={handleSelectEvent} compact />
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Day View */}
            {view === 'day' && (
              <div className="flex flex-col h-[700px] overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 flex border-b">
                  <div className="w-16 p-2 border-r"></div>
                  <div className="flex-1 p-2 text-center font-medium">
                    {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                
                <div className="relative flex flex-1">
                  {/* Time labels */}
                  <div className="w-16 flex-shrink-0 border-r">
                    {hourRange.map(hour => (
                      <div key={hour} className="h-[60px] border-b px-2 text-xs text-right text-gray-500">
                        {formatTime(hour)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Day column with events */}
                  <div className="flex-1 relative">
                    {/* Hour markers */}
                    {hourRange.map(hour => (
                      <div key={hour} className="h-[60px] border-b border-gray-200"></div>
                    ))}
                    
                    {/* Events */}
                    {getEventsForDate(selectedDate, events).map(event => {
                      const { top, height } = getEventPosition(event);
                      return (
                        <div
                          key={event.id}
                          className="absolute left-1 right-1 rounded overflow-hidden"
                          style={{ top: `${top}px`, height: `${height}px`, minHeight: '20px' }}
                          onClick={() => handleSelectEvent(event)}
                        >
                          <EventCard event={event} onClick={handleSelectEvent} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Week View */}
            {view === 'week' && (
              <div className="flex flex-col h-[700px] overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 flex border-b">
                  <div className="w-16 p-2 border-r"></div>
                  
                  {/* Day headers for the week */}
                  {Array.from({ length: 7 }).map((_, i) => {
                    const day = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate() - currentDate.getDay() + i
                    );
                    const isToday = new Date().toDateString() === day.toDateString();
                    
                    return (
                      <div 
                        key={i} 
                        className={`flex-1 p-2 text-center ${isToday ? 'bg-blue-50 font-bold' : ''}`}
                      >
                        <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
                        <div className={`text-sm ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                          {day.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="relative flex flex-1">
                  {/* Time labels */}
                  <div className="w-16 flex-shrink-0 border-r">
                    {hourRange.map(hour => (
                      <div key={hour} className="h-[60px] border-b px-2 text-xs text-right text-gray-500">
                        {formatTime(hour)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Days columns */}
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate() - currentDate.getDay() + dayIndex
                    );
                    const dayEvents = getEventsForDate(day, events);
                    
                    return (
                      <div key={dayIndex} className="flex-1 relative border-r">
                        {/* Hour markers */}
                        {hourRange.map(hour => (
                          <div key={hour} className="h-[60px] border-b border-gray-200"></div>
                        ))}
                        
                        {/* Events */}
                        {dayEvents.map(event => {
                          const { top, height } = getEventPosition(event);
                          return (
                            <div
                              key={event.id}
                              className="absolute left-1 right-1 rounded overflow-hidden"
                              style={{ top: `${top}px`, height: `${height}px`, minHeight: '20px' }}
                            >
                              <EventCard event={event} onClick={handleSelectEvent} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <button 
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {selectedEvent.start.toLocaleString('default', { 
                      weekday: 'long',
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })} - {selectedEvent.end.toLocaleString('default', { 
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Attendees</h4>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs mr-2">
                            {attendee.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-600">{attendee}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowEventDetails(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleEditEvent(selectedEvent)}
                >
                  Edit Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Create/Edit Modal */}
      <CalendarEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={selectedEvent || undefined}
        isEditMode={isEditMode}
      />
    </div>
  );
};

// Wrapped with layout
const CalendarPage = () => {
  const router = useRouter();
  
  // Allow direct access without authentication
  const allowAccess = shouldBypassAuth(router.query);
  
  useEffect(() => {
    if (!allowAccess) {
      router.push('/login?redirect=/calendar');
    }
  }, [allowAccess, router]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <Calendar />
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage; 
