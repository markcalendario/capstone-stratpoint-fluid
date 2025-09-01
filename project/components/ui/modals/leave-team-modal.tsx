import { useLeaveProject } from "@/hooks/use-project-members";
import { ProjectSchema } from "@/types/projects";
import { redirect, RedirectType } from "next/navigation";
import Alert from "../alert";
import Button from "../buttons/button";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface LeaveProjectModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
}

export function LeaveProjectModal({
  toggle,
  projectId
}: LeaveProjectModalProps) {
  const { isLeavingProject, leaveProject } = useLeaveProject();

  const handleLeaveProject = async () => {
    const { success, message } = await leaveProject({ projectId });
    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    redirect("/projects", RedirectType.replace);
  };

  return (
    <Modal
      toggle={toggle}
      title="Leave Project">
      <div className="space-y-2">
        <Alert
          type="warning"
          title="Are you sure?"
          description="Leaving project will unassign tasks assigned to you. You will not be able to access this project."
        />
        <div className="flex justify-end gap-2">
          <Button
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            Cancel
          </Button>
          <Button
            onClick={handleLeaveProject}
            isProcessing={isLeavingProject}
            className="bg-red-700 text-neutral-100">
            Leave Team
          </Button>
        </div>
      </div>
    </Modal>
  );
}
