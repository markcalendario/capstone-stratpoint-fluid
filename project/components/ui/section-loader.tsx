import { LoaderCircle } from "lucide-react";

interface SectionLoaderProps {
  text: string;
}

export default function SectionLoader({ text }: SectionLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-[20px]">
      <LoaderCircle
        size={50}
        className="animate-spin text-neutral-900/10 dark:text-neutral-100/10"
      />
      <p className="text-md font-medium text-neutral-900/20 select-none dark:text-neutral-100/20">
        {text}
      </p>
    </div>
  );
}
