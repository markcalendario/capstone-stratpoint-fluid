import { cn } from "@/lib/utils/tailwind";

interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  placeholder: string;
  className?: string;
  required?: boolean;
}

export default function Textarea({
  id,
  placeholder,
  label,
  className,
  required,
  ...props
}: InputProps) {
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

      <textarea
        id={id}
        {...props}
        placeholder={placeholder}
        className="outline-primary w-full rounded-xs p-[10px] font-[500] placeholder-neutral-500 outline-1 dark:text-neutral-300 dark:placeholder-neutral-400"
      />
    </div>
  );
}
