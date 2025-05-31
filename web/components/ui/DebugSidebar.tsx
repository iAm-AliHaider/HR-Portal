import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import {
  Home,
  Database,
  Shield,
  Settings,
  FileText,
  Activity,
  Users,
  Bug,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthFixed } from "@/lib/supabase/useAuthFixes";
import { cn } from "@/lib/utils";

export default function DebugSidebar({
  onClose,
  isMobile = false,
}: {
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const router = useRouter();
  const { user, role, logout } = useAuthFixed();

  const isActiveLink = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  const debugLinks = [
    {
      name: "Debug Home",
      href: "/debug",
      icon: <Home className="mr-3 h-4 w-4" />,
    },
    {
      name: "Authentication",
      href: "/debug/auth",
      icon: <Shield className="mr-3 h-4 w-4" />,
    },
    {
      name: "Supabase Tests",
      href: "/debug/supabase-test",
      icon: <Database className="mr-3 h-4 w-4" />,
    },
    {
      name: "User Management",
      href: "/debug/users",
      icon: <Users className="mr-3 h-4 w-4" />,
    },
    {
      name: "System Status",
      href: "/debug/status",
      icon: <Activity className="mr-3 h-4 w-4" />,
    },
    {
      name: "Configuration",
      href: "/debug/config",
      icon: <Settings className="mr-3 h-4 w-4" />,
    },
    {
      name: "Logs",
      href: "/logs",
      icon: <FileText className="mr-3 h-4 w-4" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r transition-all duration-300 ease-in-out",
        "bg-white text-zinc-900 border-zinc-200",
        isMobile && "fixed inset-y-0 left-0 z-50 shadow-lg w-[260px]",
        !isMobile && "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
              <span className="text-white font-medium text-sm">HR</span>
            </div>
            <span className="text-lg font-medium transition-all duration-200 text-zinc-900">
              Debug Tools
            </span>
          </div>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-md transition-colors hover:bg-zinc-100"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <nav className="py-4 px-3">
          <div className="space-y-1 mb-6">
            <div className="px-2 mb-2">
              <h3 className="text-xs font-medium tracking-wider uppercase text-zinc-500">
                Debug Tools
              </h3>
            </div>
            {debugLinks.map((item) => (
              <Link key={item.name} href={item.href} passHref legacyBehavior>
                <Button
                  variant={isActiveLink(item.href) ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200 rounded-md text-sm h-9 font-normal",
                    isActiveLink(item.href)
                      ? "bg-zinc-900 text-white"
                      : "border-zinc-200 text-zinc-900 hover:bg-zinc-100",
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="px-2 mb-2">
            <h3 className="text-xs font-medium tracking-wider uppercase text-zinc-500">
              Main Navigation
            </h3>
          </div>
          <div className="space-y-1">
            <Link href="/dashboard" passHref legacyBehavior>
              <Button
                variant="ghost"
                className="w-full justify-start transition-all duration-200 rounded-md text-sm h-9 font-normal border-zinc-200 text-zinc-900 hover:bg-zinc-100"
                onClick={isMobile ? onClose : undefined}
              >
                <Home className="mr-3 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/settings" passHref legacyBehavior>
              <Button
                variant="ghost"
                className="w-full justify-start transition-all duration-200 rounded-md text-sm h-9 font-normal border-zinc-200 text-zinc-900 hover:bg-zinc-100"
                onClick={isMobile ? onClose : undefined}
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Link href="/logs" passHref legacyBehavior>
              <Button
                variant="ghost"
                className="w-full justify-start transition-all duration-200 rounded-md text-sm h-9 font-normal border-zinc-200 text-zinc-900 hover:bg-zinc-100"
                onClick={isMobile ? onClose : undefined}
              >
                <FileText className="mr-3 h-4 w-4" />
                Logs
              </Button>
            </Link>
          </div>
        </nav>
      </ScrollArea>

      {/* User Profile Section */}
      <div className="mt-auto p-4 border-t border-zinc-200">
        {user ? (
          <div className="flex items-center mb-2">
            <Avatar className="h-8 w-8 mr-2 border border-zinc-200">
              <AvatarImage src={user.avatar || ""} alt={user.email || "User"} />
              <AvatarFallback className="bg-zinc-100 text-zinc-900">
                {user.email?.charAt(0).toUpperCase() || "D"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-zinc-900">
                {user.name || user.email || "Debug User"}
              </p>
              <p className="text-xs truncate text-zinc-500">
                {role
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()) || "Admin"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center mb-2">
            <Avatar className="h-8 w-8 mr-2 border border-zinc-200">
              <AvatarFallback className="bg-zinc-100 text-zinc-900">
                D
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-zinc-900">
                Debug Mode
              </p>
              <p className="text-xs truncate text-zinc-500">Admin</p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full transition-all duration-200 rounded-md text-sm font-normal border-zinc-200 text-zinc-900 hover:bg-zinc-100"
          onClick={logout}
          data-logout-button="true"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
