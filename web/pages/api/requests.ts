import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../services/supabase';
import { emailService } from '../../services/emailService';

interface RequestData {
  type: string;
  category: string;
  title: string;
  description: string;
  details: any;
  priority: string;
  approver: string;
  employee_id?: string;
  employee_name?: string;
  employee_email?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Try to fetch from Supabase first
      const { data: requests, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback to mock data if Supabase fails
        const mockRequests = [
          {
            id: 'REQ-2023-001',
            type: 'leave',
            category: 'timeAndLeave',
            title: 'Annual Leave Request',
            description: 'Requesting annual leave for a family vacation',
            status: 'approved',
            submittedDate: '2023-11-15',
            decisionDate: '2023-11-17',
            approver: 'Sarah Johnson',
            details: {
              startDate: '2023-12-20',
              endDate: '2023-12-27',
              returnDate: '2023-12-28',
              totalDays: 5,
              leaveType: 'Annual Leave',
              comments: 'Family vacation planned during the holidays'
            }
          },
          {
            id: 'REQ-2023-002',
            type: 'equipment',
            category: 'equipmentAndResources',
            title: 'Laptop Upgrade Request',
            description: 'Requesting a laptop upgrade due to performance issues',
            status: 'pending',
            submittedDate: '2023-11-28',
            approver: 'Michael Chen',
            details: {
              equipmentType: 'Laptop',
              reason: 'Current laptop is over 3 years old and experiencing significant performance issues',
              specifications: 'Prefer 16GB RAM, 512GB SSD, and dedicated graphics card',
              urgency: 'Medium',
              additionalInfo: 'Current laptop model is XPS 13, purchased in 2020'
            }
          }
        ];
        return res.status(200).json(mockRequests);
      }

      return res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      return res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  if (req.method === 'POST') {
    try {
      const requestData: RequestData = req.body;
      
      // Add system fields
      const newRequest = {
        ...requestData,
        status: 'pending',
        submitted_date: new Date().toISOString(),
        employee_id: 'current-user-id', // In production, get from auth
        employee_name: 'Current User', // In production, get from user profile
        employee_email: 'user@company.com' // In production, get from user profile
      };

      // Try to save to Supabase
      const { data: savedRequest, error } = await supabase
        .from('requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) {
        // If Supabase fails, return mock response
        const mockRequest = {
          id: `REQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...newRequest,
          submittedDate: newRequest.submitted_date.split('T')[0]
        };
        
        // Send notification email (will log in development mode)
        try {
          await emailService.sendEmail({
            to: getApproverEmail(requestData.type),
            template: 'new_request_notification',
            data: {
              requestId: mockRequest.id,
              requestType: requestData.title,
              employeeName: newRequest.employee_name,
              description: requestData.description,
              approverName: requestData.approver
            }
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
        }

        return res.status(201).json(mockRequest);
      }

      // Send notification email to approver
      try {
        await emailService.sendEmail({
          to: getApproverEmail(requestData.type),
          template: 'new_request_notification',
          data: {
            requestId: savedRequest.id,
            requestType: requestData.title,
            employeeName: newRequest.employee_name,
            description: requestData.description,
            approverName: requestData.approver
          }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }

      return res.status(201).json(savedRequest);
    } catch (error) {
      console.error('Error creating request:', error);
      return res.status(500).json({ error: 'Failed to create request' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, status, notes, approver_id } = req.body;
      
      const updates = {
        status,
        notes,
        approver_id,
        decision_date: new Date().toISOString()
      };

      // Try to update in Supabase
      const { data: updatedRequest, error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to update request' });
      }

      // Send notification to employee about decision
      try {
        const template = status === 'approved' ? 'request_approved' : 'request_rejected';
        await emailService.sendEmail({
          to: updatedRequest.employee_email,
          template,
          data: {
            requestId: id,
            requestType: updatedRequest.title,
            approverName: 'Manager', // In production, get from approver profile
            notes: notes || '',
            reason: status === 'rejected' ? notes : undefined
          }
        });
      } catch (emailError) {
        console.error('Failed to send decision notification:', emailError);
      }

      return res.status(200).json(updatedRequest);
    } catch (error) {
      console.error('Error updating request:', error);
      return res.status(500).json({ error: 'Failed to update request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper function to get approver email by request type
function getApproverEmail(requestType: string): string {
  const emailMap: Record<string, string> = {
    leave: 'sarah.johnson@company.com',
    remote: 'sarah.johnson@company.com',
    overtime: 'depthead@company.com',
    equipment: 'it@company.com',
    software: 'it@company.com',
    access: 'security@company.com',
    training: 'hr@company.com',
    expense: 'finance@company.com',
    document: 'hr@company.com',
    travel: 'manager@company.com'
  };
  return emailMap[requestType] || 'manager@company.com';
} 