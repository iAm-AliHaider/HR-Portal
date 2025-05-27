import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Mock repayment data
const REPAYMENT_DATA = [
  {
    id: 'LN-2023-001',
    employeeName: 'Alex Johnson',
    employeeId: 'EMP-1024',
    type: 'Personal Loan',
    amount: 25000,
    term: 3, // years
    interestRate: 9.5,
    monthlyPayment: 800.75,
    disbursementDate: '2023-11-20',
    totalPayments: 36,
    remainingPayments: 33,
    nextPaymentDate: '2024-03-20',
    nextPaymentAmount: 800.75,
    loanStatus: 'Active',
    repaymentMethod: 'Salary Deduction',
  },
  {
    id: 'LN-2023-005',
    employeeName: 'Casey Brown',
    employeeId: 'EMP-1587',
    type: 'Personal Loan',
    amount: 30000,
    term: 2, // years
    interestRate: 10,
    monthlyPayment: 1380.43,
    disbursementDate: '2023-11-10',
    totalPayments: 24,
    remainingPayments: 21,
    nextPaymentDate: '2024-03-10',
    nextPaymentAmount: 1380.43,
    loanStatus: 'Active',
    repaymentMethod: 'Salary Deduction',
  },
  {
    id: 'LN-2023-012',
    employeeName: 'Jamie Smith',
    employeeId: 'EMP-2156',
    type: 'Education Loan',
    amount: 75000,
    term: 5, // years
    interestRate: 8.5,
    monthlyPayment: 1541.65,
    disbursementDate: '2023-12-05',
    totalPayments: 60,
    remainingPayments: 58,
    nextPaymentDate: '2024-03-05',
    nextPaymentAmount: 1541.65,
    loanStatus: 'Active',
    repaymentMethod: 'Bank Transfer',
  },
  {
    id: 'LN-2023-018',
    employeeName: 'Taylor Wilson',
    employeeId: 'EMP-3201',
    type: 'Emergency Loan',
    amount: 15000,
    term: 1, // year
    interestRate: 7.5,
    monthlyPayment: 1293.98,
    disbursementDate: '2023-12-15',
    totalPayments: 12,
    remainingPayments: 10,
    nextPaymentDate: '2024-03-15',
    nextPaymentAmount: 1293.98,
    loanStatus: 'Active',
    repaymentMethod: 'Salary Deduction',
  }
];

export default function RepaymentScheduleListPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [repayments, setRepayments] = useState(REPAYMENT_DATA);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Filter repayments based on search term
  const filteredRepayments = repayments.filter(repayment => {
    const matchesSearch = searchTerm === '' || 
      repayment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repayment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repayment.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repayment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  return (
    <>
      <Head>
        <title>Loan Repayment Schedules | HR Portal</title>
        <meta name="description" content="View and manage loan repayment schedules" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Repayment Schedules</h1>
            <p className="text-gray-600 mt-1">View and manage loan repayment schedules</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search repayments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button
              onClick={() => router.push('/loans/applications')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Applications
            </Button>
          </div>
        </div>
        
        {/* Repayments List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRepayments.length > 0 ? (
                  filteredRepayments.map((repayment) => (
                    <tr key={repayment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {repayment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p className="font-medium">{repayment.employeeName}</p>
                          <p className="text-xs text-gray-500">{repayment.employeeId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {repayment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(repayment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(repayment.monthlyPayment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p>{formatDate(repayment.nextPaymentDate)}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(repayment.nextPaymentAmount)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(repayment.loanStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/loans/repayment-schedule/${repayment.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Schedule
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No repayment schedules found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Payment Schedule</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View your complete loan repayment schedule including principal and interest breakdown for each payment. 
                    Set up reminders for upcoming payments to avoid overdue penalties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Early Repayment</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You can make additional payments or pay off your loan early without any prepayment penalties. 
                    Contact the HR department to discuss early repayment options.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 