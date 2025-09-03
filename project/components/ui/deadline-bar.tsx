import { toTitleCase } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/tailwind";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { Box, Grid2X2Check } from "lucide-react";
import Link from "next/link";
import Badge from "./badge";

interface DeadlineBarProps {
  title: string;
  daysRemaining: string;
  type: "project" | "task";
  id: ProjectSchema["id"] | TaskSchema["id"];
  className?: string;
}

export default function DeadlineBar({
  id,
  title,
  type,
  daysRemaining,
  className
}: DeadlineBarProps) {
  const url = `/${type === "project" ? "projects" : "tasks"}/${id}`;

  return (
    <Link
      href={url}
      target="_blank"
      className={cn(
        "outline-primary/20 flex items-end justify-between rounded-xs p-5 outline-1",
        className
      )}>
      <div>
        <p className="flex items-center gap-2 text-xl font-bold text-neutral-700 dark:text-neutral-200">
          {title}
        </p>

        <div className="flex gap-1">
          {type === "task" && (
            <Badge
              type="gray"
              className="inline-flex items-center gap-1 text-[12px]">
              <Grid2X2Check size={11} />
              {toTitleCase(type)}
            </Badge>
          )}

          {type === "project" && (
            <Badge
              type="error"
              className="inline-flex items-center gap-1 text-[12px]">
              <Box size={11} />
              {toTitleCase(type)}
            </Badge>
          )}

          <Badge
            type="warning"
            className="text-[12px]">
            {daysRemaining}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
