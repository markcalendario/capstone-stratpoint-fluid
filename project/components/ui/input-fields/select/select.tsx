import { cn } from "@/lib/utils/tailwind";
import { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Select({
  id,
  label,
  children,
  className,
  required,
  value,
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <label
          htmlFor={id}
          className="font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </label>

        {!required && (
          <p className="p-1 text-xs text-neutral-500 dark:text-neutral-400">
            Optional
          </p>
        )}
      </div>

      <select
        id={id}
        value={value}
        {...props}
        className="border-primary w-full rounded-sm border-1 p-[10px] font-[500] placeholder-neutral-500 outline-0 dark:text-neutral-300 dark:placeholder-neutral-400">
        {children}
      </select>
    </div>
  );
}
