// TODO: Task 5.6 - Create task detail modals and editing interfaces

import { cn } from "@/lib/utils";
import { KanbanTask } from "@/types/kanban";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Image from "next/image";
import PriorityTab from "../priority-tab";

/*
TODO: Implementation Notes for Interns:

This component should display:
- Task title and description
- Priority indicator
- Assignee avatar
- Due date
- Labels/tags
- Comments count
- Drag handle for reordering

Props interface:
interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    assignee?: User
    dueDate?: Date
    labels: string[]
    commentsCount: number
  }
  isDragging?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

Features to implement:
- Drag and drop support
- Click to open task modal
- Priority color coding
- Overdue indicators
- Responsive design
*/

export function TaskCard({
  id,
  title,
  listId,
  description,
  priority,
  taskAssignments
}: KanbanTask) {
  const {
    isDragging,
    transform,
    transition,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef
  } = useSortable({
    id,
    data: { type: "TASK" as const, listId }
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={cn(
        isDragging && "opacity-70",
        "border-primary/20 relative rounded-xs border-2 bg-white p-4 shadow-sm duration-500 hover:shadow-md dark:bg-neutral-800"
      )}>
      <button
        {...listeners}
        {...attributes}
        ref={setActivatorNodeRef}
        className="absolute top-0 right-0 m-1 cursor-move p-1 text-neutral-500">
        <GripVertical size={16} />
      </button>
      <h4 className="mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
        {title}
      </h4>
      <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-300">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <PriorityTab priority={priority} />

        <div className="flex gap-1">
          {taskAssignments.map((taskAssignment, i) => (
            <Image
              key={i}
              width={20}
              height={20}
              alt={`user ${i}`}
              src={taskAssignment.user.imageUrl}
              className="outline-primary/20 rounded-full outline-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
