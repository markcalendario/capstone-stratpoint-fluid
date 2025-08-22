import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | "framename";
  className?: string;
  download?: boolean;
  children: React.ReactNode;
}

export default function LinkButton({
  href,
  target,
  download,
  className,
  children
}: ButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      download={download}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-sm px-[20px] py-[10px] text-sm font-[500] shadow-sm",
        className
      )}>
      {children}
    </Link>
  );
}
