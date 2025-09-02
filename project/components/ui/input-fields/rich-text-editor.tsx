import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface WYSIWYGEditorProps {
  id: string;
  name: string;
  value: string;
  label?: string;
  required?: boolean;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function RichTextEditor({
  id,
  name,
  label,
  value,
  required,
  onChange
}: WYSIWYGEditorProps) {
  const handleChange = (content: string) => {
    const fakeEvent = {
      target: { name, value: content }
    } as ChangeEvent<HTMLInputElement>;

    onChange(fakeEvent);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center justify-between gap-1">
        {label && (
          <label
            htmlFor={id}
            className="font-medium text-neutral-500 dark:text-neutral-400">
            {label}
          </label>
        )}

        {!required && (
          <p className="p-1 text-xs text-neutral-500 dark:text-neutral-400">
            Optional
          </p>
        )}
      </div>

      <ReactQuill
        value={value}
        onChange={handleChange}
        className="border-primary [&_svg]:!svg-neutral-900 dark:[&_svg]:!svg-neutral-100 rounded-sm border-1 *:!border-none *:!text-base *:!font-medium dark:text-neutral-300 [&_.ql-header]:!text-neutral-100 [&_.ql-picker-item]:!text-neutral-900 dark:[&_.ql-picker-item]:!text-neutral-100 [&_.ql-picker-label]:!text-neutral-900 [&_.ql-picker-label]:!opacity-50 dark:[&_.ql-picker-label]:!text-neutral-100 dark:[&_.ql-picker-options]:!bg-neutral-800 [&_.ql-toolbar]:!rounded-t-xs [&_.ql-toolbar]:bg-white dark:[&_.ql-toolbar]:bg-neutral-800 [&_svg]:opacity-50"
        theme="snow"
      />

      {/* Hidden input to make it submit with FormData */}
      <input
        id={id}
        type="hidden"
        name={name}
        value={value}
      />
    </div>
  );
}
