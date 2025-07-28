import { cn } from "@/lib/utils";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({ className, onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-sm px-[20px] py-[10px] text-sm font-[500] shadow-sm",
        className
      )}>
      {children}
    </button>
  );
}
