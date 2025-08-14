import { cn } from "@/lib/utils";
import { MEMBERSHIP_STATUS } from "@/lib/utils/teams";
import { TeamRoles } from "@/types/teamRoles";
import { UserSchema } from "@/types/users";
import { Mail, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface TeamCardProps extends Pick<UserSchema, "name" | "email"> {
  role: TeamRoles["title"];
  className?: string;
  projectsCount: number;
  imageUrl: UserSchema["imageUrl"];
  tasksDoneCount: number;
  tasksUndoneCount: number;
  membershipStatus: (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];
}

export default function TeamCard({
  imageUrl,
  name,
  role,
  email,
  projectsCount,
  tasksDoneCount,
  tasksUndoneCount,
  membershipStatus,
  className
}: TeamCardProps) {
  return (
    <div className={cn("border-primary/20 rounded-sm border", className)}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="ring-primary relative aspect-square w-10 overflow-hidden rounded-full ring-1">
            <Image
              fill
              alt={name}
              src={imageUrl}
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="line-clamp-1 font-semibold text-gray-800 dark:text-gray-100">
              {name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {role} • {membershipStatus}
            </p>
          </div>
        </div>
        <button className="cursor-pointer rounded p-1 hover:bg-gray-200 dark:text-neutral-200 dark:hover:bg-gray-700">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Mail
          size={16}
          className="mr-2"
        />
        <p className="line-clamp-1 break-all">{email}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1">
        <div className="flex flex-wrap gap-1">
          <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
            {`${tasksDoneCount} / ${tasksDoneCount + tasksUndoneCount} tasks done`}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {projectsCount} projects
        </div>
      </div>
    </div>
  );
}
