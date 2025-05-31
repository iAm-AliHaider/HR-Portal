/**
 * Setup Vercel Environment Variables
 *
 * This script helps set up the required environment variables for Vercel deployment
 */

console.log("🔧 Vercel Environment Variables Setup Guide");
console.log("==========================================\n");

console.log("📋 Required Environment Variables for Vercel:");
console.log("");

console.log("1. NEXT_PUBLIC_SUPABASE_URL");
console.log("   Value: https://tqtwdkobrzzrhrqdxprs.supabase.co");
console.log("");

console.log("2. NEXT_PUBLIC_SUPABASE_ANON_KEY");
console.log(
  "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s",
);
console.log("");

console.log("3. SUPABASE_SERVICE_ROLE_KEY (for server-side operations)");
console.log(
  "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94",
);
console.log("");

console.log("📝 How to set these in Vercel:");
console.log("");
console.log("Method 1: Via Vercel Dashboard");
console.log("------------------------------");
console.log("1. Go to: https://vercel.com/dashboard");
console.log("2. Click on your hr-portal-app-dev-ita project");
console.log("3. Go to Settings > Environment Variables");
console.log("4. Add each variable above with their values");
console.log(
  "5. Make sure to set them for all environments (Production, Preview, Development)",
);
console.log("6. Redeploy the project");
console.log("");

console.log("Method 2: Via Vercel CLI (if you have access)");
console.log("---------------------------------------------");
console.log("vercel env add NEXT_PUBLIC_SUPABASE_URL");
console.log("vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY");
console.log("vercel env add SUPABASE_SERVICE_ROLE_KEY");
console.log("");

console.log("🔄 After setting environment variables:");
console.log("1. Go to your Vercel project dashboard");
console.log('2. Click "Redeploy" to trigger a new deployment');
console.log("3. Or push a new commit to automatically trigger deployment");
console.log("");

console.log('✅ This will fix the "NEXT_PUBLIC_SUPABASE_URL not set" warning');
console.log("   and should resolve any loading issues in the dashboard.");
console.log("");

console.log("🌐 Your deployment URL: https://hr-portal-app-dev-ita.vercel.app");
console.log("");

// Check if running with vercel CLI
const hasVercelCLI = process.env.VERCEL || process.env.VERCEL_ENV;
if (hasVercelCLI) {
  console.log("🎯 Detected Vercel environment!");
  console.log("Current environment variables:");
  console.log(
    "NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET",
  );
  console.log(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET",
  );
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET",
  );
}

console.log("🎉 Environment setup complete!");
