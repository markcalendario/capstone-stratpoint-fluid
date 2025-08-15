import { ProjectOption as IProjectOption } from "@/types/projects";
import { Box, Maximize, Minimize } from "lucide-react";

interface ProjectOptionProps extends IProjectOption {
  selectProject?: (project: IProjectOption) => void;
  deselectProject?: () => void;
}

export default function ProjectOption({
  id,
  name,
  selectProject,
  deselectProject
}: ProjectOptionProps) {
  return (
    <div className="flex items-center justify-between rounded-sm bg-neutral-100 p-4 dark:bg-neutral-900">
      <div className="flex flex-wrap items-center gap-3">
        <Box className="text-neutral-700 dark:text-neutral-300" />
        <div className="grid gap-1">
          <p className="leading-[15px] text-neutral-700 dark:text-neutral-300">
            {name}
          </p>
          <p className="text-xs leading-[10px] text-neutral-700 dark:text-neutral-300">
            {id}
          </p>
        </div>
      </div>

      {selectProject && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => selectProject({ id, name })}>
          <Maximize className="text-neutral-700 dark:text-neutral-300" />
        </button>
      )}

      {deselectProject && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={deselectProject}>
          <Minimize className="text-neutral-700 dark:text-neutral-300" />
        </button>
      )}
    </div>
  );
}
