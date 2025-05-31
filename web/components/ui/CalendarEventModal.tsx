import React, { useState, useEffect } from "react";

import { CalendarEvent } from "@/services/calendar";

import { Button } from "./button";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id"> | CalendarEvent) => void;
  event?: CalendarEvent;
  isEditMode?: boolean;
}

const eventTypes = [
  { value: "meeting", label: "Meeting" },
  { value: "interview", label: "Interview" },
  { value: "deadline", label: "Deadline" },
  { value: "review", label: "Review" },
  { value: "event", label: "Event" },
];

const CalendarEventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  isEditMode = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<CalendarEvent["type"]>("meeting");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format date and time for input fields
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatTimeForInput = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  // Initialize form with event data if provided
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setLocation(event.location || "");
      setType(event.type);
      setStartDate(formatDateForInput(event.start));
      setStartTime(formatTimeForInput(event.start));
      setEndDate(formatDateForInput(event.end));
      setEndTime(formatTimeForInput(event.end));
      setAttendees(event.attendees?.join(", ") || "");
    } else {
      // Default to current date and time for new events
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      setTitle("");
      setDescription("");
      setLocation("");
      setType("meeting");
      setStartDate(formatDateForInput(now));
      setStartTime(formatTimeForInput(now));
      setEndDate(formatDateForInput(oneHourLater));
      setEndTime(formatTimeForInput(oneHourLater));
      setAttendees("");
    }
  }, [event, isOpen]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!endTime) {
      newErrors.endTime = "End time is required";
    }

    // Check if end date/time is after start date/time
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const attendeesList = attendees
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    const eventData: Omit<CalendarEvent, "id"> = {
      title,
      description,
      location,
      type,
      start,
      end,
      attendees: attendeesList,
    };

    if (isEditMode && event?.id) {
      onSave({ ...eventData, id: event.id });
    } else {
      onSave(eventData);
    }

    onClose();
  };

  // Stop propagation to prevent closing modal when clicking inside
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={handleModalClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Event title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type*
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as CalendarEvent["type"])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date*
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time*
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.startTime ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startTime}
                    </p>
                  )}
                </div>
              </div>

              {/* End Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date*
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time*
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.endTime ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Event location (optional)"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Event description (optional)"
                />
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendees
                </label>
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Comma-separated email addresses (optional)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter email addresses separated by commas
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button variant="default" size="sm" type="submit">
                {isEditMode ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventModal;
