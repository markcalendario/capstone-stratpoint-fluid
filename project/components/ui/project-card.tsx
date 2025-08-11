"use client";

import { cn } from "@/lib/utils";
import { ProjectCard as IProjectCard, ProjectSchema } from "@/types/projects";
import {
  Calendar,
  Edit,
  Eye,
  MoreHorizontal,
  Trash,
  Users
} from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import Dropdown from "../drop-down";
import { DeleteProjectModal } from "../modals/delete-project-modal";
import { EditProjectModal } from "../modals/edit-project-modal";

interface ProjectCardProps extends IProjectCard {
  className?: string;
}

export default function ProjectCard({
  id,
  name,
  className,
  description,
  dueDate,
  members,
  progress
}: ProjectCardProps) {
  return (
    <div
      key={id}
      className={cn("border-primary/20 rounded-sm border p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            href={`/projects/${id}`}
            className="text-primary font-medium dark:text-white">
            {name}
          </Link>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Users
                size={16}
                className="mr-1"
              />
              {members}
            </div>
            <div className="flex items-center">
              <Calendar
                size={16}
                className="mr-1"
              />
              {dueDate}
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-gray-900 dark:text-gray-100">
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <ProjectCardDropdown id={id} />
      </div>
    </div>
  );
}

interface ProjectCardDropdown {
  id: ProjectSchema["id"];
}

function ProjectCardDropdown({ id }: ProjectCardDropdown) {
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
