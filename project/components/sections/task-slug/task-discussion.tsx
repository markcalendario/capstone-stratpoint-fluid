import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import Comment from "@/components/ui/comment";
import CommentBox from "@/components/ui/comment-box";
import SectionEmpty from "@/components/ui/section-empty";
import SectionLoader from "@/components/ui/section-loader";
import { usePermissions } from "@/hooks/use-permissions";
import { useTaskDiscussions } from "@/hooks/use-task-discussions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import pusherClient, { EVENTS } from "@/lib/utils/pusher-client";
import { ProjectSchema } from "@/types/projects";
import {
  DiscussionContent,
  DiscussionEventData
} from "@/types/taskDiscussions";
import { TaskSchema } from "@/types/tasks";
import { Feather } from "lucide-react";
import { useEffect, useState } from "react";

interface TaskDescriptionProps {
  taskId: TaskSchema["id"];
  projectId: ProjectSchema["id"];
}

export default function TaskDiscussions({
  taskId,
  projectId
}: TaskDescriptionProps) {
  const { permissionsData } = usePermissions(projectId);

  const [discussions, setDiscussion] = useState<DiscussionContent[] | null>(
    null
  );

  const { isTaskDiscussionsLoading, taskDiscussionsData } =
    useTaskDiscussions(taskId);

  const permissions = permissionsData?.permissions;
  const canComment = permissions?.includes(PERMISSION.CREATE_COMMENT);

  const isLoaded = !isTaskDiscussionsLoading && discussions;

  const handleDiscussionEvent = (data: DiscussionEventData[]) => {
    setDiscussion(data);
  };

  useEffect(() => {
    if (!taskDiscussionsData?.discussions) return;
    setDiscussion(taskDiscussionsData.discussions);
  }, [taskDiscussionsData?.discussions]);

  useEffect(() => {
    const channel = pusherClient.subscribe(taskId);
    channel.bind(EVENTS.DISCUSSION, handleDiscussionEvent);

    return () => {
      channel.unbind(EVENTS.DISCUSSION, handleDiscussionEvent);
      pusherClient.unsubscribe(taskId);
    };
  }, []);

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
          text={canComment ? "Start a Discussion" : "No Discussion Yet"}
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
