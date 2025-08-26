import Dropdown from "@/components/ui/dropdowns/drop-down";
import { RolesSchema, UserOption } from "@/types/roles";
import { UserSchema } from "@/types/users";
import { LoaderCircle, Star } from "lucide-react";
import Image from "next/image";

interface UserRolePickerProps {
  id: UserSchema["id"];
  name: UserSchema["name"];
  imageUrl: UserSchema["imageUrl"];
  role: Pick<RolesSchema, "id" | "title">;
  rolesOptions: NonNullable<UserOption["role"]>[];
  onRoleChange: (id: UserSchema["id"], role: RolesSchema["id"]) => void;
}

export default function UserRolePicker({
  id,
  name,
  imageUrl,
  role,
  rolesOptions,
  onRoleChange
}: UserRolePickerProps) {
  let dropdownItems = [
    { label: "Loading...", icon: LoaderCircle, onClick: () => {} }
  ];

  if (rolesOptions && onRoleChange) {
    dropdownItems = rolesOptions.map((role) => ({
      icon: Star,
      label: role.title,
      onClick: () => onRoleChange(id, role.id)
    }));
  }

  return (
    <div className="ring-primary flex w-full items-center justify-between gap-2 rounded-sm bg-neutral-100 p-3 transition dark:bg-neutral-900 dark:hover:ring-2">
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

      <Dropdown
        label={role.title}
        items={dropdownItems}
        className="border-primary/20 rounded-sm border bg-white px-3 py-1 text-sm font-medium dark:bg-neutral-800 dark:text-neutral-300"
      />
    </div>
  );
}
