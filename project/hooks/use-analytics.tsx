import {
  getDashboardStatus,
  getProjectProgress,
  getStatusByPriority
} from "@/lib/actions/analytics";
import { ProjectSchema } from "@/types/projects";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStatus() {
  const { isPending, data } = useQuery({
    queryKey: ["analytics", "dashboardStatus"],
    queryFn: getDashboardStatus
  });

  return { isDashboardStatusLoading: isPending, dashboardStatusData: data };
}

export function useProjectProgress(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["analytics", "projectProgress", projectId],
    queryFn: () => getProjectProgress({ projectId })
  });

  return { isProjectProgressLoading: isPending, projectProgressData: data };
}

export function useStatusByPriority(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["analytics", "statusByPriority", projectId],
    queryFn: () => getStatusByPriority({ projectId })
  });

  return { isStatusByPriorityLoading: isPending, statusByPriorityData: data };
}
