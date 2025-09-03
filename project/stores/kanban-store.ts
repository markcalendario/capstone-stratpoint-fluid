"use client";

import { moveList } from "@/lib/actions/lists";
import { moveTask } from "@/lib/actions/tasks";
import { KanbanList } from "@/types/kanban";
import { ListSchema } from "@/types/lists";
import { TaskSchema } from "@/types/tasks";
import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";

interface DraggableList {
  type: "LIST";
}

interface DraggableTask {
  type: "TASK";
  listId: ListSchema["id"];
}

type DraggableItem = DraggableList | DraggableTask;

interface KanbanState {
  listsData: KanbanList[];
  activeListId: UniqueIdentifier | null;
  activeTaskId: UniqueIdentifier | null;

  setLists: (lists: KanbanList[]) => void;
  setActiveListId: (id: UniqueIdentifier | null) => void;
  setActiveTaskId: (id: UniqueIdentifier | null) => void;

  handleDragStart: (evt: any) => void;
  handleDragOver: (evt: any) => void;
  handleDragEnd: (evt: any, projectId: string) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  listsData: [],
  activeListId: null,
  activeTaskId: null,

  setLists: (lists) => set({ listsData: lists }),
  setActiveListId: (id) => set({ activeListId: id }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),

  handleDragStart: (evt) => {
    const draggableItem = evt.active.data.current as DraggableItem;
    const itemType = draggableItem.type;

    if (itemType === "TASK") {
      set({ activeTaskId: evt.active.id });
    } else if (itemType === "LIST") {
      set({ activeListId: evt.active.id });
    }
  },

  handleDragOver: (evt) => {
    const dragId = evt.active.id;
    const overId = evt.over?.id;
    const dragItem = evt.active.data.current as DraggableItem;
    const overItem = evt.over?.data.current as DraggableItem;

    if (!dragItem || !overItem || !overId) return;

    const dragType = dragItem.type;
    const overType = overItem.type;

    set((state) => {
      let lists = state.listsData;

      // Task -> List
      if (dragType === "TASK" && overType === "LIST") {
        const targetList = lists.find((list) => list.id === overId);
        const sourceList = lists.find((list) =>
          list.tasks.some((task) => task.id === dragId)
        );

        if (!sourceList || !targetList) return state;
        if (sourceList.id === targetList.id) return state;

        const sourceTask = sourceList.tasks.find((task) => task.id === dragId);
        if (!sourceTask) return state;

        const filteredSourceTasks = sourceList.tasks.filter(
          (task) => task.id !== dragId
        );
        const newTargetTasks = [...targetList.tasks, sourceTask];

        lists = lists.map((list) => {
          if (list.id === targetList.id) {
            return { ...list, tasks: newTargetTasks };
          }
          if (list.id === sourceList.id) {
            return { ...list, tasks: filteredSourceTasks };
          }
          return list;
        });

        return { listsData: lists };
      }

      // Task -> Task
      if (dragType === "TASK" && overType === "TASK") {
        const sourceList = lists.find((list) =>
          list.tasks.some((task) => task.id === dragId)
        );
        const targetList = lists.find((list) =>
          list.tasks.some((task) => task.id === overId)
        );

        if (!sourceList || !targetList) return state;

        const sourceTask = sourceList.tasks.find((task) => task.id === dragId);
        if (!sourceTask) return state;

        const isSameList = sourceList.id === targetList.id;
        const overIndex = targetList.tasks.findIndex(
          (task) => task.id === overId
        );
        if (overIndex === -1) return state;

        const updatedSourceTasks = sourceList.tasks.filter(
          (task) => task.id !== dragId
        );

        let updatedTargetTasks = [...targetList.tasks];
        if (isSameList) {
          updatedTargetTasks = updatedSourceTasks;
        }
        updatedTargetTasks.splice(overIndex, 0, sourceTask);

        lists = lists.map((list) => {
          if (list.id === sourceList.id) {
            return {
              ...list,
              tasks: isSameList ? updatedTargetTasks : updatedSourceTasks
            };
          }
          if (list.id === targetList.id && !isSameList) {
            return { ...list, tasks: updatedTargetTasks };
          }
          return list;
        });

        return { listsData: lists };
      }

      // List -> List
      if (dragType === "LIST" && overType === "LIST") {
        const dragIndex = lists.findIndex((list) => list.id === dragId);
        const overIndex = lists.findIndex((list) => list.id === overId);

        if (dragIndex === -1 || overIndex === -1 || dragIndex === overIndex) {
          return state;
        }

        const updated = [...lists];
        const [draggedList] = updated.splice(dragIndex, 1);
        updated.splice(overIndex, 0, draggedList);

        return { listsData: updated };
      }

      return state;
    });
  },

  handleDragEnd: async (evt, projectId) => {
    const { listsData } = get();
    set({ activeListId: null, activeTaskId: null });

    const itemId = evt.active.id;
    const item = evt.active.data.current as DraggableItem;
    const itemType = item.type;

    if (itemType === "TASK") {
      const list = listsData.find((list) =>
        list.tasks.some((task) => task.id === itemId)
      );

      const newListId = list?.id;
      const taskId = itemId as TaskSchema["id"];
      const newPosition = list?.tasks.findIndex((task) => task.id === itemId);

      if (!newListId || newPosition === undefined) return;
      await moveTask({ newListId, newPosition, taskId });
    } else if (itemType === "LIST") {
      const listId = itemId as ListSchema["id"];
      const listIds = listsData.map((list) => list.id);
      const newPosition = listIds.findIndex((l) => l === itemId);

      await moveList({ listId, newPosition, projectId });
    }
  }
}));
