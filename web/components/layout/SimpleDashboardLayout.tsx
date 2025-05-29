import React from 'react';
import Head from 'next/head';

interface SimpleDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function SimpleDashboardLayout({ children, title, subtitle }: SimpleDashboardLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Head>
        <title>{title ? `${title} | HR Portal` : 'HR Portal'}</title>
        <meta name="description" content="HR Portal Dashboard" />
      </Head>
      
      {/* Simple Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #ddd', 
        padding: '16px 24px',
        marginBottom: '24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0',
            color: '#333'
          }}>
            HR Portal
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {(title || subtitle) && (
          <div style={{ marginBottom: '32px' }}>
            {title && (
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ 
                fontSize: '16px', 
                color: '#666',
                margin: '0'
              }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
      
      {/* Simple Navigation Links */}
      <div style={{ 
        position: 'fixed', 
        top: '80px', 
        left: '24px', 
        backgroundColor: 'white', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Quick Links</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="/dashboard" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>Dashboard</a>
          <a href="/people" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>People</a>
          <a href="/jobs" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>Jobs</a>
          <a href="/reports" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>Reports</a>
          <a href="/login" style={{ color: '#dc3545', textDecoration: 'none', fontSize: '14px' }}>Logout</a>
        </div>
      </div>
    </div>
  );
} 