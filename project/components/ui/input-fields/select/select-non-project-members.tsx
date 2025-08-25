import Input from "@/components/ui/input-fields/input";
import SectionLoader from "@/components/ui/section-loader";
import useDebounce from "@/hooks/use-debounce";
import { useNonProjectMembersOptions } from "@/hooks/use-project-members";
import useTeamRoles from "@/hooks/use-team-roles";
import { ProjectSchema } from "@/types/projects";
import { TeamRoles, UserOption } from "@/types/teamRoles";
import { UserSchema } from "@/types/users";
import { useEffect, useState } from "react";
import UserOptionRow from "./options/user-option";

interface OnChangeParams {
  userId: UserSchema["id"];
  roleId: TeamRoles["id"] | null;
}

interface SelectNewProjectMembersProps {
  projectId: ProjectSchema["id"];
  onChange: (params: OnChangeParams[]) => void;
}

export default function SelectNonProjectMembers({
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

  const handleSelectUser = (userId: UserSchema["id"]) => {
    const user = searchedUsers.find((user) => user.id === userId);
    if (!user) return;

    setSelectedUsers((prev) => [...prev, { ...user, role: null }]);
    setSearchedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleDeselectUser = (userId: UserSchema["id"]) => {
    const user = selectedUsers.find((user) => user.id === userId);
    if (!user) return;

    setSearchedUsers((prev) => [...prev, { ...user, role: null }]);
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleRoleChange = (userId: string, role: UserOption["role"]) => {
    setSelectedUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role } : user))
    );
  };

  useEffect(() => {
    refetch();
  }, [debounced, refetch]);

  useEffect(() => {
    if (!options?.nonMembers || isLoading) return;

    const users = options.nonMembers.map((user) => ({ ...user, role: null }));
    const selectedIds = selectedUsers.map((u) => u.id);
    const filtered = users.filter((u) => !selectedIds.includes(u.id));
    setSearchedUsers(filtered);
  }, [options, isLoading, selectedUsers]);

  useEffect(() => {
    const selected = selectedUsers.map((user) => ({
      userId: user.id,
      roleId: user.role?.id ?? null
    }));

    onChange(selected);
  }, [selectedUsers, onChange]);

  return (
    <div className="grid gap-1">
      <Input
        id="user-name"
        label="User Name"
        placeholder="Enter name of user to add to your team"
        onChange={(evt) => setName(evt.target.value)}
        value={name}
        className="w-full outline-0 focus:outline-0"
        required
      />

      {roleOptions &&
        selectedUsers.map((user) => (
          <UserOptionRow
            key={user.id}
            id={user.id}
            name={user.name}
            role={user.role}
            imageUrl={user.imageUrl}
            rolesOptions={roleOptions.roles}
            onRoleChange={handleRoleChange}
            onDeselect={handleDeselectUser}
          />
        ))}

      {isLoading && <SectionLoader text="Loading Users" />}

      {!isLoading &&
        searchedUsers.map((user) => (
          <UserOptionRow
            key={user.id}
            onSelect={handleSelectUser}
            id={user.id}
            name={user.name}
            imageUrl={user.imageUrl}
          />
        ))}
    </div>
  );
}
