const puppeteer = require("puppeteer");

async function testModernImplementation() {
  console.log("🚀 Testing Modern HR Portal Implementation...\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const results = {
    healthAPI: false,
    dashboard: false,
    peopleManagement: false,
    jobsManagement: false,
    leaveManagement: false,
    statusPage: false,
    navigation: false,
  };

  try {
    // Test 1: Health API
    console.log("📡 Testing Health API...");
    try {
      const response = await page.goto("http://localhost:3000/api/health-new", {
        waitUntil: "networkidle2",
        timeout: 10000,
      });
      if (response && response.status() === 200) {
        const data = await response.json();
        if (data.status === "healthy") {
          results.healthAPI = true;
          console.log("✅ Health API working - Status: " + data.status);
        }
      }
    } catch (error) {
      console.log("❌ Health API failed:", error.message);
    }

    // Test 2: Modern Dashboard
    console.log("\n🏠 Testing Modern Dashboard...");
    try {
      await page.goto("http://localhost:3000/dashboard-modern", {
        waitUntil: "networkidle2",
        timeout: 10000,
      });

      const title = await page.title();
      const hasStats =
        (await page.$(".grid.grid-cols-1.md\\:grid-cols-4")) !== null;
      const hasNavigation = (await page.$("nav")) !== null;

      if (hasStats && hasNavigation) {
        results.dashboard = true;
        console.log("✅ Modern Dashboard working - Has stats and navigation");
      }
    } catch (error) {
      console.log("❌ Modern Dashboard failed:", error.message);
    }

    // Test 3: People Management
    console.log("\n👥 Testing People Management...");
    try {
      await page.goto("http://localhost:3000/people-modern", {
        waitUntil: "networkidle2",
        timeout: 10000,
      });

      const hasTable = (await page.$("table")) !== null;
      const hasAddButton = (await page.$("button")) !== null;
      const hasEmployeeData = (await page.$("td")) !== null;

      if (hasTable && hasAddButton && hasEmployeeData) {
        results.peopleManagement = true;
        console.log(
          "✅ People Management working - Has table, add button, and data",
        );
      }
    } catch (error) {
      console.log("❌ People Management failed:", error.message);
    }

    // Test 4: Jobs Management
    console.log("\n💼 Testing Jobs Management...");
    try {
      await page.goto("http://localhost:3000/jobs-modern", {
        waitUntil: "networkidle2",
        timeout: 10000,
      });

      const hasTable = (await page.$("table")) !== null;
      const hasPostButton = await page.evaluate(() => {
        return document
          .querySelector("button")
          ?.textContent?.includes("Post New Job");
      });

      if (hasTable && hasPostButton) {
        results.jobsManagement = true;
        console.log("✅ Jobs Management working - Has table and post button");
      }
    } catch (error) {
      console.log("❌ Jobs Management failed:", error.message);
    }

    // Test 5: Leave Management
    console.log("\n🏖️ Testing Leave Management...");
    try {
      await page.goto("http://localhost:3000/leave-modern", {
        waitUntil: "networkidle2",
        timeout: 10000,
      });

      const hasTable = (await page.$("table")) !== null;
      const hasRequestButton = await page.evaluate(() => {
        return document
          .querySelector("button")
          ?.textContent?.includes("Request Leave");
      });

      if (hasTable && hasRequestButton) {
        results.leaveManagement = true;
        console.log(
          "✅ Leave Management working - Has table and request button",
        );
      }
    } catch (error) {
      console.log("❌ Leave Management failed:", error.message);
    }

    // Test 6: Status Page
    console.log("\n📊 Testing Status Page...");
    try {
      await page.goto("http://localhost:3000/status", {
        waitUntil: "networkidle2",
        timeout: 10000,
      });

      const hasSystemStatus = await page.evaluate(() => {
        return document.body.textContent.includes("System Status");
      });

      if (hasSystemStatus) {
        results.statusPage = true;
        console.log("✅ Status Page working - Displays system status");
      }
    } catch (error) {
      console.log("❌ Status Page failed:", error.message);
    }

    // Test 7: Navigation System
    console.log("\n🧭 Testing Navigation System...");
    try {
      await page.goto("http://localhost:3000/dashboard-modern");

      const navLinks = await page.$$eval("nav a", (links) =>
        links.map((link) => link.textContent.trim()),
      );

      const expectedLinks = ["People", "Jobs", "Leave"];
      const hasAllLinks = expectedLinks.every((link) =>
        navLinks.some((navLink) => navLink.includes(link)),
      );

      if (hasAllLinks) {
        results.navigation = true;
        console.log("✅ Navigation System working - All links present");
      }
    } catch (error) {
      console.log("❌ Navigation System failed:", error.message);
    }
  } catch (error) {
    console.log("❌ General test error:", error.message);
  } finally {
    await browser.close();
  }

  // Results Summary
  console.log("\n" + "=".repeat(50));
  console.log("📋 MODERN IMPLEMENTATION TEST RESULTS");
  console.log("=".repeat(50));

  const tests = [
    { name: "Health API", result: results.healthAPI },
    { name: "Modern Dashboard", result: results.dashboard },
    { name: "People Management (CRUD)", result: results.peopleManagement },
    { name: "Jobs Management (CRUD)", result: results.jobsManagement },
    { name: "Leave Management (CRUD)", result: results.leaveManagement },
    { name: "Status Page", result: results.statusPage },
    { name: "Navigation System", result: results.navigation },
  ];

  let passedTests = 0;
  tests.forEach((test) => {
    const status = test.result ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} - ${test.name}`);
    if (test.result) passedTests++;
  });

  const successRate = Math.round((passedTests / tests.length) * 100);

  console.log("\n" + "=".repeat(50));
  console.log(
    `🎯 SUCCESS RATE: ${successRate}% (${passedTests}/${tests.length} tests passed)`,
  );
  console.log("=".repeat(50));

  if (successRate >= 80) {
    console.log("🎉 EXCELLENT! Modern implementation is working well!");
  } else if (successRate >= 60) {
    console.log("👍 GOOD! Most features are working, minor fixes needed.");
  } else {
    console.log("⚠️  NEEDS WORK! Several features need attention.");
  }

  console.log("\n🔗 Quick Access URLs:");
  console.log("• Dashboard: http://localhost:3000/dashboard-modern");
  console.log("• People: http://localhost:3000/people-modern");
  console.log("• Jobs: http://localhost:3000/jobs-modern");
  console.log("• Leave: http://localhost:3000/leave-modern");
  console.log("• Status: http://localhost:3000/status");
  console.log("• Health API: http://localhost:3000/api/health-new");

  return results;
}

// Run the test
testModernImplementation().catch(console.error);
