"use client";

import { getRecentProjects } from "@/lib/actions/projects";
import { ProjectCard as IProjectCard } from "@/types/projects";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ProjectCard from "./project-card";
import { showErrorToast, showSuccessToast } from "./toast";

export function RecentProjects() {
  const { user } = useUser();
  const [projects, setProjects] = useState<IProjectCard[] | null>(null);

  const retrieveRecentProjects = useCallback(async () => {
    if (!user?.id) return;

    const response = await getRecentProjects(user.id);

    if (!response.success || !response.recentProjects)
      return showErrorToast(response.message);
    showSuccessToast(response.message);
    setProjects(response.recentProjects);
  }, [user]);

  useEffect(() => {
    retrieveRecentProjects();
  }, [retrieveRecentProjects, user]);

  return (
    <div className="border-primary/20 rounded-sm border-2 bg-white p-6 dark:bg-neutral-800">
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
        {projects !== null && <RenderRecentProjects projects={projects} />}
      </div>
    </div>
  );
}

interface RenderRecentProjectsProps {
  projects: IProjectCard[];
}

function RenderRecentProjects({ projects }: RenderRecentProjectsProps) {
  return projects.map((project) => (
    <ProjectCard
      key={project.id}
      id={project.id}
      name={project.name}
      description={project.description}
      dueDate={project.dueDate}
      members={project.members}
      progress={project.progress}
    />
  ));
}
