"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import AnalyticsCard from "@/components/ui/analytics-card";
import SelectProject from "@/components/ui/input-fields/select/select-project";
import ProjectProgress from "@/components/ui/project-progress";
import StatusByPriority from "@/components/ui/status-by-priority";
import { ProjectSchema } from "@/types/projects";
import { BarChart3, Clock, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

const metrics = [
  {
    title: "Project Velocity",
    value: "8.5",
    unit: "tasks/week",
    icon: TrendingUp,
    color: "blue"
  },
  {
    title: "Team Efficiency",
    value: "92%",
    unit: "completion rate",
    icon: BarChart3,
    color: "green"
  },
  {
    title: "Active Users",
    value: "24",
    unit: "this week",
    icon: Users,
    color: "purple"
  },
  {
    title: "Avg. Task Time",
    value: "2.3",
    unit: "days",
    icon: Clock,
    color: "red"
  }
] as const;

export default function AnalyticsPage() {
  const [projectId, setProjectId] = useState<ProjectSchema["id"] | null>(null);

  const handleSelectProject = (projectId: ProjectSchema["id"] | null) => {
    setProjectId(projectId);
  };

  return (
    <DashboardContent
      title="Analytics"
      description="Track project performance and team productivity">
      <div className="space-y-6">
        {/* Project Selector */}
        <SelectProject onChange={handleSelectProject} />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <AnalyticsCard
              key={index}
              {...metric}
              className="bg-white dark:bg-neutral-800"
            />
          ))}
        </div>

        {projectId && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ProjectProgress projectId={projectId} />
            <StatusByPriority projectId={projectId} />
          </div>
        )}
      </div>
    </DashboardContent>
  );
}
