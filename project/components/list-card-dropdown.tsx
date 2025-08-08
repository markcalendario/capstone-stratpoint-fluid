"use client";

import { ListSchema } from "@/types/lists";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import Dropdown from "./drop-down";
import { DeleteListModal } from "./modals/delete-list-modal";
import { UpdateListModal } from "./modals/update-list-modal";

interface ListCardDropdownProps {
  id: ListSchema["id"];
}

export default function ListCardDropdown({ id }: ListCardDropdownProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleEditModalOpen = () => setIsEditModalOpen((prev) => !prev);
  const toggleDeleteModalOpen = () => setIsDeleteModalOpen((prev) => !prev);

  const dropdownItems = [
    { onClick: toggleEditModalOpen, label: "Edit", icon: Edit },
    { onClick: toggleDeleteModalOpen, label: "Delete", icon: Trash }
  ];

  return (
    <Fragment>
      <Dropdown
        label={<MoreHorizontal size={14} />}
        className="cursor-pointer text-neutral-100"
        items={dropdownItems}
      />

      {isEditModalOpen && (
        <UpdateListModal
          id={id}
          toggle={toggleEditModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteListModal
          listId={id}
          toggle={toggleDeleteModalOpen}
        />
      )}
    </Fragment>
  );
}
