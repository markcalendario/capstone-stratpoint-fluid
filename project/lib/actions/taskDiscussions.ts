"use server";

import {
  CreateTaskDiscussionPayload,
  DeleteTaskDiscussionPayload,
  GetTaskDiscussionsPayload,
  UpdateTaskDiscussionPayload
} from "@/types/taskDiscussions";
import { ZodError } from "zod";
import taskDiscussionsQueries from "../queries/taskDiscussions";
import taskQueries from "../queries/tasks";
import { formatDateTime } from "../utils/date-and-time";
import { hasPermission } from "../utils/rolePermissions";
import { getUserId } from "../utils/users";
import {
  createTaskDiscussionPayloadSchema,
  deleteTaskDiscussionPayloadSchema,
  getTaskDiscussionsPayloadSchema,
  updateTaskDiscussionPayloadSchema
} from "../validations/taskDiscussions";

export async function getTaskDiscussions(payload: GetTaskDiscussionsPayload) {
  try {
    const userId = await getUserId();
    const parsed = getTaskDiscussionsPayloadSchema.parse(payload);

    const task = await taskQueries.getTask(parsed.taskId);
    if (!task) return { success: false, message: "Task not found." };

    if (!(await hasPermission(userId, task.list.projectId, "view_comment"))) {
      return {
        success: false,
        message: "Unauthorized. Cannot retrieve discussions."
      };
    }

    const discussions = await taskDiscussionsQueries.getByTask(parsed.taskId);

    const formatted = discussions.map((discussion) => ({
      id: discussion.id,
      content: discussion.content,
      authorName: discussion.user.name,
      authorImageUrl: discussion.user.imageUrl,
      isFromUser: userId === discussion.authorId,
      lastModified: formatDateTime(discussion.updatedAt),
      isEdited: discussion.createdAt !== discussion.updatedAt
    }));

    return {
      success: true,
      message: "Task discussions retrieved successfully.",
      discussions: formatted
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot retrieve task discussions."
    };
  }
}

export async function createTaskDiscussion(
  payload: CreateTaskDiscussionPayload
) {
  try {
    const userId = await getUserId();
    const parsed = createTaskDiscussionPayloadSchema.parse(payload);

    const task = await taskQueries.getTask(parsed.taskId);
    if (!task) return { success: false, message: "Task not found." };

    if (!(await hasPermission(userId, task.list.projectId, "create_comment"))) {
      return { success: false, message: "Unauthorized. Cannot post comment." };
    }

    await taskDiscussionsQueries.create({
      authorId: userId,
      taskId: parsed.taskId,
      content: parsed.content
    });

    return { success: true, message: "Task discussion posted successfully" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot post task discussion."
    };
  }
}

export async function updateTaskDiscussion(
  payload: UpdateTaskDiscussionPayload
) {
  try {
    const userId = await getUserId();
    const parsed = updateTaskDiscussionPayloadSchema.parse(payload);
    const comment = await taskDiscussionsQueries.get(parsed.id);

    if (!comment) return { success: false, message: "Task not found." };
    const projectId = comment.task.list.projectId;

    const isUserOwner = userId === comment.user.id;
    const isPermitted = await hasPermission(
      userId,
      projectId,
      "create_comment"
    );

    if (!isUserOwner || !isPermitted) {
      return {
        success: false,
        message: "Unauthorized. Cannot delete comment."
      };
    }

    await taskDiscussionsQueries.update(parsed.id, {
      content: parsed.content,
      updatedAt: new Date().toISOString()
    });

    return { success: true, message: "Task discussion updated successfully" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot update task discussion."
    };
  }
}

export async function deleteTaskDiscussion(
  payload: DeleteTaskDiscussionPayload
) {
  try {
    const userId = await getUserId();
    const parsed = deleteTaskDiscussionPayloadSchema.parse(payload);
    const comment = await taskDiscussionsQueries.get(parsed.id);

    if (!comment) return { success: false, message: "Task not found." };
    const projectId = comment.task.list.projectId;

    const isUserOwner = userId === comment.user.id;
    const isPermitted = await hasPermission(
      userId,
      projectId,
      "create_comment"
    );

    if (!isUserOwner || !isPermitted) {
      return {
        success: false,
        message: "Unauthorized. Cannot delete comment."
      };
    }

    await taskDiscussionsQueries.delete(parsed.id);

    return { success: true, message: "Task discussion deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    return {
      success: false,
      message: "Error. Cannot delete task discussion."
    };
  }
}
