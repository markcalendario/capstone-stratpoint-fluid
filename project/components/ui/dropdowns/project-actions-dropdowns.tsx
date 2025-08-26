"use client";

import Dropdown from "@/components/ui/dropdowns/drop-down";
import { AddTeamMemberModal } from "@/components/ui/modals/add-team-member-modal";
import { DeleteProjectModal } from "@/components/ui/modals/delete-project-modal";
import { EditProjectModal } from "@/components/ui/modals/edit-project-modal";
import { ProjectSchema } from "@/types/projects";
import { Edit, MoreVertical, Trash, UserPlus, Users } from "lucide-react";
import { Fragment, useState } from "react";

interface ProjectActionButtonsProps {
  canEdit: boolean;
  canDelete: boolean;
  canViewTeam: boolean;
  canInviteToTeam: boolean;
  projectId: ProjectSchema["id"];
}

export default function ProjectActionButtons({
  canEdit,
  canDelete,
  canViewTeam,
  canInviteToTeam,
  projectId
}: ProjectActionButtonsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleInviteModal = () => setIsInviteModalOpen((prev) => !prev);

  const teamItems = [];
  if (canViewTeam) {
    teamItems.push({
      href: `/team?projectId=${projectId}`,
      label: "View Team",
      icon: Users
    });
  }
  if (canInviteToTeam) {
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
