"use client";

import Dropdown from "@/components/ui/dropdowns/drop-down";
import { AddTeamMemberModal } from "@/components/ui/modals/add-team-member-modal";
import { DeleteProjectModal } from "@/components/ui/modals/delete-project-modal";
import { EditProjectModal } from "@/components/ui/modals/edit-project-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { ProjectSchema } from "@/types/projects";
import { Edit, MoreVertical, Trash, UserPlus, Users } from "lucide-react";
import { Fragment, useState } from "react";

interface ProjectActionButtonsProps {
  projectId: ProjectSchema["id"];
}

export default function ProjectActionButtons({
  projectId
}: ProjectActionButtonsProps) {
  const { permissionsData } = usePermissions(projectId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleInviteModal = () => setIsInviteModalOpen((prev) => !prev);

  const permissions = permissionsData?.permissions;
  const canViewTeam = permissions?.includes(PERMISSION.VIEW_PROJECT_MEMBER);
  const canInvite = permissions?.includes(PERMISSION.CREATE_PROJECT_MEMBER);
  const canEdit = permissions?.includes(PERMISSION.EDIT_PROJECT);
  const canDelete = permissions?.includes(PERMISSION.DELETE_PROJECT);

  const teamItems = [];
  if (canViewTeam) {
    teamItems.push({
      href: `/team?projectId=${projectId}`,
      label: "View Team",
      icon: Users
    });
  }
  if (canInvite) {
    teamItems.push({
      onClick: toggleInviteModal,
      label: "Invite to Team",
      icon: UserPlus
    });
  }

  const projectItems = [];
  if (canEdit) {
    projectItems.push({
      onClick: toggleEditModal,
      label: "Edit Project",
      icon: Edit
    });
  }
  if (canDelete) {
    projectItems.push({
      onClick: toggleDeleteModal,
      label: "Delete Project",
      icon: Trash
    });
  }

  return (
    <Fragment>
      <div className="flex items-center justify-end space-x-1">
        {!!teamItems.length && (
          <Dropdown
            label={<Users size={16} />}
            items={teamItems}
            className="cursor-pointer p-1 text-neutral-700 dark:text-neutral-300"
          />
        )}

        {!!projectItems.length && (
          <Dropdown
            label={<MoreVertical size={16} />}
            items={projectItems}
            className="cursor-pointer p-1 text-neutral-700 dark:text-neutral-300"
          />
        )}
      </div>

      {isDeleteModalOpen && (
        <DeleteProjectModal
          projectId={projectId}
          toggle={toggleDeleteModal}
        />
      )}

      {isEditModalOpen && (
        <EditProjectModal
          projectId={projectId}
          toggle={toggleEditModal}
        />
      )}

      {isInviteModalOpen && (
        <AddTeamMemberModal
          preSelectedId={projectId}
          toggle={toggleInviteModal}
        />
      )}
    </Fragment>
  );
}
