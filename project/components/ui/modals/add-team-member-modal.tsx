import { ProjectSchema } from "@/types/projects";
import Button from "../buttons/button";
import SelectNewProjectMembers from "../input-fields/select/select-new-project-members";
import Modal from "./modal";

interface AddTeamMemberModalProps {
  projectId: ProjectSchema["id"];
  toggle: () => void;
}

export function AddTeamMemberModal({
  projectId = "0dd0b490-993f-440a-9c8d-1cf1e319b638",
  toggle
}: AddTeamMemberModalProps) {
  return (
    <Modal
      toggle={toggle}
      title="Add Member to Team">
      <form className="space-y-4">
        <SelectNewProjectMembers projectId={projectId} />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            Cancel
          </Button>
          <Button className="bg-primary text-neutral-100">
            Add Team Member
          </Button>
        </div>
      </form>
    </Modal>
  );
}
