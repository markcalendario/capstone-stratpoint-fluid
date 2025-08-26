import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import Badge from "@/components/ui/badge";
import UserImagesStack from "@/components/ui/user-images-stack";
import { priorityColors } from "@/lib/utils/constants";
import { toTitleCase } from "@/lib/utils/formatters";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { UserSchema } from "@/types/users";
import { Clock, Pin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TaskSettingsDropdown from "../../ui/dropdowns/task-settings-dropdown";

interface TaskSlugBannerProps {
  id: TaskSchema["id"];
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
  id,
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
    <DashboardContent
      tight
      className="ring-primary/20 bg-white ring-2 dark:bg-neutral-800">
      <div className="space-y-3">
        <div className="flex gap-1">
          <Badge type={priorityColors[priority]}>{toTitleCase(priority)}</Badge>
          <Badge type={isOverdue ? "error" : "warning"}>{remainingDays}</Badge>
          {label && <Badge type="gray">{label}</Badge>}
        </div>

        <p className="text-primary text-xl leading-none font-bold md:text-3xl dark:text-neutral-100">
          {title}
        </p>

        <div className="flex gap-3 text-sm">
          <p className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
            <Pin size={14} />
            {createdAt}
          </p>
          <p className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
            <Clock size={14} />
            {dueDate}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
            <UserImagesStack
              show={10}
              images={assigneesImages}
            />
            <TaskSettingsDropdown
              taskId={id}
              projectId={projectId}
            />
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}
