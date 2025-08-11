"use client";

import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { PlusSquare } from "lucide-react";
import { Fragment, useState } from "react";
import { CreateTaskModal } from "../modals/create-task-modal";

interface AddTaskButtonProps {
  className: string;
  listId: ListSchema["id"];
  projectId: ProjectSchema["id"];
}

export default function AddTaskButton({
  className,
  listId,
  projectId
}: AddTaskButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <Fragment>
      <button
        onClick={toggleModal}
        className={className}>
        <PlusSquare size={14} /> Add Task
      </button>

      {isModalOpen && (
        <CreateTaskModal
          listId={listId}
          toggle={toggleModal}
          projectId={projectId}
        />
      )}
    </Fragment>
  );
}
