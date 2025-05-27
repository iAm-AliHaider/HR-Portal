import React from 'react';
import Head from 'next/head';

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Test Page</title>
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Test Page Working</h1>
        <p className="text-gray-700 mb-4">
          If you can see this page, the basic routing is working correctly.
        </p>
        <div className="bg-yellow-100 p-4 rounded-md">
          <p className="text-sm text-yellow-800">
            Environment: {process.env.NODE_ENV}
          </p>
        </div>
      </div>
    </div>
  );
} 