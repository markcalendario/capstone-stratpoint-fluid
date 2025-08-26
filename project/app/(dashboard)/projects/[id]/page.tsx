"use client";

import ProjectBanner from "@/components/sections/project-view/project-banner";
import ProjectKanbanBoard from "@/components/sections/project-view/project-kanban";
import SectionLoader from "@/components/ui/section-loader";
import { useProjectSlug } from "@/hooks/use-projects";
import { useParams } from "next/navigation";
import { Fragment } from "react";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const { isProjectSlugDataLoading, projectSlugData } = useProjectSlug(id);

  if (isProjectSlugDataLoading || !projectSlugData?.project) {
    return <SectionLoader text="Loading Project" />;
  }

  const { project } = projectSlugData;

  return (
    <Fragment>
      <ProjectBanner
        id={project.id}
        name={project.name}
        dueDate={project.dueDate}
        imageUrl={project.imageUrl}
        ownerImage={project.ownerImage}
        permissions={project.permissions}
        projectType={project.projectType}
        description={project.description}
        memberImages={project.memberImages}
      />

      {/* Kanban Board */}
      <ProjectKanbanBoard projectId={id} />
    </Fragment>
  );
}
