import { queryClient } from "@/components/ui/query-client-provider";
import {
  getTaskAssignments,
  updateTaskAssignment
} from "@/lib/actions/taskAssignments";
import { TaskSchema } from "@/types/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useTaskAssignments(taskId: TaskSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["taskAssignments", taskId],
    queryFn: () => getTaskAssignments({ taskId })
  });

  return { isTaskAssignmentsLoading: isPending, taskAssignmentsData: data };
}

export function useUpdateTaskAssignments(taskId: TaskSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateTaskAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskAssignments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    }
  });

  return {
    isUpdatingTaskAssignments: isPending,
    updateTaskAssignment: mutateAsync
  };
}
