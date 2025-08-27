import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import Comment from "@/components/ui/comment";
import CommentBox from "@/components/ui/comment-box";
import SectionEmpty from "@/components/ui/section-empty";
import SectionLoader from "@/components/ui/section-loader";
import { usePermissions } from "@/hooks/use-permissions";
import { useTaskDiscussions } from "@/hooks/use-task-discussions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { Feather } from "lucide-react";

interface TaskDescriptionProps {
  taskId: TaskSchema["id"];
  projectId: ProjectSchema["id"];
}

export default function TaskDiscussions({
  taskId,
  projectId
}: TaskDescriptionProps) {
  const { permissionsData } = usePermissions(projectId);

  const { isTaskDiscussionsLoading, taskDiscussionsData } =
    useTaskDiscussions(taskId);

  const permissions = permissionsData?.permissions;
  const canComment = permissions?.includes(PERMISSION.CREATE_COMMENT);

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
          text={canComment ? "Start a Discussion" : "No Discussion Found"}
        />
      )}

      {discussions.map((discussion) => (
        <Comment
          taskId={taskId}
          id={discussion.id}
          key={discussion.id}
          content={discussion.content}
          isEdited={discussion.isEdited}
          authorName={discussion.authorName}
          lastModified={discussion.lastModified}
          authorImage={discussion.authorImageUrl}
          isFromUser={discussion.isFromUser}
        />
      ))}

      {canComment && <CommentBox taskId={taskId} />}
    </DashboardContent>
  );
}
