import { supabase } from "@/lib/supabase/client";
import {
  MeetingRoom,
  Asset,
  RoomBooking,
  AssetBooking,
  BookingConflict,
} from "../../packages/types/hr";

// Mock data for development
const mockMeetingRooms: MeetingRoom[] = [
  {
    id: "room1",
    org_id: "org1",
    name: "Main Conference Room",
    description: "Large conference room with video conferencing capabilities",
    location: "Building A, Floor 2",
    building: "Building A",
    floor: "2",
    capacity: 12,
    equipment: ["projector", "whiteboard", "video_conference", "microphone"],
    amenities: ["coffee", "water", "catering_available"],
    is_active: true,
    booking_rules: {
      min_duration: 30,
      max_duration: 480,
      advance_booking_hours: 720, // 30 days
      max_advance_days: 30,
    },
    hourly_rate: 50,
    contact_person: "Jane Smith",
    contact_email: "jane.smith@company.com",
    contact_phone: "+1-555-0101",
    images: ["/images/rooms/main-conference.jpg"],
    video_conference_enabled: true,
    accessibility_features: ["wheelchair_accessible", "hearing_loop"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "room2",
    org_id: "org1",
    name: "Small Meeting Room",
    description: "Intimate meeting space for small teams",
    location: "Building A, Floor 1",
    building: "Building A",
    floor: "1",
    capacity: 6,
    equipment: ["tv_screen", "whiteboard"],
    amenities: ["water"],
    is_active: true,
    booking_rules: {
      min_duration: 30,
      max_duration: 240,
      advance_booking_hours: 336, // 14 days
      max_advance_days: 14,
    },
    hourly_rate: 25,
    contact_person: "John Doe",
    contact_email: "john.doe@company.com",
    contact_phone: "+1-555-0102",
    images: ["/images/rooms/small-meeting.jpg"],
    video_conference_enabled: false,
    accessibility_features: ["wheelchair_accessible"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "room3",
    org_id: "org1",
    name: "Executive Boardroom",
    description: "Premium boardroom for executive meetings",
    location: "Building B, Floor 3",
    building: "Building B",
    floor: "3",
    capacity: 16,
    equipment: ["large_display", "premium_av", "conference_phone"],
    amenities: ["premium_coffee", "catering_included", "water", "snacks"],
    is_active: true,
    booking_rules: {
      min_duration: 60,
      max_duration: 600,
      advance_booking_hours: 1440, // 60 days
      max_advance_days: 60,
      requires_approval: true,
    },
    hourly_rate: 100,
    contact_person: "Sarah Wilson",
    contact_email: "sarah.wilson@company.com",
    contact_phone: "+1-555-0103",
    images: ["/images/rooms/executive-boardroom.jpg"],
    video_conference_enabled: true,
    accessibility_features: [
      "wheelchair_accessible",
      "hearing_loop",
      "braille_signage",
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const mockAssets: Asset[] = [
  {
    id: "asset1",
    org_id: "org1",
    name: 'MacBook Pro 16" M2',
    description: "16-inch MacBook Pro with M2 chip, 32GB RAM, 1TB SSD",
    category: "laptop",
    model: 'MacBook Pro 16" (2023)',
    serial_number: "MBP16M2001",
    location: "IT Storage Room A",
    purchase_date: "2023-06-15",
    warranty_expiry: "2026-06-15",
    status: "available",
    condition: "excellent",
    specifications: {
      processor: "Apple M2 Pro",
      memory: "32GB",
      storage: "1TB SSD",
      display: "16-inch Retina",
    },
    maintenance_schedule: "quarterly",
    last_maintenance_date: "2024-01-15T00:00:00Z",
    booking_rules: {
      max_duration_hours: 720, // 30 days
      requires_approval: false,
      advance_booking_hours: 168, // 7 days
    },
    created_at: "2023-06-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "asset2",
    org_id: "org1",
    name: "Epson PowerLite Pro Z9870U",
    description: "High-end 4K laser projector for presentations",
    category: "projector",
    model: "PowerLite Pro Z9870U",
    serial_number: "EPZ9870U001",
    location: "AV Equipment Room",
    purchase_date: "2023-03-20",
    warranty_expiry: "2026-03-20",
    status: "available",
    condition: "excellent",
    specifications: {
      resolution: "4K UHD",
      brightness: "8700 lumens",
      technology: "Laser",
      connectivity: "HDMI, USB, Wireless",
    },
    maintenance_schedule: "monthly",
    last_maintenance_date: "2024-01-01T00:00:00Z",
    booking_rules: {
      max_duration_hours: 168, // 7 days
      requires_approval: true,
      advance_booking_hours: 72, // 3 days
    },
    created_at: "2023-03-20T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "asset3",
    org_id: "org1",
    name: "Canon EOS R5 Camera Kit",
    description: "Professional camera kit for video recording and photography",
    category: "camera",
    model: "Canon EOS R5",
    serial_number: "CANR5001",
    location: "Media Equipment Room",
    purchase_date: "2023-08-10",
    warranty_expiry: "2025-08-10",
    status: "available",
    condition: "excellent",
    specifications: {
      sensor: "45MP Full Frame",
      video: "8K RAW, 4K 120p",
      iso_range: "100-51200",
      storage: "CFexpress + SD",
    },
    maintenance_schedule: "quarterly",
    last_maintenance_date: "2024-01-10T00:00:00Z",
    booking_rules: {
      max_duration_hours: 336, // 14 days
      requires_approval: true,
      advance_booking_hours: 120, // 5 days
    },
    created_at: "2023-08-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
];

const mockRoomBookings: RoomBooking[] = [
  {
    id: "rb1",
    org_id: "org1",
    room_id: "room1",
    booked_by: "user1",
    booking_type: "meeting",
    title: "Weekly Team Standup",
    description: "Engineering team weekly standup meeting",
    start_time: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    attendee_count: 8,
    setup_requirements: "Chairs in circle, whiteboard ready",
    status: "confirmed",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
    room: mockMeetingRooms[0],
  },
  {
    id: "rb2",
    org_id: "org1",
    room_id: "room2",
    booked_by: "user2",
    booking_type: "interview",
    title: "Senior Developer Interview",
    description: "Technical interview for senior developer position",
    start_time: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    attendee_count: 3,
    setup_requirements: "Laptop setup for coding exercise",
    status: "confirmed",
    created_at: "2024-01-19T00:00:00Z",
    updated_at: "2024-01-19T00:00:00Z",
    room: mockMeetingRooms[1],
  },
  {
    id: "rb3",
    org_id: "org1",
    room_id: "room3",
    booked_by: "user3",
    booking_type: "meeting",
    title: "Board Meeting Q1 Review",
    description: "Quarterly board meeting for Q1 results review",
    start_time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
        16,
        0,
        0,
        0,
      ),
    ).toISOString(),
    end_time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
        18,
        0,
        0,
        0,
      ),
    ).toISOString(),
    attendee_count: 12,
    setup_requirements: "Premium setup, catering for 12 people",
    status: "tentative",
    created_at: "2024-01-18T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
    room: mockMeetingRooms[2],
  },
];

const mockAssetBookings: AssetBooking[] = [
  {
    id: "ab1",
    org_id: "org1",
    asset_id: "asset1",
    booked_by: "user4",
    booking_type: "training",
    title: "New Employee Laptop Setup",
    description: "Laptop for new developer onboarding",
    start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end_time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 7)).setHours(
        17,
        0,
        0,
        0,
      ),
    ).toISOString(),
    purpose: "Development work and training",
    pickup_location: "IT Storage Room A",
    return_location: "IT Storage Room A",
    status: "checked_out",
    checked_out_at: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    checked_out_by: "user4",
    condition_on_checkout: "excellent",
    checkout_notes: "All accessories included",
    created_at: "2024-01-19T00:00:00Z",
    updated_at: "2024-01-20T08:30:00Z",
    asset: mockAssets[0],
  },
  {
    id: "ab2",
    org_id: "org1",
    asset_id: "asset2",
    booked_by: "user5",
    booking_type: "meeting",
    title: "Client Presentation Setup",
    description: "High-end projector for important client presentation",
    start_time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 2)).setHours(
        13,
        0,
        0,
        0,
      ),
    ).toISOString(),
    end_time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 2)).setHours(
        17,
        0,
        0,
        0,
      ),
    ).toISOString(),
    purpose: "Client presentation in main conference room",
    pickup_location: "AV Equipment Room",
    return_location: "AV Equipment Room",
    status: "confirmed",
    approval_required: true,
    approved_by: "user1",
    approved_at: "2024-01-20T10:00:00Z",
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
    asset: mockAssets[1],
  },
  {
    id: "ab3",
    org_id: "org1",
    asset_id: "asset3",
    booked_by: "user6",
    booking_type: "other",
    title: "Company Other Photography",
    description: "Professional camera for annual company other",
    start_time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 5)).setHours(
        18,
        0,
        0,
        0,
      ),
    ).toISOString(),
    end_time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 6)).setHours(
        22,
        0,
        0,
        0,
      ),
    ).toISOString(),
    purpose: "Photography and videography for company annual other",
    pickup_location: "Media Equipment Room",
    return_location: "Media Equipment Room",
    status: "confirmed",
    approval_required: true,
    approved_by: "user1",
    approved_at: "2024-01-19T15:00:00Z",
    created_at: "2024-01-19T14:00:00Z",
    updated_at: "2024-01-19T15:00:00Z",
    asset: mockAssets[2],
  },
];

const mockBookingConflicts: BookingConflict[] = [
  {
    id: "conflict1",
    org_id: "org1",
    resource_type: "room",
    resource_id: "room1",
    conflict_type: "double_booking",
    booking1_id: "rb1",
    booking2_id: "rb4",
    start_time: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    resolved: false,
    created_at: "2024-01-20T08:00:00Z",
  },
];

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return (
      url &&
      key &&
      url !== "https://example.supabase.co" &&
      !key.includes("example")
    );
  } catch (e) {
    return false;
  }
};

// Helper function to simulate API delays in development
const mockDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const BookingService = {
  // Meeting Room Management
  async getMeetingRooms(
    orgId: string,
    filters?: {
      is_active?: boolean;
      capacity_min?: number;
      location?: string;
      equipment?: string[];
    },
  ): Promise<MeetingRoom[]> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      let filteredRooms = mockMeetingRooms.filter(
        (room) => room.org_id === orgId,
      );

      if (filters?.is_active !== undefined) {
        filteredRooms = filteredRooms.filter(
          (room) => room.is_active === filters.is_active,
        );
      }
      if (filters?.capacity_min) {
        filteredRooms = filteredRooms.filter(
          (room) => room.capacity >= filters.capacity_min,
        );
      }
      if (filters?.location) {
        filteredRooms = filteredRooms.filter((room) =>
          room.location.toLowerCase().includes(filters.location!.toLowerCase()),
        );
      }

      return filteredRooms;
    }

    let query = supabase.from("meeting_rooms").select("*").eq("org_id", orgId);

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    if (filters?.capacity_min) {
      query = query.gte("capacity", filters.capacity_min);
    }

    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    const { data, error } = await query.order("name");
    if (error) throw new Error(error.message);
    return data;
  },

  async createMeetingRoom(room: Partial<MeetingRoom>): Promise<MeetingRoom> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const newRoom: MeetingRoom = {
        id: "room_" + Date.now(),
        org_id: room.org_id || "org1",
        name: room.name || "New Room",
        description: room.description || "",
        location: room.location || "TBD",
        building: room.building || "",
        floor: room.floor || "",
        capacity: room.capacity || 4,
        equipment: room.equipment || [],
        amenities: room.amenities || [],
        is_active: room.is_active !== undefined ? room.is_active : true,
        booking_rules: room.booking_rules || {},
        hourly_rate: room.hourly_rate || 0,
        contact_person: room.contact_person || "",
        contact_email: room.contact_email || "",
        contact_phone: room.contact_phone || "",
        images: room.images || [],
        video_conference_enabled: room.video_conference_enabled || false,
        accessibility_features: room.accessibility_features || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockMeetingRooms.push(newRoom);
      return newRoom;
    }

    const { data, error } = await supabase
      .from("meeting_rooms")
      .insert({
        ...room,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateMeetingRoom(
    roomId: string,
    updates: Partial<MeetingRoom>,
  ): Promise<MeetingRoom> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const roomIndex = mockMeetingRooms.findIndex(
        (room) => room.id === roomId,
      );
      if (roomIndex === -1) throw new Error("Room not found");

      mockMeetingRooms[roomIndex] = {
        ...mockMeetingRooms[roomIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      return mockMeetingRooms[roomIndex];
    }

    const { data, error } = await supabase
      .from("meeting_rooms")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", roomId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteMeetingRoom(roomId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const roomIndex = mockMeetingRooms.findIndex(
        (room) => room.id === roomId,
      );
      if (roomIndex === -1) throw new Error("Meeting room not found");

      // Check if room has any active bookings
      const activeBookings = mockRoomBookings.filter(
        (booking) =>
          booking.room_id === roomId &&
          booking.status === "confirmed" &&
          new Date(booking.start_time) > new Date(),
      );

      if (activeBookings.length > 0) {
        throw new Error("Cannot delete room with active bookings");
      }

      mockMeetingRooms.splice(roomIndex, 1);
      return;
    }

    // Check if room has any active bookings
    const { data: activeBookings } = await supabase
      .from("room_bookings")
      .select("id")
      .eq("room_id", roomId)
      .eq("status", "confirmed")
      .gt("start_time", new Date().toISOString());

    if (activeBookings && activeBookings.length > 0) {
      throw new Error("Cannot delete room with active bookings");
    }

    const { error } = await supabase
      .from("meeting_rooms")
      .delete()
      .eq("id", roomId);

    if (error) throw new Error(error.message);
  },

  // Asset Management
  async getAssets(
    orgId: string,
    filters?: {
      status?: string;
      category?: string;
      available_only?: boolean;
    },
  ): Promise<Asset[]> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      let filteredAssets = mockAssets.filter((asset) => asset.org_id === orgId);

      if (filters?.status) {
        filteredAssets = filteredAssets.filter(
          (asset) => asset.status === filters.status,
        );
      }
      if (filters?.category) {
        filteredAssets = filteredAssets.filter(
          (asset) => asset.category === filters.category,
        );
      }
      if (filters?.available_only) {
        filteredAssets = filteredAssets.filter(
          (asset) => asset.status === "available",
        );
      }

      return filteredAssets;
    }

    let query = supabase.from("assets").select("*").eq("org_id", orgId);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.available_only) {
      query = query.eq("status", "available");
    }

    const { data, error } = await query.order("name");
    if (error) throw new Error(error.message);
    return data;
  },

  async createAsset(asset: Partial<Asset>): Promise<Asset> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const newAsset: Asset = {
        id: "asset_" + Date.now(),
        org_id: asset.org_id || "org1",
        name: asset.name || "New Asset",
        description: asset.description || "",
        category: asset.category || "other",
        model: asset.model || "",
        serial_number: asset.serial_number || "",
        location: asset.location || "TBD",
        purchase_date:
          asset.purchase_date || new Date().toISOString().split("T")[0],
        warranty_expiry: asset.warranty_expiry || "",
        status: asset.status || "available",
        condition: asset.condition || "good",
        specifications: asset.specifications || {},
        maintenance_schedule: asset.maintenance_schedule || "annual",
        last_maintenance_date: asset.last_maintenance_date || null,
        booking_rules: asset.booking_rules || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockAssets.push(newAsset);
      return newAsset;
    }

    const { data, error } = await supabase
      .from("assets")
      .insert({
        ...asset,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateAsset(assetId: string, updates: Partial<Asset>): Promise<Asset> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const assetIndex = mockAssets.findIndex((asset) => asset.id === assetId);
      if (assetIndex === -1) throw new Error("Asset not found");

      mockAssets[assetIndex] = {
        ...mockAssets[assetIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      return mockAssets[assetIndex];
    }

    const { data, error } = await supabase
      .from("assets")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assetId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteAsset(assetId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const assetIndex = mockAssets.findIndex((asset) => asset.id === assetId);
      if (assetIndex === -1) throw new Error("Asset not found");

      // Check if asset has any active bookings
      const activeBookings = mockAssetBookings.filter(
        (booking) =>
          booking.asset_id === assetId &&
          ["confirmed", "checked_out"].includes(booking.status) &&
          new Date(booking.start_time) > new Date(),
      );

      if (activeBookings.length > 0) {
        throw new Error("Cannot delete asset with active bookings");
      }

      mockAssets.splice(assetIndex, 1);
      return;
    }

    // Check if asset has any active bookings
    const { data: activeBookings } = await supabase
      .from("asset_bookings")
      .select("id")
      .eq("asset_id", assetId)
      .in("status", ["confirmed", "checked_out"])
      .gt("start_time", new Date().toISOString());

    if (activeBookings && activeBookings.length > 0) {
      throw new Error("Cannot delete asset with active bookings");
    }

    const { error } = await supabase.from("assets").delete().eq("id", assetId);

    if (error) throw new Error(error.message);
  },

  // Room Booking Management
  async checkRoomAvailability(
    roomId: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      await mockDelay(100);
      const conflictingBookings = mockRoomBookings.filter((booking) => {
        if (booking.room_id !== roomId) return false;
        if (booking.status === "cancelled") return false;
        if (excludeBookingId && booking.id === excludeBookingId) return false;

        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);
        const checkStart = new Date(startTime);
        const checkEnd = new Date(endTime);

        return checkStart < bookingEnd && checkEnd > bookingStart;
      });

      return conflictingBookings.length === 0;
    }

    let query = supabase
      .from("room_bookings")
      .select("id")
      .eq("room_id", roomId)
      .neq("status", "cancelled")
      .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

    if (excludeBookingId) {
      query = query.neq("id", excludeBookingId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data.length === 0;
  },

  async createRoomBooking(booking: Partial<RoomBooking>): Promise<RoomBooking> {
    if (!isSupabaseConfigured()) {
      await mockDelay();

      // Check availability first
      if (booking.room_id && booking.start_time && booking.end_time) {
        const isAvailable = await this.checkRoomAvailability(
          booking.room_id,
          booking.start_time,
          booking.end_time,
        );

        if (!isAvailable) {
          throw new Error(
            "Room is not available during the requested time slot",
          );
        }
      }

      const room = mockMeetingRooms.find((r) => r.id === booking.room_id);
      const newBooking: RoomBooking = {
        id: "rb_" + Date.now(),
        org_id: booking.org_id || "org1",
        room_id: booking.room_id || "",
        booked_by: booking.booked_by || "current_user",
        booking_type: booking.booking_type || "meeting",
        title: booking.title || "New Booking",
        description: booking.description || "",
        start_time: booking.start_time || new Date().toISOString(),
        end_time:
          booking.end_time || new Date(Date.now() + 3600000).toISOString(),
        attendee_count: booking.attendee_count || 1,
        setup_requirements: booking.setup_requirements || "",
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        room: room,
      };

      mockRoomBookings.push(newBooking);
      return newBooking;
    }

    // Check availability first
    if (booking.room_id && booking.start_time && booking.end_time) {
      const isAvailable = await this.checkRoomAvailability(
        booking.room_id,
        booking.start_time,
        booking.end_time,
      );

      if (!isAvailable) {
        throw new Error("Room is not available during the requested time slot");
      }
    }

    const { data, error } = await supabase
      .from("room_bookings")
      .insert({
        ...booking,
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateRoomBooking(
    bookingId: string,
    updates: Partial<RoomBooking>,
  ): Promise<RoomBooking> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const bookingIndex = mockRoomBookings.findIndex(
        (booking) => booking.id === bookingId,
      );
      if (bookingIndex === -1) throw new Error("Booking not found");

      // If updating time, check availability
      if (updates.start_time || updates.end_time) {
        const existingBooking = mockRoomBookings[bookingIndex];
        const startTime = updates.start_time || existingBooking.start_time;
        const endTime = updates.end_time || existingBooking.end_time;

        const isAvailable = await this.checkRoomAvailability(
          existingBooking.room_id,
          startTime,
          endTime,
          bookingId,
        );

        if (!isAvailable) {
          throw new Error(
            "Room is not available during the requested time slot",
          );
        }
      }

      mockRoomBookings[bookingIndex] = {
        ...mockRoomBookings[bookingIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      return mockRoomBookings[bookingIndex];
    }

    // If updating time, check availability
    if (updates.start_time || updates.end_time) {
      const { data: existingBooking } = await supabase
        .from("room_bookings")
        .select("room_id, start_time, end_time")
        .eq("id", bookingId)
        .single();

      if (existingBooking) {
        const startTime = updates.start_time || existingBooking.start_time;
        const endTime = updates.end_time || existingBooking.end_time;

        const isAvailable = await this.checkRoomAvailability(
          existingBooking.room_id,
          startTime,
          endTime,
          bookingId,
        );

        if (!isAvailable) {
          throw new Error(
            "Room is not available during the requested time slot",
          );
        }
      }
    }

    const { data, error } = await supabase
      .from("room_bookings")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getRoomBookings(
    orgId: string,
    filters?: {
      room_id?: string;
      booked_by?: string;
      status?: string;
      start_date?: string;
      end_date?: string;
      booking_type?: string;
    },
  ): Promise<RoomBooking[]> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      let filteredBookings = mockRoomBookings.filter(
        (booking) => booking.org_id === orgId,
      );

      if (filters?.room_id) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.room_id === filters.room_id,
        );
      }
      if (filters?.booked_by) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.booked_by === filters.booked_by,
        );
      }
      if (filters?.status) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.status === filters.status,
        );
      }
      if (filters?.booking_type) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.booking_type === filters.booking_type,
        );
      }
      if (filters?.start_date) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            new Date(booking.start_time) >= new Date(filters.start_date!),
        );
      }
      if (filters?.end_date) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            new Date(booking.end_time) <= new Date(filters.end_date!),
        );
      }

      return filteredBookings.sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );
    }

    let query = supabase
      .from("room_bookings")
      .select(
        `
        *,
        room:meeting_rooms(*)
      `,
      )
      .eq("org_id", orgId);

    if (filters?.room_id) query = query.eq("room_id", filters.room_id);
    if (filters?.booked_by) query = query.eq("booked_by", filters.booked_by);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.booking_type)
      query = query.eq("booking_type", filters.booking_type);
    if (filters?.start_date)
      query = query.gte("start_time", filters.start_date);
    if (filters?.end_date) query = query.lte("end_time", filters.end_date);

    const { data, error } = await query.order("start_time");
    if (error) throw new Error(error.message);
    return data;
  },

  // Asset Booking Management
  async checkAssetAvailability(
    assetId: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      await mockDelay(100);
      const conflictingBookings = mockAssetBookings.filter((booking) => {
        if (booking.asset_id !== assetId) return false;
        if (booking.status === "cancelled" || booking.status === "returned")
          return false;
        if (excludeBookingId && booking.id === excludeBookingId) return false;

        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);
        const checkStart = new Date(startTime);
        const checkEnd = new Date(endTime);

        return checkStart < bookingEnd && checkEnd > bookingStart;
      });

      return conflictingBookings.length === 0;
    }

    let query = supabase
      .from("asset_bookings")
      .select("id")
      .eq("asset_id", assetId)
      .neq("status", "cancelled")
      .neq("status", "returned")
      .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

    if (excludeBookingId) {
      query = query.neq("id", excludeBookingId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data.length === 0;
  },

  async createAssetBooking(
    booking: Partial<AssetBooking>,
  ): Promise<AssetBooking> {
    if (!isSupabaseConfigured()) {
      await mockDelay();

      // Check availability first
      if (booking.asset_id && booking.start_time && booking.end_time) {
        const isAvailable = await this.checkAssetAvailability(
          booking.asset_id,
          booking.start_time,
          booking.end_time,
        );

        if (!isAvailable) {
          throw new Error(
            "Asset is not available during the requested time slot",
          );
        }
      }

      const asset = mockAssets.find((a) => a.id === booking.asset_id);
      const newBooking: AssetBooking = {
        id: "ab_" + Date.now(),
        org_id: booking.org_id || "org1",
        asset_id: booking.asset_id || "",
        booked_by: booking.booked_by || "current_user",
        booking_type: booking.booking_type || "other",
        title: booking.title || "New Asset Booking",
        description: booking.description || "",
        start_time: booking.start_time || new Date().toISOString(),
        end_time:
          booking.end_time || new Date(Date.now() + 3600000).toISOString(),
        purpose: booking.purpose || "",
        pickup_location: booking.pickup_location || asset?.location || "",
        return_location: booking.return_location || asset?.location || "",
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        asset: asset,
      };

      mockAssetBookings.push(newBooking);

      // Update asset status to in_use if not mock
      if (booking.asset_id && asset) {
        asset.status = "in_use";
      }

      return newBooking;
    }

    // Check availability first
    if (booking.asset_id && booking.start_time && booking.end_time) {
      const isAvailable = await this.checkAssetAvailability(
        booking.asset_id,
        booking.start_time,
        booking.end_time,
      );

      if (!isAvailable) {
        throw new Error(
          "Asset is not available during the requested time slot",
        );
      }
    }

    const { data, error } = await supabase
      .from("asset_bookings")
      .insert({
        ...booking,
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Update asset status to in_use
    if (booking.asset_id) {
      await this.updateAsset(booking.asset_id, { status: "in_use" });
    }

    return data;
  },

  async updateAssetBooking(
    bookingId: string,
    updates: Partial<AssetBooking>,
  ): Promise<AssetBooking> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const bookingIndex = mockAssetBookings.findIndex(
        (booking) => booking.id === bookingId,
      );
      if (bookingIndex === -1) throw new Error("Booking not found");

      mockAssetBookings[bookingIndex] = {
        ...mockAssetBookings[bookingIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      return mockAssetBookings[bookingIndex];
    }

    const { data, error } = await supabase
      .from("asset_bookings")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAssetBookings(
    orgId: string,
    filters?: {
      asset_id?: string;
      booked_by?: string;
      status?: string;
      start_date?: string;
      end_date?: string;
      booking_type?: string;
    },
  ): Promise<AssetBooking[]> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      let filteredBookings = mockAssetBookings.filter(
        (booking) => booking.org_id === orgId,
      );

      if (filters?.asset_id) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.asset_id === filters.asset_id,
        );
      }
      if (filters?.booked_by) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.booked_by === filters.booked_by,
        );
      }
      if (filters?.status) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.status === filters.status,
        );
      }
      if (filters?.booking_type) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.booking_type === filters.booking_type,
        );
      }
      if (filters?.start_date) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            new Date(booking.start_time) >= new Date(filters.start_date!),
        );
      }
      if (filters?.end_date) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            new Date(booking.end_time) <= new Date(filters.end_date!),
        );
      }

      return filteredBookings.sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );
    }

    let query = supabase
      .from("asset_bookings")
      .select(
        `
        *,
        asset:assets(*)
      `,
      )
      .eq("org_id", orgId);

    if (filters?.asset_id) query = query.eq("asset_id", filters.asset_id);
    if (filters?.booked_by) query = query.eq("booked_by", filters.booked_by);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.booking_type)
      query = query.eq("booking_type", filters.booking_type);
    if (filters?.start_date)
      query = query.gte("start_time", filters.start_date);
    if (filters?.end_date) query = query.lte("end_time", filters.end_date);

    const { data, error } = await query.order("start_time");
    if (error) throw new Error(error.message);
    return data;
  },

  // Asset checkout/return
  async checkoutAsset(
    bookingId: string,
    checkoutData: {
      checked_out_by: string;
      checkout_notes?: string;
      condition_on_checkout?: string;
    },
  ): Promise<AssetBooking> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const bookingIndex = mockAssetBookings.findIndex(
        (booking) => booking.id === bookingId,
      );
      if (bookingIndex === -1) throw new Error("Booking not found");

      mockAssetBookings[bookingIndex] = {
        ...mockAssetBookings[bookingIndex],
        status: "checked_out",
        checked_out_at: new Date().toISOString(),
        ...checkoutData,
        updated_at: new Date().toISOString(),
      };

      return mockAssetBookings[bookingIndex];
    }

    const { data, error } = await supabase
      .from("asset_bookings")
      .update({
        status: "checked_out",
        checked_out_at: new Date().toISOString(),
        ...checkoutData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async returnAsset(
    bookingId: string,
    returnData: {
      returned_by: string;
      return_notes?: string;
      condition_on_return?: string;
      damage_reported?: boolean;
      damage_description?: string;
    },
  ): Promise<AssetBooking> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const bookingIndex = mockAssetBookings.findIndex(
        (booking) => booking.id === bookingId,
      );
      if (bookingIndex === -1) throw new Error("Booking not found");

      const booking = mockAssetBookings[bookingIndex];
      const asset = mockAssets.find((a) => a.id === booking.asset_id);

      mockAssetBookings[bookingIndex] = {
        ...booking,
        status: "returned",
        returned_at: new Date().toISOString(),
        ...returnData,
        updated_at: new Date().toISOString(),
      };

      // Update asset status back to available
      if (asset) {
        asset.status = "available";
      }

      return mockAssetBookings[bookingIndex];
    }

    const { data: booking, error: bookingError } = await supabase
      .from("asset_bookings")
      .select("asset_id")
      .eq("id", bookingId)
      .single();

    if (bookingError) throw new Error(bookingError.message);

    const { data, error } = await supabase
      .from("asset_bookings")
      .update({
        status: "returned",
        returned_at: new Date().toISOString(),
        ...returnData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Update asset status back to available
    await this.updateAsset(booking.asset_id, { status: "available" });

    return data;
  },

  // Booking conflicts
  async getBookingConflicts(
    orgId: string,
    resolved?: boolean,
  ): Promise<BookingConflict[]> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      let filteredConflicts = mockBookingConflicts.filter(
        (conflict) => conflict.org_id === orgId,
      );

      if (resolved !== undefined) {
        filteredConflicts = filteredConflicts.filter(
          (conflict) => conflict.resolved === resolved,
        );
      }

      return filteredConflicts.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    let query = supabase
      .from("booking_conflicts")
      .select("*")
      .eq("org_id", orgId);

    if (resolved !== undefined) {
      query = query.eq("resolved", resolved);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async resolveBookingConflict(
    conflictId: string,
    resolution: {
      resolution_action: string;
      resolved_by: string;
      notes?: string;
    },
  ): Promise<BookingConflict> {
    if (!isSupabaseConfigured()) {
      await mockDelay();
      const conflictIndex = mockBookingConflicts.findIndex(
        (conflict) => conflict.id === conflictId,
      );
      if (conflictIndex === -1) throw new Error("Conflict not found");

      mockBookingConflicts[conflictIndex] = {
        ...mockBookingConflicts[conflictIndex],
        resolved: true,
        resolved_at: new Date().toISOString(),
        ...resolution,
      };

      return mockBookingConflicts[conflictIndex];
    }

    const { data, error } = await supabase
      .from("booking_conflicts")
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        ...resolution,
      })
      .eq("id", conflictId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Calendar utilities
  async getRoomSchedule(roomId: string, date: string): Promise<RoomBooking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getRoomBookings("org1", {
      room_id: roomId,
      start_date: startOfDay.toISOString(),
      end_date: endOfDay.toISOString(),
      status: "confirmed",
    });
  },

  async getAssetSchedule(
    assetId: string,
    date: string,
  ): Promise<AssetBooking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getAssetBookings("org1", {
      asset_id: assetId,
      start_date: startOfDay.toISOString(),
      end_date: endOfDay.toISOString(),
    });
  },

  // Interview-specific booking helpers
  async bookResourcesForInterview(
    interviewId: string,
    resources: {
      room_id?: string;
      asset_ids?: string[];
      title: string;
      start_time: string;
      end_time: string;
      booked_by: string;
      org_id: string;
      attendee_count?: number;
    },
  ): Promise<{ roomBooking?: RoomBooking; assetBookings: AssetBooking[] }> {
    const result: { roomBooking?: RoomBooking; assetBookings: AssetBooking[] } =
      {
        assetBookings: [],
      };

    // Book meeting room if specified
    if (resources.room_id) {
      result.roomBooking = await this.createRoomBooking({
        org_id: resources.org_id,
        room_id: resources.room_id,
        booked_by: resources.booked_by,
        booking_type: "interview",
        related_record_id: interviewId,
        title: resources.title,
        start_time: resources.start_time,
        end_time: resources.end_time,
        attendee_count: resources.attendee_count,
      });
    }

    // Book assets if specified
    if (resources.asset_ids?.length) {
      for (const assetId of resources.asset_ids) {
        const assetBooking = await this.createAssetBooking({
          org_id: resources.org_id,
          asset_id: assetId,
          booked_by: resources.booked_by,
          booking_type: "interview",
          related_record_id: interviewId,
          title: resources.title,
          start_time: resources.start_time,
          end_time: resources.end_time,
        });
        result.assetBookings.push(assetBooking);
      }
    }

    return result;
  },

  async cancelBookingsForInterview(
    interviewId: string,
    cancelledBy: string,
  ): Promise<void> {
    if (!isSupabaseConfigured()) {
      await mockDelay();

      // Cancel room bookings
      mockRoomBookings.forEach((booking) => {
        if (
          booking.related_record_id === interviewId &&
          booking.booking_type === "interview"
        ) {
          booking.status = "cancelled";
          booking.cancelled_at = new Date().toISOString();
          booking.cancelled_by = cancelledBy;
          booking.cancellation_reason = "Interview cancelled";
        }
      });

      // Cancel asset bookings
      mockAssetBookings.forEach((booking) => {
        if (
          booking.related_record_id === interviewId &&
          booking.booking_type === "interview"
        ) {
          booking.status = "cancelled";
          booking.cancelled_at = new Date().toISOString();
          booking.cancelled_by = cancelledBy;
          booking.cancellation_reason = "Interview cancelled";
        }
      });

      return;
    }

    // Cancel room bookings
    await supabase
      .from("room_bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_by: cancelledBy,
        cancellation_reason: "Interview cancelled",
      })
      .eq("related_record_id", interviewId)
      .eq("booking_type", "interview");

    // Cancel asset bookings
    await supabase
      .from("asset_bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_by: cancelledBy,
        cancellation_reason: "Interview cancelled",
      })
      .eq("related_record_id", interviewId)
      .eq("booking_type", "interview");
  },
};
