"use client";

import { CreateProjectButton } from "@/components/ui/buttons/create-project-button";
import ProjectCard from "@/components/ui/project-card";
import SectionLoader from "@/components/ui/section-loader";
import { useProjects } from "@/hooks/use-projects";

export default function ProjectsList() {
  const { isProjectsLoading, projectsData } = useProjects();

  if (isProjectsLoading || !projectsData) {
    return <SectionLoader text="Loading Projects" />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <CreateProjectButton className="border-primary/20 text-primary border-2 border-dashed bg-white text-center text-lg dark:bg-neutral-800 dark:text-neutral-200" />
      {projectsData.projects.map((project) => (
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
