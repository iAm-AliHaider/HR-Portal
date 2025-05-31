import React from "react";

import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  variant?: "underline" | "pills" | "contained" | "buttons";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  vertical?: boolean;
}

const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
  tabClassName,
  contentClassName,
  variant = "underline",
  size = "md",
  fullWidth = false,
  vertical = false,
}) => {
  // Find the active tab by id
  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const variantStyles = {
    underline: {
      tabList: "border-b border-gray-200",
      tab: {
        default:
          "py-2 px-4 text-gray-500 hover:text-gray-700 border-b-2 border-transparent",
        active: "text-indigo-600 border-b-2 border-indigo-500 font-medium",
        disabled: "text-gray-300 cursor-not-allowed",
      },
    },
    pills: {
      tabList: "space-x-2",
      tab: {
        default: "py-2 px-4 text-gray-500 hover:text-gray-700 rounded-full",
        active: "text-white bg-indigo-600 rounded-full font-medium",
        disabled: "text-gray-300 cursor-not-allowed",
      },
    },
    contained: {
      tabList: "bg-gray-100 p-1 rounded-xl",
      tab: {
        default: "py-2 px-4 text-gray-500 hover:text-gray-700 rounded-lg",
        active: "bg-white text-indigo-600 shadow-sm rounded-lg font-medium",
        disabled: "text-gray-300 cursor-not-allowed",
      },
    },
    buttons: {
      tabList: "inline-flex border border-gray-200 rounded-md",
      tab: {
        default:
          "py-2 px-4 text-gray-500 hover:text-gray-700 first:rounded-l-md last:rounded-r-md border-r border-gray-200 last:border-r-0",
        active: "bg-indigo-50 text-indigo-600 font-medium",
        disabled: "text-gray-300 cursor-not-allowed",
      },
    },
  };

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={cn("w-full", vertical && "sm:flex sm:space-x-8", className)}
    >
      {/* Tab List */}
      <div
        className={cn(
          vertical ? "sm:w-1/4 mb-4 sm:mb-0" : "mb-4",
          variantStyles[variant].tabList,
          vertical ? "sm:flex sm:flex-col sm:space-y-2" : "flex",
          !vertical && fullWidth && "flex justify-between",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              sizeStyles[size],
              variantStyles[variant].tab.default,
              !vertical && fullWidth && "flex-1 text-center",
              tab.id === activeTab && variantStyles[variant].tab.active,
              tab.disabled && variantStyles[variant].tab.disabled,
              tabClassName,
            )}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            aria-selected={tab.id === activeTab}
            role="tab"
          >
            <div className="flex items-center justify-center space-x-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={cn("py-2", vertical && "sm:w-3/4", contentClassName)}>
        {activeTabData.content}
      </div>
    </div>
  );
};

export default TabGroup;
