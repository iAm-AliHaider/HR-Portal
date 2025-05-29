import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Test 2: Just DashboardLayout without complex components
export default function DashboardTestLayout() {
  return (
    <DashboardLayout title="Test Dashboard" subtitle="Testing if DashboardLayout works">
      <div style={{ padding: '20px' }}>
        <h1>Dashboard with Layout - Step 2</h1>
        <p>✅ DashboardLayout component loading works</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Layout Components Tested:</h3>
          <ul>
            <li>✅ DashboardLayout wrapper</li>
            <li>✅ Authentication (useAuth hook)</li>
            <li>✅ Sidebar and Topbar</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '5px' }}>
          <p><strong>Status:</strong> If you see this with sidebar/topbar, DashboardLayout is working!</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <a href="/dashboard/test-cards" style={{ color: 'blue', textDecoration: 'underline' }}>
            Next: Test Card Components →
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
} 