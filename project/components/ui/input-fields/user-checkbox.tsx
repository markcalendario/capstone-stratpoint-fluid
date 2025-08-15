import { UserSchema } from "@/types/users";
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
      />

      <label
        htmlFor={id}
        className="border-primary/20 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary dark:border-primary/50 flex cursor-pointer items-center gap-2 rounded-sm border-1 px-3 py-1 dark:text-neutral-200 dark:peer-checked:text-white">
        <Image
          width={30}
          height={30}
          src={image}
          alt={name}
          className="border-primary rounded-full border-1 object-cover"
        />

        <p className="text-sm">{userName}</p>
      </label>
    </div>
  );
}
