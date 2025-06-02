import Link from "next/link";
import { useState } from "react";

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      companyName: "Acme Corporation",
      companyEmail: "hr@acme.com",
      companyPhone: "+1 (555) 123-4567",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
    },
    notifications: {
      emailNotifications: true,
      slackIntegration: false,
      smsNotifications: false,
      leaveApprovalAlerts: true,
      newHireAlerts: true,
      systemMaintenanceAlerts: true,
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      twoFactorAuth: false,
      loginAttempts: 5,
      accountLockoutDuration: 15,
    },
    hr: {
      probationPeriod: 90,
      annualLeaveDefault: 20,
      sickLeaveDefault: 10,
      workingHoursPerDay: 8,
      workingDaysPerWeek: 5,
      overtimeRateMultiplier: 1.5,
    },
  });

  const [savedSettings, setSavedSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard-modern" },
    { name: "People", href: "/people-modern" },
    { name: "Jobs", href: "/jobs-modern" },
    { name: "Leave", href: "/leave-modern" },
    { name: "Assets", href: "/assets-modern" },
    { name: "Reports", href: "/reports-modern" },
    { name: "Settings", href: "/settings-modern", current: true },
  ];

  const tabs = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "hr", name: "HR Policies", icon: "👥" },
    { id: "integrations", name: "Integrations", icon: "🔗" },
    { id: "backup", name: "Backup", icon: "💾" },
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

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"];
  const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavedSettings(settings);
    setHasChanges(false);
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings(savedSettings);
    setHasChanges(false);
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
            <h2 className="text-2xl font-bold text-gray-900">
              Settings & Configuration
            </h2>
            {hasChanges && (
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Reset Changes
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Tabs */}
            <div className="col-span-3">
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

            {/* Settings Content */}
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow p-6">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      General Settings
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={settings.general.companyName}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "companyName",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Email
                          </label>
                          <input
                            type="email"
                            value={settings.general.companyEmail}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "companyEmail",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Phone
                          </label>
                          <input
                            type="tel"
                            value={settings.general.companyPhone}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "companyPhone",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={settings.general.timezone}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "timezone",
                                e.target.value,
                              )
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                          </label>
                          <select
                            value={settings.general.dateFormat}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "dateFormat",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {dateFormats.map((format) => (
                              <option key={format} value={format}>
                                {format}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                          </label>
                          <select
                            value={settings.general.currency}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "currency",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {currencies.map((currency) => (
                              <option key={currency} value={currency}>
                                {currency}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Notification Settings
                    </h3>
                    <div className="space-y-6">
                      {Object.entries(settings.notifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {key === "emailNotifications" &&
                                  "Receive email notifications for important events"}
                                {key === "slackIntegration" &&
                                  "Send notifications to Slack channels"}
                                {key === "smsNotifications" &&
                                  "Receive SMS alerts for urgent matters"}
                                {key === "leaveApprovalAlerts" &&
                                  "Get notified when leave requests need approval"}
                                {key === "newHireAlerts" &&
                                  "Notifications for new employee onboarding"}
                                {key === "systemMaintenanceAlerts" &&
                                  "Alerts for system maintenance and updates"}
                              </p>
                            </div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) =>
                                  updateSetting(
                                    "notifications",
                                    key,
                                    e.target.checked,
                                  )
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </label>
                          </div>
                        ),
                      )}
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
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Password Length
                          </label>
                          <input
                            type="number"
                            min="6"
                            max="50"
                            value={settings.security.passwordMinLength}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "passwordMinLength",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="480"
                            value={settings.security.sessionTimeout}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "sessionTimeout",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Login Attempts
                          </label>
                          <input
                            type="number"
                            min="3"
                            max="10"
                            value={settings.security.loginAttempts}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "loginAttempts",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Lockout Duration (minutes)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="1440"
                            value={settings.security.accountLockoutDuration}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "accountLockoutDuration",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Require Special Characters
                            </h4>
                            <p className="text-sm text-gray-500">
                              Passwords must contain special characters
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.security.requireSpecialChars}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "requireSpecialChars",
                                e.target.checked,
                              )
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-500">
                              Require 2FA for all users
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "twoFactorAuth",
                                e.target.checked,
                              )
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* HR Policies */}
                {activeTab === "hr" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      HR Policies
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Probation Period (days)
                          </label>
                          <input
                            type="number"
                            min="30"
                            max="365"
                            value={settings.hr.probationPeriod}
                            onChange={(e) =>
                              updateSetting(
                                "hr",
                                "probationPeriod",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Annual Leave (days)
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="50"
                            value={settings.hr.annualLeaveDefault}
                            onChange={(e) =>
                              updateSetting(
                                "hr",
                                "annualLeaveDefault",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Sick Leave (days)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="30"
                            value={settings.hr.sickLeaveDefault}
                            onChange={(e) =>
                              updateSetting(
                                "hr",
                                "sickLeaveDefault",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Working Hours Per Day
                          </label>
                          <input
                            type="number"
                            min="4"
                            max="12"
                            step="0.5"
                            value={settings.hr.workingHoursPerDay}
                            onChange={(e) =>
                              updateSetting(
                                "hr",
                                "workingHoursPerDay",
                                parseFloat(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Working Days Per Week
                          </label>
                          <input
                            type="number"
                            min="3"
                            max="7"
                            value={settings.hr.workingDaysPerWeek}
                            onChange={(e) =>
                              updateSetting(
                                "hr",
                                "workingDaysPerWeek",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overtime Rate Multiplier
                          </label>
                          <input
                            type="number"
                            min="1.0"
                            max="3.0"
                            step="0.1"
                            value={settings.hr.overtimeRateMultiplier}
                            onChange={(e) =>
                              updateSetting(
                                "hr",
                                "overtimeRateMultiplier",
                                parseFloat(e.target.value),
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Integrations */}
                {activeTab === "integrations" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      System Integrations
                    </h3>
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Slack Integration
                            </h4>
                            <p className="text-sm text-gray-500">
                              Connect with Slack for notifications
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                            Connect
                          </button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Google Workspace
                            </h4>
                            <p className="text-sm text-gray-500">
                              Sync with Google Calendar and Gmail
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Connect
                          </button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Payroll System
                            </h4>
                            <p className="text-sm text-gray-500">
                              Integrate with external payroll provider
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                            Configure
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Backup */}
                {activeTab === "backup" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Backup & Data Management
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">
                          Automatic Backups
                        </h4>
                        <p className="text-sm text-blue-700 mb-4">
                          Daily automated backups are enabled. Last backup:
                          Today at 2:00 AM
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                          Run Backup Now
                        </button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Export Data
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Export Employee Data
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Export Job Records
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Export Leave History
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Export Asset Inventory
                          </button>
                        </div>
                      </div>
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

export default SettingsManagement;
