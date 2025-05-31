import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import DebugLayout from './_layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Upload, 
  Download, 
  RefreshCw, 
  Eye, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { 
  SupabaseAdminManager, 
  DatabaseCredentials, 
  TableInfo, 
  UploadTemplate,
  defaultCredentials 
} from '@/lib/supabase/admin-utils';

export default function SupabaseAdminPage() {
  const [credentials, setCredentials] = useState<DatabaseCredentials>(defaultCredentials);
  const [adminManager, setAdminManager] = useState<SupabaseAdminManager | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableTotal, setTableTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [uploadTemplate, setUploadTemplate] = useState<UploadTemplate | null>(null);
  const [uploadData, setUploadData] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [allTemplates, setAllTemplates] = useState<UploadTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // Load all templates (predefined + dynamic)
  const loadAllTemplates = async () => {
    if (!adminManager) return;
    
    try {
      setTemplatesLoading(true);
      const templates = await adminManager.getAllTemplates();
      setAllTemplates(templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Fallback to predefined templates only
      setAllTemplates(adminManager.getUploadTemplates());
    } finally {
      setTemplatesLoading(false);
    }
  };

  const templates = allTemplates;

  // Test database connection
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus(null);

    try {
      const manager = new SupabaseAdminManager(credentials);
      const result = await manager.testConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        setAdminManager(manager);
        setConnected(true);
        await manager.initializeServiceClient();
        await loadTables(manager);
        // Load templates after successful connection
        const tempManager = manager;
        try {
          const templates = await tempManager.getAllTemplates();
          setAllTemplates(templates);
        } catch (error) {
          console.error('Failed to load templates:', error);
          setAllTemplates(tempManager.getUploadTemplates());
        }
      } else {
        setConnected(false);
        setAdminManager(null);
      }
    } catch (error: any) {
      setConnectionStatus({
        success: false,
        message: `Connection failed: ${error.message}`
      });
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Load database tables
  const loadTables = async (manager?: SupabaseAdminManager) => {
    const mgr = manager || adminManager;
    if (!mgr) return;

    try {
      setLoading(true);
      const tablesData = await mgr.getTables();
      setTables(tablesData);
    } catch (error: any) {
      console.error('Failed to load tables:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load table data
  const loadTableData = async (tableName: string) => {
    if (!adminManager) return;

    try {
      setLoading(true);
      const offset = (currentPage - 1) * pageSize;
      const result = await adminManager.getTableData(tableName, pageSize, offset);
      setTableData(result.data);
      setTableTotal(result.total);
      setSelectedTable(tableName);
    } catch (error: any) {
      console.error('Failed to load table data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setUploadData(text);
    };
    reader.readAsText(file);
  };

  // Process upload
  const processUpload = async () => {
    if (!adminManager || !uploadTemplate) return;

    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadStatus(null);

      // Parse data
      const parsedData = adminManager.parseCSV(uploadData);
      setUploadProgress(25);

      // Validate data
      const validation = adminManager.validateUploadData(parsedData, uploadTemplate);
      setUploadProgress(50);

      if (!validation.valid) {
        setUploadStatus({
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`
        });
        return;
      }

      setUploadProgress(75);

      // Upload data
      const result = await adminManager.uploadData(uploadTemplate.table, parsedData);
      setUploadProgress(100);
      setUploadStatus(result);

      if (result.success) {
        // Refresh table data if viewing the uploaded table
        if (selectedTable === uploadTemplate.table) {
          await loadTableData(selectedTable);
        }
        // Clear upload form
        setUploadData('');
        setUploadFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error: any) {
      setUploadStatus({
        success: false,
        message: `Upload failed: ${error.message}`
      });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Download template
  const downloadTemplate = (template: UploadTemplate) => {
    if (!adminManager) return;

    const csv = adminManager.generateCSVTemplate(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase()}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-connect on mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <DebugLayout>
      <PageLayout
        title="Supabase Admin Panel"
        description="Manage database connections, view tables, and upload data"
        breadcrumbs={[
          { label: 'Debug', href: '/debug' },
          { label: 'Supabase Admin', href: '/debug/supabase-admin' },
        ]}
      >
        <div className="space-y-6">
          {/* Connection Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="url">Supabase URL</Label>
                  <Input
                    id="url"
                    value={credentials.url}
                    onChange={(e) => setCredentials(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://your-project.supabase.co"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Database Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password || ''}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Your database password"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="anonKey">Anonymous Key</Label>
                <Textarea
                  id="anonKey"
                  value={credentials.anonKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, anonKey: e.target.value }))}
                  placeholder="Your Supabase anonymous key"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="serviceKey">Service Role Key (Optional)</Label>
                <Textarea
                  id="serviceKey"
                  value={credentials.serviceKey || ''}
                  onChange={(e) => setCredentials(prev => ({ ...prev, serviceKey: e.target.value }))}
                  placeholder="Your Supabase service role key (for admin operations)"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={testConnection} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                  {loading ? 'Testing...' : 'Test Connection'}
                </Button>
                
                {connectionStatus && (
                  <div className="flex items-center gap-2">
                    {connectionStatus.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={connectionStatus.success ? 'text-green-700' : 'text-red-700'}>
                      {connectionStatus.message}
                    </span>
                    {connectionStatus.latency && (
                      <Badge variant="outline">{connectionStatus.latency}ms</Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {connected && (
            <Tabs defaultValue="tables" className="space-y-6">
              <TabsList>
                <TabsTrigger value="tables">
                  <Database className="h-4 w-4 mr-2" />
                  Database Tables
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </TabsTrigger>
              </TabsList>

              {/* Tables Tab */}
              <TabsContent value="tables" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Database Tables ({tables.length})</span>
                      <Button onClick={() => loadTables()} disabled={loading} size="sm">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tables.map((table) => (
                        <Card key={table.name} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{table.name}</h3>
                              <Badge variant="outline">{table.rowCount} rows</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {table.columns.length} columns
                            </p>
                            <Button 
                              size="sm" 
                              onClick={() => loadTableData(table.name)}
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Data
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Table Data Display */}
                {selectedTable && tableData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Table: {selectedTable}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {tableTotal} total rows
                          </span>
                          <Button onClick={() => loadTableData(selectedTable)} disabled={loading} size="sm">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(tableData[0] || {}).map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableData.map((row, index) => (
                              <TableRow key={index}>
                                {Object.values(row).map((value: any, cellIndex) => (
                                  <TableCell key={cellIndex} className="max-w-xs truncate">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, tableTotal)} of {tableTotal} rows
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setCurrentPage(prev => Math.max(1, prev - 1));
                              loadTableData(selectedTable);
                            }}
                            disabled={currentPage === 1 || loading}
                          >
                            Previous
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setCurrentPage(prev => prev + 1);
                              loadTableData(selectedTable);
                            }}
                            disabled={currentPage * pageSize >= tableTotal || loading}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Template Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Select 
                        value={uploadTemplate?.name || ''} 
                        onValueChange={(value) => {
                          const template = templates.find(t => t.name === value);
                          setUploadTemplate(template || null);
                          setUploadData('');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Select a template"} />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.name} value={template.name}>
                              {template.name} - {template.table}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {uploadTemplate && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">{uploadTemplate.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{uploadTemplate.description}</p>
                            <div className="text-sm">
                              <strong>Table:</strong> {uploadTemplate.table}
                            </div>
                            <div className="text-sm">
                              <strong>Required Fields:</strong> {uploadTemplate.requiredFields.join(', ')}
                            </div>
                          </div>

                          <Button 
                            onClick={() => downloadTemplate(uploadTemplate)} 
                            size="sm"
                            variant="outline"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Template
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* File Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="file">Choose CSV File</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                        />
                        {uploadFile && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {uploadFile.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="data">Or Paste CSV Data</Label>
                        <Textarea
                          id="data"
                          value={uploadData}
                          onChange={(e) => setUploadData(e.target.value)}
                          placeholder="Paste your CSV data here..."
                          rows={8}
                        />
                      </div>

                      {uploadProgress > 0 && (
                        <div>
                          <Label>Upload Progress</Label>
                          <Progress value={uploadProgress} className="mt-1" />
                        </div>
                      )}

                      {uploadStatus && (
                        <div className={`p-3 rounded border ${uploadStatus.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                          <p className={uploadStatus.success ? 'text-green-800' : 'text-red-800'}>
                            {uploadStatus.message}
                          </p>
                        </div>
                      )}

                      <Button 
                        onClick={processUpload} 
                        disabled={!uploadTemplate || !uploadData.trim() || loading}
                        className="w-full"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {loading ? 'Uploading...' : 'Upload Data'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Template Preview */}
                {uploadTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Template Preview - {uploadTemplate.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {uploadTemplate.columns.map((column) => (
                                <TableHead key={column}>
                                  {column}
                                  {uploadTemplate.requiredFields.includes(column) && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {uploadTemplate.sampleData.map((row, index) => (
                              <TableRow key={index}>
                                {uploadTemplate.columns.map((column) => (
                                  <TableCell key={column}>
                                    {String(row[column] || '')}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageLayout>
    </DebugLayout>
  );
} 