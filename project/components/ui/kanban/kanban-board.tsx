"use client";

import { useListsWithTasks } from "@/hooks/use-lists";
import { useMoveTask } from "@/hooks/use-tasks";
import { moveList } from "@/lib/actions/lists";
import { formatDateTime } from "@/lib/utils/date-and-time";
import pusherClient, { EVENTS } from "@/lib/utils/pusher-client";
import { KanbanList } from "@/types/kanban";
import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import Badge from "../badge";
import CreateListButton from "../buttons/create-list-button";
import SectionLoader from "../section-loader";
import ListCard from "./list-card";
import { TaskCard } from "./task-card";

interface KanbanBoardProps {
  projectId: ProjectSchema["id"];
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [kanbanItems, setKanbanItems] = useState<KanbanList[] | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  const { isListsAndTasksLoading, listsAndTasksData } =
    useListsWithTasks(projectId);

  const updateUpdateTime = () => {
    const now = new Date().toISOString();
    setLastUpdateTime(formatDateTime(now));
  };

  const handleKanbanEvent = (kanbanItems: KanbanList[]) => {
    setKanbanItems(kanbanItems);
    updateUpdateTime();
  };

  useEffect(() => {
    updateUpdateTime();

    const channel = pusherClient.subscribe(projectId);
    channel.bind(EVENTS.KANBAN, handleKanbanEvent);

    return () => {
      channel.unbind(EVENTS.KANBAN, handleKanbanEvent);
      pusherClient.unsubscribe(projectId);
    };
  }, [projectId]);

  useEffect(() => {
    if (!listsAndTasksData?.listsAndTasks) return;
    setKanbanItems(listsAndTasksData.listsAndTasks);
  }, [listsAndTasksData]);

  const isLoaded = !isListsAndTasksLoading && kanbanItems;

  return (
    <div className="w-full">
      {!isLoaded && <SectionLoader text="Fetching Kanban Columns" />}
      {isLoaded && (
        <div className="flex flex-col gap-2">
          <div>
            <Badge type="info">Last Update: {lastUpdateTime}</Badge>
          </div>

          <div className="flex min-w-full flex-nowrap items-stretch space-x-5 overflow-x-auto pb-4">
            <KanbanItems
              projectId={projectId}
              lists={kanbanItems}
            />

            <CreateListButton
              projectId={projectId}
              className="border-primary/20 text-primary hover:bg-primary/5 flex min-h-[500px] min-w-90 cursor-pointer flex-nowrap items-center justify-center gap-2 rounded-sm border-2 border-dashed bg-neutral-50 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface KanbanItemsProps {
  lists: KanbanList[];
  projectId: ProjectSchema["id"];
}

interface DraggableList {
  type: "LIST";
}

interface DraggableTask {
  type: "TASK";
  listId: ListSchema["id"];
}

type DraggableItem = DraggableList | DraggableTask;

function KanbanItems({ projectId, lists }: KanbanItemsProps) {
  const [listsData, setListsData] = useState(lists);

  const { moveTask } = useMoveTask();

  const [activeListId, setActiveListId] = useState<UniqueIdentifier | null>(
    null
  );
  const [activeTaskId, setActiveTaskId] = useState<UniqueIdentifier | null>(
    null
  );

  const handleDragStart = (evt: DragStartEvent) => {
    const draggableItem = evt.active.data.current as DraggableItem;
    const itemType = draggableItem.type;

    if (itemType === "TASK") {
      setActiveTaskId(evt.active.id);
    } else if (itemType === "LIST") {
      setActiveListId(evt.active.id);
    }
  };

  const handleDragOver = (evt: DragOverEvent) => {
    const dragId = evt.active.id;
    const overId = evt.over?.id;
    const dragItem = evt.active.data.current as DraggableItem;
    const overItem = evt.over?.data.current as DraggableItem;

    if (!dragItem || !overItem || !overId) return;

    const dragType = dragItem.type;
    const overType = overItem.type;

    // Task -> List
    if (dragType === "TASK" && overType === "LIST") {
      setListsData((prev) => {
        // Get the list of source and target
        const targetList = prev.find((list) => list.id === overId);
        const sourceList = prev.find((list) =>
          list.tasks.some((task) => task.id === dragId)
        );

        if (!sourceList || !targetList) return prev;

        const sourceListId = sourceList.id;
        const targetListId = overId;

        // Skip if already in same list
        if (sourceListId === targetListId) return prev;

        // Get the tasks of the source and target lists
        const sourceTasks = sourceList.tasks;
        const targetTasks = targetList.tasks;

        // Get the source task
        const sourceTask = sourceTasks.find((task) => task.id === dragId);
        if (!sourceTask) return prev;

        // Remove the source task
        const filteredSourceTasks = sourceTasks.filter(
          (task) => task.id !== dragId
        );

        // Append to the target tasks
        const newTargetTasks = [...targetTasks, sourceTask];

        return prev.map((list) => {
          if (list.id === targetListId) {
            return {
              ...list,
              tasks: newTargetTasks
            };
          }

          if (list.id === sourceListId) {
            return {
              ...list,
              tasks: filteredSourceTasks
            };
          }

          return list;
        });
      });
    }

    // Task -> Task
    else if (dragType === "TASK" && overType === "TASK") {
      setListsData((prev) => {
        const sourceList = prev.find((list) =>
          list.tasks.some((task) => task.id === dragId)
        );
        const targetList = prev.find((list) =>
          list.tasks.some((task) => task.id === overId)
        );

        if (!sourceList || !targetList) return prev;

        const sourceTask = sourceList.tasks.find((task) => task.id === dragId);
        if (!sourceTask) return prev;

        const isSameList = sourceList.id === targetList.id;

        const overIndex = targetList.tasks.findIndex(
          (task) => task.id === overId
        );
        if (overIndex === -1) return prev;

        const updatedSourceTasks = sourceList.tasks.filter(
          (task) => task.id !== dragId
        );

        let updatedTargetTasks = [...targetList.tasks];
        if (isSameList) {
          updatedTargetTasks = updatedSourceTasks;
        }

        updatedTargetTasks.splice(overIndex, 0, sourceTask);

        return prev.map((list) => {
          if (list.id === sourceList.id) {
            return {
              ...list,
              tasks: isSameList ? updatedTargetTasks : updatedSourceTasks
            };
          }

          if (list.id === targetList.id && !isSameList) {
            return {
              ...list,
              tasks: updatedTargetTasks
            };
          }

          return list;
        });
      });
    }

    // List -> List
    else if (dragType === "LIST" && overType === "LIST") {
      setListsData((prev) => {
        const dragIndex = prev.findIndex((list) => list.id === dragId);
        const overIndex = prev.findIndex((list) => list.id === overId);

        if (dragIndex === -1 || overIndex === -1 || dragIndex === overIndex) {
          return prev;
        }

        const updated = [...prev];
        const [draggedList] = updated.splice(dragIndex, 1);
        updated.splice(overIndex, 0, draggedList);

        return updated;
      });
    }
  };

  const handleDragEnd = async (evt: DragEndEvent) => {
    setActiveListId(null);
    setActiveTaskId(null);

    const itemId = evt.active.id;
    const item = evt.active.data.current as DraggableItem;
    const itemType = item.type;

    // Moving Task Mutation
    if (itemType === "TASK") {
      // Find the list where the task was dropped
      const list = listsData.find((list) =>
        list.tasks.some((task) => task.id === itemId)
      );

      const newListId = list?.id;
      const taskId = itemId as TaskSchema["id"];
      const newPosition = list?.tasks.findIndex((task) => task.id === itemId);

      if (!newListId || newPosition === undefined || !taskId) return;

      await moveTask({ newListId, newPosition, taskId });
    }

    // Moving List Mutation
    else if (itemType === "LIST") {
      const listId = itemId as ListSchema["id"];
      const listIds = listsData.map((list) => list.id);
      const newPosition = listIds.findIndex((listId) => listId === itemId);

      await moveList({ listId, newPosition, projectId });
    }
  };

  useEffect(() => {
    setListsData(lists);
  }, [lists]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <SortableContext
        items={listsData.map((list) => list.id)}
        strategy={horizontalListSortingStrategy}>
        {listsData.map((list) => (
          <ListCard
            key={list.id}
            {...list}
          />
        ))}
      </SortableContext>

      <DragOverlay>
        {activeListId &&
          (() => {
            const list = listsData.find((list) => list.id === activeListId);
            return list ? <ListCard {...list} /> : null;
          })()}

        {activeTaskId &&
          (() => {
            const task = listsData
              .flatMap((list) => list.tasks)
              .find((task) => task.id === activeTaskId);
            return task ? <TaskCard {...task} /> : null;
          })()}
      </DragOverlay>
    </DndContext>
  );
}
