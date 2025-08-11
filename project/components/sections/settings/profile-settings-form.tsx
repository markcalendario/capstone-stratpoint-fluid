import Button from "@/components/ui/buttons/button";
import Input from "@/components/ui/input-fields/input";
import Select from "@/components/ui/input-fields/select/select";
import { cn } from "@/lib/utils";

interface ProfileSettingsFormProps {
  className?: string;
}

export default function ProfileSettingsForm({
  className
}: ProfileSettingsFormProps) {
  return (
    <div
      className={cn(
        className,
        "outline-primary/20 space-y-3 rounded-sm p-7 outline-2"
      )}>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Profile Settings
      </h3>
      <Input
        id="full-name"
        label="Full Name"
        placeholder="Enter your full name"
      />
      <Input
        id="email-address"
        label="Email Address"
        placeholder="Enter your full name"
      />
      <Select
        id="role"
        label="Select Role">
        <option>Project Manager</option>
        <option>Developer</option>
        <option>Designer</option>
        <option>QA Engineer</option>
      </Select>

      <Button className="bg-primary text-neutral-100">Save</Button>
    </div>
  );
}
