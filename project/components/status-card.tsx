import { cn } from "@/lib/utils";
import React from "react";

interface StatusCardProps {
  name: string;
  value: number;
  changeType: "positive" | "negative";
  change: string;
  className: string;
  icon: React.ElementType;
}

export default function StatusCard({
  name,
  value,
  className,
  changeType,
  change,
  icon: Icon
}: StatusCardProps) {
  const changeColor =
    changeType === "positive" ? "text-green-600" : "text-red-600";

  return (
    <div
      className={cn(
        "border-primary/20 overflow-hidden rounded-sm border-2 bg-white p-6 dark:bg-neutral-800",
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
              {value}
            </span>
            <span className={`ml-2 text-sm font-semibold ${changeColor}`}>
              {change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
