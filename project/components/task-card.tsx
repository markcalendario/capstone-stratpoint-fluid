// TODO: Task 5.6 - Create task detail modals and editing interfaces

import { TaskCard as TTaskCard } from "@/types/tasks";
import Image from "next/image";
import PriorityTab from "./priority-tab";

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
  description,
  priority,
  assigneeName,
  assigneeImageUrl
}: TTaskCard) {
  void id;

  return (
    <div className="outline-primary/20 cursor-pointer rounded-xs bg-white p-4 shadow-sm outline-2 hover:shadow-md dark:bg-neutral-600">
      <h4 className="mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
        {title}
      </h4>
      <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-300">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <PriorityTab priority={priority} />
        <Image
          width={25}
          height={25}
          alt={assigneeName}
          src={assigneeImageUrl}
          className="outline-primary/20 rounded-full outline-2"
        />
      </div>
    </div>
  );
}
