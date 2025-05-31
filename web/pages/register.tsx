import React, { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "employee" as "admin" | "hr" | "manager" | "employee" | "recruiter",
    department: "",
    position: "",
    hireDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { user, signUp } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check for required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      setLoading(false);
      return;
    }

    if (!formData.department.trim() || !formData.position.trim()) {
      setError("Department and position are required");
      setLoading(false);
      return;
    }

    if (!formData.hireDate) {
      setError("Hire date is required");
      setLoading(false);
      return;
    }

    try {
      // Try the registration API first
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.firstName + " " + formData.lastName,
          role: formData.role,
          department: formData.department,
          position: formData.position,
          phone: formData.phone,
          hireDate: formData.hireDate,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login?message=Registration successful. Please sign in.');
        }, 2000);
        return;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (apiError: any) {
      console.warn('API registration failed:', apiError.message);
      
      // Fallback: Try direct Supabase registration
      try {
        console.log('Trying direct Supabase registration...');
        const result = await signUp(
          formData.email,
          formData.password,
          formData.firstName + " " + formData.lastName,
        );

        if (result.success) {
          setSuccess(true);
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login?message=Registration successful. Please sign in.');
          }, 2000);
        } else {
          setError(result.error || "Registration failed. Please try again.");
        }
      } catch (fallbackError) {
        console.warn('Direct Supabase registration also failed:', fallbackError);
        
        // Final fallback: Try emergency registration
        try {
          console.log('Trying emergency registration...');
          const emergencyResponse = await fetch('/api/auth/emergency-register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.firstName + " " + formData.lastName,
              role: formData.role,
              department: formData.department,
              position: formData.position,
              phone: formData.phone,
              hireDate: formData.hireDate
            }),
          });

          const emergencyData = await emergencyResponse.json();

          if (emergencyResponse.ok && emergencyData.success) {
            setSuccess(true);
            // Redirect to login after 2 seconds
            setTimeout(() => {
              router.push('/login?message=Account created successfully. Please sign in.');
            }, 2000);
          } else {
            throw new Error(emergencyData.error || 'Emergency registration failed');
          }
        } catch (emergencyError) {
          setError("All registration methods failed. Please contact support for manual account creation.");
          console.error("All registration methods failed:", emergencyError);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Head>
          <title>Registration Successful | HR Portal</title>
        </Head>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
              ✓
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Successful!
          </h2>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-lg text-gray-900 mb-4">
                Welcome to HR Portal, {formData.firstName} {formData.lastName}!
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Your account has been created successfully. You can now sign in
                with your credentials.
              </p>
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Create Account | HR Portal</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            HR
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the HR management system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your first name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your phone number"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <div className="mt-1">
                <input
                  id="department"
                  name="department"
                  type="text"
                  autoComplete="organization"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your department"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <div className="mt-1">
                <input
                  id="position"
                  name="position"
                  type="text"
                  autoComplete="organization"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your position"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="hireDate"
                className="block text-sm font-medium text-gray-700"
              >
                Hire Date
              </label>
              <div className="mt-1">
                <input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  autoComplete="bday"
                  required
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    {error.includes("Database error") && (
                      <div className="mt-2">
                        <p className="text-xs text-red-600">
                          Try these alternatives:
                        </p>
                        <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                          <li>Use the <a href="/login" className="underline">login page</a> with test accounts</li>
                          <li>Contact support at {process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@hrportal.com'}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      ✅ Account created successfully! Redirecting to login...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
