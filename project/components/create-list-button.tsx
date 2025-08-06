import { ProjectSchema } from "@/types/projects";
import { PlusSquare } from "lucide-react";
import { Fragment, useState } from "react";
import { CreateListModal } from "./modals/create-list-modal";

interface CreateListButton {
  projectId: ProjectSchema["id"];
}

export default function CreateListButton({ projectId }: CreateListButton) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <Fragment>
      <button
        onClick={toggleModal}
        className="border-primary/20 text-primary hover:bg-primary/10 flex min-h-[500px] min-w-80 cursor-pointer flex-nowrap items-center justify-center gap-2 rounded-sm border-2 border-dashed bg-neutral-50 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
        <PlusSquare size={18} />
        Add List
      </button>

      {isModalOpen && (
        <CreateListModal
          projectId={projectId}
          toggle={toggleModal}
        />
      )}
    </Fragment>
  );
}
