import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import { GetServerSideProps } from 'next';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiration: number; // days
  };
  sessionSettings: {
    timeout: number; // minutes
    maxConcurrentSessions: number;
  };
  loginSettings: {
    maxFailedAttempts: number;
    lockoutDuration: number; // minutes
    ipWhitelist: string[];
  };
  auditLog: boolean;
  emailNotifications: {
    loginFromNewDevice: boolean;
    passwordChange: boolean;
    failedLogins: boolean;
  };
}

const SecuritySettingsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      expiration: 90
    },
    sessionSettings: {
      timeout: 30,
      maxConcurrentSessions: 3
    },
    loginSettings: {
      maxFailedAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: []
    },
    auditLog: true,
    emailNotifications: {
      loginFromNewDevice: true,
      passwordChange: true,
      failedLogins: true
    }
  });

  // Ensure user has access to this page (admins only)
  useEffect(() => {
    if (!allowAccess && role !== 'admin') {
      router.push('/login?redirect=/settings/security');
    }
  }, [allowAccess, role, router]);

  // Load security settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Mock data - replace with actual API call
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading security settings:', error);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setSettings(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof SecuritySettings] as any,
            [child]: checkbox.checked
          }
        }));
      } else {
        setSettings(prev => ({
          ...prev,
          [name]: checkbox.checked
        }));
      }
    } else {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setSettings(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof SecuritySettings] as any,
            [child]: type === 'number' ? parseInt(value) : value
          }
        }));
      } else {
        setSettings(prev => ({
          ...prev,
          [name]: type === 'number' ? parseInt(value) : value
        }));
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would make an API call to save the settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Security settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!allowAccess && role !== 'admin') {
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
        <title>Security Settings - HR Management</title>
        <meta name="description" content="Manage security policies and access controls" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
            <p className="text-gray-600">Manage security policies and access controls</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">Require two-factor authentication for all users</p>
                  <p className="text-sm text-gray-500">Enhances security by requiring a second verification step</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoFactorEnabled"
                    checked={settings.twoFactorEnabled}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Password Policy */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Password Policy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    name="passwordPolicy.minLength"
                    value={settings.passwordPolicy.minLength}
                    onChange={handleInputChange}
                    min="6"
                    max="128"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Expiration (days)
                  </label>
                  <input
                    type="number"
                    name="passwordPolicy.expiration"
                    value={settings.passwordPolicy.expiration}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for no expiration</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="passwordPolicy.requireUppercase"
                    checked={settings.passwordPolicy.requireUppercase}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm">Require uppercase letters</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="passwordPolicy.requireLowercase"
                    checked={settings.passwordPolicy.requireLowercase}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm">Require lowercase letters</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="passwordPolicy.requireNumbers"
                    checked={settings.passwordPolicy.requireNumbers}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm">Require numbers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="passwordPolicy.requireSpecialChars"
                    checked={settings.passwordPolicy.requireSpecialChars}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm">Require special characters</span>
                </label>
              </div>
            </div>

            {/* Session Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Session Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionSettings.timeout"
                    value={settings.sessionSettings.timeout}
                    onChange={handleInputChange}
                    min="5"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Concurrent Sessions
                  </label>
                  <input
                    type="number"
                    name="sessionSettings.maxConcurrentSessions"
                    value={settings.sessionSettings.maxConcurrentSessions}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Login Security */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Login Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Failed Login Attempts
                  </label>
                  <input
                    type="number"
                    name="loginSettings.maxFailedAttempts"
                    value={settings.loginSettings.maxFailedAttempts}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Lockout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="loginSettings.lockoutDuration"
                    value={settings.loginSettings.lockoutDuration}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Audit & Monitoring */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Audit & Monitoring</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Enable Audit Logging</span>
                    <p className="text-xs text-gray-500">Log all user activities and system events</p>
                  </div>
                  <input
                    type="checkbox"
                    name="auditLog"
                    checked={settings.auditLog}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </label>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Security Notifications</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailNotifications.loginFromNewDevice"
                    checked={settings.emailNotifications.loginFromNewDevice}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm">Email on login from new device</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailNotifications.passwordChange"
                    checked={settings.emailNotifications.passwordChange}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm">Email on password change</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailNotifications.failedLogins"
                    checked={settings.emailNotifications.failedLogins}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  <span className="text-sm">Email on multiple failed login attempts</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Security Settings'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default SecuritySettingsPage; 
