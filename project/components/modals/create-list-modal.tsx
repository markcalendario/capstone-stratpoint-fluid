"use client";

import { ProjectSchema } from "@/types/projects";
import { useUser } from "@clerk/nextjs";
import { SquareArrowLeft, TriangleAlert } from "lucide-react";
import { ChangeEvent, MouseEvent, useState } from "react";
import Button from "../button";
import Input from "../input";
import Radio from "../radio";
import Modal from "./modal";

interface CreateProjectModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
}

export function CreateListModal({
  projectId,
  toggle
}: CreateProjectModalProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({ name: "", listType: "progress" });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateList = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (!user?.id) return;

    const payload = {
      userId: user.id,
      name: formData.name,
      projectId: projectId,
      isFinal: formData.listType === "terminal"
    };

    console.log(payload);
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
            icon={TriangleAlert}
            checked={formData.listType === "progress"}
            onChange={handleChange}
          />

          <Radio
            id="terminal"
            name="listType"
            value="terminal"
            title="Terminal"
            description="Mark tasks as final."
            icon={SquareArrowLeft}
            checked={formData.listType === "terminal"}
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
            className="bg-primary text-neutral-100">
            Create List
          </Button>
        </div>
      </form>
    </Modal>
  );
}
