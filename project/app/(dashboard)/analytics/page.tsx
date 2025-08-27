"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import AnalyticsCard from "@/components/ui/analytics-card";
import CumulativeFlowDiagram from "@/components/ui/area-chart";
import SelectProject from "@/components/ui/input-fields/select/select-project";
import ProjectProgress from "@/components/ui/project-progress";
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

const cfdData = [
  { date: "2025-07-01", Todo: 5, InProgress: 3, QA: 1, Review: 0, Done: 5 },
  { date: "2025-07-02", Todo: 4, InProgress: 4, QA: 0, Review: 1, Done: 0 },
  { date: "2025-07-03", Todo: 2, InProgress: 5, QA: 0, Review: 2, Done: 0 },
  { date: "2025-07-04", Todo: 1, InProgress: 3, QA: 0, Review: 0, Done: 0 }
];

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
            <div className="outline-primary/20 rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
              <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                Team Activity
              </h3>
              <CumulativeFlowDiagram data={cfdData} />
            </div>
          </div>
        )}
      </div>
    </DashboardContent>
  );
}
