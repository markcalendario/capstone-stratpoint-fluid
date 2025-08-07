"use server";

import { CreateProjectButton } from "@/components/create-project-button";
import ProjectCard from "@/components/project-card";
import { getProjects } from "@/lib/actions/projects";

export default async function ProjectsList() {
  const { projects } = await getProjects();

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
