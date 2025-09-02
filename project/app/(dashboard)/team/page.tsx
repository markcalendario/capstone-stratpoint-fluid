import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import TeamMembersListGrid from "@/components/sections/team/team-grid-list";
import SectionLoader from "@/components/ui/section-loader";
import { Suspense } from "react";

export default function TeamPage() {
  return (
    <DashboardContent
      title="Team"
      description="Manage project members and their permissions.">
      <div className="space-y-6">
        <Suspense fallback={<SectionLoader text="Loading Members" />}>
          <TeamMembersListGrid />
        </Suspense>
      </div>
    </DashboardContent>
  );
}
