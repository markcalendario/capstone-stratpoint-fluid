import { cn } from "@/lib/utils/tailwind";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { JSX } from "react";

type AlertType = "info" | "success" | "warning" | "error" | "gray";

interface AlertProps {
  type?: AlertType;
  title?: string;
  description?: string;
}

const alertStyles: Record<AlertType, { color: string; icon: JSX.Element }> = {
  gray: {
    color:
      "bg-neutral-700/5 dark:text-neutral-400 dark:bg-neutral-400/5 dark:border-neutral-400 text-neutral-700 border-neutral-700",
    icon: <Info className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
  },
  info: {
    color: "bg-blue-400/5 text-blue-500 border-blue-500",
    icon: <Info className="h-5 w-5 text-blue-500" />
  },
  success: {
    color: "bg-green-500/5 text-green-600 border-green-600",
    icon: (
      <CheckCircle
        size={16}
        className="h-5 w-5 text-green-600"
      />
    )
  },
  warning: {
    color: "bg-yellow-500/5 text-yellow-600 border-yellow-600",
    icon: <AlertTriangle className="text-yellow-600" />
  },
  error: {
    color: "bg-red-500/5 text-red-600 border-red-600",
    icon: <XCircle className="h-5 w-5 text-red-600" />
  }
};

export default function Alert({
  type = "info",
  title,
  description
}: AlertProps) {
  const { color, icon } = alertStyles[type];

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-sm border p-4",
        color
      )}>
      <div>{icon}</div>
      <div>
        <p className="leading-5 font-semibold">{title}</p>
        {description && <p className="text-sm leading-5">{description}</p>}
      </div>
    </div>
  );
}
