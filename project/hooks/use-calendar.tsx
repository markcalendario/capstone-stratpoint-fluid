import { queryClient } from "@/components/ui/query-client-provider";
import {
  changeProjectDue,
  changeTaskDue,
  getCalendarEvents
} from "@/lib/actions/calendar";
import { UserSchema } from "@/types/users";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCalendarEvents(userId: UserSchema["id"]) {
  const { isPending, data } = useQuery({
    queryFn: getCalendarEvents,
    queryKey: ["calendarEvents", userId],
    refetchInterval: 1000 * 10
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

export function useChangeProjectDue(userId: UserSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: changeProjectDue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents", userId] });
    }
  });

  return {
    isChangingProjectDue: isPending,
    changeProjectDue: mutateAsync
  };
}
