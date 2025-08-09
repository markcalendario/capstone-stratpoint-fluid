import { getTasksByListId } from "@/lib/actions/tasks";
import { ListSchema } from "@/types/lists";
import { ProjectSchema } from "@/types/projects";
import AddTaskButton from "./add-task-button";
import ListCardDropdown from "./list-card-dropdown";
import { TaskCard } from "./task-card";

interface ListCardProps {
  id: ListSchema["id"];
  name: ListSchema["name"];
  projectId: ProjectSchema["id"];
}

export default async function ListCard({ id, name, projectId }: ListCardProps) {
  const { tasks } = await getTasksByListId({ listId: id });

  if (!tasks) return null;

  return (
    <div className="border-primary/20 relative max-h-[600px] min-h-[500px] min-w-90 overflow-auto rounded-sm border-3 bg-neutral-100 dark:bg-neutral-900">
      <div className="bg-primary sticky top-0 px-3 py-2 dark:border-neutral-600">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-200">
            {name}
            <span className="ml-2 rounded-sm bg-white/20 px-2 py-1 text-xs">
              {tasks.length}
            </span>
          </h3>
          <ListCardDropdown id={id} />
        </div>
      </div>

      <div className="space-y-3 p-4">
        {tasks.map((task, i) => (
          <TaskCard
            key={i}
            {...task}
          />
        ))}

        <AddTaskButton
          listId={id}
          projectId={projectId}
          className="border-primary bg-primary/20 text-primary sticky bottom-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-1 border-dashed p-1 text-sm backdrop-blur-md dark:text-neutral-200"
        />
      </div>
    </div>
  );
}
