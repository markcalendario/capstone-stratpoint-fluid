import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface WYSIWYGEditorProps {
  id: string;
  name: string;
  value: string;
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function RichTextEditor({
  id,
  name,
  label,
  value,
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
      <label
        htmlFor={id}
        className="font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </label>

      <ReactQuill
        value={value}
        onChange={handleChange}
        className="border-primary/20 dark:border-primary/50 [&_.ql-toolbar]:bg-primary [&_svg]:svg-white rounded-sm border-2 *:!border-none *:!text-base *:!font-medium dark:text-neutral-300 [&_.ql-header]:!text-white [&_.ql-header_.ql-active]:!text-white [&_.ql-header_.ql-picker-label]:hover:!text-white [&_.ql-toolbar]:!rounded-t-xs"
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
