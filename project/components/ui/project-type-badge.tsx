import { cn } from "@/lib/utils";
import { projectTypes } from "@/lib/utils/constants";
import { toTitleCase } from "@/lib/utils/formatters";

type ProjectType = (typeof projectTypes)[number];

interface ProjectTypeBadgeProps {
  type: ProjectType;
}

const projectTypeColors: Record<ProjectType, string> = {
  "development":
    "text-indigo-600 bg-indigo-600/20 dark:text-indigo-300 dark:bg-indigo-700/20",
  "design":
    "text-pink-600 bg-pink-600/20 dark:text-pink-300 dark:bg-pink-700/20",
  "quality assurance":
    "text-green-600 bg-green-600/20 dark:text-green-300 dark:bg-green-700/20",
  "testing":
    "text-yellow-600 bg-yellow-600/20 dark:text-yellow-300 dark:bg-yellow-700/20",
  "devops":
    "text-blue-600 bg-blue-600/20 dark:text-blue-300 dark:bg-blue-700/20",
  "data":
    "text-emerald-600 bg-emerald-600/20 dark:text-emerald-300 dark:bg-emerald-700/20",
  "artificial intelligence":
    "text-purple-600 bg-purple-600/20 dark:text-purple-300 dark:bg-purple-700/20",
  "maintenance":
    "text-gray-600 bg-gray-600/20 dark:text-gray-300 dark:bg-gray-700/20"
};

export default function ProjectTypeBadge({ type }: ProjectTypeBadgeProps) {
  return (
    <span
      className={cn(
        projectTypeColors[type],
        "inline-block rounded-sm border border-current px-2 py-1 text-[10px] font-medium"
      )}>
      {toTitleCase(type)}
    </span>
  );
}
