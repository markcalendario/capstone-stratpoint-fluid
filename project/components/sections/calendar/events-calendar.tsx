import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import Calendar from "@/components/ui/calendar";
import SectionLoader from "@/components/ui/section-loader";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useCalendarEvents, useChangeTaskDue } from "@/hooks/use-calendar";
import { formatToHTMLDate } from "@/lib/utils/date-and-time";
import { EventResource } from "@/types/calendar";
import { TaskSchema } from "@/types/tasks";
import { useClerk } from "@clerk/nextjs";
import { Event } from "react-big-calendar";
import { EventInteractionArgs } from "react-big-calendar/lib/addons/dragAndDrop";

export default function EventsCalendar() {
  const { user } = useClerk();

  const { isCalendarEventsLoading, calendarEventsData } = useCalendarEvents(
    user?.id ?? ""
  );
  const { changeTaskDue } = useChangeTaskDue(user?.id ?? "");

  const events = calendarEventsData?.events;
  const isLoading = isCalendarEventsLoading || !events;

  const handleChangeTaskDue = async (
    id: TaskSchema["id"],
    dueDate: TaskSchema["dueDate"]
  ) => {
    const { success, message } = await changeTaskDue({
      id: id,
      dueDate: formatToHTMLDate(dueDate)
    });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);
  };

  const handleEventDrop = (event: EventInteractionArgs<Event>) => {
    const { id, type } = event.event.resource as EventResource;

    switch (type) {
      case "project":
        break;

      case "task":
        handleChangeTaskDue(id, event.start as TaskSchema["dueDate"]);
      default:
        break;
    }
  };

  if (isLoading) return <SectionLoader text="Loading Events" />;

  return (
    <DashboardContent
      title="Calendar"
      description="View project deadlines and team schedules">
      <Calendar
        events={events}
        onEventDrop={handleEventDrop}
        onSelectEvent={(evt) => console.log("Selected event:", evt)}
      />
    </DashboardContent>
  );
}
