"use client";

import SectionLoader from "@/components/ui/section-loader";
import TeamCard from "@/components/ui/team-card";
import { useProjectMembers } from "@/hooks/use-teams";
import { ProjectSchema } from "@/types/projects";

interface TeamGridListProps {
  projectId?: ProjectSchema["id"];
}

export default function TeamMembersListGrid({ projectId }: TeamGridListProps) {
  const { isProjectMembersLoading, projectMembers } = useProjectMembers(
    projectId ?? ""
  );

  if (isProjectMembersLoading || !projectMembers?.members) {
    return <SectionLoader text="Loading Members" />;
  }

  if (!projectId) {
    return "Select Project First";
  }

  return projectMembers.members.map((member, i) => (
    <TeamCard
      key={i}
      name={member.name}
      role={member.role}
      email={member.email}
      membershipStatus={member.membershipStatus}
      projectsCount={member.projectsCount}
      imageUrl={member.imageUrl}
      className="bg-white p-6 dark:bg-neutral-800"
    />
  ));
}
