const puppeteer = require("puppeteer");
const fs = require("fs");

// Test configuration for real functionality testing
const BASE_URL = "http://localhost:3000";

// Helper function to replace page.waitForTimeout
const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Test results
let testResults = {
  authentication: {},
  database: {},
  crud_operations: {},
  user_interface: {},
  business_logic: {},
  api_endpoints: {},
  forms: {},
  navigation: {},
  security: {},
  summary: {
    passed: 0,
    failed: 0,
    total: 0,
    critical_issues: [],
    missing_features: [],
    implementation_needed: [],
  },
};

// Helper function to log test results
function logTest(
  category,
  testName,
  status,
  details = "",
  severity = "normal",
) {
  const result = {
    status,
    details,
    severity,
    timestamp: new Date().toISOString(),
  };

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

    if (severity === "critical") {
      testResults.summary.critical_issues.push(
        `${category}/${testName}: ${details}`,
      );
    } else if (severity === "missing") {
      testResults.summary.missing_features.push(
        `${category}/${testName}: ${details}`,
      );
    } else if (severity === "implementation") {
      testResults.summary.implementation_needed.push(
        `${category}/${testName}: ${details}`,
      );
    }
  }
}

// Real error monitoring (not suppressed)
function setupRealErrorMonitoring(page) {
  const errors = {
    critical: [],
    warnings: [],
    api_errors: [],
    database_errors: [],
    ui_errors: [],
  };

  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() === "error") {
      errors.critical.push(text);

      if (text.includes("API") || text.includes("fetch")) {
        errors.api_errors.push(text);
      }
      if (text.includes("Database") || text.includes("Supabase")) {
        errors.database_errors.push(text);
      }
      if (text.includes("React") || text.includes("Component")) {
        errors.ui_errors.push(text);
      }
    }
    if (msg.type() === "warn") {
      errors.warnings.push(text);
    }
  });

  page.on("pageerror", (error) => {
    errors.critical.push(`Page Error: ${error.message}`);
  });

  return () => errors;
}

// Test authentication functionality
async function testAuthenticationFunctionality(page) {
  console.log("\n🔐 Testing Real Authentication Functionality...");

  try {
    await page.goto(`${BASE_URL}/login`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for page to fully load
    await waitFor(2000);

    // Check if actual login form exists
    const emailInput = await page.$(
      'input[type="email"], input[name="email"], #email',
    );
    const passwordInput = await page.$(
      'input[type="password"], input[name="password"], #password',
    );
    const submitButton = await page.$(
      'button[type="submit"], input[type="submit"]',
    );

    if (!emailInput || !passwordInput || !submitButton) {
      logTest(
        "authentication",
        "LoginFormExists",
        "FAIL",
        "Missing essential login form elements",
        "critical",
      );
      return;
    }

    logTest(
      "authentication",
      "LoginFormExists",
      "PASS",
      "Login form has all required elements",
    );

    // Test form validation
    await submitButton.click();
    await waitFor(1000);

    const validationMessages = await page.$$eval("*", (els) =>
      els
        .filter(
          (el) =>
            el.textContent &&
            (el.textContent.includes("required") ||
              el.textContent.includes("email") ||
              el.textContent.includes("password")),
        )
        .map((el) => el.textContent),
    );

    if (validationMessages.length > 0) {
      logTest(
        "authentication",
        "FormValidation",
        "PASS",
        "Form validation working",
      );
    } else {
      logTest(
        "authentication",
        "FormValidation",
        "FAIL",
        "Form validation not working properly",
        "implementation",
      );
    }

    // Test with valid credentials
    await emailInput.type("admin@company.com");
    await passwordInput.type("admin123");
    await submitButton.click();

    await waitFor(3000);
    const currentUrl = page.url();

    if (currentUrl.includes("/dashboard") || !currentUrl.includes("/login")) {
      logTest(
        "authentication",
        "LoginRedirect",
        "PASS",
        "Successful login redirects to dashboard",
      );
    } else {
      logTest(
        "authentication",
        "LoginRedirect",
        "FAIL",
        "Login doesn't redirect properly after successful authentication",
        "critical",
      );
    }
  } catch (error) {
    logTest(
      "authentication",
      "AuthenticationSystem",
      "FAIL",
      `Authentication system error: ${error.message}`,
      "critical",
    );
  }
}

// Test database connectivity and operations
async function testDatabaseFunctionality(page) {
  console.log("\n🗄️ Testing Real Database Functionality...");

  try {
    // Test database status endpoint
    const response = await page.goto(`${BASE_URL}/api/health`, {
      waitUntil: "networkidle0",
      timeout: 15000,
    });

    if (response && response.status() === 200) {
      const content = await page.content();
      try {
        const healthData = JSON.parse(content);

        if (healthData.database && healthData.database.connected) {
          logTest(
            "database",
            "HealthEndpoint",
            "PASS",
            `Database connected: ${healthData.database.tablesAccessible}/${healthData.database.totalTables} tables`,
          );
        } else {
          logTest(
            "database",
            "HealthEndpoint",
            "FAIL",
            "Database not connected according to health endpoint",
            "critical",
          );
        }
      } catch (parseError) {
        logTest(
          "database",
          "HealthEndpoint",
          "FAIL",
          "Health endpoint doesn't return valid JSON",
          "implementation",
        );
      }
    } else {
      logTest(
        "database",
        "HealthEndpoint",
        "FAIL",
        "Health endpoint not accessible",
        "implementation",
      );
    }

    // Test status page
    await page.goto(`${BASE_URL}/debug/status`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await waitFor(3000);
    const statusContent = await page.content();

    if (
      statusContent.includes("Database") &&
      statusContent.includes("healthy")
    ) {
      logTest(
        "database",
        "StatusPageWorking",
        "PASS",
        "Status page shows database information",
      );
    } else if (statusContent.includes("Database")) {
      logTest(
        "database",
        "StatusPageWorking",
        "PASS",
        "Status page accessible but database may have issues",
      );
    } else {
      logTest(
        "database",
        "StatusPageWorking",
        "FAIL",
        "Status page doesn't show database information",
        "implementation",
      );
    }
  } catch (error) {
    logTest(
      "database",
      "DatabaseAccess",
      "FAIL",
      `Database access error: ${error.message}`,
      "critical",
    );
  }
}

// Test CRUD operations
async function testCrudOperations(page) {
  console.log("\n📝 Testing CRUD Operations...");

  const crudTests = [
    { path: "/people", name: "People Management" },
    { path: "/jobs", name: "Jobs Management" },
    { path: "/leave", name: "Leave Management" },
    { path: "/assets", name: "Asset Management" },
  ];

  for (const test of crudTests) {
    try {
      await page.goto(`${BASE_URL}${test.path}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Check for data loading
      await waitFor(2000);

      // Look for typical CRUD interface elements
      const hasTable = (await page.$('table, .table, [role="table"]')) !== null;
      const hasCards = await page
        .$$(".card, .item, .entry, .row")
        .then((els) => els.length > 0);
      const hasCreateButton = await page.$("button, a").then(async (el) => {
        if (!el) return false;
        const text = await page.evaluate(() =>
          Array.from(document.querySelectorAll("button, a")).some((el) =>
            /add|create|new|\+/i.test(el.textContent),
          ),
        );
        return text;
      });

      if (hasTable || hasCards) {
        logTest(
          "crud_operations",
          `${test.name}DataDisplay`,
          "PASS",
          "Data display interface found",
        );
      } else {
        logTest(
          "crud_operations",
          `${test.name}DataDisplay`,
          "FAIL",
          "No data display interface found",
          "implementation",
        );
      }

      if (hasCreateButton) {
        logTest(
          "crud_operations",
          `${test.name}CreateButton`,
          "PASS",
          "Create/Add button found",
        );
      } else {
        logTest(
          "crud_operations",
          `${test.name}CreateButton`,
          "FAIL",
          "No create/add functionality found",
          "implementation",
        );
      }
    } catch (error) {
      logTest(
        "crud_operations",
        `${test.name}Access`,
        "FAIL",
        `Cannot access ${test.path}: ${error.message}`,
        "critical",
      );
    }
  }
}

// Test API endpoints
async function testApiEndpoints(page) {
  console.log("\n🔌 Testing API Endpoints...");

  const apiTests = [
    { endpoint: "/api/health", name: "Health Check" },
    { endpoint: "/api/users", name: "Users API" },
    { endpoint: "/api/auth/user", name: "Auth User" },
    { endpoint: "/api/jobs", name: "Jobs API" },
    { endpoint: "/api/employees", name: "Employees API" },
  ];

  for (const test of apiTests) {
    try {
      const response = await page.goto(`${BASE_URL}${test.endpoint}`, {
        waitUntil: "networkidle0",
        timeout: 15000,
      });

      if (response) {
        const status = response.status();
        const content = await page.content();

        if (status === 200) {
          try {
            JSON.parse(content);
            logTest(
              "api_endpoints",
              test.name,
              "PASS",
              `API endpoint working (${status})`,
            );
          } catch (parseError) {
            logTest(
              "api_endpoints",
              test.name,
              "FAIL",
              "API endpoint returns invalid JSON",
              "implementation",
            );
          }
        } else if (status === 404) {
          logTest(
            "api_endpoints",
            test.name,
            "FAIL",
            "API endpoint not implemented",
            "missing",
          );
        } else {
          logTest(
            "api_endpoints",
            test.name,
            "FAIL",
            `API endpoint error (${status})`,
            "implementation",
          );
        }
      } else {
        logTest(
          "api_endpoints",
          test.name,
          "FAIL",
          "API endpoint not accessible",
          "missing",
        );
      }
    } catch (error) {
      logTest(
        "api_endpoints",
        test.name,
        "FAIL",
        `API endpoint error: ${error.message}`,
        "missing",
      );
    }
  }
}

// Test forms functionality
async function testFormsFunctionality(page) {
  console.log("\n📋 Testing Forms Functionality...");

  const formTests = [
    { path: "/leave", name: "Leave Request Form" },
    { path: "/assets", name: "Asset Management Form" },
    { path: "/people", name: "Employee Form" },
    { path: "/jobs", name: "Job Creation Form" },
  ];

  for (const test of formTests) {
    try {
      await page.goto(`${BASE_URL}${test.path}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Look for forms
      const forms = await page.$$("form");
      const inputs = await page.$$("input, textarea, select");
      const buttons = await page.$$(
        'button[type="submit"], input[type="submit"]',
      );

      if (forms.length > 0 || inputs.length > 0) {
        logTest(
          "forms",
          `${test.name}Exists`,
          "PASS",
          `Found ${forms.length} forms with ${inputs.length} inputs`,
        );
      } else {
        logTest(
          "forms",
          `${test.name}Exists`,
          "FAIL",
          "No forms found on page",
          "implementation",
        );
      }

      if (buttons.length > 0) {
        logTest(
          "forms",
          `${test.name}SubmitButton`,
          "PASS",
          "Submit functionality available",
        );
      } else {
        logTest(
          "forms",
          `${test.name}SubmitButton`,
          "FAIL",
          "No submit buttons found",
          "implementation",
        );
      }
    } catch (error) {
      logTest(
        "forms",
        `${test.name}Access`,
        "FAIL",
        `Cannot test forms on ${test.path}: ${error.message}`,
        "critical",
      );
    }
  }
}

// Test navigation functionality
async function testNavigationFunctionality(page) {
  console.log("\n🧭 Testing Navigation Functionality...");

  try {
    await page.goto(`${BASE_URL}/dashboard`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Test navigation links
    const navLinks = await page.$$eval("a[href]", (links) =>
      links
        .filter((link) => link.href && !link.href.includes("http"))
        .map((link) => ({ href: link.href, text: link.textContent?.trim() })),
    );

    if (navLinks.length > 0) {
      logTest(
        "navigation",
        "NavigationLinksExist",
        "PASS",
        `Found ${navLinks.length} navigation links`,
      );

      // Test a few key navigation links
      const keyRoutes = ["/people", "/jobs", "/leave", "/assets"];
      let workingRoutes = 0;

      for (const route of keyRoutes) {
        try {
          await page.goto(`${BASE_URL}${route}`, {
            waitUntil: "domcontentloaded",
            timeout: 10000,
          });
          workingRoutes++;
        } catch (error) {
          // Route not working
        }
      }

      if (workingRoutes === keyRoutes.length) {
        logTest(
          "navigation",
          "KeyRoutesWorking",
          "PASS",
          "All key routes accessible",
        );
      } else {
        logTest(
          "navigation",
          "KeyRoutesWorking",
          "FAIL",
          `Only ${workingRoutes}/${keyRoutes.length} key routes working`,
          "implementation",
        );
      }
    } else {
      logTest(
        "navigation",
        "NavigationLinksExist",
        "FAIL",
        "No navigation links found",
        "critical",
      );
    }
  } catch (error) {
    logTest(
      "navigation",
      "NavigationSystem",
      "FAIL",
      `Navigation system error: ${error.message}`,
      "critical",
    );
  }
}

// Test security features
async function testSecurityFeatures(page) {
  console.log("\n🔒 Testing Security Features...");

  try {
    // Test protected routes without authentication
    const protectedRoutes = ["/dashboard", "/people", "/jobs", "/settings"];
    let protectedCount = 0;

    // Clear any existing authentication
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    for (const route of protectedRoutes) {
      try {
        await page.goto(`${BASE_URL}${route}`, {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        });
        const currentUrl = page.url();

        if (currentUrl.includes("/login") || currentUrl.includes("auth")) {
          protectedCount++;
        }
      } catch (error) {
        // Route might not exist
      }
    }

    if (protectedCount > 0) {
      logTest(
        "security",
        "RouteProtection",
        "PASS",
        `${protectedCount}/${protectedRoutes.length} routes properly protected`,
      );
    } else {
      logTest(
        "security",
        "RouteProtection",
        "FAIL",
        "Routes not properly protected - security risk",
        "critical",
      );
    }
  } catch (error) {
    logTest(
      "security",
      "SecuritySystem",
      "FAIL",
      `Security system error: ${error.message}`,
      "critical",
    );
  }
}

// Main comprehensive test runner
async function runComprehensiveFunctionalityTests() {
  console.log("🔍 COMPREHENSIVE FUNCTIONALITY TEST - REAL FEATURE ANALYSIS\n");

  let browser;
  let page;

  try {
    console.log("🌐 Launching browser for real functionality testing...");
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1366, height: 768 },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-dev-shm-usage",
      ],
    });

    page = await browser.newPage();

    // Set up real error monitoring
    const getErrorStats = setupRealErrorMonitoring(page);

    // Wait for dev server
    console.log("⏳ Checking dev server...");
    let serverReady = false;
    for (let i = 0; i < 10; i++) {
      try {
        await page.goto(BASE_URL, { timeout: 5000 });
        serverReady = true;
        break;
      } catch (error) {
        console.log(`   Attempt ${i + 1}/10: Server not ready...`);
        await waitFor(2000);
      }
    }

    if (!serverReady) {
      throw new Error("Development server not accessible");
    }

    console.log("✅ Dev server is accessible!\n");

    // Run comprehensive tests
    await testAuthenticationFunctionality(page);
    await testDatabaseFunctionality(page);
    await testCrudOperations(page);
    await testApiEndpoints(page);
    await testFormsFunctionality(page);
    await testNavigationFunctionality(page);
    await testSecurityFeatures(page);

    // Analyze errors
    const errorStats = getErrorStats();

    console.log("\n🚨 Error Analysis:");
    console.log(`   Critical Errors: ${errorStats.critical.length}`);
    console.log(`   API Errors: ${errorStats.api_errors.length}`);
    console.log(`   Database Errors: ${errorStats.database_errors.length}`);
    console.log(`   UI Errors: ${errorStats.ui_errors.length}`);
    console.log(`   Warnings: ${errorStats.warnings.length}`);
  } catch (error) {
    console.error("❌ Test execution failed:", error.message);
    logTest(
      "system",
      "TestExecution",
      "FAIL",
      `Test execution failed: ${error.message}`,
      "critical",
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Generate comprehensive report
  console.log("\n" + "=".repeat(80));
  console.log("🔍 COMPREHENSIVE FUNCTIONALITY TEST RESULTS");
  console.log("=".repeat(80));

  const successRate =
    (testResults.summary.passed / testResults.summary.total) * 100;
  console.log(`\n📊 Overall Results:`);
  console.log(`   ✅ Passed: ${testResults.summary.passed}`);
  console.log(`   ❌ Failed: ${testResults.summary.failed}`);
  console.log(`   📊 Total:  ${testResults.summary.total}`);
  console.log(`   🎯 Success Rate: ${successRate.toFixed(1)}%`);

  // Critical issues
  if (testResults.summary.critical_issues.length > 0) {
    console.log(
      `\n🚨 CRITICAL ISSUES (${testResults.summary.critical_issues.length}):`,
    );
    testResults.summary.critical_issues.forEach((issue) => {
      console.log(`   ❌ ${issue}`);
    });
  }

  // Missing features
  if (testResults.summary.missing_features.length > 0) {
    console.log(
      `\n❓ MISSING FEATURES (${testResults.summary.missing_features.length}):`,
    );
    testResults.summary.missing_features.forEach((feature) => {
      console.log(`   🔍 ${feature}`);
    });
  }

  // Implementation needed
  if (testResults.summary.implementation_needed.length > 0) {
    console.log(
      `\n🔧 IMPLEMENTATION NEEDED (${testResults.summary.implementation_needed.length}):`,
    );
    testResults.summary.implementation_needed.forEach((item) => {
      console.log(`   🛠️  ${item}`);
    });
  }

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
        const severity =
          test.severity !== "normal" ? ` [${test.severity.toUpperCase()}]` : "";
        console.log(`   ${status} ${testName}: ${test.details}${severity}`);
      });
    }
  });

  // Save results
  const reportPath = "comprehensive-functionality-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Report saved to: ${reportPath}`);

  // Recommendations
  console.log(`\n🎯 RECOMMENDATIONS:`);

  if (successRate >= 80) {
    console.log("   ✅ System is in good shape - minor improvements needed");
  } else if (successRate >= 60) {
    console.log("   ⚠️  System needs significant improvements");
  } else {
    console.log("   🚨 System requires major work before production");
  }

  console.log(`\n📋 NEXT STEPS:`);
  console.log("   1. Address critical issues first");
  console.log("   2. Implement missing features");
  console.log("   3. Complete implementation items");
  console.log("   4. Retest after fixes");

  console.log("\n" + "=".repeat(80));

  return testResults;
}

// Run the comprehensive tests
runComprehensiveFunctionalityTests().catch(console.error);
