"use client";

import { getProjectMembersOptions } from "@/lib/actions/team";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { showErrorToast } from "./toast";
import UserCheckbox from "./user-checkbox";

interface SelectMembersProps {
  name: string;
  label: string;
  required?: boolean;
  value: ProjectSchema["id"][];
  projectId: ProjectSchema["id"];
  onChange: (selectedIds: ProjectSchema["id"][]) => void;
}

interface MembersState extends Pick<UserSchema, "id" | "imageUrl" | "name"> {}

export default function SelectProjectMembers({
  name,
  value,
  label,
  onChange,
  required,
  projectId
}: SelectMembersProps) {
  const [members, setMembers] = useState<MembersState[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<UserSchema["id"][]>(value);

  // Handle checkbox change
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = evt.target;

    setSelectedIds((prev) => {
      const updated = checked
        ? [...prev, value]
        : prev.filter((id) => id !== value);

      return updated;
    });
  };

  // Fetch project members
  const retrieveMembersOptions = useCallback(async () => {
    const {
      success,
      message,
      members: data
    } = await getProjectMembersOptions({ projectId });

    if (!success || !data) return showErrorToast(message);

    setMembers(data);
  }, [projectId]);

  // Load members on mount
  useEffect(() => {
    retrieveMembersOptions();
  }, [retrieveMembersOptions]);

  useEffect(() => {
    onChange(selectedIds);
  }, [selectedIds]);

  if (!members) return null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <label className="font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </label>

        {!required && (
          <p className="p-1 text-xs text-neutral-500 dark:text-neutral-400">
            Optional
          </p>
        )}
      </div>

      <div className="border-primary flex min-h-30 flex-wrap gap-2 rounded-sm border-2 p-4">
        {members.map((member) => (
          <UserCheckbox
            key={member.id}
            id={`${member.id}-checkbox`}
            name={name}
            userId={member.id}
            userName={member.name}
            image={member.imageUrl}
            onChange={handleChange}
            checked={selectedIds.includes(member.id)}
          />
        ))}
      </div>
    </div>
  );
}
