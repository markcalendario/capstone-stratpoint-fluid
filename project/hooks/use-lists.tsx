import { queryClient } from "@/components/ui/query-client-provider";
import { getList, getProjectLists, updateList } from "@/lib/actions/lists";
import {
  GetListPayload,
  GetProjectListsPayload,
  UpdateListPayload
} from "@/types/lists";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useList(payload: GetListPayload) {
  const { isPending, data } = useQuery({
    queryKey: ["list"],
    queryFn: () => getList(payload)
  });

  return { isListLoading: isPending, listData: data };
}

export function useProjectLists(payload: GetProjectListsPayload) {
  const { isPending, data } = useQuery({
    queryKey: ["projectLists", payload.projectId],
    queryFn: () => getProjectLists(payload)
  });

  return { isProjectListLoading: isPending, projectListsData: data };
}

export function useUpdateList() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: UpdateListPayload) => updateList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"] });
      queryClient.invalidateQueries({ queryKey: ["projectLists"] });
    }
  });

  return { isListUpdating: isPending, updateList: mutateAsync };
}
