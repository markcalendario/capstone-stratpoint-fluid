"use client";

import Dropdown from "@/components/dropdowns/drop-down";
import { DeleteProjectModal } from "@/components/modals/delete-project-modal";
import { EditProjectModal } from "@/components/modals/edit-project-modal";
import LinkButton from "@/components/ui/buttons/link-button";
import { ProjectSchema } from "@/types/projects";
import { Calendar, Edit, Ellipsis, Settings, Trash, Users } from "lucide-react";
import { Fragment, useState } from "react";

interface ProjectActionButtons {
  projectId: ProjectSchema["id"];
}

export default function ProjectActionButtons({
  projectId
}: ProjectActionButtons) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

  return (
    <Fragment>
      <div className="flex items-center justify-end space-x-2">
        <LinkButton
          href="#"
          className="bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300">
          <Users size={20} />
        </LinkButton>
        <LinkButton
          href="#"
          className="bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300">
          <Calendar size={20} />
        </LinkButton>
        <LinkButton
          href="#"
          className="bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300">
          <Settings size={20} />
        </LinkButton>
        <Dropdown
          label={<Ellipsis />}
          items={[
            { onClick: toggleEditModal, label: "Edit Project", icon: Edit },
            {
              onClick: toggleDeleteModal,
              label: "Delete Project",
              icon: Trash
            }
          ]}
          className="inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-sm bg-neutral-50 px-[20px] py-[10px] text-sm font-[500] shadow-sm dark:bg-neutral-800 dark:text-neutral-300"
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
    </Fragment>
  );
}
