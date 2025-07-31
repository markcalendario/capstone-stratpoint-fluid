"use client";

import { UserPlus } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "./button";
import { AddTeamMemberModal } from "./modals/add-team-member-modal";

interface AddTeamMemberButtonProps {
  className?: string;
}

export function AddTeamMemberButton({ className }: AddTeamMemberButtonProps) {
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

      {isOpen && <AddTeamMemberModal toggle={toggleIsOpen} />}
    </Fragment>
  );
}
