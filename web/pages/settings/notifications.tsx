import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';

interface NotificationSettings {
  email: {
    newApplications: boolean;
    interviewScheduled: boolean;
    leaveRequests: boolean;
    expenseSubmissions: boolean;
    systemUpdates: boolean;
    weeklyDigest: boolean;
    monthlyReports: boolean;
  };
  inApp: {
    newApplications: boolean;
    interviewReminders: boolean;
    taskAssignments: boolean;
    leaveApprovals: boolean;
    expenseApprovals: boolean;
    systemAlerts: boolean;
  };
  sms: {
    urgentAlerts: boolean;
    interviewReminders: boolean;
    leaveApprovals: boolean;
  };
  frequency: {
    digestFrequency: 'daily' | 'weekly' | 'monthly';
    reminderTiming: '15min' | '30min' | '1hour' | '1day';
  };
}

const NotificationSettingsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newApplications: true,
      interviewScheduled: true,
      leaveRequests: true,
      expenseSubmissions: false,
      systemUpdates: true,
      weeklyDigest: true,
      monthlyReports: false
    },
    inApp: {
      newApplications: true,
      interviewReminders: true,
      taskAssignments: true,
      leaveApprovals: true,
      expenseApprovals: true,
      systemAlerts: true
    },
    sms: {
      urgentAlerts: false,
      interviewReminders: false,
      leaveApprovals: false
    },
    frequency: {
      digestFrequency: 'weekly',
      reminderTiming: '30min'
    }
  });

  // Ensure user has access to this page
  useEffect(() => {
    if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
      router.push('/login?redirect=/settings/notifications');
    }
  }, [allowAccess, role, router]);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Mock data - replace with actual API call
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleCheckboxChange = (category: keyof NotificationSettings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]]
      }
    }));
  };

  const handleSelectChange = (category: keyof NotificationSettings, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would make an API call to save the settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = (type: string) => {
    alert(`Test ${type} notification sent!`);
  };

  if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
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
        <title>Notification Settings - HR Management</title>
        <meta name="description" content="Configure notification preferences and settings" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-600">Configure how and when you receive notifications</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Email Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Email Notifications</h2>
                <button
                  onClick={() => handleTestNotification('email')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Send Test Email
                </button>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.newApplications}
                    onChange={() => handleCheckboxChange('email', 'newApplications')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">New Applications</span>
                    <p className="text-xs text-gray-500">Receive emails when new job applications are submitted</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.interviewScheduled}
                    onChange={() => handleCheckboxChange('email', 'interviewScheduled')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Interview Scheduled</span>
                    <p className="text-xs text-gray-500">Email confirmations for scheduled interviews</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.leaveRequests}
                    onChange={() => handleCheckboxChange('email', 'leaveRequests')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Leave Requests</span>
                    <p className="text-xs text-gray-500">Notifications for leave requests and approvals</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.expenseSubmissions}
                    onChange={() => handleCheckboxChange('email', 'expenseSubmissions')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Expense Submissions</span>
                    <p className="text-xs text-gray-500">Notifications for expense report submissions</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.systemUpdates}
                    onChange={() => handleCheckboxChange('email', 'systemUpdates')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">System Updates</span>
                    <p className="text-xs text-gray-500">Important system announcements and updates</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.weeklyDigest}
                    onChange={() => handleCheckboxChange('email', 'weeklyDigest')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Weekly Digest</span>
                    <p className="text-xs text-gray-500">Weekly summary of activities and tasks</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.email.monthlyReports}
                    onChange={() => handleCheckboxChange('email', 'monthlyReports')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Monthly Reports</span>
                    <p className="text-xs text-gray-500">Monthly analytics and performance reports</p>
                  </div>
                </label>
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">In-App Notifications</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.inApp.newApplications}
                    onChange={() => handleCheckboxChange('inApp', 'newApplications')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">New Applications</span>
                    <p className="text-xs text-gray-500">Show notifications for new applications</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.inApp.interviewReminders}
                    onChange={() => handleCheckboxChange('inApp', 'interviewReminders')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Interview Reminders</span>
                    <p className="text-xs text-gray-500">Reminders for upcoming interviews</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.inApp.taskAssignments}
                    onChange={() => handleCheckboxChange('inApp', 'taskAssignments')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Task Assignments</span>
                    <p className="text-xs text-gray-500">Notifications when tasks are assigned to you</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.inApp.leaveApprovals}
                    onChange={() => handleCheckboxChange('inApp', 'leaveApprovals')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Leave Approvals</span>
                    <p className="text-xs text-gray-500">Updates on leave request approvals</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.inApp.expenseApprovals}
                    onChange={() => handleCheckboxChange('inApp', 'expenseApprovals')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Expense Approvals</span>
                    <p className="text-xs text-gray-500">Updates on expense report approvals</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.inApp.systemAlerts}
                    onChange={() => handleCheckboxChange('inApp', 'systemAlerts')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">System Alerts</span>
                    <p className="text-xs text-gray-500">Important system notifications and alerts</p>
                  </div>
                </label>
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">SMS Notifications</h2>
                <button
                  onClick={() => handleTestNotification('SMS')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Send Test SMS
                </button>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.sms.urgentAlerts}
                    onChange={() => handleCheckboxChange('sms', 'urgentAlerts')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Urgent Alerts</span>
                    <p className="text-xs text-gray-500">Critical system alerts and emergencies</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.sms.interviewReminders}
                    onChange={() => handleCheckboxChange('sms', 'interviewReminders')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Interview Reminders</span>
                    <p className="text-xs text-gray-500">SMS reminders for upcoming interviews</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.sms.leaveApprovals}
                    onChange={() => handleCheckboxChange('sms', 'leaveApprovals')}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium">Leave Approvals</span>
                    <p className="text-xs text-gray-500">SMS updates for leave request decisions</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Frequency Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Notification Frequency</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Digest Frequency
                  </label>
                  <select
                    value={settings.frequency.digestFrequency}
                    onChange={(e) => handleSelectChange('frequency', 'digestFrequency', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Timing
                  </label>
                  <select
                    value={settings.frequency.reminderTiming}
                    onChange={(e) => handleSelectChange('frequency', 'reminderTiming', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="15min">15 minutes before</option>
                    <option value="30min">30 minutes before</option>
                    <option value="1hour">1 hour before</option>
                    <option value="1day">1 day before</option>
                  </select>
                </div>
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
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationSettingsPage; 