import React from "react";

import { useSSR } from "@/hooks/useSSR";

interface SafeDateProps {
  date: string | Date;
  format?: "short" | "long" | "time" | "datetime";
  fallback?: string;
}

/**
 * SSR-safe date formatting component
 * Prevents hydration mismatches due to timezone differences
 */
const SafeDate: React.FC<SafeDateProps> = ({
  date,
  format = "short",
  fallback = "Loading...",
}) => {
  const { isClient } = useSSR();

  if (!isClient) {
    return <span>{fallback}</span>;
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return <span>Invalid date</span>;
    }

    let formattedDate: string;

    switch (format) {
      case "long":
        formattedDate = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        break;
      case "time":
        formattedDate = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        break;
      case "datetime":
        formattedDate = dateObj.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        break;
      case "short":
      default:
        formattedDate = dateObj.toLocaleDateString("en-US");
        break;
    }

    return <span>{formattedDate}</span>;
  } catch (error) {
    console.warn("Date formatting error:", error);
    return <span>Invalid date</span>;
  }
};

export default SafeDate;
