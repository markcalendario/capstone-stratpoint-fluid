import { queryClient } from "@/components/ui/query-client-provider";
import {
  changeProjectDue,
  changeTaskDue,
  getCalendarEvents,
  getUpcomingDeadlines
} from "@/lib/actions/calendar";
import { UserSchema } from "@/types/users";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCalendarEvents(userId: UserSchema["id"]) {
  const { isPending, data } = useQuery({
    queryFn: getCalendarEvents,
    queryKey: ["calendar", "events", userId],
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
      queryClient.invalidateQueries({
        queryKey: ["calendar", "events", userId]
      });

      queryClient.invalidateQueries({
        queryKey: ["calendar", "deadlines", userId]
      });
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
      queryClient.invalidateQueries({
        queryKey: ["calendar", "events", userId]
      });

      queryClient.invalidateQueries({
        queryKey: ["calendar", "deadlines", userId]
      });
    }
  });

  return {
    isChangingProjectDue: isPending,
    changeProjectDue: mutateAsync
  };
}

export function useUpcomingDeadlines(userId: UserSchema["id"]) {
  const { isPending, data } = useQuery({
    queryFn: getUpcomingDeadlines,
    queryKey: ["calendar", "deadlines", userId],
    refetchInterval: 1000 * 10
  });

  return {
    isUpcomingDeadlinesLoading: isPending,
    upcomingDeadlinesData: data
  };
}
