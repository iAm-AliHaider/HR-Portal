import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Test 3: DashboardLayout + Card components
export default function DashboardTestCards() {
  return (
    <DashboardLayout title="Test Cards" subtitle="Testing if Card components work">
      <div style={{ padding: '20px' }}>
        <h1>Dashboard with Cards - Step 3</h1>
        <p>✅ Card components loading works</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Testing Card Component:</h3>
          <Card style={{ maxWidth: '400px', margin: '10px 0' }}>
            <CardHeader>
              <CardTitle>Test Card</CardTitle>
              <CardDescription>Testing if Card components work properly</CardDescription>
            </CardHeader>
            <CardContent>
              <p>If you can see this card with proper styling, Card components are working!</p>
            </CardContent>
          </Card>
        </div>
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '5px' }}>
          <p><strong>Status:</strong> If cards display properly, the issue might be with icons or complex logic</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <a href="/dashboard/test-icons" style={{ color: 'blue', textDecoration: 'underline' }}>
            Next: Test Icons →
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
} 