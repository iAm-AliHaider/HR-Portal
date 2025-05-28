import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Download, Calendar, AlertCircle, Check, DollarSign } from 'lucide-react';
import { GetServerSideProps } from 'next';

// Mock loan data
const LOAN_DATA = {
  'LN-2023-001': {
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
    totalInterest: 3827.00,
    loanStatus: 'Active',
    repaymentMethod: 'Salary Deduction',
  },
  'LN-2023-005': {
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
    totalInterest: 3130.32,
    loanStatus: 'Active',
    repaymentMethod: 'Salary Deduction',
  }
};

// Generate repayment schedule
const generateRepaymentSchedule = (loan) => {
  if (!loan) return [];
  
  const schedule = [];
  let remainingPrincipal = loan.amount;
  const monthlyRate = loan.interestRate / 100 / 12;
  const monthlyPayment = loan.monthlyPayment;
  const totalPayments = loan.totalPayments;
  
  const disbursementDate = new Date(loan.disbursementDate);
  const firstPaymentDate = new Date(disbursementDate);
  firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
  
  for (let i = 1; i <= totalPayments; i++) {
    const paymentDate = new Date(firstPaymentDate);
    paymentDate.setMonth(firstPaymentDate.getMonth() + (i - 1));
    
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingPrincipal -= principalPayment;
    
    // Ensure the last payment exactly zeroes out the loan
    if (i === totalPayments) {
      remainingPrincipal = 0;
    }
    
    // Status is determined by comparing to current date
    const today = new Date();
    let status = 'Upcoming';
    if (paymentDate < today) {
      status = 'Paid';
    } else if (
      paymentDate.getFullYear() === today.getFullYear() && 
      paymentDate.getMonth() === today.getMonth()
    ) {
      status = 'Due This Month';
    }
    
    // Some random payments marked as paid
    if (i <= 3 && loan.id === 'LN-2023-001') {
      status = 'Paid';
    }
    
    schedule.push({
      paymentNumber: i,
      paymentDate: paymentDate.toISOString().split('T')[0],
      principalPayment: parseFloat(principalPayment.toFixed(2)),
      interestPayment: parseFloat(interestPayment.toFixed(2)),
      totalPayment: parseFloat(monthlyPayment.toFixed(2)),
      remainingPrincipal: parseFloat(remainingPrincipal.toFixed(2)),
      status
    });
  }
  
  return schedule;
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function RepaymentSchedulePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [loan, setLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [showAllPayments, setShowAllPayments] = useState(false);
  
  // Fetch loan data when ID changes
  useEffect(() => {
    if (id) {
      // Mock API call - in real app, this would be a fetch request
      const loanData = LOAN_DATA[id as string];
      if (loanData) {
        setLoan(loanData);
        setSchedule(generateRepaymentSchedule(loanData));
      } else {
        // Handle case where loan doesn't exist
        console.error('Loan not found');
      }
    }
  }, [id]);

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

  // Get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Due This Month':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get icon for status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <Check className="w-4 h-4" />;
      case 'Due This Month':
        return <Calendar className="w-4 h-4" />;
      case 'Overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Filter payments to show
  const displaySchedule = showAllPayments 
    ? schedule 
    : schedule.filter(payment => 
        payment.status === 'Due This Month' || 
        payment.status === 'Overdue' || 
        schedule.indexOf(payment) < 5
      );

  // If loan data is not loaded yet
  if (!loan) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading repayment schedule...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Repayment Schedule: ${loan.id} | HR Portal`}</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push(`/loans/applications/${loan.id}`)}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Repayment Schedule</h1>
              <p className="text-gray-500">
                {loan.type} - {loan.id} ({loan.employeeName})
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Loan Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">Principal Amount</p>
                <p className="text-lg font-bold">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="text-lg font-bold">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Term</p>
                <p className="text-lg font-bold">{loan.term} years ({loan.totalPayments} payments)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Payment</p>
                <p className="text-lg font-bold">{formatCurrency(loan.monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Disbursement Date</p>
                <p className="text-lg font-bold">{formatDate(loan.disbursementDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Interest</p>
                <p className="text-lg font-bold">{formatCurrency(loan.totalInterest)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-bold">{formatCurrency(loan.amount + loan.totalInterest)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Repayment Method</p>
                <p className="text-lg font-bold">{loan.repaymentMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repayment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Repayment Schedule</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllPayments(!showAllPayments)}
              >
                {showAllPayments ? 'Show Less' : 'Show All Payments'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Payment Date</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Principal</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Interest</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Payment Amount</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Remaining Balance</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySchedule.map((payment) => (
                    <tr 
                      key={payment.paymentNumber} 
                      className={`border-b hover:bg-gray-50 ${
                        payment.status === 'Due This Month' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">{payment.paymentNumber}</td>
                      <td className="py-3 px-4">{formatDate(payment.paymentDate)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(payment.principalPayment)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(payment.interestPayment)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(payment.totalPayment)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(payment.remainingPrincipal)}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            <span className="mr-1">{getStatusIcon(payment.status)}</span>
                            {payment.status}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!showAllPayments && schedule.length > 5 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Showing {displaySchedule.length} of {schedule.length} payments
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Make Payment Button - Only show for current user's loans */}
        {loan.employeeName === user?.name && (
          <div className="flex justify-center">
            <Button 
              onClick={() => router.push(`/loans/make-payment/${loan.id}`)}
              className="flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Make a Payment
            </Button>
          </div>
        )}
      </div>
    </>
  );
} 