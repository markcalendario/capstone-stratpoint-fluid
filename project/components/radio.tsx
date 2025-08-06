import type { LucideIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface RadioCardProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export default function Radio({
  id,
  name,
  value,
  title,
  description,
  icon: Icon,
  ...props
}: RadioCardProps) {
  return (
    <div>
      <input
        id={id}
        name={name}
        value={value}
        type="radio"
        className="peer hidden"
        {...props}
      />
      <label
        htmlFor={id}
        className="border-primary/20 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary dark:peer-checked:border-primary/50 inline-flex w-full cursor-pointer items-center justify-between rounded-sm border-2 text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:peer-checked:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300">
        <div className="flex items-start space-x-3 p-2">
          {Icon && (
            <Icon
              size={16}
              className="mt-1"
            />
          )}
          <div>
            <div className="font-semibold">{title}</div>
            {description && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {description}
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );
}
