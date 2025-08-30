"use server";

import { KanbanList } from "@/types/kanban";
import { ProjectSchema } from "@/types/projects";
import listQueries from "../queries/lists";
import { getDaysRemaining, isOverdue } from "./date-and-time";
import { stripHTML } from "./formatters";
import pusher from "./pusher";
import { EVENTS } from "./pusher-client";

export async function getKanbanItems(projectId: ProjectSchema["id"]) {
  const listsAndTasks = await listQueries.getListsWithTasks(projectId);

  const formatted = listsAndTasks.map((list) => {
    return {
      id: list.id,
      name: list.name,
      isFinal: list.isFinal,
      projectId: list.projectId,
      tasksCount: list.tasks.length,
      tasks: list.tasks.map((task) => {
        return {
          id: task.id,
          title: task.title,
          label: task.label,
          listId: task.listId,
          isDone: list.isFinal,
          priority: task.priority,
          projectId: list.projectId,
          isOverdue: isOverdue(task.dueDate),
          description: stripHTML(task.description),
          remainingDays: getDaysRemaining(task.dueDate),
          assigneesImages: task.taskAssignments.map(
            (assignment) => assignment.user.imageUrl
          )
        };
      })
    };
  }) satisfies KanbanList[];

  return formatted;
}

export async function broadcastKanbanUpdate(projectId: ProjectSchema["id"]) {
  const kanbanData = (await getKanbanItems(projectId)) satisfies KanbanList[];
  await pusher.trigger(projectId, EVENTS.KANBAN, kanbanData);
}
