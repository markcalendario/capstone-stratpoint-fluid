import { getProjectLists } from "@/lib/actions/lists";
import { GetListsByProjectIdPayload } from "@/types/lists";
import { useQuery } from "@tanstack/react-query";

export function useProjectLists(payload: GetListsByProjectIdPayload) {
  const { isPending, data } = useQuery({
    queryKey: ["projectLists", payload.projectId],
    queryFn: () => getProjectLists(payload)
  });

  return { isProjectListLoading: isPending, projectListsData: data };
}
