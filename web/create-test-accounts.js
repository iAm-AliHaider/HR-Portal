const { createClient } = require('@supabase/supabase-js');

async function createTestAccounts() {
  console.log('🚀 Creating/verifying test accounts...');
  
  const supabase = createClient(
    'https://tqtwdkobrzzrhrqdxprs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94'
  );

  const testUsers = [
    {
      email: 'admin@company.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      department: 'Administration',
      position: 'System Administrator'
    },
    {
      email: 'hr@company.com', 
      password: 'hr123',
      first_name: 'HR',
      last_name: 'Manager',
      role: 'hr',
      department: 'Human Resources',
      position: 'HR Manager'
    },
    {
      email: 'employee@company.com',
      password: 'employee123', 
      first_name: 'Test',
      last_name: 'Employee',
      role: 'employee',
      department: 'General',
      position: 'Employee'
    },
    {
      email: 'ali@smemail.com',
      password: 'admin123',
      first_name: 'Ali',
      last_name: 'Haider',
      role: 'admin',
      department: 'Administration', 
      position: 'Super Admin'
    }
  ];

  try {
    // Get existing users
    console.log('🔍 Checking existing users...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError);
      return;
    }

    console.log(`📊 Found ${existingUsers.users.length} existing users`);

    for (const testUser of testUsers) {
      console.log(`\n🎯 Processing ${testUser.email}...`);
      
      // Check if user exists
      const existingUser = existingUsers.users.find(u => u.email === testUser.email);
      
      if (existingUser) {
        console.log(`⚠️  User exists: ${testUser.email}, deleting first...`);
        
        try {
          // Delete existing user
          await supabase.auth.admin.deleteUser(existingUser.id);
          console.log(`🗑️  Deleted auth user: ${existingUser.id}`);
          
          // Delete profile
          await supabase.from('profiles').delete().eq('id', existingUser.id);
          console.log(`🗑️  Deleted profile: ${existingUser.id}`);
        } catch (delError) {
          console.log(`⚠️  Error deleting existing user:`, delError.message);
        }
      }

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create fresh user
      console.log(`👤 Creating user: ${testUser.email}`);
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          firstName: testUser.first_name,
          lastName: testUser.last_name,
          role: testUser.role
        }
      });

      if (authError) {
        console.error(`❌ Failed to create ${testUser.email}:`, authError.message);
        continue;
      }

      console.log(`✅ Created auth user: ${testUser.email}`);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: testUser.email,
          first_name: testUser.first_name,
          last_name: testUser.last_name,
          role: testUser.role,
          department: testUser.department,
          position: testUser.position,
          hire_date: '2025-01-06',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`❌ Failed to create profile for ${testUser.email}:`, profileError.message);
      } else {
        console.log(`✅ Created profile: ${testUser.email}`);
      }
    }

    console.log('\n🎉 ALL TEST ACCOUNTS CREATED!');
    console.log('\n📝 Working Login Credentials:');
    console.log('┌─────────────────────────────────────┐');
    console.log('│ 🌐 URL: hr-web-one.vercel.app/login │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ 📧 admin@company.com / admin123     │');
    console.log('│ 📧 hr@company.com / hr123           │');
    console.log('│ 📧 employee@company.com / employee123│');
    console.log('│ 📧 ali@smemail.com / admin123       │');
    console.log('└─────────────────────────────────────┘');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

createTestAccounts(); 