import { cn } from "@/lib/utils/tailwind";

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
  const colorMap: Record<string, string> = {
    blue: "bg-primary",
    green: "bg-green-700",
    red: "bg-red-700",
    yellow: "bg-yellow-600"
  };

  return (
    <div className={cn("border-primary/20 rounded-sm border-1 p-5", className)}>
      <div
        className={cn(
          colorMap[color],
          "mb-2 inline-block items-center justify-between rounded-xs p-2"
        )}>
        <Icon
          size={20}
          className="text-neutral-100"
        />
      </div>
      <div className="mb-1 flex items-end gap-2">
        <div className="text-2xl leading-none font-bold text-neutral-900 dark:text-neutral-100">
          {value}
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {unit}
        </div>
      </div>
      <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {title}
      </div>
    </div>
  );
}
