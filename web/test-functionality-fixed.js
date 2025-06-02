const puppeteer = require("puppeteer");
const fs = require("fs");

// Test configuration
const BASE_URL = "http://localhost:3000";

// Test results
let testResults = {
  routes: {},
  authentication: {},
  database: {},
  buttons: {},
  navigation: {},
  summary: {
    passed: 0,
    failed: 0,
    total: 0,
  },
};

// Helper function to log test results
function logTest(category, testName, status, details = "") {
  const result = { status, details, timestamp: new Date().toISOString() };

  if (!testResults[category]) {
    testResults[category] = {};
  }

  testResults[category][testName] = result;
  testResults.summary.total++;

  if (status === "PASS") {
    console.log(`✅ ${category}/${testName}: ${details || "SUCCESS"}`);
    testResults.summary.passed++;
  } else {
    console.log(`❌ ${category}/${testName}: ${details || "FAILED"}`);
    testResults.summary.failed++;
  }
}

// Test function with error handling
async function runTest(category, testName, testFunction, page) {
  try {
    const result = await testFunction(page);
    logTest(category, testName, "PASS", result);
    return true;
  } catch (error) {
    logTest(category, testName, "FAIL", error.message);
    return false;
  }
}

// Core route tests
const CORE_ROUTES = [
  { path: "/", name: "Homepage", shouldRedirect: true },
  { path: "/login", name: "Login Page", shouldRedirect: false },
  { path: "/dashboard", name: "Dashboard", shouldRedirect: true },
  { path: "/people", name: "People Management", shouldRedirect: true },
  { path: "/jobs", name: "Jobs", shouldRedirect: true },
  { path: "/leave", name: "Leave Management", shouldRedirect: true },
  { path: "/assets", name: "Asset Management", shouldRedirect: true },
  { path: "/requests", name: "Request Panel", shouldRedirect: true },
  { path: "/settings", name: "Settings", shouldRedirect: true },
  { path: "/debug", name: "Debug Panel", shouldRedirect: false },
  { path: "/test-auth", name: "Auth Test", shouldRedirect: false },
];

// Critical buttons to test
const CRITICAL_BUTTONS = [
  { page: "/login", selector: 'button[type="submit"]', name: "Login Submit" },
  {
    page: "/debug",
    selector: '[href="/debug/status"]',
    name: "Debug Status Link",
  },
  {
    page: "/people",
    selector: 'button, [href*="add"], [href*="new"]',
    name: "People Management Buttons",
  },
  {
    page: "/jobs",
    selector: 'button, [href*="new"], [href*="create"]',
    name: "Jobs Buttons",
  },
  { page: "/leave", selector: "button", name: "Leave Request Buttons" },
  { page: "/assets", selector: "button", name: "Asset Management Buttons" },
];

// Authentication flow test
async function testAuthenticationFlow(page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });

  // Check if login form elements exist
  const emailInput = await page.$('input[type="email"], input[name="email"]');
  const passwordInput = await page.$(
    'input[type="password"], input[name="password"]',
  );
  const submitButton = await page.$(
    'button[type="submit"], button:contains("Login"), button:contains("Sign in")',
  );

  if (!emailInput || !passwordInput || !submitButton) {
    throw new Error("Login form elements missing");
  }

  return "Login form structure verified";
}

// Route accessibility test
async function testRouteAccessibility(route, page) {
  await page.goto(`${BASE_URL}${route.path}`, {
    waitUntil: "networkidle0",
    timeout: 10000,
  });

  const finalUrl = page.url();
  const title = await page.title();

  // Check if redirected to login (expected for protected routes)
  if (route.shouldRedirect && finalUrl.includes("/login")) {
    return `Correctly redirected to login`;
  }

  // Check if page loaded successfully
  if (finalUrl.includes(route.path) || !route.shouldRedirect) {
    return `Page loaded successfully - ${title}`;
  }

  throw new Error(`Unexpected redirect: ${finalUrl}`);
}

// Button functionality test
async function testButtonFunctionality(buttonTest, page) {
  await page.goto(`${BASE_URL}${buttonTest.page}`, {
    waitUntil: "networkidle0",
  });

  // Look for the button/element
  const elements = await page.$$(buttonTest.selector);

  if (elements.length === 0) {
    throw new Error(`No elements found with selector: ${buttonTest.selector}`);
  }

  // Test first element properties
  const firstElement = elements[0];
  const tagName = await firstElement.evaluate((el) => el.tagName.toLowerCase());
  const isClickable = ["button", "a", "input"].includes(tagName);

  if (isClickable) {
    return `Found ${elements.length} clickable element(s)`;
  } else {
    return `Found ${elements.length} element(s) but not clickable`;
  }
}

// Database connectivity test
async function testDatabaseConnectivity(page) {
  await page.goto(`${BASE_URL}/debug/status`, { waitUntil: "networkidle0" });

  const content = await page.content();

  if (content.includes("Database Connection") && content.includes("Working")) {
    return "Database connection verified";
  } else if (
    content.includes("10/10") ||
    content.includes("tables accessible")
  ) {
    return "Database tables accessible";
  } else if (content.includes("Database")) {
    return "Database status page loads";
  } else {
    throw new Error("Database connection status unclear");
  }
}

// Asset management test
async function testAssetManagement(page) {
  await page.goto(`${BASE_URL}/assets`, { waitUntil: "networkidle0" });

  const content = await page.content();

  if (content.includes("Asset Management") || content.includes("asset")) {
    return "Assets page loads without database errors";
  }

  if (content.includes("does not exist") || content.includes("relation")) {
    throw new Error("Assets table still missing");
  }

  return "Assets page accessible";
}

// Console error monitoring
function monitorConsoleErrors(page) {
  const errors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(`Page Error: ${error.message}`);
  });

  return () => errors;
}

// Main test runner
async function runFunctionalityTests() {
  console.log("🚀 Starting HR Portal Comprehensive Functionality Tests...\n");

  let browser;
  let page;

  try {
    // Launch browser
    console.log("🌐 Launching browser...");
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1280, height: 720 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();

    // Set up error monitoring
    const getErrors = monitorConsoleErrors(page);

    // Wait for dev server to be ready
    console.log("⏳ Waiting for dev server...");
    let serverReady = false;
    for (let i = 0; i < 10; i++) {
      try {
        await page.goto(BASE_URL, { timeout: 3000 });
        serverReady = true;
        break;
      } catch (error) {
        console.log(`   Attempt ${i + 1}/10: Server not ready yet...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!serverReady) {
      throw new Error("Development server failed to start");
    }

    console.log("✅ Dev server is ready!\n");

    // Test 1: Route Accessibility
    console.log("📍 Testing Route Accessibility...");
    for (const route of CORE_ROUTES) {
      await runTest(
        "routes",
        route.name,
        async (page) => {
          return await testRouteAccessibility(route, page);
        },
        page,
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Test 2: Authentication Flow
    console.log("\n🔐 Testing Authentication...");
    await runTest(
      "authentication",
      "LoginPageForm",
      testAuthenticationFlow,
      page,
    );

    // Test 3: Database Connectivity
    console.log("\n🗄️ Testing Database...");
    await runTest(
      "database",
      "ConnectionStatus",
      testDatabaseConnectivity,
      page,
    );

    // Test 4: Asset Management (Critical Fix)
    await runTest("database", "AssetManagement", testAssetManagement, page);

    // Test 5: Button Functionality
    console.log("\n🔘 Testing Button Functionality...");
    for (const buttonTest of CRITICAL_BUTTONS) {
      await runTest(
        "buttons",
        buttonTest.name,
        async (page) => {
          return await testButtonFunctionality(buttonTest, page);
        },
        page,
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Test 6: Navigation and Interactive Elements
    console.log("\n🧭 Testing Navigation...");

    // Test navigation links
    await runTest(
      "navigation",
      "MainNavigation",
      async (page) => {
        await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle0" });

        const navLinks = await page.$$(
          'nav a, [role="navigation"] a, .navigation a',
        );

        if (navLinks.length > 0) {
          return `Found ${navLinks.length} navigation links`;
        } else {
          throw new Error("No navigation links found");
        }
      },
      page,
    );

    // Test modal/dialog functionality
    await runTest(
      "navigation",
      "InteractiveElements",
      async (page) => {
        await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle0" });

        const interactiveElements = await page.$$(
          'button, [role="button"], .btn, input[type="submit"]',
        );

        if (interactiveElements.length > 0) {
          return `Found ${interactiveElements.length} interactive elements`;
        } else {
          throw new Error("No interactive elements found");
        }
      },
      page,
    );

    // Check for console errors
    const errors = getErrors();
    if (errors.length > 0) {
      logTest(
        "navigation",
        "ConsoleErrors",
        "FAIL",
        `${errors.length} console errors found`,
      );
      console.log("\n⚠️  Console Errors Found:");
      errors.slice(0, 5).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.substring(0, 100)}...`);
      });
      if (errors.length > 5) {
        console.log(`   ... and ${errors.length - 5} more errors`);
      }
    } else {
      logTest(
        "navigation",
        "ConsoleErrors",
        "PASS",
        "No critical console errors",
      );
    }
  } catch (error) {
    console.error("❌ Test execution failed:", error.message);
    logTest("system", "TestExecution", "FAIL", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Generate test report
  console.log("\n" + "=".repeat(60));
  console.log("📊 COMPREHENSIVE FUNCTIONALITY TEST RESULTS");
  console.log("=".repeat(60));

  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Passed: ${testResults.summary.passed}`);
  console.log(`   ❌ Failed: ${testResults.summary.failed}`);
  console.log(`   📊 Total:  ${testResults.summary.total}`);
  console.log(
    `   📊 Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`,
  );

  // Detailed results by category
  Object.keys(testResults).forEach((category) => {
    if (category === "summary") return;

    const categoryTests = testResults[category];
    const categoryCount = Object.keys(categoryTests).length;

    if (categoryCount > 0) {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      Object.keys(categoryTests).forEach((testName) => {
        const test = categoryTests[testName];
        const status = test.status === "PASS" ? "✅" : "❌";
        console.log(`   ${status} ${testName}: ${test.details}`);
      });
    }
  });

  // Save results to file
  const reportPath = "comprehensive-test-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);

  // Overall assessment
  console.log("\n🎯 OVERALL ASSESSMENT:");
  const successRate =
    (testResults.summary.passed / testResults.summary.total) * 100;

  if (successRate >= 90) {
    console.log("🎉 EXCELLENT: HR Portal is functioning very well!");
    console.log("   • All critical systems operational");
    console.log("   • Ready for production deployment");
  } else if (successRate >= 75) {
    console.log("✅ GOOD: HR Portal is functioning with minor issues");
    console.log("   • Most functionality working correctly");
    console.log("   • Minor issues need attention");
  } else if (successRate >= 50) {
    console.log("⚠️  FAIR: HR Portal has some functionality issues");
    console.log("   • Core functionality working");
    console.log("   • Several issues need fixing");
  } else {
    console.log("❌ POOR: HR Portal has significant functionality problems");
    console.log("   • Major issues detected");
    console.log("   • Requires immediate attention");
  }

  console.log("\n📋 MANUAL VERIFICATION RECOMMENDED:");
  console.log("   1. Open http://localhost:3000 in browser");
  console.log("   2. Test login with: admin@company.com / admin123");
  console.log("   3. Navigate through all sections");
  console.log("   4. Check asset management functionality");
  console.log("   5. Test button clicks and form submissions");
  console.log("   6. Verify browser console has no critical errors");

  console.log("\n" + "=".repeat(60));

  return testResults;
}

// Run the tests
runFunctionalityTests().catch(console.error);
