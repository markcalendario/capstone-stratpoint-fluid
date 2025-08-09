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
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </Select>
  );
}
