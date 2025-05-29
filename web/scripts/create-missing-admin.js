/**
 * Create Missing Admin Account
 * 
 * This script creates the missing admin@hrportal.com auth user
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createMissingAdmin() {
  console.log('🔧 Creating missing admin@hrportal.com account...\n');

  try {
    // Check if admin@hrportal.com auth user exists
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      return;
    }

    const existingUser = allUsers.users.find(user => user.email === 'admin@hrportal.com');
    
    if (existingUser) {
      console.log('✅ Auth user admin@hrportal.com already exists');
      console.log('   User ID:', existingUser.id);
      return;
    }

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@hrportal.com')
      .single();

    console.log('🔍 Checking existing profile...');
    
    // Create auth user
    console.log('📝 Creating auth user for admin@hrportal.com...');
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@hrportal.com',
      password: 'HRPortal2024!',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: 'System',
        last_name: 'Administrator',
        role: 'admin',
        department: 'IT',
        position: 'System Administrator'
      }
    });

    if (authError) {
      console.error('❌ Failed to create auth user:', authError.message);
      return;
    }

    console.log('✅ Auth user created successfully');
    console.log('   User ID:', authData.user.id);
    console.log('   Email:', authData.user.email);

    // Wait a moment for triggers to run
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if profile was created by trigger
    const { data: profileAfterAuth } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileAfterAuth) {
      console.log('✅ Profile automatically created by trigger');
    } else {
      // Manually create profile if trigger didn't work
      console.log('📝 Creating profile manually...');
      
      // If there was an existing profile with the email, update it to use the new auth ID
      if (existingProfile && existingProfile.id !== authData.user.id) {
        console.log('🔄 Updating existing profile to match new auth user...');
        
        // Update the existing profile's ID to match the auth user
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            id: authData.user.id,
            updated_at: new Date().toISOString()
          })
          .eq('email', 'admin@hrportal.com');

        if (updateError) {
          console.log('⚠️ Failed to update existing profile, creating new one...');
          
          // Create new profile
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              first_name: 'System',
              last_name: 'Administrator',
              email: 'admin@hrportal.com',
              role: 'admin',
              department: 'IT',
              position: 'System Administrator',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (createError) {
            console.error('❌ Failed to create new profile:', createError.message);
            return;
          }

          console.log('✅ New profile created');
        } else {
          console.log('✅ Existing profile updated with new auth ID');
        }
      } else {
        // Create completely new profile
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: 'System',
            last_name: 'Administrator',
            email: 'admin@hrportal.com',
            role: 'admin',
            department: 'IT',
            position: 'System Administrator',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createError) {
          console.error('❌ Failed to create profile:', createError.message);
          return;
        }

        console.log('✅ Profile created successfully');
      }
    }

    console.log('\n🎉 Admin account creation complete!');
    console.log('\n📝 Admin Account Credentials:');
    console.log('   Email: admin@hrportal.com');
    console.log('   Password: HRPortal2024!');
    console.log('   Role: Admin (Full Access)');
    console.log('\n🔗 You can now login at: https://hr-portal-app-dev-ita.vercel.app/login');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Main execution
if (require.main === module) {
  createMissingAdmin().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  createMissingAdmin
}; 