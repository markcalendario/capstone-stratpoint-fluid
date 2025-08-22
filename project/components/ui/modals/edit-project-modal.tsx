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

import { useProjectEditData, useUpdateProject } from "@/hooks/use-projects";
import { ProjectSchema } from "@/types/projects";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Button from "../buttons/button";
import ImageUpload from "../input-fields/image-upload";
import Input from "../input-fields/input";
import ProjectTypeOptions from "../input-fields/select/options/project-type-options";
import Select from "../input-fields/select/select";
import Textarea from "../input-fields/textarea";
import SectionLoader from "../section-loader";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface EditProjectModalProps {
  toggle: () => void;
  projectId: ProjectSchema["id"];
}

export function EditProjectModal({ projectId, toggle }: EditProjectModalProps) {
  const { isProjectUpdating, updateProject } = useUpdateProject(projectId);
  const { isProjectEditDataLoading, editProjectData } =
    useProjectEditData(projectId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    projectType: "",
    imageUrl: "",
    image: null as File | null
  });

  // Populate formData when projectData is loaded
  useEffect(() => {
    if (!editProjectData?.project) return;

    setFormData({
      name: editProjectData.project.name,
      description: editProjectData.project.description,
      dueDate: editProjectData.project.dueDate,
      projectType: editProjectData.project.projectType,
      imageUrl: editProjectData.project.imageUrl,
      image: null
    });
  }, [editProjectData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProject = async (evt: MouseEvent) => {
    evt.preventDefault();

    const payload = {
      projectId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      projectType: formData.projectType,
      image: formData.image
    };

    const { success, message } = await updateProject(payload);

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, image: file }));
  };

  return (
    <Modal
      toggle={toggle}
      title="Edit Project">
      {isProjectEditDataLoading && (
        <SectionLoader text="Getting project data." />
      )}

      {!isProjectEditDataLoading && (
        <form className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Project Name"
            placeholder="Enter project name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <Textarea
            id="description"
            name="description"
            label="Project Description"
            placeholder="Enter project description"
            required
            value={formData.description}
            onChange={handleChange}
          />

          <Input
            id="dueDate"
            name="dueDate"
            label="Project Due Date"
            placeholder="Enter due date"
            type="date"
            required
            value={formData.dueDate}
            onChange={handleChange}
          />

          <Select
            id="projectType"
            label="Project Type"
            name="projectType"
            required
            onChange={handleChange}
            value={formData.projectType}>
            <ProjectTypeOptions />
          </Select>

          <ImageUpload
            id="image"
            name="image"
            label="Project Image"
            placeholderImageUrl={formData.imageUrl}
            onChange={handleImageChange}
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
