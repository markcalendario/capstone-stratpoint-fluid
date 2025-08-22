import { queryClient } from "@/components/ui/query-client-provider";
import {
  createAndAssignTask,
  getTaskSlug,
  moveTask
} from "@/lib/actions/tasks";
import { TaskSchema } from "@/types/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateAndAssignTask() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createAndAssignTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndTasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return {
    createAndAssignTask: mutateAsync,
    isCreatingAndAssigningTask: isPending
  };
}

export function useMoveTask() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: moveTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndTasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { moveTask: mutateAsync, isMovingTask: isPending };
}

export function useTaskSlug(id: TaskSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskSlug({ id })
  });

  return { isTaskSlugDataLoading: isPending, taskSlugData: data };
}
