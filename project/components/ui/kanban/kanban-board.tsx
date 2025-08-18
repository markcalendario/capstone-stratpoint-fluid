"use client";

import { useProjectLists } from "@/hooks/use-lists";
import { List } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { TaskCard as ITaskCard } from "@/types/tasks";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent
} from "@dnd-kit/core";
import { useState } from "react";
import CreateListButton from "../buttons/create-list-button";
import SectionLoader from "../section-loader";
import ListCard from "./list-card";
import { TaskCard } from "./task-card";

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

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { isProjectListLoading, projectListsData } = useProjectLists(projectId);

  const lists = projectListsData?.lists;
  const isLoaded = !isProjectListLoading && lists;

  return (
    <div className="outline-primary/20 w-full rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
      {!isLoaded && <SectionLoader text="Fetching Kanban Columns" />}

      {isLoaded && (
        <div className="flex min-w-full flex-nowrap items-stretch space-x-6 overflow-x-auto pb-4">
          <DraggableKanbanItems lists={lists} />

          <CreateListButton
            projectId={projectId}
            className="border-primary/20 text-primary hover:bg-primary/10 flex min-h-[500px] min-w-100 cursor-pointer flex-nowrap items-center justify-center gap-2 rounded-sm border-2 border-dashed bg-neutral-50 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
          />
        </div>
      )}
    </div>
  );
}

interface DraggableKanbanItems {
  lists: List[];
}

interface DraggableList extends List {
  type: "LIST";
}

interface DraggableTask extends ITaskCard {
  type: "TASK";
}

type DraggableItem = DraggableList | DraggableTask;

function DraggableKanbanItems({ lists }: DraggableKanbanItems) {
  const [activeList, setActiveList] = useState<DraggableList | null>(null);
  const [activeTask, setActiveTask] = useState<DraggableTask | null>(null);

  const handleDragStart = (evt: DragStartEvent) => {
    const dragItem = evt.active.data.current as DraggableItem;
    const dragItemType = dragItem.type;

    if (dragItemType === "TASK") {
      setActiveTask(dragItem);
      logAction("Drag", dragItemType, dragItem.title);
    } else if (dragItemType === "LIST") {
      setActiveList(dragItem);
      logAction("Drag", dragItemType, dragItem.name);
    }
  };

  const handleDragOver = (evt: DragOverEvent) => {
    const dragItem = evt.active.data.current as DraggableItem;
    const overItem = evt.over?.data?.current as DraggableItem;
    const dragItemType = dragItem.type;
    const overItemType = overItem.type;

    if (!overItem) return;

    if (dragItemType === "TASK" && overItemType === "LIST") {
      logAction(
        "Drag",
        dragItemType,
        dragItem.title,
        overItemType,
        overItem.name
      );
    } else if (dragItemType === "LIST" && overItemType === "LIST") {
      logAction(
        "Drag",
        dragItemType,
        dragItem.name,
        overItemType,
        overItem.name
      );
    } else if (dragItemType === "TASK" && overItemType === "TASK") {
      logAction(
        "Drag",
        dragItemType,
        dragItem.title,
        overItemType,
        overItem.title
      );
    } else if (dragItemType === "LIST" && overItemType === "TASK") {
      logAction(
        "Drag",
        dragItemType,
        dragItem.name,
        overItemType,
        overItem.title
      );
    }
  };

  const handleDragEnd = (evt: DragEndEvent) => {
    const dragItem = evt.active.data.current as DraggableItem;
    const overItem = evt.over?.data?.current as DraggableItem;
    const dragItemType = dragItem.type;
    const overItemType = overItem.type;

    if (!overItem) {
      return console.log(`${dragItem.type} dropped outside any valid target.`);
    }

    if (dragItemType === "TASK" && overItemType === "LIST") {
      logAction(
        "Drop",
        dragItemType,
        dragItem.title,
        overItemType,
        overItem.name
      );
    }

    if (dragItem.type === "LIST" && overItem.type === "LIST") {
      logAction(
        "Drop",
        dragItemType,
        dragItem.name,
        overItemType,
        overItem.name
      );
    }

    if (dragItem.type === "TASK" && overItem.type === "TASK") {
      logAction(
        "Drop",
        dragItemType,
        dragItem.title,
        overItemType,
        overItem.title
      );
    }

    setActiveList(null);
    setActiveTask(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      {lists.map((list) => (
        <ListCard
          key={list.id}
          {...list}
        />
      ))}

      <DragOverlay>
        {activeList && <ListCard {...activeList} />}
        {activeTask && <TaskCard {...activeTask} />}
      </DragOverlay>
    </DndContext>
  );
}

function logAction(
  action: string,
  activeType: string,
  activeName: string,
  overType?: string,
  overName?: string
) {
  let message = `[${action}]: ${activeType} "${activeName}"`;

  if (overType && overName) {
    message += ` → ${overType} "${overName}"`;
  }

  console.log(message);
}
