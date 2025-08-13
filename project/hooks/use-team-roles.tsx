import { getTeamRolesOptions } from "@/lib/actions/teamRoles";
import { useQuery } from "@tanstack/react-query";

export default function useTeamRoles() {
  const { isPending, data } = useQuery({
    queryKey: ["roles"],
    queryFn: getTeamRolesOptions
  });

  return { isTeamRolesLoading: isPending, teamRoles: data };
}
