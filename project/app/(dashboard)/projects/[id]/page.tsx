"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import ProjectBanner from "@/components/sections/project-view/project-banner";
import KanbanBoard from "@/components/ui/kanban/kanban-board";
import SectionLoader from "@/components/ui/section-loader";
import { useProjectInfo } from "@/hooks/use-projects";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;

  const { isProjectInfoLoading, projectInfo } = useProjectInfo(id);

  if (isProjectInfoLoading || !projectInfo?.project) {
    return <SectionLoader text="Loading Project" />;
  }

  const { project } = projectInfo;

  return (
    <DashboardContent className="space-y-6">
      <ProjectBanner
        id={project.id}
        name={project.name}
        dueDate={project.dueDate}
        imageUrl={project.imageUrl}
        ownerImage={project.ownerImage}
        projectType={project.projectType}
        description={project.description}
        memberImages={project.memberImages}
      />

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
