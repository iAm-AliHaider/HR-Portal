const fs = require("fs");
const path = require("path");

console.log("🧪 Testing HR Portal Sidebar Navigation Coverage\n");

// Expected navigation structure from ModernDashboardLayout
const expectedNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    subItems: [],
  },
  {
    name: "People",
    href: "/people",
    subItems: [
      { name: "All Employees", href: "/people" },
      { name: "Add Employee", href: "/people/add" },
      { name: "Employee Profile", href: "/employee/profile" },
      { name: "Organization Chart", href: "/org-chart" },
      { name: "Teams", href: "/teams" },
      { name: "Onboarding", href: "/onboarding" },
      { name: "Offboarding", href: "/offboarding" },
    ],
  },
  {
    name: "Recruitment",
    href: "/jobs",
    subItems: [
      { name: "Job Openings", href: "/jobs" },
      { name: "Applications", href: "/applications" },
      { name: "Interviews", href: "/interviews" },
      { name: "Offers", href: "/offers" },
      { name: "Recruitment Analytics", href: "/recruitment/analytics" },
      { name: "Careers Page", href: "/careers" },
    ],
  },
  {
    name: "Leave & Time",
    href: "/leave",
    subItems: [
      { name: "My Leave", href: "/leave" },
      { name: "Leave Approvals", href: "/leave/approvals" },
      { name: "Leave Calendar", href: "/leave/calendar" },
      { name: "Time & Attendance", href: "/time-attendance" },
      { name: "Calendar", href: "/calendar" },
    ],
  },
  {
    name: "Learning & Development",
    href: "/training",
    subItems: [
      { name: "Training Courses", href: "/training" },
      { name: "Learning Portal", href: "/learning" },
      { name: "Employee Learning", href: "/employee/learning-portal" },
      { name: "Skills Management", href: "/skills" },
      { name: "Performance", href: "/performance" },
    ],
  },
  {
    name: "Finance & Payroll",
    href: "/payroll",
    subItems: [
      { name: "Payroll", href: "/payroll" },
      { name: "Payslips", href: "/payslips" },
      { name: "Benefits", href: "/benefits" },
      { name: "Expenses", href: "/expenses" },
      { name: "Loans", href: "/loans" },
      { name: "Assets", href: "/assets" },
    ],
  },
  {
    name: "Employee Experience",
    href: "/requests",
    subItems: [
      { name: "Request Panel", href: "/employee/request-panel" },
      { name: "Requests", href: "/requests" },
      { name: "Wellness Tracker", href: "/employee/wellness-tracker" },
      { name: "Team Collaboration", href: "/employee/team-collaboration" },
      { name: "Recognition", href: "/recognition" },
      { name: "Employee Surveys", href: "/employee-surveys" },
    ],
  },
  {
    name: "Workflows & Tasks",
    href: "/workflows",
    subItems: [
      { name: "Workflows", href: "/workflows" },
      { name: "Tasks", href: "/tasks" },
      { name: "Approvals", href: "/approvals" },
      { name: "Role & Workflow Mgmt", href: "/role-workflow-management" },
      { name: "Onboarding Tasks", href: "/onboarding-tasks" },
    ],
  },
  {
    name: "Reports & Analytics",
    href: "/reports",
    subItems: [
      { name: "HR Analytics", href: "/hr-analytics" },
      { name: "Financial Reports", href: "/reports/financial" },
      { name: "Workforce Reports", href: "/reports/workforce" },
      { name: "Compliance Reports", href: "/reports/compliance" },
      { name: "Recruitment Reports", href: "/recruitment/reports" },
      { name: "All Reports", href: "/reports" },
    ],
  },
  {
    name: "Facilities & Safety",
    href: "/facilities",
    subItems: [
      { name: "Facilities", href: "/facilities" },
      { name: "Room Bookings", href: "/bookings" },
      { name: "Safety Management", href: "/safety" },
      { name: "Equipment", href: "/facilities/equipment" },
      { name: "Incidents", href: "/incidents" },
    ],
  },
  {
    name: "Compliance & Documents",
    href: "/compliance",
    subItems: [
      { name: "Compliance", href: "/compliance" },
      { name: "Documents", href: "/documents" },
      { name: "Exit Management", href: "/exit-management" },
      { name: "Grievances", href: "/grievances" },
    ],
  },
  {
    name: "Administration",
    href: "/admin",
    subItems: [
      { name: "Admin Panel", href: "/admin" },
      { name: "User Management", href: "/admin/user-management" },
      { name: "Settings", href: "/settings" },
      { name: "Workflow Manager", href: "/settings/workflow-manager" },
      { name: "Eligibility Manager", href: "/settings/eligibility-manager" },
      { name: "Logs", href: "/logs" },
      { name: "Setup Validation", href: "/setup-validation" },
    ],
  },
];

// Get all page files
function getAllPages() {
  const pagesDir = path.join(process.cwd(), "pages");
  const pages = [];

  function scanDirectory(dir, basePath = "") {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip certain directories
        if (!["api", ".next", "node_modules"].includes(item)) {
          scanDirectory(fullPath, basePath + "/" + item);
        }
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        // Convert file path to route
        let route = basePath + "/" + item.replace(/\.(tsx|ts)$/, "");
        route = route.replace("/index", "");
        if (route === "") route = "/";

        pages.push({
          file: path.relative(pagesDir, fullPath),
          route: route || "/",
        });
      }
    }
  }

  scanDirectory(pagesDir);
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

// Test navigation coverage
function testNavigationCoverage() {
  console.log("📋 Testing Navigation Coverage...\n");

  const pages = getAllPages();
  const allNavRoutes = [];

  // Collect all routes from navigation
  expectedNavigation.forEach((section) => {
    allNavRoutes.push(section.href);
    section.subItems.forEach((subItem) => {
      allNavRoutes.push(subItem.href);
    });
  });

  // Remove duplicates
  const uniqueNavRoutes = [...new Set(allNavRoutes)].sort();

  console.log(`📊 Navigation Statistics:`);
  console.log(`   Main Navigation Sections: ${expectedNavigation.length}`);
  console.log(`   Total Navigation Routes: ${uniqueNavRoutes.length}`);
  console.log(`   Total Page Files: ${pages.length}`);
  console.log("");

  // Check coverage
  const missingPages = [];
  const extraPages = [];

  uniqueNavRoutes.forEach((route) => {
    const pageExists = pages.some((page) => page.route === route);
    if (!pageExists) {
      missingPages.push(route);
    }
  });

  pages.forEach((page) => {
    if (
      !uniqueNavRoutes.includes(page.route) &&
      !page.route.startsWith("/api/") &&
      !page.route.includes("[") && // Dynamic routes
      !page.route.includes("_") && // Next.js special files
      !page.route.includes("debug") && // Debug pages
      !page.route.includes("test") && // Test pages
      !page.route.includes("demo") && // Demo pages
      !page.route.includes("modern") && // Alternative versions
      !page.route.includes("enhanced") && // Enhanced versions
      !page.route.includes("simple") && // Simple versions
      !page.route.includes("404") &&
      page.route !== "/login" &&
      page.route !== "/register" &&
      page.route !== "/unauthorized" &&
      page.route !== "/forgot-password"
    ) {
      extraPages.push(page);
    }
  });

  return { uniqueNavRoutes, pages, missingPages, extraPages };
}

// Test navigation structure
function testNavigationStructure() {
  console.log("🏗️  Testing Navigation Structure...\n");

  expectedNavigation.forEach((section, index) => {
    console.log(`${index + 1}. ${section.name} (${section.href})`);

    if (section.subItems.length > 0) {
      section.subItems.forEach((subItem, subIndex) => {
        console.log(
          `   ${subIndex + 1}.${subIndex + 1} ${subItem.name} (${subItem.href})`,
        );
      });
    }
    console.log("");
  });
}

// Test enhanced features
function testEnhancedFeatures() {
  console.log("🚀 Testing Enhanced Features...\n");

  const enhancedPages = [
    "/dashboard-enhanced",
    "/people-enhanced",
    "/jobs-enhanced",
    "/leave-enhanced",
    "/training-enhanced",
    "/applications-enhanced",
    "/performance-enhanced",
    "/onboarding-enhanced",
    "/compliance-enhanced",
  ];

  const pages = getAllPages();

  enhancedPages.forEach((route) => {
    const exists = pages.some((page) => page.route === route);
    console.log(`   ${exists ? "✅" : "❌"} ${route}`);
  });

  console.log("");
}

// Main test execution
function runNavigationTests() {
  console.log("🎯 HR Portal Navigation Test Suite\n");
  console.log("═".repeat(50));
  console.log("");

  // Test 1: Navigation Structure
  testNavigationStructure();

  // Test 2: Coverage Analysis
  const { uniqueNavRoutes, pages, missingPages, extraPages } =
    testNavigationCoverage();

  // Test 3: Enhanced Features
  testEnhancedFeatures();

  // Results Summary
  console.log("📋 Test Results Summary");
  console.log("═".repeat(30));
  console.log("");

  if (missingPages.length === 0) {
    console.log("✅ All navigation routes have corresponding pages");
  } else {
    console.log(
      `⚠️  Missing pages for navigation routes (${missingPages.length}):`,
    );
    missingPages.forEach((route) => console.log(`   - ${route}`));
    console.log("");
  }

  if (extraPages.length === 0) {
    console.log("✅ No orphaned pages found");
  } else {
    console.log(
      `ℹ️  Additional pages not in navigation (${extraPages.length}):`,
    );
    extraPages
      .slice(0, 10)
      .forEach((page) => console.log(`   - ${page.route} (${page.file})`));
    if (extraPages.length > 10) {
      console.log(`   ... and ${extraPages.length - 10} more`);
    }
    console.log("");
  }

  // Coverage percentage
  const coveragePercent = Math.round(
    (uniqueNavRoutes.length / (uniqueNavRoutes.length + missingPages.length)) *
      100,
  );
  console.log(`📊 Navigation Coverage: ${coveragePercent}%`);
  console.log(`📈 Total HR Modules: ${expectedNavigation.length}`);
  console.log(`🔗 Total Navigation Links: ${uniqueNavRoutes.length}`);

  // Final assessment
  console.log("");
  console.log("🎯 NAVIGATION ASSESSMENT");
  console.log("═".repeat(25));

  if (missingPages.length === 0 && expectedNavigation.length >= 11) {
    console.log(
      "🏆 EXCELLENT: Complete navigation structure with all HR modules",
    );
    console.log("✅ Ready for production deployment");
  } else if (missingPages.length <= 2) {
    console.log("👍 GOOD: Nearly complete navigation with minor gaps");
    console.log("⚠️  Fix missing pages before deployment");
  } else {
    console.log("⚠️  NEEDS WORK: Significant navigation gaps found");
    console.log("🔧 Address missing pages before deployment");
  }

  console.log("\n" + "═".repeat(50));
  console.log("🎉 Navigation test completed!");
}

// Run the tests
runNavigationTests();
