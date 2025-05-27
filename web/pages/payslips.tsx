import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  ChevronDown, 
  Search,
  Filter,
  Printer,
  Mail,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  CreditCard,
  BarChart,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Mock data for payslips
const mockPayslips = [
  { 
    id: 'PAY-2023-12',
    period: 'December 2023',
    issueDate: '2023-12-28',
    status: 'Available',
    earnings: {
      basic: 4200,
      overtime: 350,
      bonus: 0,
      allowances: 450,
      total: 5000
    },
    deductions: {
      tax: 750,
      pension: 210,
      insurance: 150,
      other: 0,
      total: 1110
    },
    netPay: 3890,
    paymentDate: '2023-12-29',
    paymentMethod: 'Bank Transfer',
    corrections: [],
    yearToDate: {
      earnings: 58000,
      tax: 8700,
      pension: 2320
    }
  },
  { 
    id: 'PAY-2023-11',
    period: 'November 2023',
    issueDate: '2023-11-28',
    status: 'Available',
    earnings: {
      basic: 4200,
      overtime: 0,
      bonus: 0,
      allowances: 450,
      total: 4650
    },
    deductions: {
      tax: 700,
      pension: 210,
      insurance: 150,
      other: 0,
      total: 1060
    },
    netPay: 3590,
    paymentDate: '2023-11-29',
    paymentMethod: 'Bank Transfer',
    corrections: [
      {
        id: 'COR-2023-001',
        date: '2023-12-05',
        type: 'Tax Adjustment',
        status: 'Resolved',
        requestedBy: 'Alex Johnson',
        description: 'Tax deduction appears to be higher than standard rate.',
        resolution: 'Confirmed tax rate is correct based on current tax bracket.'
      }
    ],
    yearToDate: {
      earnings: 53000,
      tax: 7950,
      pension: 2110
    }
  },
  { 
    id: 'PAY-2023-10',
    period: 'October 2023',
    issueDate: '2023-10-28',
    status: 'Available',
    earnings: {
      basic: 4200,
      overtime: 175,
      bonus: 1000,
      allowances: 450,
      total: 5825
    },
    deductions: {
      tax: 875,
      pension: 210,
      insurance: 150,
      other: 0,
      total: 1235
    },
    netPay: 4590,
    paymentDate: '2023-10-29',
    paymentMethod: 'Bank Transfer',
    corrections: [],
    yearToDate: {
      earnings: 48350,
      tax: 7250,
      pension: 1900
    }
  },
  { 
    id: 'PAY-2023-09',
    period: 'September 2023',
    issueDate: '2023-09-28',
    status: 'Available',
    earnings: {
      basic: 4200,
      overtime: 0,
      bonus: 0,
      allowances: 450,
      total: 4650
    },
    deductions: {
      tax: 700,
      pension: 210,
      insurance: 150,
      other: 0,
      total: 1060
    },
    netPay: 3590,
    paymentDate: '2023-09-29',
    paymentMethod: 'Bank Transfer',
    corrections: [
      {
        id: 'COR-2023-002',
        date: '2023-10-02',
        type: 'Missing Overtime',
        status: 'Resolved',
        requestedBy: 'Alex Johnson',
        description: 'Overtime hours from September 15-16 not included.',
        resolution: 'Adjustment made in October payslip.'
      }
    ],
    yearToDate: {
      earnings: 42525,
      tax: 6375,
      pension: 1690
    }
  },
  { 
    id: 'PAY-2023-08',
    period: 'August 2023',
    issueDate: '2023-08-28',
    status: 'Available',
    earnings: {
      basic: 4200,
      overtime: 525,
      bonus: 0,
      allowances: 450,
      total: 5175
    },
    deductions: {
      tax: 775,
      pension: 210,
      insurance: 150,
      other: 0,
      total: 1135
    },
    netPay: 4040,
    paymentDate: '2023-08-29',
    paymentMethod: 'Bank Transfer',
    corrections: [],
    yearToDate: {
      earnings: 37875,
      tax: 5675,
      pension: 1480
    }
  },
  { 
    id: 'PAY-2023-07',
    period: 'July 2023',
    issueDate: '2023-07-28',
    status: 'Available',
    earnings: {
      basic: 4200,
      overtime: 0,
      bonus: 0,
      allowances: 450,
      total: 4650
    },
    deductions: {
      tax: 700,
      pension: 210,
      insurance: 150,
      other: 0,
      total: 1060
    },
    netPay: 3590,
    paymentDate: '2023-07-29',
    paymentMethod: 'Bank Transfer',
    corrections: [],
    yearToDate: {
      earnings: 32700,
      tax: 4900,
      pension: 1270
    }
  }
];

// Available years for filtering
const availableYears = ['2023', '2022', '2021'];

export default function PayslipsPage() {
  const [payslips, setPayslips] = useState(mockPayslips);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('2023');
  const [newCorrectionRequest, setNewCorrectionRequest] = useState('');
  
  // Filter payslips by year and search query
  const filteredPayslips = payslips.filter(payslip => {
    const matchesYear = payslip.period.includes(filterYear);
    const matchesSearch = 
      searchQuery === '' ||
      payslip.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payslip.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesYear && matchesSearch;
  });

  // Handle correction request submission
  const handleCorrectionRequest = () => {
    if (!newCorrectionRequest.trim() || !selectedPayslip) return;
    
    const today = new Date().toISOString().split('T')[0];
    const correctionId = `COR-${today.split('-')[0]}-${(Math.floor(Math.random() * 900) + 100)}`;
    
    const updatedPayslips = payslips.map(p => {
      if (p.id === selectedPayslip.id) {
        return {
          ...p,
          corrections: [
            ...p.corrections,
            {
              id: correctionId,
              date: today,
              type: 'Correction Request',
              status: 'Pending',
              requestedBy: 'Alex Johnson',
              description: newCorrectionRequest,
              resolution: null
            }
          ]
        };
      }
      return p;
    });
    
    setPayslips(updatedPayslips);
    // Update the selected payslip to show the new correction
    setSelectedPayslip(updatedPayslips.find(p => p.id === selectedPayslip.id));
    setNewCorrectionRequest('');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
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

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Get correction status badge
  const getCorrectionStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Payslips" subtitle="View and manage your payslips">
      <Head>
        <title>Payslips | HR Portal</title>
        <meta name="description" content="View and download your payslips" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="container px-4 sm:px-6 mx-auto py-6 space-y-6 max-w-full lg:max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payslips</h1>
            <p className="text-gray-600">View and download your salary statements</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search payslips..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Earnings Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Earnings Summary ({filterYear})</CardTitle>
            <CardDescription>Overview of your earnings and deductions for the selected year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(filteredPayslips[0]?.yearToDate.earnings || 0)}
                </p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                <BarChart className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm text-gray-500">Total Tax Paid</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(filteredPayslips[0]?.yearToDate.tax || 0)}
                </p>
                </div>
              
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg sm:col-span-2 md:col-span-1">
                <CreditCard className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-500">Pension Contributions</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(filteredPayslips[0]?.yearToDate.pension || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payslips List */}
        <div>
          <h2 className="text-lg font-medium mb-4">Payslips ({filteredPayslips.length})</h2>
          
          {filteredPayslips.length > 0 ? (
            <div className="space-y-4 overflow-x-auto">
              {filteredPayslips.map(payslip => (
                <Card key={payslip.id} className="overflow-hidden hover:border-blue-200 transition-colors">
                  <CardContent className="p-0">
                    <div 
                      className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center cursor-pointer"
                      onClick={() => setSelectedPayslip(payslip)}
                    >
                      <div className="md:col-span-1 flex justify-center">
                        <FileText className="h-10 w-10 text-blue-500 bg-blue-50 p-2 rounded-full" />
                      </div>
                      
                      <div className="md:col-span-4">
                        <p className="font-medium">{payslip.period}</p>
                        <p className="text-sm text-gray-500">ID: {payslip.id}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {getStatusBadge(payslip.status)}
                          {payslip.corrections.length > 0 && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                              {payslip.corrections.length} {payslip.corrections.length === 1 ? 'Correction' : 'Corrections'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:col-span-3">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-500">Issue Date:</span>
                            <span>{formatDate(payslip.issueDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Payment Date:</span>
                            <span>{formatDate(payslip.paymentDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 text-right">
                        <p className="text-gray-500 text-sm">Net Pay</p>
                        <p className="text-lg font-bold text-green-700">{formatCurrency(payslip.netPay)}</p>
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end gap-2 flex-wrap sm:flex-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, this would download the PDF
                            alert(`Downloading payslip for ${payslip.period}`);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayslip(payslip);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payslips Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery 
                  ? "No payslips match your search criteria. Try adjusting your search terms."
                  : "There are no payslips available for the selected year."}
              </p>
            </div>
          )}
        </div>
        
        {/* Payslip Details Dialog */}
        <Dialog open={!!selectedPayslip} onOpenChange={(open) => !open && setSelectedPayslip(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPayslip && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>Payslip for {selectedPayslip.period}</DialogTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // In a real app, this would print the payslip
                          alert(`Printing payslip for ${selectedPayslip.period}`);
                        }}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // In a real app, this would email the payslip
                          alert(`Emailing payslip for ${selectedPayslip.period}`);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => {
                          // In a real app, this would download the PDF
                          alert(`Downloading payslip for ${selectedPayslip.period}`);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <DialogDescription>
                    Issued on {formatDate(selectedPayslip.issueDate)} • Payment Date: {formatDate(selectedPayslip.paymentDate)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Payslip Summary */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Earnings Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Earnings</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between py-1">
                              <span>Basic Salary</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.earnings.basic)}</span>
                            </div>
                            
                            <div className="flex justify-between py-1">
                              <span>Overtime</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.earnings.overtime)}</span>
                            </div>
                            
                            <div className="flex justify-between py-1">
                              <span>Bonus</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.earnings.bonus)}</span>
                            </div>
                            
                            <div className="flex justify-between py-1">
                              <span>Allowances</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.earnings.allowances)}</span>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between py-1 font-bold">
                              <span>Total Earnings</span>
                              <span className="text-green-700">{formatCurrency(selectedPayslip.earnings.total)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Deductions Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Deductions</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between py-1">
                              <span>Tax</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.deductions.tax)}</span>
                            </div>
                            
                            <div className="flex justify-between py-1">
                              <span>Pension Contribution</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.deductions.pension)}</span>
                            </div>
                            
                            <div className="flex justify-between py-1">
                              <span>Insurance</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.deductions.insurance)}</span>
                            </div>
                            
                            <div className="flex justify-between py-1">
                              <span>Other Deductions</span>
                              <span className="font-medium">{formatCurrency(selectedPayslip.deductions.other)}</span>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between py-1 font-bold">
                              <span>Total Deductions</span>
                              <span className="text-red-700">{formatCurrency(selectedPayslip.deductions.total)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Net Pay Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Net Pay</h3>
                      <Card className="bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-600">Amount Paid</p>
                              <p className="text-xs text-gray-500">Via {selectedPayslip.paymentMethod}</p>
                            </div>
                            <div className="text-2xl font-bold text-green-700">
                              {formatCurrency(selectedPayslip.netPay)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Year to Date Summary */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Year to Date Summary</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-500">Total Earnings</p>
                              <p className="font-bold">{formatCurrency(selectedPayslip.yearToDate.earnings)}</p>
                            </div>
                            
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-500">Total Tax</p>
                              <p className="font-bold">{formatCurrency(selectedPayslip.yearToDate.tax)}</p>
                            </div>
                            
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-500">Pension Contributions</p>
                              <p className="font-bold">{formatCurrency(selectedPayslip.yearToDate.pension)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Corrections and Payment Information */}
                  <div className="space-y-6">
                    {/* Payment Information */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500">Reference</p>
                              <p className="font-medium">{selectedPayslip.id}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500">Status</p>
                              <div className="mt-1">{getStatusBadge(selectedPayslip.status)}</div>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500">Issue Date</p>
                              <p className="font-medium">{formatDate(selectedPayslip.issueDate)}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500">Payment Date</p>
                              <p className="font-medium">{formatDate(selectedPayslip.paymentDate)}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500">Payment Method</p>
                              <p className="font-medium">{selectedPayslip.paymentMethod}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Corrections Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Correction Requests ({selectedPayslip.corrections.length})
                      </h3>
                      
                      {selectedPayslip.corrections.length > 0 ? (
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              {selectedPayslip.corrections.map((correction, index) => (
                                <div key={correction.id} className="p-3 bg-gray-50 rounded-md">
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="font-medium">{correction.type}</div>
                                    {getCorrectionStatusBadge(correction.status)}
                                  </div>
                                  
                                  <p className="text-sm mb-2">{correction.description}</p>
                                  
                                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-3">
                                    <span>Requested: {formatDate(correction.date)}</span>
                                    <span>By: {correction.requestedBy}</span>
                                  </div>
                                  
                                  {correction.resolution && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <p className="text-xs text-gray-500">Resolution:</p>
                                      <p className="text-sm">{correction.resolution}</p>
          </div>
        )}
      </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center py-6">
                              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                              <p className="text-gray-500">No correction requests for this payslip</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Request Correction Form */}
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Request a Correction</h3>
                        <Card>
                          <CardContent className="p-4">
                            <Textarea
                              placeholder="Describe the issue with your payslip..."
                              value={newCorrectionRequest}
                              onChange={(e) => setNewCorrectionRequest(e.target.value)}
                              className="mb-2"
                            />
                            <Button 
                              onClick={handleCorrectionRequest}
                              disabled={!newCorrectionRequest.trim()}
                              className="w-full"
                            >
                              Submit Request
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
    </div>
    </DashboardLayout>
  );
} 
