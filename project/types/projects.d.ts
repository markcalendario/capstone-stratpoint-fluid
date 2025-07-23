import { projects } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { List } from "./lists";

export interface Project extends InferSelectModel<typeof projects> {
  lists: List[];
}
