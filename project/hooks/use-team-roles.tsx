import { getRoleOptions } from "@/lib/actions/roles";
import { useQuery } from "@tanstack/react-query";

export default function useRoles() {
  const { isPending, data } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoleOptions
  });

  return { isRolesLoading: isPending, rolesData: data };
}
