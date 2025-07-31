import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  tip?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function Select({
  id,
  label,
  children,
  className,
  tip,
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-center gap-1">
        <label
          htmlFor={id}
          className="font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </label>
        {tip && (
          <p className="p-1 text-xs text-neutral-500 dark:text-neutral-400">
            {tip}
          </p>
        )}
      </div>
      <select
        id={id}
        {...props}
        className="border-primary/20 dark:border-primary/50 w-full rounded-sm border-2 p-[10px] font-[500] placeholder-neutral-500 outline-0 dark:text-neutral-300 dark:placeholder-neutral-400">
        {children}
      </select>
    </div>
  );
}
