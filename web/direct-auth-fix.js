const { createClient } = require('@supabase/supabase-js');

async function directAuthFix() {
  console.log('🔧 Direct Authentication Fix (Bypassing SQL Triggers)...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('1. Analyzing current database state...');
    
    // Get all auth users
    const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error('❌ Failed to get auth users:', usersError.message);
      return;
    }

    console.log(`   Found ${authUsers.users.length} users in auth.users`);

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Failed to get profiles:', profilesError.message);
      return;
    }

    console.log(`   Found ${profiles.length} profiles in profiles table`);

    console.log('\n2. Fixing duplicate email constraints...');
    
    // Find and fix duplicate email issues
    const emailCounts = {};
    profiles.forEach(profile => {
      emailCounts[profile.email] = (emailCounts[profile.email] || 0) + 1;
    });

    const duplicateEmails = Object.keys(emailCounts).filter(email => emailCounts[email] > 1);
    
    if (duplicateEmails.length > 0) {
      console.log(`   Found ${duplicateEmails.length} duplicate emails, cleaning up...`);
      
      for (const duplicateEmail of duplicateEmails) {
        const duplicateProfiles = profiles.filter(p => p.email === duplicateEmail);
        
        // Keep the most recent one, delete others
        const sortedProfiles = duplicateProfiles.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        for (let i = 1; i < sortedProfiles.length; i++) {
          const { error: deleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', sortedProfiles[i].id);
          
          if (deleteError) {
            console.log(`    ❌ Failed to delete duplicate profile: ${deleteError.message}`);
          } else {
            console.log(`    ✅ Deleted duplicate profile for ${duplicateEmail}`);
          }
        }
      }
    } else {
      console.log('   ✅ No duplicate emails found');
    }

    console.log('\n3. Creating test accounts with direct approach...');
    
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

    for (const account of testAccounts) {
      console.log(`\n   Processing ${account.email}...`);
      
      // Check if auth user exists
      const existingAuthUser = authUsers.users.find(u => u.email === account.email);
      let authUserId = null;

      if (existingAuthUser) {
        console.log(`     ✅ Auth user exists`);
        authUserId = existingAuthUser.id;
      } else {
        // Create auth user without metadata to avoid trigger issues
        console.log(`     📝 Creating auth user...`);
        
        const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: {} // Empty to avoid trigger complications
        });

        if (authError) {
          console.log(`     ❌ Auth user creation failed: ${authError.message}`);
          continue;
        } else {
          console.log(`     ✅ Auth user created`);
          authUserId = newAuthUser.user.id;
        }
      }

      // Check if profile exists
      const existingProfile = profiles.find(p => p.id === authUserId || p.email === account.email);
      
      if (existingProfile) {
        console.log(`     ✅ Profile already exists`);
        
        // Update profile with correct data if needed
        if (existingProfile.first_name !== account.profile.first_name || 
            existingProfile.role !== account.profile.role) {
          
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
            .eq('id', authUserId);

          if (updateError) {
            console.log(`     ⚠️ Profile update failed: ${updateError.message}`);
          } else {
            console.log(`     ✅ Profile updated with correct data`);
          }
        }
      } else {
        // Create profile directly
        console.log(`     📝 Creating profile...`);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUserId,
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

    console.log('\n4. Testing login functionality...');
    
    // Test each account
    for (const account of testAccounts) {
      const { data: loginTest, error: loginError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password
      });

      if (loginError) {
        console.log(`   ❌ Login test failed for ${account.email}: ${loginError.message}`);
      } else {
        console.log(`   ✅ Login test successful for ${account.email}`);
        
        // Check if profile loads correctly
        const { data: userProfile, error: profileLoadError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', loginTest.user.id)
          .single();

        if (profileLoadError) {
          console.log(`     ❌ Profile load failed: ${profileLoadError.message}`);
        } else {
          console.log(`     ✅ Profile loaded: ${userProfile.first_name} ${userProfile.last_name} (${userProfile.role})`);
        }

        // Sign out
        await supabase.auth.signOut();
      }
    }

    console.log('\n🎉 Direct Authentication Fix Completed!');
    console.log('\n📋 Test Accounts Status:');
    
    // Final verification
    const finalUserCount = (await supabase.auth.admin.listUsers()).data.users.length;
    const finalProfileCount = (await supabase.from('profiles').select('id')).data.length;
    
    console.log(`- Auth Users: ${finalUserCount}`);
    console.log(`- Profiles: ${finalProfileCount}`);
    console.log('\n🔗 Ready to test at: https://hr-web-one.vercel.app/login');
    console.log('\n📝 Test Credentials:');
    console.log('   admin@company.com / admin123');
    console.log('   hr@company.com / hr123');
    console.log('   employee@company.com / employee123');

  } catch (error) {
    console.error('❌ Direct fix failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

directAuthFix(); 