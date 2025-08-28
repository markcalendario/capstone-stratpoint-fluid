import { queryClient } from "@/components/ui/query-client-provider";
import { changeTaskDue, getCalendarEvents } from "@/lib/actions/calendar";
import { UserSchema } from "@/types/users";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCalendarEvents(userId: UserSchema["id"]) {
  const { isPending, data } = useQuery({
    queryFn: getCalendarEvents,
    queryKey: ["calendarEvents", userId]
  });

  return {
    isCalendarEventsLoading: isPending,
    calendarEventsData: data
  };
}

export function useChangeTaskDue(userId: UserSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: changeTaskDue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents", userId] });
    }
  });

  return {
    isChangingTaskDue: isPending,
    changeTaskDue: mutateAsync
  };
}
