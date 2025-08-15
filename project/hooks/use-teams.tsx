import { getProjectMembersOptions } from "@/lib/actions/teams";
import { ProjectSchema } from "@/types/projects";
import { useQuery } from "@tanstack/react-query";

export default function useProjectMembersOptions(
  projectId: ProjectSchema["id"]
) {
  const { isPending, data } = useQuery({
    queryKey: ["team"],
    queryFn: () => getProjectMembersOptions({ projectId })
  });

  return {
    isProjectMembersOptionsLoading: isPending,
    projectMembersOptions: data
  };
}
