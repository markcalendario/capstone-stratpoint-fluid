"use client";

import { useTheme } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  FolderOpen,
  Home,
  Moon,
  Settings,
  Sun,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

const LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: Home, current: true },
  { label: "Projects", path: "/projects", icon: FolderOpen, current: false },
  { label: "Team", path: "/team", icon: Users, current: false },
  { label: "Analytics", path: "/analytics", icon: BarChart3, current: false },
  { label: "Calendar", path: "/calendar", icon: Calendar, current: false },
  { label: "Settings", path: "/settings", icon: Settings, current: false }
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();

  const baseClasses =
    "flex font-medium items-center rounded-sm gap-3 px-5 py-3 min-md:max-lg:p-0 min-md:max-lg:justify-center min-md:max-lg:aspect-square cursor-pointer";
  const inactiveClasses =
    "text-neutral-900 hover:bg-primary/5 dark:text-neutral-100";
  const activeClasses = "text-neutral-100 bg-primary";

  if (!isOpen) return null;

  return (
    <aside className="dashboard-sidebar border-primary/20 fixed top-[65px] z-[1] h-full w-full border-r-2 bg-white md:w-[88px] lg:w-[300px] dark:bg-neutral-800">
      <div className="flex h-full flex-col gap-1 overflow-y-auto p-[15px]">
        {LINKS.map(({ label, path, icon: Icon }, i) => {
          const isActive = pathname === path;

          return (
            <Link
              key={i}
              href={path}
              className={cn(
                baseClasses,
                isActive ? activeClasses : inactiveClasses
              )}>
              <Icon size={20} />
              <span className="block md:hidden lg:block">{label}</span>
            </Link>
          );
        })}

        <hr className="text-primary/20" />

        <Link
          href="#"
          onClick={theme.toggleTheme}
          className={cn(baseClasses, inactiveClasses)}>
          {theme.theme === "light" ? <Moon /> : <Sun />}
          <span className="block md:hidden lg:block">Toggle Theme</span>
        </Link>
      </div>
    </aside>
  );
}
