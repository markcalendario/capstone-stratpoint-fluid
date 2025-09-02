import { toTitleCase } from "@/lib/utils/formatters";
import { ProjectOption as IProjectOption } from "@/types/projects";
import { Maximize, Minimize } from "lucide-react";
import Image from "next/image";

interface ProjectOptionProps extends IProjectOption {
  selectProject?: (project: IProjectOption) => void;
  deselectProject?: () => void;
}

export default function ProjectOption({
  id,
  name,
  imageUrl,
  projectType,
  selectProject,
  deselectProject
}: ProjectOptionProps) {
  const handleClick = () => {
    if (selectProject) selectProject({ id, name, imageUrl, projectType });
    else if (deselectProject) deselectProject();
  };

  return (
    <div
      onClick={handleClick}
      className="group flex cursor-pointer items-center justify-between rounded-xs bg-neutral-900/5 p-4 duration-100 hover:bg-neutral-900/10 dark:bg-neutral-100/5 dark:hover:bg-neutral-100/5">
      <div className="flex flex-wrap items-center gap-3">
        {/* Image */}
        <div className="relative aspect-square h-8 w-8">
          <Image
            fill
            alt={name}
            src={imageUrl}
            className="rounded-xs object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="space-y-1">
          <p className="group-hover:text-primary leading-none font-bold text-neutral-700 dark:text-neutral-300 dark:group-hover:text-neutral-100">
            {name}
          </p>
          <p className="text-xs leading-[10px] text-neutral-700 dark:text-neutral-300">
            {toTitleCase(projectType)}
          </p>
        </div>
      </div>

      {selectProject && (
        <Maximize className="text-neutral-700 dark:text-neutral-300" />
      )}

      {deselectProject && (
        <Minimize className="text-neutral-700 dark:text-neutral-300" />
      )}
    </div>
  );
}
