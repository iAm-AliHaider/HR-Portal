import * as React from "react"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative overflow-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ScrollArea.displayName = "ScrollArea"

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal"
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute flex touch-none select-none transition-colors",
          orientation === "vertical" && 
            "h-full w-2 border-l border-l-transparent p-[1px] right-0",
          orientation === "horizontal" && 
            "h-2.5 border-t border-t-transparent p-[1px] bottom-0 left-0 right-0",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "relative flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800",
          )}
        />
      </div>
    )
  }
)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
