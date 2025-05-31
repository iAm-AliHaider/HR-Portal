import React, { useState, useEffect } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import { supabase } from "../../lib/supabase/client";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function CandidateLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const redirectTo =
    (router.query.redirect as string) || "/candidate/dashboard";

  useEffect(() => {
    // Check if user is already logged in
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        // For development mode, simulate login
        if (process.env.NODE_ENV === "development") {
          console.warn("Auth signin failed (dev mode):", signInError.message);

          // Check if candidate profile exists in localStorage
          const storedProfile = localStorage.getItem("candidateProfile");
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            if (profile.email === email) {
              // Simulate successful login
              localStorage.setItem(
                "candidateSession",
                JSON.stringify({
                  user: profile,
                  authenticated: true,
                  loginTime: new Date().toISOString(),
                }),
              );
              router.push(redirectTo);
              return;
            }
          }

          // Demo credentials for testing
          if (email === "candidate@example.com" && password === "password123") {
            const demoProfile = {
              id: "demo-candidate",
              first_name: "Demo",
              last_name: "Candidate",
              email: "candidate@example.com",
              phone: "+1 (555) 123-4567",
              current_company: "Previous Company",
              current_position: "Software Engineer",
              experience_years: 5,
              skills: "React, Node.js, TypeScript",
              summary:
                "Experienced software engineer looking for new opportunities",
            };

            localStorage.setItem(
              "candidateSession",
              JSON.stringify({
                user: demoProfile,
                authenticated: true,
                loginTime: new Date().toISOString(),
              }),
            );
            router.push(redirectTo);
            return;
          }
        }

        throw signInError;
      }

      if (data.user) {
        // Successful login
        router.push(redirectTo);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("candidate@example.com");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Candidate Sign In | Recruitment Portal</title>
        <meta
          name="description"
          content="Sign in to your candidate account and manage your job applications"
        />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/careers"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Careers
          </Link>
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
            C
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Candidate Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your candidate portal and manage applications
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/candidate/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {/* Demo Login for Development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Demo Account
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Use Demo Candidate Account
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Email: candidate@example.com | Password: password123
                </p>
              </div>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to our platform?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/candidate/register"
                className="w-full flex justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 flex justify-center space-x-4 text-sm">
            <Link href="/careers" className="text-gray-600 hover:text-gray-900">
              Browse Jobs
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/candidate/help"
              className="text-gray-600 hover:text-gray-900"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2024 HR Portal. All rights reserved.</p>
      </div>
    </div>
  );
}
