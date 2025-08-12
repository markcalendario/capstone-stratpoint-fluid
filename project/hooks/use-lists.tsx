import { queryClient } from "@/components/ui/query-client-provider";
import {
  createList,
  deleteList,
  getList,
  getProjectLists,
  updateList
} from "@/lib/actions/lists";
import {
  CreateListPayload,
  DeleteListPayload,
  ListSchema,
  UpdateListPayload
} from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useList(id: ListSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["list", id],
    queryFn: () => getList({ id })
  });

  return { isListLoading: isPending, listData: data };
}

export function useProjectLists(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["projectLists"],
    queryFn: () => getProjectLists({ projectId })
  });

  return { isProjectListLoading: isPending, projectListsData: data };
}

export function useUpdateList(id: ListSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: UpdateListPayload) => updateList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", id] });
      queryClient.invalidateQueries({ queryKey: ["projectLists"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { isListUpdating: isPending, updateList: mutateAsync };
}

export function useCreateList() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: CreateListPayload) => createList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectLists"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { isCreatingList: isPending, createList: mutateAsync };
}

export function useDeleteList(id: ListSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: DeleteListPayload) => deleteList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", id] });
      queryClient.invalidateQueries({ queryKey: ["projectLists"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { isListDeleting: isPending, deleteList: mutateAsync };
}
