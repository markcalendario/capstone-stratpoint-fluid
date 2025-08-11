"use client";

import { ProjectSchema } from "@/types/projects";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { DeleteProjectModal } from "../ui/modals/delete-project-modal";
import { EditProjectModal } from "../ui/modals/edit-project-modal";
import Dropdown from "./drop-down";

interface ProjectCardDropdownProps {
  id: ProjectSchema["id"];
}

export default function ProjectCardDropdown({ id }: ProjectCardDropdownProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  return (
    <Fragment>
      <Dropdown
        className="hover:bg-primary/10 cursor-pointer rounded p-1"
        label={
          <MoreHorizontal
            size={16}
            className="dark:text-white"
          />
        }
        items={[
          { href: `/projects/${id}`, label: "View", icon: Eye },
          { onClick: toggleEditModal, label: "Edit", icon: Edit },
          { onClick: toggleDeleteModal, label: "Delete", icon: Trash }
        ]}
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
