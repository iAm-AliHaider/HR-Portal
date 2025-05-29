/**
 * Debug Auth Session
 * 
 * This script helps debug authentication session issues
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94';

// Initialize Supabase clients
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function debugAuthSession() {
  console.log('🔍 Debugging Authentication Session...\n');

  try {
    console.log('🌐 Supabase Configuration:');
    console.log(`   URL: ${SUPABASE_URL}`);
    console.log(`   Anon Key: ${SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}`);
    console.log(`   Service Key: ${SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET'}`);
    console.log('');

    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return;
    } else {
      console.log('✅ Supabase connection successful');
    }

    // Check for the specific user we know exists
    console.log('\n👤 Checking user: admin.9371cbdb@hrportal.com');
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', 'admin.9371cbdb@hrportal.com')
      .single();

    if (profileError) {
      console.log('❌ Profile not found:', profileError.message);
    } else {
      console.log('✅ Profile found:');
      console.log(`   ID: ${profile.id}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Name: ${profile.first_name} ${profile.last_name}`);
    }

    // Check for the auth user with the ID from console error
    console.log('\n🔐 Checking auth user: 2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb');
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById('2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb');

    if (authError) {
      console.log('❌ Auth user not found:', authError.message);
    } else {
      console.log('✅ Auth user found:');
      console.log(`   ID: ${authUser.user.id}`);
      console.log(`   Email: ${authUser.user.email}`);
      console.log(`   Created: ${authUser.user.created_at}`);
      console.log(`   Email Confirmed: ${authUser.user.email_confirmed_at ? 'Yes' : 'No'}`);
    }

    // Check profile with matching ID
    console.log('\n📋 Checking profile with matching auth ID...');
    
    const { data: matchingProfile, error: matchingError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb')
      .single();

    if (matchingError) {
      console.log('❌ No profile with matching ID:', matchingError.message);
    } else {
      console.log('✅ Matching profile found:');
      console.log(`   ID: ${matchingProfile.id}`);
      console.log(`   Email: ${matchingProfile.email}`);
      console.log(`   Role: ${matchingProfile.role}`);
    }

    // List all profiles for reference
    console.log('\n📊 All admin profiles:');
    
    const { data: allAdmins, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, first_name, last_name, role')
      .eq('role', 'admin')
      .order('email');

    if (adminError) {
      console.log('❌ Error fetching admins:', adminError.message);
    } else {
      allAdmins.forEach(admin => {
        console.log(`   📧 ${admin.email} - ${admin.first_name} ${admin.last_name} (${admin.id})`);
      });
    }

    console.log('\n💡 Recommendations:');
    console.log('1. Try logging out and logging back in');
    console.log('2. Clear browser cache and cookies');
    console.log('3. Use incognito/private browsing mode');
    console.log('4. Try the temp email: admin.9371cbdb@hrportal.com');
    console.log('5. Or use: admin@yourcompany.com');

  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  }
}

// Main execution
if (require.main === module) {
  debugAuthSession().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  debugAuthSession
}; 