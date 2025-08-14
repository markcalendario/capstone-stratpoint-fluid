import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import TeamMembersListGrid from "@/components/sections/team/team-grid-list";
import { AddTeamMemberButton } from "@/components/ui/buttons/add-member-button";

export default function TeamPage() {
  return (
    <DashboardContent
      title="Team"
      description="Manage team members and permissions">
      <div className="space-y-6">
        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            📋 Team Management Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>
              • Task 6.1: Implement task assignment and user collaboration
              features
            </li>
            <li>
              • Task 6.4: Implement project member management and permissions
            </li>
          </ul>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AddTeamMemberButton className="border-primary/20 text-primary border-2 border-dashed bg-white text-center text-lg dark:bg-neutral-800 dark:text-neutral-200" />
          <TeamMembersListGrid projectId="29e5d329-92d9-49c9-91d5-ceae089f643f" />
        </div>
      </div>
    </DashboardContent>
  );
}
