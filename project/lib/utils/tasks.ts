import { TaskAssignmentsSchema } from "@/types/taskAssignments";
import { Task, TaskCard } from "@/types/tasks";
import { getUserProfileById } from "./users";

interface ToTaskCard extends Task {
  taskAssignments: TaskAssignmentsSchema[];
}

export async function toTaskCard(data: ToTaskCard) {
  // Flatten all users from all assignments
  const allUsers = data.taskAssignments.flatMap(
    (assignment) => assignment.user
  );

  // Fetch all profiles
  const assigneesImages = await Promise.all(
    allUsers.map(async (user) => {
      return await getUserProfileById(user.clerkId);
    })
  );

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    assigneesImages
  } satisfies TaskCard;
}
