"use client";

import { cn } from "@/lib/utils";
import { ProjectCardData as IProjectCard } from "@/types/projects";
import Image from "next/image";
import Link from "next/link";
import ActiveIndicator from "./active-indicator";
import ProjectCardDropdown from "./dropdowns/project-card-dropdown";
import DueDateTab from "./due-date-tab";
import PriorityTab from "./priority-tab";
import UserImagesStack from "./user-images-stack";

interface ProjectCardProps extends IProjectCard {
  className?: string;
}

export default function ProjectCard({
  id,
  name,
  imageUrl,
  isActive,
  progress,
  className,
  isOverdue,
  description,
  memberImages,
  daysRemaining
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "ring-primary/20 relative block rounded-sm p-5 ring-2 ring-inset",
        className
      )}>
      <ProjectCardDropdown id={id} />

      {/* Primary Info */}
      <Link
        href={`/projects/${id}`}
        className="flex items-start gap-2">
        {/* Image */}
        <div className="relative aspect-square h-8 w-8">
          <Image
            fill
            alt={name}
            src={imageUrl}
            className="rounded-sm object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Info */}
        <div className="">
          <p className="leading-none font-bold text-neutral-900 dark:text-neutral-100">
            {name}
          </p>
          <p className="mt-1 text-sm leading-none text-neutral-700 dark:text-neutral-300">
            {description}
          </p>
        </div>
      </Link>
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {/* Indicators */}
        <div className="flex items-center gap-1">
          <DueDateTab
            isOverdue={isOverdue}
            daysRemaining={daysRemaining}
          />
          <ActiveIndicator isActive={isActive} />
          <PriorityTab priority="low" />
        </div>

        {/* Members Images */}
        <UserImagesStack
          show={5}
          images={memberImages}
        />
      </div>
    </div>
  );
}
