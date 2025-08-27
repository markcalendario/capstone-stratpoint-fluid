"use client";

import SectionLoader from "@/components/ui/section-loader";
import { useDashboardStatus } from "@/hooks/use-analytics";
import { CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import StatusCard from "../../ui/status-card";

export default function DashboardStatus() {
  const { isDashboardStatusLoading, dashboardStatusData } =
    useDashboardStatus();

  if (isDashboardStatusLoading || !dashboardStatusData?.status) {
    return <SectionLoader text="Loading Status" />;
  }

  const { status } = dashboardStatusData;

  const statusCardData = [
    {
      name: "Active Projects",
      overall: status.activeProjects.overall,
      thisWeek: status.activeProjects.thisWeek,
      icon: TrendingUp
    },
    {
      name: "Project Members",
      overall: status.projectMembers.overall,
      thisWeek: status.projectMembers.thisWeek,
      icon: Users
    },
    {
      name: "Completed Tasks",
      overall: status.completedTasks.overall,
      thisWeek: status.completedTasks.thisWeek,
      icon: CheckCircle
    },
    {
      name: "Pending Tasks",
      overall: status.pendingTasks.overall,
      thisWeek: status.pendingTasks.thisWeek,
      icon: Clock
    }
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
      {statusCardData.map((stat, i) => (
        <StatusCard
          key={i}
          className="w-full"
          name={stat.name}
          icon={stat.icon}
          overall={stat.overall}
          thisWeek={stat.thisWeek}
        />
      ))}
    </div>
  );
}
