import React from 'react';

// Simplified DashboardLayout without complex dependencies
function SimpleDashboardLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '20px' }}>
        {title && <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{title}</h1>}
        {subtitle && <p style={{ color: '#666', marginBottom: '20px' }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

// Test 2A: Simplified DashboardLayout without useAuth, Sidebar, Topbar
export default function DashboardTestLayoutSimple() {
  return (
    <SimpleDashboardLayout title="Simple Layout Test" subtitle="Testing without complex dependencies">
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>✅ Simplified Layout Works!</h2>
        <p>This means the issue is with one of these DashboardLayout dependencies:</p>
        <ul>
          <li>useAuth hook</li>
          <li>Sidebar component</li>
          <li>Topbar component</li>
          <li>Head component from Next.js</li>
        </ul>
        <div style={{ marginTop: '20px' }}>
          <a href="/dashboard/test-auth" style={{ color: 'blue', textDecoration: 'underline' }}>
            Next: Test useAuth Hook →
          </a>
        </div>
      </div>
    </SimpleDashboardLayout>
  );
} 