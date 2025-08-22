import { queryClient } from "@/components/ui/query-client-provider";
import {
  createProject,
  deleteProject,
  getProjectEditData,
  getProjectOptions,
  getProjects,
  getProjectSlug,
  getRecentProjects,
  updateProject
} from "@/lib/actions/projects";
import { DeleteProjectPayload, ProjectSchema } from "@/types/projects";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useProjectSlug(id: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["projectInfo", id],
    queryFn: () => getProjectSlug({ id })
  });

  return { isProjectSlugDataLoading: isPending, projectSlugData: data };
}

export function useProjects() {
  const { isPending, data } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects
  });

  return { isProjectsListDataLoading: isPending, projectsListData: data };
}

export function useRecentProjects() {
  const { isPending, data } = useQuery({
    queryKey: ["recentProjects"],
    queryFn: getRecentProjects
  });

  return { isRecentProjectsLoading: isPending, recentProjectsData: data };
}

export function useProjectOptions(name: ProjectSchema["name"]) {
  const { isPending, data, refetch } = useQuery({
    queryFn: () => getProjectOptions({ name }),
    queryKey: ["projects", name]
  });

  return {
    isProjectOptionsLoading: isPending,
    projectOptions: data,
    refetchProjectOptions: refetch
  };
}

export function useProjectEditData(id: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectEditData({ id })
  });

  return { isProjectEditDataLoading: isPending, editProjectData: data };
}

export function useCreateProject() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { isCreatingProject: isPending, createProject: mutateAsync };
}

export function useUpdateProject(id: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projectInfo", id] });
      queryClient.invalidateQueries({ queryKey: ["projectData", id] });
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
      queryClient.invalidateQueries({ queryKey: ["projectInfo", id] });
      queryClient.invalidateQueries({ queryKey: ["projectData", id] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { isProjectDeleting: isPending, deleteProject: mutateAsync };
}
