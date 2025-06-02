import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

// Text line skeleton
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
      />
    ))}
  </div>
);

// Card skeleton
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("p-6 border border-gray-200 rounded-lg", className)}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

// Table skeleton
export const SkeletonTable: React.FC<{
  rows?: number;
  cols?: number;
  className?: string;
}> = ({ rows = 5, cols = 4, className }) => (
  <div className={cn("overflow-hidden", className)}>
    {/* Header */}
    <div className="flex space-x-4 p-4 bg-gray-50 border-b">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="flex space-x-4 p-4 border-b border-gray-100"
      >
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            className={cn(
              "h-4 flex-1",
              colIndex === 0 && "w-8 h-8 rounded-full flex-none",
            )}
          />
        ))}
      </div>
    ))}
  </div>
);

// Avatar skeleton
export const SkeletonAvatar: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
  );
};

// Dashboard card skeleton
export const SkeletonDashboardCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={cn("p-6 bg-white border border-gray-200 rounded-lg", className)}
  >
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <div className="flex items-center">
      <Skeleton className="h-4 w-16 mr-2" />
      <Skeleton className="h-4 w-8" />
    </div>
  </div>
);

// Navigation skeleton
export const SkeletonNavigation: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 8, className }) => (
  <div className={cn("space-y-2 p-4", className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-4 flex-1" />
      </div>
    ))}
  </div>
);

// Form skeleton
export const SkeletonForm: React.FC<{
  fields?: number;
  className?: string;
}> = ({ fields = 4, className }) => (
  <div className={cn("space-y-6", className)}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <div className="flex space-x-4 pt-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

// Page skeleton - comprehensive loading state
export const SkeletonPage: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("", className)}>
    {/* Header */}
    <div className="mb-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonDashboardCard key={i} />
      ))}
    </div>

    {/* Content area */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SkeletonTable rows={5} cols={4} />
      </div>
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

export default Skeleton;
