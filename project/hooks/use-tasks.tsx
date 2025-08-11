import { getListTasks } from "@/lib/actions/tasks";
import { GetTasksByListId } from "@/types/tasks";
import { useQuery } from "@tanstack/react-query";

export function useListTasks(payload: GetTasksByListId) {
  const { isPending, data } = useQuery({
    queryKey: ["listTasks"],
    queryFn: () => getListTasks(payload)
  });

  return { isListTasksLoading: isPending, listTasksData: data };
}
