const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function applyAuthFix() {
  console.log('🔧 Applying Authentication Fix...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Step 1: Fix orphaned users by creating profiles
    console.log('1. Creating profiles for orphaned users...');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Failed to get auth users:', authError.message);
      return;
    }

    let fixedCount = 0;
    for (const authUser of authUsers.users) {
      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .single();

      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        // No profile exists, create one
        const metadata = authUser.user_metadata || {};
        const emailParts = authUser.email.split('@');
        
        const profileData = {
          id: authUser.id,
          email: authUser.email,
          first_name: metadata.firstName || metadata.first_name || emailParts[0] || 'User',
          last_name: metadata.lastName || metadata.last_name || '',
          role: metadata.role || 'employee',
          department: metadata.department || 'General',
          position: metadata.position || 'Employee',
          phone: metadata.phone || null,
          hire_date: metadata.hireDate || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: createError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (createError) {
          console.log(`❌ Failed to create profile for ${authUser.email}: ${createError.message}`);
        } else {
          console.log(`✅ Created profile for ${authUser.email}`);
          fixedCount++;
        }
      }
    }

    console.log(`✅ Fixed ${fixedCount} orphaned users\n`);

    // Step 2: Create test accounts if they don't exist
    console.log('2. Creating test accounts...');
    
    const testAccounts = [
      {
        email: 'admin@company.com',
        password: 'admin123',
        metadata: {
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          department: 'Administration',
          position: 'System Administrator'
        }
      },
      {
        email: 'hr@company.com',
        password: 'hr123',
        metadata: {
          firstName: 'HR',
          lastName: 'Manager',
          role: 'hr',
          department: 'Human Resources',
          position: 'HR Manager'
        }
      },
      {
        email: 'employee@company.com',
        password: 'employee123',
        metadata: {
          firstName: 'Test',
          lastName: 'Employee',
          role: 'employee',
          department: 'General',
          position: 'Employee'
        }
      }
    ];

    for (const account of testAccounts) {
      // Check if user exists
      const existingUser = authUsers.users.find(u => u.email === account.email);
      
      if (!existingUser) {
        console.log(`📝 Creating ${account.email}...`);
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: account.metadata
        });

        if (createError) {
          console.log(`❌ Failed to create ${account.email}: ${createError.message}`);
        } else {
          console.log(`✅ Created ${account.email}`);
          
          // Create profile manually
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: newUser.user.id,
              email: account.email,
              first_name: account.metadata.firstName,
              last_name: account.metadata.lastName,
              role: account.metadata.role,
              department: account.metadata.department,
              position: account.metadata.position,
              hire_date: new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.log(`  ⚠️ Profile creation failed: ${profileError.message}`);
          } else {
            console.log(`  ✅ Profile created for ${account.email}`);
          }
        }
      } else {
        console.log(`✅ ${account.email} already exists`);
      }
    }

    console.log('\n🎉 Authentication fix applied successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('- admin@company.com / admin123');
    console.log('- hr@company.com / hr123');
    console.log('- employee@company.com / employee123');
    console.log('\n🔗 You can now test login at: https://hr-web-one.vercel.app/login');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

applyAuthFix(); 