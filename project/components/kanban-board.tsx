"use client";

import { TaskCard as TTaskCard } from "@/types/tasks";
import CreateListButton from "./create-list-button";
import ListCard from "./list-card";

// TODO: Task 5.1 - Design responsive Kanban board layout
// TODO: Task 5.2 - Implement drag-and-drop functionality with dnd-kit

/*
TODO: Implementation Notes for Interns:

This is the main Kanban board component that should:
- Display columns (lists) horizontally
- Allow drag and drop of tasks between columns
- Support adding new tasks and columns
- Handle real-time updates
- Be responsive on mobile

Key dependencies to install:
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities

Features to implement:
- Drag and drop tasks between columns
- Drag and drop to reorder tasks within columns
- Add new task button in each column
- Add new column functionality
- Optimistic updates (Task 5.4)
- Real-time persistence (Task 5.5)
- Mobile responsive design
- Loading states
- Error handling

State management:
- Use Zustand store for board state (Task 5.3)
- Implement optimistic updates
- Handle conflicts with server state
*/

const tasks: TTaskCard[] = [
  {
    id: "1",
    title: "Design homepage mockup",
    description: "Create initial design concepts",
    priority: "high",
    assigneeName: "Mark Kenenth",
    assigneeImageUrl: "/placeholder-user.jpg"
  },
  {
    id: "2",
    title: "Car dealership web",
    description: "Create car dealership project",
    priority: "low",
    assigneeName: "Mark Kenenth",
    assigneeImageUrl: "/placeholder-user.jpg"
  }
];

const initialColumns = [
  {
    id: "todo",
    title: "To Do",
    tasks
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks
  },
  {
    id: "review",
    title: "Review",
    tasks
  },
  {
    id: "done",
    title: "Done",
    tasks
  }
];

export function KanbanBoard({ projectId }: { projectId: string }) {
  void projectId;

  return (
    <div className="outline-primary/20 w-full rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
      <div className="flex min-w-full flex-nowrap space-x-6 overflow-x-auto pb-4">
        {initialColumns.map((list) => (
          <ListCard
            key={list.id}
            id={list.id}
            title={list.title}
            tasks={list.tasks}
          />
        ))}
        <CreateListButton projectId={projectId} />
      </div>
    </div>
  );
}
