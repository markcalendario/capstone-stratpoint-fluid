"use client";

import { useListsWithTasks } from "@/hooks/use-lists";
import { formatDateTime } from "@/lib/utils/date-and-time";
import pusherClient, { EVENTS } from "@/lib/utils/pusher-client";
import { useKanbanStore } from "@/stores/kanban-store";
import { KanbanList } from "@/types/kanban";
import { ProjectSchema } from "@/types/projects";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
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
              className="border-primary/20 text-primary hover:bg-primary/5 flex min-h-[500px] min-w-90 cursor-pointer flex-nowrap items-center justify-center gap-2 rounded-xs border-1 border-dashed bg-neutral-50 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
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

function KanbanItems({ projectId, lists }: KanbanItemsProps) {
  const {
    listsData,
    activeListId,
    activeTaskId,
    setLists,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useKanbanStore();

  useEffect(() => {
    setLists(lists);
  }, [lists, setLists]);

  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={(evt) => handleDragEnd(evt, projectId)}>
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
