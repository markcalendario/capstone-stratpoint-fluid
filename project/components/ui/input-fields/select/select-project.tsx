import useDebounce from "@/hooks/use-debounce";
import { useProjectOptions } from "@/hooks/use-projects";
import {
  ProjectOption as IProjectOption,
  ProjectSchema
} from "@/types/projects";
import { useEffect, useState } from "react";
import SectionLoader from "../../section-loader";
import Input from "../input";
import ProjectOption from "./options/project-option";

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
  }, [selectedProject, onChange]);

  // Refetch on debounce
  useEffect(() => {
    refetchProjectOptions();
  }, [debounce, refetchProjectOptions]);

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
