import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import Comment from "@/components/ui/comment";
import CommentBox from "@/components/ui/comment-box";
import SectionEmpty from "@/components/ui/section-empty";
import SectionLoader from "@/components/ui/section-loader";
import { useTaskDiscussions } from "@/hooks/use-task-discussions";
import { TaskSchema } from "@/types/tasks";
import { Feather } from "lucide-react";

interface TaskDescriptionProps {
  taskId: TaskSchema["id"];
}

export default function TaskDiscussions({ taskId }: TaskDescriptionProps) {
  const { isTaskDiscussionsLoading, taskDiscussionsData } =
    useTaskDiscussions(taskId);

  const discussions = taskDiscussionsData?.discussions;
  const isLoaded = !isTaskDiscussionsLoading && discussions;

  if (!isLoaded) {
    return <SectionLoader text="Loading Discussion" />;
  }

  return (
    <DashboardContent
      tight
      title={`Discussion (${discussions.length})`}
      wrapperClassName="space-y-5">
      {!discussions.length && (
        <SectionEmpty
          icon={Feather}
          text="Start a Discussion"
        />
      )}

      {discussions.map((discussion) => (
        <Comment
          key={discussion.id}
          content={discussion.content}
          isEdited={discussion.isEdited}
          authorName={discussion.authorName}
          lastModified={discussion.lastModified}
          authorImage={discussion.authorImageUrl}
          isUserDiscussion={discussion.isUserDiscussion}
        />
      ))}

      <CommentBox taskId={taskId} />
    </DashboardContent>
  );
}
