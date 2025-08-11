"use client";

import { AddTeamMemberModal } from "@/components/ui/modals/add-team-member-modal";
import { UserPlus } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "./button";

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
