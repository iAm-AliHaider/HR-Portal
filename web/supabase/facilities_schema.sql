-- Facilities Management Schema
-- This schema supports meeting rooms, equipment booking, and facility resources

-- Drop existing tables if they exist
DROP TABLE IF EXISTS equipment_bookings CASCADE;
DROP TABLE IF EXISTS room_bookings CASCADE;
DROP TABLE IF EXISTS equipment_inventory CASCADE;
DROP TABLE IF EXISTS meeting_rooms CASCADE;
DROP TABLE IF EXISTS facility_maintenance CASCADE;

-- Create meeting rooms table
CREATE TABLE meeting_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    floor VARCHAR(50),
    building VARCHAR(100),
    capacity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
    features TEXT[],
    equipment TEXT[],
    description TEXT,
    image_url TEXT,
    
    -- Location details
    room_number VARCHAR(20),
    area_sqft INTEGER,
    
    -- Booking settings
    min_booking_duration INTEGER DEFAULT 30, -- in minutes
    max_booking_duration INTEGER DEFAULT 480, -- in minutes
    advance_booking_days INTEGER DEFAULT 30,
    requires_approval BOOLEAN DEFAULT false,
    
    -- Contact information
    facility_manager_id UUID,
    contact_number VARCHAR(20),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(name, building)
);

-- Create equipment inventory table
CREATE TABLE equipment_inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance', 'retired')),
    specifications JSONB DEFAULT '{}',
    
    -- Purchase information
    purchase_date DATE,
    purchase_price DECIMAL(10, 2),
    warranty_expiry DATE,
    vendor VARCHAR(100),
    
    -- Location
    current_location VARCHAR(100),
    home_location VARCHAR(100),
    
    -- Booking settings
    bookable BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    max_booking_days INTEGER DEFAULT 7,
    
    -- Maintenance
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room bookings table
CREATE TABLE room_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Booking details
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Organizer information
    booked_by UUID NOT NULL,
    booked_by_name VARCHAR(255),
    booked_by_email VARCHAR(255),
    department VARCHAR(100),
    
    -- Attendees
    attendee_count INTEGER,
    attendee_emails TEXT[],
    external_attendees TEXT[],
    
    -- Status
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    cancellation_reason TEXT,
    cancelled_by UUID,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Meeting details
    meeting_type VARCHAR(50),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB,
    parent_booking_id UUID, -- For recurring meetings
    
    -- Additional requirements
    special_requirements TEXT,
    catering_required BOOLEAN DEFAULT false,
    av_equipment_required BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    FOREIGN KEY (room_id) REFERENCES meeting_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (booked_by) REFERENCES employees(id),
    FOREIGN KEY (cancelled_by) REFERENCES employees(id),
    FOREIGN KEY (parent_booking_id) REFERENCES room_bookings(id) ON DELETE CASCADE,
    CHECK (end_time > start_time)
);

-- Create equipment bookings table
CREATE TABLE equipment_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id UUID NOT NULL,
    purpose TEXT NOT NULL,
    
    -- Booking period
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_time TIME,
    return_time TIME,
    
    -- Borrower information
    booked_by UUID NOT NULL,
    booked_by_name VARCHAR(255),
    booked_by_email VARCHAR(255),
    department VARCHAR(100),
    
    -- Status
    status VARCHAR(20) DEFAULT 'reserved' CHECK (status IN ('reserved', 'checked_out', 'returned', 'overdue', 'cancelled')),
    
    -- Check-out/Return details
    checked_out_at TIMESTAMP WITH TIME ZONE,
    checked_out_by UUID,
    returned_at TIMESTAMP WITH TIME ZONE,
    returned_to UUID,
    condition_on_return TEXT,
    
    -- Additional details
    project_name VARCHAR(200),
    notes TEXT,
    approved_by UUID,
    approval_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    FOREIGN KEY (equipment_id) REFERENCES equipment_inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (booked_by) REFERENCES employees(id),
    FOREIGN KEY (checked_out_by) REFERENCES employees(id),
    FOREIGN KEY (returned_to) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES employees(id),
    CHECK (end_date >= start_date)
);

-- Create facility maintenance table
CREATE TABLE facility_maintenance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(20) CHECK (type IN ('room', 'equipment')),
    resource_id UUID NOT NULL,
    
    -- Issue details
    issue_description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Reporting
    reported_by UUID NOT NULL,
    reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Assignment
    assigned_to UUID,
    assigned_date TIMESTAMP WITH TIME ZONE,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'reported' CHECK (status IN ('reported', 'assigned', 'in_progress', 'completed', 'cancelled')),
    
    -- Resolution
    resolution_notes TEXT,
    resolved_date TIMESTAMP WITH TIME ZONE,
    resolved_by UUID,
    
    -- Cost tracking
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    FOREIGN KEY (reported_by) REFERENCES employees(id),
    FOREIGN KEY (assigned_to) REFERENCES employees(id),
    FOREIGN KEY (resolved_by) REFERENCES employees(id)
);

-- Create indexes for better performance
CREATE INDEX idx_room_bookings_room_id ON room_bookings(room_id);
CREATE INDEX idx_room_bookings_start_time ON room_bookings(start_time);
CREATE INDEX idx_room_bookings_booked_by ON room_bookings(booked_by);
CREATE INDEX idx_room_bookings_status ON room_bookings(status);

CREATE INDEX idx_equipment_bookings_equipment_id ON equipment_bookings(equipment_id);
CREATE INDEX idx_equipment_bookings_start_date ON equipment_bookings(start_date);
CREATE INDEX idx_equipment_bookings_booked_by ON equipment_bookings(booked_by);
CREATE INDEX idx_equipment_bookings_status ON equipment_bookings(status);

CREATE INDEX idx_facility_maintenance_resource_id ON facility_maintenance(resource_id);
CREATE INDEX idx_facility_maintenance_status ON facility_maintenance(status);

-- Create function to check room availability
CREATE OR REPLACE FUNCTION check_room_availability(
    p_room_id UUID,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM room_bookings
        WHERE room_id = p_room_id
        AND status IN ('confirmed', 'pending')
        AND id != COALESCE(p_exclude_booking_id, '00000000-0000-0000-0000-000000000000')
        AND (
            (start_time <= p_start_time AND end_time > p_start_time) OR
            (start_time < p_end_time AND end_time >= p_end_time) OR
            (start_time >= p_start_time AND end_time <= p_end_time)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to check equipment availability
CREATE OR REPLACE FUNCTION check_equipment_availability(
    p_equipment_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM equipment_bookings
        WHERE equipment_id = p_equipment_id
        AND status IN ('reserved', 'checked_out')
        AND id != COALESCE(p_exclude_booking_id, '00000000-0000-0000-0000-000000000000')
        AND start_date <= p_end_date
        AND end_date >= p_start_date
    );
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE meeting_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_maintenance ENABLE ROW LEVEL SECURITY;

-- Policies for meeting rooms (everyone can view)
CREATE POLICY "Everyone can view meeting rooms" ON meeting_rooms
    FOR SELECT
    USING (true);

-- Policies for equipment inventory (everyone can view)
CREATE POLICY "Everyone can view equipment" ON equipment_inventory
    FOR SELECT
    USING (true);

-- Policies for room bookings
CREATE POLICY "Users can view all room bookings" ON room_bookings
    FOR SELECT
    USING (true);

CREATE POLICY "Users can create own bookings" ON room_bookings
    FOR INSERT
    WITH CHECK (auth.uid() = booked_by);

CREATE POLICY "Users can update own bookings" ON room_bookings
    FOR UPDATE
    USING (auth.uid() = booked_by AND status = 'confirmed');

-- Sample data
INSERT INTO meeting_rooms (name, floor, building, capacity, features, equipment, status) VALUES
('Conference Room A', '3rd Floor', 'Main Building', 10, 
 ARRAY['Projector', 'Whiteboard', 'Video Conference'], 
 ARRAY['65" TV Screen', 'Conference Phone', 'Markers'], 
 'available'),
('Board Room', '5th Floor', 'Main Building', 20, 
 ARRAY['Large Screen', 'Video Conference', 'Audio System'], 
 ARRAY['85" Display', 'Premium Audio', 'Wireless Presentation'], 
 'available'),
('Small Meeting Room 1', '2nd Floor', 'Main Building', 4, 
 ARRAY['TV Screen', 'Whiteboard'], 
 ARRAY['42" TV', 'HDMI Cable'], 
 'available');

INSERT INTO equipment_inventory (name, type, model, status, specifications) VALUES
('Dell Laptop #1', 'Laptop', 'XPS 15', 'available', 
 '{"processor": "Intel i5", "ram": "8GB", "storage": "256GB SSD"}'::jsonb),
('Projector - Epson', 'Projector', 'Epson EB-X41', 'available',
 '{"resolution": "1080p", "connectivity": ["HDMI", "VGA"], "brightness": "3600 lumens"}'::jsonb),
('Conference Camera', 'Camera', 'Logitech Rally', 'available',
 '{"resolution": "4K", "fov": "Wide Angle", "connection": "USB-C"}'::jsonb);

-- Grant permissions
GRANT ALL ON meeting_rooms TO authenticated;
GRANT ALL ON equipment_inventory TO authenticated;
GRANT ALL ON room_bookings TO authenticated;
GRANT ALL ON equipment_bookings TO authenticated;
GRANT ALL ON facility_maintenance TO authenticated; 