import AnalyticsCard from "@/components/ui/analytics-card";
import SectionLoader from "@/components/ui/section-loader";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { ProjectSchema } from "@/types/projects";
import { CircleDashed, CircleDot, ClockAlert, TrendingUp } from "lucide-react";

interface AnalyticsSummaryProps {
  projectId: ProjectSchema["id"];
}

export default function AnalyticsSummary({ projectId }: AnalyticsSummaryProps) {
  const { isAnalyticsSummaryLoading, analyticsSummaryData } =
    useAnalyticsSummary(projectId);

  const status = analyticsSummaryData?.status;
  const isLoaded = !isAnalyticsSummaryLoading && status;

  if (!isLoaded) {
    return <SectionLoader text="Loading Analytics Summary" />;
  }

  const metrics = [
    {
      title: "Completion Rate",
      value: status.completionRate,
      unit: "percent",
      icon: TrendingUp,
      color: "blue"
    },
    {
      title: "Pending Tasks",
      value: status.tasksPending,
      unit: "tasks",
      icon: CircleDashed,
      color: "yellow"
    },
    {
      title: "Done Tasks",
      value: status.tasksDone,
      unit: "tasks",
      icon: CircleDot,
      color: "green"
    },
    {
      title: "Overdue Tasks",
      value: status.overdueTasks,
      unit: "tasks",
      icon: ClockAlert,
      color: "red"
    }
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <AnalyticsCard
          key={index}
          {...metric}
          className="bg-white dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}
