import {
  useTaskAssignments,
  useUpdateTaskAssignments
} from "@/hooks/use-task-assignments";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { UserSchema } from "@/types/users";
import { FormEvent, useEffect, useState } from "react";
import Button from "../buttons/button";
import SelectProjectMembers from "../input-fields/select/select-project-members";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface UpdateAssigneesModalOpen {
  toggle: () => void;
  taskId: TaskSchema["id"];
  projectId: ProjectSchema["id"];
}

export function UpdateAssigneesModalOpen({
  toggle,
  taskId,
  projectId
}: UpdateAssigneesModalOpen) {
  const [userIds, setUserIds] = useState<UserSchema["id"][]>([]);

  const { taskAssignmentsData } = useTaskAssignments(taskId);

  const { isUpdatingTaskAssignments, updateTaskAssignment } =
    useUpdateTaskAssignments(taskId);

  const handleSubmit = async (e: FormEvent) => {
    const { success, message } = await updateTaskAssignment({
      taskId,
      userIds
    });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  const handleAssigneesChange = (userIds: UserSchema["id"][]) => {
    setUserIds(userIds);
  };

  useEffect(() => {
    if (!taskAssignmentsData?.assignments) return;
    setUserIds(taskAssignmentsData.assignments);
  }, [taskAssignmentsData]);

  return (
    <Modal
      toggle={toggle}
      title="Update Attachment">
      <SelectProjectMembers
        name="assignees"
        label="Select Assignees"
        value={userIds}
        projectId={projectId}
        onChange={handleAssigneesChange}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={toggle}
          className="bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          isProcessing={isUpdatingTaskAssignments}
          className="bg-primary text-neutral-100">
          Save Assignees
        </Button>
      </div>
    </Modal>
  );
}
