const { createClient } = require('@supabase/supabase-js');

async function testAuthFix() {
  console.log('🔧 Testing Authentication Fix...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables');
    console.error('Please ensure .env.local contains:');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Database connection successful');

    // Test 2: Check profiles table structure
    console.log('\n2. Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ Profiles table check failed:', profilesError.message);
    } else {
      console.log(`✅ Profiles table accessible - ${profiles.length} profiles found`);
      if (profiles.length > 0) {
        const sampleProfile = profiles[0];
        console.log(`   Sample profile structure: ${Object.keys(sampleProfile).join(', ')}`);
      }
    }

    // Test 3: Test user accounts
    console.log('\n3. Testing user accounts...');
    const testUsers = [
      { email: 'admin@company.com', password: 'admin123' },
      { email: 'hr@company.com', password: 'hr123' },
      { email: 'employee@company.com', password: 'employee123' }
    ];
    
    for (const testUser of testUsers) {
      try {
        const { data: user, error } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password
        });
        
        if (error) {
          console.log(`❌ Login failed for ${testUser.email}: ${error.message}`);
        } else {
          console.log(`✅ Login successful for ${testUser.email}`);
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.user.id)
            .single();
          
          if (profileError) {
            console.log(`  ❌ No profile found for ${testUser.email}: ${profileError.message}`);
          } else {
            console.log(`  ✅ Profile exists: ${profile.first_name} ${profile.last_name} (${profile.role})`);
          }
          
          // Sign out after testing
          await supabase.auth.signOut();
        }
      } catch (testError) {
        console.log(`❌ Test error for ${testUser.email}: ${testError.message}`);
      }
    }

    // Test 4: Check auth users count
    console.log('\n4. Checking auth users...');
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log(`❌ Failed to list auth users: ${authError.message}`);
      } else {
        console.log(`✅ Found ${authUsers.users.length} users in auth.users`);
        
        // Check for orphaned users
        let orphanedCount = 0;
        for (const authUser of authUsers.users) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authUser.id)
            .single();
          
          if (profileError && profileError.code === 'PGRST116') {
            orphanedCount++;
          }
        }
        
        if (orphanedCount > 0) {
          console.log(`⚠️  Found ${orphanedCount} orphaned users without profiles`);
        } else {
          console.log(`✅ All auth users have corresponding profiles`);
        }
      }
    } catch (authTestError) {
      console.log(`❌ Auth users test failed: ${authTestError.message}`);
    }

    // Test 5: Test registration process
    console.log('\n5. Testing registration process...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    try {
      const { data: newUser, error: regError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'test123',
        email_confirm: true,
        user_metadata: {
          firstName: 'Test',
          lastName: 'User',
          role: 'employee',
          department: 'Testing',
          position: 'Test Employee'
        }
      });

      if (regError) {
        console.log(`❌ Registration failed: ${regError.message}`);
      } else {
        console.log(`✅ Registration successful for ${testEmail}`);
        
        // Wait for trigger
        console.log('   Waiting for trigger to execute...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if profile was created
        const { data: newProfile, error: newProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newUser.user.id)
          .single();
        
        if (newProfileError) {
          console.log(`  ❌ Profile not created by trigger: ${newProfileError.message}`);
        } else {
          console.log(`  ✅ Profile created by trigger: ${newProfile.first_name} ${newProfile.last_name}`);
        }
        
        // Clean up test user
        try {
          await supabase.auth.admin.deleteUser(newUser.user.id);
          console.log(`  🧹 Test user cleaned up`);
        } catch (cleanupError) {
          console.log(`  ⚠️  Cleanup warning: ${cleanupError.message}`);
        }
      }
    } catch (regTestError) {
      console.log(`❌ Registration test failed: ${regTestError.message}`);
    }

    console.log('\n🎉 Authentication fix test completed!');
    console.log('\n📋 Summary:');
    console.log('- Database connection: ✅ Working');
    console.log('- Test accounts should be ready for login');
    console.log('- If registration still fails, run the SQL fix in Supabase Dashboard');

  } catch (error) {
    console.error('❌ Test failed with unexpected error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

testAuthFix(); 