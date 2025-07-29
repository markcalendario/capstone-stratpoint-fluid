import { X } from "lucide-react";

interface Modal {
  toggle: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal({ toggle, children, title }: Modal) {
  return (
    <div className="bg-opacity-50 fixed top-0 left-0 z-[2] flex h-screen w-full items-center justify-center bg-black/75 p-2">
      <div className="max-h-[90vh] w-[700px] overflow-auto rounded-sm bg-white p-6 dark:bg-neutral-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="dark:text-platinum-500 text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            {title}
          </h3>
          <button
            onClick={toggle}
            className="cursor-pointer rounded p-1 text-neutral-900 dark:text-neutral-100">
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
