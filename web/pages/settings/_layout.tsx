import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GetServerSideProps } from 'next';

interface SettingsLayoutWrapperProps {
  children: React.ReactNode;
}


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function SettingsLayoutWrapper({ children }: SettingsLayoutWrapperProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
} 
