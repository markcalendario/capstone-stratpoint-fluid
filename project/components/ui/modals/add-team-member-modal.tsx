import { useAddTeamMembers } from "@/hooks/use-teams";
import { ProjectSchema } from "@/types/projects";
import { TeamRolesSchema } from "@/types/teamRoles";
import { UserSchema } from "@/types/users";
import { useCallback, useState } from "react";
import Button from "../buttons/button";
import SelectNewProjectMembers from "../input-fields/select/select-new-project-members";
import SelectProject from "../input-fields/select/select-project";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface MembersState {
  userId: UserSchema["id"];
  roleId: TeamRolesSchema["id"] | null;
}

interface AddTeamMemberModalProps {
  projectId?: ProjectSchema["id"];
  toggle: () => void;
}

export function AddTeamMemberModal({
  projectId,
  toggle
}: AddTeamMemberModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [members, setMembers] = useState<MembersState[]>([]);
  const { isAddingTeamMembers, addTeamMembers } = useAddTeamMembers(
    selectedProjectId ?? ""
  );

  const handleAddToTeam = async () => {
    if (!selectedProjectId) return;

    const { success, message } = await addTeamMembers({
      projectId: selectedProjectId,
      members
    });
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
          id={projectId}
          onChange={(project) => setSelectedProjectId(project?.id)}
        />

        {selectedProjectId && (
          <SelectNewProjectMembers
            projectId={selectedProjectId}
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
