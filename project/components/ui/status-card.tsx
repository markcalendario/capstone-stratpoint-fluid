import { cn } from "@/lib/utils/tailwind";
import React from "react";

interface StatusCardProps {
  name: string;
  overall: number;
  thisWeek: number;
  className: string;
  icon: React.ElementType;
}

export default function StatusCard({
  name,
  className,
  overall,
  thisWeek,
  icon: Icon
}: StatusCardProps) {
  return (
    <div
      className={cn(
        "ring-primary/20 overflow-hidden rounded-sm bg-white p-6 ring-2 dark:bg-neutral-800",
        className
      )}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Icon
              className="text-blue-500"
              size={20}
            />
          </div>
        </div>
        <div className="ml-5 flex-1">
          <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-200">
            {name}
          </p>
          <div className="flex items-center">
            <span className="text-2xl font-black text-gray-800 dark:text-gray-100">
              {overall}
            </span>

            <span
              className={cn(
                "ml-3 text-xs font-semibold",
                thisWeek > 0
                  ? "text-green-600"
                  : "text-neutral-400 dark:text-neutral-500"
              )}>
              {thisWeek} this week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
