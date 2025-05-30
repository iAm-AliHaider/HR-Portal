import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  DollarSign, 
  Calculator, 
  Shield, 
  FileText, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

interface PayrollSettings {
  company_info: {
    name: string;
    tax_id: string;
    address: string;
    payroll_frequency: string;
    fiscal_year_start: string;
    default_currency: string;
  };
  tax_settings: {
    federal_tax: {
      enabled: boolean;
      rate_structure: string;
      brackets: Array<{min: number; max: number; rate: number}>;
    };
    state_tax: {
      enabled: boolean;
      flat_rate: number;
      state: string;
    };
    social_security: {
      enabled: boolean;
      rate: number;
      wage_base: number;
      employer_rate: number;
    };
    medicare: {
      enabled: boolean;
      rate: number;
      additional_rate: number;
      additional_threshold: number;
      employer_rate: number;
    };
    unemployment: {
      federal_rate: number;
      state_rate: number;
      wage_base: number;
    };
  };
  deduction_types: Array<{
    id: string;
    name: string;
    type: string;
    category: string;
    default_amount?: number;
    default_percentage?: number;
    frequency: string;
    employer_contribution?: number;
    enabled: boolean;
  }>;
  overtime_rules: {
    enabled: boolean;
    daily_overtime_hours: number;
    weekly_overtime_hours: number;
    overtime_rate_multiplier: number;
    double_time_hours: number;
    double_time_rate_multiplier: number;
  };
  compliance: {
    minimum_wage: number;
    state: string;
    workers_comp_rate: number;
    disability_insurance_rate: number;
    family_leave_rate: number;
  };
}

export default function PayrollSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<PayrollSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [showAddDeduction, setShowAddDeduction] = useState(false);

  // Form states
  const [newDeduction, setNewDeduction] = useState({
    name: '',
    type: 'pre_tax',
    category: 'benefit',
    default_amount: '',
    default_percentage: '',
    frequency: 'monthly',
    employer_contribution: '',
    enabled: true
  });

  useEffect(() => {
    loadPayrollSettings();
  }, []);

  const loadPayrollSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payroll?type=settings');
      if (response.ok) {
        const result = await response.json();
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error loading payroll settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/payroll?type=settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Payroll settings saved successfully!');
        setEditMode(false);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addDeduction = () => {
    if (!settings) return;

    const deduction = {
      id: `deduction-${Date.now()}`,
      name: newDeduction.name,
      type: newDeduction.type,
      category: newDeduction.category,
      default_amount: newDeduction.default_amount ? parseFloat(newDeduction.default_amount) : undefined,
      default_percentage: newDeduction.default_percentage ? parseFloat(newDeduction.default_percentage) : undefined,
      frequency: newDeduction.frequency,
      employer_contribution: newDeduction.employer_contribution ? parseFloat(newDeduction.employer_contribution) : 0,
      enabled: newDeduction.enabled
    };

    setSettings({
      ...settings,
      deduction_types: [...settings.deduction_types, deduction]
    });

    setNewDeduction({
      name: '',
      type: 'pre_tax',
      category: 'benefit',
      default_amount: '',
      default_percentage: '',
      frequency: 'monthly',
      employer_contribution: '',
      enabled: true
    });
    setShowAddDeduction(false);
  };

  const removeDeduction = (deductionId: string) => {
    if (!settings) return;

    setSettings({
      ...settings,
      deduction_types: settings.deduction_types.filter(d => d.id !== deductionId)
    });
  };

  const updateSetting = (path: string, value: any) => {
    if (!settings) return;

    const pathArray = path.split('.');
    const newSettings = { ...settings };
    let current = newSettings;

    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }

    current[pathArray[pathArray.length - 1]] = value;
    setSettings(newSettings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings?.company_info.name || ''}
                onChange={(e) => updateSetting('company_info.name', e.target.value)}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID (EIN)
              </label>
              <input
                type="text"
                value={settings?.company_info.tax_id || ''}
                onChange={(e) => updateSetting('company_info.tax_id', e.target.value)}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Address
            </label>
            <textarea
              value={settings?.company_info.address || ''}
              onChange={(e) => updateSetting('company_info.address', e.target.value)}
              disabled={!editMode}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payroll Frequency
              </label>
              <select
                value={settings?.company_info.payroll_frequency || ''}
                onChange={(e) => updateSetting('company_info.payroll_frequency', e.target.value)}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="semi-monthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiscal Year Start
              </label>
              <input
                type="text"
                value={settings?.company_info.fiscal_year_start || ''}
                onChange={(e) => updateSetting('company_info.fiscal_year_start', e.target.value)}
                disabled={!editMode}
                placeholder="MM-DD"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <select
                value={settings?.company_info.default_currency || ''}
                onChange={(e) => updateSetting('company_info.default_currency', e.target.value)}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTaxSettings = () => (
    <div className="space-y-6">
      {/* Federal Tax */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Federal Tax Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Federal Income Tax</h4>
              <p className="text-sm text-gray-600">Progressive tax brackets</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings?.tax_settings.federal_tax.enabled || false}
                onChange={(e) => updateSetting('tax_settings.federal_tax.enabled', e.target.checked)}
                disabled={!editMode}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Badge className={settings?.tax_settings.federal_tax.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {settings?.tax_settings.federal_tax.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>

          {settings?.tax_settings.federal_tax.enabled && (
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Tax Brackets (2024)</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Minimum Income</th>
                      <th className="text-left p-2">Maximum Income</th>
                      <th className="text-left p-2">Tax Rate (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.tax_settings.federal_tax.brackets.map((bracket, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">${bracket.min.toLocaleString()}</td>
                        <td className="p-2">${bracket.max.toLocaleString()}</td>
                        <td className="p-2">{bracket.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* State Tax */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            State Tax Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">State Income Tax</h4>
              <p className="text-sm text-gray-600">Flat rate state tax</p>
            </div>
            <Badge className={settings?.tax_settings.state_tax.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {settings?.tax_settings.state_tax.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={settings?.tax_settings.state_tax.state || ''}
                onChange={(e) => updateSetting('tax_settings.state_tax.state', e.target.value)}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings?.tax_settings.state_tax.flat_rate || ''}
                onChange={(e) => updateSetting('tax_settings.state_tax.flat_rate', parseFloat(e.target.value))}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FICA Taxes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            FICA Tax Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Security */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Social Security</h4>
              <Badge className="bg-blue-100 text-blue-800">Required</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings?.tax_settings.social_security.rate || ''}
                  onChange={(e) => updateSetting('tax_settings.social_security.rate', parseFloat(e.target.value))}
                  disabled={!editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings?.tax_settings.social_security.employer_rate || ''}
                  onChange={(e) => updateSetting('tax_settings.social_security.employer_rate', parseFloat(e.target.value))}
                  disabled={!editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wage Base ($)
                </label>
                <input
                  type="number"
                  value={settings?.tax_settings.social_security.wage_base || ''}
                  onChange={(e) => updateSetting('tax_settings.social_security.wage_base', parseInt(e.target.value))}
                  disabled={!editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Medicare */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Medicare</h4>
              <Badge className="bg-blue-100 text-blue-800">Required</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings?.tax_settings.medicare.rate || ''}
                  onChange={(e) => updateSetting('tax_settings.medicare.rate', parseFloat(e.target.value))}
                  disabled={!editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings?.tax_settings.medicare.employer_rate || ''}
                  onChange={(e) => updateSetting('tax_settings.medicare.employer_rate', parseFloat(e.target.value))}
                  disabled={!editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings?.tax_settings.medicare.additional_rate || ''}
                  onChange={(e) => updateSetting('tax_settings.medicare.additional_rate', parseFloat(e.target.value))}
                  disabled={!editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Threshold ($)
                </label>
                <input
                  type="number"
                  value={settings?.tax_settings.medicare.additional_threshold || ''}
                  onChange={(e) => updateSetting('tax_settings.medicare.additional_threshold', parseInt(e.target.value))}
                  disabled={!editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDeductionSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Deduction Types</h2>
        <Button 
          onClick={() => setShowAddDeduction(true)}
          disabled={!editMode}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Deduction Type
        </Button>
      </div>

      <div className="grid gap-4">
        {settings?.deduction_types.map((deduction) => (
          <Card key={deduction.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{deduction.name}</h4>
                    <Badge className={`${deduction.type === 'pre_tax' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {deduction.type.replace('_', '-')}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800 capitalize">
                      {deduction.category}
                    </Badge>
                    <Badge className={deduction.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {deduction.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="font-medium">Amount:</span> 
                        {deduction.default_amount ? ` $${deduction.default_amount}` : 
                         deduction.default_percentage ? ` ${deduction.default_percentage}%` : ' Variable'}
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span> {deduction.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Employer Contribution:</span> 
                        {deduction.employer_contribution ? ` ${deduction.employer_contribution}%` : ' None'}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {deduction.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
                {editMode && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeDeduction(deduction.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Deduction Modal */}
      {showAddDeduction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Add Deduction Type</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deduction Name
                </label>
                <input
                  type="text"
                  value={newDeduction.name}
                  onChange={(e) => setNewDeduction({...newDeduction, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Parking Fee"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newDeduction.type}
                    onChange={(e) => setNewDeduction({...newDeduction, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pre_tax">Pre-Tax</option>
                    <option value="post_tax">Post-Tax</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newDeduction.category}
                    onChange={(e) => setNewDeduction({...newDeduction, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="benefit">Benefit</option>
                    <option value="retirement">Retirement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDeduction.default_amount}
                    onChange={(e) => setNewDeduction({...newDeduction, default_amount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDeduction.default_percentage}
                    onChange={(e) => setNewDeduction({...newDeduction, default_percentage: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={newDeduction.frequency}
                  onChange={(e) => setNewDeduction({...newDeduction, frequency: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="per_paycheck">Per Paycheck</option>
                  <option value="monthly">Monthly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={addDeduction} className="flex-1">
                Add Deduction
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddDeduction(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOvertimeSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Overtime Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Overtime Calculations</h4>
              <p className="text-sm text-gray-600">Automatically calculate overtime pay based on rules</p>
            </div>
            <input
              type="checkbox"
              checked={settings?.overtime_rules.enabled || false}
              onChange={(e) => updateSetting('overtime_rules.enabled', e.target.checked)}
              disabled={!editMode}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          {settings?.overtime_rules.enabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Overtime Hours
                  </label>
                  <input
                    type="number"
                    value={settings.overtime_rules.daily_overtime_hours || ''}
                    onChange={(e) => updateSetting('overtime_rules.daily_overtime_hours', parseInt(e.target.value))}
                    disabled={!editMode}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hours before daily overtime kicks in</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Overtime Hours
                  </label>
                  <input
                    type="number"
                    value={settings.overtime_rules.weekly_overtime_hours || ''}
                    onChange={(e) => updateSetting('overtime_rules.weekly_overtime_hours', parseInt(e.target.value))}
                    disabled={!editMode}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hours before weekly overtime kicks in</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overtime Rate Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.overtime_rules.overtime_rate_multiplier || ''}
                    onChange={(e) => updateSetting('overtime_rules.overtime_rate_multiplier', parseFloat(e.target.value))}
                    disabled={!editMode}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g., 1.5 for time and a half</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Double Time Hours
                  </label>
                  <input
                    type="number"
                    value={settings.overtime_rules.double_time_hours || ''}
                    onChange={(e) => updateSetting('overtime_rules.double_time_hours', parseInt(e.target.value))}
                    disabled={!editMode}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hours before double time</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Double Time Rate
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.overtime_rules.double_time_rate_multiplier || ''}
                    onChange={(e) => updateSetting('overtime_rules.double_time_rate_multiplier', parseFloat(e.target.value))}
                    disabled={!editMode}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g., 2.0 for double time</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Wage ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.compliance.minimum_wage || ''}
                onChange={(e) => updateSetting('compliance.minimum_wage', parseFloat(e.target.value))}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Per hour minimum wage for your state</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={settings?.compliance.state || ''}
                onChange={(e) => updateSetting('compliance.state', e.target.value)}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workers' Comp Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.compliance.workers_comp_rate || ''}
                onChange={(e) => updateSetting('compliance.workers_comp_rate', parseFloat(e.target.value))}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disability Insurance Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.compliance.disability_insurance_rate || ''}
                onChange={(e) => updateSetting('compliance.disability_insurance_rate', parseFloat(e.target.value))}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family Leave Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.compliance.family_leave_rate || ''}
                onChange={(e) => updateSetting('compliance.family_leave_rate', parseFloat(e.target.value))}
                disabled={!editMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Important Note</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Compliance rates vary by state and are subject to change. Please consult with your accounting or legal team to ensure these rates are current and accurate for your jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <ModernDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      <Head>
        <title>Payroll Settings - HR Portal</title>
      </Head>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Payroll Settings</h1>
              <p className="text-gray-600">Configure payroll calculations, taxes, and compliance</p>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button 
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Settings
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'taxes', label: 'Tax Settings', icon: Calculator },
            { id: 'deductions', label: 'Deductions', icon: DollarSign },
            { id: 'overtime', label: 'Overtime', icon: Clock },
            { id: 'compliance', label: 'Compliance', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'taxes' && renderTaxSettings()}
        {activeTab === 'deductions' && renderDeductionSettings()}
        {activeTab === 'overtime' && renderOvertimeSettings()}
        {activeTab === 'compliance' && renderComplianceSettings()}
      </div>
    </ModernDashboardLayout>
  );
} 