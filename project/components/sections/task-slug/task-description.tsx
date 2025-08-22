import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import { TaskSchema } from "@/types/tasks";

interface TaskDescriptionProps {
  description: TaskSchema["description"];
}

export default function TaskDescription({ description }: TaskDescriptionProps) {
  return (
    <DashboardContent
      tight
      title="Description">
      <article
        className="prose max-sm:prose-sm prose-neutral dark:prose-invert prose-headings:text-neutral-700 dark:prose-headings:text-neutral-300 prose-h1:text-2xl prose-h2:text-xl prose-h1:font-bold prose-h3:text-lg prose-h4:text-md prose-h5:text-sm prose-h6:text-xs prose-headings:tracking-tight mx-auto max-w-full [&>*]:my-[15px] [&>*]:text-justify"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </DashboardContent>
  );
}
