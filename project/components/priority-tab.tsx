import { cn } from "@/lib/utils";

interface PriorityTabProps {
  priority: "medium" | "low" | "high";
}

const color = {
  low: "text-neutral-500 bg-green-600/20 dark:text-green-300 bg-green-700/20",
  medium: "text-blue-500 bg-blue-600/20 dark:text-blue-300 bg-blue-700/20",
  high: "text-red-500 bg-red-600/20 dark:text-red-300 bg-red-700/20"
};

export default function PriorityTab({ priority }: PriorityTabProps) {
  return (
    <p
      className={cn(
        color[priority],
        "rounded-sm px-2 py-1 text-[10px] font-medium"
      )}>
      {priority.toUpperCase()}
    </p>
  );
}
