import DashboardStatus from "@/components/dashboard-status";
import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import QuickActions from "@/components/quick-actions";
import { RecentProjects } from "@/components/recent-projects";
import { CheckCircle, Clock, TrendingUp, Users } from "lucide-react";

const STATUS = [
  {
    name: "Active Projects",
    value: "12",
    icon: TrendingUp,
    change: "+2.5%",
    changeType: "positive"
  },
  {
    name: "Team Members",
    value: "24",
    icon: Users,
    change: "+4.1%",
    changeType: "positive"
  },
  {
    name: "Completed Tasks",
    value: "156",
    icon: CheckCircle,
    change: "+12.3%",
    changeType: "positive"
  },
  {
    name: "Pending Tasks",
    value: "43",
    icon: Clock,
    change: "-2.1%",
    changeType: "positive"
  }
] as const;

export default function DashboardPage() {
  return (
    <DashboardContent
      title="Dashboard"
      description="Welcome back! Here's an overview of your projects and tasks."
      className="space-y-5">
      {/* Implementation Status Banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full">
              <TrendingUp
                className="text-white"
                size={16}
              />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Dashboard Implementation Tasks
            </h3>
            <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
              <ul className="list-inside list-disc space-y-1">
                <li>
                  Task 4.2: Create project listing and dashboard interface
                </li>
                <li>
                  Task 5.3: Set up client-side state management with Zustand
                </li>
                <li>
                  Task 6.6: Optimize performance and implement loading states
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Status Boxes */}
      <DashboardStatus />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <RecentProjects />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </DashboardContent>
  );
}
