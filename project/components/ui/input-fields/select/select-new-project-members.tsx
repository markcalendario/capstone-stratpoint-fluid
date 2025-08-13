import useDebounce from "@/hooks/use-debounce";
import { useNonProjectMembersOptions } from "@/hooks/use-teams";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { Check, Crown, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Dropdown from "../../dropdowns/drop-down";
import SectionLoader from "../../section-loader";
import Input from "../input";

type Roles = "Project Manager" | "Viewer";

interface UserOption {
  id: UserSchema["id"];
  name: string;
  imageUrl: string;
  role: Roles | null;
}

interface SelectNewProjectMembersProps {
  projectId: ProjectSchema["id"];
}

export default function SelectNewProjectMembers({
  projectId
}: SelectNewProjectMembersProps) {
  const [name, setName] = useState("");
  const debounced = useDebounce(name, 300);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserOption[]>([]);

  const {
    isNonProjectMembersOptionsLoading: isLoading,
    nonProjectMembersOptions: options,
    refetchNonProjectMembersOptions: refetch
  } = useNonProjectMembersOptions(projectId, name);

  const handleSelectUser = (id: UserSchema["id"]) => {
    // Add to selected list
    setSelectedUsers((prev) => {
      const userToAdd = searchedUsers.find((u) => u.id === id);

      if (!userToAdd) return prev;
      return [...prev, { ...userToAdd }];
    });

    // Remove from searched list
    setSearchedUsers((prev) => {
      return prev.filter((u) => u.id !== id);
    });
  };

  const handleDeselectUser = (id: UserSchema["id"]) => {
    setSearchedUsers((prev) => {
      const userToDeselect = selectedUsers.find((u) => u.id === id);
      if (!userToDeselect) return prev;

      return [...prev, { ...userToDeselect, role: null }];
    });

    setSelectedUsers((prev) => {
      return prev.filter((u) => u.id !== id);
    });
  };

  const handleRoleChange = (id: UserSchema["id"], role: Roles) => {
    setSelectedUsers((prev) => {
      const userToChangeRole = prev.find((u) => u.id === id);
      if (!userToChangeRole) return prev;

      const partial = prev.filter((u) => u.id !== id);
      return [...partial, { ...userToChangeRole, role }];
    });
  };

  useEffect(() => {
    if (isLoading || !options?.nonMembers) return;
    const users = options.nonMembers.map((user) => ({ ...user, role: null }));

    // prevent
    const selectedUserIds = selectedUsers.map((u) => u.id);
    const filteredUsers = users.filter((u) => !selectedUserIds.includes(u.id));
    setSearchedUsers(filteredUsers);
  }, [options]);

  useEffect(() => {
    refetch();
  }, [debounced]);

  return (
    <div className="gap-1 rounded-sm">
      <Input
        id="user-name"
        className="w-full outline-0 focus:outline-0"
        placeholder="Enter name of user to add your team"
        label="User Name"
        value={name}
        onChange={(evt) => setName(evt.target.value)}
        required
      />

      <div className="mt-2 grid gap-1">
        {selectedUsers.map((selectedUser) => (
          <SelectedUser
            {...selectedUser}
            key={selectedUser.id}
            handleRoleChange={handleRoleChange}
            handleDeselectUser={handleDeselectUser}
          />
        ))}

        {isLoading && <SectionLoader text="Loading Users" />}

        {!isLoading &&
          searchedUsers.map((searchedUser) => (
            <UnselectedUser
              {...searchedUser}
              key={searchedUser.id}
              handleSelectUser={handleSelectUser}
            />
          ))}
      </div>
    </div>
  );
}

interface SelectedUserPRops extends UserOption {
  handleDeselectUser: (id: UserSchema["id"]) => void;
  handleRoleChange: (id: UserSchema["id"], role: Roles) => void;
}

function SelectedUser({
  id,
  name,
  role,
  imageUrl,
  handleRoleChange,
  handleDeselectUser
}: SelectedUserPRops) {
  const changeRole = (role: Roles) => handleRoleChange(id, role);

  const items = [
    {
      onClick: () => changeRole("Project Manager"),
      label: "Project Manager",
      icon: Crown
    }
  ];

  return (
    <div className="bg-primary/5 flex w-full items-center justify-between rounded-sm p-3 dark:bg-neutral-900">
      <div className="flex items-center gap-3">
        <Image
          alt={name}
          src={imageUrl}
          width={35}
          height={35}
          className="rounded-full object-cover outline-1 outline-neutral-100"
        />

        <p className="text-primary font-medium dark:text-neutral-100">{name}</p>
      </div>

      <div className="flex gap-2">
        <Dropdown
          label={role ? role : "Select Role"}
          items={items}
          className="border-primary/20 rounded-sm border-1 bg-neutral-100 p-2 text-xs font-medium dark:bg-neutral-800 dark:text-neutral-300"
        />

        <button
          type="button"
          onClick={() => handleDeselectUser(id)}
          className="cursor-pointer p-1 text-red-500">
          <X />
        </button>
      </div>
    </div>
  );
}

interface UnselectedUserProps extends UserOption {
  handleSelectUser: (id: UserSchema["id"]) => void;
}

function UnselectedUser({
  id,
  name,
  imageUrl,
  handleSelectUser
}: UnselectedUserProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-sm p-3">
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

      <button
        type="button"
        onClick={() => handleSelectUser(id)}
        className="cursor-pointer p-1 text-green-700">
        <Check />
      </button>
    </div>
  );
}
