import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      fullName, 
      role = 'employee',
      department = '',
      position = '',
      companyName = ''
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Development mode - simulate registration
    if (process.env.NODE_ENV === 'development') {
      // Create a mock user profile
      const mockUser = {
        id: `mock-${Date.now()}`,
        email,
        first_name: firstName || fullName?.split(' ')[0] || email.split('@')[0],
        last_name: lastName || fullName?.split(' ').slice(1).join(' ') || '',
        role,
        department,
        position,
        company: companyName,
        created_at: new Date().toISOString()
      };

      // Store in localStorage for development
      if (typeof window !== 'undefined') {
        const existingUsers = JSON.parse(localStorage.getItem('dev_users') || '[]');
        existingUsers.push(mockUser);
        localStorage.setItem('dev_users', JSON.stringify(existingUsers));
      }

      return res.status(200).json({
        success: true,
        message: 'Registration successful (development mode)',
        user: mockUser
      });
    }

    // Production mode - use Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || fullName?.split(' ')[0] || email.split('@')[0],
          last_name: lastName || fullName?.split(' ').slice(1).join(' ') || '',
          role,
          department,
          position,
          company: companyName,
          user_type: 'employee'
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify profile was created and update if needed
    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        // Manually create profile if trigger failed
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: firstName || fullName?.split(' ')[0] || email.split('@')[0],
            last_name: lastName || fullName?.split(' ').slice(1).join(' ') || '',
            email,
            role,
            department,
            position,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Profile creation failed:', insertError);
        }
      }

      // Create employee record if role is employee
      if (role === 'employee') {
        await supabase
          .from('employees')
          .insert({
            profile_id: authData.user.id,
            employee_id: `EMP${Date.now().toString().slice(-6)}`,
            status: 'active',
            employment_type: 'full-time',
            start_date: new Date().toISOString().split('T')[0],
            department,
            position
          });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: authData.user
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Registration failed. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 