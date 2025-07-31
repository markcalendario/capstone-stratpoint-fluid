import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  tip?: string;
  label: string;
  placeholder: string;
  className?: string;
}

export default function Input({
  id,
  placeholder,
  label,
  className,
  tip,
  ...props
}: InputProps) {
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
      <input
        id={id}
        {...props}
        placeholder={placeholder}
        className="border-primary/20 dark:border-primary/50 w-full rounded-sm border-2 p-[10px] font-[500] placeholder-neutral-500 outline-0 dark:text-neutral-300 dark:placeholder-neutral-400"
      />
    </div>
  );
}
