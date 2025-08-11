import { cn } from "@/lib/utils";
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
  children
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isProcessing || disabled}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-sm px-[20px] py-[10px] text-sm font-[500] shadow-sm",
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
