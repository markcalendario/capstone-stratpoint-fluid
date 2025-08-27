"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import AnalyticsSummary from "@/components/sections/analytics/analytics-summary";
import ProjectProgress from "@/components/sections/analytics/project-progress";
import StatusByPriority from "@/components/sections/analytics/status-by-priority";
import SelectProject from "@/components/ui/input-fields/select/select-project";
import { ProjectSchema } from "@/types/projects";
import { Fragment, useState } from "react";

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
        <SelectProject onChange={handleSelectProject} />

        {projectId && (
          <Fragment>
            <AnalyticsSummary projectId={projectId} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ProjectProgress projectId={projectId} />
              <StatusByPriority projectId={projectId} />
            </div>
          </Fragment>
        )}
      </div>
    </DashboardContent>
  );
}
