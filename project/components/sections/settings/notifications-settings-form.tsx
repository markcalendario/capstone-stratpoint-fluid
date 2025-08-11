import { cn } from "@/lib/utils";
import Button from "./button";
import Select from "./select";

interface ProfileSettingsFormProps {
  className?: string;
}

export default function NotificationsSettingsForm({
  className
}: ProfileSettingsFormProps) {
  return (
    <div
      className={cn(
        className,
        "outline-primary/20 space-y-3 rounded-sm p-7 outline-2"
      )}>
      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
        Notification Settings
      </h3>

      <Select
        id="project-deadline"
        label="Project Deadline">
        <option>On</option>
        <option>Off</option>
      </Select>

      <Select
        id="calendar-event"
        label="Calendar Events">
        <option>On</option>
        <option>Off</option>
      </Select>

      <Select
        id="kanban"
        label="Kanban Changes">
        <option>On</option>
        <option>Off</option>
      </Select>

      <Button className="bg-primary text-neutral-100">Save</Button>
    </div>
  );
}
