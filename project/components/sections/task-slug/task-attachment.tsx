import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import LinkButton from "@/components/ui/buttons/link-button";
import SectionEmpty from "@/components/ui/section-empty";
import { TaskSchema } from "@/types/tasks";
import { Download, File } from "lucide-react";

interface TaskSlugBannerProps {
  attachment: TaskSchema["attachment"];
}

export default function TaskAttachment({ attachment }: TaskSlugBannerProps) {
  return (
    <DashboardContent
      tight
      title="Attachment">
      {!attachment && (
        <SectionEmpty
          icon={File}
          text="No task attachment"
        />
      )}

      {attachment && (
        <LinkButton
          href={attachment}
          download={true}
          className="bg-primary text-neutral-100">
          <Download size={14} />
          Download Attachment
        </LinkButton>
      )}
    </DashboardContent>
  );
}
