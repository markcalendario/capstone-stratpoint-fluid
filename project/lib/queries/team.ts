import { ProjectSchema } from "@/types/projects";
import db from "../db";

const teamQueries = {
  getByProject: async (projectId: ProjectSchema["id"]) => {
    return await db.query.teams.findMany({
      where: (teams, { eq, and }) =>
        and(eq(teams.projectId, projectId), eq(teams.isAccepted, true)),
      with: { user: true }
    });
  }
};

export default teamQueries;
