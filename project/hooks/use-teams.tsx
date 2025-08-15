import { queryClient } from "@/components/ui/query-client-provider";
import {
  addTeamMembers,
  editMemberRole,
  getMemberRole,
  getProjectMembers,
  getProjectMembersOptions,
  getProjectNonMembersOptions,
  removeTeamMember
} from "@/lib/actions/teams";
import { ProjectSchema } from "@/types/projects";
import { AddTeamMembersPayload, EditMemberRolePayload } from "@/types/teams";
import { UserSchema } from "@/types/users";
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
    queryKey: ["teamsOptions", projectId],
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
      queryClient.invalidateQueries({ queryKey: ["teamsOptions", projectId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
    }
  });

  return { isAddingTeamMembers: isPending, addTeamMembers: mutateAsync };
}

export function useProjectMembers(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["teams", projectId],
    queryFn: () => getProjectMembers({ projectId }),
    enabled: projectId !== ""
  });

  return { isProjectMembersLoading: isPending, projectMembers: data };
}

export function useRemoveTeamMember(projectId: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: removeTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", projectId] });
    }
  });

  return { isRemovingTeamMember: isPending, removeTeamMember: mutateAsync };
}

export function useMemberRole(
  projectId: ProjectSchema["id"],
  userId: UserSchema["id"]
) {
  const { isPending, data } = useQuery({
    queryFn: () => getMemberRole({ projectId, userId }),
    queryKey: ["teamRole", projectId, userId]
  });

  return { isMemberRoleLoading: isPending, memberRoleData: data };
}

export function useEditMemberRole(
  projectId: ProjectSchema["id"],
  userId: UserSchema["id"]
) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: EditMemberRolePayload) => editMemberRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", projectId] });
      queryClient.invalidateQueries({ queryKey: ["role", projectId, userId] });
    }
  });

  return { isEditingMemberRole: isPending, editMemberRole: mutateAsync };
}
