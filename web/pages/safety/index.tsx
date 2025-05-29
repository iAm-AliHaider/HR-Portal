import React, { useState, useEffect } from 'react';
import { useWorkplaceSafety } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  BarChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench as Tool,
  Clipboard,
  Plus,
  Calendar,
  Activity
} from 'lucide-react';
import { GetServerSideProps } from 'next';


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function WorkplaceSafetyPage() {
  const { 
    safetyData, 
    incidents, 
    safetyChecks, 
    equipmentInspections, 
    loading, 
    error 
  } = useWorkplaceSafety();
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('incidents');
  const { user, role } = useAuth();
  const isAdmin = role === 'admin' || role === 'manager' || role === 'safety_officer';

  // Set active tab based on URL query parameter
  useEffect(() => {
    if (router.query.tab) {
      const tab = router.query.tab as string;
      if (['incidents', 'checks', 'equipment'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [router.query.tab]);

  // Function to format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <ModernDashboardLayout title="Workplace Safety">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ModernDashboardLayout>
    );
  }
  
  if (error) {
    return (
      <ModernDashboardLayout title="Workplace Safety">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </ModernDashboardLayout>
    );
  }
  
  // Function to handle tab changes and update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push({
      pathname: router.pathname,
      query: { tab }
    }, undefined, { shallow: true });
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'resolved':
        case 'completed':
        case 'passed':
          return 'bg-green-100 text-green-800';
        case 'in progress':
        case 'scheduled':
          return 'bg-blue-100 text-blue-800';
        case 'under investigation':
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'failed':
        case 'canceled':
          return 'bg-red-100 text-red-800';
        case 'passed with concerns':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <Badge variant="outline" className={`${getStatusColor()} border-0`}>
        {status}
      </Badge>
    );
  };

  // Severity badge component
  const SeverityBadge = ({ severity }: { severity: string }) => {
    const getSeverityColor = () => {
      switch (severity.toLowerCase()) {
        case 'low':
          return 'bg-green-100 text-green-800';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800';
        case 'high':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <Badge variant="outline" className={`${getSeverityColor()} border-0`}>
        {severity}
      </Badge>
    );
  };
  
  return (
    <ModernDashboardLayout title="Workplace Safety" subtitle="Monitor and manage workplace safety incidents, checks, and equipment inspections">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('incidents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'incidents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => handleTabChange('checks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'checks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Safety Checks
          </button>
          <button
            onClick={() => handleTabChange('equipment')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'equipment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Equipment Inspections
          </button>
        </nav>
      </div>
      
      {/* Safety Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">
                {loading ? "..." : safetyData.statistics.incidentCount || 0}
              </div>
              <Badge variant="outline" className="ml-4 bg-yellow-100 text-yellow-800 border-0">
                {loading ? "..." : safetyData.statistics.openIncidents || 0} Open
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Safety Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">
                {loading ? "..." : safetyChecks?.length || 0}
              </div>
              <Badge variant="outline" className="ml-4 bg-blue-100 text-blue-800 border-0">
                {loading ? "..." : safetyData.statistics.upcomingChecks || 0} Upcoming
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Equipment Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Tool className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-2xl font-bold">
                {loading ? "..." : safetyData.statistics.equipmentIssues || 0}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {loading ? "..." : safetyData.statistics.inspectionCompliance || 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents" className="relative">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Incidents
            {!loading && incidents.filter(i => i.status !== 'Resolved').length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {incidents.filter(i => i.status !== 'Resolved').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="checks">
            <Clipboard className="mr-2 h-4 w-4" />
            Safety Checks
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Tool className="mr-2 h-4 w-4" />
            Equipment
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Incidents</CardTitle>
              <CardDescription>
                Review and manage workplace safety incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading incidents...</div>
              ) : incidents.length === 0 ? (
                <div className="text-center py-4">No incidents reported</div>
              ) : (
                <div className="divide-y">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{incident.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                        </div>
                        <StatusBadge status={incident.status} />
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <div className="mr-4">
                          <span className="font-medium">Date: </span>
                          {formatDate(incident.date)}
                        </div>
                        <div className="mr-4">
                          <span className="font-medium">Location: </span>
                          {incident.location}
                        </div>
                        <div className="mr-4">
                          <span className="font-medium">Reported by: </span>
                          {incident.reportedBy}
                        </div>
                        <div>
                          <span className="font-medium">Severity: </span>
                          <SeverityBadge severity={incident.severity} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="checks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Checks</CardTitle>
              <CardDescription>
                Schedule and track workplace safety inspections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading safety checks...</div>
              ) : safetyChecks.length === 0 ? (
                <div className="text-center py-4">No safety checks scheduled</div>
              ) : (
                <div className="divide-y">
                  {safetyChecks.map((check) => (
                    <div key={check.id} className="py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{check.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {check.location} • {check.frequency} check
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600 mr-4">
                            Due: {formatDate(check.dueDate)}
                          </span>
                          <StatusBadge status={check.status} />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Assigned to: </span>
                        {check.assignedTo}
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Check Items:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {check.checkItems.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-center text-sm">
                              <div className={`h-2 w-2 rounded-full mr-2 ${
                                item.status === 'Completed' ? 'bg-green-500' :
                                item.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-gray-300'
                              }`} />
                              {item.description}
                            </div>
                          ))}
                          {check.checkItems.length > 4 && (
                            <div className="text-sm text-blue-600">
                              +{check.checkItems.length - 4} more items
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Inspections</CardTitle>
              <CardDescription>
                Track equipment safety inspections and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading equipment inspections...</div>
              ) : equipmentInspections.length === 0 ? (
                <div className="text-center py-4">No equipment inspections found</div>
              ) : (
                <div className="divide-y">
                  {equipmentInspections.map((inspection) => (
                    <div key={inspection.id} className="py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{inspection.equipmentName}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {inspection.inspectionType} • {inspection.location}
                          </p>
                        </div>
                        <StatusBadge status={inspection.status} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mt-2">
                        <div>
                          <span className="font-medium">Last Inspection: </span>
                          {formatDate(inspection.lastInspection)}
                        </div>
                        <div>
                          <span className="font-medium">Next Due: </span>
                          {formatDate(inspection.nextDueDate)}
                        </div>
                        <div>
                          <span className="font-medium">Assigned to: </span>
                          {inspection.assignedTo}
                        </div>
                      </div>
                      {inspection.notes && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Notes: </span>
                          {inspection.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Analytics</CardTitle>
              <CardDescription>
                Insights and trends from safety data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart className="mx-auto h-12 w-12 opacity-30 mb-4" />
                <p>Analytics features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ModernDashboardLayout>
  );
} 
