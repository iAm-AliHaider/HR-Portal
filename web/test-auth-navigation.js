#!/usr/bin/env node

/**
 * Test Authentication Navigation Flow
 * This script tests the login -> navigation flow to ensure it works properly
 */

const puppeteer = require('puppeteer');

async function testAuthNavigation() {
  console.log('🔍 Testing Authentication Navigation Flow...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Show browser for debugging
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Error:', msg.text());
      } else if (msg.text().includes('Auth state changed') || msg.text().includes('Login')) {
        console.log('📱 Auth Event:', msg.text());
      }
    });
    
    // Go to login page
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    // Fill in credentials
    console.log('2. Filling in admin credentials...');
    await page.type('input[name="email"]', 'admin@company.com');
    await page.type('input[name="password"]', 'admin123');
    
    // Submit form
    console.log('3. Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Wait for navigation or error
    console.log('4. Waiting for navigation...');
    try {
      await page.waitForNavigation({ timeout: 10000 });
      
      const currentUrl = page.url();
      console.log('✅ Navigation successful!');
      console.log('📍 Current URL:', currentUrl);
      
      if (currentUrl.includes('/dashboard')) {
        console.log('🎉 SUCCESS: Redirected to dashboard as expected!');
      } else if (currentUrl.includes('/login')) {
        console.log('❌ ISSUE: Still on login page - navigation failed');
      } else {
        console.log('ℹ️  INFO: Redirected to:', currentUrl);
      }
      
    } catch (error) {
      console.log('⚠️  Navigation timeout - checking current state...');
      const currentUrl = page.url();
      console.log('📍 Current URL:', currentUrl);
      
      // Check if there are any visible errors
      const errorElements = await page.$$('.text-red-700, .text-red-600, [class*="error"]');
      if (errorElements.length > 0) {
        console.log('❌ Found error elements on page');
        for (const el of errorElements) {
          const text = await page.evaluate(element => element.textContent, el);
          console.log('   Error:', text);
        }
      }
    }
    
    // Keep browser open for 10 seconds for manual inspection
    console.log('\n⏱️  Keeping browser open for 10 seconds for inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  testAuthNavigation().catch(console.error);
}

module.exports = { testAuthNavigation }; 