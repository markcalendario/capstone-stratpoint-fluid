"use client";

import { CreateProjectButton } from "@/components/ui/buttons/create-project-button";
import ProjectCard from "@/components/ui/project-card";
import SectionLoader from "@/components/ui/section-loader";
import { useUserProjects } from "@/hooks/useUserProjectsQuery";

export default function ProjectsList() {
  const { isLoading, data } = useUserProjects();

  if (isLoading || !data) {
    return <SectionLoader text="Loading Projects" />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <CreateProjectButton className="border-primary/20 text-primary border-2 border-dashed bg-white text-center text-lg dark:bg-neutral-800 dark:text-neutral-200" />
      {data.projects.map((project) => (
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
