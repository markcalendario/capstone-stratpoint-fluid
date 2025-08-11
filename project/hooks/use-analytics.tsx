import { getDashboardStatus } from "@/lib/actions/analytics";
import { useQuery } from "@tanstack/react-query";

export default function useDashboardStatus() {
  const { isPending, data } = useQuery({
    queryKey: ["analytics"],
    queryFn: getDashboardStatus
  });

  return { isDashboardStatusLoading: isPending, dashboardStatusData: data };
}
