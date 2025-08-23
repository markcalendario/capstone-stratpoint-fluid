import Dropdown from "@/components/ui/dropdowns/drop-down";
import { EditTaskModal } from "@/components/ui/modals/edit-task-modal";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { ArrowLeft, Edit, Settings2, Trash } from "lucide-react";
import { Fragment, useState } from "react";

interface TaskSettingsButtonProps {
  taskId: TaskSchema["id"];
  projectId: ProjectSchema["id"];
}

export default function TaskSettingsButton({
  taskId,
  projectId
}: TaskSettingsButtonProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const items = [
    {
      href: `/projects/${projectId}`,
      label: "Back to Kanban",
      icon: ArrowLeft
    },
    {
      onClick: toggleEditModal,
      label: "Edit Task",
      icon: Edit
    },
    {
      onClick: toggleDeleteModal,
      label: "Delete Task",
      icon: Trash
    }
  ];

  return (
    <Fragment>
      <Dropdown
        className="rounded-xs bg-neutral-200 p-1 dark:bg-neutral-900 dark:text-neutral-400"
        label={<Settings2 size={16} />}
        items={items}
      />

      {isEditModalOpen && (
        <EditTaskModal
          taskId={taskId}
          toggle={toggleEditModal}
        />
      )}
    </Fragment>
  );
}
