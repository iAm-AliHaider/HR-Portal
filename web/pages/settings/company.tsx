import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  useCompanySettings, 
  useToast, 
  useForm 
} from '../../hooks/useApi';
import type { NextPage } from 'next';

// Company settings form interface
interface CompanySettingsForm {
  name: string;
  industry: string;
  size: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo_url?: string;
  timezone: string;
  currency: string;
  date_format: string;
  working_days: string[];
  working_hours_start: string;
  working_hours_end: string;
  leave_policy: {
    annual_leave_days: number;
    sick_leave_days: number;
    personal_leave_days: number;
    maternity_leave_days: number;
    paternity_leave_days: number;
  };
  probation_period_months: number;
  notice_period_days: number;
}

const CompanySettingsPage: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  
  // API hooks
  const { 
    settings, 
    loading, 
    error, 
    updateSettings 
  } = useCompanySettings();

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Form management
  const form = useForm<CompanySettingsForm>({
    name: settings?.name || '',
    industry: settings?.industry || '',
    size: settings?.size || '',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    website: settings?.website || '',
    description: settings?.description || '',
    logo_url: settings?.logo_url || '',
    timezone: settings?.timezone || 'America/New_York',
    currency: settings?.currency || 'USD',
    date_format: settings?.date_format || 'MM/DD/YYYY',
    working_days: settings?.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    working_hours_start: settings?.working_hours_start || '09:00',
    working_hours_end: settings?.working_hours_end || '17:00',
    leave_policy: settings?.leave_policy || {
      annual_leave_days: 20,
      sick_leave_days: 10,
      personal_leave_days: 5,
      maternity_leave_days: 90,
      paternity_leave_days: 15
    },
    probation_period_months: settings?.probation_period_months || 3,
    notice_period_days: settings?.notice_period_days || 30
  });

  // Update form when settings load
  React.useEffect(() => {
    if (settings) {
      Object.keys(form.values).forEach(key => {
        if (settings[key] !== undefined) {
          form.setValue(key as keyof CompanySettingsForm, settings[key]);
        }
      });
    }
  }, [settings]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.name) {
      form.setError('name', 'Company name is required');
      hasErrors = true;
    }
    
    if (!form.values.email) {
      form.setError('email', 'Company email is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      await updateSettings(form.values);
      toast.success('Company settings updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle working days change
  const handleWorkingDaysChange = (day: string, checked: boolean) => {
    const currentDays = form.values.working_days;
    const newDays = checked 
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);
    form.setValue('working_days', newDays);
  };

  // Handle leave policy change
  const handleLeavePolicyChange = (field: string, value: number) => {
    form.setValue('leave_policy', {
      ...form.values.leave_policy,
      [field]: value
    });
  };

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Construction', 'Real Estate', 'Legal', 'Consulting',
    'Media', 'Transportation', 'Energy', 'Non-profit', 'Government', 'Other'
  ];

  const companySizes = [
    '1-10', '11-50', '51-100', '101-500', '501-1000', '1000+'
  ];

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Australia/Sydney', 'Pacific/Auckland'
  ];

  const currencies = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'
  ];

  const dateFormats = [
    'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY'
  ];

  const weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Company Settings | HR System</title>
      </Head>
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
              <p className="text-gray-600 mt-2">Manage your company profile and configuration</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'general', label: 'General', icon: '🏢' },
                { id: 'work', label: 'Work Schedule', icon: '⏰' },
                { id: 'policies', label: 'Policies', icon: '📋' },
                { id: 'localization', label: 'Localization', icon: '🌍' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Company Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={form.values.name}
                      onChange={(e) => form.setValue('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {form.errors.name && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      value={form.values.industry}
                      onChange={(e) => form.setValue('industry', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select Industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size
                    </label>
                    <select
                      value={form.values.size}
                      onChange={(e) => form.setValue('size', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select Size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size} employees</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.values.email}
                      onChange={(e) => form.setValue('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {form.errors.email && (
                      <p className="text-red-600 text-sm mt-1">{form.errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.values.phone}
                      onChange={(e) => form.setValue('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={form.values.website}
                      onChange={(e) => form.setValue('website', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={form.values.address}
                    onChange={(e) => form.setValue('address', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.values.description}
                    onChange={(e) => form.setValue('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                    placeholder="Brief description of your company..."
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={form.values.logo_url}
                    onChange={(e) => form.setValue('logo_url', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Work Schedule Tab */}
          {activeTab === 'work' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Work Schedule</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="space-y-2">
                      {weekdays.map(day => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.values.working_days.includes(day)}
                            onChange={(e) => handleWorkingDaysChange(day, e.target.checked)}
                            className="mr-2"
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={form.values.working_hours_start}
                          onChange={(e) => form.setValue('working_hours_start', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Time</label>
                        <input
                          type="time"
                          value={form.values.working_hours_end}
                          onChange={(e) => form.setValue('working_hours_end', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Leave Policies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Leave Days
                    </label>
                    <input
                      type="number"
                      value={form.values.leave_policy.annual_leave_days}
                      onChange={(e) => handleLeavePolicyChange('annual_leave_days', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sick Leave Days
                    </label>
                    <input
                      type="number"
                      value={form.values.leave_policy.sick_leave_days}
                      onChange={(e) => handleLeavePolicyChange('sick_leave_days', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Personal Leave Days
                    </label>
                    <input
                      type="number"
                      value={form.values.leave_policy.personal_leave_days}
                      onChange={(e) => handleLeavePolicyChange('personal_leave_days', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maternity Leave Days
                    </label>
                    <input
                      type="number"
                      value={form.values.leave_policy.maternity_leave_days}
                      onChange={(e) => handleLeavePolicyChange('maternity_leave_days', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paternity Leave Days
                    </label>
                    <input
                      type="number"
                      value={form.values.leave_policy.paternity_leave_days}
                      onChange={(e) => handleLeavePolicyChange('paternity_leave_days', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Employment Policies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probation Period (Months)
                    </label>
                    <input
                      type="number"
                      value={form.values.probation_period_months}
                      onChange={(e) => form.setValue('probation_period_months', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notice Period (Days)
                    </label>
                    <input
                      type="number"
                      value={form.values.notice_period_days}
                      onChange={(e) => form.setValue('notice_period_days', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Localization Tab */}
          {activeTab === 'localization' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Regional Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={form.values.timezone}
                      onChange={(e) => form.setValue('timezone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={form.values.currency}
                      onChange={(e) => form.setValue('currency', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select
                      value={form.values.date_format}
                      onChange={(e) => form.setValue('date_format', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {dateFormats.map(format => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toast.toasts.map(t => (
            <div
              key={t.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white ${
                t.type === 'success' ? 'bg-green-500' :
                t.type === 'error' ? 'bg-red-500' :
                t.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{t.message}</span>
                <button
                  onClick={() => toast.removeToast(t.id)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompanySettingsPage; 
