import Dropdown from "@/components/ui/dropdowns/drop-down";
import { DeleteTaskModal } from "@/components/ui/modals/delete-task-modal";
import { EditTaskModal } from "@/components/ui/modals/edit-task-modal";
import { UpdateAssigneesModalOpen } from "@/components/ui/modals/update-assignments-modal";
import { UpdateAttachmentModal } from "@/components/ui/modals/update-attachment-modal";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import {
  ArrowLeft,
  Edit,
  FilePlus2,
  Settings2,
  Trash,
  UserCog
} from "lucide-react";
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
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isAssigneesModalOpen, setIsAssigneesModalOpen] = useState(false);

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
  const toggleAttachmentModal = () => setIsAttachmentModalOpen((prev) => !prev);
  const toggleAssigneesModal = () => setIsAssigneesModalOpen((prev) => !prev);

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
      onClick: toggleAttachmentModal,
      label: "Add/Edit Attachment",
      icon: FilePlus2
    },
    {
      onClick: toggleAssigneesModal,
      label: "Assign Members",
      icon: UserCog
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

      {isDeleteModalOpen && (
        <DeleteTaskModal
          taskId={taskId}
          projectId={projectId}
          toggle={toggleDeleteModal}
        />
      )}

      {isAttachmentModalOpen && (
        <UpdateAttachmentModal
          taskId={taskId}
          toggle={toggleAttachmentModal}
        />
      )}

      {isAssigneesModalOpen && (
        <UpdateAssigneesModalOpen
          taskId={taskId}
          projectId={projectId}
          toggle={toggleAssigneesModal}
        />
      )}
    </Fragment>
  );
}
