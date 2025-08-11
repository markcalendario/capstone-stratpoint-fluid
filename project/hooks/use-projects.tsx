import { queryClient } from "@/components/ui/query-client-provider";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  getRecentProjects,
  updateProject
} from "@/lib/actions/projects";
import {
  CreateProjectPayload,
  DeleteProjectPayload,
  ProjectSchema,
  UpdateProjectPayload
} from "@/types/projects";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useUserProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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

export function useUserProject(id: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject({ id })
  });

  return { isProjectLoading: isPending, projectData: data };
}

export function useUpdateProject(id: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: UpdateProjectPayload) => updateProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
    }
  });

  return {
    isProjectUpdating: isPending,
    updateProject: mutateAsync
  };
}

export function useDeleteProject(id: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: DeleteProjectPayload) => deleteProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
    }
  });

  return { isProjectDeleting: isPending, deleteProject: mutateAsync };
}
