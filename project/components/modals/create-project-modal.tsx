// TODO: Task 4.1 - Implement project CRUD operations
// TODO: Task 4.4 - Build task creation and editing functionality

import Button from "../button";
import Input from "../Input";
import Textarea from "../textarea";
import Modal from "./modal";

interface CreateProjectModalProps {
  toggle: () => void;
}

export function CreateProjectModal({ toggle }: CreateProjectModalProps) {
  return (
    <Modal
      toggle={toggle}
      title="Create New Project">
      <form className="space-y-4">
        <Input
          id="name"
          label="Project Name"
          placeholder="Enter project name"
        />

        <Textarea
          id="description"
          label="Project Description"
          placeholder="Enter project description"
        />

        <Input
          id="date"
          label="Project Due Date"
          placeholder="Enter due date"
          type="date"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            onClick={toggle}
            className="text-neutral-800 dark:text-neutral-100">
            Cancel
          </Button>
          <Button className="bg-primary text-neutral-100">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
