import {
  getDashboardStatus,
  getProjectProgress
} from "@/lib/actions/analytics";
import { ProjectSchema } from "@/types/projects";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStatus() {
  const { isPending, data } = useQuery({
    queryKey: ["analytics"],
    queryFn: getDashboardStatus
  });

  return { isDashboardStatusLoading: isPending, dashboardStatusData: data };
}

export function useProjectProgress(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["analytics", projectId],
    queryFn: () => getProjectProgress({ projectId })
  });

  return { isProjectProgressLoading: isPending, projectProgressData: data };
}
