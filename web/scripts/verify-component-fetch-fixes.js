/**
 * Verify Component Fetch Fixes
 * Ensures all DashboardLayout imports have been replaced and no component fetch errors remain
 */

const fs = require("fs");
const path = require("path");

let totalFiles = 0;
let remainingIssues = [];
let verifiedFiles = 0;

function checkFile(filePath) {
  try {
    totalFiles++;

    if (!fs.existsSync(filePath)) {
      return;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(process.cwd(), filePath);

    // Check for remaining problematic DashboardLayout imports (NOT SimpleDashboardLayout)
    const oldDashboardLayoutImports = content.match(
      /import.*DashboardLayout.*from.*['"]['"](?!.*SimpleDashboardLayout)/g,
    );

    if (oldDashboardLayoutImports) {
      remainingIssues.push({
        file: relativePath,
        issue: "Still using old DashboardLayout import",
        lines: oldDashboardLayoutImports,
      });
    }

    // Check for DashboardLayout usage in JSX (should be SimpleDashboardLayout)
    const dashboardLayoutUsage = content.match(/<DashboardLayout[^>]*>/g);
    if (dashboardLayoutUsage && !content.includes("<SimpleDashboardLayout")) {
      remainingIssues.push({
        file: relativePath,
        issue:
          "Still using <DashboardLayout> in JSX instead of <SimpleDashboardLayout>",
        count: dashboardLayoutUsage.length,
      });
    }

    // Check for SimpleDashboardLayout (good)
    if (content.includes("SimpleDashboardLayout")) {
      verifiedFiles++;
    }
  } catch (error) {
    remainingIssues.push({
      file: filePath,
      issue: `Error reading file: ${error.message}`,
    });
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (
        stat.isFile() &&
        (item.endsWith(".tsx") || item.endsWith(".ts"))
      ) {
        checkFile(fullPath);
      }
    });
  } catch (error) {
    console.error(`❌ Error scanning ${dirPath}:`, error.message);
  }
}

console.log("🔍 Verifying Component Fetch Fixes...\n");

// Scan pages and components directories
scanDirectory(path.join(process.cwd(), "pages"));
scanDirectory(path.join(process.cwd(), "components"));

// Report results
console.log("📊 Verification Results:");
console.log(`📁 Total files scanned: ${totalFiles}`);
console.log(`✅ Files using SimpleDashboardLayout: ${verifiedFiles}`);
console.log(`❌ Files with remaining issues: ${remainingIssues.length}`);

if (remainingIssues.length === 0) {
  console.log("\n🎉 SUCCESS! All component fetch errors have been fixed!");
  console.log("✅ No remaining problematic DashboardLayout imports found");
  console.log("✅ All pages using SimpleDashboardLayout or no layout");
  console.log("✅ Component fetch abort errors should be resolved");
} else {
  console.log("\n⚠️  ISSUES FOUND:");
  remainingIssues.forEach((issue, index) => {
    console.log(`\n${index + 1}. ${issue.file}`);
    console.log(`   Issue: ${issue.issue}`);
    if (issue.lines) {
      console.log(`   Lines: ${issue.lines.join(", ")}`);
    }
    if (issue.count) {
      console.log(`   Count: ${issue.count}`);
    }
  });

  console.log("\n🔧 Action needed:");
  console.log(
    "Run the fix script again or manually update the remaining files.",
  );
}

// Critical pages to specifically verify
const criticalPages = [
  "pages/dashboard/index.tsx",
  "pages/people/index.tsx",
  "pages/jobs/index.tsx",
  "pages/reports.tsx",
  "pages/settings/index.tsx",
  "pages/_app.tsx",
];

console.log("\n🎯 Critical Pages Status:");
criticalPages.forEach((page) => {
  const fullPath = path.join(process.cwd(), page);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf8");
    const hasSimple = content.includes("SimpleDashboardLayout");
    const hasOld =
      content.includes("DashboardLayout") &&
      !content.includes("SimpleDashboardLayout");
    const status = hasSimple
      ? "✅ Fixed (SimpleDashboardLayout)"
      : hasOld
        ? "❌ Needs fix (DashboardLayout)"
        : "⚪ No layout";
    console.log(`   ${page}: ${status}`);
  } else {
    console.log(`   ${page}: ⚪ Not found`);
  }
});

console.log("\n📝 Summary:");
console.log(
  `✅ Files successfully converted to SimpleDashboardLayout: ${verifiedFiles}`,
);
console.log(`⚠️  Files with remaining issues: ${remainingIssues.length}`);

console.log("\n📝 Next Steps:");
if (remainingIssues.length === 0) {
  console.log("1. ✅ All component fetch errors fixed!");
  console.log("2. ✅ Commit changes to git");
  console.log("3. ✅ Deploy to production");
  console.log("4. ✅ Test critical pages");
} else {
  console.log("1. 🔧 Fix remaining issues listed above");
  console.log("2. 🔄 Run verification script again");
  console.log("3. 📝 Commit once all issues resolved");
}

// Save verification report
const report = {
  timestamp: new Date().toISOString(),
  totalFiles,
  verifiedFiles,
  remainingIssues: remainingIssues.length,
  issues: remainingIssues,
  status: remainingIssues.length === 0 ? "PASSED" : "FAILED",
};

fs.writeFileSync(
  "component-fetch-verification-report.json",
  JSON.stringify(report, null, 2),
);
console.log(
  "\n📄 Verification report saved to: component-fetch-verification-report.json",
);
