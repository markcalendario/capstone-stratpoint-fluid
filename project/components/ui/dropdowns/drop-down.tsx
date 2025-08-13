import { LucideIcon } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface DropdownItem {
  onClick?: () => void;
  href?: string;
  label: string;
  icon: LucideIcon;
}

interface DropdownProps {
  label: string | ReactNode;
  className?: string;
  items: DropdownItem[];
}

export default function Dropdown({ className, label, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="relative"
      ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleIsOpen}
        className={className}>
        {label}
      </button>

      {isOpen && <RenderMenu items={items} />}
    </div>
  );
}
interface RenderMenuProps {
  items: DropdownItem[];
}

function RenderMenu({ items }: RenderMenuProps) {
  return (
    <div className="border-primary/20 absolute right-0 z-1 mt-1 min-w-50 rounded-sm border-1 bg-white shadow-lg dark:bg-neutral-800">
      {items.map((item, i) => (
        <RenderItem
          key={i}
          item={item}
        />
      ))}
    </div>
  );
}

interface RenderItemProps {
  item: DropdownItem;
}

function RenderItem({ item }: RenderItemProps) {
  const itemStyles =
    "flex w-full cursor-pointer font-medium duration-100 hover:gap-4 dark:hover:bg-neutral-700 dark:text-neutral-300 items-center py-2 px-3 hover:bg-neutral-100 gap-3 text-[14px] text-neutral-700";

  if (item.href) {
    return (
      <a
        href={item.href}
        className={itemStyles}>
        {<item.icon size={14} />} {item.label}
      </a>
    );
  } else if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={itemStyles}>
        {<item.icon size={14} />} {item.label}
      </button>
    );
  }
}
