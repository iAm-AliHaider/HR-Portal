const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
  console.log('🚀 Creating test user in production database...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // Create the user with auth
    console.log('📧 Creating user account...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'sanfa360@gmail.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Sanfa Ali',
        role: 'admin'
      }
    });

    if (authError) {
      // User might already exist, try to get existing user
      console.log('🔍 User might exist, trying to find existing user...');
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === 'sanfa360@gmail.com');
      
      if (existingUser) {
        console.log('✅ User already exists:', existingUser.email);
        
        // Create or update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: existingUser.id,
            email: existingUser.email,
            name: 'Sanfa Ali',
            role: 'admin',
            department: 'IT',
            position: 'System Administrator',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('❌ Profile creation failed:', profileError);
        } else {
          console.log('✅ Profile created/updated successfully');
        }
        
        return existingUser;
      }
      
      console.error('❌ Auth error:', authError);
      return null;
    }

    console.log('✅ User created successfully:', authData.user.email);

    // Create profile record
    console.log('👤 Creating user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name: 'Sanfa Ali',
        role: 'admin',
        department: 'IT',
        position: 'System Administrator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
    } else {
      console.log('✅ Profile created successfully');
    }

    // Also create some additional test users
    const testUsers = [
      {
        email: 'admin@company.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        department: 'Administration',
        position: 'Administrator'
      },
      {
        email: 'hr@company.com',
        password: 'hr123',
        name: 'HR Manager',
        role: 'hr',
        department: 'Human Resources',
        position: 'HR Manager'
      },
      {
        email: 'employee@company.com',
        password: 'employee123',
        name: 'John Employee',
        role: 'employee',
        department: 'Sales',
        position: 'Sales Representative'
      }
    ];

    console.log('👥 Creating additional test users...');
    for (const testUser of testUsers) {
      try {
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
          user_metadata: {
            name: testUser.name,
            role: testUser.role
          }
        });

        if (userError && userError.message.includes('already registered')) {
          console.log(`⚠️  User ${testUser.email} already exists, skipping...`);
          continue;
        }

        if (userError) {
          console.error(`❌ Failed to create ${testUser.email}:`, userError.message);
          continue;
        }

        // Create profile
        await supabase
          .from('profiles')
          .insert({
            id: newUser.user.id,
            email: newUser.user.email,
            name: testUser.name,
            role: testUser.role,
            department: testUser.department,
            position: testUser.position,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        console.log(`✅ Created test user: ${testUser.email}`);
      } catch (err) {
        console.error(`❌ Error creating ${testUser.email}:`, err.message);
      }
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('📝 Login credentials:');
    console.log('• sanfa360@gmail.com / admin123');
    console.log('• admin@company.com / admin123');
    console.log('• hr@company.com / hr123');
    console.log('• employee@company.com / employee123');

    return authData.user;

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return null;
  }
}

// Run the script
createTestUser()
  .then((result) => {
    if (result) {
      console.log('\n✅ User creation completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ User creation failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  }); 