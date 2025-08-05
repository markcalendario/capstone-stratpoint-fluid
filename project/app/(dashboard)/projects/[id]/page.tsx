"use client";

import Dropdown from "@/components/drop-down";
import { KanbanBoard } from "@/components/kanban-board";
import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import LinkButton from "@/components/link-button";
import { DeleteProjectModal } from "@/components/modals/delete-project-modal";
import useProject from "@/hooks/use-project";
import {
  Calendar,
  Edit,
  Ellipsis,
  Settings,
  Square,
  Trash,
  Users
} from "lucide-react";
import { Fragment, use, useState } from "react";

interface ProjectPage {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPage) {
  const { id } = use(params);
  const project = useProject(id);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  if (!project) return null;

  return (
    <Fragment>
      <DashboardContent
        className="space-y-6"
        title={`${project.name}`}
        description="List and tasks for this project.">
        <div className="flex items-center justify-end space-x-2">
          <LinkButton
            href={`/team?projectId=${id}`}
            className="bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300">
            <Users size={20} />
          </LinkButton>
          <LinkButton
            href={`/calendar?projectId=${id}`}
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
              { onClick: () => {}, label: "Edit Project", icon: Edit },
              { onClick: () => {}, label: "Make Inactive", icon: Square },
              {
                onClick: toggleDeleteModal,
                label: "Delete Project",
                icon: Trash
              }
            ]}
            className="inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-sm bg-neutral-50 px-[20px] py-[10px] text-sm font-[500] shadow-sm dark:bg-neutral-800 dark:text-neutral-300"
          />
        </div>

        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
            🎯 Kanban Board Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Task 5.1: Design responsive Kanban board layout</li>
            <li>
              • Task 5.2: Implement drag-and-drop functionality with dnd-kit
            </li>
            <li>
              • Task 5.4: Implement optimistic UI updates for smooth
              interactions
            </li>
            <li>
              • Task 5.6: Create task detail modals and editing interfaces
            </li>
          </ul>
        </div>

        {/* Kanban Board Placeholder */}
        <KanbanBoard projectId="1" />

        {/* Component Implementation Guide */}
        <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800/50">
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            🛠️ Components & Features to Implement
          </h3>
          <div className="grid grid-cols-1 gap-6 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-400">
            <div>
              <strong className="mb-2 block">Core Components:</strong>
              <ul className="list-inside list-disc space-y-1">
                <li>components/kanban-board.tsx</li>
                <li>components/task-card.tsx</li>
                <li>components/modals/create-task-modal.tsx</li>
                <li>stores/board-store.ts (Zustand)</li>
              </ul>
            </div>
            <div>
              <strong className="mb-2 block">Advanced Features:</strong>
              <ul className="list-inside list-disc space-y-1">
                <li>Drag & drop with @dnd-kit/core</li>
                <li>Real-time updates</li>
                <li>Task assignments & due dates</li>
                <li>Comments & activity history</li>
              </ul>
            </div>
          </div>
        </div>
      </DashboardContent>
      {isDeleteModalOpen && (
        <DeleteProjectModal
          projectId={id}
          toggle={toggleDeleteModal}
        />
      )}
    </Fragment>
  );
}
