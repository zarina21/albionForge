"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props} />
  ),
);
Chart.displayName = "Chart";

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex aspect-video justify-center text-xs", className)}
      {...props}
    />
  ),
);
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    />
  ),
);
ChartTooltip.displayName = "ChartTooltip";

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center gap-4 [&>svg]:h-3 [&>svg]:w-3", className)}
      {...props}
    />
  ),
);
ChartLegend.displayName = "ChartLegend";

export { Chart, ChartContainer, ChartTooltip, ChartLegend };
