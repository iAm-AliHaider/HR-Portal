import { createClient } from "@supabase/supabase-js";

import { supabase } from "./supabase/client";

// Get environment variables with fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tqtwdkobrzzrhrqdxprs.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s";

const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Register a new user
export const registerUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "employee",
      },
    },
  });
  return { data, error };
};

// Login user
export const loginUser = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

// Logout user
export const logoutUser = async () => {
  return await supabase.auth.signOut();
};

// Check if user session exists
export const getUser = async () => {
  return await supabase.auth.getUser();
};

// Get current session
export const getSession = async () => {
  return await supabase.auth.getSession();
};

// No more development bypassing - authentication is always required
export const shouldBypassAuth = () => {
  return false;
};
