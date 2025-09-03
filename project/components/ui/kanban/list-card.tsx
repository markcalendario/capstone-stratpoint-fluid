"use client";

import ListCardDropdown from "@/components/ui/dropdowns/list-card-dropdown";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { KanbanList } from "@/types/kanban";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CircleDashed,
  CircleDot,
  Grid2X2Check,
  GripHorizontal,
  TableProperties
} from "lucide-react";
import AddTaskButton from "../buttons/add-task-button";
import SectionEmpty from "../section-empty";
import { TaskCard } from "./task-card";

export default function ListCard({
  id,
  name,
  tasks,
  isFinal,
  projectId,
  tasksCount
}: KanbanList) {
  const { permissionsData } = usePermissions(projectId);

  const permissions = permissionsData?.permissions;
  const canDrag = permissions?.includes(PERMISSION.EDIT_LIST);
  const canCreateTask = permissions?.includes(PERMISSION.CREATE_TASK);

  const {
    transform,
    listeners,
    transition,
    attributes,
    setNodeRef,
    setActivatorNodeRef
  } = useSortable({
    id,
    data: { type: "LIST" as const }
  });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const isEmpty = !tasks.length;

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="flex max-h-[600px] min-h-[500px] max-w-75 min-w-75 flex-col gap-3 overflow-auto duration-100 md:max-w-95 md:min-w-95">
      <div className="bg-primary flex items-center justify-between rounded-t-xs px-4 py-3">
        <div className="flex items-center gap-3">
          <p className="flex items-center gap-2 font-bold text-neutral-100">
            {isFinal ? <CircleDot size={14} /> : <CircleDashed size={14} />}
            {name}
          </p>
          <p className="flex items-center gap-1 rounded-xs bg-neutral-100/10 p-1 text-xs text-neutral-300">
            <TableProperties size={12} />
            {tasksCount}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canDrag && (
            <button
              {...listeners}
              {...attributes}
              ref={setActivatorNodeRef}>
              <GripHorizontal
                size={16}
                className="cursor-move text-neutral-100"
              />
            </button>
          )}

          <ListCardDropdown
            id={id}
            projectId={projectId}
          />
        </div>
      </div>

      {isEmpty && (
        <SectionEmpty
          icon={Grid2X2Check}
          text="No Tasks"
        />
      )}

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}>
        {!isEmpty &&
          tasks.map((task) => (
            <TaskCard
              {...task}
              key={task.id}
              projectId={projectId}
            />
          ))}
      </SortableContext>

      {canCreateTask && (
        <AddTaskButton
          listId={id}
          projectId={projectId}
          className="border-primary/50 text-primary sticky bottom-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xs border-1 border-dashed bg-white p-3 text-sm font-medium backdrop-blur-md dark:bg-neutral-800 dark:text-neutral-200"
        />
      )}
    </div>
  );
}
