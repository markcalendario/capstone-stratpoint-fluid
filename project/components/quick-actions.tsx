import { PlusSquare, UserPlus } from "lucide-react";
import Button from "./button";
import { CreateProjectButton } from "./create-project-button";

export default function QuickActions() {
  return (
    <div className="border-primary/20 rounded-sm border-2 bg-white p-6 dark:bg-neutral-800">
      <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Quick Actions
      </h3>
      <div className="space-y-3">
        <CreateProjectButton className="bg-primary w-full py-4 font-medium text-neutral-100" />
        <Button className="bg-primary/20 text-primary w-full py-4 font-medium dark:text-neutral-300">
          <UserPlus
            size={20}
            className="mr-2"
          />
          Add Team Member
        </Button>
        <Button className="bg-primary/20 text-primary w-full py-4 font-medium dark:text-neutral-300">
          <PlusSquare
            size={20}
            className="mr-2"
          />
          Create Task
        </Button>
      </div>
      <div className="mt-4 rounded border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          📋 <strong>Task 4.4:</strong> Build task creation and editing
          functionality
        </p>
      </div>
    </div>
  );
}
