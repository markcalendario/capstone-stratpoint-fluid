import { cn } from "@/lib/utils";
import Button from "./button";
import Input from "./input";

interface ProfileSettingsFormProps {
  className?: string;
}

export default function SecuritySettingsForm({
  className
}: ProfileSettingsFormProps) {
  return (
    <div
      className={cn(
        className,
        "outline-primary/20 space-y-3 rounded-sm p-7 outline-2"
      )}>
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
    </div>
  );
}
