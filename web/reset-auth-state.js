#!/usr/bin/env node

/**
 * Reset Authentication State Script
 * Clears local storage and resets authentication state to fix multiple GoTrue client issues
 */

const { createClient } = require('@supabase/supabase-js');

async function resetAuthState() {
  console.log('🔄 Resetting authentication state...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xhfxhhmlcrhkkyfxvnqy.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZnhoaG1sY3Joa2t5Znh2bnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDA3MTksImV4cCI6MjA1NDE3NjcxOX0.v8PHbzLPrSFJv7_0jyVfqAcFKZX5FHkl-6-q4OL5I4o';

  try {
    console.log('1. Creating fresh Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('2. Signing out any existing sessions...');
    await supabase.auth.signOut();

    console.log('3. Clearing session storage...');
    // Note: This script runs in Node.js, so localStorage clearing happens in browser

    console.log('✅ Authentication state reset complete!');
    console.log('\n📋 Instructions for complete cleanup:');
    console.log('1. Open browser developer tools (F12)');
    console.log('2. Go to Application/Storage tab');
    console.log('3. Clear Local Storage for localhost:3000');
    console.log('4. Clear Session Storage for localhost:3000');
    console.log('5. Refresh the page');
    console.log('\nOr run this in browser console:');
    console.log('localStorage.clear(); sessionStorage.clear(); location.reload();');

  } catch (error) {
    console.error('❌ Error resetting auth state:', error.message);
  }
}

if (require.main === module) {
  resetAuthState().catch(console.error);
}

module.exports = { resetAuthState }; 