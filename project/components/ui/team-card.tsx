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
  membershipStatus: (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];
}

export default function TeamCard({
  imageUrl,
  name,
  role,
  email,
  projectsCount,
  membershipStatus,
  className
}: TeamCardProps) {
  const statusClassMap = {
    [MEMBERSHIP_STATUS.ACCEPTED]:
      "bg-green-200 text-green-700 dark:bg-green-700/50 dark:text-green-200",
    [MEMBERSHIP_STATUS.DECLINED]:
      "bg-red-200 text-red-700 dark:bg-red-700/50 dark:text-red-200",
    [MEMBERSHIP_STATUS.OWNER]:
      "bg-blue-200 text-blue-700 dark:bg-blue-700/50 dark:text-blue-200",
    [MEMBERSHIP_STATUS.INVITED]:
      "bg-yellow-200 text-yellow-700 dark:bg-yellow-700/50 dark:text-yellow-200"
  };

  return (
    <div className={cn("border-primary/20 rounded-sm border", className)}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative aspect-square w-12 overflow-hidden rounded-full">
            <Image
              fill
              alt={name}
              src={imageUrl}
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
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
        {email}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={cn(
            statusClassMap[membershipStatus],
            "rounded-full px-3 py-1 text-xs font-medium"
          )}>
          {membershipStatus}
        </span>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {projectsCount} projects
        </div>
      </div>
    </div>
  );
}
