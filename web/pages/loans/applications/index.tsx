import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  CreditCard, 
  FileText, 
  Filter, 
  Search, 
  ExternalLink,
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Eye
} from 'lucide-react';
import { GetServerSideProps } from 'next';

// Mock data for loan applications
const mockApplications = [
  {
    id: 'LN-2023-001',
    loanType: 'Personal Loan',
    amount: 25000,
    term: '2 years',
    purpose: 'Home renovation',
    applicationDate: '2023-11-15',
    status: 'Approved',
    approvedAmount: 25000,
    interestRate: '8.5%',
    nextStep: 'Disbursement scheduled for Nov 20, 2023'
  },
  {
    id: 'LN-2023-012',
    loanType: 'Education Loan',
    amount: 75000,
    term: '5 years',
    purpose: 'Master\'s degree program',
    applicationDate: '2023-11-10',
    status: 'Under Review',
    approvedAmount: null,
    interestRate: null,
    nextStep: 'Awaiting document verification'
  },
  {
    id: 'LN-2023-018',
    loanType: 'Emergency Loan',
    amount: 15000,
    term: '1 year',
    purpose: 'Medical expenses',
    applicationDate: '2023-11-08',
    status: 'Additional Documents Required',
    approvedAmount: null,
    interestRate: null,
    nextStep: 'Upload medical bills and insurance documents'
  },
  {
    id: 'LN-2023-023',
    loanType: 'Home Loan',
    amount: 2500000,
    term: '15 years',
    purpose: 'Home purchase',
    applicationDate: '2023-11-01',
    status: 'Pending Approval',
    approvedAmount: null,
    interestRate: null,
    nextStep: 'Application is with the loan committee'
  },
  {
    id: 'LN-2023-007',
    loanType: 'Personal Loan',
    amount: 30000,
    term: '3 years',
    purpose: 'Debt consolidation',
    applicationDate: '2023-10-28',
    status: 'Rejected',
    approvedAmount: null,
    interestRate: null,
    nextStep: 'Contact HR for details'
  }
];


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function LoanApplicationsPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [applications, setApplications] = useState(mockApplications);
  
  // Function to view application details
  const handleViewApplication = (id: string) => {
    router.push(`/loans/applications/${id}`);
  };
  
  // Filter applications based on search term and status filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Under Review':
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case 'Additional Documents Required':
        return <Badge className="bg-yellow-100 text-yellow-800">Documents Required</Badge>;
      case 'Pending Approval':
        return <Badge className="bg-purple-100 text-purple-800">Pending Approval</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  return (
    <>
      <Head>
        <title>Loan Applications | HR Portal</title>
        <meta name="description" content="View and manage your loan applications" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
            <p className="text-gray-600 mt-1">View and manage your loan applications</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Additional Documents Required">Documents Required</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <Button
              onClick={() => router.push('/loans/apply')}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              New Application
            </Button>
          </div>
        </div>
        
        {/* Applications List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Step
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {application.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.loanType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{application.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.applicationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {application.nextStep}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewApplication(application.id)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No loan applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Ensure you have all required documents ready when applying for a loan, including proof of income, identity verification, and purpose-specific documentation.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                    View documentation requirements
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Application Tips</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Be specific about your loan purpose, provide accurate financial information, and ensure all documents are clear and up-to-date to speed up the approval process.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                    View application guidelines
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Processing Time</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Standard loans typically take 3-5 business days for approval. Emergency loans may be processed within 24 hours. Home loans can take up to 2 weeks for complete processing.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                    Learn more about timelines
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 
