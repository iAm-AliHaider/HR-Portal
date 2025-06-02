// Mock Database Services for Testing CRUD Operations
// These services simulate database operations when Supabase is not configured

import { DatabaseResponse, FilterParams, PaginationParams } from "./services";

// Mock data storage
const mockTeams: any[] = [];
const mockProjects: any[] = [];
const mockMeetingRooms: any[] = [];
const mockEquipment: any[] = [];
const mockEquipmentBookings: any[] = [];
const mockTravelRequests: any[] = [];
const mockChatChannels: any[] = [];
const mockChatMessages: any[] = [];
const mockRequests: any[] = [];

// Helper to generate mock IDs
const generateId = () =>
  `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to simulate async operations
const delay = (ms: number = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock Teams Service
export class MockTeamsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    let teams = [...mockTeams];

    // Apply filters if provided
    if (filters) {
      filters.forEach((filter) => {
        teams = teams.filter((team) => {
          switch (filter.operator) {
            case "eq":
              return team[filter.column] === filter.value;
            case "like":
            case "ilike":
              return String(team[filter.column])
                .toLowerCase()
                .includes(String(filter.value).toLowerCase());
            default:
              return true;
          }
        });
      });
    }

    // Apply pagination
    if (pagination) {
      const start = (pagination.page - 1) * pagination.limit;
      const end = start + pagination.limit;
      teams = teams.slice(start, end);
    }

    return {
      data: teams,
      error: null,
      success: true,
      count: mockTeams.length,
    };
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    await delay();
    const team = mockTeams.find((t) => t.id === id);

    if (!team) {
      return {
        data: null,
        error: "Team not found",
        success: false,
      };
    }

    return {
      data: team,
      error: null,
      success: true,
    };
  }

  static async create(team: any): Promise<DatabaseResponse<any>> {
    await delay();

    const newTeam = {
      id: generateId(),
      ...team,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockTeams.push(newTeam);

    return {
      data: newTeam,
      error: null,
      success: true,
    };
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const index = mockTeams.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        data: null,
        error: "Team not found",
        success: false,
      };
    }

    mockTeams[index] = {
      ...mockTeams[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return {
      data: mockTeams[index],
      error: null,
      success: true,
    };
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    await delay();

    const index = mockTeams.findIndex((t) => t.id === id);
    if (index === -1) {
      return {
        data: null,
        error: "Team not found",
        success: false,
      };
    }

    mockTeams.splice(index, 1);

    return {
      data: true,
      error: null,
      success: true,
    };
  }

  static async addMember(
    teamId: string,
    memberId: string,
    role: string,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const newMember = {
      id: generateId(),
      team_id: teamId,
      member_id: memberId,
      role,
      joined_at: new Date().toISOString(),
    };

    return {
      data: newMember,
      error: null,
      success: true,
    };
  }

  static async removeMember(
    teamId: string,
    memberId: string,
  ): Promise<DatabaseResponse<boolean>> {
    await delay();

    return {
      data: true,
      error: null,
      success: true,
    };
  }

  static async getTeamPerformance(
    teamId: string,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: {
        productivity_score: 8.5,
        collaboration_score: 9.2,
        goal_completion_rate: 85,
        member_satisfaction: 8.8,
        project_success_rate: 92,
      },
      error: null,
      success: true,
    };
  }
}

// Mock Projects Service
export class MockProjectsService {
  static async getAll(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    let projects = [...mockProjects];

    if (pagination) {
      const start = (pagination.page - 1) * pagination.limit;
      const end = start + pagination.limit;
      projects = projects.slice(start, end);
    }

    return {
      data: projects,
      error: null,
      success: true,
      count: mockProjects.length,
    };
  }

  static async getById(id: string): Promise<DatabaseResponse<any>> {
    await delay();
    const project = mockProjects.find((p) => p.id === id);

    return {
      data: project || null,
      error: project ? null : "Project not found",
      success: !!project,
    };
  }

  static async create(project: any): Promise<DatabaseResponse<any>> {
    await delay();

    const newProject = {
      id: generateId(),
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockProjects.push(newProject);

    return {
      data: newProject,
      error: null,
      success: true,
    };
  }

  static async update(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        data: null,
        error: "Project not found",
        success: false,
      };
    }

    mockProjects[index] = {
      ...mockProjects[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return {
      data: mockProjects[index],
      error: null,
      success: true,
    };
  }

  static async delete(id: string): Promise<DatabaseResponse<boolean>> {
    await delay();

    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        data: null,
        error: "Project not found",
        success: false,
      };
    }

    mockProjects.splice(index, 1);

    return {
      data: true,
      error: null,
      success: true,
    };
  }

  static async addTask(
    projectId: string,
    task: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const newTask = {
      id: generateId(),
      project_id: projectId,
      ...task,
      created_at: new Date().toISOString(),
    };

    return {
      data: newTask,
      error: null,
      success: true,
    };
  }

  static async updateTask(
    taskId: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id: taskId, ...updates },
      error: null,
      success: true,
    };
  }

  static async getProjectAnalytics(
    projectId: string,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: {
        total_tasks: 10,
        completed_tasks: 7,
        in_progress_tasks: 2,
        pending_tasks: 1,
        total_hours: 120,
        estimated_hours: 150,
      },
      error: null,
      success: true,
    };
  }
}

// Mock Meeting Rooms Service
export class MockMeetingRoomsService {
  static async getRooms(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    const rooms = [
      {
        id: "room_001",
        name: "Conference Room A",
        capacity: 12,
        floor: "Floor 1",
        building: "Building A",
        amenities: ["projector", "whiteboard"],
        equipment: ["laptop", "speakers"],
      },
      {
        id: "room_002",
        name: "Meeting Room B",
        capacity: 6,
        floor: "Floor 1",
        building: "Building A",
        amenities: ["whiteboard"],
        equipment: ["phone"],
      },
    ];

    return {
      data: rooms,
      error: null,
      success: true,
      count: rooms.length,
    };
  }

  static async getAvailableRooms(
    startTime: string,
    endTime: string,
    capacity?: number,
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    const availableRooms = [
      {
        id: "room_001",
        name: "Conference Room A",
        capacity: 12,
        floor: "Floor 1",
        building: "Building A",
      },
    ];

    return {
      data: availableRooms,
      error: null,
      success: true,
    };
  }

  static async createBooking(booking: any): Promise<DatabaseResponse<any>> {
    await delay();

    const newBooking = {
      id: generateId(),
      ...booking,
      created_at: new Date().toISOString(),
    };

    return {
      data: newBooking,
      error: null,
      success: true,
    };
  }

  static async getBookings(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    const bookings = [
      {
        id: "booking_001",
        room_id: "room_001",
        title: "Team Meeting",
        start_time: "2024-02-01T10:00:00Z",
        end_time: "2024-02-01T11:00:00Z",
        organizer: { name: "John Doe", email: "john@example.com" },
      },
    ];

    return {
      data: bookings,
      error: null,
      success: true,
      count: bookings.length,
    };
  }

  static async updateBooking(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id, ...updates },
      error: null,
      success: true,
    };
  }

  static async cancelBooking(
    id: string,
    reason?: string,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id, status: "cancelled", reason },
      error: null,
      success: true,
    };
  }
}

// Mock Equipment Booking Service
export class MockEquipmentBookingService {
  static async getEquipment(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    const equipment = [
      {
        id: "eq_001",
        name: 'MacBook Pro 16"',
        model: "MacBook Pro M2",
        serial_number: "MBP001",
        status: "available",
        condition: "excellent",
      },
      {
        id: "eq_002",
        name: "Dell XPS 13",
        model: "XPS 13 9320",
        serial_number: "DELL001",
        status: "available",
        condition: "good",
      },
    ];

    return {
      data: equipment,
      error: null,
      success: true,
      count: equipment.length,
    };
  }

  static async createBooking(booking: any): Promise<DatabaseResponse<any>> {
    await delay();

    const newBooking = {
      id: generateId(),
      ...booking,
      created_at: new Date().toISOString(),
    };

    mockEquipmentBookings.push(newBooking);

    return {
      data: newBooking,
      error: null,
      success: true,
    };
  }

  static async getBookings(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    return {
      data: mockEquipmentBookings,
      error: null,
      success: true,
      count: mockEquipmentBookings.length,
    };
  }

  static async updateBooking(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id, ...updates },
      error: null,
      success: true,
    };
  }

  static async returnEquipment(
    bookingId: string,
    condition: string,
    notes?: string,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id: bookingId, status: "returned", condition, notes },
      error: null,
      success: true,
    };
  }
}

// Mock Business Travel Service
export class MockBusinessTravelService {
  static async getTravelRequests(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    return {
      data: mockTravelRequests,
      error: null,
      success: true,
      count: mockTravelRequests.length,
    };
  }

  static async createTravelRequest(
    request: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const newRequest = {
      id: generateId(),
      ...request,
      created_at: new Date().toISOString(),
    };

    mockTravelRequests.push(newRequest);

    return {
      data: newRequest,
      error: null,
      success: true,
    };
  }

  static async updateTravelRequest(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id, ...updates },
      error: null,
      success: true,
    };
  }

  static async approveTravelRequest(
    id: string,
    approverId: string,
    budget?: number,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id, status: "approved", approved_by: approverId, budget },
      error: null,
      success: true,
    };
  }

  static async addTravelBooking(
    requestId: string,
    booking: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const newBooking = {
      id: generateId(),
      travel_request_id: requestId,
      ...booking,
    };

    return {
      data: newBooking,
      error: null,
      success: true,
    };
  }

  static async addTravelExpense(
    requestId: string,
    expense: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const newExpense = {
      id: generateId(),
      travel_request_id: requestId,
      ...expense,
    };

    return {
      data: newExpense,
      error: null,
      success: true,
    };
  }
}

// Mock Chat Service
export class MockChatService {
  static async getChannels(userId: string): Promise<DatabaseResponse<any[]>> {
    await delay();

    return {
      data: mockChatChannels,
      error: null,
      success: true,
    };
  }

  static async createChannel(channel: any): Promise<DatabaseResponse<any>> {
    await delay();

    const newChannel = {
      id: generateId(),
      ...channel,
      created_at: new Date().toISOString(),
    };

    mockChatChannels.push(newChannel);

    return {
      data: newChannel,
      error: null,
      success: true,
    };
  }

  static async getMessages(
    channelId: string,
    pagination?: PaginationParams,
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    const messages = mockChatMessages.filter((m) => m.channel_id === channelId);

    return {
      data: messages,
      error: null,
      success: true,
      count: messages.length,
    };
  }

  static async sendMessage(message: any): Promise<DatabaseResponse<any>> {
    await delay();

    const newMessage = {
      id: generateId(),
      ...message,
      sent_at: new Date().toISOString(),
    };

    mockChatMessages.push(newMessage);

    return {
      data: newMessage,
      error: null,
      success: true,
    };
  }

  static async addChannelMember(
    channelId: string,
    userId: string,
    role: string = "member",
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { channel_id: channelId, user_id: userId, role },
      error: null,
      success: true,
    };
  }

  static async addReaction(
    messageId: string,
    userId: string,
    emoji: string,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { message_id: messageId, user_id: userId, emoji },
      error: null,
      success: true,
    };
  }
}

// Mock Request Panel Service
export class MockRequestPanelService {
  static async getAllRequests(
    pagination?: PaginationParams,
    filters?: FilterParams[],
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    return {
      data: mockRequests,
      error: null,
      success: true,
      count: mockRequests.length,
    };
  }

  static async createRequest(request: any): Promise<DatabaseResponse<any>> {
    await delay();

    const newRequest = {
      id: generateId(),
      ...request,
      created_at: new Date().toISOString(),
    };

    mockRequests.push(newRequest);

    return {
      data: newRequest,
      error: null,
      success: true,
    };
  }

  static async updateRequest(
    id: string,
    updates: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id, ...updates },
      error: null,
      success: true,
    };
  }

  static async approveRequest(
    id: string,
    approverId: string,
    comments?: string,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: { id, status: "approved", approved_by: approverId, comments },
      error: null,
      success: true,
    };
  }

  static async getRequestsByType(
    type: string,
  ): Promise<DatabaseResponse<any[]>> {
    await delay();

    const filteredRequests = mockRequests.filter(
      (r) => r.request_type === type,
    );

    return {
      data: filteredRequests,
      error: null,
      success: true,
    };
  }

  static async getRequestAnalytics(): Promise<DatabaseResponse<any>> {
    await delay();

    return {
      data: {
        total_requests: mockRequests.length,
        pending_requests: mockRequests.filter((r) => r.status === "pending")
          .length,
        approved_requests: mockRequests.filter((r) => r.status === "approved")
          .length,
        rejected_requests: mockRequests.filter((r) => r.status === "rejected")
          .length,
        completed_requests: mockRequests.filter((r) => r.status === "completed")
          .length,
      },
      error: null,
      success: true,
    };
  }

  static async addRequestComment(
    requestId: string,
    comment: any,
  ): Promise<DatabaseResponse<any>> {
    await delay();

    const newComment = {
      id: generateId(),
      request_id: requestId,
      ...comment,
      created_at: new Date().toISOString(),
    };

    return {
      data: newComment,
      error: null,
      success: true,
    };
  }
}
