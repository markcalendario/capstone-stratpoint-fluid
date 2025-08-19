import { queryClient } from "@/components/ui/query-client-provider";
import { changeTaskPosition, createAndAssignTask } from "@/lib/actions/tasks";
import { useMutation } from "@tanstack/react-query";

export function useCreateAndAssignTask() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createAndAssignTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listTasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return {
    createAndAssignTask: mutateAsync,
    isCreatingAndAssignTaskLoading: isPending
  };
}

export function useChangeTaskPosition() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: changeTaskPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listTasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return {
    changeTaskPosition: mutateAsync,
    isChangingPosition: isPending
  };
}
