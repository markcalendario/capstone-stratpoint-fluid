import { cn } from "@/lib/utils/tailwind";
import { LucideIcon, X } from "lucide-react";
import Link from "next/link";
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

export interface DropdownItem {
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

  const closeDropdown = () => setIsOpen(false);

  return (
    <div
      className="relative"
      ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleIsOpen}
        className={cn(className, "flex cursor-pointer items-center gap-2")}>
        {label}
      </button>

      {isOpen && (
        <RenderMenu
          items={items}
          closeDropdown={closeDropdown}
        />
      )}
    </div>
  );
}

interface RenderMenuProps {
  items: DropdownItem[];
  closeDropdown: () => void;
}

function RenderMenu({ items, closeDropdown }: RenderMenuProps) {
  return (
    <Fragment>
      {/* Desktop dropdown */}
      <div className="border-primary/20 absolute right-0 mt-2 hidden w-max min-w-[250px] rounded-xs border bg-white shadow-lg sm:block dark:bg-neutral-800">
        {items.map((item, i) => (
          <RenderItem
            key={i}
            item={item}
            closeDropdown={closeDropdown}
          />
        ))}
      </div>

      {/* Mobile sheet */}
      <div className="fixed inset-0 z-50 flex items-end bg-black/30 backdrop-blur-sm sm:hidden">
        <div className="w-full rounded-t-xs bg-white p-4 shadow-lg dark:bg-neutral-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              Menu
            </span>
            <button
              onClick={closeDropdown}
              className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
              <X className="cursor-pointer" />
            </button>
          </div>
          <div className="flex flex-col">
            {items.map((item, i) => (
              <RenderItem
                key={i}
                item={item}
                closeDropdown={closeDropdown}
              />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

interface RenderItemProps {
  item: DropdownItem;
  closeDropdown: () => void;
}

function RenderItem({ item, closeDropdown }: RenderItemProps) {
  const itemStyles =
    "flex w-full items-center cursor-pointer gap-3 py-2 px-3 text-[15px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors";

  if (item.href) {
    return (
      <Link
        href={item.href}
        onClick={closeDropdown}
        className={itemStyles}>
        <item.icon size={16} /> {item.label}
      </Link>
    );
  } else if (item.onClick) {
    return (
      <button
        type="button"
        onClick={() => {
          item.onClick?.();
          closeDropdown();
        }}
        className={itemStyles}>
        <item.icon size={16} /> {item.label}
      </button>
    );
  }

  return null;
}
