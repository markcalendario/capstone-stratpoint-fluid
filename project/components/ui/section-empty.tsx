import { LucideIcon } from "lucide-react";

interface SectionLoaderProps {
  icon: LucideIcon;
  text: string;
}

export default function SectionEmpty({ icon: Icon, text }: SectionLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-[20px]">
      <Icon
        size={50}
        className="text-neutral-900/10 dark:text-neutral-100/10"
      />
      <p className="text-md font-medium text-neutral-900/20 select-none dark:text-neutral-100/20">
        {text}
      </p>
    </div>
  );
}
