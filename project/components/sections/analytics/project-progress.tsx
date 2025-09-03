import ProjectProgressChart from "@/components/ui/project-progress-chart";
import SectionLoader from "@/components/ui/section-loader";
import { useProjectProgress } from "@/hooks/use-analytics";
import { ProjectSchema } from "@/types/projects";

interface ProjectProgressProps {
  projectId: ProjectSchema["id"];
}

export default function ProjectProgress({ projectId }: ProjectProgressProps) {
  const { isProjectProgressLoading, projectProgressData } =
    useProjectProgress(projectId);

  const progress = projectProgressData?.progress;
  const isLoading = isProjectProgressLoading || !progress;

  if (isLoading) return <SectionLoader text="Loading Progress" />;

  return (
    <div className="outline-primary/20 rounded-xs bg-white p-6 outline-1 dark:bg-neutral-800">
      <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Project Progress
      </h3>
      <ProjectProgressChart
        data={[
          {
            name: progress.name,
            done: progress.donePercent,
            pending: progress.pendingPercent
          }
        ]}
      />
    </div>
  );
}
