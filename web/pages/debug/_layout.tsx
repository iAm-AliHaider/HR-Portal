import React from 'react';
import { useRouter } from 'next/router';
import DebugSidebar from '@/components/ui/DebugSidebar';
import Topbar from '@/components/ui/Topbar';

interface DebugLayoutProps {
  children: React.ReactNode;
}

export default function DebugLayout({ children }: DebugLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DebugSidebar 
        isMobile={false} 
        onClose={() => setMobileMenuOpen(false)}
      />
      
      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <DebugSidebar 
          isMobile={true} 
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <Topbar 
          theme="light" 
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 