import { TaskSchema } from "@/types/tasks";
import { UserSchema } from "@/types/users";
import projectQueries from "../queries/projects";
import taskAssignmentsQueries from "../queries/taskAssignments";

export async function unassignUserToProjectTasks(
  userId: UserSchema["id"],
  projectId: TaskSchema["id"]
) {
  const project = await projectQueries.get(projectId);

  if (!project) return false;

  const taskIds = project.lists
    .flatMap((list) => list.tasks)
    .map((task) => task.id);

  for (const taskId of taskIds) {
    taskAssignmentsQueries.unassignUserToTasks(userId, taskId);
  }

  return true;
}
