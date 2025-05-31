import { useState, useEffect } from "react";
import { CalendarService, CalendarEvent } from "../services/calendar";

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CalendarService.getEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to fetch events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events by date range
  const fetchEventsByDateRange = async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await CalendarService.getEventsByDateRange(start, end);
      setEvents(data);
    } catch (err) {
      setError("Failed to fetch events for date range");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new event
  const addEvent = async (event: Omit<CalendarEvent, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await CalendarService.createEvent(event);
      if (newEvent) {
        setEvents((prev) => [...prev, newEvent]);
      }
      return newEvent;
    } catch (err) {
      setError("Failed to add event");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (event: CalendarEvent) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await CalendarService.updateEvent(event);
      if (updatedEvent) {
        setEvents((prev) =>
          prev.map((e) => (e.id === event.id ? updatedEvent : e)),
        );
      }
      return updatedEvent;
    } catch (err) {
      setError("Failed to update event");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await CalendarService.deleteEvent(id);
      if (success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
      return success;
    } catch (err) {
      setError("Failed to delete event");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initialize by fetching all events
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventsByDateRange,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
