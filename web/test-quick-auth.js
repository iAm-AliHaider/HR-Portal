const { createClient } = require('@supabase/supabase-js');

// Test Supabase auth directly
async function testAuth() {
  console.log('🔍 Testing Supabase auth directly...\n');
  
  const supabaseUrl = 'https://xhfxhhmlcrhkkyfxvnqy.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZnhoaG1sY3Joa2t5Znh2bnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDA3MTksImV4cCI6MjA1NDE3NjcxOX0.v8PHbzLPrSFJv7_0jyVfqAcFKZX5FHkl-6-q4OL5I4o';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('1. Testing login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@company.com',
      password: 'admin123'
    });
    
    if (error) {
      console.log('❌ Login failed:', error.message);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('📧 User:', data.user.email);
    console.log('🆔 ID:', data.user.id);
    
    console.log('\n2. Testing profile fetch...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.log('❌ Profile fetch failed:', profileError.message);
    } else {
      console.log('✅ Profile loaded:');
      console.log('   Name:', profile.name);
      console.log('   Role:', profile.role);
      console.log('   Email:', profile.email);
    }
    
    console.log('\n3. Testing session check...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session check failed:', sessionError.message);
    } else if (session.session) {
      console.log('✅ Session exists:');
      console.log('   User:', session.session.user.email);
    } else {
      console.log('❌ No session found');
    }
    
  } catch (err) {
    console.log('❌ Test failed:', err.message);
  }
}

if (require.main === module) {
  testAuth().catch(console.error);
} 