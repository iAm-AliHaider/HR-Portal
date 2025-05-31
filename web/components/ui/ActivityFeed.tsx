import React from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface Activity {
  id?: string | number;
  user?: {
    name: string;
    avatar?: string;
    href?: string;
  };
  action: string;
  target?: {
    name: string;
    href?: string;
  };
  detail?: string;
  time: string;
  icon?: React.ReactNode;
  iconColor?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
  emptyMessage?: string;
  maxItems?: number;
  showUserAvatar?: boolean;
  compact?: boolean;
  colorBorder?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  className,
  emptyMessage = "No recent activity",
  maxItems,
  showUserAvatar = true,
  compact = false,
  colorBorder = true,
}) => {
  const displayActivities = maxItems
    ? activities.slice(0, maxItems)
    : activities;

  if (activities.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500 italic">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("flow-root", className)}>
      <ul className={cn("-mb-8", compact ? "space-y-2" : "space-y-4")}>
        {displayActivities.map((activity, activityIdx) => (
          <li key={activity.id || activityIdx}>
            <div className="relative pb-8">
              {activityIdx !== displayActivities.length - 1 && (
                <span
                  className={cn(
                    "absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200",
                    colorBorder && activity.iconColor
                      ? activity.iconColor.replace("text-", "bg-") + "/20"
                      : "",
                  )}
                  aria-hidden="true"
                />
              )}
              <div
                className={cn(
                  "relative flex items-start",
                  compact ? "space-x-2" : "space-x-3",
                )}
              >
                {/* Activity Icon */}
                {activity.icon ? (
                  <div
                    className={cn(
                      "relative flex items-center justify-center h-10 w-10 rounded-full",
                      activity.iconColor || "bg-gray-100",
                      compact ? "h-8 w-8" : "",
                    )}
                  >
                    <span
                      className={cn(
                        activity.iconColor || "text-gray-500",
                        "h-5 w-5",
                      )}
                    >
                      {activity.icon}
                    </span>
                  </div>
                ) : showUserAvatar && activity.user ? (
                  <div
                    className={cn(
                      "relative",
                      compact ? "h-8 w-8" : "h-10 w-10",
                    )}
                  >
                    {activity.user.avatar ? (
                      <Image
                        className="h-full w-full rounded-full"
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div
                        className={cn(
                          "h-full w-full flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold",
                          compact ? "text-sm" : "text-base",
                        )}
                      >
                        {activity.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative flex items-center justify-center rounded-full",
                      compact ? "h-8 w-8" : "h-10 w-10",
                      activity.iconColor
                        ? activity.iconColor.replace("text-", "bg-") + "/20"
                        : "bg-gray-100",
                    )}
                  >
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        activity.iconColor || "bg-gray-400",
                      )}
                    />
                  </div>
                )}

                {/* Activity Content */}
                <div
                  className={cn("min-w-0 flex-1", compact ? "pt-0" : "pt-1.5")}
                >
                  <div
                    className={cn(
                      "text-sm",
                      compact ? "leading-5" : "leading-6",
                    )}
                  >
                    <span className="font-medium text-gray-900">
                      {activity.user ? (
                        activity.user.href ? (
                          <Link
                            href={activity.user.href}
                            className="hover:underline"
                          >
                            {activity.user.name}
                          </Link>
                        ) : (
                          activity.user.name
                        )
                      ) : null}
                    </span>{" "}
                    <span className="text-gray-600">{activity.action}</span>{" "}
                    {activity.target && (
                      <>
                        <span className="font-medium text-gray-900">
                          {activity.target.href ? (
                            <Link
                              href={activity.target.href}
                              className="hover:underline"
                            >
                              {activity.target.name}
                            </Link>
                          ) : (
                            activity.target.name
                          )}
                        </span>
                      </>
                    )}
                    {activity.detail && (
                      <p className="mt-0.5 text-sm text-gray-500">
                        {activity.detail}
                      </p>
                    )}
                  </div>
                  <div
                    className={cn(
                      compact ? "mt-0.5" : "mt-2",
                      "text-xs text-gray-500",
                    )}
                  >
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* "View all" link if maxItems is specified and there are more items */}
      {maxItems && activities.length > maxItems && (
        <div className="mt-4 text-center">
          <Link
            href="/activities"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all activities
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
