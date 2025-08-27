import getPermissions from "@/lib/actions/rolePermissions";
import { ProjectSchema } from "@/types/projects";
import { useQuery } from "@tanstack/react-query";

export function usePermissions(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryFn: () => getPermissions({ projectId }),
    queryKey: ["permissions", projectId]
  });

  return { isPermissionsLoading: isPending, permissionsData: data };
}
