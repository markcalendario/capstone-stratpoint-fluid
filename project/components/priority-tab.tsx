import { cn } from "@/lib/utils";

interface PriorityTabProps {
  priority: "medium" | "low" | "high";
}

const color = {
  low: "text-neutral-500 bg-neutral-600/20 dark:text-neutral-300 bg-neutral-700/20",
  medium: "text-blue-500 bg-blue-600/20 dark:text-blue-300 bg-blue-700/20",
  high: "text-purple-500 bg-purple-600/20 dark:text-purple-300 bg-purple-700/20"
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
