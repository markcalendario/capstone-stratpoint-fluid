"use client";

import { MoreHorizontal } from "lucide-react";

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

const initialColumns = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Design homepage mockup",
        description: "Create initial design concepts",
        priority: "high",
        assignee: "John Doe"
      },
      {
        id: "2",
        title: "Research competitors",
        description: "Analyze competitor websites",
        priority: "medium",
        assignee: "Jane Smith"
      },
      {
        id: "3",
        title: "Define user personas",
        description: "Create detailed user personas",
        priority: "low",
        assignee: "Mike Johnson"
      }
    ]
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "4",
        title: "Develop navigation component",
        description: "Build responsive navigation",
        priority: "high",
        assignee: "Sarah Wilson"
      },
      {
        id: "5",
        title: "Content strategy",
        description: "Plan content structure",
        priority: "medium",
        assignee: "Tom Brown"
      }
    ]
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: "6",
        title: "Logo design options",
        description: "Present logo variations",
        priority: "high",
        assignee: "Lisa Davis"
      }
    ]
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "7",
        title: "Project kickoff meeting",
        description: "Initial team meeting completed",
        priority: "medium",
        assignee: "John Doe"
      },
      {
        id: "8",
        title: "Requirements gathering",
        description: "Collected all requirements",
        priority: "high",
        assignee: "Jane Smith"
      }
    ]
  }
];

export function KanbanBoard({ projectId }: { projectId: string }) {
  return (
    <div className="outline-primary/20 w-full rounded-lg bg-white p-6 outline-2 dark:bg-neutral-800">
      <div className="flex min-w-full flex-nowrap space-x-6 overflow-x-auto pb-4">
        {["To Do", "In Progress", "Review", "Done"].map((title) => (
          <div
            key={title}
            className="outline-primary/20 min-w-80 rounded-lg bg-white outline-3 dark:bg-neutral-700">
            <div className="border-b border-neutral-200 p-4 dark:border-neutral-600">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">
                  {title}
                  <span className="ml-2 rounded-full bg-neutral-200 px-2 py-1 text-xs dark:bg-neutral-600">
                    5
                  </span>
                </h3>
                <button className="rounded p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="min-h-[400px] space-y-3 p-4">
              {[1, 2, 3].map((taskIndex) => (
                <div
                  key={taskIndex}
                  className="outline-primary/20 cursor-pointer rounded-lg bg-white p-4 shadow-sm outline-2 hover:shadow-md dark:bg-neutral-600">
                  <h4 className="mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
                    Sample Task {taskIndex}
                  </h4>
                  <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-300">
                    This is a placeholder task description
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Medium
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                      U
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full rounded-lg border-2 border-dashed border-neutral-300 p-3 text-neutral-500 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-neutral-600 dark:text-neutral-400">
                + Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
