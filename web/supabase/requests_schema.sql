-- Requests Table Schema
-- This schema supports the comprehensive request management system

-- Drop existing tables if they exist
DROP TABLE IF EXISTS request_approvals CASCADE;
DROP TABLE IF EXISTS request_attachments CASCADE;
DROP TABLE IF EXISTS requests CASCADE;

-- Create requests table
CREATE TABLE requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_number VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'under_review')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Request details (JSON for flexibility)
    details JSONB DEFAULT '{}',
    
    -- Employee information
    employee_id UUID NOT NULL,
    employee_name VARCHAR(255),
    employee_email VARCHAR(255),
    department VARCHAR(100),
    
    -- Approval information
    approver_id UUID,
    approver_name VARCHAR(255),
    approver_email VARCHAR(255),
    approval_date TIMESTAMP WITH TIME ZONE,
    
    -- Decision details
    decision_notes TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE,
    
    -- Workflow
    current_step VARCHAR(100),
    workflow_id UUID,
    
    -- Additional metadata
    tags TEXT[],
    is_urgent BOOLEAN DEFAULT false,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Create request attachments table
CREATE TABLE request_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES employees(id) ON DELETE CASCADE
);

-- Create request approvals table (for multi-level approvals)
CREATE TABLE request_approvals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL,
    approver_id UUID NOT NULL,
    approval_level INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'delegated')),
    decision_date TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    delegated_to UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES employees(id),
    FOREIGN KEY (delegated_to) REFERENCES employees(id)
);

-- Create indexes for better performance
CREATE INDEX idx_requests_employee_id ON requests(employee_id);
CREATE INDEX idx_requests_approver_id ON requests(approver_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_type ON requests(type);
CREATE INDEX idx_requests_category ON requests(category);
CREATE INDEX idx_requests_submitted_date ON requests(submitted_date DESC);
CREATE INDEX idx_requests_request_number ON requests(request_number);

-- Create function to auto-generate request number
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.request_number := 'REQ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('request_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for request numbers
CREATE SEQUENCE IF NOT EXISTS request_number_seq START 1;

-- Create trigger for auto-generating request number
CREATE TRIGGER set_request_number
    BEFORE INSERT ON requests
    FOR EACH ROW
    WHEN (NEW.request_number IS NULL)
    EXECUTE FUNCTION generate_request_number();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_requests_updated_at
    BEFORE UPDATE ON requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_approvals ENABLE ROW LEVEL SECURITY;

-- Policies for requests table
-- Employees can view their own requests
CREATE POLICY "Employees can view own requests" ON requests
    FOR SELECT
    USING (auth.uid() = employee_id);

-- Employees can create their own requests
CREATE POLICY "Employees can create own requests" ON requests
    FOR INSERT
    WITH CHECK (auth.uid() = employee_id);

-- Employees can update their own pending requests
CREATE POLICY "Employees can update own pending requests" ON requests
    FOR UPDATE
    USING (auth.uid() = employee_id AND status = 'pending');

-- Approvers can view requests assigned to them
CREATE POLICY "Approvers can view assigned requests" ON requests
    FOR SELECT
    USING (auth.uid() = approver_id);

-- Approvers can update requests assigned to them
CREATE POLICY "Approvers can update assigned requests" ON requests
    FOR UPDATE
    USING (auth.uid() = approver_id);

-- HR and Admin can view all requests
CREATE POLICY "HR and Admin can view all requests" ON requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM employees 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'hr_director', 'hr_manager')
        )
    );

-- Sample data for testing
INSERT INTO requests (
    type, category, title, description, status, priority,
    employee_id, employee_name, employee_email, department,
    approver_id, approver_name, approver_email,
    details
) VALUES
(
    'leave', 'timeAndLeave', 'Annual Leave Request', 
    'Requesting annual leave for family vacation',
    'approved', 'medium',
    '00000000-0000-0000-0000-000000000001', 'John Doe', 'john.doe@company.com', 'Engineering',
    '00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'sarah.johnson@company.com',
    '{
        "leaveType": "Annual Leave",
        "startDate": "2024-12-20",
        "endDate": "2024-12-27",
        "returnDate": "2024-12-28",
        "totalDays": 5,
        "reason": "Family vacation planned during the holidays"
    }'::jsonb
),
(
    'equipment', 'equipmentAndResources', 'Laptop Upgrade Request',
    'Requesting a laptop upgrade due to performance issues',
    'pending', 'high',
    '00000000-0000-0000-0000-000000000001', 'John Doe', 'john.doe@company.com', 'Engineering',
    '00000000-0000-0000-0000-000000000003', 'Michael Chen', 'michael.chen@company.com',
    '{
        "equipmentType": "Laptop",
        "reason": "Current laptop is over 3 years old and experiencing significant performance issues",
        "specifications": "Prefer 16GB RAM, 512GB SSD, and dedicated graphics card",
        "urgency": "high",
        "additionalInfo": "Current laptop model is XPS 13, purchased in 2020"
    }'::jsonb
);

-- Grant necessary permissions
GRANT ALL ON requests TO authenticated;
GRANT ALL ON request_attachments TO authenticated;
GRANT ALL ON request_approvals TO authenticated;
GRANT USAGE ON SEQUENCE request_number_seq TO authenticated; 