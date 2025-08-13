import { queryClient } from "@/components/ui/query-client-provider";
import {
  createProject,
  deleteProject,
  getProject,
  getProjectOptions,
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

export function useProjects() {
  const { isPending, data } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects
  });

  return { isProjectsLoading: isPending, projectsData: data };
}

export function useCreateProject() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { isCreatingProject: isPending, createProject: mutateAsync };
}

export function useRecentProjects() {
  const { isPending, data } = useQuery({
    queryKey: ["recentProjects"],
    queryFn: getRecentProjects
  });

  return { isRecentProjectsLoading: isPending, recentProjectsData: data };
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
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
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
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { isProjectDeleting: isPending, deleteProject: mutateAsync };
}

export function useProjectOptions(
  name: ProjectSchema["name"],
  id?: ProjectSchema["id"]
) {
  const { isPending, data, refetch } = useQuery({
    queryFn: () => getProjectOptions({ id, name }),
    queryKey: ["projects"]
  });

  return {
    isProjectOptionsLoading: isPending,
    projectOptions: data,
    refetchProjectOptions: refetch
  };
}
