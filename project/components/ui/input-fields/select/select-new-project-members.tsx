"use client";

import { Check, LoaderCircle, Star, X } from "lucide-react";
import Image from "next/image";
import Dropdown from "../../dropdowns/drop-down";

import useDebounce from "@/hooks/use-debounce";
import useTeamRoles from "@/hooks/use-team-roles";
import { useNonProjectMembersOptions } from "@/hooks/use-teams";
import { ProjectSchema } from "@/types/projects";
import { TeamRoles } from "@/types/teamRoles";
import { UserSchema } from "@/types/users";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import SectionLoader from "../../section-loader";
import Input from "../input";

interface Role extends Pick<TeamRoles, "id" | "title"> {}

interface UserOption extends Pick<UserSchema, "id" | "name" | "imageUrl"> {
  role: Role | null;
}

interface OnChangeParams {
  userId: UserSchema["id"];
  roleId: Role["id"] | null;
}

interface SelectNewProjectMembersProps {
  projectId: ProjectSchema["id"];
  onChange: (params: OnChangeParams[]) => void;
}

export default function SelectNewProjectMembers({
  projectId,
  onChange
}: SelectNewProjectMembersProps) {
  const [name, setName] = useState("");
  const debounced = useDebounce(name, 300);

  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserOption[]>([]);

  const { teamRoles: roleOptions } = useTeamRoles();

  const {
    isNonProjectMembersOptionsLoading: isLoading,
    nonProjectMembersOptions: options,
    refetchNonProjectMembersOptions: refetch
  } = useNonProjectMembersOptions(projectId, name);

  const handleSelectUser = (id: string) => {
    const user = searchedUsers.find((u) => u.id === id);
    if (!user) return;

    setSelectedUsers((prev) => [...prev, { ...user, role: null }]);
    setSearchedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleDeselectUser = (id: string) => {
    const user = selectedUsers.find((u) => u.id === id);
    if (!user) return;

    setSearchedUsers((prev) => [...prev, { ...user, role: null }]);
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleRoleChange = (id: string, role: Role) => {
    setSelectedUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
  };

  useEffect(() => {
    refetch();
  }, [debounced]);

  useEffect(() => {
    if (!options?.nonMembers || isLoading) return;

    // Update the searched users excluding users that are currently selected.
    const users = options.nonMembers.map((u) => ({ ...u, role: null }));
    const selectedIds = selectedUsers.map((u) => u.id);
    const filtered = users.filter((u) => !selectedIds.includes(u.id));
    setSearchedUsers(filtered);
  }, [options, isLoading, selectedUsers]);

  useEffect(() => {
    const selected = selectedUsers.map((u) => ({
      userId: u.id,
      roleId: u.role?.id ?? null
    }));

    onChange(selected);
  }, [selectedUsers, onChange]);

  return (
    <div className="gap-1 rounded-sm">
      <Input
        id="user-name"
        label="User Name"
        placeholder="Enter name of user to add to your team"
        onChange={(evt) => setName(evt.target.value)}
        value={name}
        className="w-full outline-0 focus:outline-0"
        required
      />

      <div className="mt-2 grid gap-1">
        {selectedUsers.map((user) => (
          <UserOptionRow
            key={user.id}
            {...user}
            rolesOptions={roleOptions?.roles}
            onRoleChange={handleRoleChange}
            onDeselect={handleDeselectUser}
          />
        ))}

        {isLoading && <SectionLoader text="Loading Users" />}

        {!isLoading &&
          searchedUsers.map((user) => (
            <UserOptionRow
              key={user.id}
              {...user}
              onSelect={handleSelectUser}
            />
          ))}
      </div>
    </div>
  );
}

interface UserOptionRowProps {
  id: string;
  name: string;
  imageUrl: string;
  role?: Role | null;
  rolesOptions?: Role[];

  onSelect?: (id: string) => void;
  onDeselect?: (id: string) => void;
  onRoleChange?: (id: string, role: Role) => void;
}

function UserOptionRow({
  id,
  name,
  imageUrl,
  role,
  rolesOptions,
  onSelect,
  onDeselect,
  onRoleChange
}: UserOptionRowProps) {
  const isSelected = !!onDeselect;

  const dropdownItems = rolesOptions
    ? rolesOptions.map((role) => ({
        icon: Star,
        label: role.title,
        onClick: () => onRoleChange?.(id, role)
      }))
    : [{ label: "Loading...", icon: LoaderCircle, onClick: () => {} }];

  return (
    <div
      className={cn(
        isSelected && "bg-neutral-100 dark:bg-neutral-900",
        "flex w-full items-center justify-between rounded-sm p-3"
      )}>
      <div className="flex items-center gap-3">
        <Image
          alt={name}
          src={imageUrl}
          width={35}
          height={35}
          className="rounded-full object-cover"
        />
        <p className="font-medium text-neutral-700 dark:text-neutral-300">
          {name}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isSelected && (
          <Dropdown
            label={role?.title ?? "Select Role"}
            items={dropdownItems}
            className="border-primary/20 rounded-sm border-1 bg-white p-2 text-xs font-medium dark:bg-neutral-800 dark:text-neutral-300"
          />
        )}

        {onDeselect && (
          <button
            type="button"
            onClick={() => onDeselect(id)}
            className="cursor-pointer p-1 text-red-500">
            <X />
          </button>
        )}

        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(id)}
            className="cursor-pointer p-1 text-green-700">
            <Check />
          </button>
        )}
      </div>
    </div>
  );
}
