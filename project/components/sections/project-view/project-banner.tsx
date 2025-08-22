"use client";

import UserImagesStack from "@/components/ui/user-images-stack";
import { toTitleCase } from "@/lib/utils/formatters";
import { ProjectInfo } from "@/types/projects";
import { Box, Calendar, Crown, Users } from "lucide-react";
import Image from "next/image";
import ProjectActionButtons from "./project-action-buttons";

interface ProjectBannerProps extends ProjectInfo {}

export default function ProjectBanner({
  id,
  name,
  dueDate,
  imageUrl,
  ownerImage,
  projectType,
  description,
  memberImages
}: ProjectBannerProps) {
  return (
    <div className="ring-primary/20 space-y-3 rounded-sm bg-white p-3 ring-2 ring-inset md:p-7 dark:bg-neutral-800">
      <div className="flex flex-wrap items-start justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={imageUrl}
            width={50}
            height={50}
            alt={name}
            className="aspect-square"
          />
          <div className="space-y-1">
            <h1 className="text-primary text-xl leading-none font-bold tracking-tight md:text-3xl dark:text-neutral-100">
              {name}
            </h1>
            <p className="leading-none text-neutral-700 dark:text-neutral-300">
              {description}
            </p>
          </div>
        </div>
        <ProjectActionButtons projectId={id} />
      </div>

      <div className="flex flex-wrap gap-2 text-sm md:gap-4">
        <p className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Calendar size={14} />
          {dueDate}
        </p>
        <p className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Box size={14} />
          {toTitleCase(projectType)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Crown size={14} />
          <UserImagesStack
            show={1}
            images={[ownerImage]}
          />
        </div>
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Users size={14} />
          <UserImagesStack
            show={7}
            images={memberImages}
          />
        </div>
      </div>
    </div>
  );
}
