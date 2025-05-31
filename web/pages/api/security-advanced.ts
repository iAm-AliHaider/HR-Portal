import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../services/supabase";

// Advanced security interfaces
interface SecurityConfig {
  id: string;
  tenant_id: string;
  two_factor_auth: TwoFactorConfig;
  sso_config: SSOConfig;
  password_policy: PasswordPolicy;
  session_management: SessionManagement;
  access_control: AccessControl;
  threat_detection: ThreatDetection;
  audit_settings: AuditSettings;
  compliance: ComplianceSettings;
  created_at: string;
  updated_at: string;
}

interface TwoFactorConfig {
  enabled: boolean;
  methods: ("sms" | "email" | "authenticator" | "hardware_key")[];
  mandatory_roles: string[];
  backup_codes: boolean;
  grace_period_hours: number;
  recovery_options: RecoveryOption[];
}

interface RecoveryOption {
  type:
    | "backup_codes"
    | "recovery_email"
    | "security_questions"
    | "admin_override";
  enabled: boolean;
  config: Record<string, any>;
}

interface SSOConfig {
  enabled: boolean;
  providers: SSOProvider[];
  default_provider?: string;
  auto_provisioning: boolean;
  role_mapping: RoleMapping[];
  domain_restrictions: string[];
}

interface SSOProvider {
  id: string;
  name: string;
  type: "saml" | "oauth2" | "openid" | "ldap" | "azure_ad" | "google" | "okta";
  config: Record<string, any>;
  enabled: boolean;
  metadata_url?: string;
  certificate?: string;
}

interface RoleMapping {
  sso_attribute: string;
  sso_value: string;
  hr_role: string;
  department?: string;
}

interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
  prevent_reuse: number;
  max_age_days: number;
  complexity_score: number;
  dictionary_check: boolean;
  personal_info_check: boolean;
}

interface SessionManagement {
  max_sessions_per_user: number;
  idle_timeout_minutes: number;
  absolute_timeout_hours: number;
  concurrent_login_prevention: boolean;
  device_tracking: boolean;
  location_tracking: boolean;
  suspicious_activity_detection: boolean;
}

interface AccessControl {
  ip_whitelisting: IPWhitelist;
  geolocation_restrictions: GeolocationRestriction[];
  device_restrictions: DeviceRestriction;
  time_based_access: TimeBasedAccess[];
  api_rate_limiting: RateLimiting;
}

interface IPWhitelist {
  enabled: boolean;
  allowed_ranges: string[];
  admin_override: boolean;
  vpn_detection: boolean;
}

interface GeolocationRestriction {
  type: "allow" | "deny";
  countries: string[];
  regions?: string[];
  cities?: string[];
}

interface DeviceRestriction {
  require_trusted_devices: boolean;
  max_devices_per_user: number;
  device_fingerprinting: boolean;
  mobile_device_management: boolean;
}

interface TimeBasedAccess {
  role: string;
  allowed_hours: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
  timezone: string;
  days_of_week: number[]; // 0-6, Sunday-Saturday
}

interface RateLimiting {
  requests_per_minute: number;
  burst_limit: number;
  ip_based: boolean;
  user_based: boolean;
  endpoint_specific: EndpointLimit[];
}

interface EndpointLimit {
  endpoint: string;
  method: string;
  limit: number;
  window_minutes: number;
}

interface ThreatDetection {
  enabled: boolean;
  brute_force_protection: BruteForceProtection;
  anomaly_detection: AnomalyDetection;
  malware_scanning: MalwareScanning;
  data_loss_prevention: DataLossPrevention;
  real_time_monitoring: boolean;
}

interface BruteForceProtection {
  max_failed_attempts: number;
  lockout_duration_minutes: number;
  progressive_delays: boolean;
  account_lockout: boolean;
  ip_blocking: boolean;
}

interface AnomalyDetection {
  unusual_login_patterns: boolean;
  impossible_travel: boolean;
  device_anomalies: boolean;
  behavior_analysis: boolean;
  ml_based_detection: boolean;
}

interface MalwareScanning {
  file_uploads: boolean;
  email_attachments: boolean;
  real_time_scanning: boolean;
  quarantine_enabled: boolean;
}

interface DataLossPrevention {
  content_scanning: boolean;
  sensitive_data_detection: string[];
  export_restrictions: boolean;
  email_monitoring: boolean;
  clipboard_protection: boolean;
}

interface AuditSettings {
  log_all_actions: boolean;
  log_failed_attempts: boolean;
  log_admin_actions: boolean;
  log_data_access: boolean;
  retention_days: number;
  real_time_alerts: boolean;
  compliance_reporting: boolean;
}

interface ComplianceSettings {
  frameworks: ("gdpr" | "hipaa" | "sox" | "iso27001" | "pci_dss")[];
  data_classification: boolean;
  privacy_controls: boolean;
  encryption_requirements: EncryptionRequirements;
  audit_trail_integrity: boolean;
}

interface EncryptionRequirements {
  data_at_rest: "aes256" | "aes128";
  data_in_transit: "tls12" | "tls13";
  key_rotation_days: number;
  hardware_security_module: boolean;
}

interface SecurityAlert {
  id: string;
  type:
    | "threat_detected"
    | "policy_violation"
    | "anomaly"
    | "compliance_issue"
    | "system_breach";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  source: string;
  user_affected?: string;
  ip_address?: string;
  location?: string;
  device_info?: string;
  timestamp: string;
  status: "new" | "investigating" | "resolved" | "false_positive";
  actions_taken: string[];
  resolution_notes?: string;
}

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_email: string;
  action: string;
  resource: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  device_id?: string;
  success: boolean;
  details: Record<string, any>;
  risk_score: number;
}

// Mock security data
const mockSecurityConfig: SecurityConfig = {
  id: "sec_config_001",
  tenant_id: "tenant_main",
  two_factor_auth: {
    enabled: true,
    methods: ["authenticator", "sms", "email"],
    mandatory_roles: ["admin", "hr_manager", "finance_manager"],
    backup_codes: true,
    grace_period_hours: 24,
    recovery_options: [
      {
        type: "backup_codes",
        enabled: true,
        config: { codes_count: 10 },
      },
      {
        type: "recovery_email",
        enabled: true,
        config: { verification_required: true },
      },
    ],
  },
  sso_config: {
    enabled: true,
    providers: [
      {
        id: "azure_ad_001",
        name: "Company Azure AD",
        type: "azure_ad",
        enabled: true,
        config: {
          tenant_id: "azure-tenant-id",
          client_id: "azure-client-id",
          redirect_uri: "https://hr.company.com/auth/callback",
        },
      },
      {
        id: "google_001",
        name: "Google Workspace",
        type: "google",
        enabled: true,
        config: {
          client_id: "google-client-id",
          domain: "company.com",
        },
      },
    ],
    default_provider: "azure_ad_001",
    auto_provisioning: true,
    role_mapping: [
      {
        sso_attribute: "department",
        sso_value: "IT",
        hr_role: "admin",
      },
      {
        sso_attribute: "department",
        sso_value: "HR",
        hr_role: "hr_manager",
      },
    ],
    domain_restrictions: ["company.com", "subsidiary.com"],
  },
  password_policy: {
    min_length: 12,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special_chars: true,
    prevent_reuse: 12,
    max_age_days: 90,
    complexity_score: 80,
    dictionary_check: true,
    personal_info_check: true,
  },
  session_management: {
    max_sessions_per_user: 3,
    idle_timeout_minutes: 30,
    absolute_timeout_hours: 8,
    concurrent_login_prevention: true,
    device_tracking: true,
    location_tracking: true,
    suspicious_activity_detection: true,
  },
  access_control: {
    ip_whitelisting: {
      enabled: true,
      allowed_ranges: ["192.168.1.0/24", "10.0.0.0/8"],
      admin_override: true,
      vpn_detection: true,
    },
    geolocation_restrictions: [
      {
        type: "allow",
        countries: ["US", "CA", "GB"],
      },
    ],
    device_restrictions: {
      require_trusted_devices: true,
      max_devices_per_user: 5,
      device_fingerprinting: true,
      mobile_device_management: true,
    },
    time_based_access: [
      {
        role: "employee",
        allowed_hours: { start: "06:00", end: "22:00" },
        timezone: "America/New_York",
        days_of_week: [1, 2, 3, 4, 5],
      },
    ],
    api_rate_limiting: {
      requests_per_minute: 100,
      burst_limit: 200,
      ip_based: true,
      user_based: true,
      endpoint_specific: [
        {
          endpoint: "/api/auth/login",
          method: "POST",
          limit: 5,
          window_minutes: 15,
        },
      ],
    },
  },
  threat_detection: {
    enabled: true,
    brute_force_protection: {
      max_failed_attempts: 5,
      lockout_duration_minutes: 15,
      progressive_delays: true,
      account_lockout: true,
      ip_blocking: true,
    },
    anomaly_detection: {
      unusual_login_patterns: true,
      impossible_travel: true,
      device_anomalies: true,
      behavior_analysis: true,
      ml_based_detection: true,
    },
    malware_scanning: {
      file_uploads: true,
      email_attachments: true,
      real_time_scanning: true,
      quarantine_enabled: true,
    },
    data_loss_prevention: {
      content_scanning: true,
      sensitive_data_detection: ["ssn", "credit_card", "email", "phone"],
      export_restrictions: true,
      email_monitoring: true,
      clipboard_protection: true,
    },
    real_time_monitoring: true,
  },
  audit_settings: {
    log_all_actions: true,
    log_failed_attempts: true,
    log_admin_actions: true,
    log_data_access: true,
    retention_days: 2555, // 7 years
    real_time_alerts: true,
    compliance_reporting: true,
  },
  compliance: {
    frameworks: ["gdpr", "sox", "iso27001"],
    data_classification: true,
    privacy_controls: true,
    encryption_requirements: {
      data_at_rest: "aes256",
      data_in_transit: "tls13",
      key_rotation_days: 90,
      hardware_security_module: true,
    },
    audit_trail_integrity: true,
  },
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-20T14:30:00Z",
};

const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: "alert_001",
    type: "threat_detected",
    severity: "high",
    title: "Multiple Failed Login Attempts",
    description:
      "User account john.doe@company.com has 8 failed login attempts from IP 203.0.113.42 in the last 10 minutes",
    source: "Auth System",
    user_affected: "john.doe@company.com",
    ip_address: "203.0.113.42",
    location: "Unknown (VPN detected)",
    device_info: "Chrome 120.0 on Windows 10",
    timestamp: "2024-01-20T15:45:00Z",
    status: "investigating",
    actions_taken: [
      "Account temporarily locked",
      "IP address flagged for monitoring",
      "User notified via email",
    ],
  },
  {
    id: "alert_002",
    type: "anomaly",
    severity: "medium",
    title: "Unusual Login Location",
    description:
      "Employee Sarah Smith logged in from Singapore, which is unusual based on her normal login patterns (typically US East Coast)",
    source: "Anomaly Detection",
    user_affected: "sarah.smith@company.com",
    ip_address: "203.0.113.123",
    location: "Singapore",
    device_info: "Safari 17.0 on iPhone",
    timestamp: "2024-01-20T14:22:00Z",
    status: "new",
    actions_taken: [],
  },
  {
    id: "alert_003",
    type: "compliance_issue",
    severity: "critical",
    title: "Data Retention Policy Violation",
    description:
      "Employee records older than 7 years detected in the system, violating GDPR data retention requirements",
    source: "Compliance Monitor",
    timestamp: "2024-01-20T09:15:00Z",
    status: "new",
    actions_taken: [],
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req;

  try {
    switch (method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      case "PUT":
        return await handlePut(req, res);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Advanced Security API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  switch (type) {
    case "config":
      return await getSecurityConfig(req, res);
    case "alerts":
      return await getSecurityAlerts(req, res);
    case "audit-logs":
      return await getAuditLogs(req, res);
    case "threat-intelligence":
      return await getThreatIntelligence(req, res);
    case "compliance-status":
      return await getComplianceStatus(req, res);
    case "dashboard":
      return await getSecurityDashboard(req, res);
    default:
      return await getSecurityConfig(req, res);
  }
}

async function getSecurityConfig(req: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json(mockSecurityConfig);
  } catch (error) {
    console.error("Error fetching security config:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch security configuration" });
  }
}

async function getSecurityAlerts(req: NextApiRequest, res: NextApiResponse) {
  const { status, severity, limit } = req.query;

  try {
    let filteredAlerts = mockSecurityAlerts;

    if (status) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.status === status,
      );
    }
    if (severity) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.severity === severity,
      );
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    if (limit) {
      filteredAlerts = filteredAlerts.slice(0, parseInt(limit as string));
    }

    return res.status(200).json({
      alerts: filteredAlerts,
      summary: {
        total: filteredAlerts.length,
        critical: filteredAlerts.filter((a) => a.severity === "critical")
          .length,
        high: filteredAlerts.filter((a) => a.severity === "high").length,
        medium: filteredAlerts.filter((a) => a.severity === "medium").length,
        low: filteredAlerts.filter((a) => a.severity === "low").length,
        new: filteredAlerts.filter((a) => a.status === "new").length,
      },
    });
  } catch (error) {
    console.error("Error fetching security alerts:", error);
    return res.status(500).json({ error: "Failed to fetch security alerts" });
  }
}

async function getAuditLogs(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, action, start_date, end_date, limit } = req.query;

  try {
    // Mock audit logs
    const mockAuditLogs: SecurityAuditLog[] = [
      {
        id: "audit_001",
        timestamp: "2024-01-20T15:30:00Z",
        user_id: "user_001",
        user_email: "john.doe@company.com",
        action: "LOGIN",
        resource: "/auth/login",
        ip_address: "192.168.1.100",
        user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        location: "New York, US",
        device_id: "device_abc123",
        success: true,
        details: {
          method: "2fa",
          session_id: "session_xyz789",
        },
        risk_score: 2,
      },
      {
        id: "audit_002",
        timestamp: "2024-01-20T14:45:00Z",
        user_id: "user_002",
        user_email: "jane.smith@company.com",
        action: "DATA_ACCESS",
        resource: "/api/employees/123",
        ip_address: "10.0.0.50",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        location: "San Francisco, US",
        success: true,
        details: {
          employee_id: "123",
          data_type: "salary_information",
        },
        risk_score: 5,
      },
    ];

    let filteredLogs = mockAuditLogs;

    if (user_id) {
      filteredLogs = filteredLogs.filter((log) => log.user_id === user_id);
    }
    if (action) {
      filteredLogs = filteredLogs.filter((log) => log.action === action);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(0, parseInt(limit as string));
    }

    return res.status(200).json({
      logs: filteredLogs,
      summary: {
        total: filteredLogs.length,
        failed_attempts: filteredLogs.filter((log) => !log.success).length,
        high_risk: filteredLogs.filter((log) => log.risk_score >= 7).length,
        unique_users: new Set(filteredLogs.map((log) => log.user_id)).size,
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return res.status(500).json({ error: "Failed to fetch audit logs" });
  }
}

async function getThreatIntelligence(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const threatIntelligence = {
      threat_level: "medium",
      active_threats: 3,
      blocked_attacks: 127,
      monitored_ips: 15,
      threat_feeds: {
        malicious_ips: 1234567,
        malware_signatures: 890123,
        phishing_domains: 45678,
        last_updated: "2024-01-20T12:00:00Z",
      },
      recent_threats: [
        {
          type: "brute_force",
          count: 45,
          source_countries: ["RU", "CN", "KP"],
          trend: "increasing",
        },
        {
          type: "phishing",
          count: 23,
          target_domains: ["company.com"],
          trend: "stable",
        },
        {
          type: "malware",
          count: 8,
          file_types: [".pdf", ".docx"],
          trend: "decreasing",
        },
      ],
      recommendations: [
        "Enable additional 2FA for admin accounts",
        "Update phishing detection rules",
        "Review IP whitelist configurations",
        "Conduct security awareness training",
      ],
    };

    return res.status(200).json(threatIntelligence);
  } catch (error) {
    console.error("Error fetching threat intelligence:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch threat intelligence" });
  }
}

async function getComplianceStatus(req: NextApiRequest, res: NextApiResponse) {
  try {
    const complianceStatus = {
      overall_score: 87.3,
      frameworks: {
        gdpr: {
          score: 92.1,
          status: "compliant",
          issues: 2,
          last_audit: "2024-01-10T00:00:00Z",
        },
        sox: {
          score: 85.7,
          status: "mostly_compliant",
          issues: 5,
          last_audit: "2023-12-15T00:00:00Z",
        },
        iso27001: {
          score: 84.2,
          status: "mostly_compliant",
          issues: 7,
          last_audit: "2024-01-05T00:00:00Z",
        },
      },
      critical_issues: [
        {
          framework: "sox",
          issue: "Insufficient segregation of duties in payroll processing",
          severity: "high",
          due_date: "2024-02-15T00:00:00Z",
        },
        {
          framework: "gdpr",
          issue: "Data retention policy not enforced for inactive employees",
          severity: "medium",
          due_date: "2024-02-01T00:00:00Z",
        },
      ],
      upcoming_audits: [
        {
          framework: "gdpr",
          scheduled_date: "2024-07-15T00:00:00Z",
          auditor: "External Compliance Firm",
        },
      ],
    };

    return res.status(200).json(complianceStatus);
  } catch (error) {
    console.error("Error fetching compliance status:", error);
    return res.status(500).json({ error: "Failed to fetch compliance status" });
  }
}

async function getSecurityDashboard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dashboard = {
      overview: {
        security_score: 89.2,
        active_threats: 3,
        critical_alerts: 1,
        compliance_score: 87.3,
        last_updated: new Date().toISOString(),
      },
      metrics: {
        authentication: {
          total_logins: 1456,
          failed_attempts: 23,
          "2fa_enabled_users": 89.7,
          sso_adoption: 76.3,
        },
        threats: {
          blocked_attacks: 127,
          malware_detected: 3,
          phishing_attempts: 15,
          suspicious_activities: 8,
        },
        compliance: {
          policy_violations: 12,
          audit_findings: 7,
          encryption_coverage: 99.8,
          data_retention_compliance: 94.2,
        },
      },
      trends: {
        security_incidents: [
          { date: "2024-01-15", count: 2 },
          { date: "2024-01-16", count: 1 },
          { date: "2024-01-17", count: 4 },
          { date: "2024-01-18", count: 3 },
          { date: "2024-01-19", count: 2 },
          { date: "2024-01-20", count: 3 },
        ],
        login_success_rate: [
          { date: "2024-01-15", rate: 97.2 },
          { date: "2024-01-16", rate: 98.1 },
          { date: "2024-01-17", rate: 96.8 },
          { date: "2024-01-18", rate: 97.9 },
          { date: "2024-01-19", rate: 98.5 },
          { date: "2024-01-20", rate: 97.3 },
        ],
      },
      recommendations: [
        "Enable mandatory 2FA for all privileged accounts",
        "Update password policy to require 14+ characters",
        "Implement additional geolocation restrictions",
        "Schedule quarterly security awareness training",
      ],
    };

    return res.status(200).json(dashboard);
  } catch (error) {
    console.error("Error fetching security dashboard:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch security dashboard" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  switch (type) {
    case "enable-2fa":
      return await enable2FA(req, res);
    case "configure-sso":
      return await configureSSO(req, res);
    case "create-alert":
      return await createSecurityAlert(req, res);
    case "threat-scan":
      return await initiateThreatScan(req, res);
    default:
      return res.status(400).json({ error: "Invalid operation type" });
  }
}

async function enable2FA(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, method } = req.body;

  try {
    // Mock 2FA setup
    const setup = {
      user_id,
      method,
      setup_key: "JBSWY3DPEHPK3PXP", // Mock TOTP secret
      qr_code: "data:image/png;base64,mock_qr_code_data",
      backup_codes: [
        "backup-001",
        "backup-002",
        "backup-003",
        "backup-004",
        "backup-005",
      ],
      status: "pending_verification",
    };

    return res.status(200).json({
      message: "2FA setup initiated",
      setup,
    });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return res.status(500).json({ error: "Failed to enable 2FA" });
  }
}

async function configureSSO(req: NextApiRequest, res: NextApiResponse) {
  const { provider_config } = req.body;

  try {
    const ssoConfig = {
      id: `sso_${Date.now()}`,
      ...provider_config,
      status: "configured",
      test_connection: "success",
      created_at: new Date().toISOString(),
    };

    return res.status(201).json({
      message: "SSO provider configured successfully",
      config: ssoConfig,
    });
  } catch (error) {
    console.error("Error configuring SSO:", error);
    return res.status(500).json({ error: "Failed to configure SSO" });
  }
}

async function createSecurityAlert(req: NextApiRequest, res: NextApiResponse) {
  const { type, severity, title, description, source } = req.body;

  try {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}`,
      type,
      severity,
      title,
      description,
      source,
      timestamp: new Date().toISOString(),
      status: "new",
      actions_taken: [],
    };

    return res.status(201).json({
      message: "Security alert created",
      alert,
    });
  } catch (error) {
    console.error("Error creating security alert:", error);
    return res.status(500).json({ error: "Failed to create security alert" });
  }
}

async function initiateThreatScan(req: NextApiRequest, res: NextApiResponse) {
  const { scan_type, target } = req.body;

  try {
    const scanJob = {
      id: `scan_${Date.now()}`,
      type: scan_type,
      target,
      status: "running",
      started_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      progress: 0,
    };

    return res.status(202).json({
      message: "Threat scan initiated",
      scan_job: scanJob,
    });
  } catch (error) {
    console.error("Error initiating threat scan:", error);
    return res.status(500).json({ error: "Failed to initiate threat scan" });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query;

  switch (type) {
    case "alert":
      return await updateSecurityAlert(req, res);
    case "config":
      return await updateSecurityConfig(req, res);
    default:
      return res.status(400).json({ error: "Invalid operation type" });
  }
}

async function updateSecurityAlert(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { status, resolution_notes, actions_taken } = req.body;

  try {
    const updatedAlert = {
      status,
      resolution_notes,
      actions_taken: actions_taken || [],
      updated_at: new Date().toISOString(),
    };

    return res.status(200).json({
      message: "Security alert updated",
      alert: updatedAlert,
    });
  } catch (error) {
    console.error("Error updating security alert:", error);
    return res.status(500).json({ error: "Failed to update security alert" });
  }
}

async function updateSecurityConfig(req: NextApiRequest, res: NextApiResponse) {
  const updates = req.body;

  try {
    const updatedConfig = {
      ...mockSecurityConfig,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return res.status(200).json({
      message: "Security configuration updated",
      config: updatedConfig,
    });
  } catch (error) {
    console.error("Error updating security config:", error);
    return res
      .status(500)
      .json({ error: "Failed to update security configuration" });
  }
}
