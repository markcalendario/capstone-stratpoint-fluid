import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import Calendar from "@/components/ui/calendar";
import SectionLoader from "@/components/ui/section-loader";
import { useCalendarEvents } from "@/hooks/use-calendar";

export default function EventsCalendar() {
  const { isCalendarEventsLoading, calendarEventsData } = useCalendarEvents();

  const events = calendarEventsData?.events;
  const isLoading = isCalendarEventsLoading || !events;

  if (isLoading) return <SectionLoader text="Loading Events" />;
  console.log(events);

  return (
    <DashboardContent
      title="Calendar"
      description="View project deadlines and team schedules">
      <Calendar
        events={events}
        onSelectEvent={(evt) => console.log("Selected event:", evt)}
      />
    </DashboardContent>
  );
}
