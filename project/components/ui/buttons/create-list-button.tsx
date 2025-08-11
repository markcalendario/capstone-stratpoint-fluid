"use client";

import { CreateListModal } from "@/components/modals/create-list-modal";
import { ProjectSchema } from "@/types/projects";
import { PlusSquare } from "lucide-react";
import { Fragment, useState } from "react";

interface CreateListButtonProps {
  className: string;
  projectId: ProjectSchema["id"];
}

export default function CreateListButton({
  className,
  projectId
}: CreateListButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <Fragment>
      <button
        onClick={toggleModal}
        className={className}>
        <PlusSquare size={18} />
        Add List
      </button>

      {isModalOpen && (
        <CreateListModal
          toggle={toggleModal}
          projectId={projectId}
        />
      )}
    </Fragment>
  );
}
