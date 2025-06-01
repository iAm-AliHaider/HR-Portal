const { createClient } = require('@supabase/supabase-js');

async function applyMinimalFix() {
  console.log('🔧 Applying Minimal Authentication Fix (Bypassing Policy Issues)...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('1. Creating test accounts directly (bypassing triggers)...');
    
    // Step 1: Create test accounts without relying on triggers
    const testAccounts = [
      {
        email: 'admin@company.com',
        password: 'admin123',
        profile: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          department: 'Administration',
          position: 'System Administrator'
        }
      },
      {
        email: 'hr@company.com',
        password: 'hr123',
        profile: {
          first_name: 'HR',
          last_name: 'Manager',
          role: 'hr',
          department: 'Human Resources',
          position: 'HR Manager'
        }
      },
      {
        email: 'employee@company.com',
        password: 'employee123',
        profile: {
          first_name: 'Test',
          last_name: 'Employee',
          role: 'employee',
          department: 'General',
          position: 'Employee'
        }
      }
    ];

    // Get existing users
    const { data: existingUsers, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error('❌ Failed to get users:', usersError.message);
      return;
    }

    for (const account of testAccounts) {
      console.log(`\n   Working on ${account.email}...`);
      
      const existingUser = existingUsers.users.find(u => u.email === account.email);
      let userId = null;

      if (existingUser) {
        console.log(`     ✅ Auth user already exists`);
        userId = existingUser.id;
      } else {
        // Try to create auth user with minimal metadata
        console.log(`     📝 Creating auth user...`);
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: {
            firstName: account.profile.first_name,
            lastName: account.profile.last_name
          }
        });

        if (createError) {
          console.log(`     ⚠️ Auth creation failed: ${createError.message}`);
          // Try to find if user was created despite error
          const { data: retryUsers } = await supabase.auth.admin.listUsers();
          const newlyCreated = retryUsers?.users.find(u => u.email === account.email);
          if (newlyCreated) {
            console.log(`     ✅ User was created despite error`);
            userId = newlyCreated.id;
          } else {
            console.log(`     ❌ User creation definitively failed, skipping...`);
            continue;
          }
        } else {
          console.log(`     ✅ Auth user created successfully`);
          userId = newUser.user.id;
        }
      }

      // Now handle profile creation/update
      if (userId) {
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (existingProfile) {
          console.log(`     ✅ Profile exists, updating...`);
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              first_name: account.profile.first_name,
              last_name: account.profile.last_name,
              role: account.profile.role,
              department: account.profile.department,
              position: account.profile.position,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            console.log(`     ⚠️ Profile update failed: ${updateError.message}`);
          } else {
            console.log(`     ✅ Profile updated successfully`);
          }
        } else {
          console.log(`     📝 Creating new profile...`);
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: account.email,
              first_name: account.profile.first_name,
              last_name: account.profile.last_name,
              role: account.profile.role,
              department: account.profile.department,
              position: account.profile.position,
              hire_date: new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.log(`     ❌ Profile creation failed: ${profileError.message}`);
          } else {
            console.log(`     ✅ Profile created successfully`);
          }
        }
      }
    }

    console.log('\n2. Testing login functionality...');
    
    // Test each account
    for (const account of testAccounts) {
      const { data: loginTest, error: loginError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password
      });

      if (loginError) {
        console.log(`   ❌ Login failed for ${account.email}: ${loginError.message}`);
      } else {
        console.log(`   ✅ Login successful for ${account.email}`);
        
        // Test profile loading
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', loginTest.user.id)
          .single();

        if (profileError) {
          console.log(`     ⚠️ Profile load failed: ${profileError.message}`);
        } else {
          console.log(`     ✅ Profile loaded: ${profile.first_name} ${profile.last_name} (${profile.role})`);
        }

        await supabase.auth.signOut();
      }
    }

    console.log('\n🎉 Minimal Authentication Fix Completed!');
    console.log('\n📋 Test these accounts:');
    console.log('- admin@company.com / admin123');
    console.log('- hr@company.com / hr123');
    console.log('- employee@company.com / employee123');
    console.log('\n🔗 Login at: https://hr-web-one.vercel.app/login');

  } catch (error) {
    console.error('❌ Minimal fix failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

applyMinimalFix(); 