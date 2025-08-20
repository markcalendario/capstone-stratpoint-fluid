import { queryClient } from "@/components/ui/query-client-provider";
import { createAndAssignTask, moveTask } from "@/lib/actions/tasks";
import { useMutation } from "@tanstack/react-query";

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
    isCreatingAndAssignTaskLoading: isPending
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
