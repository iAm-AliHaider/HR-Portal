import React from "react";

import { cn } from "@/lib/utils";

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: "default" | "success" | "warning" | "error" | "info";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, className = "" }) => {
  // Define status styles for the timeline dots
  const statusStyles = {
    default: "bg-gray-400",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flow-root">
        <ul className="-mb-8">
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>
              <div className="relative pb-8">
                {itemIdx !== items.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                        item.status
                          ? statusStyles[item.status]
                          : statusStyles.default,
                      )}
                    >
                      {item.icon ? (
                        item.icon
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={item.date}>{item.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
