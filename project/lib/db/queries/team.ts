import { ProjectSchema } from "@/types/projects";
import db from "..";

const teamQueries = {
  getByProjectId: async (projectId: ProjectSchema["id"]) => {
    return await db.query.teams.findMany({
      where: (teams, { eq }) => eq(teams.projectId, projectId),
      with: { user: true }
    });
  }
};

export default teamQueries;
