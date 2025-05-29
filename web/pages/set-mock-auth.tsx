import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockAccounts } from '@/components/ui/MockAccountInfo';

export default function SetMockAuthPage() {
  const router = useRouter();
  const [currentAuth, setCurrentAuth] = useState<string | null>(null);

  useEffect(() => {
    // Check current authentication
    const mockEmail = localStorage.getItem('mockUserEmail');
    setCurrentAuth(mockEmail);
  }, []);

  const setMockUser = (email: string) => {
    localStorage.setItem('mockUserEmail', email);
    setCurrentAuth(email);
    
    // Redirect to jobs page to test
    setTimeout(() => {
      router.push('/jobs');
    }, 1000);
  };

  const clearAuth = () => {
    localStorage.removeItem('mockUserEmail');
    setCurrentAuth(null);
  };

  return (
    <>
      <Head>
        <title>Set Mock Authentication | HR Portal</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Mock Authentication Setup</h1>
            <p className="mt-2 text-gray-600">
              Set up mock authentication for testing the HR Portal
            </p>
            {currentAuth && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Currently authenticated as: <strong>{currentAuth}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Choose a Mock User:</h2>
            
            {mockAccounts.map((account) => (
              <Card key={account.email} className="hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{account.name}</h3>
                      <p className="text-sm text-gray-600">{account.email}</p>
                      <p className="text-sm text-gray-500">
                        {account.role} • {account.department} • {account.position}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setMockUser(account.email)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Use This User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <Button 
              onClick={clearAuth}
              variant="outline"
              className="w-full"
            >
              Clear Authentication
            </Button>
            
            <Button 
              onClick={() => router.push('/jobs')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Jobs Page (No Auth Required)
            </Button>
            
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Development Notes:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Jobs page is now publicly accessible (no auth required)</li>
              <li>• Other pages may require authentication</li>
              <li>• Mock users are set in localStorage for development</li>
              <li>• This page is for testing purposes only</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
} 