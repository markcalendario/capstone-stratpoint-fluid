"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { ProjectSchema } from "@/types/projects";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { DeleteProjectModal } from "../modals/delete-project-modal";
import { EditProjectModal } from "../modals/edit-project-modal";
import Dropdown from "./drop-down";

interface ProjectCardDropdownProps {
  id: ProjectSchema["id"];
}

export default function ProjectCardDropdown({ id }: ProjectCardDropdownProps) {
  const { permissionsData } = usePermissions(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const permissions = permissionsData?.permissions;
  const canView = permissions?.includes(PERMISSION.VIEW_PROJECT);
  const canEdit = permissions?.includes(PERMISSION.EDIT_PROJECT);
  const canDelete = permissions?.includes(PERMISSION.DELETE_PROJECT);

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
