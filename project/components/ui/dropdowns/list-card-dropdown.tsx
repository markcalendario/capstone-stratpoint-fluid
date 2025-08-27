"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { DeleteListModal } from "../modals/delete-list-modal";
import { UpdateListModal } from "../modals/update-list-modal";
import Dropdown from "./drop-down";

interface ListCardDropdownProps {
  id: ListSchema["id"];
  projectId: ProjectSchema["id"];
}

export default function ListCardDropdown({
  id,
  projectId
}: ListCardDropdownProps) {
  const { permissionsData } = usePermissions(projectId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleEditOpen = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteOpen = () => setIsDeleteModalOpen((prev) => !prev);

  const permissions = permissionsData?.permissions;
  const canEdit = permissions?.includes(PERMISSION.EDIT_LIST);
  const canDelete = permissions?.includes(PERMISSION.DELETE_LIST);

  const items = [];

  if (canEdit) {
    items.push({ onClick: toggleEditOpen, label: "Edit", icon: Edit });
  }

  if (canDelete) {
    items.push({ onClick: toggleDeleteOpen, label: "Delete", icon: Trash });
  }

  return (
    <Fragment>
      {!!items.length && (
        <Dropdown
          label={<MoreHorizontal size={16} />}
          className="cursor-pointer text-neutral-100"
          items={items}
        />
      )}

      {isEditModalOpen && (
        <UpdateListModal
          id={id}
          toggle={toggleEditOpen}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteListModal
          listId={id}
          toggle={toggleDeleteOpen}
        />
      )}
    </Fragment>
  );
}
