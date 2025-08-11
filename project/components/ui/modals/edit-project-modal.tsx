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

import { useUpdateProject, useUserProject } from "@/hooks/useProjects";
import { ProjectSchema } from "@/types/projects";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import Textarea from "../input-fields/textarea";
import SectionLoader from "../section-loader";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface EditProjectModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
}

export function EditProjectModal({ projectId, toggle }: EditProjectModalProps) {
  const { isProjectLoading, projectData } = useUserProject({ id: projectId });
  const { isProjectUpdating, updateProject } = useUpdateProject(projectId);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: ""
  });

  // Populate formData when projectData is loaded
  useEffect(() => {
    if (projectData?.project) {
      setFormData({
        name: projectData.project.name ?? "",
        description: projectData.project.description ?? "",
        dueDate: projectData.project.dueDate ?? ""
      });
    }
  }, [projectData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditProject = async (evt: MouseEvent) => {
    evt.preventDefault();

    const payload = {
      projectId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate
    };

    const { success, message, projectId: id } = await updateProject(payload);

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
    router.push(`/projects/${id}`);
  };

  return (
    <Modal
      toggle={toggle}
      title="Edit Project">
      {isProjectLoading && <SectionLoader text="Getting project data." />}

      {!isProjectLoading && (
        <form className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Project Name"
            placeholder="Enter project name"
            value={formData.name}
            onChange={handleChange}
          />

          <Textarea
            id="description"
            name="description"
            label="Project Description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={handleChange}
          />

          <Input
            id="dueDate"
            name="dueDate"
            label="Project Due Date"
            placeholder="Enter due date"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
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
              isProcessing={isProjectUpdating}
              className="bg-primary text-neutral-100">
              Save Edits
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
