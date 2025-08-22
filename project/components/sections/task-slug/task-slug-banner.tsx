import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import Badge from "@/components/ui/badge";
import UserImagesStack from "@/components/ui/user-images-stack";
import { priorityColors } from "@/lib/utils/constants";
import { toTitleCase } from "@/lib/utils/formatters";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { UserSchema } from "@/types/users";
import { Play, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TaskSlugBannerProps {
  dueDate: string;
  createdAt: string;
  isOverdue: boolean;
  remainingDays: string;
  label: TaskSchema["label"];
  title: TaskSchema["title"];
  projectId: ProjectSchema["id"];
  priority: TaskSchema["priority"];
  projectName: ProjectSchema["name"];
  assigneesImages: UserSchema["imageUrl"][];
  projectImageUrl: ProjectSchema["imageUrl"];
}

export default function TaskSlugBanner({
  projectId,
  priority,
  remainingDays,
  title,
  label,
  isOverdue,
  dueDate,
  createdAt,
  assigneesImages,
  projectName,
  projectImageUrl
}: TaskSlugBannerProps) {
  return (
    <DashboardContent>
      <div className="ring-primary/20 rounded-xs bg-white p-3 ring-2 ring-inset md:p-5 dark:bg-neutral-800 dark:text-neutral-100">
        <div className="space-y-3">
          <div className="flex gap-1">
            <Badge type={priorityColors[priority]}>
              {toTitleCase(priority)}
            </Badge>
            <Badge type={isOverdue ? "error" : "warning"}>
              {remainingDays}
            </Badge>
            {label && <Badge type="gray">{label}</Badge>}
          </div>

          <p className="text-primary text-xl leading-none font-bold md:text-2xl dark:text-neutral-100">
            {title}
          </p>

          <div className="flex gap-3 text-sm">
            <p className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
              <Play size={14} />
              {createdAt}
            </p>
            <p className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
              <Square size={14} />
              {dueDate}
            </p>
          </div>

          <div className="flex gap-3">
            <UserImagesStack
              show={5}
              images={assigneesImages}
            />

            <div className="flex items-center gap-1">
              <Image
                width={25}
                height={25}
                alt="project"
                className="rounded-xs"
                src={projectImageUrl}
              />

              <Link
                href={`/projects/${projectId}`}
                className="text-sm text-neutral-700 dark:text-neutral-300">
                {projectName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}
