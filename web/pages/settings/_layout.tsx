import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface SettingsLayoutWrapperProps {
  children: React.ReactNode;
}

export default function SettingsLayoutWrapper({ children }: SettingsLayoutWrapperProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
} 
