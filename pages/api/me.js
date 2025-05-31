import { supabase } from '../../lib/supabase/client';

/**
 * API endpoint to get the current user information
 * This fixes the 404 error showing in the console
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user from the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw sessionError;
    }
    
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Get the user details including profile information
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (userError) {
      throw userError;
    }
    
    // Return the user information
    return res.status(200).json({
      user: {
        ...session.user,
        profile: user || {}
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Failed to fetch user information' });
  }
} 