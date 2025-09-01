"use client";

import { CreateProjectButton } from "@/components/ui/buttons/create-project-button";
import ProjectCard from "@/components/ui/project-card";
import SectionLoader from "@/components/ui/section-loader";
import { useProjects } from "@/hooks/use-projects";

interface ProjectsListProps {
  searchText: string;
}

export default function ProjectsList({ searchText }: ProjectsListProps) {
  const { isProjectsListDataLoading, projectsListData } = useProjects();

  const projects = projectsListData?.projects;
  const isLoading = isProjectsListDataLoading || !projects;

  if (isLoading) {
    return <SectionLoader text="Loading Projects" />;
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <CreateProjectButton className="border-primary/20 text-primary min-h-[187px] border-3 border-dashed bg-white text-center text-lg dark:bg-neutral-800 dark:text-neutral-200" />
      {filteredProjects.map((project) => (
        <ProjectCard
          {...project}
          key={project.id}
          className="bg-white dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}
