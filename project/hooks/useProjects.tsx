import { queryClient } from "@/components/ui/query-client-provider";
import {
  createProject,
  getProject,
  getProjects,
  getRecentProjects,
  updateProject
} from "@/lib/actions/projects";
import {
  CreateProjectPayload,
  GetProjectPayload,
  ProjectSchema,
  UpdateProjectPayload
} from "@/types/projects";
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

export function useUserProject(payload: GetProjectPayload) {
  const { isPending, data } = useQuery({
    queryKey: ["userProject", payload.id],
    queryFn: () => getProject(payload)
  });

  return { isProjectLoading: isPending, projectData: data };
}

export function useUpdateProject(id: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: UpdateProjectPayload) => updateProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
      queryClient.invalidateQueries({ queryKey: ["userProject", id] });
    }
  });

  return {
    isProjectUpdating: isPending,
    updateProject: mutateAsync
  };
}
