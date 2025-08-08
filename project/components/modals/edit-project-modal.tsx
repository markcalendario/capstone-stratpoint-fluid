// TODO: Task 4.1 - Implement project CRUD operations
// TODO: Task 4.4 - Build task creation and editing functionality

/*
TODO: Implementation Notes for Interns:

Modal for creating new projects with form validation.

Features to implement:
- Form with project name, description, due date
- Zod validation
- Error handling
- Loading states
- Success feedback
- Team member assignment
- Project template selection

Form fields:
- Name (required)
- Description (optional)
- Due date (optional)
- Team members (optional)
- Project template (optional)
- Privacy settings

Integration:
- Use project validation schema from lib/validations.ts
- Call project creation API
- Update project list optimistically
- Handle errors gracefully
*/

import useProject from "@/hooks/use-project";
import { updateProject } from "@/lib/actions/projects";
import { ProjectSchema } from "@/types/projects";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../button";
import Input from "../input";
import Textarea from "../textarea";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface EditProjectModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
}

export function EditProjectModal({ projectId, toggle }: EditProjectModalProps) {
  const [project, retrieveProject] = useProject(projectId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!project) return;

    setName(project.name);
    setDescription(project.description);
    setDueDate(project.dueDate);
  }, [project]);

  const handleEditProject = async () => {
    if (!projectId) return;

    const payload = {
      projectId,
      name: name.trim(),
      description: description.trim(),
      dueDate: dueDate
    };

    const {
      success,
      message,
      projectId: updatedProjectId
    } = await updateProject(payload);

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
    retrieveProject();
    redirect(`/projects/${updatedProjectId}`, RedirectType.push);
  };

  if (!project) return null;

  return (
    <Modal
      toggle={toggle}
      title="Edit Project">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Project Name"
          placeholder="Enter project name"
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
          placeholder="Enter due date"
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
            onClick={handleEditProject}
            className="bg-primary text-neutral-100">
            Save Edits
          </Button>
        </div>
      </form>
    </Modal>
  );
}
