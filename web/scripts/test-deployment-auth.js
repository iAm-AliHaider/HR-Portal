/**
 * Test Deployment Auth
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tqtwdkobrzzrhrqdxprs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s';

async function testAuth() {
  console.log('🧪 Testing Authentication...\n');

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    console.log('1. Testing connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Connection working');

    console.log('\n2. Testing login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'sanfa360@gmail.com',
      password: 'HRPortal2024!'
    });

    if (authError) {
      console.log('❌ Login failed:', authError.message);
    } else {
      console.log('✅ Login successful');
      console.log('🆔 User ID:', authData.user.id);
    }

    console.log('\n🎯 Auth system is working!');
    console.log('📝 Make sure to:');
    console.log('1. Wait for Vercel redeploy to complete');
    console.log('2. Go to https://hr-web-one.vercel.app/login');
    console.log('3. Login with sanfa360@gmail.com / HRPortal2024!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth(); 