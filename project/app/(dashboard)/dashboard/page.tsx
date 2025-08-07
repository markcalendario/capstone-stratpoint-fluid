import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import DashboardStatus from "@/components/sections/dashboard/dashboard-status";
import QuickActions from "@/components/sections/dashboard/quick-actions";
import RecentProjects from "@/components/sections/dashboard/recent-projects";
import { TrendingUp } from "lucide-react";

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
