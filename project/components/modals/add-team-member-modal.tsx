import Button from "../button";
import Input from "../input";
import Modal from "./modal";

interface AddTeamMemberModalProps {
  toggle: () => void;
}

export function AddTeamMemberModal({ toggle }: AddTeamMemberModalProps) {
  return (
    <Modal
      toggle={toggle}
      title="Add Member to Team">
      <form className="space-y-4">
        <Input
          id="user-name"
          label="User Name"
          placeholder="Enter name of user to add to your team"
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            onClick={toggle}
            className="text-neutral-800 dark:text-neutral-100">
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
