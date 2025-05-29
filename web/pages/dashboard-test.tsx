import React from 'react';

export default function DashboardTest() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Dashboard Test Page</h1>
      <p>If you can see this, the routing system is working.</p>
      <p>The issue might be with the specific dashboard component.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Test Results:</h3>
        <p>✅ Routing: Working</p>
        <p>✅ Component Loading: Working</p>
        <p>✅ Page Rendering: Working</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a href="/dashboard" style={{ color: 'blue', textDecoration: 'underline' }}>
          Try accessing main dashboard
        </a>
      </div>
    </div>
  );
} 