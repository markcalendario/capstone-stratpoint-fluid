import { queryClient } from "@/components/ui/query-client-provider";
import {
  addProjectMembers,
  editProjectMemberRole,
  getNonProjectMembersOptions,
  getProjectMemberRole,
  getProjectMembers,
  getProjectMembersOptions,
  removeProjectMember
} from "@/lib/actions/projectMembers";
import {
  AddProjectMembersPayload,
  EditProjectMemberRolePayload
} from "@/types/projectMembers";
import { ProjectSchema } from "@/types/projects";
import { UserSchema } from "@/types/users";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useProjectMembersOptions(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["projectMembers", projectId],
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
    queryKey: ["projectMembersOptions", projectId],
    queryFn: () => getNonProjectMembersOptions({ projectId, name })
  });

  return {
    isNonProjectMembersOptionsLoading: isPending,
    nonProjectMembersOptions: data,
    refetchNonProjectMembersOptions: refetch
  };
}

export function useAddProjectMembers(projectId: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: AddProjectMembersPayload) =>
      addProjectMembers(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId]
      });
      queryClient.invalidateQueries({
        queryKey: ["projectMembersOptions", projectId]
      });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["recentProjects"] });
    }
  });

  return { isAddingTeamMembers: isPending, addTeamMembers: mutateAsync };
}

export function useProjectMembers(projectId: ProjectSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers({ projectId }),
    enabled: projectId !== ""
  });

  return { isProjectMembersLoading: isPending, projectMembers: data };
}

export function useRemoveProjectMember(projectId: ProjectSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: removeProjectMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId]
      });
    }
  });

  return { isRemovingTeamMember: isPending, removeProjectMember: mutateAsync };
}

export function useProjectMemberRole(
  projectId: ProjectSchema["id"],
  userId: UserSchema["id"]
) {
  const { isPending, data } = useQuery({
    queryFn: () => getProjectMemberRole({ projectId, userId }),
    queryKey: ["teamRole", projectId, userId]
  });

  return { isMemberRoleLoading: isPending, projectMemberRoleData: data };
}

export function useEditProjectMemberRole(
  projectId: ProjectSchema["id"],
  userId: UserSchema["id"]
) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: EditProjectMemberRolePayload) =>
      editProjectMemberRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId]
      });
      queryClient.invalidateQueries({ queryKey: ["role", projectId, userId] });
    }
  });

  return { isEditingMemberRole: isPending, editProjectMemberRole: mutateAsync };
}
