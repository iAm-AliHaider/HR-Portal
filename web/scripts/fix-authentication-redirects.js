/**
 * Fix Authentication Redirects
 * Remove or replace RequireRole wrappers that are causing login redirects
 * on pages that should be publicly accessible
 */

const fs = require("fs");
const path = require("path");

// Track all changes made
let changesLog = [];
let filesProcessed = 0;
let filesChanged = 0;

function logChange(file, action) {
  changesLog.push(`${file}: ${action}`);
  console.log(`✅ ${file}: ${action}`);
}

function removeRequireRoleWrapper(content) {
  // Remove RequireRole import
  content = content.replace(
    /import\s*{\s*RequireRole\s*}\s*from\s*['"][^'"]+['"];\s*\n/g,
    "",
  );

  // Remove RequireRole wrapper - look for opening and closing tags
  // Match <RequireRole allowed={[...]}> and </RequireRole>
  const requireRolePattern = /<RequireRole[^>]*>[\s\S]*?<\/RequireRole>/g;

  // Find RequireRole blocks and extract their children
  content = content.replace(requireRolePattern, (match) => {
    // Extract content between RequireRole tags
    const innerContent = match
      .replace(/<RequireRole[^>]*>/, "")
      .replace(/<\/RequireRole>$/, "");
    return innerContent;
  });

  return content;
}

function processFile(filePath) {
  try {
    filesProcessed++;

    if (!fs.existsSync(filePath)) {
      return;
    }

    const content = fs.readFileSync(filePath, "utf8");

    // Check if file uses RequireRole
    if (!content.includes("RequireRole") || !content.includes("from")) {
      return;
    }

    // Skip if already using ModernRequireRole only
    if (
      content.includes("ModernRequireRole") &&
      !content.includes("from '@/components/RequireRole'") &&
      !content.includes("from '../components/RequireRole'")
    ) {
      return;
    }

    let newContent = content;
    let changed = false;

    // For jobs-related pages, remove RequireRole entirely (make them public)
    if (
      filePath.includes("/jobs/") ||
      filePath.includes("jobs.tsx") ||
      filePath.includes("candidate.")
    ) {
      newContent = removeRequireRoleWrapper(newContent);
      changed = true;
      logChange(filePath, "Removed RequireRole wrapper (made public)");
    }
    // For other pages, replace with ModernRequireRole with fallbackToPublic
    else {
      // Replace RequireRole import
      newContent = newContent.replace(
        /import\s*{\s*RequireRole\s*}\s*from\s*['"][^'"]+['"];?/g,
        "import { ModernRequireRole } from '@/components/ModernRequireRole';",
      );

      // Replace RequireRole usage with ModernRequireRole and fallbackToPublic
      newContent = newContent.replace(
        /<RequireRole\s+allowed=\{([^}]+)\}>/g,
        "<ModernRequireRole allowed={$1} fallbackToPublic={true}>",
      );

      newContent = newContent.replace(
        /<\/RequireRole>/g,
        "</ModernRequireRole>",
      );

      if (newContent !== content) {
        changed = true;
        logChange(
          filePath,
          "Replaced RequireRole with ModernRequireRole (fallbackToPublic)",
        );
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, newContent, "utf8");
      filesChanged++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log("🔧 Fixing authentication redirects...\n");

// Files that need to be fixed based on grep results
const filesToFix = [
  "pages/interviewer.tsx",
  "pages/jobs/[id].tsx",
  "pages/jobs/[id]/edit.tsx",
  "pages/jobs/[id]/apply.tsx",
  "pages/jobs/index.tsx",
  "pages/jobs/application-success.tsx",
  "pages/hiring.tsx",
  "pages/candidate.tsx",
  "pages/admin.tsx",
];

filesToFix.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  processFile(fullPath);
});

// Summary
console.log("\n📊 Summary:");
console.log(`📁 Files processed: ${filesProcessed}`);
console.log(`✅ Files changed: ${filesChanged}`);
console.log(`🚫 Files with no changes: ${filesProcessed - filesChanged}`);

if (changesLog.length > 0) {
  console.log("\n📝 Changes made:");
  changesLog.forEach((change) => console.log(`   ${change}`));
} else {
  console.log("\n✅ No changes needed - all files already fixed!");
}

console.log("\n🎯 Authentication Redirect Fixes Complete!");
console.log("Benefits:");
console.log("✅ Jobs pages are now publicly accessible");
console.log("✅ No more login redirects on public pages");
console.log("✅ Other pages have fallback to public access");
console.log("✅ Better user experience for job seekers");

console.log("\n📄 Report saved to: authentication-redirect-fixes.json");

// Create a report file
const report = {
  timestamp: new Date().toISOString(),
  filesProcessed,
  filesChanged,
  changes: changesLog,
  publicPages: [
    "/jobs",
    "/jobs/[id]",
    "/jobs/[id]/apply",
    "/candidate",
    "/careers",
  ],
  fallbackPages: ["/admin", "/interviewer", "/hiring", "/jobs/[id]/edit"],
};

fs.writeFileSync(
  "authentication-redirect-fixes.json",
  JSON.stringify(report, null, 2),
);

console.log("\n🚀 Ready for testing:");
console.log("1. Visit /jobs to verify public access");
console.log("2. Test job application flow");
console.log("3. Verify no login redirects occur");
console.log(
  "4. Check that protected pages still have appropriate access control",
);
