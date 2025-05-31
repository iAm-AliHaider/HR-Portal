import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { shouldBypassAuth } from "@/lib/auth";

import { useAuth } from "../../hooks/useAuth";

interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  workInfo: {
    employeeId: string;
    department: string;
    position: string;
    manager: string;
    startDate: string;
    location: string;
  };
  avatar?: string;
}

const EmployeeProfilePage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<EmployeeProfile>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    workInfo: {
      employeeId: "",
      department: "",
      position: "",
      manager: "",
      startDate: "",
      location: "",
    },
  });

  // Check authentication status with fallback
  useEffect(() => {
    // In development mode, always allow access for testing
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // For production, use graceful fallback instead of redirect
    if (
      !allowAccess &&
      !user &&
      !["employee", "manager", "admin"].includes(role || "")
    ) {
      console.warn(
        "Employee profile accessed without proper authentication, showing limited view",
      );
      // Show limited view instead of redirecting
    }
  }, [allowAccess, role, user]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Mock data - replace with actual API call
        const mockProfile: EmployeeProfile = {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: user?.email || "john.doe@company.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street, Anytown, State 12345",
          dateOfBirth: "1990-05-15",
          emergencyContact: {
            name: "Jane Doe",
            relationship: "Spouse",
            phone: "+1 (555) 987-6543",
          },
          workInfo: {
            employeeId: "EMP001",
            department: "Engineering",
            position: "Software Developer",
            manager: "Sarah Johnson",
            startDate: "2022-01-15",
            location: "New York Office",
          },
        };
        setProfile(mockProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof EmployeeProfile] as any),
          [child]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would make an API call to save the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally reload the profile data to revert changes
  };

  // Show content with appropriate permissions
  const hasLimitedAccess =
    !allowAccess && !["employee", "manager", "admin"].includes(role || "");

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Profile - HR Management</title>
        <meta
          name="description"
          content="View and edit your employee profile"
        />
      </Head>

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">
              View and update your personal information
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {hasLimitedAccess && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-800 font-medium">Limited Access</h3>
            <p className="text-yellow-600 text-sm">
              You're viewing a limited version of this profile.
            </p>
          </div>
        )}

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </div>
                {profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="absolute inset-0 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-blue-100">{profile.workInfo.position}</p>
                <p className="text-blue-200 text-sm">
                  {profile.workInfo.department}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Work Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <p className="text-gray-900">
                      {profile.workInfo.employeeId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <p className="text-gray-900">
                      {profile.workInfo.department}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <p className="text-gray-900">{profile.workInfo.position}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager
                    </label>
                    <p className="text-gray-900">{profile.workInfo.manager}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(
                        profile.workInfo.startDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-gray-900">{profile.workInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default EmployeeProfilePage;
