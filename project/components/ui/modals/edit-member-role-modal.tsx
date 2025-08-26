import {
  useEditProjectMemberRole,
  useProjectMemberRole
} from "@/hooks/use-project-members";
import useRoles from "@/hooks/use-team-roles";
import { ProjectSchema } from "@/types/projects";
import { RolesSchema } from "@/types/roles";
import { UserSchema } from "@/types/users";
import Button from "../buttons/button";
import UserRolePicker from "../input-fields/user-role-picker";
import SectionLoader from "../section-loader";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface EditMemberRoleModalProps {
  userId: UserSchema["id"];
  projectId: ProjectSchema["id"];
  toggle: () => void;
}

export default function EditMemberRoleModal({
  toggle,
  userId,
  projectId
}: EditMemberRoleModalProps) {
  const { rolesData } = useRoles();

  const { isEditingMemberRole, editProjectMemberRole: editMemberRole } =
    useEditProjectMemberRole(projectId, userId);

  const { isMemberRoleLoading, projectMemberRoleData: memberRoleData } =
    useProjectMemberRole(projectId, userId);

  const handleEditRole = async (
    userId: UserSchema["id"],
    role: RolesSchema["id"]
  ) => {
    const { success, message } = await editMemberRole({
      userId,
      projectId,
      roleId: role
    });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);
    toggle();
  };

  const isLoaded = !isMemberRoleLoading && memberRoleData?.member && rolesData;

  return (
    <Modal
      toggle={toggle}
      title="Edit Role">
      {!isLoaded && <SectionLoader text="Loading Role" />}

      {isLoaded && (
        <div className="grid gap-5">
          <UserRolePicker
            id={memberRoleData.member.userId}
            name={memberRoleData.member.name}
            role={memberRoleData.member.role}
            rolesOptions={rolesData?.roles}
            imageUrl={memberRoleData.member.imageUrl}
            onRoleChange={handleEditRole}
          />

          <div className="flex justify-end gap-3">
            <Button
              onClick={toggle}
              isProcessing={isEditingMemberRole}
              className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
