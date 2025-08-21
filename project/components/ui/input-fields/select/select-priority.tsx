import { priority } from "@/lib/utils/constants";
import { toTitleCase } from "@/lib/utils/formatters";
import { SelectHTMLAttributes } from "react";
import Select from "./select";

interface SelectPriorityProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
}

export default function SelectPriority({
  id,
  label,
  onChange,
  ...props
}: SelectPriorityProps) {
  return (
    <Select
      id={id}
      label={label}
      {...props}
      onChange={onChange}>
      <option value="">Select Priority</option>
      {priority.map((priority) => (
        <option
          key={priority}
          value={priority}>
          {toTitleCase(priority)}
        </option>
      ))}
    </Select>
  );
}
