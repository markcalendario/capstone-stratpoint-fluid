import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Url } from "url";

interface DropdownItem {
  onClick?: () => void;
  href?: Url;
  label: string;
  icon: LucideIcon;
}

interface DropdownProps {
  label: string | ReactNode;
  className?: string;
  items: DropdownItem[];
}

export default function Dropdown({ className, label, items }: DropdownProps) {
  const itemStyle =
    "flex gap-2 p-3 items-center dark:hover:bg-neutral-700 hover:bg-neutral-100 cursor-pointer";

  const renderItem = (item: DropdownItem, i: number) => {
    const { onClick, icon: Icon, href } = item;

    if (onClick) {
      return (
        <MenuItem key={i}>
          <button
            type="button"
            onClick={onClick}
            className={itemStyle}>
            <Icon size={16} /> {item.label}
          </button>
        </MenuItem>
      );
    }

    return (
      <MenuItem key={i}>
        <Link
          href={href ?? "#"}
          className={itemStyle}>
          <Icon /> {label}
        </Link>
      </MenuItem>
    );
  };

  return (
    <Menu>
      <MenuButton className={className}>{label}</MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="flex w-60 flex-col justify-start gap-1 rounded-sm border border-neutral-300 bg-neutral-50 text-sm/6 text-neutral-700 shadow-sm [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-100 data-closed:opacity-0 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
        {items.map(renderItem)}
      </MenuItems>
    </Menu>
  );
}
