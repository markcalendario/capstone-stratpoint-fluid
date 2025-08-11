import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ElementType;
  color: string;
  className?: string;
}

export default function AnalyticsCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  className
}: AnalyticsCardProps) {
  return (
    <div className={cn("border-primary/20 rounded-sm border-2 p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-500/10 dark:bg-white/10`}>
          <Icon
            className={`text-${color}-500`}
            size={20}
          />
        </div>
      </div>
      <div className="mb-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {value}
      </div>
      <div className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
        {unit}
      </div>
      <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
        {title}
      </div>
    </div>
  );
}
