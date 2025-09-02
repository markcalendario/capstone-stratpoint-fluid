import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import DashboardStatus from "@/components/sections/dashboard/dashboard-status";
import QuickActions from "@/components/sections/dashboard/quick-actions";
import RecentProjects from "@/components/sections/dashboard/recent-projects";

export default function DashboardPage() {
  return (
    <DashboardContent
      title="Dashboard"
      description="Welcome back! Here's an overview of your projects and tasks."
      wrapperClassName="space-y-5">
      {/* Status Boxes */}
      <DashboardStatus />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <RecentProjects />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </DashboardContent>
  );
}
