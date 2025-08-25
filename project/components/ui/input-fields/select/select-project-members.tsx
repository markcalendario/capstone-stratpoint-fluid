import { useProjectMembersOptions } from "@/hooks/use-project-members";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { ChangeEvent, useEffect, useState } from "react";
import SectionLoader from "../../section-loader";
import UserCheckbox from "../user-checkbox";

interface SelectMembersProps {
  name: string;
  label: string;
  required?: boolean;
  value: UserSchema["id"][];
  projectId: ProjectSchema["id"];
  onChange: (selectedIds: ProjectSchema["id"][]) => void;
}

export default function SelectProjectMembers({
  name,
  value,
  label,
  onChange,
  required,
  projectId
}: SelectMembersProps) {
  const [selectedIds, setSelectedIds] = useState<UserSchema["id"][]>(value);
  const { isProjectMembersOptionsLoading, projectMembersOptions } =
    useProjectMembersOptions(projectId);

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

  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

  useEffect(() => {
    onChange(selectedIds);
  }, [selectedIds, onChange]);

  const loaded =
    !isProjectMembersOptionsLoading && projectMembersOptions?.members;

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

      {!loaded && <SectionLoader text="Loading Members" />}

      {loaded && (
        <div className="border-primary flex min-h-30 flex-wrap gap-2 rounded-sm border-2 p-4">
          {projectMembersOptions.members.map((member) => (
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
      )}
    </div>
  );
}
