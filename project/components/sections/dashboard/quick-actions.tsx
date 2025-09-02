import { AddTeamMemberButton } from "@/components/ui/buttons/add-member-button";
import { CreateProjectButton } from "@/components/ui/buttons/create-project-button";

export default function QuickActions() {
  return (
    <div className="border-primary/20 rounded-sm border-2 bg-white p-6 dark:bg-neutral-800">
      <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Quick Actions
      </h3>
      <div className="space-y-3">
        <CreateProjectButton className="bg-primary w-full py-4 font-medium text-neutral-100" />
        <AddTeamMemberButton className="bg-primary/20 text-primary w-full py-4 font-medium dark:text-neutral-300" />
      </div>
    </div>
  );
}
