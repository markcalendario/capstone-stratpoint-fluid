import { cn } from "@/lib/utils";

type DueDateTabProps = {
  daysRemaining: string;
  isOverdue: boolean;
};

export default function DueDateTab({
  daysRemaining,
  isOverdue
}: DueDateTabProps) {
  const color = isOverdue
    ? "text-red-500 bg-red-600/20 dark:text-red-300 bg-red-700/20"
    : "text-orange-500 bg-orange-600/20 dark:text-orange-300 bg-orange-700/20";

  return (
    <p
      className={cn(
        color,
        "rounded-sm px-2 py-1 text-[10px] font-medium whitespace-nowrap"
      )}>
      {daysRemaining}
    </p>
  );
}
