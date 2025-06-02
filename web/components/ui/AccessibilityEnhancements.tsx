import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

// Skip to content link for keyboard navigation
export const SkipToContent: React.FC<{ targetId?: string }> = ({
  targetId = "main-content",
}) => (
  <a
    href={`#${targetId}`}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
  >
    Skip to main content
  </a>
);

// ARIA live region for screen reader announcements
export const AriaLiveRegion: React.FC<{
  message: string;
  priority?: "polite" | "assertive";
  className?: string;
}> = ({ message, priority = "polite", className }) => (
  <div
    aria-live={priority}
    aria-atomic="true"
    className={cn("sr-only", className)}
  >
    {message}
  </div>
);

// Focus trap for modals and overlays
export const FocusTrap: React.FC<{
  children: React.ReactNode;
  active: boolean;
  restoreFocus?: boolean;
}> = ({ children, active, restoreFocus = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store previous focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as NodeListOf<HTMLElement>;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element
    const focusableElements = getFocusableElements();
    focusableElements[0]?.focus();

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, restoreFocus]);

  return <div ref={containerRef}>{children}</div>;
};

// Accessible button with proper states
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            className="opacity-75"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// Screen reader only text
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <span className="sr-only">{children}</span>;

// Accessible form field with proper labeling
export const AccessibleFormField: React.FC<{
  label: string;
  children: React.ReactNode;
  error?: string;
  helpText?: string;
  required?: boolean;
  className?: string;
}> = ({ label, children, error, helpText, required = false, className }) => {
  const fieldId = React.useId();
  const errorId = error ? `${fieldId}-error` : undefined;
  const helpId = helpText ? `${fieldId}-help` : undefined;

  return (
    <div className={cn("space-y-1", className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <div>
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          "aria-describedby":
            [helpId, errorId].filter(Boolean).join(" ") || undefined,
          "aria-invalid": !!error,
          "aria-required": required,
        })}
      </div>

      {helpText && (
        <p id={helpId} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible heading with proper hierarchy
export const AccessibleHeading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ level, children, className, id }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const defaultClasses = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-semibold",
    4: "text-lg font-medium",
    5: "text-base font-medium",
    6: "text-sm font-medium",
  };

  return (
    <Tag id={id} className={cn(defaultClasses[level], className)}>
      {children}
    </Tag>
  );
};

// Hook for announcements
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState("");

  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite",
  ) => {
    setAnnouncement("");
    // Use setTimeout to ensure the announcement is picked up
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  };

  return {
    announce,
    AnnouncementRegion: () => (
      <AriaLiveRegion message={announcement} priority="polite" />
    ),
  };
};

// Keyboard navigation helper
export const useKeyboardNavigation = (
  items: Array<{ id: string; element?: HTMLElement }>,
  options: {
    loop?: boolean;
    orientation?: "horizontal" | "vertical";
  } = {},
) => {
  const { loop = true, orientation = "vertical" } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    const isVertical = orientation === "vertical";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";

    if (e.key === nextKey) {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return loop ? next % items.length : Math.min(next, items.length - 1);
      });
    } else if (e.key === prevKey) {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return loop ? (next < 0 ? items.length - 1 : next) : Math.max(next, 0);
      });
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    }
  };

  useEffect(() => {
    // Focus the active element
    const activeItem = items[activeIndex];
    if (activeItem?.element) {
      activeItem.element.focus();
    }
  }, [activeIndex, items]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
};
