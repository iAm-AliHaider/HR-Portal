import { supabase } from '@/lib/supabase/client';

// Types for calendar service
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'interview' | 'deadline' | 'review' | 'event';
  description?: string;
  location?: string;
  attendees?: string[];
  created_by?: string;
  created_at?: Date;
}

// Mock data for when Supabase isn't available
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    type: 'meeting',
    description: 'Weekly team sync meeting',
    location: 'Conference Room A',
    attendees: ['john@example.com', 'sarah@example.com']
  },
  {
    id: '2',
    title: 'Interview: Senior Developer',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(13, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(14, 0, 0, 0);
      return date;
    })(),
    type: 'interview',
    description: 'Interview with candidate for senior developer position',
    location: 'Meeting Room B',
    attendees: ['hr@example.com', 'tech.lead@example.com']
  },
  {
    id: '3',
    title: 'Project Deadline',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      date.setHours(17, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      date.setHours(17, 0, 0, 0);
      return date;
    })(),
    type: 'deadline',
    description: 'Submission deadline for Phase 1',
    location: '',
    attendees: []
  },
  {
    id: '4',
    title: 'Performance Review',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      date.setHours(14, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      date.setHours(15, 0, 0, 0);
      return date;
    })(),
    type: 'review',
    description: 'Quarterly performance review',
    location: 'HR Office',
    attendees: ['manager@example.com']
  },
  {
    id: '5',
    title: 'Offsite Team Building',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      date.setHours(9, 0, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      date.setHours(17, 0, 0, 0);
      return date;
    })(),
    type: 'event',
    description: 'Full day team building activity',
    location: 'Downtown Recreation Center',
    attendees: ['team@example.com']
  }
];

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  try {
    // Test if supabase client has been properly initialized
    return !!supabase && !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  } catch (e) {
    return false;
  }
};

// In-memory storage for mock data when Supabase isn't available
let inMemoryEvents = [...mockEvents];

export const CalendarService = {
  // Get all events for a user
  async getEvents(): Promise<CalendarEvent[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start', { ascending: true });

        if (error) throw error;

        return data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          attendees: event.attendees || []
        }));
      } catch (error) {
        console.error('Error fetching events:', error);
        return inMemoryEvents;
      }
    } else {
      console.log('Using mock calendar data (Supabase not configured)');
      return inMemoryEvents;
    }
  },

  // Get events for a specific date range
  async getEventsByDateRange(start: Date, end: Date): Promise<CalendarEvent[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('start', start.toISOString())
          .lte('end', end.toISOString())
          .order('start', { ascending: true });

        if (error) throw error;

        return data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          attendees: event.attendees || []
        }));
      } catch (error) {
        console.error('Error fetching events by date range:', error);
        return inMemoryEvents.filter(event => 
          event.start >= start && event.end <= end
        );
      }
    } else {
      return inMemoryEvents.filter(event => 
        event.start >= start && event.end <= end
      );
    }
  },

  // Create a new event
  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .insert({
            ...event,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        return {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
          attendees: data.attendees || []
        };
      } catch (error) {
        console.error('Error creating event:', error);
        return null;
      }
    } else {
      // Create mock implementation
      const newEvent: CalendarEvent = {
        ...event,
        id: `mock-${Date.now()}`,
        created_at: new Date()
      };
      inMemoryEvents.push(newEvent);
      return newEvent;
    }
  },

  // Update an existing event
  async updateEvent(event: CalendarEvent): Promise<CalendarEvent | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('events')
          .update({
            ...event,
            start: event.start.toISOString(),
            end: event.end.toISOString()
          })
          .eq('id', event.id)
          .select()
          .single();

        if (error) throw error;

        return {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
          attendees: data.attendees || []
        };
      } catch (error) {
        console.error('Error updating event:', error);
        return null;
      }
    } else {
      // Update in mock implementation
      const index = inMemoryEvents.findIndex(e => e.id === event.id);
      if (index >= 0) {
        inMemoryEvents[index] = event;
        return event;
      }
      return null;
    }
  },

  // Delete an event
  async deleteEvent(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error deleting event:', error);
        return false;
      }
    } else {
      // Delete in mock implementation
      const initialLength = inMemoryEvents.length;
      inMemoryEvents = inMemoryEvents.filter(e => e.id !== id);
      return inMemoryEvents.length < initialLength;
    }
  },

  // Sync with external calendar (like Google)
  async syncWithExternalCalendar(userId: string): Promise<boolean> {
    try {
      // This would integrate with external calendar APIs
      // For example, Google Calendar API
      
      // Mock implementation for now
      console.log(`Syncing calendar for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error syncing with external calendar:', error);
      return false;
    }
  }
} 