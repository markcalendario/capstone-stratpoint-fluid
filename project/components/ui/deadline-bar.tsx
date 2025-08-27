import { cn } from "@/lib/utils/tailwind";

interface DeadlineBarProps {
  title: string;
  label: string;
  date: Date | string;
  className?: string;
}

export default function DeadlineBar({
  title,
  label,
  date,
  className
}: DeadlineBarProps) {
  return (
    <div
      className={cn(
        "outline-primary/20 flex items-end justify-between rounded-sm px-3 py-2 outline-2",
        className
      )}>
      <div>
        <div className="font-medium text-neutral-700 dark:text-neutral-200">
          {title}
        </div>
        <div className="text-sm text-neutral-500">{label}</div>
      </div>
      <div className="text-sm text-neutral-500">{date.toString()}</div>
    </div>
  );
}
