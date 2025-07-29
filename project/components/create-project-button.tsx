"use client";

import { Plus } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "./button";
import { CreateProjectModal } from "./modals/create-project-modal";

export function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <Fragment>
      <Button
        onClick={toggleIsOpen}
        className="border-primary/20 text-primary border-2 border-dashed bg-white text-center text-lg dark:bg-neutral-800 dark:text-neutral-200">
        <Plus />
        Create Project
      </Button>

      {isOpen && <CreateProjectModal toggle={toggleIsOpen} />}
    </Fragment>
  );
}
