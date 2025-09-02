import { DiscussionEventData } from "@/types/taskDiscussions";
import { TaskSchema } from "@/types/tasks";
import { UserSchema } from "@/types/users";
import taskDiscussionsQueries from "../queries/taskDiscussions";
import { formatDateTime } from "./date-and-time";
import pusher from "./pusher";
import { EVENTS } from "./pusher-client";

export async function getDiscussionsByTask(
  taskId: TaskSchema["id"],
  userId: UserSchema["id"]
) {
  const discussions = await taskDiscussionsQueries.getByTask(taskId);
  const formatted = discussions.map((discussion) => ({
    id: discussion.id,
    content: discussion.content,
    authorName: discussion.user.name,
    authorImageUrl: discussion.user.imageUrl,
    isFromUser: userId === discussion.authorId,
    lastModified: formatDateTime(discussion.updatedAt),
    isEdited: discussion.createdAt !== discussion.updatedAt
  })) satisfies DiscussionEventData[];

  return formatted;
}

export async function broadcastDiscussionUpdate(
  taskId: TaskSchema["id"],
  userId: UserSchema["id"]
) {
  const discussions = await getDiscussionsByTask(taskId, userId);
  await pusher.trigger(taskId, EVENTS.DISCUSSION, discussions);
}
