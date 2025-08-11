import { queryClient } from "@/components/ui/query-client-provider";
import {
  createList,
  getList,
  getProjectLists,
  updateList
} from "@/lib/actions/lists";
import {
  CreateListPayload,
  GetListPayload,
  GetProjectListsPayload,
  UpdateListPayload
} from "@/types/lists";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useList(payload: GetListPayload) {
  const { isPending, data } = useQuery({
    queryKey: ["list", payload.id],
    queryFn: () => getList(payload)
  });

  return { isListLoading: isPending, listData: data };
}

export function useProjectLists(payload: GetProjectListsPayload) {
  const { isPending, data } = useQuery({
    queryKey: ["projectLists"],
    queryFn: () => getProjectLists(payload)
  });

  return { isProjectListLoading: isPending, projectListsData: data };
}

export function useUpdateList(payload: UpdateListPayload) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: UpdateListPayload) => updateList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", payload.id] });
      queryClient.invalidateQueries({ queryKey: ["projectLists"] });
    }
  });

  return { isListUpdating: isPending, updateList: mutateAsync };
}

export function useCreateList() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: CreateListPayload) => createList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectLists"] });
    }
  });

  return { isCreatingList: isPending, createList: mutateAsync };
}
