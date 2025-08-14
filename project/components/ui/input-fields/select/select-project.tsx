import useDebounce from "@/hooks/use-debounce";
import { useProjectOptions } from "@/hooks/use-projects";
import {
  ProjectOption as IProjectOption,
  ProjectSchema
} from "@/types/projects";
import { Box, Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";
import SectionLoader from "../../section-loader";
import Input from "../input";

interface SelectProjectProps {
  onChange: (projectId: ProjectSchema["id"] | null) => void;
  preSelectedId?: ProjectSchema["id"] | null;
}

export default function SelectProject({
  onChange,
  preSelectedId
}: SelectProjectProps) {
  const [projectName, setProjectName] = useState("");
  const debounce = useDebounce(projectName, 300);

  const [projects, setProjects] = useState<IProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProjectOption | null>(
    null
  );

  const { isProjectOptionsLoading, projectOptions, refetchProjectOptions } =
    useProjectOptions(projectName);

  // Handle selection/deselection
  const handleSelectProject = (project: IProjectOption) => {
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    setSelectedProject(project);
  };

  const handleDeselectProject = () => {
    if (!selectedProject) return;
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === selectedProject.id);
      return exists ? prev : [...prev, selectedProject];
    });
    setSelectedProject(null);
  };

  // Load options into UI
  useEffect(() => {
    if (!projectOptions?.projects) return;
    const projects = projectOptions.projects;

    // When projectId is pre-selected, show it to selected
    if (preSelectedId) {
      const project = projects.find((project) => project.id === preSelectedId);
      setSelectedProject(project ?? null);
    }

    setProjects(projects);
  }, [projectOptions, preSelectedId]);

  // Notify parent
  useEffect(() => {
    if (!selectedProject) return onChange(null);
    onChange(selectedProject.id);
  }, [selectedProject]);

  // Refetch on debounce
  useEffect(() => {
    refetchProjectOptions();
  }, [debounce]);

  return (
    <div className="grid gap-1">
      {!selectedProject && (
        <Input
          id="project"
          label="Select Project"
          placeholder="Enter project name"
          onChange={(evt) => setProjectName(evt.target.value)}
          required
        />
      )}

      {selectedProject && (
        <ProjectOption
          {...selectedProject}
          deselectProject={handleDeselectProject}
        />
      )}

      {isProjectOptionsLoading && <SectionLoader text="Loading Projects" />}

      {!selectedProject && (
        <div className="grid max-h-[200px] gap-1 overflow-auto">
          {projects.map((project) => (
            <ProjectOption
              key={project.id}
              {...project}
              selectProject={handleSelectProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProjectOptionProps extends IProjectOption {
  selectProject?: (project: IProjectOption) => void;
  deselectProject?: () => void;
}

function ProjectOption({
  id,
  name,
  selectProject,
  deselectProject
}: ProjectOptionProps) {
  return (
    <div className="flex items-center justify-between rounded-sm bg-neutral-100 p-4 dark:bg-neutral-900">
      <div className="flex flex-wrap items-center gap-3">
        <Box className="text-neutral-700 dark:text-neutral-300" />
        <div className="grid gap-1">
          <p className="leading-[15px] text-neutral-700 dark:text-neutral-300">
            {name}
          </p>
          <p className="text-xs leading-[10px] text-neutral-700 dark:text-neutral-300">
            {id}
          </p>
        </div>
      </div>

      {selectProject && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => selectProject({ id, name })}>
          <Maximize className="text-neutral-700 dark:text-neutral-300" />
        </button>
      )}

      {deselectProject && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={deselectProject}>
          <Minimize className="text-neutral-700 dark:text-neutral-300" />
        </button>
      )}
    </div>
  );
}
