import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

interface BreadcrumbsProps {
  currentPath: string;
}

export default function Breadcrumbs({ currentPath }: BreadcrumbsProps) {
  const router = useRouter();

  // Helper function to format route segments
  const formatSegment = (segment: string): string => {
    // Handle special case for dashboard
    if (segment === "") return "Dashboard";

    // Remove IDs and replace with "Details"
    if (segment.match(/^[0-9a-fA-F-]+$/)) return "Details";

    // Format camelCase and kebab-case to normal text
    return segment
      .replace(/-/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  // Generate breadcrumb segments based on route
  const getSegments = () => {
    // Remove any query params and split path
    const path = currentPath.split("?")[0];
    const segments = path.split("/").filter(Boolean);

    // Create array of breadcrumb segments with paths
    const breadcrumbs = segments.map((segment, index) => {
      // Build the path for this segment
      const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        name: formatSegment(segment),
        path: segmentPath,
        isLast: index === segments.length - 1,
      };
    });

    // Add dashboard as first item
    return [
      { name: "Dashboard", path: "/dashboard", isLast: segments.length === 0 },
      ...breadcrumbs,
    ];
  };

  const segments = getSegments();

  return (
    <nav className="flex items-center text-sm text-gray-500">
      {segments.map((segment, index) => (
        <React.Fragment key={segment.path}>
          {index > 0 && (
            <svg
              className="mx-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}

          {segment.isLast ? (
            <span className="font-medium text-gray-900">{segment.name}</span>
          ) : (
            <Link
              href={segment.path}
              className="hover:text-blue-600 transition-colors"
            >
              {segment.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
