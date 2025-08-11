"use server";

import ListCard from "@/components/list-card";
import { getListsByProjectId } from "@/lib/actions/lists";
import { ProjectSchema } from "@/types/projects";
import CreateListButton from "./create-list-button";

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

interface KanbanBoardProps {
  projectId: ProjectSchema["id"];
}

export default async function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { lists } = await getListsByProjectId({ projectId });

  if (!lists) return;

  return (
    <div className="outline-primary/20 w-full rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
      <div className="flex min-w-full flex-nowrap items-stretch space-x-6 overflow-x-auto pb-4">
        {lists.map((list) => (
          <ListCard
            key={list.id}
            id={list.id}
            projectId={projectId}
            name={list.name}
          />
        ))}

        <CreateListButton
          projectId={projectId}
          className="border-primary/20 text-primary hover:bg-primary/10 flex min-h-[500px] min-w-100 cursor-pointer flex-nowrap items-center justify-center gap-2 rounded-sm border-2 border-dashed bg-neutral-50 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
        />
      </div>
    </div>
  );
}
