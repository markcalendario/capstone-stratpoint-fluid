import { queryClient } from "@/components/ui/query-client-provider";
import {
  changeTaskPosition,
  createAndAssignTask,
  getListTasks
} from "@/lib/actions/tasks";
import { ListSchema } from "@/types/lists";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useListTasks(listId: ListSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["listTasks", listId],
    queryFn: () => getListTasks({ listId: listId }),
    refetchInterval: 3000,
    refetchIntervalInBackground: false
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
