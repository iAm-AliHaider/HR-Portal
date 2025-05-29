/**
 * Fix Specific User Profile
 * 
 * This script fixes the profile for the specific user ID showing in the console errors
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

async function fixSpecificUserProfile() {
  console.log('🔧 Fixing profile for specific user from console errors...\n');

  try {
    // The user ID from the console error
    const problemUserId = '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb';
    
    console.log(`🔍 Checking auth user: ${problemUserId}`);
    
    // Get auth user details
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(problemUserId);
    
    if (authError) {
      console.error('❌ Auth user not found:', authError.message);
      return;
    }
    
    console.log('✅ Auth user found:');
    console.log(`   Email: ${authUser.user.email}`);
    console.log(`   Created: ${authUser.user.created_at}`);
    console.log(`   Confirmed: ${authUser.user.email_confirmed_at ? 'Yes' : 'No'}`);
    
    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', problemUserId)
      .single();
    
    if (existingProfile) {
      console.log('✅ Profile already exists:');
      console.log(`   Name: ${existingProfile.first_name} ${existingProfile.last_name}`);
      console.log(`   Role: ${existingProfile.role}`);
      console.log('   ✅ No action needed');
      return;
    }
    
    console.log('⚠️ Profile not found, creating...');
    
    // Determine if this should be an admin user
    const email = authUser.user.email;
    const isAdmin = email === 'sanfa360@gmail.com' || 
                   email === 'admin@yourcompany.com' || 
                   email === 'admin@hrportal.com' ||
                   email?.includes('admin');
    
    const role = isAdmin ? 'admin' : 'employee';
    
    // Create profile
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: problemUserId,
        first_name: isAdmin ? 'Admin' : 'User',
        last_name: isAdmin ? 'User' : 'Employee',
        email: email,
        role: role,
        department: isAdmin ? 'IT' : 'General',
        position: isAdmin ? 'Administrator' : 'Employee',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (createError) {
      console.error('❌ Failed to create profile:', createError.message);
      return;
    }
    
    console.log('✅ Profile created successfully:');
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   ID: ${problemUserId}`);
    
    // Also check for any other users missing profiles
    console.log('\n🔍 Checking for other users missing profiles...');
    
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      return;
    }
    
    console.log(`📊 Found ${allUsers.users.length} total auth users`);
    
    let fixedCount = 0;
    
    for (const user of allUsers.users) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (!profile) {
        console.log(`⚠️ Missing profile for: ${user.email} (${user.id})`);
        
        const userIsAdmin = user.email === 'sanfa360@gmail.com' || 
                           user.email === 'admin@yourcompany.com' || 
                           user.email === 'admin@hrportal.com' ||
                           user.email?.includes('admin');
        
        const userRole = userIsAdmin ? 'admin' : 'employee';
        
        const { error: fixError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: userIsAdmin ? 'Admin' : 'User',
            last_name: userIsAdmin ? 'User' : 'Employee',
            email: user.email,
            role: userRole,
            department: userIsAdmin ? 'IT' : 'General',
            position: userIsAdmin ? 'Administrator' : 'Employee',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (fixError) {
          console.log(`   ❌ Failed: ${fixError.message}`);
        } else {
          console.log(`   ✅ Created profile with role: ${userRole}`);
          fixedCount++;
        }
      }
    }
    
    console.log(`\n🎉 Profile fixes complete! Fixed ${fixedCount} additional profiles.`);
    console.log('\n📝 Next steps:');
    console.log('1. Go to: https://hr-portal-app-dev-ita.vercel.app/login');
    console.log('2. Log in with: sanfa360@gmail.com / HRPortal2024!');
    console.log('3. You should now have admin access');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Main execution
if (require.main === module) {
  fixSpecificUserProfile().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  fixSpecificUserProfile
}; 