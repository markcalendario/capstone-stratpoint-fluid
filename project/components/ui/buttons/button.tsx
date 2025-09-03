import { cn } from "@/lib/utils/tailwind";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isProcessing?: boolean;
}

export default function Button({
  className,
  onClick,
  isProcessing,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={isProcessing || disabled}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-xs px-[20px] py-[10px] text-sm font-[500]",
        className
      )}>
      {isProcessing && (
        <LoaderCircle
          className="animate-spin"
          size={16}
        />
      )}
      {children}
    </button>
  );
}
