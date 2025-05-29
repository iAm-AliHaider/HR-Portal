/**
 * Fix All Component Fetch Errors
 * Systematically replace DashboardLayout with SimpleDashboardLayout across the application
 */

const fs = require('fs');
const path = require('path');

// Track all changes made
let changesLog = [];
let filesProcessed = 0;
let filesChanged = 0;

function logChange(file, action) {
  changesLog.push(`${file}: ${action}`);
  console.log(`✅ ${file}: ${action}`);
}

function processFile(filePath) {
  try {
    filesProcessed++;
    
    if (!fs.existsSync(filePath)) {
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file imports DashboardLayout
    if (!content.includes('DashboardLayout')) {
      return;
    }
    
    // Skip if already using SimpleDashboardLayout
    if (content.includes('SimpleDashboardLayout')) {
      logChange(filePath, 'Already using SimpleDashboardLayout - skipped');
      return;
    }
    
    let newContent = content;
    let changed = false;
    
    // Replace DashboardLayout imports
    const importPatterns = [
      /import DashboardLayout from ['"]['"]?[@\/\.].*?DashboardLayout['"]['"]?;?/g,
      /import DashboardLayout from ['"]['"]\.\./g,
      /import.*?DashboardLayout.*?from.*?['"]['"].*?DashboardLayout.*?['"]['"];?/g
    ];
    
    importPatterns.forEach(pattern => {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, "import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';");
        changed = true;
      }
    });
    
    // Replace DashboardLayout usage
    newContent = newContent.replace(/<DashboardLayout/g, '<SimpleDashboardLayout');
    newContent = newContent.replace(/<\/DashboardLayout>/g, '</SimpleDashboardLayout>');
    
    if (newContent !== content) {
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      filesChanged++;
      logChange(filePath, 'Fixed DashboardLayout → SimpleDashboardLayout');
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath, processFunc) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        scanDirectory(fullPath, processFunc);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        processFunc(fullPath);
      }
    });
  } catch (error) {
    console.error(`❌ Error scanning ${dirPath}:`, error.message);
  }
}

console.log('🔧 Fixing All Component Fetch Errors...\n');

// Key directories to process
const directoriesToProcess = [
  'pages',
  'components'
];

directoriesToProcess.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`📁 Processing ${dir}/ directory...`);
    scanDirectory(fullPath, processFile);
  }
});

// Manually check critical files that might need fixing
const criticalFiles = [
  'pages/_app.tsx',
  'pages/index.tsx',
  'pages/dashboard/index.tsx',
  'pages/setup-validation.tsx',
  'pages/workflows.tsx',
  'pages/reports.tsx',
  'pages/settings/index.tsx'
];

console.log('\n📋 Checking critical files...');
criticalFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  processFile(fullPath);
});

// Summary
console.log('\n📊 Summary:');
console.log(`📁 Files processed: ${filesProcessed}`);
console.log(`✅ Files changed: ${filesChanged}`);
console.log(`🚫 Files with no changes: ${filesProcessed - filesChanged}`);

if (changesLog.length > 0) {
  console.log('\n📝 Changes made:');
  changesLog.forEach(change => console.log(`   ${change}`));
} else {
  console.log('\n✅ No changes needed - all files already fixed!');
}

console.log('\n🎯 Next steps:');
console.log('1. Test critical pages for component fetch errors');
console.log('2. Commit changes to git');
console.log('3. Deploy to verify fixes');

// Create a report file
const report = {
  timestamp: new Date().toISOString(),
  filesProcessed,
  filesChanged,
  changes: changesLog
};

fs.writeFileSync('component-fetch-errors-fix-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Report saved to: component-fetch-errors-fix-report.json'); 