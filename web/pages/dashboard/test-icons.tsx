import React from 'react';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Briefcase,
  BarChart3,
  CalendarDays,
} from 'lucide-react';

// Test 4: DashboardLayout + Cards + Lucide Icons
export default function DashboardTestIcons() {
  return (
    <ModernDashboardLayout title="Test Icons" subtitle="Testing if Lucide icons work">
      <div style={{ padding: '20px' }}>
        <h1>Dashboard with Icons - Step 4</h1>
        <p>✅ Lucide icons loading works</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Testing Icons:</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0' }}>
            <Users className="h-6 w-6 text-blue-600" />
            <span>Users Icon</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0' }}>
            <Briefcase className="h-6 w-6 text-green-600" />
            <span>Briefcase Icon</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0' }}>
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span>BarChart Icon</span>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Testing Card with Icon:</h3>
          <Card style={{ maxWidth: '400px', margin: '10px 0' }}>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle>Total Employees</CardTitle>
                <CardDescription>Testing card with icon</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>156</p>
            </CardContent>
          </Card>
        </div>
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #dc3545', borderRadius: '5px' }}>
          <p><strong>Critical Test:</strong> If icons display properly, the issue is likely with the full component structure or imports</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <a href="/dashboard" style={{ color: 'blue', textDecoration: 'underline' }}>
            Try Main Dashboard Again →
          </a>
        </div>
      </div>
    </ModernDashboardLayout>
  );
} 