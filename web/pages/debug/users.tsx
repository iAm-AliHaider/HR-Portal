import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthFixed } from '@/lib/supabase/useAuthFixes';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, User, UserPlus, Shield, UserCheck } from 'lucide-react';
import DebugLayout from './_layout';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
  last_sign_in_at?: string;
  avatar_url?: string;
}

export default function DebugUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get users from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (profilesError) {
        throw new Error(`Error fetching profiles: ${profilesError.message}`);
      }
      
      setUsers(profiles || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string = 'employee') => {
    const roleColors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800 border-red-300',
      hr: 'bg-purple-100 text-purple-800 border-purple-300',
      manager: 'bg-blue-100 text-blue-800 border-blue-300',
      employee: 'bg-green-100 text-green-800 border-green-300',
      recruiter: 'bg-amber-100 text-amber-800 border-amber-300',
    };
    
    return roleColors[role.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <DebugLayout>
      <PageLayout
        title="User Management"
        description="View and manage test users in the system"
        breadcrumbs={[
          { label: 'Debug', href: '/debug' },
          { label: 'User Management', href: '/debug/users' },
        ]}
      >
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Test Users</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Test User
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-700">
                <Shield className="mr-2 h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50 pb-3">
            <CardTitle>System Users</CardTitle>
            <CardDescription>All registered users in the system</CardDescription>
          </CardHeader>
          <div className="px-6 py-2 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between">
              <Input 
                placeholder="Search users..." 
                className="max-w-sm"
              />
              <div className="text-xs text-gray-500">
                {users.length} users found
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={user.avatar_url || ''} alt={user.name || 'User'} />
                              <AvatarFallback className="bg-slate-100 text-slate-600">
                                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name || 'Unnamed'}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`border ${getRoleBadgeColor(user.role)}`}>
                            {user.role || 'employee'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(user.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(user.last_sign_in_at)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </PageLayout>
    </DebugLayout>
  );
} 