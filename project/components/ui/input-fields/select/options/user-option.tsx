import Dropdown from "@/components/ui/dropdowns/drop-down";
import { cn } from "@/lib/utils/tailwind";
import { UserOption } from "@/types/roles";
import { UserSchema } from "@/types/users";
import { Check, LoaderCircle, Star, X } from "lucide-react";
import Image from "next/image";

interface UserOptionRowProps {
  id: UserSchema["id"];
  name: UserSchema["name"];
  imageUrl: UserSchema["imageUrl"];
  role?: UserOption["role"];
  rolesOptions?: NonNullable<UserOption["role"]>[];
  onSelect?: (id: UserSchema["id"]) => void;
  onDeselect?: (id: UserSchema["id"]) => void;
  onRoleChange?: (id: UserSchema["id"], role: UserOption["role"]) => void;
}

export default function UserOptionRow({
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

  let dropdownItems = [
    { label: "Loading...", icon: LoaderCircle, onClick: () => {} }
  ];

  if (rolesOptions && onRoleChange) {
    dropdownItems = rolesOptions.map((role) => ({
      icon: Star,
      label: role.title,
      onClick: () => onRoleChange(id, role)
    }));
  }

  return (
    <div
      className={cn(
        isSelected && "bg-neutral-100 dark:bg-neutral-900",
        "flex w-full flex-wrap items-center justify-between gap-2 rounded-sm p-3"
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
