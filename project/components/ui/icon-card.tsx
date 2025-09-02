import { cn } from "@/lib/utils/tailwind";
import { LucideIcon } from "lucide-react";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export default function IconCard({
  icon: Icon,
  title,
  description,
  className
}: IconCardProps) {
  return (
    <div
      className={cn(
        className,
        "bg-neutal-800 ring-primary/20 w-full overflow-hidden rounded-xs bg-white p-[35px] ring-1 dark:bg-neutral-900"
      )}>
      <div
        data-aos="fade-right"
        data-aos-delay="200"
        className="relative mb-[20px] aspect-5/1 max-w-[150px]">
        <Icon
          size={50}
          className="text-primary bg-primary/20 p-3 dark:text-white"
        />
      </div>

      <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
      <p className="text-justify text-neutral-700 dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
}
