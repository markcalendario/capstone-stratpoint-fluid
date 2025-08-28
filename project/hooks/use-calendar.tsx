import getCalendarEvents from "@/lib/actions/calendar";
import { useQuery } from "@tanstack/react-query";

export function useCalendarEvents() {
  const { isPending, data } = useQuery({
    queryFn: getCalendarEvents,
    queryKey: ["calendarEvents"]
  });

  return {
    isCalendarEventsLoading: isPending,
    calendarEventsData: data
  };
}
