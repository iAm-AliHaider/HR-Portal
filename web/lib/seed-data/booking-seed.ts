import { MeetingRoom, Asset, RoomBooking, AssetBooking } from '../../../packages/types/hr';

// Sample Meeting Rooms
export const sampleMeetingRooms: Partial<MeetingRoom>[] = [
  {
    name: 'Conference Room Alpha',
    description: 'Large conference room perfect for board meetings and presentations',
    location: 'Building A, Floor 3, Room 301',
    building: 'Building A',
    floor: '3',
    capacity: 20,
    equipment: ['75" 4K Display', 'Video Conferencing System', 'Wireless Presentation', 'Whiteboard', 'Audio System'],
    amenities: ['Coffee Machine', 'Water Station', 'Climate Control', 'Natural Light'],
    is_active: true,
    booking_rules: {
      min_duration: 30,
      max_duration: 480,
      advance_booking_hours: 24,
      max_advance_days: 30,
      requires_approval: true,
      business_hours_only: false,
      allowed_roles: ['admin', 'manager', 'hr', 'director']
    },
    hourly_rate: 75,
    contact_person: 'Sarah Johnson',
    contact_email: 'sarah.johnson@company.com',
    contact_phone: '+1 (555) 123-4567',
    video_conference_enabled: true,
    accessibility_features: ['Wheelchair Accessible', 'Hearing Loop', 'Adjustable Table Height']
  },
  {
    name: 'Meeting Room Beta',
    description: 'Medium-sized meeting room ideal for team meetings and interviews',
    location: 'Building A, Floor 2, Room 205',
    building: 'Building A',
    floor: '2',
    capacity: 10,
    equipment: ['55" Smart TV', 'Video Conferencing', 'Wireless Presentation', 'Flipchart', 'Conference Phone'],
    amenities: ['Coffee Machine', 'Water Station', 'Natural Light'],
    is_active: true,
    booking_rules: {
      min_duration: 15,
      max_duration: 240,
      advance_booking_hours: 2,
      max_advance_days: 14,
      requires_approval: false,
      business_hours_only: true,
      allowed_roles: ['admin', 'manager', 'hr', 'employee']
    },
    hourly_rate: 35,
    contact_person: 'Michael Chen',
    contact_email: 'michael.chen@company.com',
    contact_phone: '+1 (555) 123-4568',
    video_conference_enabled: true,
    accessibility_features: ['Wheelchair Accessible']
  },
  {
    name: 'Interview Room Gamma',
    description: 'Private interview room designed for candidate interviews',
    location: 'Building A, Floor 1, Room 102',
    building: 'Building A',
    floor: '1',
    capacity: 4,
    equipment: ['32" Monitor', 'Laptop Connection', 'Whiteboard', 'Recording Equipment'],
    amenities: ['Water Station', 'Sound Insulation', 'Comfortable Seating'],
    is_active: true,
    booking_rules: {
      min_duration: 30,
      max_duration: 180,
      advance_booking_hours: 4,
      max_advance_days: 21,
      requires_approval: false,
      business_hours_only: true,
      allowed_roles: ['admin', 'hr', 'manager', 'recruiter']
    },
    hourly_rate: 25,
    contact_person: 'HR Department',
    contact_email: 'hr@company.com',
    contact_phone: '+1 (555) 123-4569',
    video_conference_enabled: false,
    accessibility_features: ['Wheelchair Accessible', 'Quiet Environment']
  },
  {
    name: 'Executive Boardroom',
    description: 'Premium boardroom for executive meetings and client presentations',
    location: 'Building A, Floor 5, Room 501',
    building: 'Building A',
    floor: '5',
    capacity: 16,
    equipment: ['85" 8K Display', 'Premium Video Conferencing', 'Wireless Presentation', 'Smart Whiteboard', 'Premium Audio System', 'Document Camera'],
    amenities: ['Executive Coffee Service', 'Premium Water Station', 'Climate Control', 'City View', 'Catering Service'],
    is_active: true,
    booking_rules: {
      min_duration: 60,
      max_duration: 480,
      advance_booking_hours: 48,
      max_advance_days: 60,
      requires_approval: true,
      business_hours_only: false,
      allowed_roles: ['admin', 'director', 'ceo', 'vp']
    },
    hourly_rate: 150,
    contact_person: 'Executive Assistant',
    contact_email: 'executive@company.com',
    contact_phone: '+1 (555) 123-4570',
    video_conference_enabled: true,
    accessibility_features: ['Wheelchair Accessible', 'Hearing Loop', 'Premium Accessibility Features']
  },
  {
    name: 'Training Room Delta',
    description: 'Large training room equipped for workshops and training sessions',
    location: 'Building B, Floor 1, Room 101',
    building: 'Building B',
    floor: '1',
    capacity: 30,
    equipment: ['Dual 65" Displays', 'Sound System', 'Microphones', 'Projector', 'Training Whiteboards', 'Laptop Stations'],
    amenities: ['Coffee Station', 'Water Station', 'Air Conditioning', 'Flexible Seating'],
    is_active: true,
    booking_rules: {
      min_duration: 120,
      max_duration: 480,
      advance_booking_hours: 72,
      max_advance_days: 45,
      requires_approval: true,
      business_hours_only: true,
      allowed_roles: ['admin', 'training', 'hr', 'manager']
    },
    hourly_rate: 85,
    contact_person: 'Training Department',
    contact_email: 'training@company.com',
    contact_phone: '+1 (555) 123-4571',
    video_conference_enabled: true,
    accessibility_features: ['Wheelchair Accessible', 'Hearing Assistance', 'Adjustable Lighting']
  },
  {
    name: 'Focus Pod Echo',
    description: 'Small private space for focused work and 1-on-1 meetings',
    location: 'Building A, Floor 2, Pod 210',
    building: 'Building A',
    floor: '2',
    capacity: 2,
    equipment: ['24" Monitor', 'Webcam', 'Noise Cancelling', 'USB Hub'],
    amenities: ['Sound Insulation', 'Adjustable Lighting', 'Phone Booth Style'],
    is_active: true,
    booking_rules: {
      min_duration: 15,
      max_duration: 120,
      advance_booking_hours: 1,
      max_advance_days: 7,
      requires_approval: false,
      business_hours_only: true,
      allowed_roles: ['admin', 'manager', 'hr', 'employee']
    },
    hourly_rate: 15,
    contact_person: 'Facilities',
    contact_email: 'facilities@company.com',
    contact_phone: '+1 (555) 123-4572',
    video_conference_enabled: true,
    accessibility_features: ['Accessible Entry']
  }
];

// Sample Assets
export const sampleAssets: Partial<Asset>[] = [
  {
    name: 'MacBook Pro 16" M2 Pro',
    description: 'High-performance laptop for presentations and development work',
    category: 'laptop',
    brand: 'Apple',
    model: 'MacBook Pro 16-inch',
    serial_number: 'C02ZN1JDMD6R',
    asset_tag: 'LAPTOP-001',
    location: 'IT Equipment Room, Building A, Floor 1',
    status: 'available',
    condition: 'excellent',
    purchase_date: '2023-03-15',
    warranty_expiry: '2026-03-15',
    specifications: {
      processor: 'Apple M2 Pro 12-core CPU',
      memory: '32GB Unified Memory',
      storage: '1TB SSD',
      display: '16.2-inch Liquid Retina XDR',
      graphics: '19-core GPU',
      connectivity: 'Thunderbolt 4, HDMI, Wi-Fi 6E, Bluetooth 5.3'
    },
    booking_rules: {
      max_duration_hours: 168,
      advance_booking_hours: 4,
      requires_approval: false,
      checkout_required: true,
      allowed_roles: ['admin', 'manager', 'employee', 'contractor']
    },
    hourly_rate: 10,
    daily_rate: 50,
    responsible_person: 'it-admin-001',
    maintenance_schedule: 'Monthly cleaning and updates',
    last_maintenance_date: '2024-01-15'
  },
  {
    name: 'Epson PowerLite 5050UB Projector',
    description: '4K PRO-UHD projector for high-quality presentations',
    category: 'projector',
    brand: 'Epson',
    model: 'PowerLite 5050UB',
    serial_number: 'X9LF234567',
    asset_tag: 'PROJ-001',
    location: 'AV Equipment Room, Building A, Floor 3',
    status: 'available',
    condition: 'good',
    purchase_date: '2022-08-10',
    warranty_expiry: '2025-08-10',
    specifications: {
      resolution: '4K PRO-UHD (4096 x 2160)',
      brightness: '2600 lumens',
      contrast: '1,000,000:1',
      lamp_life: '5000 hours',
      connectivity: 'HDMI, USB, Wireless',
      weight: '24.3 lbs'
    },
    booking_rules: {
      max_duration_hours: 48,
      advance_booking_hours: 8,
      requires_approval: true,
      checkout_required: true,
      allowed_roles: ['admin', 'manager', 'presenter']
    },
    hourly_rate: 25,
    daily_rate: 150,
    responsible_person: 'av-tech-001',
    maintenance_schedule: 'Quarterly lamp and filter cleaning',
    last_maintenance_date: '2024-01-10'
  },
  {
    name: 'Sony FX3 Cinema Camera',
    description: 'Professional cinema camera for video recording and live streaming',
    category: 'camera',
    brand: 'Sony',
    model: 'FX3',
    serial_number: '3103456789',
    asset_tag: 'CAM-001',
    location: 'Media Equipment Room, Building B, Floor 2',
    status: 'available',
    condition: 'excellent',
    purchase_date: '2023-06-20',
    warranty_expiry: '2025-06-20',
    specifications: {
      sensor: 'Full-frame 10.2MP Exmor R CMOS',
      recording: '4K 120p, Full HD 240p',
      iso_range: '80-102400',
      storage: 'CFexpress Type A, SD UHS-II',
      connectivity: 'HDMI, USB-C, 3.5mm audio',
      battery_life: '95 minutes continuous recording'
    },
    booking_rules: {
      max_duration_hours: 72,
      advance_booking_hours: 24,
      requires_approval: true,
      checkout_required: true,
      allowed_roles: ['admin', 'media_team', 'marketing']
    },
    hourly_rate: 35,
    daily_rate: 200,
    responsible_person: 'media-tech-001',
    maintenance_schedule: 'Monthly sensor cleaning and calibration',
    last_maintenance_date: '2024-01-05'
  },
  {
    name: 'Shure SM7B Microphone',
    description: 'Professional broadcast microphone for podcasts and recordings',
    category: 'microphone',
    brand: 'Shure',
    model: 'SM7B',
    serial_number: 'SM7B123456',
    asset_tag: 'MIC-001',
    location: 'Audio Equipment Room, Building B, Floor 2',
    status: 'available',
    condition: 'excellent',
    purchase_date: '2023-04-12',
    warranty_expiry: '2025-04-12',
    specifications: {
      type: 'Dynamic',
      polar_pattern: 'Cardioid',
      frequency_response: '50Hz to 20kHz',
      output_impedance: '150 ohms',
      connector: 'XLR',
      weight: '1.69 lbs'
    },
    booking_rules: {
      max_duration_hours: 24,
      advance_booking_hours: 4,
      requires_approval: false,
      checkout_required: true,
      allowed_roles: ['admin', 'media_team', 'marketing', 'hr']
    },
    hourly_rate: 5,
    daily_rate: 25,
    responsible_person: 'audio-tech-001',
    maintenance_schedule: 'Monthly cleaning and windscreen replacement',
    last_maintenance_date: '2024-01-08'
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'High-performance tablet for presentations and mobile work',
    category: 'tablet',
    brand: 'Apple',
    model: 'iPad Pro 12.9-inch M2',
    serial_number: 'F4PQ8X9NQ6LF',
    asset_tag: 'TAB-001',
    location: 'Mobile Device Station, Building A, Floor 1',
    status: 'available',
    condition: 'excellent',
    purchase_date: '2023-02-28',
    warranty_expiry: '2025-02-28',
    specifications: {
      chip: 'Apple M2 8-core CPU',
      display: '12.9-inch Liquid Retina XDR',
      storage: '256GB',
      connectivity: 'Wi-Fi 6E, Bluetooth 5.3, USB-C',
      battery_life: '10 hours',
      accessories: 'Apple Pencil 2, Magic Keyboard'
    },
    booking_rules: {
      max_duration_hours: 72,
      advance_booking_hours: 2,
      requires_approval: false,
      checkout_required: true,
      allowed_roles: ['admin', 'manager', 'employee', 'sales', 'marketing']
    },
    hourly_rate: 8,
    daily_rate: 40,
    responsible_person: 'mobile-tech-001',
    maintenance_schedule: 'Monthly cleaning and software updates',
    last_maintenance_date: '2024-01-12'
  },
  {
    name: 'Portable Whiteboard Set',
    description: 'Mobile whiteboard with markers and erasers for brainstorming sessions',
    category: 'whiteboard',
    brand: 'Quartet',
    model: 'Mobile Easel Whiteboard',
    serial_number: 'WB001234567',
    asset_tag: 'WB-001',
    location: 'Office Supplies Room, Building A, Floor 2',
    status: 'available',
    condition: 'good',
    purchase_date: '2022-11-15',
    warranty_expiry: '2024-11-15',
    specifications: {
      size: '6 x 4 feet',
      surface: 'Magnetic dry-erase',
      mobility: 'Wheeled easel stand',
      accessories: 'Markers, erasers, magnetic accessories',
      weight: '45 lbs'
    },
    booking_rules: {
      max_duration_hours: 48,
      advance_booking_hours: 1,
      requires_approval: false,
      checkout_required: false,
      allowed_roles: ['admin', 'manager', 'employee', 'contractor']
    },
    hourly_rate: 2,
    daily_rate: 10,
    responsible_person: 'facilities-001',
    maintenance_schedule: 'Weekly cleaning and marker replacement',
    last_maintenance_date: '2024-01-14'
  },
  {
    name: 'Ring Light Kit Professional',
    description: 'Professional lighting kit for video calls and recordings',
    category: 'lighting',
    brand: 'Neewer',
    model: '18-inch LED Ring Light Kit',
    serial_number: 'RL2024001',
    asset_tag: 'LIGHT-001',
    location: 'Media Equipment Room, Building B, Floor 2',
    status: 'available',
    condition: 'excellent',
    purchase_date: '2023-09-05',
    warranty_expiry: '2024-09-05',
    specifications: {
      light_diameter: '18 inches',
      power: '75W LED',
      color_temperature: '3200K-5600K',
      dimming: '10-100%',
      tripod_height: '61-79 inches',
      remote_control: 'Bluetooth wireless'
    },
    booking_rules: {
      max_duration_hours: 24,
      advance_booking_hours: 4,
      requires_approval: false,
      checkout_required: true,
      allowed_roles: ['admin', 'media_team', 'marketing', 'hr']
    },
    hourly_rate: 3,
    daily_rate: 15,
    responsible_person: 'media-tech-001',
    maintenance_schedule: 'Monthly LED inspection and calibration',
    last_maintenance_date: '2024-01-03'
  },
  {
    name: 'Zoom H6 Audio Recorder',
    description: 'Professional portable audio recorder for interviews and meetings',
    category: 'recording',
    brand: 'Zoom',
    model: 'H6 Handy Recorder',
    serial_number: 'H6240001',
    asset_tag: 'REC-001',
    location: 'Audio Equipment Room, Building B, Floor 2',
    status: 'available',
    condition: 'good',
    purchase_date: '2022-12-10',
    warranty_expiry: '2024-12-10',
    specifications: {
      inputs: '6 simultaneous inputs',
      recording: 'Up to 24-bit/96kHz',
      storage: 'SD/SDHC/SDXC cards',
      battery_life: '20 hours with AA batteries',
      microphones: 'Built-in X/Y stereo mics',
      connectivity: 'USB, headphone out'
    },
    booking_rules: {
      max_duration_hours: 48,
      advance_booking_hours: 8,
      requires_approval: false,
      checkout_required: true,
      allowed_roles: ['admin', 'media_team', 'hr', 'training']
    },
    hourly_rate: 4,
    daily_rate: 20,
    responsible_person: 'audio-tech-001',
    maintenance_schedule: 'Monthly cleaning and memory card check',
    last_maintenance_date: '2024-01-07'
  }
];

// Sample Room Bookings
export const sampleRoomBookings: Partial<RoomBooking>[] = [
  {
    room_id: 'room-001', // Conference Room Alpha
    booked_by: 'user-001',
    booking_type: 'meeting',
    related_record_id: null,
    title: 'Q1 Strategic Planning Meeting',
    description: 'Quarterly strategic planning session with department heads',
    start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    end_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    attendee_count: 15,
    attendees: ['user-001', 'user-002', 'user-003', 'user-004'],
    setup_requirements: 'U-shape seating, presentation screen, coffee service',
    catering_requirements: 'Coffee, tea, light refreshments',
    status: 'confirmed',
    approval_required: true,
    approved_by: 'admin-001',
    approved_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    notes: 'VIP meeting, ensure all AV equipment is tested beforehand',
    cost: 225 // 3 hours * $75/hour
  },
  {
    room_id: 'room-002', // Meeting Room Beta
    booked_by: 'user-005',
    booking_type: 'interview',
    related_record_id: 'interview-001',
    title: 'Software Engineer Interview - Alex Johnson',
    description: 'Technical interview for Senior Software Engineer position',
    start_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    end_time: new Date(Date.now() + 7.5 * 60 * 60 * 1000).toISOString(), // 7.5 hours from now
    attendee_count: 3,
    attendees: ['user-005', 'user-006', 'user-007'],
    setup_requirements: 'Standard interview setup, whiteboard available',
    status: 'confirmed',
    notes: 'Candidate will arrive 15 minutes early for check-in',
    cost: 52.5 // 1.5 hours * $35/hour
  },
  {
    room_id: 'room-003', // Interview Room Gamma
    booked_by: 'hr-001',
    booking_type: 'interview',
    related_record_id: 'interview-002',
    title: 'Product Manager Interview - Sarah Lee',
    description: 'Final round interview for Product Manager role',
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
    attendee_count: 2,
    attendees: ['hr-001', 'manager-001'],
    setup_requirements: 'Quiet environment, recording equipment for review',
    status: 'confirmed',
    notes: 'Final interview - decision to be made same day',
    cost: 25 // 1 hour * $25/hour
  },
  {
    room_id: 'room-005', // Training Room Delta
    booked_by: 'training-001',
    booking_type: 'training',
    title: 'New Employee Onboarding Workshop',
    description: 'Monthly new hire orientation and training session',
    start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2 days from now
    end_time: new Date(Date.now() + 56 * 60 * 60 * 1000).toISOString(), // 2 days + 8 hours
    attendee_count: 20,
    attendees: ['training-001', 'hr-001'],
    setup_requirements: 'Classroom style seating, laptops for each participant, presentation setup',
    catering_requirements: 'Full day catering: breakfast, lunch, and breaks',
    status: 'confirmed',
    approval_required: true,
    approved_by: 'training-manager-001',
    approved_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    notes: 'Annual mandatory training for all new hires',
    cost: 680, // 8 hours * $85/hour
    is_recurring: true,
    recurring_pattern: {
      frequency: 'monthly',
      interval: 1,
      days_of_week: [1], // Monday
      occurrences: 12
    }
  },
  {
    room_id: 'room-002', // Meeting Room Beta
    booked_by: 'user-008',
    booking_type: 'meeting',
    title: 'Sprint Planning Session',
    description: 'Agile sprint planning for development team',
    start_time: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow + 2 hours
    end_time: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // Tomorrow + 4 hours
    attendee_count: 8,
    attendees: ['user-008', 'user-009', 'user-010', 'user-011'],
    setup_requirements: 'Agile board setup, sticky notes, markers',
    status: 'confirmed',
    notes: 'Weekly recurring meeting',
    cost: 70, // 2 hours * $35/hour
    is_recurring: true,
    recurring_pattern: {
      frequency: 'weekly',
      interval: 1,
      days_of_week: [1], // Monday
      occurrences: 52
    }
  }
];

// Sample Asset Bookings
export const sampleAssetBookings: Partial<AssetBooking>[] = [
  {
    asset_id: 'asset-001', // MacBook Pro
    booked_by: 'user-012',
    booking_type: 'project',
    title: 'Client Presentation Development',
    description: 'Developing presentation materials for major client pitch',
    start_time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // 25 hours from now
    pickup_location: 'IT Equipment Room, Building A, Floor 1',
    return_location: 'IT Equipment Room, Building A, Floor 1',
    purpose: 'Creating high-fidelity presentation and demo materials',
    status: 'confirmed',
    cost: 240, // 24 hours * $10/hour
    checkout_notes: 'Includes charger, USB-C adapters, and carrying case',
    notes: 'High priority project - laptop contains specialized design software'
  },
  {
    asset_id: 'asset-002', // Epson Projector
    booked_by: 'user-001',
    booking_type: 'meeting',
    related_record_id: 'room-booking-001',
    title: 'Q1 Strategic Planning Presentation',
    description: 'High-quality projection for strategic planning meeting',
    start_time: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours from now
    end_time: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(), // 5.5 hours from now
    pickup_location: 'Conference Room Alpha - pre-installed',
    return_location: 'AV Equipment Room, Building A, Floor 3',
    purpose: 'Board-level presentation requiring 4K quality',
    status: 'confirmed',
    approval_required: true,
    approved_by: 'av-manager-001',
    approved_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    cost: 100, // 4 hours * $25/hour
    notes: 'Critical meeting - backup projector on standby'
  },
  {
    asset_id: 'asset-003', // Sony FX3 Camera
    booked_by: 'marketing-001',
    booking_type: 'other',
    title: 'Company Culture Video Production',
    description: 'Recording employee testimonials and workplace footage',
    start_time: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days from now
    end_time: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(), // 4 days from now
    pickup_location: 'Media Equipment Room, Building B, Floor 2',
    return_location: 'Media Equipment Room, Building B, Floor 2',
    purpose: 'Professional video content for recruitment and marketing',
    status: 'confirmed',
    approval_required: true,
    approved_by: 'media-manager-001',
    approved_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    cost: 840, // 24 hours * $35/hour
    checkout_notes: 'Includes tripod, extra batteries, memory cards, and lens kit',
    notes: 'Multi-day shoot - camera must be returned in original condition'
  },
  {
    asset_id: 'asset-004', // Shure SM7B Microphone
    booked_by: 'hr-001',
    booking_type: 'interview',
    related_record_id: 'interview-003',
    title: 'Executive Interview Recording',
    description: 'Recording executive interview for internal communications',
    start_time: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(), // 30 hours from now
    end_time: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(), // 32 hours from now
    pickup_location: 'Conference Room Alpha',
    return_location: 'Audio Equipment Room, Building B, Floor 2',
    purpose: 'High-quality audio recording for company-wide broadcast',
    status: 'confirmed',
    cost: 10, // 2 hours * $5/hour
    checkout_notes: 'Includes XLR cable, boom arm, and pop filter',
    notes: 'Audio quality critical - test equipment before interview'
  },
  {
    asset_id: 'asset-005', // iPad Pro
    booked_by: 'sales-001',
    booking_type: 'meeting',
    title: 'Client Demonstration - TechCorp',
    description: 'Interactive product demo for potential enterprise client',
    start_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    end_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    pickup_location: 'Sales Office, Building A, Floor 4',
    return_location: 'Mobile Device Station, Building A, Floor 1',
    purpose: 'Interactive product demonstration and contract signing',
    status: 'checked_out',
    checked_out_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    checked_out_by: 'sales-001',
    cost: 32, // 4 hours * $8/hour
    checkout_notes: 'Includes Apple Pencil, Magic Keyboard, and presentation app',
    condition_on_checkout: 'Excellent - no visible wear',
    notes: 'High-value sales opportunity - device configured with demo content'
  },
  {
    asset_id: 'asset-007', // Ring Light Kit
    booked_by: 'marketing-002',
    booking_type: 'other',
    title: 'Social Media Content Creation',
    description: 'Recording social media content and team announcements',
    start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    end_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    pickup_location: 'Marketing Studio, Building B, Floor 3',
    return_location: 'Media Equipment Room, Building B, Floor 2',
    purpose: 'Professional lighting for video content',
    status: 'confirmed',
    cost: 12, // 4 hours * $3/hour
    checkout_notes: 'Includes remote control, color filters, and carrying case',
    notes: 'Regular weekly booking for marketing content'
  },
  {
    asset_id: 'asset-008', // Zoom H6 Recorder
    booked_by: 'training-001',
    booking_type: 'training',
    title: 'Training Session Audio Recording',
    description: 'Recording training session for online course development',
    start_time: new Date(Date.now() + 46 * 60 * 60 * 1000).toISOString(), // ~2 days from now
    end_time: new Date(Date.now() + 54 * 60 * 60 * 1000).toISOString(), // ~2 days + 8 hours
    pickup_location: 'Training Room Delta',
    return_location: 'Audio Equipment Room, Building B, Floor 2',
    purpose: 'High-quality audio recording for e-learning platform',
    status: 'confirmed',
    cost: 32, // 8 hours * $4/hour
    checkout_notes: 'Includes external microphones, windscreens, and memory cards',
    notes: 'Part of new employee training program digitization project'
  }
];

// Function to generate booking data with proper IDs
export const generateBookingData = (orgId: string) => {
  const rooms = sampleMeetingRooms.map((room, index) => ({
    ...room,
    id: `room-${String(index + 1).padStart(3, '0')}`,
    org_id: orgId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const assets = sampleAssets.map((asset, index) => ({
    ...asset,
    id: `asset-${String(index + 1).padStart(3, '0')}`,
    org_id: orgId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const roomBookings = sampleRoomBookings.map((booking, index) => ({
    ...booking,
    id: `room-booking-${String(index + 1).padStart(3, '0')}`,
    org_id: orgId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const assetBookings = sampleAssetBookings.map((booking, index) => ({
    ...booking,
    id: `asset-booking-${String(index + 1).padStart(3, '0')}`,
    org_id: orgId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return {
    meetingRooms: rooms,
    assets,
    roomBookings,
    assetBookings
  };
};

// Export individual arrays for direct use
export {
  sampleMeetingRooms as meetingRooms,
  sampleAssets as assets,
  sampleRoomBookings as roomBookings,
  sampleAssetBookings as assetBookings
}; 