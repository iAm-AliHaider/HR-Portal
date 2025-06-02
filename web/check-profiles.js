const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://tqtwdkobrzzrhrqdxprs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94",
);

async function checkProfiles() {
  console.log("Checking profiles table...");

  const { data, error } = await supabase.from("profiles").select("*").limit(1);

  if (error) {
    console.log("Error:", error.message);
  } else {
    console.log("Profiles sample:", JSON.stringify(data, null, 2));
  }
}

checkProfiles().then(() => process.exit(0));
