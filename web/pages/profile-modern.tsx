import Link from "next/link";
import { useState } from "react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [userProfile, setUserProfile] = useState({
    personal: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
      employeeId: "EMP-001",
      department: "Engineering",
      position: "Senior Developer",
      manager: "Jane Smith",
      startDate: "2023-01-15",
      location: "New York, NY",
    },
    preferences: {
      language: "English",
      timezone: "America/New_York",
      theme: "light",
      notifications: {
        email: true,
        browser: true,
        mobile: false,
        weekendAlerts: false,
      },
    },
    security: {
      lastPasswordChange: "2024-01-15",
      twoFactorEnabled: false,
      loginSessions: 3,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile.personal);
  const [previewImage, setPreviewImage] = useState(
    "/avatars/default-avatar.jpg",
  );

  const navigation = [
    { name: "Dashboard", href: "/dashboard-modern" },
    { name: "People", href: "/people-modern" },
    { name: "Jobs", href: "/jobs-modern" },
    { name: "Leave", href: "/leave-modern" },
    { name: "Assets", href: "/assets-modern" },
    { name: "Reports", href: "/reports-modern" },
    { name: "Profile", href: "/profile-modern", current: true },
  ];

  const tabs = [
    { id: "personal", name: "Personal Info", icon: "👤" },
    { id: "preferences", name: "Preferences", icon: "⚙️" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "activity", name: "Activity Log", icon: "📊" },
  ];

  const departments = [
    "Engineering",
    "HR",
    "Sales",
    "Marketing",
    "Finance",
    "Operations",
  ];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
  ];
  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
  ];

  const activityLog = [
    {
      action: "Password Changed",
      timestamp: "2024-01-15 14:30:00",
      ip: "192.168.1.100",
    },
    {
      action: "Profile Updated",
      timestamp: "2024-01-14 09:15:00",
      ip: "192.168.1.100",
    },
    { action: "Login", timestamp: "2024-01-14 08:00:00", ip: "192.168.1.100" },
    { action: "Login", timestamp: "2024-01-13 08:30:00", ip: "192.168.1.100" },
    {
      action: "Password Reset",
      timestamp: "2024-01-10 16:45:00",
      ip: "192.168.1.100",
    },
  ];

  const handleSaveProfile = () => {
    setUserProfile((prev) => ({
      ...prev,
      personal: editForm,
    }));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditForm(userProfile.personal);
    setIsEditing(false);
  };

  const updatePreference = (category: string, key: string, value: any) => {
    setUserProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]:
          typeof prev.preferences[category as keyof typeof prev.preferences] ===
          "object"
            ? {
                ...prev.preferences[category as keyof typeof prev.preferences],
                [key]: value,
              }
            : value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">HR Portal</h1>
              <div className="ml-10 flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Profile Overview Sidebar */}
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </label>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {userProfile.personal.firstName}{" "}
                    {userProfile.personal.lastName}
                  </h3>
                  <p className="text-gray-500">
                    {userProfile.personal.position}
                  </p>
                  <p className="text-sm text-gray-400">
                    {userProfile.personal.department}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Employee ID:</span>
                    <span className="font-medium">
                      {userProfile.personal.employeeId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Start Date:</span>
                    <span className="font-medium">
                      {userProfile.personal.startDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Manager:</span>
                    <span className="font-medium">
                      {userProfile.personal.manager}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">
                      {userProfile.personal.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow">
                <nav className="space-y-1 p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "border-transparent text-gray-900 hover:bg-gray-50"
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Profile Content */}
            <div className="col-span-8">
              <div className="bg-white rounded-lg shadow p-6">
                {/* Personal Information */}
                {activeTab === "personal" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        Personal Information
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="space-x-3">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {userProfile.personal.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {userProfile.personal.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {userProfile.personal.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {userProfile.personal.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        {isEditing ? (
                          <select
                            value={editForm.department}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                department: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-gray-900">
                            {userProfile.personal.department}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.position}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                position: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {userProfile.personal.position}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {activeTab === "preferences" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Account Preferences
                    </h3>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={userProfile.preferences.language}
                            onChange={(e) =>
                              updatePreference("language", "", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {languages.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={userProfile.preferences.timezone}
                            onChange={(e) =>
                              updatePreference("timezone", "", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {timezones.map((tz) => (
                              <option key={tz} value={tz}>
                                {tz}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Notification Preferences
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(
                            userProfile.preferences.notifications,
                          ).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-700 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) =>
                                  updatePreference(
                                    "notifications",
                                    key,
                                    e.target.checked,
                                  )
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security */}
                {activeTab === "security" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Security Settings
                    </h3>

                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Password
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">
                          Last changed:{" "}
                          {userProfile.security.lastPasswordChange}
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                          Change Password
                        </button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-500">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button
                            className={`px-4 py-2 rounded-md text-sm ${
                              userProfile.security.twoFactorEnabled
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            } text-white`}
                          >
                            {userProfile.security.twoFactorEnabled
                              ? "Disable"
                              : "Enable"}{" "}
                            2FA
                          </button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Active Sessions
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">
                          You have {userProfile.security.loginSessions} active
                          login sessions
                        </p>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
                          Sign Out All Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Log */}
                {activeTab === "activity" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Account Activity
                    </h3>

                    <div className="space-y-4">
                      {activityLog.map((activity, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-200 pb-4 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {activity.action}
                              </h4>
                              <p className="text-sm text-gray-500">
                                IP Address: {activity.ip}
                              </p>
                            </div>
                            <span className="text-sm text-gray-400">
                              {activity.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        Download Full Activity Log
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
