import Button from "@/components/ui/buttons/button";
import Input from "@/components/ui/input-fields/input";
import { Fragment } from "react";

export default function SecuritySettingsForm() {
  return (
    <Fragment>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Security Settings
      </h3>
      <Input
        id="full-name"
        type="password"
        label="Full Name"
        placeholder="Enter desired password"
      />
      <Input
        id="confirm-password"
        type="password"
        label="Confirm Password"
        placeholder="Re-type your password"
      />
      <Button className="bg-primary text-neutral-100">Save</Button>
    </Fragment>
  );
}
