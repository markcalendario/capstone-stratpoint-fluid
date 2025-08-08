"use client";

import { ListSchema } from "@/types/lists";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import Dropdown from "./drop-down";
import { DeleteListModal } from "./modals/delete-list-modal";
import { UpdateListModal } from "./modals/update-list-modal";

interface ListCardProps {
  id: ListSchema["id"];
  name: ListSchema["name"];
}

export default function ListCard({ id, name }: ListCardProps) {
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
      <div className="border-primary/20 min-h-[500px] min-w-80 overflow-hidden rounded-sm border-3 bg-neutral-100 dark:bg-neutral-900">
        <div className="bg-primary px-3 py-2 dark:border-neutral-600">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-200">
              {name}
              <span className="ml-2 rounded-sm bg-white/20 px-2 py-1 text-xs">
                {[1, 2].length}
              </span>
            </h3>
            <Dropdown
              label={<MoreHorizontal size={14} />}
              className="cursor-pointer text-neutral-100"
              items={dropdownItems}
            />
          </div>
        </div>

        {/* <div className="space-y-3 p-4">
        {tasks.map((task, i) => (
          <TaskCard
            key={i}
            {...task}
          />
        ))}

        <Button className="border-primary bg-primary/10 text-primary w-full border-1 border-dashed dark:text-neutral-200">
          <Plus size={16} /> Add Task
        </Button>
      </div> */}
      </div>

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
