import { queryClient } from "@/components/ui/query-client-provider";
import { createAndAssignTask, getListTasks } from "@/lib/actions/tasks";
import { ListSchema } from "@/types/lists";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useListTasks(id: ListSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["listTasks", id],
    queryFn: () => getListTasks({ listId: id })
  });

  return { isListTasksLoading: isPending, listTasksData: data };
}

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
