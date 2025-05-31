import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import DebugLayout from './_layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Settings,
  Database,
  Shield,
  Mail,
  Globe
} from 'lucide-react';
import { validateProductionReadiness, getProductionConfig, isProduction } from '@/config/production';
import { checkDatabaseConnection } from '@/lib/supabase/client';

interface ProductionCheck {
  category: string;
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  icon: React.ReactNode;
}

export default function ProductionCheckPage() {
  const [checks, setChecks] = useState<ProductionCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<'pass' | 'warning' | 'fail'>('pass');

  // Run production readiness checks
  const runChecks = async () => {
    setLoading(true);
    const newChecks: ProductionCheck[] = [];

    try {
      // 1. Environment Configuration Check
      const readiness = validateProductionReadiness();
      
      newChecks.push({
        category: 'Configuration',
        name: 'Environment Variables',
        status: readiness.ready ? 'pass' : 'fail',
        message: readiness.ready 
          ? 'All required environment variables are set' 
          : `Issues found: ${readiness.issues.join(', ')}`,
        icon: <Settings className="h-5 w-5" />
      });

      // 2. Database Connection Check
      try {
        const dbCheck = await checkDatabaseConnection();
        newChecks.push({
          category: 'Database',
          name: 'Supabase Connection',
          status: dbCheck.success ? 'pass' : 'fail',
          message: dbCheck.success 
            ? `Connected successfully (${dbCheck.duration}ms)` 
            : `Connection failed: ${dbCheck.error}`,
          icon: <Database className="h-5 w-5" />
        });
      } catch (error) {
        newChecks.push({
          category: 'Database',
          name: 'Supabase Connection',
          status: 'fail',
          message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          icon: <Database className="h-5 w-5" />
        });
      }

      // 3. Production Environment Check
      newChecks.push({
        category: 'Environment',
        name: 'Production Mode',
        status: isProduction() ? 'pass' : 'warning',
        message: isProduction() 
          ? 'Running in production mode' 
          : 'Not running in production mode (NODE_ENV should be "production")',
        icon: <Globe className="h-5 w-5" />
      });

      // 4. Security Configuration Check
      const config = getProductionConfig();
      
      newChecks.push({
        category: 'Security',
        name: 'Authentication',
        status: config.features.enableAuth ? 'pass' : 'fail',
        message: config.features.enableAuth 
          ? 'Authentication is enabled' 
          : 'Authentication is disabled - this is not recommended for production',
        icon: <Shield className="h-5 w-5" />
      });

      newChecks.push({
        category: 'Security',
        name: 'Debug Features',
        status: (!config.features.enableMockData && !config.features.enableFallbackAuth) ? 'pass' : 'warning',
        message: (!config.features.enableMockData && !config.features.enableFallbackAuth)
          ? 'Debug features are properly disabled'
          : 'Some debug features are still enabled',
        icon: <Shield className="h-5 w-5" />
      });

      // 5. Email Configuration Check
      const emailConfigured = !config.email.supportEmail.includes('yourcompany.com') && 
                            !config.email.fromEmail.includes('yourcompany.com');
      
      newChecks.push({
        category: 'Configuration',
        name: 'Email Settings',
        status: emailConfigured ? 'pass' : 'warning',
        message: emailConfigured 
          ? 'Email configuration appears to be customized' 
          : 'Email configuration is using placeholder values',
        icon: <Mail className="h-5 w-5" />
      });

      // 6. App URL Check
      newChecks.push({
        category: 'Configuration',
        name: 'Application URL',
        status: !config.app.url.includes('localhost') ? 'pass' : 'warning',
        message: !config.app.url.includes('localhost')
          ? 'Application URL is set to production domain'
          : 'Application URL is still set to localhost',
        icon: <Globe className="h-5 w-5" />
      });

      setChecks(newChecks);

      // Determine overall status
      const hasFailures = newChecks.some(check => check.status === 'fail');
      const hasWarnings = newChecks.some(check => check.status === 'warning');
      
      if (hasFailures) {
        setOverallStatus('fail');
      } else if (hasWarnings) {
        setOverallStatus('warning');
      } else {
        setOverallStatus('pass');
      }

    } catch (error) {
      console.error('Error running production checks:', error);
      
      newChecks.push({
        category: 'System',
        name: 'Production Check',
        status: 'fail',
        message: `Failed to run production checks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        icon: <XCircle className="h-5 w-5" />
      });
      
      setChecks(newChecks);
      setOverallStatus('fail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runChecks();
  }, []);

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'fail':
        return 'destructive';
    }
  };

  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, ProductionCheck[]>);

  return (
    <DebugLayout>
      <PageLayout
        title="Production Readiness Check"
        description="Validate your application configuration for production deployment"
        breadcrumbs={[
          { label: 'Debug', href: '/debug' },
          { label: 'Production Check', href: '/debug/production-check' },
        ]}
      >
        <div className="space-y-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(overallStatus)}
                  Production Readiness Status
                </div>
                <Button onClick={runChecks} disabled={loading} size="sm">
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {loading ? 'Checking...' : 'Refresh'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Running production checks...</span>
                </div>
              ) : (
                <div className={`p-4 rounded-lg border ${
                  overallStatus === 'pass' ? 'border-green-200 bg-green-50' :
                  overallStatus === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <p className={
                    overallStatus === 'pass' ? 'text-green-800' :
                    overallStatus === 'warning' ? 'text-yellow-800' :
                    'text-red-800'
                  }>
                    {overallStatus === 'pass' && 'Your application is ready for production deployment!'}
                    {overallStatus === 'warning' && 'Your application has some configuration warnings that should be addressed.'}
                    {overallStatus === 'fail' && 'Your application has critical issues that must be fixed before production deployment.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Checks */}
          {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryChecks.map((check, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0 mt-1">
                        {check.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{check.name}</h4>
                          <Badge variant={getStatusColor(check.status) as any}>
                            {check.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{check.message}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusIcon(check.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Production Deployment Guidelines */}
          {overallStatus !== 'pass' && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">To prepare for production:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    <li>Set NODE_ENV=production in your environment</li>
                    <li>Configure proper Supabase credentials in your environment variables</li>
                    <li>Set NEXT_PUBLIC_ENABLE_MOCK_DATA=false</li>
                    <li>Set NEXT_PUBLIC_ENABLE_FALLBACK_AUTH=false</li>
                    <li>Set NEXT_PUBLIC_ENABLE_DEBUG_ROUTES=false</li>
                    <li>Configure your production domain in NEXT_PUBLIC_APP_URL</li>
                    <li>Update email configuration with your actual domain</li>
                    <li>Test database connectivity thoroughly</li>
                    <li>Review and update all security settings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PageLayout>
    </DebugLayout>
  );
} 