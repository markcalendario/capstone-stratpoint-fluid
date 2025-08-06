import { ListSchema } from "@/types/lists";
import { TaskCard as TTaskCard } from "@/types/tasks";
import { MoreHorizontal, Plus } from "lucide-react";
import Button from "./button";
import { TaskCard } from "./task-card";

interface ListCardProps {
  id: ListSchema["id"];
  title: ListSchema["id"];
  tasks: TTaskCard[];
}

export default function ListCard({ title, tasks }: ListCardProps) {
  return (
    <div className="border-primary/20 min-w-80 overflow-hidden rounded-sm border-3 bg-neutral-100 dark:bg-neutral-700">
      <div className="bg-primary px-3 py-2 dark:border-neutral-600">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-200">
            {title}
            <span className="ml-2 rounded-sm bg-white/20 px-2 py-1 text-xs">
              {tasks.length}
            </span>
          </h3>
          <button className="rounded p-1">
            <MoreHorizontal
              className="text-neutral-200"
              size={16}
            />
          </button>
        </div>
      </div>

      <div className="min-h-[400px] space-y-3 p-4">
        {tasks.map((task, i) => (
          <TaskCard
            key={i}
            {...task}
          />
        ))}

        <Button className="border-primary bg-primary/10 text-primary w-full border-1 border-dashed dark:text-neutral-200">
          <Plus size={16} /> Add Task
        </Button>
      </div>
    </div>
  );
}
