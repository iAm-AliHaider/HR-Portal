const { createClient } = require('@supabase/supabase-js');

async function registerAli() {
  console.log('🚀 Quick registration for ali@smemail.com...');
  
  const supabase = createClient(
    'https://tqtwdkobrzzrhrqdxprs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94'
  );

  try {
    // First, delete existing user if exists
    console.log('🔍 Checking for existing user...');
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === 'ali@smemail.com');
    
    if (existingUser) {
      console.log('🗑️  Deleting existing user...');
      await supabase.auth.admin.deleteUser(existingUser.id);
      
      // Also delete from profiles
      await supabase.from('profiles').delete().eq('id', existingUser.id);
      console.log('✅ Existing user cleaned up');
    }

    // Create fresh user
    console.log('👤 Creating new user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'ali@smemail.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        firstName: 'Ali',
        lastName: 'Haider',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Auth creation failed:', authError);
      return;
    }

    console.log('✅ User created:', authData.user.email);

    // Create profile
    console.log('👤 Creating profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'ali@smemail.com',
        first_name: 'Ali',
        last_name: 'Haider',
        phone: '+1234567890',
        role: 'admin',
        department: 'IT',
        position: 'System Administrator',
        hire_date: '2025-01-06',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      return;
    }

    console.log('✅ Profile created successfully!');
    console.log('\n🎉 SUCCESS! You can now login with:');
    console.log('📧 Email: ali@smemail.com');
    console.log('🔑 Password: admin123');
    console.log('🌐 URL: https://hr-web-one.vercel.app/login');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

registerAli(); 