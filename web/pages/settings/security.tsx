import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Lock, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  expiry_days: number;
}

interface AuthenticationSettings {
  password_policy: PasswordPolicy;
  mfa_enabled: boolean;
  session_timeout: number;
  login_attempts: number;
  lockout_duration: number;
}

interface RoleHierarchy {
  role: string;
  inherits_from: string;
  permissions: string[];
}

interface AccessControlSettings {
  rbac_enabled: boolean;
  default_role: string;
  permission_inheritance: boolean;
  role_hierarchy: RoleHierarchy[];
}

interface DataProtectionSettings {
  encryption_at_rest: boolean;
  encryption_in_transit: boolean;
  data_retention_days: number;
  gdpr_compliance: boolean;
  audit_logging: boolean;
}

interface SecurityHeader {
  name: string;
  value: string;
  enabled: boolean;
}

interface NetworkSecuritySettings {
  ip_whitelist: string[];
  cors_origins: string[];
  ssl_required: boolean;
  security_headers: SecurityHeader[];
}

interface SecuritySettings {
  authentication: AuthenticationSettings;
  access_control: AccessControlSettings;
  data_protection: DataProtectionSettings;
  network_security: NetworkSecuritySettings;
}

export default function SecuritySettings() {
  const router = useRouter();
  const { user } = useAuth();
  const [showSecretKeys, setShowSecretKeys] = useState<{ [key: string]: boolean }>({});
  const [testStatus, setTestStatus] = useState<{ [key: string]: 'idle' | 'testing' | 'success' | 'error' }>({});
  
  // Mock security settings data
  const [settings, setSettings] = useState<SecuritySettings>({
    authentication: {
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: false,
        expiry_days: 90
      },
      mfa_enabled: true,
      session_timeout: 30,
      login_attempts: 5,
      lockout_duration: 15
    },
    access_control: {
      rbac_enabled: true,
      default_role: 'employee',
      permission_inheritance: true,
      role_hierarchy: [
        { role: 'admin', inherits_from: 'manager', permissions: ['*'] },
        { role: 'manager', inherits_from: 'employee', permissions: ['read:all', 'write:team', 'approve:requests'] },
        { role: 'employee', inherits_from: 'user', permissions: ['read:own', 'write:own'] },
        { role: 'user', inherits_from: '', permissions: ['read:basic'] }
      ]
    },
    data_protection: {
      encryption_at_rest: true,
      encryption_in_transit: true,
      data_retention_days: 2555, // 7 years
      gdpr_compliance: true,
      audit_logging: true
    },
    network_security: {
      ip_whitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      cors_origins: ['https://yourcompany.com', 'https://app.yourcompany.com'],
      ssl_required: true,
      security_headers: [
        { name: 'X-Frame-Options', value: 'DENY', enabled: true },
        { name: 'X-Content-Type-Options', value: 'nosniff', enabled: true },
        { name: 'X-XSS-Protection', value: '1; mode=block', enabled: true },
        { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains', enabled: true },
        { name: 'Content-Security-Policy', value: "default-src 'self'", enabled: false }
      ]
    }
  });

  // Security status overview
  const securityStatus = {
    authentication: settings.authentication.mfa_enabled && settings.authentication.password_policy.min_length >= 8 ? 'secure' : 'warning',
    access_control: settings.access_control.rbac_enabled ? 'secure' : 'error',
    data_protection: settings.data_protection.encryption_at_rest && settings.data_protection.encryption_in_transit ? 'secure' : 'warning',
    network_security: settings.network_security.ssl_required && settings.network_security.security_headers.filter(h => h.enabled).length >= 3 ? 'secure' : 'warning'
  };

  // Role permission check
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleTestSecurity = async (component: string) => {
    setTestStatus({ ...testStatus, [component]: 'testing' });
    
    // Simulate security test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setTestStatus({ ...testStatus, [component]: success ? 'success' : 'error' });
    }, 2000);
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving security settings:', settings);
      alert('Security settings saved successfully!');
    } catch (error) {
      console.error('Failed to save security settings:', error);
      alert('Failed to save security settings');
    }
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecretKeys({ ...showSecretKeys, [key]: !showSecretKeys[key] });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'secure': return <Badge variant="solid" className="bg-green-100 text-green-800">Secure</Badge>;
      case 'warning': return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Warning</Badge>;
      case 'error': return <Badge variant="outline" className="border-red-500 text-red-700">Vulnerable</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access security settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Security Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure authentication, access control, and security policies
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Authentication</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(securityStatus.authentication)}
                  {getStatusBadge(securityStatus.authentication)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Access Control</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(securityStatus.access_control)}
                  {getStatusBadge(securityStatus.access_control)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Protection</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(securityStatus.data_protection)}
                  {getStatusBadge(securityStatus.data_protection)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network Security</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(securityStatus.network_security)}
                  {getStatusBadge(securityStatus.network_security)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="data-protection">Data Protection</TabsTrigger>
          <TabsTrigger value="network-security">Network Security</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password requirements and expiration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-length">Minimum Length</Label>
                    <Input
                      id="min-length"
                      type="number"
                      value={settings.authentication.password_policy.min_length}
                      onChange={(e) => setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          password_policy: {
                            ...settings.authentication.password_policy,
                            min_length: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry-days">Expiry (Days)</Label>
                    <Input
                      id="expiry-days"
                      type="number"
                      value={settings.authentication.password_policy.expiry_days}
                      onChange={(e) => setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          password_policy: {
                            ...settings.authentication.password_policy,
                            expiry_days: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.authentication.password_policy.require_uppercase}
                        onChange={(e) => setSettings({
                          ...settings,
                          authentication: {
                            ...settings.authentication,
                            password_policy: {
                              ...settings.authentication.password_policy,
                              require_uppercase: e.target.checked
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <Label htmlFor="require-uppercase">Require Uppercase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.authentication.password_policy.require_lowercase}
                        onChange={(e) => setSettings({
                          ...settings,
                          authentication: {
                            ...settings.authentication,
                            password_policy: {
                              ...settings.authentication.password_policy,
                              require_lowercase: e.target.checked
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <Label htmlFor="require-lowercase">Require Lowercase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.authentication.password_policy.require_numbers}
                        onChange={(e) => setSettings({
                          ...settings,
                          authentication: {
                            ...settings.authentication,
                            password_policy: {
                              ...settings.authentication.password_policy,
                              require_numbers: e.target.checked
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <Label htmlFor="require-numbers">Require Numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.authentication.password_policy.require_symbols}
                        onChange={(e) => setSettings({
                          ...settings,
                          authentication: {
                            ...settings.authentication,
                            password_policy: {
                              ...settings.authentication.password_policy,
                              require_symbols: e.target.checked
                            }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <Label htmlFor="require-symbols">Require Symbols</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session & Login Security</CardTitle>
                <CardDescription>Configure session timeouts and login protection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.authentication.mfa_enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        authentication: { ...settings.authentication, mfa_enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="mfa-enabled">Multi-Factor Authentication</Label>
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.authentication.session_timeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      authentication: {
                        ...settings.authentication,
                        session_timeout: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="login-attempts">Max Login Attempts</Label>
                    <Input
                      id="login-attempts"
                      type="number"
                      value={settings.authentication.login_attempts}
                      onChange={(e) => setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          login_attempts: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockout-duration"
                      type="number"
                      value={settings.authentication.lockout_duration}
                      onChange={(e) => setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          lockout_duration: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleTestSecurity('authentication')}
                  disabled={testStatus.authentication === 'testing'}
                  className="w-full"
                >
                  {testStatus.authentication === 'testing' ? 'Testing...' : 'Test Authentication'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access-control" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>RBAC Configuration</CardTitle>
                <CardDescription>Role-based access control settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.access_control.rbac_enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        access_control: { ...settings.access_control, rbac_enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="rbac-enabled">Enable Role-Based Access Control</Label>
                </div>

                <div>
                  <Label htmlFor="default-role">Default Role for New Users</Label>
                  <select
                    id="default-role"
                    value={settings.access_control.default_role}
                    onChange={(e) => setSettings({
                      ...settings,
                      access_control: { ...settings.access_control, default_role: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.access_control.permission_inheritance}
                      onChange={(e) => setSettings({
                        ...settings,
                        access_control: { ...settings.access_control, permission_inheritance: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="permission-inheritance">Enable Permission Inheritance</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Hierarchy</CardTitle>
                <CardDescription>Current role structure and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settings.access_control.role_hierarchy.map((role, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{role.role}</span>
                        <Badge variant="outline">{role.permissions.length} permissions</Badge>
                      </div>
                      {role.inherits_from && (
                        <p className="text-sm text-gray-600 mb-2">
                          Inherits from: <span className="font-medium">{role.inherits_from}</span>
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission, permIndex) => (
                          <Badge key={permIndex} variant="solid" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data-protection" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Encryption Settings</CardTitle>
                <CardDescription>Data encryption and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.data_protection.encryption_at_rest}
                      onChange={(e) => setSettings({
                        ...settings,
                        data_protection: { ...settings.data_protection, encryption_at_rest: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="encryption-rest">Encryption at Rest</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.data_protection.encryption_in_transit}
                      onChange={(e) => setSettings({
                        ...settings,
                        data_protection: { ...settings.data_protection, encryption_in_transit: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="encryption-transit">Encryption in Transit</Label>
                </div>

                <div>
                  <Label htmlFor="retention-days">Data Retention (Days)</Label>
                  <Input
                    id="retention-days"
                    type="number"
                    value={settings.data_protection.data_retention_days}
                    onChange={(e) => setSettings({
                      ...settings,
                      data_protection: {
                        ...settings.data_protection,
                        data_retention_days: parseInt(e.target.value)
                      }
                    })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Current: {Math.floor(settings.data_protection.data_retention_days / 365)} years
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.data_protection.gdpr_compliance}
                      onChange={(e) => setSettings({
                        ...settings,
                        data_protection: { ...settings.data_protection, gdpr_compliance: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="gdpr-compliance">GDPR Compliance Mode</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.data_protection.audit_logging}
                      onChange={(e) => setSettings({
                        ...settings,
                        data_protection: { ...settings.data_protection, audit_logging: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="audit-logging">Audit Logging</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>Current compliance status and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">GDPR Compliance</span>
                    {settings.data_protection.gdpr_compliance ? (
                      <Badge variant="solid" className="bg-green-100 text-green-800">Enabled</Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500 text-red-700">Disabled</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Encryption</span>
                    {settings.data_protection.encryption_at_rest && settings.data_protection.encryption_in_transit ? (
                      <Badge variant="solid" className="bg-green-100 text-green-800">Full</Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-700">Partial</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audit Trail</span>
                    {settings.data_protection.audit_logging ? (
                      <Badge variant="solid" className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500 text-red-700">Inactive</Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleTestSecurity('data-protection')}
                  disabled={testStatus['data-protection'] === 'testing'}
                  className="w-full"
                >
                  {testStatus['data-protection'] === 'testing' ? 'Testing...' : 'Test Data Protection'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network-security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Access Control</CardTitle>
                <CardDescription>IP whitelist and CORS configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ip-whitelist">IP Whitelist (one per line)</Label>
                  <textarea
                    id="ip-whitelist"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={settings.network_security.ip_whitelist.join('\n')}
                    onChange={(e) => setSettings({
                      ...settings,
                      network_security: {
                        ...settings.network_security,
                        ip_whitelist: e.target.value.split('\n').filter(ip => ip.trim())
                      }
                    })}
                    placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  />
                </div>

                <div>
                  <Label htmlFor="cors-origins">CORS Origins (one per line)</Label>
                  <textarea
                    id="cors-origins"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={settings.network_security.cors_origins.join('\n')}
                    onChange={(e) => setSettings({
                      ...settings,
                      network_security: {
                        ...settings.network_security,
                        cors_origins: e.target.value.split('\n').filter(origin => origin.trim())
                      }
                    })}
                    placeholder="https://yourcompany.com&#10;https://app.yourcompany.com"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.network_security.ssl_required}
                      onChange={(e) => setSettings({
                        ...settings,
                        network_security: { ...settings.network_security, ssl_required: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <Label htmlFor="ssl-required">Require SSL/TLS</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Headers</CardTitle>
                <CardDescription>HTTP security headers configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.network_security.security_headers.map((header, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{header.name}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={(e) => {
                            const updatedHeaders = [...settings.network_security.security_headers];
                            updatedHeaders[index] = { ...header, enabled: e.target.checked };
                            setSettings({
                              ...settings,
                              network_security: {
                                ...settings.network_security,
                                security_headers: updatedHeaders
                              }
                            });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <Input
                      value={header.value}
                      onChange={(e) => {
                        const updatedHeaders = [...settings.network_security.security_headers];
                        updatedHeaders[index] = { ...header, value: e.target.value };
                        setSettings({
                          ...settings,
                          network_security: {
                            ...settings.network_security,
                            security_headers: updatedHeaders
                          }
                        });
                      }}
                      placeholder="Header value"
                      className="text-sm"
                    />
                  </div>
                ))}

                <Button
                  onClick={() => handleTestSecurity('network-security')}
                  disabled={testStatus['network-security'] === 'testing'}
                  className="w-full"
                >
                  {testStatus['network-security'] === 'testing' ? 'Testing...' : 'Test Network Security'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle>Security Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" size="sm">
              <Lock className="w-4 h-4 mr-2" />
              Reset MFA
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Security Audit
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              View Alerts
            </Button>
            <Button variant="outline" size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Test All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
