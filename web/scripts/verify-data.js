#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94';

// Initialize Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper functions
const logSuccess = (message) => console.log(`✅ ${message}`);
const logWarning = (message) => console.log(`⚠️ ${message}`);
const logError = (message) => console.log(`❌ ${message}`);
const logInfo = (message) => console.log(`ℹ️ ${message}`);

async function checkTableData() {
  const tables = [
    { name: 'departments', minCount: 5 },
    { name: 'leave_types', minCount: 3 },
    { name: 'request_categories', minCount: 3 },
    { name: 'request_types', minCount: 10 },
    { name: 'loan_programs', minCount: 3 },
    { name: 'meeting_rooms', minCount: 3 }
  ];
  
  let missingData = [];
  let tableCounts = [];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table.name)
        .select('*', { count: 'exact' });
      
      if (error) {
        logError(`Error checking data in ${table.name}: ${error.message}`);
        missingData.push(table.name);
        continue;
      }
      
      if (count < table.minCount) {
        logWarning(`${table.name} has insufficient data: ${count} rows (expected at least ${table.minCount})`);
        missingData.push(table.name);
      } else {
        logSuccess(`${table.name} has ${count} rows of data`);
      }
      
      tableCounts.push({ table: table.name, count });
    } catch (error) {
      logError(`Exception checking data in ${table.name}: ${error.message}`);
      missingData.push(table.name);
    }
  }
  
  return { missingData, tableCounts };
}

async function checkProfiles() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      logError(`Error checking profiles: ${error.message}`);
      return false;
    }
    
    if (!data || data.length === 0) {
      logWarning('No profiles found in the database');
      return false;
    }
    
    logSuccess(`Found ${data.length} profiles in the database`);
    
    // Check for admin profile
    const adminProfile = data.find(p => p.role === 'admin');
    if (adminProfile) {
      logSuccess(`Admin profile exists: ${adminProfile.email}`);
    } else {
      logWarning('No admin profile found');
    }
    
    return true;
  } catch (error) {
    logError(`Exception checking profiles: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('======================================================================');
  console.log('SUPABASE DATA VERIFICATION');
  console.log('======================================================================');

  // Check sample data in tables
  logInfo('Checking sample data in tables...');
  const { missingData, tableCounts } = await checkTableData();
  
  // Check profiles
  logInfo('\nChecking profiles...');
  const profilesExist = await checkProfiles();

  console.log('\n======================================================================');
  console.log('DATA VERIFICATION RESULTS');
  console.log('======================================================================');
  
  if (missingData.length === 0) {
    logSuccess('All tables have sufficient sample data');
  } else {
    logWarning(`${missingData.length} tables have insufficient data: ${missingData.join(', ')}`);
  }

  console.log('\nTable row counts:');
  tableCounts.forEach(({ table, count }) => {
    console.log(`- ${table}: ${count} rows`);
  });
  
  console.log('\nVerification process complete!');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 