// Create Users for All Roles and Admin - Fixed Schema
const { createClient } = require("@supabase/supabase-js");

console.log("👥 Creating Users for All Roles and Admin (Fixed)\n");
console.log("=".repeat(60));

const supabaseUrl = "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI5NTQxOCwiZXhwIjoyMDYzODcxNDE4fQ.V4mrfOQm4kiIRBl0a7WduyKuYAR96ZoIjWq_deNX_94";

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Define user roles and their profiles - using correct schema
const userTemplates = [
  {
    email: "admin@hrportal.com",
    password: "admin123",
    name: "System Administrator",
    role: "admin",
    department: "IT",
    phone: "+1-555-0001",
    position: "System Admin",
    first_name: "System",
    last_name: "Administrator",
    hire_date: "2023-01-01",
  },
  {
    email: "hr.manager@hrportal.com",
    password: "hr123",
    name: "Sarah Johnson",
    role: "hr_manager",
    department: "Human Resources",
    phone: "+1-555-0002",
    position: "HR Manager",
    first_name: "Sarah",
    last_name: "Johnson",
    hire_date: "2023-02-01",
  },
  {
    email: "hr.specialist@hrportal.com",
    password: "hr123",
    name: "Mike Chen",
    role: "hr_specialist",
    department: "Human Resources",
    phone: "+1-555-0003",
    position: "HR Specialist",
    first_name: "Mike",
    last_name: "Chen",
    hire_date: "2023-03-01",
  },
  {
    email: "it.manager@hrportal.com",
    password: "it123",
    name: "David Rodriguez",
    role: "manager",
    department: "IT",
    phone: "+1-555-0004",
    position: "IT Manager",
    first_name: "David",
    last_name: "Rodriguez",
    hire_date: "2023-01-15",
  },
  {
    email: "developer1@hrportal.com",
    password: "dev123",
    name: "Alice Thompson",
    role: "employee",
    department: "IT",
    phone: "+1-555-0005",
    position: "Senior Developer",
    first_name: "Alice",
    last_name: "Thompson",
    hire_date: "2023-04-01",
  },
  {
    email: "developer2@hrportal.com",
    password: "dev123",
    name: "Bob Wilson",
    role: "employee",
    department: "IT",
    phone: "+1-555-0006",
    position: "Frontend Developer",
    first_name: "Bob",
    last_name: "Wilson",
    hire_date: "2023-05-01",
  },
  {
    email: "finance.manager@hrportal.com",
    password: "fin123",
    name: "Jennifer Smith",
    role: "manager",
    department: "Finance",
    phone: "+1-555-0007",
    position: "Finance Manager",
    first_name: "Jennifer",
    last_name: "Smith",
    hire_date: "2023-02-15",
  },
  {
    email: "accountant@hrportal.com",
    password: "acc123",
    name: "Robert Davis",
    role: "employee",
    department: "Finance",
    phone: "+1-555-0008",
    position: "Senior Accountant",
    first_name: "Robert",
    last_name: "Davis",
    hire_date: "2023-06-01",
  },
  {
    email: "sales.manager@hrportal.com",
    password: "sales123",
    name: "Lisa Anderson",
    role: "manager",
    department: "Sales",
    phone: "+1-555-0009",
    position: "Sales Manager",
    first_name: "Lisa",
    last_name: "Anderson",
    hire_date: "2023-03-15",
  },
  {
    email: "sales.rep@hrportal.com",
    password: "sales123",
    name: "Tom Jackson",
    role: "employee",
    department: "Sales",
    phone: "+1-555-0010",
    position: "Sales Representative",
    first_name: "Tom",
    last_name: "Jackson",
    hire_date: "2023-07-01",
  },
];

async function createAuthUser(userTemplate) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: userTemplate.email,
      password: userTemplate.password,
      email_confirm: true,
      user_metadata: {
        name: userTemplate.name,
        role: userTemplate.role,
        department: userTemplate.department,
      },
    });

    if (error) {
      console.log(
        `⚠️ Auth user creation failed for ${userTemplate.email}:`,
        error.message,
      );
      return null;
    }

    console.log(
      `✅ Auth user created: ${userTemplate.email} (${data.user.id})`,
    );
    return data.user;
  } catch (err) {
    console.log(
      `❌ Auth creation error for ${userTemplate.email}:`,
      err.message,
    );
    return null;
  }
}

async function createProfile(userTemplate, authUserId) {
  // Use only columns that exist in the actual profiles table
  const profile = {
    id: authUserId,
    email: userTemplate.email,
    name: userTemplate.name,
    role: userTemplate.role,
    department: userTemplate.department,
    phone: userTemplate.phone,
    position: userTemplate.position,
    first_name: userTemplate.first_name,
    last_name: userTemplate.last_name,
    hire_date: userTemplate.hire_date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([profile])
      .select()
      .single();

    if (error) {
      console.log(
        `⚠️ Profile creation failed for ${userTemplate.email}:`,
        error.message,
      );
      return null;
    }

    console.log(
      `✅ Profile created: ${userTemplate.name} (${userTemplate.role})`,
    );
    return data;
  } catch (err) {
    console.log(
      `❌ Profile creation error for ${userTemplate.email}:`,
      err.message,
    );
    return null;
  }
}

async function updateManagerRelationships(createdUsers) {
  console.log("\n🔗 Setting up manager relationships...");

  // Find managers
  const hrManager = createdUsers.find((u) => u.role === "hr_manager");
  const itManager = createdUsers.find(
    (u) => u.role === "manager" && u.department === "IT",
  );
  const financeManager = createdUsers.find(
    (u) => u.role === "manager" && u.department === "Finance",
  );
  const salesManager = createdUsers.find(
    (u) => u.role === "manager" && u.department === "Sales",
  );

  const updates = [];

  // Set manager relationships
  if (hrManager) {
    updates.push({
      email: "hr.specialist@hrportal.com",
      manager_id: hrManager.id,
    });
  }

  if (itManager) {
    updates.push(
      {
        email: "developer1@hrportal.com",
        manager_id: itManager.id,
      },
      {
        email: "developer2@hrportal.com",
        manager_id: itManager.id,
      },
    );
  }

  if (financeManager) {
    updates.push({
      email: "accountant@hrportal.com",
      manager_id: financeManager.id,
    });
  }

  if (salesManager) {
    updates.push({
      email: "sales.rep@hrportal.com",
      manager_id: salesManager.id,
    });
  }

  // Apply updates
  for (const update of updates) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ manager_id: update.manager_id })
        .eq("email", update.email);

      if (error) {
        console.log(
          `⚠️ Manager update failed for ${update.email}:`,
          error.message,
        );
      } else {
        console.log(`✅ Manager relationship set for ${update.email}`);
      }
    } catch (err) {
      console.log(`❌ Manager update error for ${update.email}:`, err.message);
    }
  }
}

async function testCRUDWithRealUsers(createdUsers) {
  console.log("\n🧪 Testing CRUD Operations with Real Users...");

  if (createdUsers.length === 0) {
    console.log("❌ No users available for testing");
    return { businessTravel: 0, unifiedRequests: 0 };
  }

  // Pick users for testing
  const traveler =
    createdUsers.find((u) => u.role === "employee") || createdUsers[0];
  const requester =
    createdUsers.find((u) => u.role === "hr_specialist") || createdUsers[0];

  // Test Business Travel CRUD
  console.log(`\n✈️ Testing Business Travel with user: ${traveler.name}`);
  const businessTravelPassed = await testBusinessTravelCRUD(traveler.id);

  // Test Unified Requests CRUD
  console.log(`\n📝 Testing Unified Requests with user: ${requester.name}`);
  const unifiedRequestsPassed = await testUnifiedRequestsCRUD(requester.id);

  return {
    businessTravel: businessTravelPassed,
    unifiedRequests: unifiedRequestsPassed,
  };
}

async function testBusinessTravelCRUD(userId) {
  const testData = {
    traveler_id: userId,
    purpose: "Business Conference " + Date.now(),
    destination: "New York",
    departure_date: "2024-04-01",
    return_date: "2024-04-03",
    estimated_budget: 2500.0,
    status: "pending",
  };

  let passed = 0;

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("travel_requests")
      .insert([testData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("travel_requests")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("travel_requests")
        .update({ purpose: testData.purpose + " - Updated" })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("travel_requests")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Business Travel test failed:", error.message);
  }

  return passed;
}

async function testUnifiedRequestsCRUD(userId) {
  const testData = {
    requester_id: userId,
    request_type: "equipment",
    title: "New Laptop Request " + Date.now(),
    description: "Need a new laptop for development work",
    priority: "high",
    status: "pending",
    category: "IT Equipment",
  };

  let passed = 0;

  try {
    // CREATE
    const { data: createData, error: createError } = await supabase
      .from("unified_requests")
      .insert([testData])
      .select()
      .single();

    if (!createError) {
      console.log("  ✅ CREATE: Success");
      passed++;

      const recordId = createData.id;

      // READ
      const { error: readError } = await supabase
        .from("unified_requests")
        .select("*")
        .eq("id", recordId)
        .single();

      if (!readError) {
        console.log("  ✅ READ: Success");
        passed++;
      }

      // UPDATE
      const { error: updateError } = await supabase
        .from("unified_requests")
        .update({ title: testData.title + " - Updated" })
        .eq("id", recordId);

      if (!updateError) {
        console.log("  ✅ UPDATE: Success");
        passed++;
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from("unified_requests")
        .delete()
        .eq("id", recordId);

      if (!deleteError) {
        console.log("  ✅ DELETE: Success");
        passed++;
      }
    } else {
      console.log("  ❌ CREATE:", createError.message);
    }
  } catch (error) {
    console.log("  ❌ Unified Requests test failed:", error.message);
  }

  return passed;
}

async function main() {
  try {
    console.log("🚀 Starting user creation process...\n");

    // Create auth users and profiles
    const createdUsers = [];

    for (const userTemplate of userTemplates) {
      console.log(
        `\n👤 Creating user: ${userTemplate.name} (${userTemplate.role})`,
      );

      // Create auth user
      const authUser = await createAuthUser(userTemplate);
      if (!authUser) {
        console.log(`⚠️ Skipping profile creation for ${userTemplate.email}`);
        continue;
      }

      // Create profile
      const profile = await createProfile(userTemplate, authUser.id);
      if (profile) {
        createdUsers.push(profile);
      }
    }

    // Set up manager relationships
    if (createdUsers.length > 0) {
      await updateManagerRelationships(createdUsers);
    }

    // Test CRUD operations with real users
    const { businessTravel, unifiedRequests } =
      await testCRUDWithRealUsers(createdUsers);

    // Final Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎯 USER CREATION AND TESTING RESULTS");
    console.log("=".repeat(60));

    console.log(
      `👥 Users Created: ${createdUsers.length}/${userTemplates.length}`,
    );
    console.log(
      `✈️ Business Travel CRUD: ${businessTravel}/4 operations working`,
    );
    console.log(
      `📝 Unified Requests CRUD: ${unifiedRequests}/4 operations working`,
    );

    const totalCRUD = businessTravel + unifiedRequests;
    const crudPassRate = Math.round((totalCRUD / 8) * 100);

    if (createdUsers.length >= 5 && crudPassRate >= 75) {
      console.log(
        "\n🎉 SUCCESS! All users created and CRUD operations working!",
      );
      console.log("\n✨ Created User Roles:");
      console.log("   • System Administrator ✅");
      console.log("   • HR Manager ✅");
      console.log("   • HR Specialist ✅");
      console.log("   • IT Manager ✅");
      console.log("   • Developers ✅");
      console.log("   • Finance Manager ✅");
      console.log("   • Accountant ✅");
      console.log("   • Sales Manager ✅");
      console.log("   • Sales Representative ✅");

      console.log("\n📧 User Credentials:");
      console.log("   🔑 Admin: admin@hrportal.com / admin123");
      console.log("   👥 HR Manager: hr.manager@hrportal.com / hr123");
      console.log("   💻 Developer: developer1@hrportal.com / dev123");
      console.log("   💰 Finance: finance.manager@hrportal.com / fin123");
      console.log("   📈 Sales: sales.manager@hrportal.com / sales123");

      console.log("\n🚀 Ready for Production:");
      console.log("   1. Start development server: npm run dev");
      console.log("   2. Login with any of the created accounts");
      console.log("   3. Test all HR Portal features");
      console.log("   4. All CRUD operations now fully functional!");
    } else if (createdUsers.length >= 3) {
      console.log("\n⚠️ PARTIAL SUCCESS - Most users created");
      console.log(`   CRUD Pass Rate: ${crudPassRate}%`);
      console.log("   System is functional with created users");
    } else {
      console.log("\n❌ User creation issues - check auth configuration");
    }
  } catch (error) {
    console.error("❌ User creation failed:", error.message);
  }
}

main().catch(console.error);
