import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { MEMBERSHIP_STATUS } from "@/lib/utils/projectMembers";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { Crown, MoreHorizontal, UserX } from "lucide-react";
import { Fragment, useState } from "react";
import EditMemberRoleModal from "../modals/edit-member-role-modal";
import RemoveMemberModal from "../modals/remove-member-modal";
import Dropdown, { DropdownItem } from "./drop-down";

interface TeamCardDropdownProps {
  userId: UserSchema["id"];
  projectId: ProjectSchema["id"];
  membershipStatus: (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];
}

export default function TeamCardDropdown({
  userId,
  projectId,
  membershipStatus
}: TeamCardDropdownProps) {
  const { permissionsData } = usePermissions(projectId);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [isEditMemberRoleModalOpen, setIsEditMemberRoleModalOpen] =
    useState(false);

  const isOwner = membershipStatus === MEMBERSHIP_STATUS.OWNER;

  const permissions = permissionsData?.permissions;
  const canEditMember = permissions?.includes(PERMISSION.EDIT_PROJECT_MEMBER);
  const canKickMember = permissions?.includes(PERMISSION.DELETE_PROJECT_MEMBER);

  const toggleRemoveMemberModal = () =>
    setIsRemoveMemberModalOpen((prev) => !prev);

  const toggleEditMemberRoleModal = () =>
    setIsEditMemberRoleModalOpen((prev) => !prev);

  const items: DropdownItem[] = [];

  if (canEditMember) {
    items.push({
      onClick: toggleEditMemberRoleModal,
      label: "Change Role",
      icon: Crown
    });
  }

  if (canKickMember) {
    items.push({
      onClick: toggleRemoveMemberModal,
      label: "Remove from Team",
      icon: UserX
    });
  }

  return (
    <Fragment>
      {!isOwner && !!items.length && (
        <Dropdown
          className="cursor-pointer rounded p-1 hover:bg-gray-200 dark:text-neutral-200 dark:hover:bg-gray-700"
          label={<MoreHorizontal size={16} />}
          items={items}
        />
      )}

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
