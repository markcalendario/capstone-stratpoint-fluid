import { UserSchema } from "@/types/users";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { InputHTMLAttributes } from "react";

interface UserCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  userId: UserSchema["id"];
  userName: UserSchema["name"];
  image: UserSchema["imageUrl"];
}

export default function UserCheckbox({
  id,
  name,
  userId,
  userName,
  image,
  checked,
  onChange
}: UserCheckboxProps) {
  return (
    <div className="inline-block">
      <input
        id={id}
        name={name}
        value={userId}
        type="checkbox"
        onChange={onChange}
        className="peer hidden"
        checked={checked}
      />

      <label
        htmlFor={id}
        className="peer-checked:bg-primary bg-primary/10 ring-primary/20 flex cursor-pointer items-center gap-2 rounded-xs px-4 py-2 ring-1 duration-100 select-none ring-inset peer-checked:text-neutral-100 dark:bg-neutral-100/10 dark:text-neutral-200 dark:ring-neutral-100/70 dark:peer-checked:bg-neutral-100/70 dark:peer-checked:text-neutral-800">
        {checked && <Minus size={14} />}
        {!checked && <Plus size={14} />}

        <Image
          width={30}
          height={30}
          src={image}
          alt={name}
          className="rounded-full object-cover ring-1 ring-neutral-100 ring-inset"
        />

        <p className="text-sm">{userName}</p>
      </label>
    </div>
  );
}
