"use client";

import ProjectCard from "@/components/ui/project-card";
import SectionEmpty from "@/components/ui/section-empty";
import SectionLoader from "@/components/ui/section-loader";
import { useRecentProjects } from "@/hooks/use-projects";
import { Box } from "lucide-react";
import Link from "next/link";

export default function RecentProjects() {
  const { isRecentProjectsLoading, recentProjectsData } = useRecentProjects();

  const recentProjects = recentProjectsData?.recentProjects ?? [];
  const isLoading = isRecentProjectsLoading;
  const isEmpty = !isLoading && recentProjects.length === 0;

  return (
    <div className="border-primary/20 rounded-xs border-1 bg-white p-6 dark:bg-neutral-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Recent Projects
        </h3>
        <Link
          href="/projects"
          className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {isLoading && <SectionLoader text="Retrieving Recent Projects" />}

        {isEmpty && (
          <SectionEmpty
            icon={Box}
            text="No Recent Projects"
          />
        )}

        {!isLoading &&
          !isEmpty &&
          recentProjects.map((project) => (
            <ProjectCard
              {...project}
              key={project.id}
            />
          ))}
      </div>
    </div>
  );
}
