import { useState } from 'react';
import { Organization, User } from '../../packages/types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/button';
import { RequireRole } from '../components/RequireRole';

const mockOrg: Organization = {
  id: 'org1',
  name: 'Acme Corp',
  domain: 'acme.com',
  created_at: '2024-01-01T10:00:00Z',
};

const mockUsers: User[] = [
  { id: 'u1', org_id: 'org1', email: 'alice@acme.com', full_name: 'Alice Smith', role: 'admin', status: 'active', created_at: '2024-01-01T10:00:00Z' },
  { id: 'u2', org_id: 'org1', email: 'bob@acme.com', full_name: 'Bob Lee', role: 'employee', status: 'active', created_at: '2024-01-02T10:00:00Z' },
  { id: 'u3', org_id: 'org1', email: 'carol@acme.com', full_name: 'Carol Jones', role: 'manager', status: 'inactive', created_at: '2024-01-03T10:00:00Z' },
];

const mockBilling = {
  plan: 'Pro',
  usage: '120/200 employees',
  renewal: '2024-12-31',
  paymentMethod: 'Visa **** 1234',
};

const mockSaaS = {
  customDomain: 'hr.acme.com',
  featureToggles: {
    onboarding: true,
    payroll: false,
    surveys: true,
  },
  tenantSettings: {
    theme: 'light',
    notifications: true,
  },
};

const tabs = [
  { key: 'org', label: 'Organization' },
  { key: 'users', label: 'Users' },
  { key: 'billing', label: 'Billing' },
  { key: 'saas', label: 'SaaS Controls' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('org');

  return (
    <RequireRole allowed={['admin']}>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <div className="flex gap-4 mb-8">
          {tabs.map((t) => (
            <Button key={t.key} variant={tab === t.key ? 'default' : 'outline'} onClick={() => setTab(t.key)}>{t.label}</Button>
          ))}
        </div>
        {tab === 'org' && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Organization Info</h2>
            <div className="mb-2">Name: <span className="font-medium">{mockOrg.name}</span></div>
            <div className="mb-2">Domain: <span className="font-mono">{mockOrg.domain}</span></div>
            <div className="mb-2">Created: {new Date(mockOrg.created_at).toLocaleDateString()}</div>
            <Button variant="outline">Edit Organization</Button>
          </Card>
        )}
        {tab === 'users' && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <Button variant="default" className="mb-4">Invite User</Button>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1 text-left">Name</th>
                    <th className="px-2 py-1 text-left">Email</th>
                    <th className="px-2 py-1 text-left">Role</th>
                    <th className="px-2 py-1 text-left">Status</th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-2 py-1">{user.full_name}</td>
                      <td className="px-2 py-1">{user.email}</td>
                      <td className="px-2 py-1">{user.role}</td>
                      <td className="px-2 py-1">{user.status}</td>
                      <td className="px-2 py-1">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Deactivate</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        {tab === 'billing' && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Billing</h2>
            <div className="mb-2">Current Plan: <span className="font-medium">{mockBilling.plan}</span></div>
            <div className="mb-2">Usage: {mockBilling.usage}</div>
            <div className="mb-2">Renewal: {mockBilling.renewal}</div>
            <div className="mb-2">Payment Method: {mockBilling.paymentMethod}</div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline">Upgrade</Button>
              <Button variant="outline">Downgrade</Button>
              <Button variant="outline">Change Payment Method</Button>
            </div>
          </Card>
        )}
        {tab === 'saas' && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-2">SaaS Controls</h2>
            <div className="mb-2">Custom Domain: <span className="font-mono">{mockSaaS.customDomain}</span></div>
            <div className="mb-2">Tenant Settings:</div>
            <ul className="ml-4 mb-2 text-sm">
              <li>Theme: {mockSaaS.tenantSettings.theme}</li>
              <li>Notifications: {mockSaaS.tenantSettings.notifications ? 'On' : 'Off'}</li>
            </ul>
            <div className="mb-2">Feature Toggles:</div>
            <ul className="ml-4 text-sm">
              {Object.entries(mockSaaS.featureToggles).map(([feature, enabled]) => (
                <li key={feature}>{feature}: <span className={enabled ? 'text-green-600' : 'text-red-600'}>{enabled ? 'Enabled' : 'Disabled'}</span></li>
              ))}
            </ul>
            <Button variant="outline" className="mt-2">Edit SaaS Settings</Button>
          </Card>
        )}
      </div>
    </RequireRole>
  );
} 
