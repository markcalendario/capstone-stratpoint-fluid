import { showErrorToast, showSuccessToast } from "@/components/toast";
import { getProject } from "@/lib/actions/projects";
import { List } from "@/types/lists";
import { Project, ProjectSchema } from "@/types/projects";
import { Task } from "@/types/tasks";
import { TeamsSchema } from "@/types/teams";
import { useCallback, useEffect, useState } from "react";

interface ProjectState extends Omit<Project, "teams" | "lists"> {
  teams: TeamsSchema[];
  lists: Array<
    List & {
      tasks: Task[];
    }
  >;
}

export default function useProject(id: ProjectSchema["id"]) {
  const [project, setProject] = useState<ProjectState | null>(null);

  const retrieveProject = useCallback(async () => {
    const {
      success,
      message,
      project: retrievedProject
    } = await getProject(id);

    if (!success || !retrievedProject) return showErrorToast(message);
    showSuccessToast(message);

    setProject(retrievedProject);
  }, [id]);

  useEffect(() => {
    retrieveProject();
  }, [retrieveProject, id]);

  return project;
}
