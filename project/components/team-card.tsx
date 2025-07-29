import { cn } from "@/lib/utils";
import { UserSchema } from "@/types/users";
import { Mail, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface TeamCardProps extends Pick<UserSchema, "name" | "email"> {
  role: string;
  className?: string;
  projectsCount: number;
  profilePictureUrl: string;
}

export default function TeamCard({
  profilePictureUrl,
  name,
  role,
  email,
  projectsCount,
  className
}: TeamCardProps) {
  return (
    <div className={cn("border-primary/20 rounded-sm border", className)}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative aspect-square w-12 overflow-hidden rounded-full">
            <Image
              fill
              alt={name}
              src={profilePictureUrl}
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
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
          Active
        </span>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {projectsCount} projects
        </div>
      </div>
    </div>
  );
}
