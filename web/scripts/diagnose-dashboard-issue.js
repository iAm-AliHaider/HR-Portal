/**
 * Diagnose Dashboard Issue
 * Comprehensive check to identify what's causing the dashboard routing error
 */

const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const exists = fs.existsSync(fullPath);
    const stats = exists ? fs.statSync(fullPath) : null;
    
    return {
      exists,
      size: stats ? stats.size : 0,
      path: fullPath
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
      path: filePath
    };
  }
}

function checkComponent(componentPath) {
  try {
    const fullPath = path.join(process.cwd(), componentPath);
    if (!fs.existsSync(fullPath)) {
      return { valid: false, error: 'File does not exist' };
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for common issues
    const issues = [];
    
    // Check for syntax issues (basic)
    if (!content.includes('export default') && !content.includes('export {')) {
      issues.push('No default export found');
    }
    
    // Check for React import
    if (!content.includes('import React') && !content.includes('import { ') && !content.includes('import * as React')) {
      issues.push('React import might be missing');
    }
    
    // Check for component definition
    if (!content.includes('function ') && !content.includes('const ') && !content.includes('class ')) {
      issues.push('No component definition found');
    }
    
    return {
      valid: issues.length === 0,
      issues,
      size: content.length
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

console.log('🔍 Diagnosing Dashboard Issue...\n');

// 1. Check critical files
console.log('1. Checking critical files:');
const criticalFiles = [
  'pages/dashboard/index.tsx',
  'components/layout/DashboardLayout.tsx',
  'hooks/useAuth.ts',
  'components/ui/card.tsx',
  'middleware.ts'
];

criticalFiles.forEach(file => {
  const check = checkFile(file);
  console.log(`   ${check.exists ? '✅' : '❌'} ${file} ${check.exists ? `(${check.size} bytes)` : '(missing)'}`);
  if (check.error) {
    console.log(`      Error: ${check.error}`);
  }
});

// 2. Check dashboard component specifically
console.log('\n2. Analyzing dashboard component:');
const dashboardCheck = checkComponent('pages/dashboard/index.tsx');
console.log(`   Valid: ${dashboardCheck.valid ? '✅' : '❌'}`);
if (!dashboardCheck.valid) {
  console.log(`   Issues: ${dashboardCheck.issues?.join(', ') || dashboardCheck.error}`);
}

// 3. Check DashboardLayout component
console.log('\n3. Analyzing DashboardLayout component:');
const layoutCheck = checkComponent('components/layout/DashboardLayout.tsx');
console.log(`   Valid: ${layoutCheck.valid ? '✅' : '❌'}`);
if (!layoutCheck.valid) {
  console.log(`   Issues: ${layoutCheck.issues?.join(', ') || layoutCheck.error}`);
}

// 4. Check package.json for dependencies
console.log('\n4. Checking dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    '@supabase/supabase-js',
    '@chakra-ui/react'
  ];
  
  requiredDeps.forEach(dep => {
    console.log(`   ${deps[dep] ? '✅' : '❌'} ${dep} ${deps[dep] || '(missing)'}`);
  });
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// 5. Check for build artifacts
console.log('\n5. Checking build artifacts:');
const buildFiles = [
  '.next/server/pages/dashboard/index.js',
  '.next/static/chunks/pages/dashboard/index.js'
];

buildFiles.forEach(file => {
  const check = checkFile(file);
  console.log(`   ${check.exists ? '✅' : '❌'} ${file} ${check.exists ? `(${check.size} bytes)` : '(not built)'}`);
});

// 6. Check Next.js config
console.log('\n6. Checking Next.js configuration:');
const configFiles = ['next.config.js', 'next.config.mjs', 'tsconfig.json'];
configFiles.forEach(file => {
  const check = checkFile(file);
  if (check.exists) {
    console.log(`   ✅ ${file} exists`);
  }
});

console.log('\n🔍 Diagnosis Summary:');
console.log('   If dashboard component exists but still fails to load:');
console.log('   1. Component might have runtime errors');
console.log('   2. Dependencies might be missing or incompatible');
console.log('   3. Build process might be failing');
console.log('   4. Async loading might be timing out');
console.log('\n📝 Recommended Actions:');
console.log('   1. Check browser console for additional errors');
console.log('   2. Check Vercel deployment logs');
console.log('   3. Try accessing dashboard directly: /dashboard');
console.log('   4. Clear browser cache and cookies');
console.log('   5. Check if other pages load correctly'); 