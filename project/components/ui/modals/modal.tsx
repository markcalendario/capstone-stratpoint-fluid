import { X } from "lucide-react";

interface ModalProps {
  toggle: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal({ toggle, children, title }: ModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xs bg-white shadow-xl dark:bg-neutral-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xs border-b border-neutral-200 bg-white px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            {title}
          </h3>
          <button
            onClick={toggle}
            className="cursor-pointer rounded-xs p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
