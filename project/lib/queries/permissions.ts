import db from "../db";
import { permissions } from "../db/drizzle/migrations/schema";

const permissionsQueries = {
  getAll: async () => {
    return await db.select().from(permissions);
  }
};

export default permissionsQueries;
