import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import DeadlineBar from "@/components/ui/deadline-bar";
import SectionLoader from "@/components/ui/section-loader";
import { useUpcomingDeadlines } from "@/hooks/use-calendar";
import { useClerk } from "@clerk/nextjs";

export default function UpcomingDeadlines() {
  const { user } = useClerk();

  const { isUpcomingDeadlinesLoading, upcomingDeadlinesData } =
    useUpcomingDeadlines(user?.id ?? "");

  const deadlines = upcomingDeadlinesData?.deadlines;
  const isLoading = isUpcomingDeadlinesLoading || !deadlines;

  if (isLoading) return <SectionLoader text="Loading Events" />;

  return (
    <DashboardContent
      title="Upcoming Deadlines"
      description="3 Soonest Deadlines">
      <div className="space-y-3">
        {deadlines.map((deadline, i) => (
          <DeadlineBar
            key={i}
            {...deadline}
            className="bg-white dark:bg-neutral-800"
          />
        ))}
      </div>
    </DashboardContent>
  );
}
