import React from 'react';

export default function DashboardSimple() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Dashboard</h1>
      <p>This is a simplified dashboard without complex components.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Total Employees</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>156</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Open Positions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>12</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Pending Approvals</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>8</p>
        </div>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Quick Links</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <a href="/people" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            People
          </a>
          <a href="/jobs" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Jobs
          </a>
          <a href="/reports" style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '5px' }}>
            Reports
          </a>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
        <p><strong>Note:</strong> This is a simplified dashboard for testing. If this loads but /dashboard doesn't, the issue is with the main dashboard component.</p>
      </div>
    </div>
  );
} 