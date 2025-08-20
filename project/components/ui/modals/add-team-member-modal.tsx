import { useAddProjectMembers } from "@/hooks/use-project-members";
import { ProjectSchema } from "@/types/projects";
import { TeamRolesSchema } from "@/types/teamRoles";
import { UserSchema } from "@/types/users";
import { useCallback, useState } from "react";
import Button from "../buttons/button";
import SelectNonProjectMembers from "../input-fields/select/select-non-project-members";
import SelectProject from "../input-fields/select/select-project";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface MembersState {
  userId: UserSchema["id"];
  roleId: TeamRolesSchema["id"] | null;
}

interface AddTeamMemberModalProps {
  toggle: () => void;
  preSelectedId?: ProjectSchema["id"] | null;
}

export function AddTeamMemberModal({
  preSelectedId,
  toggle
}: AddTeamMemberModalProps) {
  const [members, setMembers] = useState<MembersState[]>([]);
  const [projectId, setProjectId] = useState<ProjectSchema["id"] | null>(null);
  const { isAddingTeamMembers, addTeamMembers } = useAddProjectMembers(
    projectId ?? ""
  );

  const handleAddToTeam = async () => {
    if (!projectId) return;

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
        <SelectProject
          preSelectedId={preSelectedId}
          onChange={(projectId) => setProjectId(projectId)}
        />

        {projectId && (
          <SelectNonProjectMembers
            projectId={projectId}
            onChange={handleSelectNewMembers}
          />
        )}

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
