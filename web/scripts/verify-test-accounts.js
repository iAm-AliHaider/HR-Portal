/**
 * Verify Test Accounts in HR Portal
 * 
 * This script verifies existing test accounts and their profiles
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

const TEST_EMAILS = [
  'admin@hrportal.com',
  'hr@hrportal.com',
  'manager@hrportal.com',
  'employee@hrportal.com',
  'recruiter@hrportal.com'
];

async function verifyTestAccounts() {
  console.log('🔍 Verifying test accounts in HR Portal...\n');

  try {
    // List all auth users
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      return;
    }

    console.log(`📊 Found ${allUsers.users.length} total auth users\n`);

    // Check each test account
    for (const email of TEST_EMAILS) {
      console.log(`\n🔍 Checking ${email}:`);
      
      // Find auth user
      const authUser = allUsers.users.find(user => user.email === email);
      
      if (!authUser) {
        console.log(`❌ Auth user not found`);
        continue;
      }
      
      console.log(`✅ Auth user exists (ID: ${authUser.id})`);
      console.log(`   Email confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   Created: ${new Date(authUser.created_at).toLocaleDateString()}`);
      
      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (profileError) {
        console.log(`❌ Profile error: ${profileError.message}`);
      } else if (profile) {
        console.log(`✅ Profile exists`);
        console.log(`   Name: ${profile.first_name} ${profile.last_name}`);
        console.log(`   Role: ${profile.role}`);
        console.log(`   Department: ${profile.department || 'N/A'}`);
      } else {
        console.log(`❌ Profile not found`);
      }
      
      // Check if profile exists by email (might be duplicated)
      const { data: profileByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);
      
      if (profileByEmail && profileByEmail.length > 0) {
        console.log(`📧 Profile(s) found by email: ${profileByEmail.length}`);
        profileByEmail.forEach((p, index) => {
          console.log(`   Profile ${index + 1}: ID ${p.id}, Role: ${p.role}`);
        });
      }
    }

    // List all profiles to check for duplicates
    console.log('\n📋 All profiles in database:');
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role')
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      console.error('❌ Failed to list profiles:', profilesError.message);
    } else {
      allProfiles.forEach(profile => {
        console.log(`   ${profile.email}: ${profile.first_name} ${profile.last_name} (${profile.role}) - ID: ${profile.id}`);
      });
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

// Check database schema
async function checkSchema() {
  console.log('\n🗄️ Checking database schema...\n');
  
  try {
    // Check if profiles table exists and its structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Profiles table error:', error.message);
    } else {
      console.log('✅ Profiles table accessible');
    }
    
    // Check if employees table exists
    const { data: empData, error: empError } = await supabase
      .from('employees')
      .select('*')
      .limit(1);
    
    if (empError) {
      console.error('❌ Employees table error:', empError.message);
    } else {
      console.log('✅ Employees table accessible');
    }
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }
}

// Main execution
if (require.main === module) {
  checkSchema().then(() => {
    verifyTestAccounts().catch(error => {
      console.error('❌ Script failed:', error.message);
      process.exit(1);
    });
  });
}

module.exports = {
  verifyTestAccounts
}; 