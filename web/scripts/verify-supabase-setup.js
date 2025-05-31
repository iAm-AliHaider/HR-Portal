#!/usr/bin/env node

/**
 * Supabase Setup Verification Script
 * This script checks if Supabase is properly configured and all required tables exist
 */

const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqtwdkobrzzrhrqdxprs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s';

// Required tables
const requiredTables = [
  'profiles',
  'departments',
  'skills',
  'employee_skills',
  'leave_types',
  'leave_balances',
  'leave_requests',
  'training_courses',
  'course_enrollments',
  'jobs',
  'applications',
  'interviews',
  'loan_programs',
  'loan_applications',
  'loan_repayments',
  'meeting_rooms',
  'room_bookings',
  'equipment_inventory',
  'equipment_bookings',
  'request_categories',
  'request_types',
  'requests',
  'safety_incidents',
  'safety_equipment_checks'
];

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
const logSuccess = (message) => console.log(chalk.green(`✅ ${message}`));
const logError = (message) => console.log(chalk.red(`❌ ${message}`));
const logInfo = (message) => console.log(chalk.blue(`ℹ️ ${message}`));
const logWarning = (message) => console.log(chalk.yellow(`⚠️ ${message}`));

// Check if a table exists
async function checkTableExists(tableName) {
  try {
    // Try to query the table
    const { data, error } = await supabase
      .from(tableName)
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') { // table does not exist
        return { exists: false, message: `Table "${tableName}" does not exist` };
      } else {
        return { exists: false, message: `Error checking table "${tableName}": ${error.message}` };
      }
    }
    
    return { exists: true, message: `Table "${tableName}" exists` };
  } catch (error) {
    return { exists: false, message: `Exception checking table "${tableName}": ${error.message}` };
  }
}

// Verify all tables
async function verifyTables() {
  logInfo('Verifying tables...');
  
  let missingTables = [];
  let existingTables = [];
  
  for (const tableName of requiredTables) {
    const { exists, message } = await checkTableExists(tableName);
    
    if (exists) {
      logSuccess(message);
      existingTables.push(tableName);
    } else {
      logError(message);
      missingTables.push(tableName);
    }
  }
  
  return { missingTables, existingTables };
}

// Check sample data
async function checkSampleData() {
  logInfo('Checking sample data...');
  
  const tables = [
    { name: 'profiles', minCount: 1 },
    { name: 'departments', minCount: 5 },
    { name: 'leave_types', minCount: 3 },
    { name: 'request_categories', minCount: 3 },
    { name: 'request_types', minCount: 10 },
    { name: 'loan_programs', minCount: 3 },
    { name: 'meeting_rooms', minCount: 3 }
  ];
  
  let missingData = [];
  
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
    } catch (error) {
      logError(`Exception checking data in ${table.name}: ${error.message}`);
      missingData.push(table.name);
    }
  }
  
  return missingData;
}

// Test authentication with a test account
async function testAuthentication() {
  logInfo('Testing authentication...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@hrportal.com',
      password: 'HRPortal2024!'
    });
    
    if (error) {
      logError(`Authentication failed: ${error.message}`);
      return false;
    }
    
    logSuccess('Authentication successful with test account');
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@hrportal.com')
      .single();
    
    if (profileError) {
      logError(`Error fetching profile: ${profileError.message}`);
      return false;
    }
    
    if (!profile) {
      logError('Profile not found for the test account');
      return false;
    }
    
    logSuccess(`Profile found for the test account: ${profile.name} (${profile.role})`);
    return true;
  } catch (error) {
    logError(`Authentication exception: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log(chalk.bold.blue('======================================'));
  console.log(chalk.bold.blue('  SUPABASE SETUP VERIFICATION'));
  console.log(chalk.bold.blue('======================================'));
  
  console.log(`\nURL: ${supabaseUrl}`);
  console.log(`Key configured: ${supabaseAnonKey ? 'Yes' : 'No'}\n`);
  
  // Verify connection
  try {
    const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      logError(`Supabase connection failed: ${error.message}`);
      return;
    }
    
    logSuccess('Supabase connection successful');
  } catch (error) {
    logError(`Supabase connection exception: ${error.message}`);
    return;
  }
  
  // Verify tables
  const { missingTables, existingTables } = await verifyTables();
  
  console.log('\n--- Table Verification Summary ---');
  if (missingTables.length === 0) {
    logSuccess('All required tables exist');
  } else {
    logError(`${missingTables.length} tables are missing: ${missingTables.join(', ')}`);
  }
  
  // Check sample data if tables exist
  if (existingTables.length > 0) {
    console.log('\n--- Sample Data Verification ---');
    const missingData = await checkSampleData();
    
    if (missingData.length === 0) {
      logSuccess('All sample data is present');
    } else {
      logWarning(`${missingData.length} tables are missing data: ${missingData.join(', ')}`);
    }
  }
  
  // Test authentication
  console.log('\n--- Authentication Verification ---');
  const authSuccess = await testAuthentication();
  
  // Final summary
  console.log('\n======================================');
  console.log(chalk.bold.blue('VERIFICATION SUMMARY'));
  console.log('======================================');
  
  const allTablesExist = missingTables.length === 0;
  const authWorks = authSuccess;
  
  if (allTablesExist && authWorks) {
    logSuccess('Supabase is fully configured and ready to use!');
  } else if (allTablesExist) {
    logWarning('Database schema is complete, but authentication needs fixing');
  } else if (authWorks) {
    logWarning('Authentication works, but database schema is incomplete');
  } else {
    logError('Both database schema and authentication need to be fixed');
  }
  
  console.log('\nNext steps:');
  if (missingTables.length > 0) {
    console.log(chalk.yellow('1. Run the migration script to create missing tables'));
  }
  if (!authSuccess) {
    console.log(chalk.yellow('2. Check authentication setup and test accounts'));
  }
  
  console.log(chalk.blue('\nFor complete instructions, see: SUPABASE_COMPLETE_REQUIREMENTS.md'));
}

// Run the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 