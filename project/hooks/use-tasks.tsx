import { queryClient } from "@/components/ui/query-client-provider";
import {
  createAndAssignTask,
  deleteTask,
  editTask,
  getTaskEditData,
  getTaskSlug,
  moveTask,
  updateAttachment
} from "@/lib/actions/tasks";
import { ProjectSchema } from "@/types/projects";
import { TaskSchema } from "@/types/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateAndAssignTask() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createAndAssignTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndTasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return {
    createAndAssignTask: mutateAsync,
    isCreatingAndAssigningTask: isPending
  };
}

export function useMoveTask() {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: moveTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndTasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    }
  });

  return { moveTask: mutateAsync, isMovingTask: isPending };
}

export function useTaskSlug(id: TaskSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskSlug({ id })
  });

  return { isTaskSlugDataLoading: isPending, taskSlugData: data };
}

export function useTaskEditData(id: TaskSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["taskEditData", id],
    queryFn: () => getTaskEditData({ id })
  });

  return { isTaskEditDataLoading: isPending, editTaskData: data };
}

export function useEditTask(id: TaskSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      queryClient.invalidateQueries({ queryKey: ["taskEditData", id] });
      queryClient.invalidateQueries({ queryKey: ["listsAndTasks"] });
    }
  });

  return { isEditingTask: isPending, editTask: mutateAsync };
}

export function useDeleteTask(
  id: TaskSchema["id"],
  projectId: ProjectSchema["id"]
) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      queryClient.invalidateQueries({ queryKey: ["taskEditData", id] });
      queryClient.invalidateQueries({ queryKey: ["listsAndTasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  });

  return { isDeletingTask: isPending, deleteTask: mutateAsync };
}

export function useUpdateTaskAttachment(id: TaskSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    }
  });

  return { isUpdatingAttachment: isPending, updateAttachment: mutateAsync };
}
