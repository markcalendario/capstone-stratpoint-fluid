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
import {
  broadcastDiscussionUpdate,
  getDiscussionsByTask
} from "../utils/discussions";
import { dispatchError, handleDispatchError } from "../utils/dispatch-error";
import { PERMISSION } from "../utils/permission-enum";
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
    if (!task) return dispatchError(404);

    const isPermitted = await hasPermission(
      userId,
      task.list.projectId,
      PERMISSION.VIEW_COMMENT
    );

    if (!isPermitted) dispatchError(401);

    const discussions = await getDiscussionsByTask(parsed.taskId, userId);

    return {
      success: true,
      message: "Task discussions retrieved successfully.",
      discussions
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}

export async function createTaskDiscussion(
  payload: CreateTaskDiscussionPayload
) {
  try {
    const userId = await getUserId();
    const parsed = createTaskDiscussionPayloadSchema.parse(payload);

    const task = await taskQueries.getTask(parsed.taskId);
    if (!task) return dispatchError(404);

    const isPermitted = await hasPermission(
      userId,
      task.list.projectId,
      PERMISSION.CREATE_COMMENT
    );

    if (!isPermitted) return dispatchError(401);

    await taskDiscussionsQueries.create({
      authorId: userId,
      taskId: parsed.taskId,
      content: parsed.content
    });

    await broadcastDiscussionUpdate(parsed.taskId, userId);

    return { success: true, message: "Task discussion posted successfully" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
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
      PERMISSION.EDIT_COMMENT
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

    await broadcastDiscussionUpdate(comment.taskId, userId);

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
      PERMISSION.DELETE_COMMENT
    );

    if (!isUserOwner || !isPermitted) return dispatchError(401);

    await taskDiscussionsQueries.delete(parsed.id);
    await broadcastDiscussionUpdate(comment.taskId, userId);
    return { success: true, message: "Task discussion deleted successfully." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message };
    }

    handleDispatchError(error);
  }
}
