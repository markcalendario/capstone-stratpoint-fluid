import Dropdown, { DropdownItem } from "@/components/ui/dropdowns/drop-down";
import { DeleteTaskModal } from "@/components/ui/modals/delete-task-modal";
import { EditTaskModal } from "@/components/ui/modals/edit-task-modal";
import { UpdateAssigneesModalOpen } from "@/components/ui/modals/update-assignments-modal";
import { UpdateAttachmentModal } from "@/components/ui/modals/update-attachment-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION } from "@/lib/utils/permission-enum";
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

export default function TaskSettingsDropdown({
  taskId,
  projectId
}: TaskSettingsButtonProps) {
  const { permissionsData } = usePermissions(projectId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isAssigneesModalOpen, setIsAssigneesModalOpen] = useState(false);

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
  const toggleAttachmentModal = () => setIsAttachmentModalOpen((prev) => !prev);
  const toggleAssigneesModal = () => setIsAssigneesModalOpen((prev) => !prev);

  const permissions = permissionsData?.permissions;
  const canEdit = permissions?.includes(PERMISSION.EDIT_TASK);
  const canDelete = permissions?.includes(PERMISSION.DELETE_TASK);
  const canAddMembers = permissions?.includes(PERMISSION.CREATE_PROJECT_MEMBER);

  const items: DropdownItem[] = [
    {
      href: `/projects/${projectId}`,
      label: "Back to Kanban",
      icon: ArrowLeft
    }
  ];

  if (canEdit) {
    items.push({
      onClick: toggleEditModal,
      label: "Edit Task",
      icon: Edit
    });

    items.push({
      onClick: toggleAttachmentModal,
      label: "Update Attachment",
      icon: FilePlus2
    });
  }

  if (canAddMembers) {
    items.push({
      onClick: toggleAssigneesModal,
      label: "Assign Members",
      icon: UserCog
    });
  }

  if (canDelete) {
    items.push({
      onClick: toggleDeleteModal,
      label: "Delete Task",
      icon: Trash
    });
  }

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
