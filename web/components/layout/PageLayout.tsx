import React, { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Components for the page layout
type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

export function PageLayout({
  title,
  description,
  children,
  breadcrumbs = [],
  actionButton,
  secondaryButton,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{title} | HR Portal</title>
        <meta name="description" content={description || title} />
      </Head>

      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex mb-6 text-sm text-zinc-500">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && <ChevronRight className="h-4 w-4 mx-2" strokeWidth={1.5} />}
                {item.href ? (
                  <Link 
                    href={item.href} 
                    className="hover:text-zinc-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-zinc-900 font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Header with title, description and action buttons */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
            {description && <p className="text-zinc-500 mt-1">{description}</p>}
          </div>
          
          {(actionButton || secondaryButton) && (
            <div className="flex gap-3">
              {secondaryButton && (
                <button
                  onClick={secondaryButton.onClick}
                  className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 transition-colors"
                >
                  {secondaryButton.icon && (
                    <span className="mr-2">{secondaryButton.icon}</span>
                  )}
                  {secondaryButton.label}
                </button>
              )}
              
              {actionButton && (
                <button
                  onClick={actionButton.onClick}
                  className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 transition-colors"
                >
                  {actionButton.icon && (
                    <span className="mr-2">{actionButton.icon}</span>
                  )}
                  {actionButton.label}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

// Stats card component for consistency
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  icon?: ReactNode;
}

export function StatsCard({ title, value, description, className, icon }: StatsCardProps) {
  return (
    <div className={`rounded-md border border-zinc-200 bg-white p-6 shadow-sm hover:shadow transition-shadow ${className}`}>
      {icon && <div className="mb-3 text-zinc-700">{icon}</div>}
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="text-2xl font-semibold mt-1 text-zinc-900">{value}</p>
      {description && (
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      )}
    </div>
  );
}

// Status badge component
interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-zinc-100 text-zinc-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${getStatusStyles()} ${className}`}>
      {status}
    </span>
  );
}

export function SearchFilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {children}
      </div>
    </div>
  );
}

// For rendering a grid of cards
export function CardGrid({ children, columns = 3 }: { children: ReactNode, columns?: number }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-6`}>
      {children}
    </div>
  );
}

// Card component for consistent styling
export function Card({ 
  title, 
  description, 
  children, 
  icon, 
  className,
  onClick
}: { 
  title: string; 
  description?: string; 
  children?: ReactNode; 
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`rounded-md border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        {icon && (
          <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center mr-3 text-zinc-900">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-medium text-zinc-900">{title}</h3>
          {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// For record table rendering
export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-zinc-50">
      <tr>
        {children}
      </tr>
    </thead>
  );
}

export function TableCell({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-zinc-900 ${className}`}>
      {children}
    </td>
  );
}

export function TableHeaderCell({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

export function UserAvatar({ name, email, imgSrc }: { name: string, email: string, imgSrc?: string }) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        {imgSrc ? (
          <img className="h-10 w-10 rounded-full" src={imgSrc} alt={name} />
        ) : (
          <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center">
            <span className="text-sm font-medium text-zinc-700">{initials}</span>
          </div>
        )}
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-zinc-900">{name}</div>
        <div className="text-sm text-zinc-500">{email}</div>
      </div>
    </div>
  );
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon
}: { 
  title: string, 
  description: string, 
  actionLabel?: string, 
  onAction?: () => void,
  icon?: ReactNode
}) {
  return (
    <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
      {icon ? (
        <div className="mx-auto h-12 w-12 text-zinc-400">{icon}</div>
      ) : (
        <svg
          className="mx-auto h-12 w-12 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <h3 className="mt-2 text-sm font-medium text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
} 