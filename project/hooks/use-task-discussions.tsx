import { queryClient } from "@/components/ui/query-client-provider";
import {
  createTaskDiscussion,
  deleteTaskDiscussion,
  getTaskDiscussions,
  updateTaskDiscussion
} from "@/lib/actions/taskDiscussions";
import { TaskSchema } from "@/types/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useTaskDiscussions(taskId: TaskSchema["id"]) {
  const { isPending, data } = useQuery({
    queryKey: ["taskDiscussions", taskId],
    queryFn: () => getTaskDiscussions({ taskId })
  });

  return { isTaskDiscussionsLoading: isPending, taskDiscussionsData: data };
}

export function useCreateTaskDiscussion(taskId: TaskSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createTaskDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["taskDiscussions", taskId] });
    }
  });

  return {
    isCreatingTaskDiscussion: isPending,
    createTaskDiscussion: mutateAsync
  };
}

export function useUpdateTaskDiscussion(taskId: TaskSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateTaskDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["taskDiscussions", taskId] });
    }
  });

  return {
    isUpdatingTaskDiscussion: isPending,
    updateTaskDiscussion: mutateAsync
  };
}

export function useDeleteTaskDiscussion(taskId: TaskSchema["id"]) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: deleteTaskDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["taskDiscussions", taskId] });
    }
  });

  return {
    isDeletingTaskDiscussion: isPending,
    deleteTaskDiscussion: mutateAsync
  };
}
