"use client";

import { ProjectSchema } from "@/types/projects";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { DeleteProjectModal } from "../modals/delete-project-modal";
import { EditProjectModal } from "../modals/edit-project-modal";
import Dropdown from "./drop-down";

interface ProjectCardDropdownProps {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  id: ProjectSchema["id"];
}

export default function ProjectCardDropdown({
  canView,
  canEdit,
  canDelete,
  id
}: ProjectCardDropdownProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const dropdownItems = [];

  if (canView) {
    dropdownItems.push({
      href: `/projects/${id}`,
      label: "View",
      icon: Eye
    });
  }

  if (canEdit) {
    dropdownItems.push({
      onClick: toggleEditModal,
      label: "Edit",
      icon: Edit
    });
  }

  if (canDelete) {
    dropdownItems.push({
      onClick: toggleDeleteModal,
      label: "Delete",
      icon: Trash
    });
  }

  if (!dropdownItems.length) return;

  return (
    <Fragment>
      <Dropdown
        label={
          <MoreHorizontal
            size={16}
            className="dark:text-white"
          />
        }
        items={dropdownItems}
      />
      {isEditModalOpen && (
        <EditProjectModal
          projectId={id}
          toggle={toggleEditModal}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteProjectModal
          projectId={id}
          toggle={toggleDeleteModal}
        />
      )}
    </Fragment>
  );
}
