import { useDeleteTask } from "@/hooks/use-tasks";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { redirect, RedirectType } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Alert from "../alert";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface DeleteTaskModalProps {
  toggle: () => void;
  taskId: TaskSchema["id"];
  projectId: ProjectSchema["id"];
}

export function DeleteTaskModal({
  toggle,
  taskId,
  projectId
}: DeleteTaskModalProps) {
  const TARGET_CONFIRM_TEXT = "DELETE TASK";
  const [confirmText, setConfirmText] = useState("");

  const { isDeletingTask, deleteTask } = useDeleteTask(taskId, projectId);

  const handleConfirmChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setConfirmText(evt.target.value);
  };

  const handleDeleteTask = async () => {
    if (confirmText !== TARGET_CONFIRM_TEXT) {
      return showErrorToast("Wrong delete confirmation value.");
    }

    const { success, message } = await deleteTask({ id: taskId });
    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
    redirect(`/projects/${projectId}`, RedirectType.push);
  };

  return (
    <Modal
      toggle={toggle}
      title="Delete Task">
      <div className="space-y-3">
        <Alert
          type="warning"
          title="Deletion Warning"
          description="Deleting this task will also delete the discussions and attachment in this task."
        />
        <Input
          id="confirm-delete"
          value={confirmText}
          placeholder="DELETE TASK"
          required
          onChange={handleConfirmChange}
          label={`Type ${TARGET_CONFIRM_TEXT} to delete this task.`}
        />
        <div className="flex justify-end gap-2">
          <Button
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTask}
            isProcessing={isDeletingTask}
            className="bg-red-700 text-neutral-100">
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
}
