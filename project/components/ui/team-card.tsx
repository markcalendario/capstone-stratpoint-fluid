import { cn } from "@/lib/utils";
import { MEMBERSHIP_STATUS } from "@/lib/utils/projectMembers";
import { ProjectSchema } from "@/types/projects";
import { TeamRoles } from "@/types/teamRoles";
import { UserSchema } from "@/types/users";
import { Crown, Mail, MoreHorizontal, UserX } from "lucide-react";
import Image from "next/image";
import { Fragment, useState } from "react";
import Badge from "./badge";
import Dropdown from "./dropdowns/drop-down";
import EditMemberRoleModal from "./modals/edit-member-role-modal";
import RemoveMemberModal from "./modals/remove-member-modal";

interface TeamCardProps extends Pick<UserSchema, "name" | "email"> {
  userId: UserSchema["id"];
  projectId: ProjectSchema["id"];
  role: TeamRoles["title"];
  className?: string;
  projectsCount: number;
  imageUrl: UserSchema["imageUrl"];
  tasksDoneCount: number;
  tasksUndoneCount: number;
  membershipStatus: (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];
}

export default function TeamCard({
  userId,
  projectId,
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
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [isEditMemberRoleModalOpen, setIsEditMemberRoleModalOpen] =
    useState(false);

  const toggleRemoveMemberModal = () =>
    setIsRemoveMemberModalOpen((prev) => !prev);

  const toggleEditMemberRoleModal = () =>
    setIsEditMemberRoleModalOpen((prev) => !prev);

  let dropdownActions;

  if (membershipStatus === MEMBERSHIP_STATUS.OWNER) {
    dropdownActions = [{ href: "#", label: "Owner", icon: Crown }];
  } else {
    dropdownActions = [
      {
        onClick: toggleEditMemberRoleModal,
        label: "Change Role",
        icon: Crown
      },
      {
        onClick: toggleRemoveMemberModal,
        label: "Remove from Team",
        icon: UserX
      }
    ];
  }

  return (
    <Fragment>
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

          <Dropdown
            className="cursor-pointer rounded p-1 hover:bg-gray-200 dark:text-neutral-200 dark:hover:bg-gray-700"
            label={<MoreHorizontal size={16} />}
            items={dropdownActions}
          />
        </div>

        <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Mail
            size={16}
            className="mr-2"
          />
          <p className="line-clamp-1 break-all">{email}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1">
          <Badge type="gray">
            {`${tasksDoneCount} / ${tasksDoneCount + tasksUndoneCount} tasks done`}
          </Badge>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {projectsCount} projects
          </div>
        </div>
      </div>

      {isRemoveMemberModalOpen && (
        <RemoveMemberModal
          userId={userId}
          projectId={projectId}
          toggle={toggleRemoveMemberModal}
        />
      )}

      {isEditMemberRoleModalOpen && (
        <EditMemberRoleModal
          userId={userId}
          projectId={projectId}
          toggle={toggleEditMemberRoleModal}
        />
      )}
    </Fragment>
  );
}
