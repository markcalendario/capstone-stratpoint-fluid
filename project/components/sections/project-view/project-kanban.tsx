import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import KanbanBoard from "@/components/ui/kanban/kanban-board";
import { ProjectSchema } from "@/types/projects";

interface ProjectKanbanBoardProps {
  projectId: ProjectSchema["id"];
}

export default function ProjectKanbanBoard({
  projectId
}: ProjectKanbanBoardProps) {
  return (
    <DashboardContent>
      <KanbanBoard projectId={projectId} />
    </DashboardContent>
  );
}
