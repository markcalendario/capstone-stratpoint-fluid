import db from "../db";
import { roles } from "../db/drizzle/migrations/schema";

const rolesQueries = {
  getAll: async () => {
    return await db.select().from(roles);
  }
};

export default rolesQueries;
