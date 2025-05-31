import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface EmployeeInfoPanelProps {
  employee: {
    name?: string;
    email?: string;
    department?: string;
    manager?: string;
    phone?: string;
    location?: string;
    costCenter?: string;
    position?: string;
  };
}

const EmployeeInfoPanel: React.FC<EmployeeInfoPanelProps> = ({ employee }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Employee Information</CardTitle>
        <CardDescription>Auto-filled from your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Employee Name</label>
            <Input 
              value={employee.name || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Employee Email</label>
            <Input 
              value={employee.email || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <Input 
              value={employee.department || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Manager</label>
            <Input 
              value={employee.manager || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input 
              value={employee.phone || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input 
              value={employee.location || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          {employee.position && (
            <div>
              <label className="text-sm font-medium">Position</label>
              <Input 
                value={employee.position} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
          )}
          {employee.costCenter && (
            <div>
              <label className="text-sm font-medium">Cost Center</label>
              <Input 
                value={employee.costCenter} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeInfoPanel; 