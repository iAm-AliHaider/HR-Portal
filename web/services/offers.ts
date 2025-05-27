import { supabase } from '../lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Offer } from '../../packages/types';
import { updateApplication } from './applications';

// Type for offer status based on the Offer interface
type OfferStatus = Offer['status'];

// Mock offers data
const mockOffers: Offer[] = [
  {
    id: 'offer1',
    org_id: 'org1',
    application_id: 'app1',
    job_id: 'job1',
    candidate_id: 'user10',
    status: 'sent' as OfferStatus, // Changed from 'pending' to match the type
    position_title: 'Senior Frontend Developer',
    salary: {
      amount: 125000,
      currency: 'USD',
      period: 'yearly'
    },
    equity: {
      amount: 0.05,
      type: 'options',
      vesting_schedule: '4 years with 1 year cliff'
    },
    equity_description: '0.05% equity',
    bonus: [{
      amount: 12500,
      currency: 'USD',
      type: 'performance',
      conditions: 'Annual performance bonus based on company and individual goals'
    }],
    start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    benefits: [
      'Health insurance',
      'Dental and vision coverage',
      '401(k) with 4% matching',
      'Unlimited PTO',
      'Remote work flexibility'
    ],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    created_by: 'user1',
    approved_by: ['user5'], // Changed to array as per the type
    notes: 'Strong candidate with excellent technical skills and cultural fit.'
  }
];

export async function getOffers(org_id: string): Promise<Offer[]> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('offers').select('*').eq('org_id', org_id);
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return mockOffers.filter(offer => offer.org_id === org_id);
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
}

export async function getOfferById(id: string): Promise<Offer | null> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('offers').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    const offer = mockOffers.find(offer => offer.id === id);
    return offer || null;
  } catch (error) {
    console.error(`Error fetching offer with ID ${id}:`, error);
    throw error;
  }
}

export async function getOffersByApplicationId(application_id: string): Promise<Offer[]> {
  try {
    // In a real application, this would fetch from Supabase
    // const { data, error } = await supabase.from('offers').select('*').eq('application_id', application_id);
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return mockOffers.filter(offer => offer.application_id === application_id);
  } catch (error) {
    console.error(`Error fetching offers for application ID ${application_id}:`, error);
    throw error;
  }
}

export async function createOffer(offer: Partial<Offer>): Promise<Offer> {
  try {
    const now = new Date().toISOString();
    
    const newOffer: Offer = {
      ...offer,
      id: offer.id || uuidv4(),
      org_id: offer.org_id || 'org1',
      status: 'draft',
      created_at: now,
      created_by: offer.created_by || 'user1',
    } as Offer;
    
    // In a real application, this would insert into Supabase
    // const { data, error } = await supabase.from('offers').insert([newOffer]).select().single();
    // if (error) throw error;
    // return data;
    
    // For now, add to mock data
    mockOffers.push(newOffer);
    
    // Update application
    if (newOffer.application_id) {
      await updateApplication(newOffer.application_id, {
        last_activity_date: now
      });
    }
    
    return newOffer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
}

export async function updateOffer(id: string, updates: Partial<Offer>): Promise<Offer> {
  try {
    // In a real application, this would update in Supabase
    // const { data, error } = await supabase.from('offers').update(updates).eq('id', id).select().single();
    // if (error) throw error;
    // return data;
    
    // For now, update mock data
    const index = mockOffers.findIndex(offer => offer.id === id);
    if (index === -1) throw new Error(`Offer with ID ${id} not found`);
    
    mockOffers[index] = {
      ...mockOffers[index],
      ...updates
    };
    
    // Update application
    if (mockOffers[index].application_id) {
      await updateApplication(mockOffers[index].application_id, {
        last_activity_date: new Date().toISOString()
      });
    }
    
    return mockOffers[index];
  } catch (error) {
    console.error(`Error updating offer with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteOffer(id: string): Promise<void> {
  try {
    // In a real application, this would delete from Supabase
    // const { error } = await supabase.from('offers').delete().eq('id', id);
    // if (error) throw error;
    
    // For now, remove from mock data
    const index = mockOffers.findIndex(offer => offer.id === id);
    if (index !== -1) {
      // Update application before deleting
      if (mockOffers[index].application_id) {
        await updateApplication(mockOffers[index].application_id, {
          last_activity_date: new Date().toISOString()
        });
      }
      
      mockOffers.splice(index, 1);
    }
  } catch (error) {
    console.error(`Error deleting offer with ID ${id}:`, error);
    throw error;
  }
}

export async function submitOfferForApproval(id: string): Promise<Offer> {
  try {
    return updateOffer(id, {
      status: 'pending_approval',
      submitted_at: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error submitting offer ${id} for approval:`, error);
    throw error;
  }
}

export async function approveOffer(id: string, approverId: string): Promise<Offer> {
  try {
    const now = new Date().toISOString();
    return updateOffer(id, {
      status: 'approved',
      approved_by: [approverId],
    });
  } catch (error) {
    console.error(`Error approving offer ${id}:`, error);
    throw error;
  }
}

export async function rejectOffer(id: string, rejectorId: string, reason: string): Promise<Offer> {
  try {
    const now = new Date().toISOString();
    return updateOffer(id, {
      status: 'rejected',
      rejected_at: now,
      notes: reason
    });
  } catch (error) {
    console.error(`Error rejecting offer ${id}:`, error);
    throw error;
  }
}

export async function sendOffer(id: string): Promise<Offer> {
  try {
    const now = new Date().toISOString();
    const offer = await updateOffer(id, {
      status: 'sent',
      sent_at: now
    });
    
    // Update application status
    if (offer.application_id) {
      await updateApplication(offer.application_id, {
        status: 'offered',
        last_activity_date: now
      });
    }
    
    return offer;
  } catch (error) {
    console.error(`Error sending offer ${id}:`, error);
    throw error;
  }
}

export async function candidateAcceptOffer(id: string, notes?: string): Promise<Offer> {
  try {
    const now = new Date().toISOString();
    const offer = await updateOffer(id, {
      status: 'accepted',
      accepted_at: now,
      candidate_notes: notes
    });
    
    // Update application status
    if (offer.application_id) {
      await updateApplication(offer.application_id, {
        status: 'hired',
        last_activity_date: now
      });
    }
    
    return offer;
  } catch (error) {
    console.error(`Error accepting offer ${id}:`, error);
    throw error;
  }
}

export async function candidateDeclineOffer(id: string, reason: string): Promise<Offer> {
  try {
    const now = new Date().toISOString();
    const offer = await updateOffer(id, {
      status: 'rejected',
      rejected_at: now,
      candidate_notes: reason
    });
    
    // Update application status
    if (offer.application_id) {
      await updateApplication(offer.application_id, {
        status: 'rejected',
        last_activity_date: now
      });
    }
    
    return offer;
  } catch (error) {
    console.error(`Error declining offer ${id}:`, error);
    throw error;
  }
}

export async function extendOfferDeadline(id: string, newDeadline: string): Promise<Offer> {
  try {
    return updateOffer(id, {
      expiration_date: newDeadline
    });
  } catch (error) {
    console.error(`Error extending deadline for offer ${id}:`, error);
    throw error;
  }
}

export function getOfferStatuses(): { value: OfferStatus, label: string }[] {
  return [
    { value: 'draft', label: 'Draft' },
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Approval Rejected' },
    { value: 'sent', label: 'Sent to Candidate' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Declined' },
    { value: 'expired', label: 'Expired' }
  ];
}

export function getCommonBenefits(): string[] {
  return [
    'Health insurance',
    'Dental and vision coverage',
    '401(k) with employer match',
    'Life insurance',
    'Disability insurance',
    'Paid time off',
    'Paid sick leave',
    'Paid parental leave',
    'Remote work flexibility',
    'Professional development budget',
    'Wellness program',
    'Home office stipend',
    'Stock options',
    'Performance bonuses',
    'Flexible spending account (FSA)',
    'Health savings account (HSA)',
    'Company phone/laptop',
    'Gym membership',
    'Relocation assistance',
    'Employee assistance program',
    'Commuter benefits',
    'Childcare assistance',
    'Tuition reimbursement'
  ];
} 