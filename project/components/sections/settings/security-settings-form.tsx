import Alert from "@/components/ui/alert";
import Button from "@/components/ui/buttons/button";
import Input from "@/components/ui/input-fields/input";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useChangePassword } from "@/hooks/use-user";
import { useClerk, useUser } from "@clerk/nextjs";
import { ChangeEvent, Fragment, useState } from "react";

export default function SecuritySettingsForm() {
  const { isChangingPassword, changePassword } = useChangePassword();
  const { user } = useUser();
  const clerk = useClerk();

  const initialFormData = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (newPassword !== confirmNewPassword) {
      return showErrorToast("New passwords do not match.");
    }

    const { success, message } = await changePassword({
      currentPassword,
      newPassword
    });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);
    setFormData(initialFormData); // Reset form fields

    clerk.user?.reload();
  };

  return (
    <Fragment>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Security Settings
      </h3>
      {user?.passwordEnabled && (
        <Input
          id="current-password"
          type="password"
          name="currentPassword"
          label="Current Password"
          placeholder="Enter your current password"
          value={formData.currentPassword}
          onChange={handleInputChange}
          required
        />
      )}

      {!user?.passwordEnabled && (
        <Alert
          title="Notice"
          description="You haven’t set a password yet because you signed in using Google. Set a password now so you can log in with password."
          type="warning"
        />
      )}

      <Input
        id="new-password"
        type="password"
        name="newPassword"
        label="New Password"
        placeholder="Your desired new password"
        value={formData.newPassword}
        onChange={handleInputChange}
        required
      />
      <Input
        id="confirm-new-password"
        type="password"
        name="confirmNewPassword"
        label="Confirm New Password"
        placeholder="Re-type your password"
        value={formData.confirmNewPassword}
        onChange={handleInputChange}
        required
      />
      <Button
        isProcessing={isChangingPassword}
        onClick={handleChangePassword}
        className="bg-primary text-neutral-100">
        Save
      </Button>
    </Fragment>
  );
}
