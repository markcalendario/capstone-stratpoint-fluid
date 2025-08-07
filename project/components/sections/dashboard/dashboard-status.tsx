"use client";

import { getDashboardStatus } from "@/lib/actions/analytics";
import { useUser } from "@clerk/nextjs";
import { CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import StatusCard from "../../status-card";
import { showErrorToast } from "../../toast";

type Status = {
  count: number;
  change: string;
  changeType: "positive" | "negative";
};

type DashboardStatusData = {
  teamMembers: Status;
  pendingTasks: Status;
  activeProjects: Status;
  completedTasks: Status;
};

export default function DashboardStatus() {
  const { user } = useUser();
  const [statusData, setStatusData] = useState<DashboardStatusData | null>(
    null
  );

  const retrieveDashboardStatus = useCallback(async () => {
    if (!user?.id) return;

    const { success, message, status } = await getDashboardStatus(user.id);
    if (!success || !status) return showErrorToast(message);

    setStatusData(status);
  }, [user?.id]);

  useEffect(() => {
    retrieveDashboardStatus();
  }, [retrieveDashboardStatus]);

  if (!statusData) return null;

  const status = [
    {
      name: "Active Projects",
      value: statusData.activeProjects.count,
      change: statusData.activeProjects.change,
      changeType: statusData.activeProjects.changeType,
      icon: TrendingUp
    },
    {
      name: "Team Members",
      value: statusData.teamMembers.count,
      change: statusData.teamMembers.change,
      changeType: statusData.teamMembers.changeType,
      icon: Users
    },
    {
      name: "Completed Tasks",
      value: statusData.completedTasks.count,
      change: statusData.completedTasks.change,
      changeType: statusData.completedTasks.changeType,
      icon: CheckCircle
    },
    {
      name: "Pending Tasks",
      value: statusData.pendingTasks.count,
      change: statusData.pendingTasks.change,
      changeType: statusData.pendingTasks.changeType,
      icon: Clock
    }
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
      {status.map((stat, i) => (
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
