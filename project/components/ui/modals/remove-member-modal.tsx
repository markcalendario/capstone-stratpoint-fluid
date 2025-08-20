import { useRemoveProjectMember } from "@/hooks/use-project-members";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface RemoveMemberModalProps {
  userId: UserSchema["id"];
  projectId: ProjectSchema["id"];
  toggle: () => void;
}

export default function RemoveMemberModal({
  toggle,
  userId,
  projectId
}: RemoveMemberModalProps) {
  const CONFIRM_TEXT = "REMOVE MEMBER";
  const [confirmText, setConfirmText] = useState("");
  const { isRemovingTeamMember, removeProjectMember: removeTeamMember } =
    useRemoveProjectMember(projectId);

  const handleRemoveTeamMember = async () => {
    if (confirmText !== CONFIRM_TEXT) {
      return showErrorToast("Incorrect delete confirmation text.");
    }

    const { success, message } = await removeTeamMember({ userId, projectId });
    if (!success) return showErrorToast(message);
    showSuccessToast(message);
  };

  return (
    <Modal
      toggle={toggle}
      title="Remove from Team">
      <div className="grid gap-5">
        <Input
          id="confirm"
          label={`Type '${CONFIRM_TEXT}' to remove this member.`}
          placeholder={CONFIRM_TEXT}
          value={confirmText}
          onChange={(evt) => setConfirmText(evt.target.value)}
          required
        />

        <div className="flex justify-end gap-3">
          <Button
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
            Cancel
          </Button>
          <Button
            onClick={handleRemoveTeamMember}
            isProcessing={isRemovingTeamMember}
            className="bg-red-500 text-neutral-100">
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
}
