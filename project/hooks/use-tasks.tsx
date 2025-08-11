import { queryClient } from "@/components/ui/query-client-provider";
import { createAndAssignTask, getListTasks } from "@/lib/actions/tasks";
import { GetListTasksPayload } from "@/types/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useListTasks(payload: GetListTasksPayload) {
  const { isPending, data } = useQuery({
    queryKey: ["listTasks", payload.listId],
    queryFn: () => getListTasks(payload)
  });

  return { isListTasksLoading: isPending, listTasksData: data };
}

export function useCreateAndAssignTask() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createAndAssignTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listTasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStatus"] });
    }
  });

  return {
    createAndAssignTask: mutateAsync,
    isCreatingAndAssignTaskLoading: isPending
  };
}
