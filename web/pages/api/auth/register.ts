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
    const { email, password, fullName, role, department, position, phone, hireDate } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!fullName || !department || !position) {
      return res.status(400).json({ error: "Full name, department, and position are required" });
    }

    // Parse full name into first and last name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Environment validation
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase environment variables');
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Use service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('🔧 Registering user with admin privileges:', email);

    // Development mode - simulate registration
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true"
    ) {
      console.log('🔧 Using mock auth for development');
      const mockUser = {
        id: `mock-${Date.now()}`,
        email,
        first_name: firstName || fullName?.split(" ")[0] || email.split("@")[0],
        last_name: lastName || fullName?.split(" ").slice(1).join(" ") || "",
        role,
        department,
        position,
        company: "",
        created_at: new Date().toISOString(),
      };

      return res.status(200).json({
        success: true,
        message: "Registration successful (development mode)",
        user: mockUser,
      });
    }

    // Check if user already exists in auth.users
    console.log('🔍 Checking for existing users...');
    const { data: existingAuthUsers, error: authCheckError } = await supabase.auth.admin.listUsers();
    
    if (authCheckError) {
      console.error("❌ Error checking auth users:", authCheckError.message);
      return res.status(500).json({ error: "Failed to check existing users" });
    }

    const existingAuthUser = existingAuthUsers.users.find(u => u.email === email);
    if (existingAuthUser) {
      console.log('🔍 User exists in auth.users, checking profile...');
      
      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", existingAuthUser.id)
        .single();
      
      if (existingProfile) {
        return res.status(400).json({ 
          error: "Email is already registered. Please use the login page.", 
          loginUrl: "/login" 
        });
      } else if (!profileCheckError || profileCheckError.code === 'PGRST116') {
        // User exists in auth but no profile - create profile
        console.log('🔧 Creating missing profile for existing user...');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: existingAuthUser.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            role: role || 'employee',
            department,
            position,
            hire_date: hireDate || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('❌ Profile creation failed:', profileError.message);
          return res.status(500).json({ error: "Failed to create user profile" });
        }

        return res.status(200).json({
          success: true,
          message: "Profile created for existing user. You can now login.",
          user: existingAuthUser,
        });
      } else {
        console.error('❌ Profile check error:', profileCheckError.message);
        return res.status(500).json({ error: "Database error checking profile" });
      }
    }

    // Create new user with proper metadata
    console.log('👤 Creating new user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        role: role || 'employee',
        department,
        position,
        phone,
        hireDate
      }
    });

    if (authError) {
      console.error('❌ Auth creation failed:', authError.message);
      
      // Check if it's a duplicate email error
      if (authError.message.includes('already registered') || authError.message.includes('duplicate')) {
        return res.status(400).json({ 
          error: "Email is already registered. Please use the login page.", 
          loginUrl: "/login" 
        });
      }
      
      return res.status(400).json({ error: authError.message });
    }

    console.log('✅ User created successfully:', authData.user.id);

    // Wait a moment for trigger to execute
    console.log('⏳ Waiting for database trigger...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify profile was created by trigger
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileFetchError || !profile) {
      console.log('⚠️ Trigger did not create profile, creating manually...');
      console.log('Profile fetch error:', profileFetchError?.message || 'No profile found');
      
      // Manually create profile if trigger failed
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          role: role || 'employee',
          department,
          position,
          hire_date: hireDate || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('❌ Manual profile creation failed:', profileError.message);
        return res.status(500).json({ 
          error: "Failed to create user profile",
          details: profileError.message 
        });
      }
      
      console.log('✅ Profile created manually');
    } else {
      console.log('✅ Profile created by trigger');
    }

    // Create employee record if role is employee
    if (role === "employee") {
      console.log('👥 Creating employee record...');
      const employeeRecord = {
        profile_id: authData.user.id,
        employee_id: `EMP${Date.now().toString().slice(-6)}`,
        status: "active",
        employment_type: "full-time",
        start_date: new Date().toISOString().split("T")[0],
        department,
        position,
      };

      const { error: employeeError } = await supabase
        .from("employees")
        .insert(employeeRecord);

      if (employeeError) {
        console.error("⚠️ Employee record creation failed:", employeeError.message);
        // Continue anyway, this is not critical
      } else {
        console.log('✅ Employee record created');
      }
    }

    console.log('🎉 Registration completed successfully');
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: authData.user,
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      error: "Registration failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
