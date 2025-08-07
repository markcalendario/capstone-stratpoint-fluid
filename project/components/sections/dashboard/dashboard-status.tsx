"use server";

import { getDashboardStatus } from "@/lib/actions/analytics";
import { CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import StatusCard from "../../status-card";

export default async function DashboardStatus() {
  const { status } = await getDashboardStatus();

  if (!status) return null;

  const statusCardData = [
    {
      name: "Active Projects",
      value: status.activeProjects.count,
      change: status.activeProjects.change,
      changeType: status.activeProjects.changeType,
      icon: TrendingUp
    },
    {
      name: "Team Members",
      value: status.teamMembers.count,
      change: status.teamMembers.change,
      changeType: status.teamMembers.changeType,
      icon: Users
    },
    {
      name: "Completed Tasks",
      value: status.completedTasks.count,
      change: status.completedTasks.change,
      changeType: status.completedTasks.changeType,
      icon: CheckCircle
    },
    {
      name: "Pending Tasks",
      value: status.pendingTasks.count,
      change: status.pendingTasks.change,
      changeType: status.pendingTasks.changeType,
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
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
