"use server";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import { KanbanBoard } from "@/components/sections/project-view/kanban-board";
import ProjectActionButtons from "@/components/sections/project-view/project-action-buttons";
import { getProject } from "@/lib/actions/projects";

interface ProjectPage {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPage) {
  const { id } = await params;

  const { project } = await getProject({ id });

  if (!project) return null;

  return (
    <DashboardContent
      className="space-y-6"
      title={`${project.name}`}
      description="List and tasks for this project.">
      <ProjectActionButtons projectId={id} />

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
            • Task 5.4: Implement optimistic UI updates for smooth interactions
          </li>
          <li>• Task 5.6: Create task detail modals and editing interfaces</li>
        </ul>
      </div>

      {/* Kanban Board Placeholder */}
      <KanbanBoard projectId={id} />

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
  );
}
