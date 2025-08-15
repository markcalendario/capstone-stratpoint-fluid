"use client";

import Dropdown from "@/components/ui/dropdowns/drop-down";
import { AddTeamMemberModal } from "@/components/ui/modals/add-team-member-modal";
import { DeleteProjectModal } from "@/components/ui/modals/delete-project-modal";
import { EditProjectModal } from "@/components/ui/modals/edit-project-modal";
import { ProjectSchema } from "@/types/projects";
import { Edit, MoreVertical, Trash, UserPlus, Users } from "lucide-react";
import { Fragment, useState } from "react";

interface ProjectActionButtons {
  projectId: ProjectSchema["id"];
}

export default function ProjectActionButtons({
  projectId
}: ProjectActionButtons) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleInviteModal = () => setIsInviteModalOpen((prev) => !prev);

  return (
    <Fragment>
      <div className="flex items-center justify-end space-x-1">
        <Dropdown
          label={<Users size={20} />}
          items={[
            {
              href: `/team?projectId=${projectId}`,
              label: "View Team",
              icon: Users
            },
            {
              onClick: toggleInviteModal,
              label: "Invite to Team",
              icon: UserPlus
            }
          ]}
          className="cursor-pointer p-2 text-neutral-700 dark:text-neutral-300"
        />
        <Dropdown
          label={<MoreVertical size={20} />}
          items={[
            { onClick: toggleEditModal, label: "Edit Project", icon: Edit },
            {
              onClick: toggleDeleteModal,
              label: "Delete Project",
              icon: Trash
            }
          ]}
          className="cursor-pointer p-2 text-neutral-700 dark:text-neutral-300"
        />
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
