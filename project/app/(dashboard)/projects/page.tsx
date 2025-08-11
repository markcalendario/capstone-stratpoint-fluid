"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import ProjectsList from "@/components/sections/projects/projects-list";
import SearchFilter from "@/components/sections/projects/search-filter";

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
        <ProjectsList />

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
