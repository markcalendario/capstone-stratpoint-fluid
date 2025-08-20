import { List } from "./lists";
import { Task } from "./tasks";
import { User } from "./users";

export interface KanbanTaskAssignment extends TaskAssignments {
  user: User;
}

export interface KanbanTask extends Task {
  taskAssignments: KanbanTaskAssignment[];
}

export interface KanbanList extends List {
  tasks: KanbanTask[];
}
