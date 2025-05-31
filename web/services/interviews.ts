import { supabase } from "../lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import {
  Interview,
  InterviewFeedback,
  Application,
} from "../../packages/types";
import { updateApplication } from "./applications";
import { BookingService } from "./booking";

// Mock interviews data for development
const mockInterviews: Interview[] = [
  {
    id: "interview1",
    org_id: "org1",
    application_id: "app1",
    stage_id: "stage3",
    title: "Technical Interview - Sarah Johnson",
    description: "Technical assessment focusing on React and Node.js skills",
    type: "technical",
    interviewer_ids: ["int1", "int2"],
    scheduled_at: "2024-01-25T10:00:00Z",
    duration: 90,
    meeting_url: "https://zoom.us/j/123456789",
    status: "scheduled",
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "interview2",
    org_id: "org1",
    application_id: "app2",
    stage_id: "stage2",
    title: "Phone Screening - Michael Chen",
    description: "Initial phone screening with HR",
    type: "phone",
    interviewer_ids: ["int2"],
    scheduled_at: "2024-01-24T14:00:00Z",
    duration: 30,
    status: "completed",
    overall_rating: 4,
    notes: "Great communication skills, strong background",
    created_at: "2024-01-22T09:00:00Z",
  },
];

export async function getInterviews(org_id: string): Promise<Interview[]> {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("org_id", org_id)
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("Supabase query failed, returning mock data:", error);
    return mockInterviews.filter((interview) => interview.org_id === org_id);
  }
}

export async function getInterviewsByApplicationId(
  applicationId: string,
): Promise<Interview[]> {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("application_id", applicationId)
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("Supabase query failed, returning mock data:", error);
    return mockInterviews.filter(
      (interview) => interview.application_id === applicationId,
    );
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("Supabase query failed, returning mock data:", error);
    return mockInterviews.find((interview) => interview.id === id) || null;
  }
}

export async function createInterview(
  interview: Partial<Interview>,
): Promise<Interview> {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .insert([interview])
      .select()
      .single();

    if (error) throw error;

    // Update application status if needed
    if (interview.application_id) {
      await updateApplication(interview.application_id, {
        status: "interview",
        last_activity_date: new Date().toISOString(),
      });
    }

    return data;
  } catch (error) {
    console.warn("Supabase insert failed, creating mock interview:", error);

    const newInterview: Interview = {
      id: "interview" + Date.now(),
      org_id: interview.org_id || "org1",
      application_id: interview.application_id || "",
      title: interview.title || "Interview",
      type: interview.type || "video",
      interviewer_ids: interview.interviewer_ids || [],
      scheduled_at: interview.scheduled_at || new Date().toISOString(),
      duration: interview.duration || 60,
      status: "scheduled",
      created_at: new Date().toISOString(),
      ...interview,
    } as Interview;

    mockInterviews.push(newInterview);

    // Update application status
    if (interview.application_id) {
      try {
        await updateApplication(interview.application_id, {
          status: "interview",
          last_activity_date: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Failed to update application status:", err);
      }
    }

    return newInterview;
  }
}

export async function updateInterview(
  id: string,
  updates: Partial<Interview>,
): Promise<Interview> {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("Supabase update failed, updating mock data:", error);

    const index = mockInterviews.findIndex((interview) => interview.id === id);
    if (index !== -1) {
      mockInterviews[index] = { ...mockInterviews[index], ...updates };
      return mockInterviews[index];
    }

    throw new Error("Interview not found");
  }
}

export async function deleteInterview(id: string): Promise<void> {
  try {
    // Cancel any associated bookings first
    await BookingService.cancelBookingsForInterview(id, "system");

    const { error } = await supabase.from("interviews").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.warn("Supabase delete failed, removing from mock data:", error);

    const index = mockInterviews.findIndex((interview) => interview.id === id);
    if (index !== -1) {
      mockInterviews.splice(index, 1);
    }
  }
}

// Enhanced scheduling function with booking integration
export async function scheduleInterview(
  interview: Partial<Interview> & {
    booking_options?: {
      room_id?: string;
      asset_ids?: string[];
      booked_by: string;
    };
  },
): Promise<Interview> {
  try {
    const newInterview: Interview = {
      ...interview,
      id: interview.id || uuidv4(),
      org_id: interview.org_id || "org1",
      status: "scheduled",
      created_at: new Date().toISOString(),
      interviewer_ids: interview.interviewer_ids || [],
      duration: interview.duration || 60,
    } as Interview;

    // Create the interview first
    const createdInterview = await createInterview(newInterview);

    // Handle room and asset bookings for in-person interviews
    if (interview.type === "in_person" && interview.booking_options) {
      try {
        const startTime = new Date(interview.scheduled_at!);
        const endTime = new Date(
          startTime.getTime() + (interview.duration || 60) * 60000,
        );

        const bookings = await BookingService.bookResourcesForInterview(
          createdInterview.id,
          {
            room_id: interview.booking_options.room_id,
            asset_ids: interview.booking_options.asset_ids,
            title: interview.title || "Interview",
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            booked_by: interview.booking_options.booked_by,
            org_id: interview.org_id!,
            attendee_count: interview.interviewer_ids?.length || 1,
          },
        );

        // Update interview with booking references
        const bookingUpdates: Partial<Interview> = {};
        if (bookings.roomBooking) {
          bookingUpdates.meeting_room_id = bookings.roomBooking.room_id;
          bookingUpdates.location = `Room booked: ${bookings.roomBooking.id}`;
        }
        if (bookings.assetBookings.length > 0) {
          bookingUpdates.asset_booking_ids = bookings.assetBookings.map(
            (b) => b.id,
          );
        }

        if (Object.keys(bookingUpdates).length > 0) {
          return await updateInterview(createdInterview.id, bookingUpdates);
        }
      } catch (bookingError) {
        console.warn("Failed to create bookings for interview:", bookingError);
        // Continue with interview creation even if booking fails
      }
    }

    return createdInterview;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    throw error;
  }
}

export async function rescheduleInterview(
  id: string,
  newScheduledAt: string,
  reason?: string,
  bookingOptions?: {
    room_id?: string;
    asset_ids?: string[];
    booked_by: string;
  },
): Promise<Interview> {
  try {
    // Get current interview details
    const currentInterview = await getInterviewById(id);
    if (!currentInterview) {
      throw new Error("Interview not found");
    }

    // Cancel existing bookings
    await BookingService.cancelBookingsForInterview(
      id,
      bookingOptions?.booked_by || "system",
    );

    // Update interview
    const updates: Partial<Interview> = {
      scheduled_at: newScheduledAt,
      status: "rescheduled",
      reschedule_count: (currentInterview.reschedule_count || 0) + 1,
      last_rescheduled_at: new Date().toISOString(),
      notes: reason ? `Rescheduled: ${reason}` : "Interview rescheduled",
      meeting_room_id: undefined, // Clear previous room booking
      asset_booking_ids: [], // Clear previous asset bookings
    };

    const updatedInterview = await updateInterview(id, updates);

    // Create new bookings if it's an in-person interview
    if (currentInterview.type === "in_person" && bookingOptions) {
      try {
        const startTime = new Date(newScheduledAt);
        const endTime = new Date(
          startTime.getTime() + (currentInterview.duration || 60) * 60000,
        );

        const bookings = await BookingService.bookResourcesForInterview(id, {
          room_id: bookingOptions.room_id,
          asset_ids: bookingOptions.asset_ids,
          title: currentInterview.title,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          booked_by: bookingOptions.booked_by,
          org_id: currentInterview.org_id,
          attendee_count: currentInterview.interviewer_ids?.length || 1,
        });

        // Update interview with new booking references
        const bookingUpdates: Partial<Interview> = {};
        if (bookings.roomBooking) {
          bookingUpdates.meeting_room_id = bookings.roomBooking.room_id;
          bookingUpdates.location = `Room booked: ${bookings.roomBooking.id}`;
        }
        if (bookings.assetBookings.length > 0) {
          bookingUpdates.asset_booking_ids = bookings.assetBookings.map(
            (b) => b.id,
          );
        }

        if (Object.keys(bookingUpdates).length > 0) {
          return await updateInterview(id, bookingUpdates);
        }
      } catch (bookingError) {
        console.warn(
          "Failed to create new bookings for rescheduled interview:",
          bookingError,
        );
      }
    }

    return updatedInterview;
  } catch (error) {
    console.error("Error rescheduling interview:", error);
    throw error;
  }
}

export async function completeInterview(
  id: string,
  rating?: number,
  notes?: string,
): Promise<Interview> {
  const updates: Partial<Interview> = {
    status: "completed",
    overall_rating: rating,
    notes: notes,
  };

  return updateInterview(id, updates);
}

export async function cancelInterview(
  id: string,
  reason?: string,
  cancelledBy?: string,
): Promise<Interview> {
  // Cancel associated bookings
  await BookingService.cancelBookingsForInterview(id, cancelledBy || "system");

  const updates: Partial<Interview> = {
    status: "cancelled",
    notes: reason ? `Cancelled: ${reason}` : "Interview cancelled",
  };

  return updateInterview(id, updates);
}

export async function recordNoShow(id: string): Promise<Interview> {
  const updates: Partial<Interview> = {
    status: "no_show",
    notes: "Candidate did not show up for interview",
  };

  return updateInterview(id, updates);
}

export async function getInterviewFeedback(
  interviewId: string,
): Promise<InterviewFeedback[]> {
  try {
    const { data, error } = await supabase
      .from("interview_feedback")
      .select("*")
      .eq("interview_id", interviewId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("Supabase query failed, returning empty feedback:", error);
    return [];
  }
}

export async function submitInterviewFeedback(
  feedback: Partial<InterviewFeedback>,
): Promise<InterviewFeedback> {
  try {
    const { data, error } = await supabase
      .from("interview_feedback")
      .insert([feedback])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("Supabase insert failed:", error);

    const newFeedback: InterviewFeedback = {
      id: "feedback" + Date.now(),
      interview_id: feedback.interview_id || "",
      interviewer_id: feedback.interviewer_id || "",
      submitted_at: new Date().toISOString(),
      overall_rating: feedback.overall_rating || 3,
      recommend_hiring: feedback.recommend_hiring || "neutral",
      feedback_sections: feedback.feedback_sections || [],
      ...feedback,
    } as InterviewFeedback;

    return newFeedback;
  }
}

export async function getInterviewsForInterviewer(
  interviewerId: string,
): Promise<Interview[]> {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .contains("interviewer_ids", [interviewerId])
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("Supabase query failed, returning mock data:", error);
    return mockInterviews.filter((interview) =>
      interview.interviewer_ids.includes(interviewerId),
    );
  }
}

export async function getUpcomingInterviews(
  orgId: string,
  days: number = 7,
): Promise<Interview[]> {
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("org_id", orgId)
      .gte("scheduled_at", new Date().toISOString())
      .lte("scheduled_at", endDate.toISOString())
      .in("status", ["scheduled", "rescheduled"])
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn("Supabase query failed, returning mock data:", error);
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return mockInterviews.filter((interview) => {
      const scheduledAt = new Date(interview.scheduled_at);
      return (
        interview.org_id === orgId &&
        scheduledAt >= now &&
        scheduledAt <= endDate &&
        ["scheduled", "rescheduled"].includes(interview.status)
      );
    });
  }
}

// Utility functions
export function getRecommendationOptions() {
  return [
    { value: "strong_yes", label: "Strong Yes", color: "green" },
    { value: "yes", label: "Yes", color: "green" },
    { value: "neutral", label: "Neutral", color: "yellow" },
    { value: "no", label: "No", color: "red" },
    { value: "strong_no", label: "Strong No", color: "red" },
  ];
}

export function getInterviewTypeOptions() {
  return [
    {
      value: "phone",
      label: "Phone Interview",
      description: "Voice-only interview conducted over phone",
    },
    {
      value: "video",
      label: "Video Interview",
      description: "Video call interview using Zoom, Teams, etc.",
    },
    {
      value: "in_person",
      label: "In-Person Interview",
      description: "Face-to-face interview at office location",
    },
    {
      value: "technical",
      label: "Technical Interview",
      description: "Technical assessment with coding/practical tasks",
    },
    {
      value: "panel",
      label: "Panel Interview",
      description: "Interview conducted by multiple interviewers",
    },
  ];
}

export function getInterviewStatusOptions() {
  return [
    { value: "scheduled", label: "Scheduled", color: "blue" },
    { value: "completed", label: "Completed", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
    { value: "rescheduled", label: "Rescheduled", color: "orange" },
    { value: "no_show", label: "No Show", color: "red" },
  ];
}

// Get available meeting rooms for interview scheduling
export async function getAvailableRoomsForInterview(
  orgId: string,
  startTime: string,
  endTime: string,
  capacity?: number,
): Promise<Array<{ room: any; available: boolean }>> {
  try {
    const rooms = await BookingService.getMeetingRooms(orgId, {
      is_active: true,
      capacity_min: capacity,
    });

    const roomAvailability = await Promise.all(
      rooms.map(async (room) => {
        const available = await BookingService.checkRoomAvailability(
          room.id,
          startTime,
          endTime,
        );
        return { room, available };
      }),
    );

    return roomAvailability;
  } catch (error) {
    console.error("Error checking room availability:", error);
    return [];
  }
}

// Get available assets for interview
export async function getAvailableAssetsForInterview(
  orgId: string,
  startTime: string,
  endTime: string,
  category?: string,
): Promise<Array<{ asset: any; available: boolean }>> {
  try {
    const assets = await BookingService.getAssets(orgId, {
      status: "available",
      category,
    });

    const assetAvailability = await Promise.all(
      assets.map(async (asset) => {
        const available = await BookingService.checkAssetAvailability(
          asset.id,
          startTime,
          endTime,
        );
        return { asset, available };
      }),
    );

    return assetAvailability;
  } catch (error) {
    console.error("Error checking asset availability:", error);
    return [];
  }
}

export async function addInterviewFeedback(
  interviewId: string,
  feedback: Partial<InterviewFeedback>,
): Promise<Interview> {
  const interview = await getInterviewById(interviewId);
  if (!interview) {
    throw new Error("Interview not found");
  }

  const newFeedback: InterviewFeedback = {
    id: uuidv4(),
    interview_id: interviewId,
    interviewer_id: feedback.interviewer_id || "",
    submitted_at: new Date().toISOString(),
    overall_rating: feedback.overall_rating || 0,
    recommend_hiring: feedback.recommend_hiring || "neutral",
    feedback_sections: feedback.feedback_sections || [],
    ...feedback,
  };

  const updatedFeedback = [...(interview.feedback || []), newFeedback];

  return updateInterview(interviewId, {
    feedback: updatedFeedback,
    status: "completed",
  });
}
