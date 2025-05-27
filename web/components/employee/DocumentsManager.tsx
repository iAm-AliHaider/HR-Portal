import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/button';
import { Badge } from '@chakra-ui/react';
import { FileText, Download, Eye, Calendar, Shield, User, Award, FileCheck, Clock } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'policy' | 'certificate' | 'payslip' | 'tax' | 'personal' | 'benefits';
  description: string;
  uploadDate: string;
  lastAccessed?: string;
  size: string;
  format: string;
  category: string;
  isConfidential: boolean;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending';
  downloadUrl: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  count: number;
}

const DocumentsManager: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const documents: Document[] = [
    {
      id: '1',
      name: 'Employment Contract',
      type: 'contract',
      description: 'Original employment agreement',
      uploadDate: '2024-01-15',
      lastAccessed: '2024-01-20',
      size: '2.3 MB',
      format: 'PDF',
      category: 'Employment',
      isConfidential: true,
      status: 'active',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Employee Handbook 2024',
      type: 'policy',
      description: 'Company policies and procedures',
      uploadDate: '2024-01-01',
      lastAccessed: '2024-01-18',
      size: '5.1 MB',
      format: 'PDF',
      category: 'Policies',
      isConfidential: false,
      status: 'active',
      downloadUrl: '#'
    },
    {
      id: '3',
      name: 'AWS Certification',
      type: 'certificate',
      description: 'AWS Solutions Architect Professional',
      uploadDate: '2023-12-10',
      size: '850 KB',
      format: 'PDF',
      category: 'Certifications',
      isConfidential: false,
      expiryDate: '2025-12-10',
      status: 'active',
      downloadUrl: '#'
    },
    {
      id: '4',
      name: 'December 2023 Payslip',
      type: 'payslip',
      description: 'Monthly salary statement',
      uploadDate: '2024-01-05',
      lastAccessed: '2024-01-10',
      size: '350 KB',
      format: 'PDF',
      category: 'Payroll',
      isConfidential: true,
      status: 'active',
      downloadUrl: '#'
    },
    {
      id: '5',
      name: '2023 W-2 Form',
      type: 'tax',
      description: 'Annual tax document',
      uploadDate: '2024-01-31',
      size: '450 KB',
      format: 'PDF',
      category: 'Tax Documents',
      isConfidential: true,
      status: 'active',
      downloadUrl: '#'
    },
    {
      id: '6',
      name: 'Benefits Enrollment',
      type: 'benefits',
      description: '2024 health and dental coverage',
      uploadDate: '2023-11-15',
      lastAccessed: '2024-01-12',
      size: '1.2 MB',
      format: 'PDF',
      category: 'Benefits',
      isConfidential: false,
      status: 'active',
      downloadUrl: '#'
    },
    {
      id: '7',
      name: 'Performance Review 2023',
      type: 'personal',
      description: 'Annual performance evaluation',
      uploadDate: '2023-12-20',
      lastAccessed: '2024-01-08',
      size: '900 KB',
      format: 'PDF',
      category: 'Performance',
      isConfidential: true,
      status: 'active',
      downloadUrl: '#'
    }
  ];

  const categories: DocumentCategory[] = [
    {
      id: 'all',
      name: 'All Documents',
      icon: <FileText className="h-5 w-5" />,
      description: 'View all available documents',
      count: documents.length
    },
    {
      id: 'employment',
      name: 'Employment',
      icon: <User className="h-5 w-5" />,
      description: 'Contracts and employment records',
      count: documents.filter(d => d.category === 'Employment').length
    },
    {
      id: 'payroll',
      name: 'Payroll',
      icon: <FileCheck className="h-5 w-5" />,
      description: 'Payslips and salary documents',
      count: documents.filter(d => d.category === 'Payroll').length
    },
    {
      id: 'benefits',
      name: 'Benefits',
      icon: <Shield className="h-5 w-5" />,
      description: 'Health, dental, and other benefits',
      count: documents.filter(d => d.category === 'Benefits').length
    },
    {
      id: 'certifications',
      name: 'Certifications',
      icon: <Award className="h-5 w-5" />,
      description: 'Professional certificates and training',
      count: documents.filter(d => d.category === 'Certifications').length
    },
    {
      id: 'tax',
      name: 'Tax Documents',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Tax forms and related documents',
      count: documents.filter(d => d.category === 'Tax Documents').length
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || 
      doc.category.toLowerCase() === categories.find(c => c.id === selectedCategory)?.name.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'contract': return <User className="h-6 w-6 text-blue-600" />;
      case 'policy': return <Shield className="h-6 w-6 text-purple-600" />;
      case 'certificate': return <Award className="h-6 w-6 text-yellow-600" />;
      case 'payslip': return <FileCheck className="h-6 w-6 text-green-600" />;
      case 'tax': return <Calendar className="h-6 w-6 text-red-600" />;
      case 'benefits': return <Shield className="h-6 w-6 text-indigo-600" />;
      case 'personal': return <User className="h-6 w-6 text-gray-600" />;
      default: return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (document: Document) => {
    // In a real app, this would trigger the actual download
    console.log('Downloading document:', document.name);
    // You could also track access here
  };

  const handleView = (document: Document) => {
    // In a real app, this would open the document in a viewer
    console.log('Viewing document:', document.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Documents</h1>
        <p className="text-gray-600">Access and download your employment documents</p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 border-blue-200 border-2'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {category.icon}
                        <div className="ml-3">
                          <h3 className="font-medium text-sm">{category.name}</h3>
                          <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" size="sm">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === 'all' 
                  ? `All Documents (${filteredDocuments.length})`
                  : `${categories.find(c => c.id === selectedCategory)?.name} (${filteredDocuments.length})`
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'No documents available in this category'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            {getDocumentIcon(document.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {document.name}
                              </h3>
                              {document.isConfidential && (
                                <Badge colorScheme="red" variant="subtle" size="sm">
                                  Confidential
                                </Badge>
                              )}
                              <Badge 
                                colorScheme={getStatusColor(document.status)} 
                                variant="subtle" 
                                size="sm"
                              >
                                {document.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{document.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Format: {document.format}</span>
                              <span>Size: {document.size}</span>
                              <span>Uploaded: {formatDate(document.uploadDate)}</span>
                              {document.lastAccessed && (
                                <span>Last accessed: {formatDate(document.lastAccessed)}</span>
                              )}
                              {document.expiryDate && (
                                <span className="text-amber-600">
                                  Expires: {formatDate(document.expiryDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            onClick={() => handleView(document)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            onClick={() => handleDownload(document)}
                            size="sm"
                            className="bg-blue-600 text-white"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-amber-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Recent Access</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.lastAccessed && 
                    new Date(d.lastAccessed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.expiryDate && 
                    new Date(d.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsManager; 
