import { LoaderCircle } from "lucide-react";

interface SectionLoaderProps {
  text: string;
}

export default function SectionLoader({ text }: SectionLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-[20px]">
      <LoaderCircle
        size={50}
        className="animate-spin text-neutral-600 dark:text-neutral-400"
      />
      <p className="text-md text-neutral-600 dark:text-neutral-400">{text}</p>
    </div>
  );
}
