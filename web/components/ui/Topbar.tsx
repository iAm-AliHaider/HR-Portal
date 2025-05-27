import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Bell, HelpCircle, LogOut as LogOutIcon, User as UserIcon, Settings as SettingsIcon, X, ChevronDown } from 'lucide-react';

interface TopbarProps {
  theme?: 'light' | 'dark' | 'purple'; // Theme prop might be less relevant with shadcn
}

export default function Topbar({ theme = 'light' }: TopbarProps) {
  const { user, signOut, role } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const isDev = process.env.NODE_ENV === 'development';

  // Mock notifications data - consider moving to a hook or service
  const notificationsData = [
    { id: '1', text: 'New leave request from John Doe', time: '10 minutes ago', unread: true, priority: 'high', href: '/leave/approvals' },
    { id: '2', text: 'Your expense report #EXP0045 was approved', time: '1 hour ago', unread: true, priority: 'medium', href: '/expenses' },
    { id: '3', text: 'Performance review scheduled for Jane Smith on 2024-08-15', time: '3 hours ago', unread: false, priority: 'medium', href: '/performance' },
    { id: '4', text: 'Team meeting reminder: Tomorrow at 10 AM in Conference Room B', time: '5 hours ago', unread: false, priority: 'low', href: '/calendar' },
    { id: '5', text: 'New training course assigned: Advanced Cybersecurity', time: '1 day ago', unread: false, priority: 'low', href: '/training' },
  ];
  const [notifications, setNotifications] = useState(notificationsData);
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement actual search functionality or redirect to a search page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
    // API call to mark as read would go here
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    // API call
  };

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'high': return { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' };
      case 'medium': return { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' };
      case 'low': return { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' };
      default: return { dot: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50' };
    }
  };
  
  // Theming - shadcn/ui mainly uses CSS variables. This is kept for now but might be simplified.
  const topBarThemeClasses = {
    light: {
      bg: 'bg-background', // Uses CSS variable --background
      text: 'text-foreground',
      border: 'border-border',
      inputBg: 'bg-muted', // Softer background for input
      inputFocusBg: 'focus:bg-background',
      iconColor: 'text-muted-foreground',
      hoverBg: 'hover:bg-muted',
      avatarFallbackBg: 'bg-primary',
      avatarFallbackText: 'text-primary-foreground',
    },
    dark: { // Example for dark theme consistency with shadcn patterns
      bg: 'bg-slate-900', 
      text: 'text-slate-50',
      border: 'border-slate-700',
      inputBg: 'bg-slate-800',
      inputFocusBg: 'focus:bg-slate-700',
      iconColor: 'text-slate-400',
      hoverBg: 'hover:bg-slate-800',
      avatarFallbackBg: 'bg-slate-700',
      avatarFallbackText: 'text-slate-200',
    },
    purple: { // Example for purple theme
      bg: 'bg-purple-700',
      text: 'text-purple-50',
      border: 'border-purple-600',
      inputBg: 'bg-purple-600',
      inputFocusBg: 'focus:bg-purple-500',
      iconColor: 'text-purple-200',
      hoverBg: 'hover:bg-purple-600',
      avatarFallbackBg: 'bg-purple-500',
      avatarFallbackText: 'text-purple-100',
    }
  };
  const currentTheme = topBarThemeClasses[theme] || topBarThemeClasses.light;

  return (
    <div className={cn("h-16 shadow-sm z-20 sticky top-0", currentTheme.bg, currentTheme.border)}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-1/3 lg:w-1/4 flex items-center">
          <Search className={cn("absolute left-3 h-4 w-4", currentTheme.iconColor)} />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={cn(
              "w-full h-9 pl-10 pr-8 rounded-md transition-all", 
              currentTheme.inputBg, 
              currentTheme.text,
              currentTheme.border,
              currentTheme.inputFocusBg,
              "focus:ring-1 focus:ring-ring focus:border-ring"
            )}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className={cn("absolute right-1 h-7 w-7", currentTheme.iconColor, currentTheme.hoverBg)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
        
        {/* Right side items */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("relative", currentTheme.iconColor, currentTheme.hoverBg)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className={cn("p-3 border-b flex justify-between items-center", currentTheme.border)}>
                <h3 className={cn("font-semibold text-sm", currentTheme.text)}>Notifications</h3>
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <Button variant="link" size="sm" onClick={markAllAsRead} className="text-xs h-auto p-0">
                      Mark all as read
                    </Button>
                  )}
                  <Button variant="link" size="sm" asChild className="text-xs h-auto p-0">
                     <Link href="/notifications">View All</Link>
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-auto max-h-96">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  <div>
                    {notifications.map(notification => {
                      const priorityClasses = getPriorityClasses(notification.priority);
                      return (
                        <Link key={notification.id} href={notification.href || '#'} passHref legacyBehavior>
                          <a 
                            onClick={() => notification.unread && markAsRead(notification.id)}
                            className={cn(
                              "block p-3 border-b transition-colors", 
                              currentTheme.border,
                              notification.unread ? cn('font-semibold', priorityClasses.bg, currentTheme.hoverBg) : cn('hover:bg-muted', currentTheme.hoverBg)
                            )}
                          >
                            <div className="flex items-start">
                              <div className={cn("w-2 h-2 mt-1.5 rounded-full mr-2 flex-shrink-0", priorityClasses.dot)}></div>
                              <div className="flex-grow">
                                <p className={cn("text-sm leading-tight", notification.unread ? currentTheme.text : 'text-muted-foreground')}>{notification.text}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          {/* Help Button */}
          <Button asChild variant="ghost" size="icon" className={cn(currentTheme.iconColor, currentTheme.hoverBg)}>
            <Link href="/help">
               <HelpCircle className="h-5 w-5" />
            </Link>
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("flex items-center space-x-2 px-2 py-1 h-auto", currentTheme.hoverBg)}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name || user?.email} />
                  <AvatarFallback className={cn(currentTheme.avatarFallbackBg, currentTheme.avatarFallbackText)}>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className={cn("text-sm font-medium hidden md:block", currentTheme.text)}>
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                 <ChevronDown className={cn("h-4 w-4 hidden md:block", currentTheme.iconColor)} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>
                <p className={cn("text-sm font-medium", currentTheme.text)}>{user?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.position || role || 'N/A'}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <Badge variant={isDev && user?.role ? "secondary" : "default"} className="mr-1">
                    {role || 'No role'}
                </Badge>
                {isDev && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    Dev Mode
                  </Badge>
                )}
                 {isDev && !user?.role && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Mock roles are assigned in Dev mode.
                    </p>
                  )}
              </div>
               <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/employee/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/general">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help Center</span>
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 