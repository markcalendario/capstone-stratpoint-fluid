"use server";

import {
  CreateTaskDiscussionPayload,
  DeleteTaskDiscussionPayload,
  GetTaskDiscussionsPayload,
  UpdateTaskDiscussionPayload
} from "@/types/taskDiscussions";
import { ZodError } from "zod";
import taskDiscussionsQueries from "../queries/taskDiscussions";
import { formatDateTime } from "../utils/date-and-time";
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
    const discussions = await taskDiscussionsQueries.getByTask(parsed.taskId);

    const formatted = discussions.map((discussion) => ({
      id: discussion.id,
      content: discussion.content,
      authorName: discussion.user.name,
      authorImageUrl: discussion.user.imageUrl,
      isUserDiscussion: userId === discussion.authorId,
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
    const parsed = updateTaskDiscussionPayloadSchema.parse(payload);
    await taskDiscussionsQueries.update(parsed.id, {
      taskId: parsed.taskId,
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
    const parsed = deleteTaskDiscussionPayloadSchema.parse(payload);
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
