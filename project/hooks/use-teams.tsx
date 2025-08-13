import { queryClient } from "@/components/ui/query-client-provider";
import {
  addTeamMembers,
  getProjectMembersOptions,
  getProjectNonMembersOptions
} from "@/lib/actions/teams";
import { ProjectSchema } from "@/types/projects";
import { AddTeamMembersPayload } from "@/types/teams";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useProjectMembersOptions(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["teams", projectId],
    queryFn: () => getProjectMembersOptions({ projectId })
  });

  return {
    isProjectMembersOptionsLoading: isPending,
    projectMembersOptions: data
  };
}

export function useNonProjectMembersOptions(
  projectId: ProjectSchema["id"],
  name: string
) {
  const { isPending, data, refetch } = useQuery({
    queryKey: ["teams", projectId],
    queryFn: () => getProjectNonMembersOptions({ projectId, name })
  });

  return {
    isNonProjectMembersOptionsLoading: isPending,
    nonProjectMembersOptions: data,
    refetchNonProjectMembersOptions: refetch
  };
}

export function useAddTeamMembers(projectId: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: AddTeamMembersPayload) => addTeamMembers(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", projectId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
    }
  });

  return { isAddingTeamMembers: isPending, addTeamMembers: mutateAsync };
}
