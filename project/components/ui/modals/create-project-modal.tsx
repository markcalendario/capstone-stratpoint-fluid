import { useCreateProject } from "@/hooks/use-projects";
import { ChangeEvent, useState } from "react";
import Button from "../buttons/button";
import ImageUpload from "../input-fields/image-upload";
import Input from "../input-fields/input";
import ProjectTypeOptions from "../input-fields/select/options/project-type-options";
import Select from "../input-fields/select/select";
import Textarea from "../input-fields/textarea";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface CreateProjectModalProps {
  toggle: () => void;
}

export function CreateProjectModal({ toggle }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    projectType: "",
    image: null as File | null
  });

  const { isCreatingProject, createProject } = useCreateProject();

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleCreateProject = async () => {
    const payload = { ...formData };
    const { success, message } = await createProject(payload);
    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  return (
    <Modal
      toggle={toggle}
      title="Create New Project">
      <form
        className="space-y-4"
        encType="multipart/form-data">
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
          placeholder="Select due date"
          required
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <Select
          id="projectType"
          name="projectType"
          label="Project Type"
          required
          value={formData.projectType}
          onChange={handleChange}>
          <ProjectTypeOptions />
        </Select>

        <ImageUpload
          id="projectImage"
          name="projectImage"
          label="Project Image"
          onChange={handleImageChange}
          placeholderImageUrl="/assets/images/misc/project-default.jpg"
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
