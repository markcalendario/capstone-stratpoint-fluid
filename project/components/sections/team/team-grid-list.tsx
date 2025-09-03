"use client";

import { AddTeamMemberButton } from "@/components/ui/buttons/add-member-button";
import SelectProject from "@/components/ui/input-fields/select/select-project";
import SectionEmpty from "@/components/ui/section-empty";
import SectionLoader from "@/components/ui/section-loader";
import TeamCard from "@/components/ui/team-card";
import { usePermissions } from "@/hooks/use-permissions";
import { useProjectMembers } from "@/hooks/use-project-members";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { ProjectSchema } from "@/types/projects";
import { Box } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TeamMembersListGrid() {
  const projectIdParam = useSearchParams().get("projectId");
  const [projectId, setProjectId] = useState<ProjectSchema["id"] | null>(
    projectIdParam
  );

  const handleSelectProject = (projectId: ProjectSchema["id"] | null) => {
    setProjectId(projectId);
  };

  return (
    <div>
      <SelectProject
        preSelectedId={projectIdParam}
        onChange={handleSelectProject}
      />
      {projectId ? (
        <RenderMembers projectId={projectId} />
      ) : (
        <SectionEmpty
          icon={Box}
          text="Select Project First"
        />
      )}
    </div>
  );
}

interface RenderMembersProps {
  projectId: ProjectSchema["id"];
}

function RenderMembers({ projectId }: RenderMembersProps) {
  const { isProjectMembersLoading, projectMembers } =
    useProjectMembers(projectId);

  const { permissionsData } = usePermissions(projectId);
  const permissions = permissionsData?.permissions;
  const canAddMember = permissions?.includes(PERMISSION.CREATE_PROJECT_MEMBER);

  if (isProjectMembersLoading || !projectMembers?.members) {
    return <SectionLoader text="Loading Members" />;
  }

  return (
    <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {canAddMember && (
        <AddTeamMemberButton
          preSelectedId={projectId}
          className="border-primary/20 text-primary border-1 border-dashed bg-white text-center text-lg dark:bg-neutral-800 dark:text-neutral-200"
        />
      )}
      {projectMembers.members.map((member, i) => (
        <TeamCard
          key={i}
          userId={member.id}
          projectId={projectId}
          name={member.name}
          role={member.role}
          email={member.email}
          tasksDoneCount={member.tasksDoneCount}
          tasksUndoneCount={member.tasksUndoneCount}
          membershipStatus={member.membershipStatus}
          projectsCount={member.projectsCount}
          imageUrl={member.imageUrl}
          className="bg-white p-6 dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}
