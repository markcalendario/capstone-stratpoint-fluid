import { useAddTeamMembers } from "@/hooks/use-teams";
import { ProjectSchema } from "@/types/projects";
import { TeamRolesSchema } from "@/types/teamRoles";
import { UserSchema } from "@/types/users";
import { MouseEvent, useCallback, useState } from "react";
import Button from "../buttons/button";
import SelectNewProjectMembers from "../input-fields/select/select-new-project-members";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface MembersState {
  userId: UserSchema["id"];
  roleId: TeamRolesSchema["id"] | null;
}

interface AddTeamMemberModalProps {
  projectId: ProjectSchema["id"];
  toggle: () => void;
}

export function AddTeamMemberModal({
  projectId = "0dd0b490-993f-440a-9c8d-1cf1e319b638",
  toggle
}: AddTeamMemberModalProps) {
  const [members, setMembers] = useState<MembersState[]>([]);
  const { isAddingTeamMembers, addTeamMembers } = useAddTeamMembers(projectId);

  const handleAddToTeam = async (e: MouseEvent<HTMLButtonElement>) => {
    const { success, message } = await addTeamMembers({ projectId, members });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  const handleSelectNewMembers = useCallback((values: MembersState[]) => {
    setMembers(values);
  }, []);

  return (
    <Modal
      toggle={toggle}
      title="Add Member to Team">
      <form className="space-y-4">
        <SelectNewProjectMembers
          projectId={projectId}
          onChange={handleSelectNewMembers}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddToTeam}
            isProcessing={isAddingTeamMembers}
            className="bg-primary text-neutral-100">
            Add to Team
          </Button>
        </div>
      </form>
    </Modal>
  );
}
