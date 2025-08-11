import { deleteProject } from "@/lib/actions/projects";
import { ProjectSchema } from "@/types/projects";
import { redirect, RedirectType } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface DeleteProjectModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
}

export function DeleteProjectModal({
  toggle,
  projectId
}: DeleteProjectModalProps) {
  const TARGET_CONFIRM_TEXT = "DELETE PROJECT";

  const [confirmText, setConfirmText] = useState("");

  const handleConfirmChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setConfirmText(evt.target.value);
  };

  const handleDeleteProject = async () => {
    if (confirmText !== TARGET_CONFIRM_TEXT) {
      return showErrorToast("Wrong delete confirmation value.");
    }

    const { success, message } = await deleteProject({ projectId });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
    redirect("/projects", RedirectType.push);
  };

  return (
    <Modal
      toggle={toggle}
      title="Delete Project">
      <div className="space-y-3">
        <Input
          id="confirm-delete"
          value={confirmText}
          placeholder="DELETE PROJECT"
          onChange={handleConfirmChange}
          label={`Type ${TARGET_CONFIRM_TEXT} to delete this project.`}
        />
        <div className="flex justify-end gap-2">
          <Button
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProject}
            className="bg-red-700 text-neutral-100">
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
}
