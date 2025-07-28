"use client";

import useIsOnMobile from "@/hooks/use-is-on-mobile";
import { useEffect, useState } from "react";
import { Main } from "./main";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isOnMobile = useIsOnMobile();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    setIsSidebarOpen(isOnMobile !== null && isOnMobile !== true);
  }, [isOnMobile]);

  return (
    <section className="dashboard-grid relative min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <Main>{children}</Main>
    </section>
  );
}
