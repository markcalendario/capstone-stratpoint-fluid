import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Info as InfoIcon,
  XCircle
} from "lucide-react"; // Replace with your icon system
import { JSX } from "react";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
  type?: AlertType;
  title: string;
  description?: string;
}

const alertStyles: Record<AlertType, { color: string; icon: JSX.Element }> = {
  info: {
    color: "bg-blue-500/5 text-blue-600 border-blue-600",
    icon: <InfoIcon className="h-5 w-5 text-blue-600" />
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
        {description && <p className="mt-1 text-sm leading-5">{description}</p>}
      </div>
    </div>
  );
}
