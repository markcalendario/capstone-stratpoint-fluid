import { useCreateProject } from "@/hooks/use-projects";
import { useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import Textarea from "../input-fields/textarea";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface CreateProjectModalProps {
  toggle: () => void;
}

export function CreateProjectModal({ toggle }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { isCreatingProject, createProject } = useCreateProject();

  const handleCreateProject = async () => {
    const payload = { name, description, dueDate };

    const { success, message, projectId } = await createProject(payload);

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  return (
    <Modal
      toggle={toggle}
      title="Create New Project">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Project Name"
          placeholder="Enter project name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          id="description"
          name="description"
          label="Project Description"
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          id="dueDate"
          name="dueDate"
          label="Project Due Date"
          placeholder="Select due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={toggle}
            className="text-neutral-800 dark:text-neutral-100">
            Cancel
          </Button>
          <Button
            type="button"
            isProcessing={isCreatingProject}
            onClick={handleCreateProject}
            className="bg-primary text-neutral-100">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
