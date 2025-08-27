"use client";

import { AddTeamMemberModal } from "@/components/ui/modals/add-team-member-modal";
import { ProjectSchema } from "@/types/projects";
import { UserPlus } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "./button";

interface AddTeamMemberButtonProps {
  className?: string;
  preSelectedId?: ProjectSchema["id"];
}

export function AddTeamMemberButton({
  className,
  preSelectedId
}: AddTeamMemberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <Fragment>
      <Button
        onClick={toggleIsOpen}
        className={className}>
        <UserPlus />
        Add Member
      </Button>

      {isOpen && (
        <AddTeamMemberModal
          preSelectedId={preSelectedId}
          toggle={toggleIsOpen}
        />
      )}
    </Fragment>
  );
}
