"use client";

import { CreateProjectModal } from "@/components/ui/modals/create-project-modal";
import { cn } from "@/lib/utils/tailwind";
import { Plus } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "./button";

interface CreateProjectButtonProps {
  className: string;
}

export function CreateProjectButton({ className }: CreateProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <Fragment>
      <Button
        onClick={toggleIsOpen}
        className={cn(className)}>
        <Plus />
        Create Project
      </Button>

      {isOpen && <CreateProjectModal toggle={toggleIsOpen} />}
    </Fragment>
  );
}
