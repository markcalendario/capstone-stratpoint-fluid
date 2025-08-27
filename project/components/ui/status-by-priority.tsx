import { useStatusByPriority } from "@/hooks/use-analytics";
import { ProjectSchema } from "@/types/projects";
import SectionLoader from "./section-loader";
import StatusByPriorityChart from "./status-by-priority-chart";

interface StatusByPriorityProps {
  projectId: ProjectSchema["id"];
}

export default function StatusByPriority({ projectId }: StatusByPriorityProps) {
  const { isStatusByPriorityLoading, statusByPriorityData } =
    useStatusByPriority(projectId);

  const statusByPriority = statusByPriorityData?.statusByPriorty;
  const isLoading = isStatusByPriorityLoading || !statusByPriority;

  if (isLoading) {
    return <SectionLoader text="Loading Status by Priority" />;
  }

  return (
    <div className="outline-primary/20 rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
      <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Status by Priority
      </h3>
      <StatusByPriorityChart data={statusByPriority} />
    </div>
  );
}
