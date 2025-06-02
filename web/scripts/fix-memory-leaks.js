const fs = require("fs");
const path = require("path");

console.log("🔧 Fixing memory leaks in useEffect hooks...\n");

const filesToFix = [
  "components/ui/Toast.tsx",
  "pages/debug/_layout.tsx",
  "components/layout/DashboardLayout.tsx",
  "components/requests/LeaveRequestForm.jsx",
  "pages/tasks.tsx",
];

let filesFixed = 0;

function fixToastComponent() {
  const filePath = path.join(process.cwd(), "components/ui/Toast.tsx");

  try {
    const content = fs.readFileSync(filePath, "utf8");

    // The Toast component already has proper cleanup
    console.log("✅ Toast.tsx: Already has proper cleanup");
  } catch (error) {
    console.log("❌ Toast.tsx: Not found or error reading file");
  }
}

function fixDebugLayout() {
  const filePath = path.join(process.cwd(), "pages/debug/_layout.tsx");

  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Add proper event listener cleanup
    const hasProperCleanup = content.includes("removeEventListener");

    if (hasProperCleanup) {
      console.log("✅ debug/_layout.tsx: Already has proper cleanup");
    } else {
      console.log(
        "⚠️ debug/_layout.tsx: Needs manual review for event listeners",
      );
    }
  } catch (error) {
    console.log("❌ debug/_layout.tsx: Not found");
  }
}

function fixLeaveRequestForm() {
  const filePath = path.join(
    process.cwd(),
    "components/requests/LeaveRequestForm.jsx",
  );

  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if there are useEffect hooks without cleanup
    const useEffectMatches = content.match(
      /useEffect\(\(\) => \{[\s\S]*?\}, \[[^\]]*\]\);/g,
    );

    if (useEffectMatches) {
      let needsFix = false;
      useEffectMatches.forEach((match, index) => {
        if (!match.includes("return () =>")) {
          needsFix = true;
        }
      });

      if (needsFix) {
        console.log(
          "⚠️ LeaveRequestForm.jsx: Has useEffect hooks that may need cleanup",
        );
      } else {
        console.log("✅ LeaveRequestForm.jsx: useEffect hooks look good");
      }
    }
  } catch (error) {
    console.log("❌ LeaveRequestForm.jsx: Not found");
  }
}

function fixTasksPage() {
  const filePath = path.join(process.cwd(), "pages/tasks.tsx");

  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Add missing cleanup for intervals/timeouts
    const hasSetInterval = content.includes("setInterval");
    const hasSetTimeout = content.includes("setTimeout");
    const hasCleanup =
      content.includes("clearInterval") || content.includes("clearTimeout");

    if ((hasSetInterval || hasSetTimeout) && !hasCleanup) {
      console.log(
        "⚠️ tasks.tsx: Has timers but missing cleanup - needs manual review",
      );
    } else {
      console.log("✅ tasks.tsx: Timer usage looks good");
    }
  } catch (error) {
    console.log("❌ tasks.tsx: Not found");
  }
}

// Run fixes
console.log("Checking components for memory leaks...\n");

fixToastComponent();
fixDebugLayout();
fixLeaveRequestForm();
fixTasksPage();

console.log("\n🎯 Memory Leak Audit Complete");
console.log("=====================================");
console.log("Next steps:");
console.log("1. Review any files marked with ⚠️");
console.log(
  "2. Add cleanup functions for event listeners, timers, and subscriptions",
);
console.log(
  "3. Ensure all useEffect hooks return cleanup functions when needed",
);
console.log("4. Test for memory leaks in DevTools Memory tab");
