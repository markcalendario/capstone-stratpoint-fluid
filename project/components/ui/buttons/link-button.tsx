import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | "framename";
  className?: string;
  children: React.ReactNode;
}

export default function LinkButton({
  href,
  target,
  className,
  children
}: ButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-sm px-[20px] py-[10px] text-sm font-[500] shadow-sm",
        className
      )}>
      {children}
    </Link>
  );
}
