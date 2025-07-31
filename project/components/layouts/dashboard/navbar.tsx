"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="dashboard-nav bg-primary border-primary/20 fixed top-0 left-0 z-[2] w-full border-b-2 p-[15px] dark:bg-neutral-800">
      <div className="flex justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            alt="user"
            width={35}
            height={35}
            className="svg-white"
            src="/assets/images/logo.svg"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="block cursor-pointer text-neutral-100 md:hidden">
            <Menu />
          </button>

          <div className="flex items-center rounded-full bg-red-300 outline-2 outline-white">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
