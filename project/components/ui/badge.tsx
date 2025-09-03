import { cn } from "@/lib/utils/tailwind";

interface BadgeProps {
  className?: string;
  type?: "success" | "error" | "gray" | "info" | "warning";
  children: React.ReactNode;
}

const badgeColors = {
  success:
    "text-green-600 bg-green-600/20 dark:text-green-300 dark:bg-green-700/20",
  error: "text-red-600 bg-red-600/20 dark:text-red-300 dark:bg-red-700/20",
  gray: "text-neutral-600 bg-neutral-600/20 dark:text-neutral-300 dark:bg-neutral-700/20",
  info: "text-blue-600 bg-blue-600/20 dark:text-blue-300 dark:bg-blue-700/20",
  warning:
    "text-yellow-600 bg-yellow-600/20 dark:text-yellow-300 dark:bg-yellow-700/20"
};

export default function Badge({
  type = "gray",
  className,
  children
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeColors[type],
        "inline-block rounded-xs px-2 py-1 text-[10px] font-medium",
        className
      )}>
      {children}
    </span>
  );
}
