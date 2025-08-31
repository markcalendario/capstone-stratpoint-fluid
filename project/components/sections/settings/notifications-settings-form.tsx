import Button from "@/components/ui/buttons/button";
import Select from "@/components/ui/input-fields/select/select";
import { Fragment } from "react";

export default function NotificationsSettingsForm() {
  return (
    <Fragment>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Notification Settings
      </h3>

      <Select
        id="kanban"
        label="Project Invitation"
        required>
        <option>On</option>
        <option>Off</option>
      </Select>

      <Button className="bg-primary text-neutral-100">Save</Button>
    </Fragment>
  );
}
