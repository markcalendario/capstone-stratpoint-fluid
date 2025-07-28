"use client";

import Dashboard from "@/components/layouts/dashboard/dashboard";
import type React from "react";

interface DashboardLayout {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayout) {
  return <Dashboard>{children}</Dashboard>;
}
