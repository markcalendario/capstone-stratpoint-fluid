import { useEditTask, useTaskEditData } from "@/hooks/use-tasks";
import { TaskSchema } from "@/types/tasks";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import RichTextEditor from "../input-fields/rich-text-editor";
import SelectPriority from "../input-fields/select/select-priority";
import SectionLoader from "../section-loader";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface EditTaskModalProps {
  toggle: () => void;
  taskId: TaskSchema["id"];
}

export function EditTaskModal({ toggle, taskId }: EditTaskModalProps) {
  const { isEditingTask, editTask } = useEditTask(taskId);
  const { isTaskEditDataLoading, editTaskData } = useTaskEditData(taskId);

  const [formData, setFormData] = useState({
    title: "",
    label: "",
    dueDate: "",
    priority: "",
    description: ""
  });

  // Populate formData when projectData is loaded
  useEffect(() => {
    const task = editTaskData?.task;

    if (!task) return;

    setFormData({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      label: task.label ?? "",
      description: task.description
    });
  }, [editTaskData]);

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProject = async (evt: MouseEvent) => {
    evt.preventDefault();

    const payload = {
      id: taskId,
      title: formData.title,
      label: formData.label,
      dueDate: formData.dueDate,
      priority: formData.priority,
      description: formData.description
    };

    const { success, message } = await editTask(payload);

    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  return (
    <Modal
      toggle={toggle}
      title="Edit Project">
      {isTaskEditDataLoading && <SectionLoader text="Getting task data." />}

      {!isTaskEditDataLoading && (
        <form className="space-y-4">
          <Input
            id="title"
            name="title"
            label="Task Title"
            placeholder="Enter task title"
            required
            value={formData.title}
            onChange={handleChange}
          />

          <RichTextEditor
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

          <SelectPriority
            id="priority"
            label="Priority"
            name="priority"
            required
            onChange={handleChange}
            value={formData.priority}
          />

          <Input
            id="label"
            name="label"
            label="Label"
            placeholder="Enter label"
            value={formData.label ?? ""}
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
              isProcessing={isEditingTask}
              className="bg-primary text-neutral-100">
              Save Edits
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
