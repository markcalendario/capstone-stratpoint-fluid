import { useProjectProgress } from "@/hooks/use-analytics";
import { ProjectSchema } from "@/types/projects";
import { TaskStatus } from "@/types/tasks";
import BarChart, { BarChartData } from "./bar-chart";
import SectionLoader from "./section-loader";

const data: BarChartData<TaskStatus> = [
  {
    name: "TaskFlow Capstone Project",
    done: 30,
    pending: 100 - 30
  }
];

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
    <div className="outline-primary/20 rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
      <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Project Progress
      </h3>
      <BarChart
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
