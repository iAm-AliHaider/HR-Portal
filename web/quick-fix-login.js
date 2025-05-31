const { createClient } = require('@supabase/supabase-js');

async function createWorkingAdmin() {
  console.log('🚀 Creating working admin account...');
  
  const supabase = createClient(
    'https://tqtwdkobrzzrhrqdxprs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94'
  );

  try {
    // Create admin user
    console.log('👤 Creating admin@company.com...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@company.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists, trying to get existing...');
        
        // Get existing users and find admin
        const { data: users } = await supabase.auth.admin.listUsers();
        const adminUser = users.users.find(u => u.email === 'admin@company.com');
        
        if (adminUser) {
          console.log(`✅ Found existing user: ${adminUser.id}`);
          
          // Check/create profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', adminUser.id)
            .single();
          
          if (!profile) {
            console.log('📝 Creating missing profile...');
            await supabase.from('profiles').insert({
              id: adminUser.id,
              email: 'admin@company.com',
              first_name: 'Admin',
              last_name: 'User',
              role: 'admin',
              department: 'Administration',
              position: 'System Administrator',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      } else {
        console.error('❌ Auth error:', authError.message);
        return;
      }
    } else {
      console.log(`✅ Created user: ${authData.user.id}`);
      
      // Create profile
      await supabase.from('profiles').insert({
        id: authData.user.id,
        email: 'admin@company.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        department: 'Administration',
        position: 'System Administrator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    console.log('\n🎉 ADMIN ACCOUNT READY!');
    console.log('┌─────────────────────────────────────┐');
    console.log('│  LOGIN NOW AT:                      │');
    console.log('│  https://hr-web-one.vercel.app/login│');
    console.log('│                                     │');
    console.log('│  📧 Email: admin@company.com        │');
    console.log('│  🔑 Password: admin123              │');
    console.log('└─────────────────────────────────────┘');

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

createWorkingAdmin(); 