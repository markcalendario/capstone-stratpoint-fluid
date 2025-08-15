import db from "../db";
import { teamRoles } from "../db/drizzle/migrations/schema";

const teamRolesQueries = {
  getAll: async () => {
    return await db.select().from(teamRoles);
  }
};

export default teamRolesQueries;
