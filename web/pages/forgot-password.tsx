import { useState } from "react";

import Link from "next/link";

import { supabase } from "../lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In development mode, simulate successful request
      if (isDev) {
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network delay
        setSuccess(true);
        return;
      }

      // In production, use Supabase auth
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0a3d91]">HR Portal</h1>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        {success ? (
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                {isDev
                  ? "In development mode, no email is sent. This is a simulation."
                  : "We've sent password reset instructions to your email."}
              </p>
              <Link
                href="/login"
                className="inline-block bg-[#0a3d91] text-white py-2 px-4 rounded-md hover:bg-[#0a3d91]/90 transition"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}

            <p className="mb-4 text-gray-600 text-sm">
              Enter your email address below, and we'll send you instructions to
              reset your password.
            </p>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0a3d91] text-white py-2 rounded-md hover:bg-[#0a3d91]/90 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-[#0a3d91] font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
