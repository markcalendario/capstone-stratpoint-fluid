import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import LinkButton from "@/components/ui/buttons/link-button";
import { TaskSchema } from "@/types/tasks";
import { Download } from "lucide-react";

interface TaskSlugBannerProps {
  attachment: TaskSchema["attachment"];
}

export default function TaskAttachment({ attachment }: TaskSlugBannerProps) {
  if (!attachment) return;

  return (
    <DashboardContent
      tight
      title="Attachment">
      <LinkButton
        href={attachment}
        download={true}
        className="bg-primary text-neutral-100">
        <Download size={14} />
        Download Attachment
      </LinkButton>
    </DashboardContent>
  );
}
