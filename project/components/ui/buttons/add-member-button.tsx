"use client";

import { AddTeamMemberModal } from "@/components/ui/modals/add-team-member-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { ProjectSchema } from "@/types/projects";
import { UserPlus } from "lucide-react";
import { Fragment, useState } from "react";
import Button from "./button";

interface AddTeamMemberButtonProps {
  className?: string;
  preSelectedId: ProjectSchema["id"];
}

export function AddTeamMemberButton({
  className,
  preSelectedId
}: AddTeamMemberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { permissionsData } = usePermissions(preSelectedId);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  const permissions = permissionsData?.permissions;
  const canAddMember = permissions?.includes(PERMISSION.CREATE_PROJECT_MEMBER);

  if (!canAddMember) return;

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
