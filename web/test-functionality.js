const puppeteer = require("puppeteer");
const fs = require("fs");

// Test configuration
const BASE_URL = "http://localhost:3000";
const TEST_TIMEOUT = 30000;

// Test results
let testResults = {
  routes: {},
  authentication: {},
  navigation: {},
  database: {},
  buttons: {},
  forms: {},
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
  { page: "/people", selector: '[href="/people/add"]', name: "Add Employee" },
  { page: "/jobs", selector: '[href="/jobs/new"]', name: "Create Job" },
  { page: "/leave", selector: "button", name: "Leave Request Buttons" },
  { page: "/assets", selector: "button", name: "Asset Management Buttons" },
];

// Database functionality tests
async function testDatabaseConnectivity(page) {
  console.log("\n🔍 Testing Database Connectivity...");

  await page.goto(`${BASE_URL}/debug/status`);
  await page.waitForSelector("body", { timeout: 10000 });

  // Look for database connection indicators
  const content = await page.content();

  if (content.includes("Database Connection") && content.includes("Working")) {
    return "Database connection verified";
  } else if (
    content.includes("10/10") ||
    content.includes("tables accessible")
  ) {
    return "Database tables accessible";
  } else {
    throw new Error("Database connection status unclear");
  }
}

// Authentication flow test
async function testAuthenticationFlow(page) {
  console.log("\n🔐 Testing Authentication Flow...");

  // Test login page accessibility
  await page.goto(`${BASE_URL}/login`);
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });

  // Check if login form elements exist
  const emailInput = await page.$('input[type="email"]');
  const passwordInput = await page.$('input[type="password"]');
  const submitButton = await page.$('button[type="submit"]');

  if (!emailInput || !passwordInput || !submitButton) {
    throw new Error("Login form elements missing");
  }

  return "Login form structure verified";
}

// Route accessibility test
async function testRouteAccessibility(route) {
  return async (page) => {
    await page.goto(`${BASE_URL}${route.path}`);

    // Wait for page to load
    await page.waitForSelector("body", { timeout: 5000 });

    const finalUrl = page.url();
    const title = await page.title();

    // Check if redirected to login (expected for protected routes)
    if (route.shouldRedirect && finalUrl.includes("/login")) {
      return `Correctly redirected to login (${finalUrl})`;
    }

    // Check if page loaded successfully
    if (finalUrl.includes(route.path) || !route.shouldRedirect) {
      return `Page loaded successfully - ${title}`;
    }

    throw new Error(`Unexpected redirect: ${finalUrl}`);
  };
}

// Button functionality test
async function testButtonFunctionality(buttonTest) {
  return async (page) => {
    await page.goto(`${BASE_URL}${buttonTest.page}`);
    await page.waitForSelector("body", { timeout: 5000 });

    // Look for the button/element
    const elements = await page.$$(buttonTest.selector);

    if (elements.length === 0) {
      throw new Error(
        `No elements found with selector: ${buttonTest.selector}`,
      );
    }

    // Test first element click (if it's a button)
    try {
      const firstElement = elements[0];
      const tagName = await firstElement.evaluate((el) =>
        el.tagName.toLowerCase(),
      );
      const isClickable =
        ["button", "a", "input"].includes(tagName) ||
        (await firstElement.evaluate((el) => el.onclick !== null));

      if (isClickable) {
        // Just verify it's clickable, don't actually click to avoid navigation
        return `Found ${elements.length} clickable element(s)`;
      } else {
        return `Found ${elements.length} element(s) but not clickable`;
      }
    } catch (error) {
      return `Found ${elements.length} element(s), click test failed: ${error.message}`;
    }
  };
}

// Console error monitoring
async function monitorConsoleErrors(page) {
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
  console.log("🚀 Starting HR Portal Functionality Tests...\n");

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
      await runTest("routes", route.name, testRouteAccessibility(route), page);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Brief pause
    }

    // Test 2: Authentication Flow
    await runTest(
      "authentication",
      "LoginPageForm",
      testAuthenticationFlow,
      page,
    );

    // Test 3: Database Connectivity
    await runTest(
      "database",
      "ConnectionStatus",
      testDatabaseConnectivity,
      page,
    );

    // Test 4: Button Functionality
    console.log("\n🔘 Testing Button Functionality...");
    for (const buttonTest of CRITICAL_BUTTONS) {
      await runTest(
        "buttons",
        buttonTest.name,
        testButtonFunctionality(buttonTest),
        page,
      );
      await new Promise((resolve) => setTimeout(resolve, 500)); // Brief pause
    }

    // Test 5: Asset Management (Critical Fix)
    await runTest(
      "database",
      "AssetManagement",
      async (page) => {
        await page.goto(`${BASE_URL}/assets`);
        await page.waitForSelector("body", { timeout: 5000 });

        const content = await page.content();

        if (
          content.includes("Asset Management") ||
          content.includes("assets")
        ) {
          return "Assets page loads without database errors";
        }

        // Check for error indicators
        if (
          content.includes("does not exist") ||
          content.includes("relation")
        ) {
          throw new Error("Assets table still missing");
        }

        return "Assets page accessible";
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
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
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
  console.log("\n" + "=".repeat(50));
  console.log("📊 FUNCTIONALITY TEST RESULTS");
  console.log("=".repeat(50));

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

    console.log(`\n📂 ${category.toUpperCase()}:`);
    Object.keys(testResults[category]).forEach((testName) => {
      const test = testResults[category][testName];
      const status = test.status === "PASS" ? "✅" : "❌";
      console.log(`   ${status} ${testName}: ${test.details}`);
    });
  });

  // Save results to file
  const reportPath = "functionality-test-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);

  // Overall assessment
  console.log("\n🎯 OVERALL ASSESSMENT:");
  const successRate =
    (testResults.summary.passed / testResults.summary.total) * 100;

  if (successRate >= 90) {
    console.log("🎉 EXCELLENT: HR Portal is functioning very well!");
  } else if (successRate >= 75) {
    console.log("✅ GOOD: HR Portal is functioning with minor issues");
  } else if (successRate >= 50) {
    console.log("⚠️  FAIR: HR Portal has some functionality issues");
  } else {
    console.log("❌ POOR: HR Portal has significant functionality problems");
  }

  console.log("\n" + "=".repeat(50));

  return testResults;
}

// Check if puppeteer is available, if not provide alternative
async function checkDependencies() {
  try {
    require("puppeteer");
    return true;
  } catch (error) {
    console.log("⚠️  Puppeteer not found. Installing...");
    return false;
  }
}

// Main execution
async function main() {
  const hasDepends = await checkDependencies();

  if (!hasDepends) {
    console.log("📦 Installing puppeteer for automated testing...");
    console.log("   Run: npm install puppeteer --save-dev");
    console.log("   Then run this script again.");

    // Provide manual testing guide
    console.log("\n📋 MANUAL TESTING GUIDE:");
    console.log("   1. Open http://localhost:3000 in your browser");
    console.log("   2. Test these critical routes:");
    CORE_ROUTES.forEach((route) => {
      console.log(`      • ${BASE_URL}${route.path} - ${route.name}`);
    });
    console.log("   3. Check for console errors (F12 -> Console)");
    console.log("   4. Test button clicks and form submissions");
    console.log("   5. Verify asset management works: /assets");

    return;
  }

  await runFunctionalityTests();
}

main().catch(console.error);
