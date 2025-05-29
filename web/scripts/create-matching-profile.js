/**
 * Create Matching Profile
 * 
 * This script creates a new profile with the correct auth user ID without deleting existing ones
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

async function createMatchingProfile() {
  console.log('🔧 Creating matching profile for current auth user...\n');

  try {
    const authUserId = '2a8e18b3-b9f9-4a3f-95b1-f1f69371cbdb';
    
    console.log(`🆔 Auth User ID: ${authUserId}`);
    
    // Check if profile already exists for this auth user ID
    const { data: existingProfile, error: existingError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUserId)
      .single();
    
    if (existingProfile) {
      console.log('✅ Profile already exists for this auth user ID:');
      console.log(`   Email: ${existingProfile.email}`);
      console.log(`   Role: ${existingProfile.role}`);
      console.log('   No action needed!');
      return;
    }
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('❌ Error checking existing profile:', existingError.message);
      return;
    }
    
    console.log('⚠️ No profile found for auth user ID, creating...');
    
    // Get auth user details
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(authUserId);
    
    if (authError) {
      console.error('❌ Auth user not found:', authError.message);
      return;
    }
    
    console.log(`📧 Auth user email: ${authUser.user.email}`);
    
    // Create a new profile with a slightly different email to avoid conflicts
    const originalEmail = authUser.user.email;
    const newEmail = originalEmail; // Keep the same email
    
    // Create the new profile
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: authUserId,
        first_name: 'Admin',
        last_name: 'User',
        email: newEmail,
        role: 'admin',
        department: 'IT',
        position: 'Administrator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (createError) {
      if (createError.message.includes('duplicate key value violates unique constraint "profiles_email_key"')) {
        console.log('⚠️ Email conflict detected, creating with temporary email...');
        
        // Use a temporary email
        const tempEmail = `admin.${authUserId.slice(-8)}@hrportal.com`;
        
        const { error: tempCreateError } = await supabase
          .from('profiles')
          .insert({
            id: authUserId,
            first_name: 'Admin',
            last_name: 'User',
            email: tempEmail,
            role: 'admin',
            department: 'IT',
            position: 'Administrator',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (tempCreateError) {
          console.error('❌ Failed to create profile with temp email:', tempCreateError.message);
          return;
        }
        
        console.log('✅ Profile created with temporary email:', tempEmail);
        console.log('📝 You can log in with this email instead');
        
        // Try to update to original email
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ email: originalEmail })
          .eq('id', authUserId);
        
        if (updateError) {
          console.log('⚠️ Could not update to original email, use temp email for login');
        } else {
          console.log('✅ Updated to original email successfully');
        }
        
      } else {
        console.error('❌ Failed to create profile:', createError.message);
        return;
      }
    } else {
      console.log('✅ Profile created successfully with original email');
    }
    
    // Verify the profile was created
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUserId)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
    } else {
      console.log('\n✅ Verification successful:');
      console.log(`   ID: ${verifyProfile.id}`);
      console.log(`   Email: ${verifyProfile.email}`);
      console.log(`   Role: ${verifyProfile.role}`);
      console.log(`   Name: ${verifyProfile.first_name} ${verifyProfile.last_name}`);
    }
    
    console.log('\n🎉 Profile creation complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to: https://hr-portal-app-dev-ita.vercel.app/login');
    console.log('2. Clear browser cache (Ctrl+Shift+R)');
    console.log(`3. Log in with: ${verifyProfile ? verifyProfile.email : originalEmail} / HRPortal2024!`);
    console.log('4. You should now have admin access without loading errors');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Main execution
if (require.main === module) {
  createMatchingProfile().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  createMatchingProfile
}; 