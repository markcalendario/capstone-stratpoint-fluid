import { ProjectSchema } from "@/types/projects";
import { Activity, Minus } from "lucide-react";

interface ActiveIndicatorProps {
  isActive: ProjectSchema["isActive"];
}

export default function ActiveIndicator({ isActive }: ActiveIndicatorProps) {
  if (isActive) {
    return (
      <p className="flex items-center gap-1 bg-red-500/20 px-2 py-1 text-[10px] text-red-500">
        <Minus size={11} />
        Inactive
      </p>
    );
  }

  return (
    <p className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 text-[10px] text-blue-500">
      <Activity size={11} />
      Active
    </p>
  );
}
