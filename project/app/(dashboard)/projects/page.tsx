"use client";

import { CreateProjectButton } from "@/components/create-project-button";
import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import ProjectCard from "@/components/project-card";
import SearchFilter from "@/components/search-filter";
import { showErrorToast } from "@/components/toast";
import { getProjects } from "@/lib/actions/projects";
import { ProjectCard as IProjectCard } from "@/types/projects";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

export default function ProjectsPage() {
  return (
    <DashboardContent
      title="Projects"
      description="Manage and organize your team projects">
      <div className="space-y-6">
        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            📋 Projects Page Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>• Task 4.1: Implement project CRUD operations</li>
            <li>• Task 4.2: Create project listing and dashboard interface</li>
            <li>• Task 4.5: Design and implement project cards and layouts</li>
            <li>
              • Task 4.6: Add project and task search/filtering capabilities
            </li>
          </ul>
        </div>

        <SearchFilter />

        {/* Projects Grid Placeholder */}
        <RenderProjects />

        {/* Component Placeholders */}
        <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800/50">
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            📁 Components to Implement
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-400">
            <div>
              <strong>components/project-card.tsx</strong>
              <p>
                Project display component with progress, members, and actions
              </p>
            </div>
            <div>
              <strong>components/modals/create-project-modal.tsx</strong>
              <p>Modal for creating new projects with form validation</p>
            </div>
            <div>
              <strong>hooks/use-projects.ts</strong>
              <p>Custom hook for project data fetching and mutations</p>
            </div>
            <div>
              <strong>lib/db/schema.ts</strong>
              <p>Database schema for projects, lists, and tasks</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}

function RenderProjects() {
  const { user } = useUser();

  const [projects, setProjects] = useState<IProjectCard[] | null>(null);

  const retrieveProjects = useCallback(async () => {
    if (!user?.id) return null;

    const { success, message, projects } = await getProjects({
      userClerkId: user.id
    });

    if (!success || !projects) return showErrorToast(message);

    setProjects(projects);
  }, [user?.id]);

  useEffect(() => {
    retrieveProjects();
  }, [retrieveProjects]);

  if (!projects) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <CreateProjectButton className="border-primary/20 text-primary border-2 border-dashed bg-white text-center text-lg dark:bg-neutral-800 dark:text-neutral-200" />
      {projects.map((project) => (
        <ProjectCard
          className="bg-white dark:bg-neutral-800"
          key={project.id}
          id={project.id}
          name={project.name}
          description={project.description}
          dueDate={project.dueDate}
          members={project.members}
          progress={project.progress}
        />
      ))}
    </div>
  );
}
