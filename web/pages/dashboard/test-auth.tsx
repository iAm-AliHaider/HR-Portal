import React from 'react';
import { useAuth } from '@/hooks/useAuth';

// Test 2B: Just useAuth hook without layout components
export default function DashboardTestAuth() {
  const { user, role, loading, error } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Testing useAuth Hook...</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>❌ useAuth Hook Error</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <div style={{ marginTop: '20px' }}>
          <p>The useAuth hook is causing the issue!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>✅ useAuth Hook Test</h1>
      <p>The useAuth hook is working properly!</p>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Auth Status:</h3>
        <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
        <p><strong>Role:</strong> {role || 'No role'}</p>
        <p><strong>Loading:</strong> {loading.toString()}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>If you see this, useAuth works. The issue is likely with Sidebar or Topbar components.</p>
        <a href="/dashboard/test-sidebar" style={{ color: 'blue', textDecoration: 'underline' }}>
          Next: Test Sidebar Component →
        </a>
      </div>
    </div>
  );
} 