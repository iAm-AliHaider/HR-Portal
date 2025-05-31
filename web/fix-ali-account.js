const { createClient } = require('@supabase/supabase-js');

async function fixAliAccount() {
  console.log('🔧 Fixing Ali\'s account comprehensively...');
  
  const supabase = createClient(
    'https://tqtwdkobrzzrhrqdxprs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94'
  );

  try {
    console.log('🔍 Step 1: Checking all users in auth...');
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError);
      return;
    }

    console.log(`📊 Found ${allUsers.users.length} users in auth.users`);
    
    // Find all users with ali@smemail.com
    const aliUsers = allUsers.users.filter(u => u.email === 'ali@smemail.com');
    console.log(`🎯 Found ${aliUsers.length} users with ali@smemail.com`);

    // Delete all instances
    for (const user of aliUsers) {
      console.log(`🗑️  Deleting user: ${user.id} (${user.email})`);
      try {
        await supabase.auth.admin.deleteUser(user.id);
        console.log(`✅ Deleted auth user: ${user.id}`);
      } catch (delError) {
        console.log(`⚠️  Could not delete auth user ${user.id}:`, delError.message);
      }
    }

    console.log('🔍 Step 2: Checking profiles table...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'ali@smemail.com');

    if (profileError) {
      console.error('❌ Failed to check profiles:', profileError);
    } else {
      console.log(`📊 Found ${profiles.length} profiles with ali@smemail.com`);
      
      // Delete all profiles
      for (const profile of profiles) {
        console.log(`🗑️  Deleting profile: ${profile.id} (${profile.email})`);
        try {
          await supabase.from('profiles').delete().eq('id', profile.id);
          console.log(`✅ Deleted profile: ${profile.id}`);
        } catch (delError) {
          console.log(`⚠️  Could not delete profile ${profile.id}:`, delError.message);
        }
      }
    }

    console.log('⏳ Step 3: Waiting 3 seconds for cleanup...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('👤 Step 4: Creating fresh user...');
    const { data: newAuthData, error: newAuthError } = await supabase.auth.admin.createUser({
      email: 'ali@smemail.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        firstName: 'Ali',
        lastName: 'Haider',
        role: 'admin'
      }
    });

    if (newAuthError) {
      console.error('❌ Failed to create new user:', newAuthError);
      return;
    }

    console.log('✅ Created new auth user:', newAuthData.user.id);

    console.log('👤 Step 5: Creating profile...');
    const { error: newProfileError } = await supabase
      .from('profiles')
      .insert({
        id: newAuthData.user.id,
        email: 'ali@smemail.com',
        first_name: 'Ali',
        last_name: 'Haider',
        phone: '03261525767',
        role: 'admin',
        department: 'Administration',
        position: 'Super Admin',
        hire_date: '2025-01-06',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (newProfileError) {
      console.error('❌ Failed to create profile:', newProfileError);
      return;
    }

    console.log('✅ Profile created successfully!');
    console.log('\n🎉 ACCOUNT FIXED! You can now login with:');
    console.log('📧 Email: ali@smemail.com');
    console.log('🔑 Password: admin123');
    console.log('📱 Phone: 03261525767');
    console.log('🌐 URL: https://hr-web-one.vercel.app/login');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

fixAliAccount(); 