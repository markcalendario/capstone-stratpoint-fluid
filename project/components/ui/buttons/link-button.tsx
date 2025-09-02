import { cn } from "@/lib/utils/tailwind";
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
        "inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-xs px-[20px] py-[10px] text-xs font-[500]",
        className
      )}>
      {children}
    </Link>
  );
}
