import { queryClient } from "@/components/ui/query-client-provider";
import {
  getTaskAssignments,
  updateTaskAssignment
} from "@/lib/actions/taskAssignments";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useTaskAssignments(taskId: TaskSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["taskAssignments", taskId],
    queryFn: () => getTaskAssignments({ taskId })
  });

  return { isTaskAssignmentsLoading: isPending, taskAssignmentsData: data };
}

export function useUpdateTaskAssignments(
  projectId: ProjectSchema["id"],
  taskId: TaskSchema["id"]
) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateTaskAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskAssignments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["listsAndTasks", projectId] });
    }
  });

  return {
    isUpdatingTaskAssignments: isPending,
    updateTaskAssignment: mutateAsync
  };
}
