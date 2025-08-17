"use client";

import ListCardDropdown from "@/components/ui/dropdowns/list-card-dropdown";
import { useListTasks } from "@/hooks/use-tasks";
import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  useDroppable
} from "@dnd-kit/core";
import { ListTodo } from "lucide-react";
import { useState } from "react";
import AddTaskButton from "../buttons/add-task-button";
import SectionEmpty from "../section-empty";
import SectionLoader from "../section-loader";
import { TaskCard } from "./task-card";

interface ListCardProps {
  id: ListSchema["id"];
  name: ListSchema["name"];
  projectId: ProjectSchema["id"];
}

export default function ListCard({ id, name, projectId }: ListCardProps) {
  const { setNodeRef } = useDroppable({ id });
  const { isListTasksLoading, listTasksData } = useListTasks(id);
  const [activeId, setActiveId] = useState<number | string | null>(null);

  const loaded = !isListTasksLoading && listTasksData?.tasks;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div
        ref={setNodeRef}
        className="border-primary/20 max-h-[600px] min-h-[500px] min-w-100 overflow-auto rounded-sm border-3 bg-neutral-100 dark:bg-neutral-900">
        <div className="bg-primary px-3 py-2 dark:border-neutral-600">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-200">
              {name}
              <span className="ml-2 rounded-sm bg-white/20 px-2 py-1 text-xs">
                {loaded && listTasksData.tasks.length}
              </span>
            </h3>
            <ListCardDropdown id={id} />
          </div>
        </div>

        <div className="space-y-3 p-4">
          {!loaded && <SectionLoader text="Loading Tasks" />}

          {loaded && !listTasksData.tasks.length && (
            <SectionEmpty
              icon={ListTodo}
              text={`No Tasks for '${name}'.`}
            />
          )}

          {loaded &&
            listTasksData.tasks.map((task, i) => (
              <TaskCard
                key={i}
                id={task.id}
                title={task.title}
                dueDate={task.dueDate}
                priority={task.priority}
                description={task.description}
                assigneesImages={task.assigneesImages}
              />
            ))}

          <DragOverlay>
            {loaded && activeId && (
              <TaskCard
                {...listTasksData.tasks.find((task) => task.id === activeId)!}
              />
            )}
          </DragOverlay>

          <AddTaskButton
            listId={id}
            projectId={projectId}
            className="border-primary bg-primary/20 text-primary sticky bottom-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-1 border-dashed p-2 text-sm backdrop-blur-md dark:text-neutral-200"
          />
        </div>
      </div>
    </DndContext>
  );
}
