import { queryClient } from "@/components/ui/query-client-provider";
import {
  changePassword,
  editProfile,
  getProfileEditData
} from "@/lib/actions/users";
import { UserSchema } from "@/types/users";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useProfileEditData(userId: UserSchema["id"]) {
  const { isPending, data } = useQuery({
    queryFn: getProfileEditData,
    queryKey: ["profileSettings", userId]
  });

  return { isProfileEditDataLoading: isPending, profileEditData: data };
}

export function useEditProfile(userId: UserSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileSettings", userId] });
    }
  });

  return { isEditingProfile: isPending, editProfile: mutateAsync };
}

export function useChangePassword() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: changePassword
  });

  return { isChangingPassword: isPending, changePassword: mutateAsync };
}
