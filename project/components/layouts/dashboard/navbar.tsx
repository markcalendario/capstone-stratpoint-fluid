import InviteNotificationsButton from "@/components/ui/notification-button";
import useIsOnMobile from "@/hooks/use-is-on-mobile";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const isMobile = useIsOnMobile();

  return (
    <nav className="dashboard-nav bg-primary border-primary/20 fixed top-0 left-0 z-[2] w-full border-b-2 px-[30px] py-[15px] dark:bg-neutral-800">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image
              alt="user"
              width={30}
              height={30}
              className="svg-white"
              src="/assets/images/logo.svg"
            />
          </div>

          <p className="text-2xl font-bold text-white">Fluid</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="block cursor-pointer text-neutral-100 md:hidden">
            <Menu />
          </button>

          <InviteNotificationsButton />
          <div className="flex items-center gap-2 rounded-lg bg-neutral-100 p-1 ring-1 ring-white dark:bg-neutral-900">
            <UserButton
              showName={!isMobile}
              appearance={{
                elements: {
                  userButtonOuterIdentifier:
                    "text-primary dark:text-neutral-100"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
