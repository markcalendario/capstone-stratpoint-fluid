import { useCreateList } from "@/hooks/use-lists";
import { ProjectSchema } from "@/types/projects";
import { GitCommitHorizontal, GitGraph } from "lucide-react";
import { ChangeEvent, MouseEvent, useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import Radio from "../input-fields/radio";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface CreateListModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
}

export function CreateListModal({ toggle, projectId }: CreateListModalProps) {
  const { isCreatingList, createList } = useCreateList();
  const [formData, setFormData] = useState({ name: "", listType: "progress" });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateList = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    const payload = {
      projectId,
      name: formData.name,
      isFinal: formData.listType === "final"
    };

    const { success, message } = await createList(payload);
    if (!success) return showErrorToast(message);

    showSuccessToast(message);
    toggle();
  };

  return (
    <Modal
      toggle={toggle}
      title="Create Board List">
      <form className="space-y-4">
        <Input
          id="name"
          name="name"
          label="List Name"
          placeholder="Enter list name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <div className="flex gap-3">
          <Radio
            id="progress"
            name="listType"
            value="progress"
            title="Progress"
            description="Mark tasks in progress."
            icon={GitGraph}
            checked={formData.listType === "progress"}
            onChange={handleChange}
          />

          <Radio
            id="final"
            name="listType"
            value="final"
            title="Final"
            description="Mark tasks as final."
            icon={GitCommitHorizontal}
            checked={formData.listType === "final"}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={toggle}
            className="text-neutral-800 dark:text-neutral-100">
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleCreateList}
            isProcessing={isCreatingList}
            className="bg-primary text-neutral-100">
            Create List
          </Button>
        </div>
      </form>
    </Modal>
  );
}
