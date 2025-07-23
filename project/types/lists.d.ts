import { lists } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { Task } from "./tasks";

export interface List extends InferSelectModel<typeof lists> {
  tasks: Task[];
}
