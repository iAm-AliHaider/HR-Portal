import { supabase } from '../../lib/supabase/client';

/**
 * API endpoint to get the current user information
 * This fixes the 404 error showing in the console
 */
export default async function handler(req, res) {
  // Add CORS headers to allow the API to be called from different origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user from the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return res.status(401).json({ error: 'Authentication error', details: sessionError.message });
    }
    
    if (!session) {
      console.log('No session found');
      return res.status(200).json({ 
        user: null,
        message: 'Not authenticated' 
      });
    }
    
    // Get the user details including profile information
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (userError && userError.code !== 'PGRST116') { // PGRST116 is "no rows returned" - not a critical error
      console.error('User fetch error:', userError);
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
    console.error('Error in /api/me endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch user information',
      details: error.message
    });
  }
} 