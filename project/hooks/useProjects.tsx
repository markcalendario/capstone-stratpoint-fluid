import { queryClient } from "@/components/ui/query-client-provider";
import {
  createProject,
  getProjects,
  getRecentProjects
} from "@/lib/actions/projects";
import { CreateProjectPayload } from "@/types/projects";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useUserProjects() {
  return useQuery({
    queryKey: ["userProjects"],
    queryFn: getProjects
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
    }
  });
}

export function useRecentProjects() {
  return useQuery({
    queryKey: ["recentProjects"],
    queryFn: getRecentProjects
  });
}
