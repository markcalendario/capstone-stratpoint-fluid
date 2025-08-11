import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { getProject } from "@/lib/actions/projects";
import { Project, ProjectSchema } from "@/types/projects";
import { useCallback, useEffect, useState } from "react";

type UseProjectReturn = [Project | null, () => void];

export default function useProject(id: ProjectSchema["id"]): UseProjectReturn {
  const [project, setProject] = useState<Project | null>(null);

  const retrieveProject = useCallback(async () => {
    const {
      success,
      message,
      project: retrievedProject
    } = await getProject({ id });

    if (!success || !retrievedProject) return showErrorToast(message);
    showSuccessToast(message);

    setProject(retrievedProject);
  }, [id]);

  useEffect(() => {
    retrieveProject();
  }, [retrieveProject, id]);

  return [project, retrieveProject];
}
