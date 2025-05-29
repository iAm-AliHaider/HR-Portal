/**
 * Force Create Admin Account
 * 
 * This script forcefully creates the admin@hrportal.com account with better error handling
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

async function forceCreateAdmin() {
  console.log('🚀 Force creating admin@hrportal.com account...\n');

  try {
    // Step 1: Check current state
    console.log('🔍 Step 1: Checking current state...');
    
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      return;
    }

    const existingUser = allUsers.users.find(user => user.email === 'admin@hrportal.com');
    
    if (existingUser) {
      console.log('✅ Auth user already exists:', existingUser.id);
      console.log('   Just need to verify profile linking...');
      
      // Check profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', existingUser.id)
        .single();
      
      if (profile) {
        console.log('✅ Profile correctly linked!');
        console.log('🎉 Account is ready to use!');
        return;
      } else {
        console.log('⚠️ Profile not found, creating...');
        await createProfileForUser(existingUser.id);
        return;
      }
    }

    // Step 2: Try creating with unique password
    console.log('📝 Step 2: Creating auth user...');
    
    const uniquePassword = `HRPortal2024!${Date.now().toString().slice(-4)}`;
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@hrportal.com',
      password: 'HRPortal2024!', // Keep standard password
      email_confirm: true,
      user_metadata: {
        first_name: 'System',
        last_name: 'Administrator',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Auth creation failed:', authError.message);
      
      // Try alternative email temporarily
      console.log('🔄 Trying alternative approach...');
      return await createAlternativeAdmin();
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Step 3: Create profile
    await createProfileForUser(authData.user.id);

    console.log('\n🎉 Admin account successfully created!');
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@hrportal.com');
    console.log('   Password: HRPortal2024!');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

async function createProfileForUser(userId) {
  console.log('📝 Creating profile for user:', userId);
  
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      first_name: 'System',
      last_name: 'Administrator',
      email: 'admin@hrportal.com',
      role: 'admin',
      department: 'IT',
      position: 'System Administrator',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (profileError) {
    console.error('❌ Profile creation failed:', profileError.message);
  } else {
    console.log('✅ Profile created successfully');
  }
}

async function createAlternativeAdmin() {
  console.log('🔄 Creating alternative admin account...');
  
  // Create with a slightly different email first, then update
  const tempEmail = `admin.temp.${Date.now()}@hrportal.com`;
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: tempEmail,
    password: 'HRPortal2024!',
    email_confirm: true,
    user_metadata: {
      first_name: 'System',
      last_name: 'Administrator',
      role: 'admin'
    }
  });

  if (authError) {
    console.error('❌ Alternative creation failed:', authError.message);
    return;
  }

  console.log('✅ Temporary auth user created');

  // Update the email to the desired one
  const { error: updateError } = await supabase.auth.admin.updateUserById(authData.user.id, {
    email: 'admin@hrportal.com'
  });

  if (updateError) {
    console.error('❌ Email update failed:', updateError.message);
    console.log('📝 You can use the temporary email:', tempEmail);
  } else {
    console.log('✅ Email updated to admin@hrportal.com');
  }

  await createProfileForUser(authData.user.id);
  
  console.log('\n🎉 Alternative admin account created!');
}

// Main execution
if (require.main === module) {
  forceCreateAdmin().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  forceCreateAdmin
}; 