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
        className="text-neutral-600 dark:text-neutral-400"
      />
      <p className="text-md font-medium text-neutral-600 dark:text-neutral-400">
        {text}
      </p>
    </div>
  );
}
