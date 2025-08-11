"use client";

import { createAndAssignTask } from "@/lib/actions/tasks";
import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { ChangeEvent, FormEvent, useState } from "react";
import RichTextEditor from "../rich-text-editor";
import SelectPriority from "../select-priority";
import SelectProjectMembers from "../select-project-members";
import Button from "../ui/buttons/button";
import Input from "../ui/input-fields/input";
import { showErrorToast, showSuccessToast } from "../ui/toast";
import Modal from "./modal";

interface CreateTaskModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
  listId: ListSchema["id"];
}

type Payload = {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignees: UserSchema["id"][];
  label: string;
  attachment: File | null;
  projectId: ProjectSchema["id"];
  listId: ListSchema["id"];
};

export function CreateTaskModal({
  toggle,
  listId,
  projectId
}: CreateTaskModalProps) {
  const [payload, setPayload] = useState<Payload>({
    projectId: projectId,
    listId: listId,
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignees: [],
    label: "",
    attachment: null
  });

  // Change handlers
  const handleChange = <K extends keyof Payload>(key: K, value: Payload[K]) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPayload((prev) => ({ ...prev, attachment: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { success, message } = await createAndAssignTask(payload);

    if (!success) return showErrorToast(message);

    toggle();
    showSuccessToast(message);
  };

  return (
    <Modal
      toggle={toggle}
      title="Create New Task">
      <form className="space-y-4">
        <Input
          id="title"
          name="tile"
          label="Task Title"
          placeholder="Enter task title"
          value={payload.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />

        <RichTextEditor
          id="description"
          name="description"
          label="Description"
          placeholder="Enter task description"
          value={payload.description}
          onChange={(evt) => handleChange("description", evt.target.value)}
          required
        />

        <SelectProjectMembers
          name="assign-to-members"
          label="Assign to Members"
          projectId={projectId}
          value={payload.assignees}
          onChange={(selectedIds) => handleChange("assignees", selectedIds)}
        />

        <SelectPriority
          id="priority"
          label="Priority"
          onChange={(evt) => handleChange("priority", evt.target.value)}
          required
        />

        <Input
          id="dueDate"
          name="dueDate"
          label="Due Date"
          placeholder="Select due date"
          type="date"
          value={payload.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          required
        />

        <Input
          id="label"
          name="label"
          label="Label"
          placeholder="Enter label (e.g. Design, Backend)"
          value={payload.label}
          onChange={(e) => handleChange("label", e.target.value)}
        />

        <Input
          id="attachment"
          name="attachment"
          label="Attachment"
          type="file"
          onChange={handleFileChange}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={toggle}
            className="bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-primary text-neutral-100">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
