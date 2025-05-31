const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createManualUser() {
  console.log('🧪 Testing manual user creation...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Try to insert a profile directly (bypass auth for testing)
    console.log('👤 Creating profile directly...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440000', // temporary UUID for testing
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'employee',
        department: 'IT',
        position: 'Developer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      return false;
    }

    console.log('✅ Profile created successfully:', profileData);

    // Clean up - delete the test profile
    await supabase
      .from('profiles')
      .delete()
      .eq('id', '550e8400-e29b-41d4-a716-446655440000');

    console.log('🧹 Test data cleaned up');
    return true;

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

// Run the test
createManualUser()
  .then((success) => {
    if (success) {
      console.log('\n✅ Database connection and schema test passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Database test failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  }); 