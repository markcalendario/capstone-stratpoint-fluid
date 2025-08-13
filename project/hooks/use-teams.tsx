import {
  getProjectMembersOptions,
  getProjectNonMembersOptions
} from "@/lib/actions/teams";
import { ProjectSchema } from "@/types/projects";
import { useQuery } from "@tanstack/react-query";

export function useProjectMembersOptions(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["team", projectId],
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
    queryKey: ["team", projectId],
    queryFn: () => getProjectNonMembersOptions({ projectId, name })
  });

  return {
    isNonProjectMembersOptionsLoading: isPending,
    nonProjectMembersOptions: data,
    refetchNonProjectMembersOptions: refetch
  };
}
