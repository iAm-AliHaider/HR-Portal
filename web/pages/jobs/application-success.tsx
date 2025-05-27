import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';
import { RequireRole } from '@/components/RequireRole';

export default function ApplicationSuccessPage() {
  const router = useRouter();
  
  // If the user navigates directly to this page (not from an application submission)
  // redirect them to the jobs page after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.query.fromApplication) {
        router.push('/jobs');
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <RequireRole allowed={['employee', 'manager', 'candidate']}>
      <Head>
        <title>Application Submitted | HR Portal</title>
        <meta name="description" content="Your job application has been submitted successfully" />
      </Head>
      
      <DashboardLayout title="Application Submitted" subtitle="Thank you for your application">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h2>
              
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Thank you for your application. Our team will review your information and get back to you soon.
                You'll receive an email confirmation with the details of your application.
              </p>
              
              <div className="bg-blue-50 p-4 rounded mb-6 max-w-2xl mx-auto text-left">
                <h3 className="font-medium text-blue-700 mb-2">What happens next?</h3>
                <ol className="list-decimal pl-5 text-blue-700 space-y-1">
                  <li>Our recruitment team will review your application (typically within 5-7 business days)</li>
                  <li>If your profile matches our requirements, we'll contact you to schedule an initial interview</li>
                  <li>You can check the status of your application in your candidate dashboard</li>
                </ol>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link href="/jobs">
                  <Button variant="outline">Browse More Jobs</Button>
                </Link>
                
                <Link href="/applications">
                  <Button className="bg-blue-600 hover:bg-blue-700">View My Applications</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
} 
