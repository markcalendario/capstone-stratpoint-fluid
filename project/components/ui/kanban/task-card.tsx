// TODO: Task 5.6 - Create task detail modals and editing interfaces

import { usePermissions } from "@/hooks/use-permissions";
import { priorityColors } from "@/lib/utils/constants";
import { toTitleCase } from "@/lib/utils/formatters";
import { PERMISSION } from "@/lib/utils/permission-enum";
import { cn } from "@/lib/utils/tailwind";
import { KanbanTask } from "@/types/kanban";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Link from "next/link";
import Badge from "../badge";
import UserImagesStack from "../user-images-stack";

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
  label,
  isDone,
  listId,
  priority,
  projectId,
  isOverdue,
  description,
  remainingDays,
  assigneesImages
}: KanbanTask) {
  const { permissionsData } = usePermissions(projectId);

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

  const permissions = permissionsData?.permissions;
  const canDrag = permissions?.includes(PERMISSION.EDIT_TASK);

  return (
    <Link
      style={style}
      ref={setNodeRef}
      href={`/tasks/${id}`}
      className={cn(
        isDragging && "opacity-70",
        "ring-primary/20 relative block rounded-xs bg-white p-4 ring-1 duration-500 ring-inset dark:bg-neutral-800"
      )}>
      {canDrag && (
        <button
          {...listeners}
          {...attributes}
          ref={setActivatorNodeRef}
          className="absolute top-0 right-0 m-2 cursor-move p-1 text-neutral-500">
          <GripVertical size={16} />
        </button>
      )}

      <h4 className="line-clamp-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
        {title}
      </h4>
      <p className="line-clamp-1 text-xs text-neutral-500 dark:text-neutral-300">
        {description}
      </p>
      <div className="mt-2 flex justify-between gap-2">
        <div className="flex items-stretch gap-1">
          <Badge type={priorityColors[priority]}>{toTitleCase(priority)}</Badge>

          {!isDone && (
            <Badge type={isOverdue ? "error" : "warning"}>
              {remainingDays}
            </Badge>
          )}

          {isDone && <Badge type="success">Done</Badge>}

          {label && <Badge type="gray">{label}</Badge>}
        </div>
        <UserImagesStack
          images={assigneesImages}
          show={7}
        />
      </div>
    </Link>
  );
}
