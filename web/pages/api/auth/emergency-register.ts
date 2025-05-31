import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, name, role, department, position, phone, hireDate } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Use service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('🚨 Emergency registration for:', email);

    // Create user with admin API (bypasses triggers)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        role: role || 'admin',
        department: department || 'Administration',
        position: position || 'Administrator',
        phone,
        hireDate
      }
    });

    if (authError) {
      console.error('Auth creation failed:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Manually create profile (bypassing trigger)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role: role || 'admin',
        department: department || 'Administration',
        position: position || 'Administrator',
        hire_date: hireDate || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      // Don't fail - user can still login
    }

    return res.status(200).json({
      success: true,
      message: "Emergency registration successful",
      user: authData.user,
    });

  } catch (error) {
    console.error("Emergency registration error:", error);
    return res.status(500).json({
      error: "Emergency registration failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
} 