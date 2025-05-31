import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import {
  AlertTriangle,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Save,
  Key,
  Fingerprint,
  Users,
  Globe,
  Server,
} from "lucide-react";

import {
  PageLayout,
  StatsCard,
  CardGrid,
} from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  expiry_days: number;
  prevent_reuse: number;
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
  ip_restrictions: boolean;
  allowed_ips: string[];
  geo_restrictions: boolean;
  blocked_countries: string[];
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

const SecuritySettings = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const [showSecretKeys, setShowSecretKeys] = useState<{
    [key: string]: boolean;
  }>({});
  const [testStatus, setTestStatus] = useState<{
    [key: string]: "idle" | "testing" | "success" | "error";
  }>({});
  const [settings, setSettings] = useState<SecuritySettings>({
    authentication: {
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: false,
        expiry_days: 90,
        prevent_reuse: 5,
      },
      mfa_enabled: true,
      session_timeout: 30,
      login_attempts: 5,
      lockout_duration: 15,
    },
    access_control: {
      rbac_enabled: true,
      default_role: "employee",
      permission_inheritance: true,
      role_hierarchy: [
        { role: "admin", inherits_from: "manager", permissions: ["*"] },
        {
          role: "manager",
          inherits_from: "employee",
          permissions: ["read:all", "write:team", "approve:requests"],
        },
        {
          role: "employee",
          inherits_from: "user",
          permissions: ["read:own", "write:own"],
        },
        { role: "user", inherits_from: "", permissions: ["read:basic"] },
      ],
      ip_restrictions: false,
      allowed_ips: [],
      geo_restrictions: false,
      blocked_countries: [],
    },
    data_protection: {
      encryption_at_rest: true,
      encryption_in_transit: true,
      data_retention_days: 2555, // 7 years
      gdpr_compliance: true,
      audit_logging: true,
    },
    network_security: {
      ip_whitelist: ["192.168.1.0/24", "10.0.0.0/8"],
      cors_origins: ["https://yourcompany.com", "https://app.yourcompany.com"],
      ssl_required: true,
      security_headers: [
        { name: "X-Frame-Options", value: "DENY", enabled: true },
        { name: "X-Content-Type-Options", value: "nosniff", enabled: true },
        { name: "X-XSS-Protection", value: "1; mode=block", enabled: true },
        {
          name: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
          enabled: true,
        },
        {
          name: "Content-Security-Policy",
          value: "default-src 'self'",
          enabled: false,
        },
      ],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newIP, setNewIP] = useState("");
  const [newBlockedCountry, setNewBlockedCountry] = useState("");

  // Security status overview
  const securityStatus = {
    authentication:
      settings.authentication.mfa_enabled &&
      settings.authentication.password_policy.min_length >= 8
        ? "secure"
        : "warning",
    access_control: settings.access_control.rbac_enabled ? "secure" : "error",
    data_protection:
      settings.data_protection.encryption_at_rest &&
      settings.data_protection.encryption_in_transit
        ? "secure"
        : "warning",
    network_security:
      settings.network_security.ssl_required &&
      settings.network_security.security_headers.filter((h) => h.enabled)
        .length >= 3
        ? "secure"
        : "warning",
  };

  // Ensure admin access
  useEffect(() => {
    if (role !== "admin") {
      router.push("/dashboard");
    }
  }, [role, router]);

  const handleTestSecurity = async (component: string) => {
    setTestStatus({ ...testStatus, [component]: "testing" });

    // Simulate security test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setTestStatus({
        ...testStatus,
        [component]: success ? "success" : "error",
      });
    }, 2000);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // In a real app, you would call an API here
    setTimeout(() => {
      alert("Settings saved successfully!");
      setIsLoading(false);
    }, 1000);
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecretKeys({ ...showSecretKeys, [key]: !showSecretKeys[key] });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
        return (
          <CheckCircle className="h-4 w-4 text-green-500" strokeWidth={1.5} />
        );
      case "warning":
        return (
          <AlertCircle className="h-4 w-4 text-yellow-500" strokeWidth={1.5} />
        );
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" strokeWidth={1.5} />;
      default:
        return (
          <AlertTriangle className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "secure":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            Secure
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-700"
          >
            Warning
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Vulnerable
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const addIP = () => {
    if (newIP && !settings.access_control.allowed_ips.includes(newIP)) {
      setSettings({
        ...settings,
        access_control: {
          ...settings.access_control,
          allowed_ips: [...settings.access_control.allowed_ips, newIP],
        },
      });
      setNewIP("");
    }
  };

  const removeIP = (ip: string) => {
    setSettings({
      ...settings,
      access_control: {
        ...settings.access_control,
        allowed_ips: settings.access_control.allowed_ips.filter(
          (i) => i !== ip,
        ),
      },
    });
  };

  const addBlockedCountry = () => {
    if (
      newBlockedCountry &&
      !settings.access_control.blocked_countries.includes(newBlockedCountry)
    ) {
      setSettings({
        ...settings,
        access_control: {
          ...settings.access_control,
          blocked_countries: [
            ...settings.access_control.blocked_countries,
            newBlockedCountry,
          ],
        },
      });
      setNewBlockedCountry("");
    }
  };

  const removeBlockedCountry = (country: string) => {
    setSettings({
      ...settings,
      access_control: {
        ...settings.access_control,
        blocked_countries: settings.access_control.blocked_countries.filter(
          (c) => c !== country,
        ),
      },
    });
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            strokeWidth={1.5}
          />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need admin privileges to access security settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Security Settings"
      description="Configure security policies and access controls"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/settings" },
        { label: "Security" },
      ]}
      actionButton={{
        label: "Save Changes",
        onClick: handleSaveSettings,
        icon: <Save className="h-4 w-4" strokeWidth={1.5} />,
      }}
    >
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Security Score"
          value="92%"
          description="Overall security rating"
          icon={<Shield className="h-5 w-5" strokeWidth={1.5} />}
        />
        <StatsCard
          title="MFA Adoption"
          value="78%"
          description="Users with MFA enabled"
          icon={<Fingerprint className="h-5 w-5" strokeWidth={1.5} />}
        />
        <StatsCard
          title="Security Alerts"
          value="2"
          description="Active security issues"
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.5} />}
        />
        <StatsCard
          title="Last Security Test"
          value="2 days ago"
          description="All tests passed"
          icon={<CheckCircle className="h-5 w-5" strokeWidth={1.5} />}
        />
      </div>

      {/* Security Settings Form */}
      <div className="space-y-8">
        {/* Password Policy */}
        <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Key className="h-5 w-5 mr-2 text-zinc-700" strokeWidth={1.5} />
            <h2 className="text-lg font-medium text-zinc-900">
              Password Policy
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="8"
                max="32"
                value={settings.authentication.password_policy.min_length}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      password_policy: {
                        ...settings.authentication.password_policy,
                        min_length: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Password Expiry (Days)
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={settings.authentication.password_policy.expiry_days}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      password_policy: {
                        ...settings.authentication.password_policy,
                        expiry_days: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Set to 0 to disable password expiry
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Previous Passwords to Prevent Reuse
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={settings.authentication.password_policy.prevent_reuse}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      password_policy: {
                        ...settings.authentication.password_policy,
                        prevent_reuse: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-zinc-700 mb-2">
                Password Requirements
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      settings.authentication.password_policy.require_uppercase
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          password_policy: {
                            ...settings.authentication.password_policy,
                            require_uppercase: e.target.checked,
                          },
                        },
                      })
                    }
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <span className="ml-2 text-sm text-zinc-700">
                    Require uppercase letter
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      settings.authentication.password_policy.require_lowercase
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          password_policy: {
                            ...settings.authentication.password_policy,
                            require_lowercase: e.target.checked,
                          },
                        },
                      })
                    }
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <span className="ml-2 text-sm text-zinc-700">
                    Require lowercase letter
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      settings.authentication.password_policy.require_numbers
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          password_policy: {
                            ...settings.authentication.password_policy,
                            require_numbers: e.target.checked,
                          },
                        },
                      })
                    }
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <span className="ml-2 text-sm text-zinc-700">
                    Require number
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      settings.authentication.password_policy.require_symbols
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        authentication: {
                          ...settings.authentication,
                          password_policy: {
                            ...settings.authentication.password_policy,
                            require_symbols: e.target.checked,
                          },
                        },
                      })
                    }
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <span className="ml-2 text-sm text-zinc-700">
                    Require special character
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-zinc-700" strokeWidth={1.5} />
            <h2 className="text-lg font-medium text-zinc-900">
              Session Settings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Session Timeout (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={settings.authentication.session_timeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      session_timeout: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Maximum Concurrent Sessions
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.authentication.login_attempts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      login_attempts: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.authentication.mfa_enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      authentication: {
                        ...settings.authentication,
                        mfa_enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                />
                <span className="ml-2 text-sm text-zinc-700">
                  Enable Multi-Factor Authentication
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 mr-2 text-zinc-700" strokeWidth={1.5} />
            <h2 className="text-lg font-medium text-zinc-900">
              Access Control
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={settings.access_control.ip_restrictions}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      access_control: {
                        ...settings.access_control,
                        ip_restrictions: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                />
                <span className="ml-2 text-sm text-zinc-700">
                  Enable IP address restrictions
                </span>
              </label>

              {settings.access_control.ip_restrictions && (
                <div className="pl-6 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newIP}
                      onChange={(e) => setNewIP(e.target.value)}
                      placeholder="Enter IP address"
                      className="flex-1 border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    />
                    <button
                      onClick={addIP}
                      className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-2">
                    {settings.access_control.allowed_ips.length > 0 ? (
                      <div className="space-y-1">
                        <p className="text-sm text-zinc-500">
                          Allowed IP addresses:
                        </p>
                        {settings.access_control.allowed_ips.map((ip) => (
                          <div
                            key={ip}
                            className="flex items-center justify-between bg-zinc-50 px-3 py-2 rounded-md"
                          >
                            <span className="text-sm">{ip}</span>
                            <button
                              onClick={() => removeIP(ip)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No allowed IP addresses added. All IPs will be blocked.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={settings.access_control.geo_restrictions}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      access_control: {
                        ...settings.access_control,
                        geo_restrictions: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                />
                <span className="ml-2 flex items-center text-sm text-zinc-700">
                  <Globe className="h-4 w-4 mr-1" strokeWidth={1.5} />
                  Enable geographic restrictions
                </span>
              </label>

              {settings.access_control.geo_restrictions && (
                <div className="pl-6 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newBlockedCountry}
                      onChange={(e) => setNewBlockedCountry(e.target.value)}
                      placeholder="Enter country code (e.g., US)"
                      className="flex-1 border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    />
                    <button
                      onClick={addBlockedCountry}
                      className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800"
                    >
                      Block
                    </button>
                  </div>

                  <div className="mt-2">
                    {settings.access_control.blocked_countries.length > 0 ? (
                      <div className="space-y-1">
                        <p className="text-sm text-zinc-500">
                          Blocked countries:
                        </p>
                        {settings.access_control.blocked_countries.map(
                          (country) => (
                            <div
                              key={country}
                              className="flex items-center justify-between bg-zinc-50 px-3 py-2 rounded-md"
                            >
                              <span className="text-sm">{country}</span>
                              <button
                                onClick={() => removeBlockedCountry(country)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No countries blocked. Access allowed from all countries.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center">
                <Server className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Default Role for New Users
              </label>
              <select
                value={settings.access_control.default_role}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    access_control: {
                      ...settings.access_control,
                      default_role: e.target.value,
                    },
                  })
                }
                className="w-full border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value="user">User</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SecuritySettings;
