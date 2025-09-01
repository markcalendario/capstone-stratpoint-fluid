import Button from "@/components/ui/buttons/button";
import Select from "@/components/ui/input-fields/select/select";
import { showSuccessToast } from "@/components/ui/toast";
import { useNotificationPreference } from "@/hooks/use-notification-preference";
import { Fragment, useEffect, useState } from "react";

export default function NotificationsSettingsForm() {
  const { preference, setPreference } = useNotificationPreference();
  const [localInvitation, setLocalInvitation] = useState<"On" | "Off">("Off");

  // Sync localInvitation with hook state when it loads
  useEffect(() => {
    setLocalInvitation(preference.invitation ? "On" : "Off");
  }, [preference.invitation]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalInvitation(e.target.value as "On" | "Off");
  };

  const handleSave = () => {
    setPreference({ invitation: localInvitation === "On" });
    showSuccessToast("Notification preference save successfully.");
  };

  return (
    <Fragment>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Notification Settings
      </h3>

      <Select
        id="kanban"
        label="Project Invitation"
        required
        value={localInvitation}
        onChange={handleSelectChange}>
        <option value="On">On</option>
        <option value="Off">Off</option>
      </Select>

      <Button
        className="bg-primary text-neutral-100"
        onClick={handleSave}>
        Save
      </Button>
    </Fragment>
  );
}
