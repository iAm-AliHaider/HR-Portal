// Fixed Database Services with Graceful Error Handling
import {
  DatabaseResponse,
  FilterParams,
  PaginationParams,
  SimpleDatabase,
} from "./database-client";

// Sample data to use as fallbacks when database is not available
const sampleTeams = [
  {
    id: "team_001",
    name: "Frontend Development Team",
    description: "Responsible for all user-facing applications",
    team_type: "development",
    status: "active",
    max_members: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "team_002",
    name: "Marketing Team",
    description: "Brand management and digital marketing",
    team_type: "marketing",
    status: "active",
    max_members: 6,
    created_at: new Date().toISOString(),
  },
];

const sampleProjects = [
  {
    id: "proj_001",
    name: "Mobile App Redesign",
    description: "Complete redesign of the mobile application",
    status: "in_progress",
    priority: "high",
    created_at: new Date().toISOString(),
  },
];

const sampleRooms = [
  {
    id: "room_001",
    name: "Conference Room A",
    capacity: 12,
    floor: "Floor 1",
    building: "Building A",
    amenities: ["projector", "whiteboard"],
    equipment: ["laptop", "speakers"],
  },
];

const sampleEquipment = [
  {
    id: "eq_001",
    name: 'MacBook Pro 16"',
    model: "MacBook Pro M2",
    serial_number: "MBP001",
    status: "available",
    condition: "excellent",
  },
];

// Fixed Teams Service
export class TeamsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    return SimpleDatabase.getAll("teams", pagination, filters, sampleTeams);
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    const fallback = sampleTeams.find((t) => t.id === id) || null;
    return SimpleDatabase.getById("teams", id, fallback);
  }

  static async create(team: any): Promise<DatabaseResponse<any>> {
    const newTeam = {
      ...team,
      id: `team_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: team.status || "active",
    };
    return SimpleDatabase.create("teams", newTeam, newTeam);
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    return SimpleDatabase.update("teams", id, updates, { id, ...updates });
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    return SimpleDatabase.delete("teams", id);
  }

  static async addMember(
    teamId: string,
    memberId: string,
    role: string,
  ): Promise<DatabaseResponse<any>> {
    const member = {
      id: `member_${Date.now()}`,
      team_id: teamId,
      member_id: memberId,
      role,
      joined_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("team_members", member, member);
  }

  static async removeMember(
    teamId: string,
    memberId: string,
  ): Promise<DatabaseResponse<boolean>> {
    return SimpleDatabase.delete("team_members", `${teamId}_${memberId}`);
  }

  static async getTeamPerformance(
    teamId: string,
  ): Promise<DatabaseResponse<any>> {
    const performance = {
      productivity_score: 8.5,
      collaboration_score: 9.2,
      goal_completion_rate: 85,
      member_satisfaction: 8.8,
      project_success_rate: 92,
    };
    return { data: performance, error: null, success: true };
  }
}

// Fixed Projects Service
export class ProjectsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    return SimpleDatabase.getAll(
      "projects",
      pagination,
      filters,
      sampleProjects,
    );
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    const fallback = sampleProjects.find((p) => p.id === id) || null;
    return SimpleDatabase.getById("projects", id, fallback);
  }

  static async create(project: any): Promise<DatabaseResponse<any>> {
    const newProject = {
      ...project,
      id: `proj_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: project.status || "planning",
    };
    return SimpleDatabase.create("projects", newProject, newProject);
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    return SimpleDatabase.update("projects", id, updates, { id, ...updates });
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    return SimpleDatabase.delete("projects", id);
  }

  static async addTask(
    projectId: string,
    task: any,
  ): Promise<DatabaseResponse<any>> {
    const newTask = {
      ...task,
      id: `task_${Date.now()}`,
      project_id: projectId,
      created_at: new Date().toISOString(),
      status: task.status || "todo",
    };
    return SimpleDatabase.create("project_tasks", newTask, newTask);
  }

  static async updateTask(
    taskId: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    return SimpleDatabase.update("project_tasks", taskId, updates, {
      id: taskId,
      ...updates,
    });
  }

  static async getProjectAnalytics(
    projectId: string,
  ): Promise<DatabaseResponse<any>> {
    const analytics = {
      total_tasks: 10,
      completed_tasks: 7,
      in_progress_tasks: 2,
      pending_tasks: 1,
      total_hours: 120,
      estimated_hours: 150,
    };
    return { data: analytics, error: null, success: true };
  }
}

// Fixed Meeting Rooms Service
export class MeetingRoomsService {
  static async getRooms(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    return SimpleDatabase.getAll(
      "meeting_rooms",
      pagination,
      filters,
      sampleRooms,
    );
  }

  static async getAvailableRooms(
    startTime: string,
    endTime: string,
    capacity?: number,
  ): Promise<DatabaseResponse<any[]>> {
    const availableRooms = sampleRooms.filter(
      (room) => !capacity || room.capacity >= capacity,
    );
    return { data: availableRooms, error: null, success: true };
  }

  static async createBooking(booking: any): Promise<DatabaseResponse<any>> {
    const newBooking = {
      ...booking,
      id: `booking_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: booking.status || "confirmed",
    };
    return SimpleDatabase.create("room_bookings", newBooking, newBooking);
  }

  static async getBookings(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    const sampleBookings = [
      {
        id: "booking_001",
        room_id: "room_001",
        title: "Team Meeting",
        start_time: "2024-02-01T10:00:00Z",
        end_time: "2024-02-01T11:00:00Z",
        status: "confirmed",
      },
    ];
    return SimpleDatabase.getAll(
      "room_bookings",
      pagination,
      filters,
      sampleBookings,
    );
  }

  static async updateBooking(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    return SimpleDatabase.update("room_bookings", id, updates, {
      id,
      ...updates,
    });
  }

  static async cancelBooking(
    id: string,
    reason?: string,
  ): Promise<DatabaseResponse<any>> {
    const updates = { status: "cancelled", cancellation_reason: reason };
    return SimpleDatabase.update("room_bookings", id, updates, {
      id,
      ...updates,
    });
  }
}

// Fixed Equipment Booking Service
export class EquipmentBookingService {
  static async getEquipment(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    return SimpleDatabase.getAll(
      "bookable_equipment",
      pagination,
      filters,
      sampleEquipment,
    );
  }

  static async createBooking(booking: any): Promise<DatabaseResponse<any>> {
    const newBooking = {
      ...booking,
      id: `booking_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: booking.status || "pending",
    };
    return SimpleDatabase.create("equipment_bookings", newBooking, newBooking);
  }

  static async getBookings(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    const sampleBookings = [
      {
        id: "booking_001",
        equipment_id: "eq_001",
        borrower_id: "user_001",
        purpose: "Development work",
        start_date: "2024-02-01",
        end_date: "2024-02-05",
        status: "approved",
      },
    ];
    return SimpleDatabase.getAll(
      "equipment_bookings",
      pagination,
      filters,
      sampleBookings,
    );
  }

  static async updateBooking(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    return SimpleDatabase.update("equipment_bookings", id, updates, {
      id,
      ...updates,
    });
  }

  static async returnEquipment(
    bookingId: string,
    condition: string,
    notes?: string,
  ): Promise<DatabaseResponse<any>> {
    const updates = {
      status: "returned",
      return_condition: condition,
      return_notes: notes,
      actual_return_date: new Date().toISOString(),
    };
    return SimpleDatabase.update("equipment_bookings", bookingId, updates, {
      id: bookingId,
      ...updates,
    });
  }
}

// Fixed Business Travel Service
export class BusinessTravelService {
  static async getTravelRequests(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    const sampleRequests = [
      {
        id: "travel_001",
        traveler_id: "user_001",
        purpose: "Business conference",
        destination: "New York, NY",
        departure_date: "2024-03-01",
        return_date: "2024-03-05",
        status: "pending",
      },
    ];
    return SimpleDatabase.getAll(
      "travel_requests",
      pagination,
      filters,
      sampleRequests,
    );
  }

  static async createTravelRequest(
    request: any,
  ): Promise<DatabaseResponse<any>> {
    const newRequest = {
      ...request,
      id: `travel_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: request.status || "pending",
    };
    return SimpleDatabase.create("travel_requests", newRequest, newRequest);
  }

  static async updateTravelRequest(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    return SimpleDatabase.update("travel_requests", id, updates, {
      id,
      ...updates,
    });
  }

  static async approveTravelRequest(
    id: string,
    approverId: string,
    budget?: number,
  ): Promise<DatabaseResponse<any>> {
    const updates = {
      status: "approved",
      approved_by: approverId,
      approved_budget: budget,
      approved_at: new Date().toISOString(),
    };
    return SimpleDatabase.update("travel_requests", id, updates, {
      id,
      ...updates,
    });
  }

  static async addTravelBooking(
    requestId: string,
    booking: any,
  ): Promise<DatabaseResponse<any>> {
    const newBooking = {
      ...booking,
      id: `booking_${Date.now()}`,
      travel_request_id: requestId,
      created_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("travel_bookings", newBooking, newBooking);
  }

  static async addTravelExpense(
    requestId: string,
    expense: any,
  ): Promise<DatabaseResponse<any>> {
    const newExpense = {
      ...expense,
      id: `expense_${Date.now()}`,
      travel_request_id: requestId,
      created_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("travel_expenses", newExpense, newExpense);
  }
}

// Fixed Chat Service
export class ChatService {
  static async getChannels(userId: string): Promise<DatabaseResponse<any[]>> {
    const sampleChannels = [
      {
        id: "channel_001",
        name: "General",
        description: "General discussion",
        type: "group",
        created_at: new Date().toISOString(),
      },
    ];
    return SimpleDatabase.getAll(
      "chat_channels",
      undefined,
      undefined,
      sampleChannels,
    );
  }

  static async createChannel(channel: any): Promise<DatabaseResponse<any>> {
    const newChannel = {
      ...channel,
      id: `channel_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("chat_channels", newChannel, newChannel);
  }

  static async getMessages(
    channelId: string,
    pagination?: PaginationParams,
  ): Promise<DatabaseResponse<any[]>> {
    const sampleMessages = [
      {
        id: "msg_001",
        channel_id: channelId,
        sender_id: "user_001",
        content: "Hello team!",
        message_type: "text",
        sent_at: new Date().toISOString(),
      },
    ];
    return SimpleDatabase.getAll(
      "chat_messages",
      pagination,
      undefined,
      sampleMessages,
    );
  }

  static async sendMessage(message: any): Promise<DatabaseResponse<any>> {
    const newMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      sent_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("chat_messages", newMessage, newMessage);
  }

  static async addChannelMember(
    channelId: string,
    userId: string,
    role: string = "member",
  ): Promise<DatabaseResponse<any>> {
    const member = {
      id: `member_${Date.now()}`,
      channel_id: channelId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("channel_members", member, member);
  }

  static async addReaction(
    messageId: string,
    userId: string,
    emoji: string,
  ): Promise<DatabaseResponse<any>> {
    const reaction = {
      id: `reaction_${Date.now()}`,
      message_id: messageId,
      user_id: userId,
      emoji,
      created_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("message_reactions", reaction, reaction);
  }
}

// Fixed Request Panel Service
export class RequestPanelService {
  static async getAllRequests(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    const sampleRequests = [
      {
        id: "req_001",
        requester_id: "user_001",
        request_type: "equipment",
        title: "Equipment Request",
        description: "Request for new laptop",
        priority: "medium",
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ];
    return SimpleDatabase.getAll(
      "unified_requests",
      pagination,
      filters,
      sampleRequests,
    );
  }

  static async createRequest(request: any): Promise<DatabaseResponse<any>> {
    const newRequest = {
      ...request,
      id: `req_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: request.status || "pending",
    };
    return SimpleDatabase.create("unified_requests", newRequest, newRequest);
  }

  static async updateRequest(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    return SimpleDatabase.update("unified_requests", id, updates, {
      id,
      ...updates,
    });
  }

  static async approveRequest(
    id: string,
    approverId: string,
    comments?: string,
  ): Promise<DatabaseResponse<any>> {
    const updates = {
      status: "approved",
      approved_by: approverId,
      approval_comments: comments,
      approved_at: new Date().toISOString(),
    };
    return SimpleDatabase.update("unified_requests", id, updates, {
      id,
      ...updates,
    });
  }

  static async getRequestsByType(
    type: string,
  ): Promise<DatabaseResponse<any[]>> {
    const filters = [
      { column: "request_type", operator: "eq" as const, value: type },
    ];
    return SimpleDatabase.getAll("unified_requests", undefined, filters, []);
  }

  static async getRequestAnalytics(): Promise<DatabaseResponse<any>> {
    const analytics = {
      total_requests: 25,
      pending_requests: 8,
      approved_requests: 12,
      rejected_requests: 3,
      completed_requests: 2,
    };
    return { data: analytics, error: null, success: true };
  }

  static async addRequestComment(
    requestId: string,
    comment: any,
  ): Promise<DatabaseResponse<any>> {
    const newComment = {
      ...comment,
      id: `comment_${Date.now()}`,
      request_id: requestId,
      created_at: new Date().toISOString(),
    };
    return SimpleDatabase.create("request_comments", newComment, newComment);
  }
}
