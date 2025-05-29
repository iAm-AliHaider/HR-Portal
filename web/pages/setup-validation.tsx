import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import SimpleDashboardLayout from '@/components/layout/SimpleDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface ValidationResult {
  component: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface SetupValidation {
  overall: 'success' | 'warning' | 'error';
  results: ValidationResult[];
  summary: {
    total: number;
    success: number;
    warnings: number;
    errors: number;
  };
}

export default function SetupValidationPage() {
  const [validation, setValidation] = useState<SetupValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before running validation
  useEffect(() => {
    setIsClient(true);
  }, []);

  const runValidation = async () => {
    if (!isClient) return;
    
    setIsValidating(true);
    try {
      // Dynamic import to avoid build-time issues
      const { validateHRPortalSetup, SetupValidator } = await import('@/lib/validateSetup');
      const result = await validateHRPortalSetup();
      setValidation(result);
      SetupValidator.printResults(result);
    } catch (error) {
      console.error('Validation failed:', error);
      // Create a fallback error result
      setValidation({
        overall: 'error',
        results: [{
          component: 'Validation System',
          status: 'error',
          message: 'Failed to run validation',
          details: error instanceof Error ? error.message : 'Unknown error'
        }],
        summary: { total: 1, success: 0, warnings: 0, errors: 1 }
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      runValidation();
    }
  }, [isClient]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <SimpleDashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="mt-4 text-gray-600">Loading validation system...</p>
            </div>
          </div>
        </div>
      </SimpleDashboardLayout>
    );
  }

  return (
    <SimpleDashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Setup Validation</h1>
            <p className="text-gray-600 mt-2">
              Validate your HR Portal configuration and ensure all components are properly set up.
            </p>
          </div>
          <Button 
            onClick={runValidation} 
            disabled={isValidating}
            className="flex items-center gap-2"
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isValidating ? 'Validating...' : 'Run Validation'}
          </Button>
        </div>

        {/* Overall Status */}
        {validation && (
          <Card className={`border-l-4 ${
            validation.overall === 'success' ? 'border-l-green-500 bg-green-50' :
            validation.overall === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
            'border-l-red-500 bg-red-50'
          }`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getStatusIcon(validation.overall)}
                <CardTitle className="text-xl">
                  Overall Status: {getStatusBadge(validation.overall)}
                </CardTitle>
              </div>
              <CardDescription>
                {validation.summary.success} successful, {validation.summary.warnings} warnings, {validation.summary.errors} errors
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Validation Results */}
        {validation && (
          <div className="grid gap-4">
            {validation.results.map((result, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <CardTitle className="text-lg">{result.component}</CardTitle>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 mb-2">{result.message}</p>
                  {result.details && (
                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                      {result.details}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isValidating && !validation && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="mt-4 text-gray-600">Running validation checks...</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to complete your HR Portal setup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">✅ 1. Database Setup</h4>
              <p className="text-sm text-gray-600 ml-4">
                Create a Supabase project and run the schema from <code>web/supabase/schema.sql</code>
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-700">⚠️ 2. Environment Variables</h4>
              <p className="text-sm text-gray-600 ml-4">
                Create <code>.env.local</code> file with your Supabase, email, and other configuration
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">📧 3. Email Service</h4>
              <p className="text-sm text-gray-600 ml-4">
                Configure SMTP settings for email notifications (Gmail app password recommended for testing)
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-700">📁 4. File Storage</h4>
              <p className="text-sm text-gray-600 ml-4">
                Create storage buckets in Supabase for documents, avatars, and file uploads
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                📖 For detailed setup instructions, see <code>PRODUCTION_SETUP_GUIDE.md</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Development Mode Notice */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">ℹ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Development Mode</h4>
                  <p className="text-sm text-blue-800">
                    You're currently running in development mode. The application will use mock data and simulate 
                    external services like email and file storage. To test with real services, configure your 
                    environment variables and switch to production mode.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SimpleDashboardLayout>
  );
}

// Prevent this page from running during build
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  };
}; 